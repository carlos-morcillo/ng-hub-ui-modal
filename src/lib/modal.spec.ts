import type { MockedObject } from "vitest";
import { EventEmitter, Injector, TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HubModalConfig, HubModalOptions } from './modal-config';
import { HubModalPlacement } from './modal-placement';
import { HubModalRef } from './modal-ref';
import { HubModalStack } from './modal-stack';
import { HubModal } from './modal';

describe('HubModal', () => {
    let service: HubModal;
    let injector: Injector;
    let modalStack: Pick<MockedObject<HubModalStack>, 'open' | 'dismissAll' | 'hasOpenModals'> & {
        activeInstances: EventEmitter<HubModalRef<any>[]>;
    };
    let modalConfig: HubModalConfig;

    beforeEach(() => {
        modalStack = {
            open: vi.fn().mockName("HubModalStack.open"),
            dismissAll: vi.fn().mockName("HubModalStack.dismissAll"),
            hasOpenModals: vi.fn().mockName("HubModalStack.hasOpenModals"),
            activeInstances: new EventEmitter<HubModalRef<any>[]>()
        };
        modalConfig = new HubModalConfig();

        TestBed.configureTestingModule({
            providers: [
                HubModal,
                { provide: HubModalStack, useValue: modalStack as unknown as HubModalStack },
                { provide: HubModalConfig, useValue: modalConfig }
            ]
        });

        service = TestBed.inject(HubModal);
        injector = TestBed.inject(Injector);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should delegate opening to the stack with merged config options', () => {
        const modalRef = {} as HubModalRef<TemplateRef<unknown>>;
        const template = {} as TemplateRef<unknown>;
        const options: HubModalOptions = {
            size: 'lg',
            windowClass: 'custom-window',
            placement: HubModalPlacement.End
        };

        modalConfig.animation = false;
        modalConfig.backdrop = 'static';
        modalStack.open.mockReturnValue(modalRef);

        const result = service.open(template, options);

        expect(result).toBe(modalRef);
        expect(modalStack.open).toHaveBeenCalledWith(injector, template, expect.objectContaining({
            animation: false,
            backdrop: 'static',
            placement: HubModalPlacement.End,
            size: 'lg',
            windowClass: 'custom-window'
        }));
    });

    it('should expose activeInstances from the stack', async () => {
        service.activeInstances.subscribe((instances) => {
            expect(instances).toEqual([]);
            ;
        });
        modalStack.activeInstances.emit([]);
    });

    it('should delegate dismissAll to the stack', () => {
        service.dismissAll('cancel');
        expect(modalStack.dismissAll).toHaveBeenCalledWith('cancel');
    });

    it('should delegate hasOpenModals to the stack', () => {
        modalStack.hasOpenModals.mockReturnValue(true);
        expect(service.hasOpenModals()).toBe(true);
        expect(modalStack.hasOpenModals).toHaveBeenCalled();
    });
});
