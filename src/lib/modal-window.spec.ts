import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubModalWindow } from './modal-window';
import { HubModalPlacement } from './modal-placement';

describe('hub-modal-dialog', () => {
	let fixture: ComponentFixture<HubModalWindow>;

	beforeEach(() => {
		fixture = TestBed.createComponent(HubModalWindow);
	});

	describe('basic rendering functionality', () => {
		it('should render default modal window', () => {
			fixture.detectChanges();

			const modalEl: Element = fixture.nativeElement;
			const dialogEl: Element =
				fixture.nativeElement.querySelector('.hub-modal__dialog');

			expect(modalEl).toHaveClass('hub-modal');
			expect(dialogEl).toHaveClass('hub-modal__dialog');
		});

		it('should render default modal window with a specified size', () => {
			fixture.componentRef.setInput('size', 'sm');
			fixture.detectChanges();

			const dialogEl: Element =
				fixture.nativeElement.querySelector('.hub-modal__dialog');
			expect(dialogEl).toHaveClass('hub-modal__dialog');
			expect(dialogEl).toHaveClass('hub-modal__dialog--sm');
		});

		it('should render default modal window with a specified placement', () => {
			fixture.componentRef.setInput('placement', HubModalPlacement.End);
			fixture.detectChanges();

			const dialogEl: Element =
				fixture.nativeElement.querySelector('.hub-modal__dialog');
			expect(dialogEl).toHaveClass('hub-modal__dialog--placement-end');
			expect(dialogEl).not.toHaveClass('hub-modal__dialog--centered');
		});

		it('should center side placements on the vertical axis when centered is true', () => {
			fixture.componentRef.setInput('placement', HubModalPlacement.End);
			fixture.componentRef.setInput('centered', true);
			fixture.detectChanges();

			const dialogEl: Element =
				fixture.nativeElement.querySelector('.hub-modal__dialog');
			expect(dialogEl).toHaveClass('hub-modal__dialog--centered-vertical');
		});

		it('should not add an extra centered class for top and bottom placements', () => {
			fixture.componentRef.setInput('placement', HubModalPlacement.Bottom);
			fixture.componentRef.setInput('centered', true);
			fixture.detectChanges();

			const dialogEl: Element =
				fixture.nativeElement.querySelector('.hub-modal__dialog');
			expect(dialogEl).not.toHaveClass('hub-modal__dialog--centered');
			expect(dialogEl).not.toHaveClass('hub-modal__dialog--centered-vertical');
			expect(dialogEl).not.toHaveClass(
				'hub-modal__dialog--centered-horizontal'
			);
		});

		it('should render default modal window with a specified fullscreen size', () => {
			fixture.detectChanges();
			const dialogEl = fixture.nativeElement.querySelector(
				'.hub-modal__dialog'
			) as HTMLElement;
			expect(dialogEl).not.toHaveClass('hub-modal__dialog--fullscreen');

			fixture.componentRef.setInput('fullscreen', true);
			fixture.detectChanges();
			expect(dialogEl).toHaveClass('hub-modal__dialog--fullscreen');

			fixture.componentRef.setInput('fullscreen', 'sm');
			fixture.detectChanges();
			expect(dialogEl).toHaveClass('hub-modal__dialog--fullscreen-sm-down');

			fixture.componentRef.setInput('fullscreen', 'custom');
			fixture.detectChanges();
			expect(dialogEl).toHaveClass(
				'hub-modal__dialog--fullscreen-custom-down'
			);
		});

		it('should render default modal window with a specified class', () => {
			fixture.componentRef.setInput('windowClass', 'custom-class');
			fixture.detectChanges();

			expect(fixture.nativeElement).toHaveClass('custom-class');
		});

		it('aria attributes', () => {
			fixture.detectChanges();
			const dialogEl: Element =
				fixture.nativeElement.querySelector('.hub-modal__dialog');

			expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
			expect(dialogEl.getAttribute('role')).toBe('document');
		});

		it('should render modal dialog with a specified class', () => {
			fixture.componentRef.setInput(
				'modalDialogClass',
				'custom-dialog-class'
			);
			fixture.detectChanges();

			const dialogEl: Element =
				fixture.nativeElement.querySelector('.hub-modal__dialog');
			expect(dialogEl).toHaveClass('hub-modal__dialog');
			expect(dialogEl).toHaveClass('custom-dialog-class');
		});
	});
});
