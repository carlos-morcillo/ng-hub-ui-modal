import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HubModal } from './modal';

@Component({
	selector: 'hub-test-scrollable-content',
	template: `<p>Scrollable content</p>`
})
class ScrollableContentComponent {}

/**
 * `scrollable` used to be written twice: on the dialog, where the stylesheet reads it, and as
 * `component-host-scrollable` on the component host. Only the dialog's copy is ever visible —
 * the host does not enter the document, which is what the second spec records — so dropping the
 * host's copy took nothing away from the consumer.
 */
describe('scrollable content', () => {
	afterEach(() => {
		document.querySelectorAll('hub-modal-window, hub-modal-backdrop').forEach((el) => el.remove());
	});

	const open = () => TestBed.inject(HubModal).open(ScrollableContentComponent, { animation: false, scrollable: true });

	it('marks the dialog as scrollable', () => {
		open().result.catch(() => {});

		expect(document.querySelector('.hub-modal__dialog')?.classList).toContain('hub-modal__dialog--scrollable');
	});

	it('leaves no scrollable marker on any host element', () => {
		open().result.catch(() => {});

		expect(document.querySelector('.component-host-scrollable')).toBeNull();
	});
});
