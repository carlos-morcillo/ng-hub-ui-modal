import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  input,
  output,
  viewChild
} from '@angular/core';
import { fromEvent, Observable, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ModalDismissReasons } from './modal-dismiss-reasons';
import {
	isString,
	reflow,
	getFocusableBoundaryElements,
	hubRunTransition,
	TransitionOptions
} from 'ng-hub-ui-utils';

@Component({
    selector: 'hub-modal-window',
    imports: [],
    host: {
        '[class]': '"modal d-block" + (windowClass() ? " " + windowClass() : "")',
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
				'modal-dialog' +
				(size() ? ' modal-' + size() : '') +
				(centered() ? ' modal-dialog-centered' : '') +
				fullscreenClass +
				(scrollable() ? ' modal-dialog-scrollable' : '') +
				(modalDialogClass() ? ' ' + modalDialogClass() : '')
			"
		  role="document"
		  >
		  <div class="modal-content">
		    @if (singleContent) {
		      <ng-content></ng-content>
		    } @else {
		      <div class="modal-header">
		        <ng-content />
		        <button
		          type="button"
		          class="btn-close"
		          data-bs-dismiss="modal"
		          aria-label="Close"
		          (click)="dismiss(null)"
		        ></button>
		      </div>
		      <div class="modal-body">
		        <ng-content />
		      </div>
		      <div class="modal-footer">
		        <ng-content />
		      </div>
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

    readonly animation = input<boolean>(true);
    readonly ariaLabelledBy = input<string>();
    readonly ariaDescribedBy = input<string>();
    readonly backdrop = input<boolean | string>(true);
    readonly centered = input<boolean>();
    readonly fullscreen = input<string | boolean>();
    readonly keyboard = input(true);
    readonly scrollable = input<boolean>();
    readonly size = input<string>();
    readonly windowClass = input<string>();
    readonly modalDialogClass = input<string>();

	singleContent!: boolean;

	readonly dismissEvent = output({ alias: 'dismiss' });

	shown = new Subject<void>();
	hidden = new Subject<void>();

	get fullscreenClass(): string {
		const fullscreen = this.fullscreen();
  return fullscreen === true
			? ' modal-fullscreen'
			: isString(fullscreen)
			? ` modal-fullscreen-${fullscreen}-down`
			: '';
	}

    dismiss(reason: any): void {
        this.dismissEvent.emit(reason);
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
		const dialogTransition$ = hubRunTransition(
			this._zone,
			this._dialogEl().nativeElement,
			() => {},
			context
		);

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
		const dialogTransition$ = hubRunTransition(
			this._zone,
			this._dialogEl().nativeElement,
			() => {},
			context
		);

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
								this._zone.run(() =>
									this.dismiss(ModalDismissReasons.ESC)
								);
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
					switchMap(() =>
						fromEvent<MouseEvent>(nativeElement, 'mouseup').pipe(
							takeUntil(this._closed$),
							take(1)
						)
					),
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
							this._zone.run(() =>
								this.dismiss(ModalDismissReasons.BACKDROP_CLICK)
							);
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
			const autoFocusable = nativeElement.querySelector(
				`[hubAutofocus]`
			) as HTMLElement;
			const firstFocusable =
				getFocusableBoundaryElements(nativeElement)[0];

			const elementToFocus =
				autoFocusable || firstFocusable || nativeElement;
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
					classList.add('modal-static');
					return () => classList.remove('modal-static');
				},
				{ animation: this.animation(), runningTransition: 'continue' }
			);
		}
	}
}
