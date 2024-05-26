import { NgModule } from '@angular/core';
import { HubModal } from './modal';
export { HubModal } from './modal';
export {
	HubModalConfig,
	HubModalOptions,
	HubModalUpdatableOptions
} from './modal-config';
export { HubModalRef, HubActiveModal } from './modal-ref';
export { ModalDismissReasons } from './modal-dismiss-reasons';

@NgModule({ providers: [HubModal] })
export class HubModalModule {}
