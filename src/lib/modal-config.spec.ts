import { inject } from '@angular/core/testing';

import { HubModalConfig } from './modal-config';
import { HubModalPlacement } from './modal-placement';

describe('HubModalConfig', () => {
	it('should have sensible default values', inject(
		[HubModalConfig],
		(config: HubModalConfig) => {
			expect(config.animation).toBe(true);
			expect(config.ariaLabelledBy).toBeUndefined();
			expect(config.ariaLabelledBy).toBeUndefined();
			expect(config.ariaDescribedBy).toBeUndefined();
			expect(config.backdrop).toBe(true);
			expect(config.backdropClass).toBeUndefined();
			expect(config.beforeDismiss).toBeUndefined();
			expect(config.centered).toBeUndefined();
			expect(config.placement).toBe(HubModalPlacement.Center);
			expect(config.container).toBeUndefined();
			expect(config.injector).toBeUndefined();
			expect(config.fullscreen).toBe(false);
			expect(config.keyboard).toBe(true);
			expect(config.scrollable).toBeUndefined();
			expect(config.size).toBeUndefined();
			expect(config.windowClass).toBeUndefined();
		}
	));
});
