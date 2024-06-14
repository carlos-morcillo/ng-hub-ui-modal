import { DOCUMENT } from '@angular/common';
import {
	ApplicationRef,
	ComponentRef,
	createComponent,
	EnvironmentInjector,
	EventEmitter,
	inject,
	Injectable,
	Injector,
	NgZone,
	TemplateRef,
	Type
} from '@angular/core';
import {
	ContentRef,
	hubFocusTrap,
	isDefined,
	isString,
	ScrollBar
} from 'ng-hub-ui-utils';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { HubModalBackdrop } from './modal-backdrop';
import { HubModalOptions, HubModalUpdatableOptions } from './modal-config';
import { HubActiveModal, HubModalRef } from './modal-ref';
import { HubModalWindow } from './modal-window';

@Injectable({ providedIn: 'root' })
export class HubModalStack {
	private _applicationRef = inject(ApplicationRef);
	private _injector = inject(Injector);
	private _environmentInjector = inject(EnvironmentInjector);
	private _document = inject(DOCUMENT);
	private _scrollBar = inject(ScrollBar);

	private _activeWindowCmptHasChanged = new Subject<void>();
	private _ariaHiddenValues: Map<Element, string | null> = new Map();
	private _scrollBarRestoreFn: null | (() => void) = null;
	private _modalRefs: HubModalRef[] = [];
	private _windowCmpts: ComponentRef<HubModalWindow>[] = [];
	private _activeInstances: EventEmitter<HubModalRef[]> = new EventEmitter();

	constructor() {
		const ngZone = inject(NgZone);

		// Trap focus on active WindowCmpt
		this._activeWindowCmptHasChanged.subscribe(() => {
			if (this._windowCmpts.length) {
				const activeWindowCmpt =
					this._windowCmpts[this._windowCmpts.length - 1];
				hubFocusTrap(
					ngZone,
					activeWindowCmpt.location.nativeElement,
					this._activeWindowCmptHasChanged
				);
				this._revertAriaHidden();
				this._setAriaHidden(activeWindowCmpt.location.nativeElement);
			}
		});
	}

	private _restoreScrollBar() {
		const scrollBarRestoreFn = this._scrollBarRestoreFn;
		if (scrollBarRestoreFn) {
			this._scrollBarRestoreFn = null;
			scrollBarRestoreFn();
		}
	}

	private _hideScrollBar() {
		if (!this._scrollBarRestoreFn) {
			this._scrollBarRestoreFn = this._scrollBar.hide();
		}
	}

	open(
		contentInjector: Injector,
		content: any,
		options: HubModalOptions
	): HubModalRef {
		const containerEl =
			options.container instanceof HTMLElement
				? options.container
				: isDefined(options.container)
				? this._document.querySelector(options.container!)
				: this._document.body;

		if (!containerEl) {
			throw new Error(
				`The specified modal container "${
					options.container || 'body'
				}" was not found in the DOM.`
			);
		}

		this._hideScrollBar();

		const activeModal = new HubActiveModal();

		contentInjector = options.injector || contentInjector;
		const environmentInjector =
			contentInjector.get(EnvironmentInjector, null) ||
			this._environmentInjector;
		const contentRef = this._getContentRef(
			contentInjector,
			environmentInjector,
			content,
			activeModal,
			options
		);

		const backdropCmptRef: ComponentRef<HubModalBackdrop> | undefined =
			options.backdrop !== false
				? this._attachBackdrop(containerEl)
				: undefined;
		const windowCmptRef: ComponentRef<HubModalWindow> =
			this._attachWindowComponent(containerEl, contentRef.nodes, options);
		const hubModalRef: HubModalRef = new HubModalRef(
			windowCmptRef,
			contentRef,
			backdropCmptRef,
			options.beforeDismiss
		);

		this._registerModalRef(hubModalRef);
		this._registerWindowCmpt(windowCmptRef);

		// We have to cleanup DOM after the last modal when BOTH 'hidden' was emitted and 'result' promise was resolved:
		// - with animations OFF, 'hidden' emits synchronously, then 'result' is resolved asynchronously
		// - with animations ON, 'result' is resolved asynchronously, then 'hidden' emits asynchronously
		hubModalRef.hidden.pipe(take(1)).subscribe(() =>
			Promise.resolve(true).then(() => {
				if (!this._modalRefs.length) {
					this._document.body.classList.remove('modal-open');
					this._restoreScrollBar();
					this._revertAriaHidden();
				}
			})
		);

		activeModal.close = (result: any) => {
			hubModalRef.close(result);
		};
		activeModal.dismiss = (reason: any) => {
			hubModalRef.dismiss(reason);
		};

		activeModal.update = (options: HubModalUpdatableOptions) => {
			hubModalRef.update(options);
		};

		hubModalRef.update(options);
		if (this._modalRefs.length === 1) {
			this._document.body.classList.add('modal-open');
		}

		if (backdropCmptRef && backdropCmptRef.instance) {
			backdropCmptRef.changeDetectorRef.detectChanges();
		}
		windowCmptRef.changeDetectorRef.detectChanges();
		return hubModalRef;
	}

