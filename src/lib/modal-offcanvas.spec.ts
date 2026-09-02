import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubModalWindow } from './modal-window';
import { HubModalPlacement } from './modal-placement';

/**
 * A drawer has to touch the edge it slid out of.
 *
 * `placement` alone slides a *floating* dialog in from an edge and keeps everything a floating
 * dialog has: margins, rounding on all four corners, and a height taken from its content. Each of
 * those is wrong for a drawer in a way a consumer had to undo by hand, so each is pinned here.
 *
 * jsdom performs no layout, but it does apply the component's stylesheet and resolve the cascade,
 * which is exactly what is under test: these are cascade outcomes, not geometry. The declared value
 * is asserted rather than a pixel count — `width: var(--hub-modal-offcanvas-width)` is the claim
 * that the size scale does not reach the dialog, and a number would only prove today's default.
 */
describe('hub-modal offcanvas', () => {
	let fixture: ComponentFixture<HubModalWindow>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HubModalWindow);
	});

	const open = (options: { placement?: HubModalPlacement; offcanvas?: boolean; size?: string } = {}) => {
		fixture.componentRef.setInput('offcanvas', options.offcanvas ?? true);

		if (options.placement) {
			fixture.componentRef.setInput('placement', options.placement);
		}

		if (options.size) {
			fixture.componentRef.setInput('size', options.size);
		}

		fixture.detectChanges();

		const host: HTMLElement = fixture.nativeElement;

		return {
			host,
			dialog: host.querySelector('.hub-modal__dialog') as HTMLElement,
			content: host.querySelector('.hub-modal__content') as HTMLElement,
			body: host.querySelector('.hub-modal__body') as HTMLElement
		};
	};

	it('sits flush against its edge, with auto only on the side it is pushed from', () => {
		const end = open({ placement: HubModalPlacement.End });
		// `margin: 0` would centre a dialog narrower than the viewport, which is the opposite
		// of anchoring it: the `auto` has to survive on the far side alone.
		expect(getComputedStyle(end.dialog).margin).toBe('0px 0px 0px auto');

		fixture = TestBed.createComponent(HubModalWindow);
		const start = open({ placement: HubModalPlacement.Start });
		expect(getComputedStyle(start.dialog).margin).toBe('0px auto 0px 0px');
	});

	it('drops the rounding it would otherwise keep on the side it is attached to', () => {
		const { content } = open({ placement: HubModalPlacement.End });

		// Not merely "not the placement radius": the placement rule is the one that wins by
		// source order unless this mode is declared after it, which is the bug this pins.
		// Read from the shipped rules rather than from `getComputedStyle`: jsdom throws
		// resolving this particular declaration, and what is under test is which rule wins,
		// which the cascade order in the sheet already settles.
		const rules = [...document.styleSheets].flatMap((sheet) => [...(sheet.cssRules ?? [])]) as CSSStyleRule[];
		const applies = (selector: string) => rules.filter((rule) => rule.selectorText === selector);

		const offcanvasRule = applies('.hub-modal--offcanvas .hub-modal__content');
		const placementRule = applies('.hub-modal__dialog--placement-end .hub-modal__content');

		expect(offcanvasRule).toHaveLength(1);
		expect(offcanvasRule[0].style.borderRadius).toBe('var(--hub-modal-offcanvas-border-radius)');

		// Same specificity as the placement rule it has to beat, so it only wins by coming
		// after it. That ordering is the whole fix and is asserted rather than assumed.
		expect(placementRule).toHaveLength(1);
		expect(rules.indexOf(offcanvasRule[0])).toBeGreaterThan(rules.indexOf(placementRule[0]));
		expect(content.closest('.hub-modal--offcanvas')).not.toBeNull();
	});

	it('stretches to the full height instead of being sized by its content', () => {
		const { dialog, content, body } = open({ placement: HubModalPlacement.End });

		expect(getComputedStyle(dialog).height).toBe('100%');
		expect(getComputedStyle(content).height).toBe('100%');
		// The body is the scroller, so a long panel cannot push its own footer out of reach.
		expect(getComputedStyle(body).overflowY).toBe('auto');
		expect(getComputedStyle(body).minHeight).toBe('0px');
	});

	it('takes its width from the offcanvas token, not from the size scale', () => {
		const { dialog } = open({ placement: HubModalPlacement.End, size: 'lg' });

		// `size: 'lg'` is 800px, which on a narrow window covers the document the drawer is
		// meant to be read against. Both properties have to move: leaving `max-width` on the
		// size scale lets the cap win the moment somebody passes both.
		expect(getComputedStyle(dialog).width).toBe('var(--hub-modal-offcanvas-width)');
		expect(getComputedStyle(dialog).maxWidth).toBe('var(--hub-modal-offcanvas-width)');
		expect(getComputedStyle(dialog).getPropertyValue('--hub-modal-offcanvas-width')).toBe('min(28rem,100%)');
	});

	it('takes the end edge when asked for a drawer with no placement, so opening one is a single decision', () => {
		const { host, dialog } = open({});

		expect(host.classList.contains('hub-modal--offcanvas')).toBe(true);
		expect(host.classList.contains('hub-modal--placement-end')).toBe(true);
		expect(dialog.classList.contains('hub-modal__dialog--placement-end')).toBe(true);
	});

	it('leaves a placement without the flag exactly as it was', () => {
		const { host, dialog, content } = open({ placement: HubModalPlacement.End, offcanvas: false });

		expect(host.classList.contains('hub-modal--offcanvas')).toBe(false);
		expect(dialog.classList.contains('hub-modal__dialog--placement-end')).toBe(true);

		// Asserted as a contrast rather than as a value: the placement margin is a `var()`
		// with a multi-value fallback, which jsdom flattens to `0` — testing that string
		// would test its parser. What matters is that the drawer's own margin is not the
		// one in force, and that the rounding is still the placement's.
		expect(getComputedStyle(dialog).margin).not.toBe('0px 0px 0px auto');
		expect(getComputedStyle(dialog).height).not.toBe('100%');
		expect(getComputedStyle(content).borderRadius).toBe('var(--hub-modal-placement-end-border-radius)');
	});
});
