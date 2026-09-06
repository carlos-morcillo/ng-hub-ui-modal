import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HubModal } from './modal';
import { HubModalConfig } from './modal-config';

/** Content that asks for the built-in header, which is what draws the dismiss button. */
@Component({
	standalone: true,
	template: `
		<div hubModalHeader><h2>Title</h2></div>
		<p>Body</p>
	`
})
class HeaderedComponent {}

/**
 * The dismiss button the library draws has no text — its glyph comes from CSS — so its
 * `aria-label` is the entire name a screen reader reads out. Shipping that name as a fixed
 * English literal left a localized application with one control it could not translate,
 * which is why the name has to reach the button from the outside.
 */
describe('closeAriaLabel', () => {
	afterEach(() => {
		document.querySelectorAll('hub-modal-window, hub-modal-backdrop').forEach((el) => el.remove());
	});

	const open = (options: Record<string, unknown> = {}) =>
		TestBed.inject(HubModal).open(HeaderedComponent, {
			headerSelector: '[hubModalHeader]',
			animation: false,
			...options
		});

	const closeButton = () => document.querySelector('.hub-modal__close');

	it('names the button in English when nothing is configured', () => {
		open();

		expect(closeButton()?.getAttribute('aria-label')).toBe('Close');
	});

	it('takes the name from the open options', () => {
		open({ closeAriaLabel: 'Cerrar' });

		expect(closeButton()?.getAttribute('aria-label')).toBe('Cerrar');
	});

	/** One application-wide translation, set once, without repeating it at every call site. */
	it('takes the name from HubModalConfig when the call does not give one', () => {
		TestBed.inject(HubModalConfig).closeAriaLabel = 'Schließen';

		open();

		expect(closeButton()?.getAttribute('aria-label')).toBe('Schließen');
	});

	it('lets the open options win over the configured default', () => {
		TestBed.inject(HubModalConfig).closeAriaLabel = 'Schließen';

		open({ closeAriaLabel: 'Fermer' });

		expect(closeButton()?.getAttribute('aria-label')).toBe('Fermer');
	});
});
