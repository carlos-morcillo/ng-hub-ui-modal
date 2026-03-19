import { TestBed } from '@angular/core/testing';

import { HubModalBackdrop } from './modal-backdrop';

describe('hub-modal-backdrop', () => {
	it('should render backdrop with required CSS classes', () => {
		const fixture = TestBed.createComponent(HubModalBackdrop);
		fixture.componentRef.setInput('animation', false);

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveClass('hub-modal__backdrop');
		expect(fixture.nativeElement).toHaveClass('show');
		expect(fixture.nativeElement).not.toHaveClass('fade');
	});

	it('should render correct CSS classes for animations', async () => {
		const fixture = TestBed.createComponent(HubModalBackdrop);
		fixture.componentRef.setInput('animation', true);

		fixture.detectChanges();
		await fixture.whenStable();
		expect(fixture.nativeElement).toHaveClass('show');
		expect(fixture.nativeElement).toHaveClass('fade');
	});
});
