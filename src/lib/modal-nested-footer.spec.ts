import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HubModal } from './modal';

/**
 * Stands in for `<hub-stepper>`: a nested component that draws its own control bar, with the
 * buttons behind a condition the way the stepper hides Back on the first step.
 */
@Component({
	selector: 'nested-controls',
	standalone: true,
	template: `
		<div class="nested__controls">
			@if (showBack) {
				<button type="button" class="nested__back">Back</button>
			}
			<button type="button" class="nested__next">Next</button>
		</div>
	`
})
class NestedControlsComponent {
	showBack = false;
}

@Component({
	standalone: true,
	imports: [NestedControlsComponent],
	template: `
		<h2 class="wizard__title">Wizard</h2>
		<p class="wizard__body">Step body</p>
		<nested-controls />
	`
})
class WizardComponent {}

/**
 * The question this answers is whether `footerSelector` can reach markup that belongs to a
 * CHILD component rather than to the opened one. It decides whether a stepper's controls can
 * sit in the modal footer with no library change: the buttons resolve their stepper through
 * the element injector, which is fixed where the node was created, so relocating the node
 * leaves them working — but only if the node exists by the time the modal goes looking.
 */
describe('footerSelector across a nested component', () => {
	afterEach(() => {
		document.querySelectorAll('hub-modal-window, hub-modal-backdrop').forEach((el) => el.remove());
	});

	it('moves a nested component control bar into the modal footer', () => {
		const modal = TestBed.inject(HubModal);

		modal.open(WizardComponent, { footerSelector: '.nested__controls', animation: false });

		const footer = document.querySelector('.hub-modal__footer');

		expect(footer).toBeTruthy();
		expect(footer!.querySelector('.nested__next')).toBeTruthy();
	});

	/**
	 * Worth pinning, because it is the difference between "the controls move" and "the control
	 * bar moves": the matched element is not itself relocated, its children are. Anything the
	 * wrapper was contributing — layout, gap, alignment — stays behind with it, and the footer's
	 * own styling takes over.
	 */
	it('moves the children of the match, not the matched element', () => {
		const modal = TestBed.inject(HubModal);

		modal.open(WizardComponent, { footerSelector: '.nested__controls', animation: false });

		const footer = document.querySelector('.hub-modal__footer');

		expect(footer!.querySelector('.nested__next')).toBeTruthy();
		expect(footer!.querySelector('.nested__controls')).toBeNull();
	});

	it('leaves the rest of the content in the body', () => {
		const modal = TestBed.inject(HubModal);

		modal.open(WizardComponent, { footerSelector: '.nested__controls', animation: false });

		const body = document.querySelector('.hub-modal__body');

		expect(body!.querySelector('.wizard__body')).toBeTruthy();
		expect(body!.querySelector('.nested__controls')).toBeNull();
	});
});
