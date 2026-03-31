# ng-hub-ui-modal

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-modal.svg)](https://www.npmjs.com/package/ng-hub-ui-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.io)

> A standalone, fully-featured Angular modal library with flexible content projection, placement support, and full CSS variable theming. No Bootstrap or ng-bootstrap dependency required.

> **⚠️ WARNING: BREAKING CHANGES IN VERSION 21.0.0**
> If you are upgrading from `1.x.x` to `21.x.x` and you have overridden the `.modal` or `.modal-dialog` CSS classes in your global stylesheets, please review the [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) document to migrate your styles to the new `hub-modal` BEM classes.

---

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**➡️ ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal) ← _you are here_
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
    - [Open with TemplateRef](#open-with-templateref)
    - [Open with Component](#open-with-component)
    - [Open with String](#open-with-string)
    - [Placement](#placement)
    - [Size and Fullscreen](#size-and-fullscreen)
    - [Scrollable Content](#scrollable-content)
    - [Static Backdrop](#static-backdrop)
    - [Before Dismiss Guard](#before-dismiss-guard)
    - [HubActiveModal in Content Component](#hubactivemodal-in-content-component)
    - [Dismiss and Close Selectors](#dismiss-and-close-selectors)
    - [Multiple Stacked Modals](#multiple-stacked-modals)
    - [Observables: dismissAll and hasOpenModals](#observables-dismissall-and-hasopenmodals)
- [API Reference](#api-reference)
    - [HubModal Service](#hubmodal-service)
    - [HubModalRef](#hubmodalref)
    - [HubActiveModal](#hubactivemodal-1)
    - [HubModalOptions](#hubmodaloptions)
    - [HubModalUpdatableOptions](#hubmodalupdatableoptions)
    - [HubModalPlacement](#hubmodalplacement-1)
    - [ModalDismissReasons](#modaldismissreasons)
    - [HubModalConfig](#hubmodalconfig)
- [Styling](#styling)
- [Contributing](#contributing)
- [Support & License](#support--license)

---

## Features

- **Zero external dependencies**: No ng-bootstrap, no Bootstrap JS.
- **Three content types**: Open modals with a `TemplateRef`, a `Component` class, or a plain `string`.
- **Flexible content projection**: Use CSS selectors to route content to `header`, `body`, and `footer` slots.
- **Placement support**: Anchor modals to any viewport edge — `start`, `end`, `top`, `bottom` — or keep them `center`.
- **Modal stacking**: Open multiple modals; focus management and aria-hidden are handled automatically.
- **Programmatic dismiss/close guards**: The `beforeDismiss` callback lets you intercept and prevent dismissal.
- **Full keyboard & backdrop interaction**: ESC key, static backdrop, backdrop click — all configurable.
- **CSS Variable theming**: Deep customization without overriding internal classes.
- **BEM class architecture**: All structural classes use the `hub-modal__*` prefix to avoid conflicts.
- **Lifecycle Observables**: `shown`, `hidden`, `closed`, `dismissed` streams for precise reactive flow.
- **Global defaults**: Inject `HubModalConfig` to set application-wide defaults.

---

## Installation

```bash
npm install ng-hub-ui-modal
```

---

## Quick Start

### Standalone (recommended)

```typescript
import { Component, inject, TemplateRef } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';

@Component({
	selector: 'app-root',
	standalone: true,
	template: `
		<button (click)="open(tpl)">Open Modal</button>

		<ng-template #tpl let-close="close">
			<div class="hub-modal__header"><h5>Hello!</h5></div>
			<div class="hub-modal__body">Modal content goes here.</div>
			<div class="hub-modal__footer">
				<button (click)="close('done')">Close</button>
			</div>
		</ng-template>
	`
})
export class AppComponent {
	private modal = inject(HubModal);

	open(tpl: TemplateRef<unknown>) {
		this.modal
			.open(tpl, { headerSelector: '.hub-modal__header', footerSelector: '.hub-modal__footer' })
			.result.catch(() => {});
	}
}
```

### NgModule (classic)

```typescript
import { HubModalModule } from 'ng-hub-ui-modal';

@NgModule({
	imports: [HubModalModule]
})
export class AppModule {}
```

---

## Examples

### Open with TemplateRef

Open a modal whose content is defined inline as a template.
The template context exposes `close` and `dismiss` functions.

```typescript
import { Component, inject, TemplateRef } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';

@Component({
	selector: 'app-example',
	standalone: true,
	template: `
		<button (click)="open(tpl)">Open Template Modal</button>

		<ng-template #tpl let-close="close" let-dismiss="dismiss">
			<div class="hub-modal__body">
				<p>This is a template modal.</p>
				<button (click)="dismiss('cancel')">Cancel</button>
				<button (click)="close('ok')">OK</button>
			</div>
		</ng-template>
	`
})
export class TemplateModalComponent {
	private modal = inject(HubModal);

	open(tpl: TemplateRef<unknown>) {
		this.modal
			.open(tpl)
			.result.then((result) => console.log('Closed with', result))
			.catch((reason) => console.log('Dismissed:', reason));
	}
}
```

---

### Open with Component

Pass any Angular component class to display it inside the modal.
The component can inject `HubActiveModal` to close or dismiss the modal from within.

```typescript
import { Component, inject } from '@angular/core';
import { HubModal, HubActiveModal } from 'ng-hub-ui-modal';

/** Content component displayed inside the modal */
@Component({
	selector: 'app-confirm-dialog',
	standalone: true,
	template: `
		<div class="hub-modal__header"><h5>Confirm action</h5></div>
		<div class="hub-modal__body">Are you sure you want to proceed?</div>
		<div class="hub-modal__footer">
			<button (click)="activeModal.dismiss('no')">Cancel</button>
			<button (click)="activeModal.close(true)">Confirm</button>
		</div>
	`
})
export class ConfirmDialogComponent {
	activeModal = inject(HubActiveModal);
}

/** Host component that opens the modal */
@Component({ selector: 'app-host', standalone: true, template: `<button (click)="openConfirm()">Delete</button>` })
export class HostComponent {
	private modal = inject(HubModal);

	openConfirm() {
		this.modal
			.open(ConfirmDialogComponent, {
				headerSelector: '.hub-modal__header',
				footerSelector: '.hub-modal__footer'
			})
			.result.then((confirmed) => {
				if (confirmed) {
					/* perform deletion */
				}
			})
			.catch(() => {});
	}
}
```

---

### Open with String

Display a quick text message without any additional component or template.

```typescript
this.modal.open('This is a simple string modal.');
```

---

### Placement

Anchor the modal to any edge of the viewport using `HubModalPlacement`.

```typescript
import { HubModal, HubModalPlacement } from 'ng-hub-ui-modal';

// Right side panel
this.modal.open(MyComponent, { placement: HubModalPlacement.End });

// Bottom sheet
this.modal.open(MyComponent, { placement: HubModalPlacement.Bottom });

// Left drawer, vertically centered
this.modal.open(MyComponent, {
	placement: HubModalPlacement.Start,
	centered: true
});
```

| Value                      | Effect                        |
| -------------------------- | ----------------------------- |
| `HubModalPlacement.Center` | Centred in viewport (default) |
| `HubModalPlacement.Start`  | Left-anchored drawer          |
| `HubModalPlacement.End`    | Right-anchored drawer         |
| `HubModalPlacement.Top`    | Top sheet                     |
| `HubModalPlacement.Bottom` | Bottom sheet                  |

---

### Size and Fullscreen

```typescript
// Predefined sizes
this.modal.open(MyComponent, { size: 'sm' }); // 'sm' | 'lg' | 'xl'

// Always fullscreen
this.modal.open(MyComponent, { fullscreen: true });

// Fullscreen only below 'md' breakpoint
this.modal.open(MyComponent, { fullscreen: 'md' });
```

---

### Scrollable Content

When the modal content overflows, enable internal scrolling.

```typescript
this.modal.open(LongContentComponent, { scrollable: true });
```

---

### Static Backdrop

Prevent dismissal when clicking outside the modal.

```typescript
this.modal.open(MyComponent, { backdrop: 'static' });

// Also disable ESC key
this.modal.open(MyComponent, { backdrop: 'static', keyboard: false });
```

---

### Before Dismiss Guard

Use `beforeDismiss` to prevent or delay modal closure, e.g. to show a confirmation first.

```typescript
this.modal.open(MyFormComponent, {
	beforeDismiss: () => {
		if (this.formIsDirty) {
			return confirm('You have unsaved changes. Really close?');
		}
		return true;
	}
});

// Async guard using a Promise
this.modal.open(MyComponent, {
	beforeDismiss: () => this.confirmService.ask('Discard changes?')
});
```

---

### HubActiveModal in Content Component

Inject `HubActiveModal` into any component used as modal content to control it from within.

```typescript
import { Component, inject } from '@angular/core';
import { HubActiveModal, HubModalUpdatableOptions } from 'ng-hub-ui-modal';

@Component({
	selector: 'app-my-modal',
	standalone: true,
	template: `
		<div class="hub-modal__body">
			<button (click)="save()">Save</button>
			<button (click)="cancel()">Cancel</button>
		</div>
	`
})
export class MyModalComponent {
	activeModal = inject(HubActiveModal);

	save() {
		this.activeModal.close({ saved: true });
	}

	cancel() {
		this.activeModal.dismiss('user_cancelled');
	}
}
```

---

### Dismiss and Close Selectors

Automatically bind dismiss/close behaviour to DOM elements inside the modal content using CSS selectors.

```typescript
this.modal.open(MyComponent, {
	dismissSelector: '[data-dismiss="modal"]',
	closeSelector: '[data-close="modal"]'
});
```

```html
<!-- Inside MyComponent template -->
<button data-dismiss="modal">Cancel</button>
<button data-close="modal">OK</button>
```

---

### Multiple Stacked Modals

Open modals from within a modal — the stack is managed automatically and focus is trapped to the topmost one.

```typescript
@Component({ ... })
export class ParentModalComponent {
  private modal = inject(HubModal);

  openNested() {
    this.modal.open(ChildModalComponent);
  }
}
```

---

### Observables: dismissAll and hasOpenModals

Use the service methods to interact with the entire modal stack.

```typescript
import { HubModal } from 'ng-hub-ui-modal';

export class AppComponent {
	private modal = inject(HubModal);

	closeAll() {
		this.modal.dismissAll('route_change');
	}

	get anyOpen(): boolean {
		return this.modal.hasOpenModals();
	}
}
```

Listen to `activeInstances` for reactive updates:

```typescript
this.modal.activeInstances.subscribe((refs) => {
	console.log(`${refs.length} modals open`);
});
```

---

## API Reference

### HubModal Service

The main entry point for opening and managing modals.

| Method            | Signature                              | Description                                           |
| ----------------- | -------------------------------------- | ----------------------------------------------------- |
| `open`            | `open(content, options?): HubModalRef` | Opens a new modal with the given content and options. |
| `dismissAll`      | `dismissAll(reason?): void`            | Dismisses all currently open modals.                  |
| `hasOpenModals`   | `hasOpenModals(): boolean`             | Returns `true` if at least one modal is open.         |
| `activeInstances` | `EventEmitter<HubModalRef[]>`          | Emits whenever the stack of open modals changes.      |

---

### HubModalRef

A reference to an open modal returned by `HubModal.open()`.

| Member              | Type               | Description                                                 |
| ------------------- | ------------------ | ----------------------------------------------------------- |
| `result`            | `Promise<any>`     | Resolves on `close()`, rejects on `dismiss()`.              |
| `componentInstance` | `T \| void`        | Instance of the content component (if used).                |
| `close(result?)`    | `void`             | Closes the modal and resolves `result`.                     |
| `dismiss(reason?)`  | `void`             | Dismisses the modal and rejects `result`.                   |
| `update(options)`   | `void`             | Updates modal options after opening.                        |
| `closed`            | `Observable<any>`  | Emits when the modal is closed via `close()`.               |
| `dismissed`         | `Observable<any>`  | Emits when dismissed via `dismiss()` or user interaction.   |
| `shown`             | `Observable<void>` | Emits once the open animation finishes.                     |
| `hidden`            | `Observable<void>` | Emits once the close animation finishes and DOM is removed. |

---

### HubActiveModal

Inject into your content component to control the modal from within.

| Method             | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `close(result?)`   | Closes the modal with an optional result.            |
| `dismiss(reason?)` | Dismisses the modal with an optional reason.         |
| `update(options)`  | Updates live options (same as `HubModalRef.update`). |

---

### HubModalOptions

All options accepted by `HubModal.open()`.

| Option             | Type                                                         | Default                  | Description                                                 |
| ------------------ | ------------------------------------------------------------ | ------------------------ | ----------------------------------------------------------- |
| `animation`        | `boolean`                                                    | `true`                   | Enables fade in/out transitions.                            |
| `ariaLabelledBy`   | `string`                                                     | —                        | ID of the element that labels the modal.                    |
| `ariaDescribedBy`  | `string`                                                     | —                        | ID of the element that describes the modal.                 |
| `backdrop`         | `boolean \| 'static'`                                        | `true`                   | `false` = no backdrop, `'static'` = click does not close.   |
| `beforeDismiss`    | `() => boolean \| Promise<boolean>`                          | —                        | Guard called before dismissal. Return `false` to cancel.    |
| `centered`         | `boolean`                                                    | `false`                  | Centers modal on the cross-axis for side placements.        |
| `placement`        | `HubModalPlacement`                                          | `Center`                 | Viewport anchor for the modal.                              |
| `container`        | `string \| HTMLElement`                                      | `body`                   | CSS selector or element to which modals are appended.       |
| `fullscreen`       | `boolean \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| string` | `false`                  | Fullscreen always or below a specific breakpoint.           |
| `injector`         | `Injector`                                                   | —                        | Custom injector for content component dependencies.         |
| `keyboard`         | `boolean`                                                    | `true`                   | Whether ESC key dismisses the modal.                        |
| `scrollable`       | `boolean`                                                    | `false`                  | Makes the modal body scroll internally.                     |
| `size`             | `'sm' \| 'lg' \| 'xl' \| string`                             | —                        | Controls the width of the modal dialog.                     |
| `windowClass`      | `string`                                                     | —                        | Extra class added to the `hub-modal` host element.          |
| `modalDialogClass` | `string`                                                     | —                        | Extra class added to the `hub-modal__dialog` element.       |
| `backdropClass`    | `string`                                                     | —                        | Extra class added to the `hub-modal__backdrop` element.     |
| `headerSelector`   | `string`                                                     | —                        | CSS selector for nodes to project into the header slot.     |
| `footerSelector`   | `string`                                                     | —                        | CSS selector for nodes to project into the footer slot.     |
| `dismissSelector`  | `string`                                                     | `[data-dismiss="modal"]` | Selector for elements that auto-dismiss the modal on click. |
| `closeSelector`    | `string`                                                     | `[data-close="modal"]`   | Selector for elements that auto-close the modal on click.   |
| `data`             | `any`                                                        | —                        | Arbitrary data bound to the content component instance.     |

---

### HubModalUpdatableOptions

A subset of `HubModalOptions` that can be updated on an already-open modal via `HubModalRef.update()`.

`ariaLabelledBy`, `ariaDescribedBy`, `centered`, `placement`, `fullscreen`, `backdropClass`, `size`, `windowClass`, `modalDialogClass`.

---

### HubModalPlacement

```typescript
import { HubModalPlacement } from 'ng-hub-ui-modal';
```

| Value                      | CSS class applied             | Description                              |
| -------------------------- | ----------------------------- | ---------------------------------------- |
| `HubModalPlacement.Center` | _(none)_                      | Modal centred in the viewport (default). |
| `HubModalPlacement.Start`  | `hub-modal--placement-start`  | Left edge anchor.                        |
| `HubModalPlacement.End`    | `hub-modal--placement-end`    | Right edge anchor.                       |
| `HubModalPlacement.Top`    | `hub-modal--placement-top`    | Top edge anchor.                         |
| `HubModalPlacement.Bottom` | `hub-modal--placement-bottom` | Bottom edge anchor.                      |

---

### ModalDismissReasons

Built-in dismiss reason constants.

```typescript
import { ModalDismissReasons } from 'ng-hub-ui-modal';

modalRef.dismissed.subscribe((reason) => {
	if (reason === ModalDismissReasons.ESC) {
		/* ESC key */
	}
	if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		/* backdrop */
	}
});
```

---

### HubModalConfig

Inject `HubModalConfig` to provide application-wide default options.

```typescript
import { HubModalConfig } from 'ng-hub-ui-modal';

@Injectable({ providedIn: 'root' })
export class AppModalDefaults {
	constructor(config: HubModalConfig) {
		config.animation = true;
		config.keyboard = false;
		config.backdrop = 'static';
	}
}
```

---

## Styling

The library publishes a self-contained stylesheet. Import it once in your application:

```scss
@import 'ng-hub-ui-modal/src/lib/modal.scss';
```

### CSS Variables

All visual aspects are controlled via `--hub-modal-*` tokens.
Full reference: [docs/css-variables-reference.md](./docs/css-variables-reference.md)

**Quick reference (most common tokens):**

| Variable                       | Default            | Description               |
| ------------------------------ | ------------------ | ------------------------- |
| `--hub-modal-max-width`        | `500px`            | Max dialog width          |
| `--hub-modal-border-radius`    | `0.5rem`           | Dialog corner radius      |
| `--hub-modal-bg`               | system surface     | Background color          |
| `--hub-modal-color`            | system text        | Text color                |
| `--hub-modal-padding-x`        | `1rem`             | Content horizontal padding|
| `--hub-modal-padding-y`        | `1rem`             | Content vertical padding  |
| `--hub-modal-backdrop-opacity` | `0.5`              | Backdrop opacity          |
| `--hub-modal-transition`       | `0.2s ease-in-out` | Animation speed           |

### Customization Example

```scss
/* Override at the host element level */
hub-modal-window {
	--hub-modal-max-width: 720px;
	--hub-modal-border-radius: 1rem;
	--hub-modal-backdrop-opacity: 0.7;
}
```

### Bootstrap Integration (optional)

```scss
hub-modal-window {
	--hub-modal-bg: var(--bs-body-bg);
	--hub-modal-color: var(--bs-body-color);
	--hub-modal-border-color: var(--bs-border-color);
}
```

### BEM Class Reference

| Class                            | Element               |
| -------------------------------- | --------------------- |
| `.hub-modal`                     | Modal window host     |
| `.hub-modal__backdrop`           | Backdrop overlay      |
| `.hub-modal__dialog`             | Dialog container      |
| `.hub-modal__content`            | Content wrapper       |
| `.hub-modal__header`             | Header region         |
| `.hub-modal__body`               | Body region           |
| `.hub-modal__footer`             | Footer region         |
| `.hub-modal__close`              | Built-in close button |
| `.hub-modal--placement-{value}`  | Placement modifier    |
| `.hub-modal__dialog--centered`   | Vertical centering    |
| `.hub-modal__dialog--scrollable` | Scrollable body       |
| `.hub-modal__dialog--fullscreen` | Fullscreen modifier   |

---

## Contributing

### Development Setup

```bash
git clone https://github.com/carlos-morcillo/ng-hub-ui-modal.git
cd ng-hub-ui-modal
npm install
```

Build the library in watch mode:

```bash
ng build modal --watch
```

Serve the demo application:

```bash
ng serve
```

### Testing

```bash
ng test modal
```

### Commit Guidelines

Commits follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat(modal): add new placement option
fix(modal): correct backdrop z-index
docs(modal): update CSS variable table
```

---

## Support & License

If this library saves you time, consider supporting further development:

☕ [Buy me a coffee](https://www.buymeacoffee.com/carlosmorcillo)

**MIT License** — © [Carlos Morcillo](https://github.com/carlos-morcillo)
