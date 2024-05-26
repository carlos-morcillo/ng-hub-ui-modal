// import {
// 	Component,
// 	inject,
// 	Injectable,
// 	NgModule,
// 	OnDestroy
// } from '@angular/core';
// import { HubModal } from './modal';
// import { HubModalModule } from './modal.module';
// import { RouterModule } from '@angular/router';

// @Injectable()
// class LazyService {
// 	get text() {
// 		return 'lazy modal';
// 	}
// }

// @Component({ template: '{{ lazyService.text }}' })
// class LazyModalContent {
// 	constructor(public lazyService: LazyService) {}
// }

// @Component({ template: 'child' })
// class LazyComponent implements OnDestroy {
// 	private _ref = inject(HubModal).open(LazyModalContent);

// 	ngOnDestroy() {
// 		this._ref.close();
// 	}
// }

// @NgModule({
// 	declarations: [LazyComponent, LazyModalContent],
// 	providers: [LazyService],
// 	imports: [
// 		HubModalModule,
// 		RouterModule.forChild([
// 			{
// 				path: '',
// 				component: LazyComponent
// 			}
// 		])
// 	]
// })
// export default class LazyModule {}
