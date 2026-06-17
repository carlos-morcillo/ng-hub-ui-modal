import { NgZone } from '@angular/core';
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

    it('should render correct CSS classes for animations', async () => {
        const fixture = TestBed.createComponent(HubModalBackdrop);
        fixture.componentRef.setInput('animation', true);

        fixture.detectChanges();

        // `ngOnInit` defers adding the `show` class until `NgZone.onStable`
        // emits. The unit-test environment is zoneless, so the injected
        // `NgZone` (NoopNgZone) never fires `onStable` on its own. Emit it
        // manually to simulate the zone settling, exactly as zone.js would,
        // so the deferred class is applied before asserting.
        const zone = TestBed.inject(NgZone);
        zone.onStable.emit(null);
        await fixture.whenStable();

        expect(fixture.nativeElement.classList.contains('show')).toBe(true);
        expect(fixture.nativeElement.classList.contains('fade')).toBe(true);
    });
});
