import { ComponentRef, InjectionToken } from '@angular/core';
import { ContentRef, isDefined, isPromise } from 'ng-hub-ui-utils';
import { Observable, of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HubModalBackdrop } from './modal-backdrop';
import { HubModalOptions, HubModalUpdatableOptions } from './modal-config';
import { HubModalWindow } from './modal-window';

/**
 * Injection token carrying the `HubModalOptions.data` payload down to the modal
 * content component. Inject it to read the payload in a typed way, mirroring the
 * Angular CDK `DIALOG_DATA` pattern:
 *
 * ```ts
 * private readonly data = inject(HUB_MODAL_DATA) as MyPayload;
 * ```
 *
 * It is provided alongside `HubActiveModal` in the content component's element
 * injector and resolves to `null` when no `data` option was supplied.
 *
 * @since 22.3.0
 */
export const HUB_MODAL_DATA = new InjectionToken<unknown>('HUB_MODAL_DATA');

/**
 * A reference to the currently opened (active) modal.
 *
 * Instances of this class can be injected into your component passed as modal content.
 * So you can `.update()`, `.close()` or `.dismiss()` the modal window from your component.
 *
 * The optional generic parameter `D` types the {@link HubActiveModal.data} payload
 * passed through `HubModalOptions.data`.
 */
export class HubActiveModal<D = unknown, R = any> {
	/**
	 * Creates the active modal reference.
	 *
	 * @param _data The payload supplied via `HubModalOptions.data`, if any.
	 */
	constructor(private readonly _data: D = null as D) {}

	/**
	 * The typed payload passed to the modal through `HubModalOptions.data`.
	 *
	 * Equivalent to injecting the {@link HUB_MODAL_DATA} token, but strongly typed
	 * when the generic parameter `D` is supplied. Resolves to `null` when no `data`
	 * option was provided.
	 *
	 * @since 22.3.0
	 */
	get data(): D {
		return this._data;
	}

	/**
	 * Updates options of an opened modal.
	 *
	 * @since 14.2.0
	 */
	update(options: HubModalUpdatableOptions): void {}
	/**
	 * Closes the modal with an optional `result` value.
	 *
	 * The `HubModalRef.result` promise will be resolved with the provided value.
	 */
	close(result?: R): void {}

	/**
	 * Dismisses the modal with an optional `reason` value.
	 *
	 * The `HubModalRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {}
}

const WINDOW_ATTRIBUTES: string[] = [
	'animation',
	'ariaLabelledBy',
	'ariaDescribedBy',
	'backdrop',
	'centered',
	'placement',
	'fullscreen',
	'keyboard',
	'scrollable',
	'size',
	'variant',
	'windowClass',
	'modalDialogClass'
];
const BACKDROP_ATTRIBUTES: string[] = ['animation', 'backdropClass'];

/**
 * A reference to the newly opened modal returned by the `HubModal.open()` method.
 */
export class HubModalRef<C = any, R = any> {
	private _closed = new Subject<R>();
	private _dismissed = new Subject<any>();
	private _hidden = new Subject<void>();
	private _resolve!: (result: R | PromiseLike<R>) => void;
	private _reject!: (reason?: any) => void;

	private _applyWindowOptions(windowComponentRef: ComponentRef<HubModalWindow>, options: HubModalOptions): void {
		WINDOW_ATTRIBUTES.forEach((optionName: string) => {
			const opts: any = options as any;
			if (isDefined(opts[optionName])) {
				windowComponentRef.setInput(optionName, opts[optionName]);
			}
		});
	}

	private _applyBackdropOptions(backdropComponentRef: ComponentRef<HubModalBackdrop>, options: HubModalOptions): void {
		BACKDROP_ATTRIBUTES.forEach((optionName: string) => {
			const opts: any = options as any;
			if (isDefined(opts[optionName])) {
				backdropComponentRef.setInput(optionName, opts[optionName]);
			}
		});
	}

	/**
	 * Updates options of an opened modal.
	 *
	 * @since 14.2.0
	 */
	update(options: HubModalUpdatableOptions): void {
		this._applyWindowOptions(this._windowCmptRef, options);
		if (this._backdropCmptRef && this._backdropCmptRef.instance) {
			this._applyBackdropOptions(this._backdropCmptRef, options);
		}
	}