	get activeInstances() {
		return this._activeInstances;
	}

	dismissAll(reason?: any) {
		this._modalRefs.forEach((hubModalRef) => hubModalRef.dismiss(reason));
	}

	hasOpenModals(): boolean {
		return this._modalRefs.length > 0;
	}

	private _attachBackdrop(
		containerEl: Element
	): ComponentRef<HubModalBackdrop> {
		let backdropCmptRef = createComponent(HubModalBackdrop, {
			environmentInjector: this._applicationRef.injector,
			elementInjector: this._injector
		});
		this._applicationRef.attachView(backdropCmptRef.hostView);
		containerEl.appendChild(backdropCmptRef.location.nativeElement);
		return backdropCmptRef;
	}

	private _attachWindowComponent(
		containerEl: Element,
		[headerNodes, bodyNodes, footerNodes]: Node[][],
		options: HubModalOptions
	): ComponentRef<HubModalWindow> {
		const singleContent =
			!options.headerSelector && !options.footerSelector;
		let windowCmptRef = createComponent(HubModalWindow, {
			environmentInjector: this._applicationRef.injector,
			elementInjector: this._injector,
			projectableNodes: singleContent
				? [bodyNodes]
				: [[], headerNodes, bodyNodes, footerNodes]
		});

		Object.assign(windowCmptRef.instance, { singleContent });

		this._applicationRef.attachView(windowCmptRef.hostView);
		containerEl.appendChild(windowCmptRef.location.nativeElement);
		return windowCmptRef;
	}

	private _getContentRef(
		contentInjector: Injector,
		environmentInjector: EnvironmentInjector,
		content: Type<any> | TemplateRef<any> | string,
		activeModal: HubActiveModal,
		options: HubModalOptions
	): ContentRef {
		if (!content) {
			return new ContentRef([]);
		} else if (content instanceof TemplateRef) {
			return this._createFromTemplateRef(content, activeModal, options);
		} else if (isString(content)) {
			return this._createFromString(content);
		} else {
			return this._createFromComponent(
				contentInjector,
				environmentInjector,
				content,
				activeModal,
				options
			);
		}
	}

	private _createFromTemplateRef(
		templateRef: TemplateRef<any>,
		activeModal: HubActiveModal,
		options: HubModalOptions
	): ContentRef {
		const context = {
			$implicit: activeModal,
			close(result) {
				activeModal.close(result);
			},
			dismiss(reason) {
				activeModal.dismiss(reason);
			}
		};
		const viewRef = templateRef.createEmbeddedView(context);
		this._applicationRef.attachView(viewRef);

		const containerNode = document.createElement('ng-container');
		containerNode.append(...viewRef.rootNodes);

		this._addDismissEventListener(containerNode, context as any, options);
		this._addCloseEventListener(containerNode, context as any, options);

		return new ContentRef(
			[
				options.headerSelector
					? extractAndRemoveNodesBySelector(
							containerNode,
							options.headerSelector
					  )
					: [],
				containerNode.childNodes as any,
				options.footerSelector
					? extractAndRemoveNodesBySelector(
							containerNode,
							options.footerSelector
					  )
					: []
			],
			viewRef
		);
	}

	private _createFromString(content: string): ContentRef {
		const component = this._document.createTextNode(`${content}`);
		return new ContentRef([[component]]);
	}

	private _createFromComponent(
		contentInjector: Injector,
		environmentInjector: EnvironmentInjector,
		componentType: Type<any>,
		context: HubActiveModal,
		options: HubModalOptions
	): ContentRef {
		const elementInjector = Injector.create({
			providers: [{ provide: HubActiveModal, useValue: context }],
			parent: contentInjector
		});
		const componentRef = createComponent(componentType, {
			environmentInjector,
			elementInjector
		});

		if (options.data) {
			Object.assign(componentRef.instance, {
				data: options.data
			});
		}

		const componentNativeEl: HTMLElement =
			componentRef.location.nativeElement;
		if (options.scrollable) {
			componentNativeEl.classList.add('component-host-scrollable');
		}
		this._applicationRef.attachView(componentRef.hostView);

		this._addDismissEventListener(componentNativeEl, context, options);
		this._addCloseEventListener(componentNativeEl, context as any, options);

		// FIXME: we should here get rid of the component nativeElement
		// and use `[Array.from(componentNativeEl.childNodes)]` instead and remove the above CSS class.
		return new ContentRef(
			[
				options.headerSelector
					? extractAndRemoveNodesBySelector(
							componentNativeEl,
							options.headerSelector
					  )
					: [],
				componentNativeEl.childNodes as any,
				options.footerSelector
					? extractAndRemoveNodesBySelector(
							componentNativeEl,
							options.footerSelector
					  )
					: []
			],
			componentRef.hostView,
			componentRef
		);
	}

