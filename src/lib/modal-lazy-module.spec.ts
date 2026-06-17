import { Component, inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubModal } from './modal';
import { HubModalModule } from './modal.module';

/**
 * Service provided locally to emulate a lazily-loaded feature scope. It proves
 * that dependencies declared alongside a lazily-loaded modal feature are
 * resolvable from the components that compose that feature.
 */
@Injectable({ providedIn: 'root' })
class LazyService {
	get text(): string {
		return 'lazy modal';
	}
}

/**
 * Content component that would be rendered inside the modal. It resolves its
 * text from the lazily-scoped service, mirroring how lazily-loaded modal
 * content obtains its dependencies through Angular's injector.
 */
@Component({ standalone: true, template: '{{ lazyService.text }}' })
class LazyModalContent {
	readonly lazyService = inject(LazyService);
}

describe('modal lazy module', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HubModalModule, LazyModalContent],
			providers: [LazyService]
		});
	});

	it('exposes the HubModal service from the modal module', () => {
		const modal = TestBed.inject(HubModal);
		expect(modal).toBeTruthy();
	});

	it('reports no open modals before any modal is opened', () => {
		const modal = TestBed.inject(HubModal);
		expect(modal.hasOpenModals()).toBe(false);
	});

	it('resolves lazily-scoped dependencies for modal content components', () => {
		const fixture = TestBed.createComponent(LazyModalContent);
		fixture.detectChanges();

		expect(fixture.componentInstance.lazyService).toBeInstanceOf(LazyService);
		expect(fixture.nativeElement.textContent).toContain('lazy modal');
	});

	it('opens a modal and renders its window without throwing', () => {
		const modal = TestBed.inject(HubModal);

		// `open()` applies the window options (including the default
		// `animation: true`) through `setInput` and runs change detection
		// internally. The window's host binding `[class.fade]="animation()"`
		// requires the input to remain a signal.
		const ref = modal.open(LazyModalContent);

		expect(modal.hasOpenModals()).toBe(true);

		const windowEl = document.querySelector('.hub-modal');
		expect(windowEl).not.toBeNull();
		expect(windowEl?.classList.contains('fade')).toBe(true);

		ref.close();
	});

	it('honours a custom windowClass option through setInput', () => {
		const modal = TestBed.inject(HubModal);

		const ref = modal.open(LazyModalContent, { windowClass: 'my-custom-modal' });

		const windowEl = document.querySelector('.hub-modal');
		expect(windowEl?.classList.contains('my-custom-modal')).toBe(true);

		ref.close();
	});
});
