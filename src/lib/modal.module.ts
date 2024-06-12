import { NgModule } from '@angular/core';
import { HubModal } from './modal';
export { HubModal } from './modal';
export {
	HubModalConfig,
	HubModalOptions,
	HubModalUpdatableOptions
} from './modal-config';
export { ModalDismissReasons } from './modal-dismiss-reasons';
export { HubActiveModal, HubModalRef } from './modal-ref';

@NgModule({ providers: [HubModal] })
export class HubModalModule {}