	private _setAriaHidden(element: Element) {
		const parent = element.parentElement;
		if (parent && element !== this._document.body) {
			Array.from(parent.children).forEach((sibling) => {
				if (sibling !== element && sibling.nodeName !== 'SCRIPT') {
					this._ariaHiddenValues.set(
						sibling,
						sibling.getAttribute('aria-hidden')
					);
					sibling.setAttribute('aria-hidden', 'true');
				}
			});

			this._setAriaHidden(parent);
		}
	}

	private _revertAriaHidden() {
		this._ariaHiddenValues.forEach((value, element) => {
			if (value) {
				element.setAttribute('aria-hidden', value);
			} else {
				element.removeAttribute('aria-hidden');
			}
		});
		this._ariaHiddenValues.clear();
	}

	private _registerModalRef(hubModalRef: HubModalRef) {
		const unregisterModalRef = () => {
			const index = this._modalRefs.indexOf(hubModalRef);
			if (index > -1) {
				this._modalRefs.splice(index, 1);
				this._activeInstances.emit(this._modalRefs);
			}
		};
		this._modalRefs.push(hubModalRef);
		this._activeInstances.emit(this._modalRefs);
		hubModalRef.result.then(unregisterModalRef, unregisterModalRef);
	}

	private _registerWindowCmpt(hubWindowCmpt: ComponentRef<HubModalWindow>) {
		this._windowCmpts.push(hubWindowCmpt);
		this._activeWindowCmptHasChanged.next();

		hubWindowCmpt.onDestroy(() => {
			const index = this._windowCmpts.indexOf(hubWindowCmpt);
			if (index > -1) {
				this._windowCmpts.splice(index, 1);
				this._activeWindowCmptHasChanged.next();
			}
		});
	}

	/**
	 * Attaches click event listeners to elements within a container based on a specified dismiss selector to dismiss a modal.
	 *
	 * @param {HTMLElement} container - The `container` parameter is an HTMLElement that represents the DOM element which contains the
	 * modal content.
	 * @param {HubActiveModal} context - The `context` parameter in the `_addDismissEventListener` function refers to the active modal
	 * instance that is being displayed. It is used to call the `dismiss` method on the modal instance when a dismissible element is
	 * clicked.
	 * @param {HubModalOptions} options - The `options` parameter is an object that contains configuration options for the modal. It
	 * may include properties such as `dismissSelector`, which is used to specify a CSS selector for elements that, when clicked, will
	 * dismiss the modal by calling the `dismiss` method on the `context` object.
	 */
	private _addDismissEventListener(
		container: HTMLElement,
		context: HubActiveModal,
		options: HubModalOptions
	) {
		if (options.dismissSelector) {
			const dismissaable: NodeListOf<Element> =
				container.querySelectorAll(options.dismissSelector);
			for (const item of Array.from(dismissaable)) {
				item.addEventListener('click', () => context.dismiss());
			}
		}
	}

	/**
	 * Attaches click event listeners to elements matching a specified selector to close a modal window.
	 *
	 * @param {HTMLElement} container - The `container` parameter is an HTMLElement that represents the DOM element which contains the
	 * modal content.
	 * @param {HubActiveModal} context - The `context` parameter in the `_addCloseEventListener` function is of type `HubActiveModal`.
	 * It is used to reference the active modal instance within the function and call the `close()` method on it when a close event is
	 * triggered.
	 * @param {HubModalOptions} options - The `options` parameter is an object that contains configuration options for the modal. It
	 * may include properties such as `closeSelector`, which is used to specify the selector for elements that can trigger the modal
	 * to close when clicked.
	 */
	private _addCloseEventListener(
		container: HTMLElement,
		context: HubActiveModal,
		options: HubModalOptions
	) {
		if (options.closeSelector) {
			const dismissaable: NodeListOf<Element> =
				container.querySelectorAll(options.closeSelector);
			for (const item of Array.from(dismissaable)) {
				const clickEventListeners = item.addEventListener('click', () =>
					context.close()
				);
			}
		}
	}
}

/**
 * Extracts child nodes matching a selector from a container element, removes those nodes from the DOM, and returns them as an array.
 *
 * @param {HTMLElement} container - The `container` parameter in the `extractAndRemoveNodesBySelector` function is an HTMLElement
 * that represents the parent element within which we want to search for nodes matching a specific selector and remove them.
 * @param {string} selector - The `selector` parameter in the `extractAndRemoveNodesBySelector` function is a string that
 * represents a CSS selector. This selector is used to query and select specific elements within the `container` HTMLElement.
 *
 * @returns An array of nodes that were extracted from the container element based on the provided selector, and then removes those
 * nodes from the DOM.
 */
function extractAndRemoveNodesBySelector(
	container: HTMLElement,
	selector: string
): Array<Node> {
	let containerNodes = container.querySelectorAll(selector);

	const nodes = Array.from(containerNodes).reduce((acc, c) => {
		return [...acc, ...Array.from(c.childNodes)];
	}, [] as Array<Node>);

	// Selecciona los nodos dentro del contenedor que coincidan con el selector
	const nodesToRemove = container.querySelectorAll<HTMLElement>(selector);

	// Convertir NodeList a array y eliminar cada nodo del DOM
	Array.from(nodesToRemove).forEach((node) => node.remove());
	return nodes;
}
