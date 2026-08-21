import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HubModal } from './modal';

/**
 * Content written in the order the three slots are usually written in.
 */
@Component({
	standalone: true,
	template: `
		<div hubModalHeader><h2 class="c-title">Title</h2></div>
		<div hubModalBody><p class="c-body">Body</p></div>
		<div hubModalFooter><button type="button" class="c-save">Save</button></div>
	`
})
class ThreeSlotComponent {}

/**
 * The same three slots, with something between them that belongs to none of them — the shape
 * that breaks a body defined as "whatever is left over".
 */
@Component({
	standalone: true,
	template: `
		<!-- a comment nobody wrote for the modal -->
		<div hubModalFooter><button type="button" class="c-save">Save</button></div>
		<div hubModalHeader><h2 class="c-title">Title</h2></div>
		<div hubModalBody><p class="c-body">Body</p></div>
	`
})
class OutOfOrderComponent {}

/** Content with no body marker at all: the old arrangement, which has to keep working. */
@Component({
	standalone: true,
	template: `
		<div hubModalHeader><h2 class="c-title">Title</h2></div>
		<p class="c-loose">Loose paragraph</p>
		<div hubModalFooter><button type="button" class="c-save">Save</button></div>
	`
})
class NoBodyMarkerComponent {}

/**
 * The body used to be the one slot with no name: whatever survived the header and footer
 * being taken out. That holds only while the content is written in order and contains
 * nothing else, because leftovers are defined by what they are *not* — and it is the slot a
 * consumer is most likely to want to place deliberately.
 */
describe('bodySelector', () => {
	afterEach(() => {
		document.querySelectorAll('hub-modal-window, hub-modal-backdrop').forEach((el) => el.remove());
	});

	const open = (component: any, options: Record<string, unknown> = {}) =>
		TestBed.inject(HubModal).open(component, {
			headerSelector: '[hubModalHeader]',
			bodySelector: '[hubModalBody]',
			footerSelector: '[hubModalFooter]',
			animation: false,
			...options
		});

	it('puts the named block in the body', () => {
		open(ThreeSlotComponent);

		expect(document.querySelector('.hub-modal__body .c-body')).toBeTruthy();
	});

	it('leaves the other two slots where they were', () => {
		open(ThreeSlotComponent);

		expect(document.querySelector('.hub-modal__header .c-title')).toBeTruthy();
		expect(document.querySelector('.hub-modal__footer .c-save')).toBeTruthy();
	});

	/** The point of naming it: order in the source stops deciding what the body is. */
	it('finds the body wherever it is written', () => {
		open(OutOfOrderComponent);

		expect(document.querySelector('.hub-modal__body .c-body')).toBeTruthy();
		expect(document.querySelector('.hub-modal__header .c-title')).toBeTruthy();
		expect(document.querySelector('.hub-modal__footer .c-save')).toBeTruthy();
	});

	/**
	 * Adding the option to content that already works must not be able to lose anything, so
	 * what no selector claimed still lands in the body.
	 */
	it('keeps what no slot claimed', () => {
		open(NoBodyMarkerComponent);

		expect(document.querySelector('.hub-modal__body .c-loose')).toBeTruthy();
	});

	it('moves the children of the match rather than the matched element', () => {
		open(ThreeSlotComponent);

		const body = document.querySelector('.hub-modal__body')!;

		expect(body.querySelector('[hubModalBody]')).toBeNull();
		expect(body.querySelector('.c-body')).toBeTruthy();
	});

	/**
	 * The ordering defect the option surfaced. The body used to be read *between* the header
	 * and footer extractions, so the footer's marker was still a child when it was captured
	 * and an emptied `<div>` rode along into the body.
	 */
	it('does not carry the emptied marker of another slot', () => {
		open(ThreeSlotComponent);

		const body = document.querySelector('.hub-modal__body')!;

		expect(body.querySelector('[hubModalFooter]')).toBeNull();
		expect(body.querySelector('[hubModalHeader]')).toBeNull();
	});

	/** Without the option, nothing about the existing behaviour changes. */
	it('is optional: the body is still the leftovers when it is not given', () => {
		open(NoBodyMarkerComponent, { bodySelector: undefined });

		expect(document.querySelector('.hub-modal__body .c-loose')).toBeTruthy();
		expect(document.querySelector('.hub-modal__header .c-title')).toBeTruthy();
		expect(document.querySelector('.hub-modal__footer .c-save')).toBeTruthy();
	});
});
