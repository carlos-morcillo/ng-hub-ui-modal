import { Injectable, Injector } from '@angular/core';
// import { HubConfig } from '../hub-config';

/**
 * Options available when opening new modal windows with `HubModal.open()` method.
 */
export interface HubModalOptions {
	/**
	 * If `true`, modal opening and closing will be animated.
	 *
	 * @since 8.0.0
	 */
	animation?: boolean;

	/**
	 * `aria-labelledby` attribute value to set on the modal window.
	 *
	 * @since 2.2.0
	 */
	ariaLabelledBy?: string;

	/**
	 * `aria-describedby` attribute value to set on the modal window.
	 *
	 * @since 6.1.0
	 */
	ariaDescribedBy?: string;

	/**
	 * If `true`, the backdrop element will be created for a given modal.
	 *
	 * Alternatively, specify `'static'` for a backdrop which doesn't close the modal on click.
	 *
	 * Default value is `true`.
	 */
	backdrop?: boolean | 'static';

	/**
	 * Callback right before the modal will be dismissed.
	 *
	 * If this function returns:
	 * * `false`
	 * * a promise resolved with `false`
	 * * a promise that is rejected
	 *
	 * then the modal won't be dismissed.
	 */
	beforeDismiss?: () => boolean | Promise<boolean>;

	/**
	 * If `true`, the modal will be centered vertically.
	 *
	 * Default value is `false`.
	 *
	 * @since 1.1.0
	 */
	centered?: boolean;

	/**
	 * A selector specifying the element all new modal windows should be appended to.
	 * Since v5.3.0 it is also possible to pass the reference to an `HTMLElement`.
	 *
	 * If not specified, will be `body`.
	 */
	container?: string | HTMLElement;

	/**
	 * If `true` modal will always be displayed in fullscreen mode.
	 *
	 * For values like `'md'` it means that modal will be displayed in fullscreen mode
	 * only if the viewport width is below `'md'`. For custom strings (ex. when passing `'mysize'`)
	 * it will add a `'modal-fullscreen-mysize-down'` class.
	 *
	 * If not specified will be `false`.
	 *
	 * @since 12.1.0
	 */
	fullscreen?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string;

	/**
	 * The `Injector` to use for modal content.
	 */
	injector?: Injector;

	/**
	 * If `true`, the modal will be closed when `Escape` key is pressed
	 *
	 * Default value is `true`.
	 */
	keyboard?: boolean;

	/**
	 * Scrollable modal content (false by default).
	 *
	 * @since 5.0.0
	 */
	scrollable?: boolean;

	/**
	 * Size of a new modal window.
	 */
	size?: 'sm' | 'lg' | 'xl' | string;

	/**
	 * A custom class to append to the modal window.
	 */
	windowClass?: string;

	/**
	 * A custom class to append to the modal dialog.
	 *
	 * @since 9.1.0
	 */
	modalDialogClass?: string;

	/**
	 * A custom class to append to the modal backdrop.
	 *
	 * @since 1.1.0
	 */
	backdropClass?: string;

	/**
	 * Allows to specify a custom selector for the header element of the modal window. This can be useful if you want to target
	 * a specific element within the modal to act as the header, for example, to apply custom styling or functionality to it. By
	 * providing a CSS selector string, you can target the desired	header element within the modal content.
	 */
	headerSelector?: string;

	/**
	 * Allows to specify a custom selector for the footer element of the modal window. This can be useful if you want to target
	 * a specific element within the modal to act as the footer, for example, to apply custom styling or functionality to it. By
	 * providing a CSS selector string, you can target the desired footer element within the modal content.
	 */
	footerSelector?: string;

	/** Used to specify a custom selector for elements that can trigger the dismissal of the modal window. By providing a CSS selector
	 * string for `dismissSelector`, you can target specific elements within the modal content that, when interacted with (e.g., clicked),
	 * will close or dismiss the modal window.
	 */
	dismissSelector?: string;

	/**
	 * Used to specify a custom selector for elements that can trigger the closing of the modal window. By providing a CSS selector
	 * string for `closeSelector`, you can target specific elements within the modal content that, when interacted with (e.g., clicked),
	 * will close the modal window. This allows for customization of the elements that can act as close buttons for the modal.
	 */
	closeSelector?: string;

	/** Used to store any additional data that needs to be passed to the modal window when it is opened. This property allows you
	 * to provide custom data to the modal component, which can then be accessed and utilized within the modal content or logic.
	 * It provides flexibility for passing dynamic information to the modal window based on the specific use case or requirements.
	 */
	data?: any;
}

/**
 * Options that can be changed on an opened modal with `HubModalRef.update()` and `HubActiveModal.update()` methods.
 *
 * @since 14.2.0
 */
export type HubModalUpdatableOptions = Pick<
	HubModalOptions,
	| 'ariaLabelledBy'
	| 'ariaDescribedBy'
	| 'centered'
	| 'fullscreen'
	| 'backdropClass'
	| 'size'
	| 'windowClass'
	| 'modalDialogClass'
>;

/**
 * A configuration service for the [`HubModal`](#/components/modal/api#HubModal) service.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all modals used in the application.
 *
 * @since 3.1.0
 */
@Injectable({ providedIn: 'root' })
export class HubModalConfig implements Required<HubModalOptions> {
	// private _hubConfig = inject(HubConfig);
	private _animation: boolean;

	ariaLabelledBy: string;
	ariaDescribedBy: string;
	backdrop: boolean | 'static' = true;
	beforeDismiss: () => boolean | Promise<boolean>;
	centered: boolean;
	container: string | HTMLElement;
	fullscreen: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean | string = false;
	injector: Injector;
	keyboard = true;
	scrollable: boolean;
	size: 'sm' | 'lg' | 'xl' | string;
	windowClass: string;
	modalDialogClass: string;
	backdropClass: string;
	headerSelector: string;
	footerSelector: string;
	dismissSelector: string = '[data-dismiss="modal"]';
	closeSelector: string = '[data-close="modal"]';
	data: any;

	get animation(): boolean {
		return this._animation ?? true /* this._hubConfig.animation */;
	}
	set animation(animation: boolean) {
		this._animation = animation;
	}
}