	/**
	 * The instance of a component used for the modal content.
	 *
	 * When a `TemplateRef` is used as the content or when the modal is closed, will return `undefined`.
	 */
	get componentInstance(): C | void {
		if (this._contentRef && this._contentRef.componentRef) {
			return this._contentRef.componentRef.instance;
		}
	}

	/**
	 * The promise that is resolved when the modal is closed and rejected when the modal is dismissed.
	 */
	result: Promise<R>;

	/**
	 * The observable that emits when the modal is closed via the `.close()` method.
	 *
	 * It will emit the result passed to the `.close()` method.
	 *
	 * @since 8.0.0
	 */
	get closed(): Observable<R> {
		return this._closed.asObservable().pipe(takeUntil(this._hidden));
	}

	/**
	 * The observable that emits when the modal is dismissed via the `.dismiss()` method.
	 *
	 * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
	 * reasons like backdrop click or ESC key press.
	 *
	 * @since 8.0.0
	 */
	get dismissed(): Observable<any> {
		return this._dismissed.asObservable().pipe(takeUntil(this._hidden));
	}

	/**
	 * The observable that emits when both modal window and backdrop are closed and animations were finished.
	 * At this point modal and backdrop elements will be removed from the DOM tree.
	 *
	 * This observable will be completed after emitting.
	 *
	 * @since 8.0.0
	 */
	get hidden(): Observable<void> {
		return this._hidden.asObservable();
	}

	/**
	 * The observable that emits when modal is fully visible and animation was finished.
	 * Modal DOM element is always available synchronously after calling 'modal.open()' service.
	 *
	 * This observable will be completed after emitting.
	 * It will not emit, if modal is closed before open animation is finished.
	 *
	 * @since 8.0.0
	 */
	get shown(): Observable<void> {
		return this._windowCmptRef.instance.shown.asObservable();
	}

	constructor(
		private _windowCmptRef: ComponentRef<HubModalWindow>,
		private _contentRef: ContentRef,
		private _backdropCmptRef?: ComponentRef<HubModalBackdrop>,
		private _beforeDismiss?: () => boolean | Promise<boolean>
	) {
		_windowCmptRef.instance.dismissEvent.subscribe((reason: any) => {
			this.dismiss(reason);
		});

		this.result = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
		this.result.then(null, () => {});
	}

	/**
	 * Closes the modal with an optional `result` value.
	 *
	 * The `HubMobalRef.result` promise will be resolved with the provided value.
	 */
	close(result?: R): void {
		if (this._windowCmptRef) {
			// `close()` without a value legitimately emits `undefined` through the
			// `R`-typed stream, mirroring the optional `result` parameter.
			this._closed.next(result as R);
			this._resolve(result as R);
			this._removeModalElements();
		}
	}

	private _dismiss(reason?: any) {
		this._dismissed.next(reason);
		this._reject(reason);
		this._removeModalElements();
	}

	/**
	 * Dismisses the modal with an optional `reason` value.
	 *
	 * The `HubModalRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {
		if (this._windowCmptRef) {
			if (!this._beforeDismiss) {
				this._dismiss(reason);
			} else {
				const dismiss = this._beforeDismiss();
				if (isPromise(dismiss as any)) {
					(dismiss as Promise<boolean>).then(
						(result) => {
							if (result !== false) {
								this._dismiss(reason);
							}
						},
						() => {}
					);
				} else if (dismiss !== false) {
					this._dismiss(reason);
				}
			}
		}
	}

	private _removeModalElements() {
		const windowTransition$ = this._windowCmptRef.instance.hide();
		const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);

		// hiding window
		windowTransition$.subscribe(() => {
			const { nativeElement } = this._windowCmptRef.location;
			nativeElement.parentNode?.removeChild(nativeElement);
			this._windowCmptRef.destroy();
			this._contentRef?.viewRef?.destroy();

			this._windowCmptRef = <any>null;
			this._contentRef = <any>null;
		});

		// hiding backdrop
		backdropTransition$.subscribe(() => {
			if (this._backdropCmptRef) {
				const { nativeElement } = this._backdropCmptRef.location;
				nativeElement.parentNode?.removeChild(nativeElement);
				this._backdropCmptRef.destroy();
				this._backdropCmptRef = <any>null;
			}
		});

		// all done
		zip(windowTransition$, backdropTransition$).subscribe(() => {
			this._hidden.next();
			this._hidden.complete();
		});
	}
}
