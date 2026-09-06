import { NgModule } from '@angular/core';
import { HubModal } from './modal';
export { HubModal } from './modal';
export { HubModalConfig } from './modal-config';
export type { HubModalOptions, HubModalUpdatableOptions } from './modal-config';
export { ModalDismissReasons } from './modal-dismiss-reasons';
export { HubModalPlacement } from './modal-placement';
export { HUB_MODAL_DATA, HubActiveModal, HubModalRef } from './modal-ref';

/**
 * Backward-compatibility module kept for NgModule-based applications.
 *
 * @deprecated Inject `HubModal` directly. It is `providedIn: 'root'`, so this module adds
 * nothing an application does not already have; importing it only creates a redundant second
 * instance in that injector, delegating to the same root `HubModalStack` and `HubModalConfig`.
 * Scheduled for removal in **23.0.0**.
 */
@NgModule({ providers: [HubModal] })
export class HubModalModule {}
