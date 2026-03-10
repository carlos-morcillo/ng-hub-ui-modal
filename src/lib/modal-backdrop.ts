import { Component, ElementRef, inject, input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { hubRunTransition, reflow } from 'ng-hub-ui-utils';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Represents the backdrop element associated with an active modal window.
 * It is responsible for displaying a dark overlay and handling entry/exit animations.
 */
@Component({
	selector: 'hub-modal-backdrop',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: '',
	host: {
		'[class]': '"hub-modal__backdrop" + (backdropClass() ? " " + backdropClass() : "")',
		'[class.show]': '!animation()',
		'[class.fade]': 'animation()'
	}
})
export class HubModalBackdrop implements OnInit {
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _zone = inject(NgZone);

	/**
	 * Determines whether the backdrop should use CSS transitions during its initialization and destruction.
	 */
	readonly animation = input<boolean>(true);

	/**
	 * Allows applying a custom CSS class to the backdrop element.
	 */
	readonly backdropClass = input<string>();

	ngOnInit() {
		this._zone.onStable
			.asObservable()
			.pipe(take(1))
			.subscribe(() => {
				hubRunTransition(
					this._zone,
					this._nativeElement,
					(element: HTMLElement, animation: boolean) => {
						if (animation) {
							reflow(element);
						}
						element.classList.add('show');
					},
					{ animation: this.animation(), runningTransition: 'continue' }
				);
			});
	}

	/**
	 * Triggers the hide transition for the backdrop element and removes the `show` CSS class.
	 *
	 * @returns An observable that completes once the exit transition has ended.
	 */
	hide(): Observable<void> {
		return hubRunTransition(this._zone, this._nativeElement, ({ classList }) => classList.remove('show'), {
			animation: this.animation(),
			runningTransition: 'stop'
		});
	}
}
