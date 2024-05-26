import { TestBed } from '@angular/core/testing';

import { HubModalBackdrop } from './modal-backdrop';

describe('hub-modal-backdrop', () => {
	it('should render backdrop with required CSS classes', () => {
		const fixture = TestBed.createComponent(HubModalBackdrop);

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveCssClass('modal-backdrop');
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).not.toHaveCssClass('fade');
	});

	it('should render correct CSS classes for animations', () => {
		const fixture = TestBed.createComponent(HubModalBackdrop);
		fixture.componentInstance.animation = true;

		fixture.detectChanges();
		expect(fixture.nativeElement).toHaveCssClass('show');
		expect(fixture.nativeElement).toHaveCssClass('fade');
	});
});
