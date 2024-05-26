import { inject } from '@angular/core/testing';

import { HubModalConfig } from './modal-config';
import { HubConfig } from '../hub-config';

describe('HubModalConfig', () => {
	it('should have sensible default values', inject(
		[HubModalConfig, HubConfig],
		(config: HubModalConfig, hubConfig: HubConfig) => {
			expect(config.animation).toBe(hubConfig.animation);
			expect(config.ariaLabelledBy).toBeUndefined();
			expect(config.ariaLabelledBy).toBeUndefined();
			expect(config.ariaDescribedBy).toBeUndefined();
			expect(config.backdrop).toBe(true);
			expect(config.backdropClass).toBeUndefined();
			expect(config.beforeDismiss).toBeUndefined();
			expect(config.centered).toBeUndefined();
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
