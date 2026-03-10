import { DOCUMENT } from '@angular/common';
import {
	Component,
	ElementRef,
	inject,
	input,
	NgZone,
	OnDestroy,
	OnInit,
	output,
	viewChild,
	ViewEncapsulation
} from '@angular/core';
import { getFocusableBoundaryElements, hubRunTransition, isString, reflow, TransitionOptions } from 'ng-hub-ui-utils';
import { fromEvent, Observable, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ModalDismissReasons } from './modal-dismiss-reasons';
import { HubModalPlacement } from './modal-placement';

/**
 * The internal component representing the modal window.
 * It renders the modal dialog structure, handles ARIA attributes, encapsulates the projected content,
 * and manages interactions like keyboard dismissals and backdrop clicks.
 */
@Component({
	selector: 'hub-modal-window',
	imports: [],
	host: {
		'[class]': '"hub-modal" + hostPlacementClass + (windowClass() ? " " + windowClass() : "")',
		'[class.fade]': 'animation()',
		role: 'dialog',
		tabindex: '-1',
		'[attr.aria-modal]': 'true',
		'[attr.aria-labelledby]': 'ariaLabelledBy()',
		'[attr.aria-describedby]': 'ariaDescribedBy()'
	},
	template: `
		<div
			#dialog
			[class]="
				'hub-modal__dialog' +
				(size() ? ' hub-modal__dialog--' + size() : '') +
				placementClass +
				centeredClass +
				fullscreenClass +
				(scrollable() ? ' hub-modal__dialog--scrollable' : '') +
				(modalDialogClass() ? ' ' + modalDialogClass() : '')
			"
			role="document"
		>
			<div class="hub-modal__content">
				@if (singleContent) {
					<div #bodyContainer class="hub-modal__body"></div>
				} @else {
					<div #headerContainer class="hub-modal__header">
						<button
							#closeButton
							type="button"
							class="hub-modal__close"
							aria-label="Close"
							(click)="dismiss(null)"
						></button>
					</div>
					<div #bodyContainer class="hub-modal__body"></div>
					<div #footerContainer class="hub-modal__footer"></div>
				}
			</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	styleUrl: './modal.scss'
})
export class HubModalWindow implements OnInit, OnDestroy {
	private _document = inject(DOCUMENT);
	private _elRef = inject(ElementRef<HTMLElement>);
	private _zone = inject(NgZone);

	private _closed$ = new Subject<void>();
	private _elWithFocus: Element | null = null; // element that is focused prior to modal opening

	private readonly _dialogEl = viewChild.required<ElementRef<HTMLElement>>('dialog');
	private readonly _headerContainerEl = viewChild<ElementRef<HTMLElement>>('headerContainer');
	private readonly _bodyContainerEl = viewChild<ElementRef<HTMLElement>>('bodyContainer');
	private readonly _footerContainerEl = viewChild<ElementRef<HTMLElement>>('footerContainer');
	private readonly _closeButtonEl = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

	/**
	 * Determines whether the modal window should animate its entry and exit.
	 */
	readonly animation = input<boolean>(true);

	/**
	 * Identifier to apply to the `aria-labelledby` attribute of the modal.
	 */
	readonly ariaLabelledBy = input<string>();

	/**
	 * Identifier to apply to the `aria-describedby` attribute of the modal.
	 */
	readonly ariaDescribedBy = input<string>();

	/**
	 * Configures the presence and behavior of the modal backdrop (`true`, `false`, or `'static'`).
	 */
	readonly backdrop = input<boolean | string>(true);

	/**
	 * If `true`, the modal dialog will be centered vertically.
	 */
	readonly centered = input<boolean>();

	/**
	 * Specifies the modal placement inside the viewport.
	 */
	readonly placement = input<HubModalPlacement>(HubModalPlacement.Center);

	/**
	 * Enables fullscreen mode for the modal, either always (`true`) or below specific breakpoints.
	 */
	readonly fullscreen = input<string | boolean>();

	/**
	 * If `true`, pressing the ESC key will close the modal.
	 */
	readonly keyboard = input(true);

	/**
	 * If `true`, the modal content will be scrollable when it exceeds the viewport height.
	 */
	readonly scrollable = input<boolean>();

	/**
	 * Specifies the size of the modal (`'sm'`, `'lg'`, `'xl'`, etc.).
	 */
	readonly size = input<string>();

	/**
	 * A custom CSS class to append to the modal window wrapper.
	 */
	readonly windowClass = input<string>();

	/**
	 * A custom CSS class to append to the inner modal dialog element.
	 */
	readonly modalDialogClass = input<string>();

	singleContent!: boolean;

	/**
	 * Emits when the user dismisses the modal (e.g. via ESC, backdrop click, or custom close buttons).
	 */
	readonly dismissEvent = output({ alias: 'dismiss' });

	/**
	 * Emits and completes once the modal window is fully visible and its transition has ended.
	 */
	shown = new Subject<void>();

	/**
	 * Emits and completes once the modal is fully hidden and its DOM elements are ready to be destroyed.
	 */
	hidden = new Subject<void>();

	/**
	 * Computes the CSS class for fullscreen behavior based on the `fullscreen` input.
	 */
	get fullscreenClass(): string {
		const fullscreen = this.fullscreen();
		return fullscreen === true
			? ' hub-modal__dialog--fullscreen'
			: isString(fullscreen)
				? ` hub-modal__dialog--fullscreen-${fullscreen}-down`
				: '';
	}

	/**
	 * Computes the CSS class corresponding to the requested modal placement.
	 */
	get placementClass(): string {
		const placement = this.placement();
		return placement && placement !== HubModalPlacement.Center ? ` hub-modal__dialog--placement-${placement}` : '';
	}

	/**
	 * Computes the CSS class applied to the modal host to control viewport anchoring.
	 */
	get hostPlacementClass(): string {
		const placement = this.placement();
		return placement && placement !== HubModalPlacement.Center ? ` hub-modal--placement-${placement}` : '';
	}

	/**
	 * Computes the CSS class used to center the modal on the secondary axis, depending on its placement.
	 */
	get centeredClass(): string {
		if (!this.centered()) {
			return '';
		}

		switch (this.placement()) {
			case HubModalPlacement.Start:
			case HubModalPlacement.End:
				return ' hub-modal__dialog--centered-vertical';
			case HubModalPlacement.Top:
			case HubModalPlacement.Bottom:
				return '';
			case HubModalPlacement.Center:
			default:
				return ' hub-modal__dialog--centered';
		}
	}

	/**
	 * Dismisses the modal by emitting the `dismissEvent` with the provided reason.
	 *
	 * @param reason The reason the modal was dismissed (e.g. 'ESC', 'BACKDROP_CLICK', or custom data).
	 */
	dismiss(reason: any): void {
		this.dismissEvent.emit(reason);
	}

	/**
	 * Attaches the projected content nodes into their respective structural containers
	 * (header, body, and footer) within the modal dialog.
	 *
	 * @param contentNodes A nested array containing nodes segmented into header, body, and footer parts.
	 */
	attachContent([headerNodes, bodyNodes, footerNodes]: Node[][]): void {
		const bodyContainer = this._bodyContainerEl()?.nativeElement;
		if (!bodyContainer) {
			return;
		}

		if (this.singleContent) {
			this._appendNodes(bodyContainer, bodyNodes);
			return;
		}

		const headerContainer = this._headerContainerEl()?.nativeElement;
		const footerContainer = this._footerContainerEl()?.nativeElement;
		const closeButton = this._closeButtonEl()?.nativeElement ?? null;

		if (headerContainer) {
			this._appendNodes(headerContainer, headerNodes, closeButton);
		}
		this._appendNodes(bodyContainer, bodyNodes);
		if (footerContainer) {
			this._appendNodes(footerContainer, footerNodes);
		}
	}

	ngOnInit() {
		this._elWithFocus = this._document.activeElement;
		this._zone.onStable
			.asObservable()
			.pipe(take(1))
			.subscribe(() => {
				this._show();
			});
	}

	ngOnDestroy() {
		this._disableEventHandling();
	}

	/**
	 * Determines the focus element, blocks further interactions, configures the exit transition context,
	 * removes 'show' CSS classes from the modal, and restores focus back to the previously focused element.
	 *
	 * @returns An observable that emits when the exit transition completely finishes.
	 */
	hide(): Observable<any> {
		const { nativeElement } = this._elRef;
		const context: TransitionOptions<any> = {
			animation: this.animation(),
			runningTransition: 'stop'
		};

		const windowTransition$ = hubRunTransition(
			this._zone,
			nativeElement,
			() => nativeElement.classList.remove('show'),
			context
		);
		const dialogTransition$ = hubRunTransition(this._zone, this._dialogEl().nativeElement, () => {}, context);

		const transitions$ = zip(windowTransition$, dialogTransition$);
		transitions$.subscribe(() => {
			this.hidden.next();
			this.hidden.complete();
		});

		this._disableEventHandling();
		this._restoreFocus();

		return transitions$;
	}

	private _show() {
		const context: TransitionOptions<any> = {
			animation: this.animation(),
			runningTransition: 'continue'
		};

		const windowTransition$ = hubRunTransition(
			this._zone,
			this._elRef.nativeElement,
			(element: HTMLElement, animation: boolean) => {
				if (animation) {
					reflow(element);
				}
				element.classList.add('show');
			},
			context
		);
		const dialogTransition$ = hubRunTransition(this._zone, this._dialogEl().nativeElement, () => {}, context);

		zip(windowTransition$, dialogTransition$).subscribe(() => {
			this.shown.next();
			this.shown.complete();
		});

		this._enableEventHandling();
		this._setFocus();
	}

	private _enableEventHandling() {
		const { nativeElement } = this._elRef;
		this._zone.runOutsideAngular(() => {
			fromEvent<KeyboardEvent>(nativeElement, 'keydown')
				.pipe(
					takeUntil(this._closed$),
					filter((e) => e.key === 'Escape')
				)
				.subscribe((event) => {
					if (this.keyboard()) {
						requestAnimationFrame(() => {
							if (!event.defaultPrevented) {
								this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
							}
						});
					} else if (this.backdrop() === 'static') {
						this._bumpBackdrop();
					}
				});

			// We're listening to 'mousedown' and 'mouseup' to prevent modal from closing when pressing the mouse
			// inside the modal dialog and releasing it outside
			let preventClose = false;
			fromEvent<MouseEvent>(this._dialogEl().nativeElement, 'mousedown')
				.pipe(
					takeUntil(this._closed$),
					tap(() => (preventClose = false)),
					switchMap(() => fromEvent<MouseEvent>(nativeElement, 'mouseup').pipe(takeUntil(this._closed$), take(1))),
					filter(({ target }) => nativeElement === target)
				)
				.subscribe(() => {
					preventClose = true;
				});

			// We're listening to 'click' to dismiss modal on modal window click, except when:
			// 1. clicking on modal dialog itself
			// 2. closing was prevented by mousedown/up handlers
			// 3. clicking on scrollbar when the viewport is too small and modal doesn't fit (click is not triggered at all)
			fromEvent<MouseEvent>(nativeElement, 'click')
				.pipe(takeUntil(this._closed$))
				.subscribe(({ target }) => {
					if (nativeElement === target) {
						const backdrop = this.backdrop();
						if (backdrop === 'static') {
							this._bumpBackdrop();
						} else if (backdrop === true && !preventClose) {
							this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
						}
					}

					preventClose = false;
				});
		});
	}

	private _disableEventHandling() {
		this._closed$.next();
	}

	private _setFocus() {
		const { nativeElement } = this._elRef;
		if (!nativeElement.contains(document.activeElement)) {
			const autoFocusable = nativeElement.querySelector(`[hubAutofocus]`) as HTMLElement;
			const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];

			const elementToFocus = autoFocusable || firstFocusable || nativeElement;
			elementToFocus.focus();
		}
	}

	private _restoreFocus() {
		const body = this._document.body;
		const elWithFocus = this._elWithFocus;

		let elementToFocus: HTMLElement;
		if (elWithFocus instanceof HTMLElement && body.contains(elWithFocus)) {
			elementToFocus = elWithFocus;
		} else {
			elementToFocus = body as unknown as HTMLElement;
		}
		this._zone.runOutsideAngular(() => {
			setTimeout(() => elementToFocus.focus());
			this._elWithFocus = null;
		});
	}

	private _bumpBackdrop() {
		if (this.backdrop() === 'static') {
			hubRunTransition(
				this._zone,
				this._elRef.nativeElement,
				({ classList }) => {
					classList.add('hub-modal--static');
					return () => classList.remove('hub-modal--static');
				},
				{ animation: this.animation(), runningTransition: 'continue' }
			);
		}
	}

	private _appendNodes(container: HTMLElement, nodes: Node[], beforeNode?: Node | null) {
		nodes.forEach((node) => {
			if (beforeNode) {
				container.insertBefore(node, beforeNode);
			} else {
				container.appendChild(node);
			}
		});
	}
}
