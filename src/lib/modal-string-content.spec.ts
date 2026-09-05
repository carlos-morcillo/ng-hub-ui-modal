import { TestBed } from '@angular/core/testing';

import { HubModal } from './modal';

/**
 * A string is the one kind of content that does not go through `splitIntoSlots`, so it is the
 * one kind that can disagree with the shape `attachContent` destructures. It did: the text was
 * returned as a single slot, which landed it in the HEADER and left the body `undefined`.
 * Appending it threw before the window armed its Escape handler, so the dialog opened blank
 * and the keyboard could not close it. Both symptoms are pinned here.
 */
describe('string content', () => {
	afterEach(() => {
		document.querySelectorAll('hub-modal-window, hub-modal-backdrop').forEach((el) => el.remove());
	});

	const open = (content: string) => TestBed.inject(HubModal).open(content, { animation: false });

	it('renders the string inside the body', () => {
		open('Hello World (Simple text)').result.catch(() => {});

		expect(document.querySelector('.hub-modal__body')?.textContent).toContain('Hello World (Simple text)');
	});

	it('leaves nothing in the header', () => {
		open('Hello World (Simple text)').result.catch(() => {});

		expect(document.querySelector('.hub-modal__header')?.textContent ?? '').not.toContain('Hello World');
	});

	it('opens without throwing, so the window finishes arming its handlers', () => {
		expect(() => open('Hello World (Simple text)').result.catch(() => {})).not.toThrow();
	});
});
