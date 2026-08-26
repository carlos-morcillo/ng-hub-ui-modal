import { TestBed } from '@angular/core/testing';

import { HubModalBackdrop } from './modal-backdrop';

describe('hub-modal-backdrop', () => {
	it('should render backdrop with required CSS classes', () => {
		const fixture = TestBed.createComponent(HubModalBackdrop);
		fixture.componentRef.setInput('animation', false);

		fixture.detectChanges();
		expect(fixture.nativeElement.classList.contains('hub-modal__backdrop')).toBe(true);
		expect(fixture.nativeElement.classList.contains('show')).toBe(true);
		expect(fixture.nativeElement.classList.contains('fade')).toBe(false);
	});

	// The entry transition must run in a ZONELESS app — this test environment is one, and so
	// are consumers on `provideZonelessChangeDetection()`. It used to hang on `NgZone.onStable`,
	// which a `NoopNgZone` never emits; the test papered over that by emitting `onStable` by
	// hand. Nothing pumps that event in a real zoneless app, so `show` never landed. Do NOT
	// reintroduce a manual emit here: this assertion is what proves the hook is zone-agnostic.
	it('should render correct CSS classes for animations, with no zone to settle', async () => {
		const fixture = TestBed.createComponent(HubModalBackdrop);
		fixture.componentRef.setInput('animation', true);

		fixture.detectChanges();
		await fixture.whenStable();

		expect(fixture.nativeElement.classList.contains('show')).toBe(true);
		expect(fixture.nativeElement.classList.contains('fade')).toBe(true);
	});
});
