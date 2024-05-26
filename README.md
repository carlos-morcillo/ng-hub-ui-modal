# ng-hub-ui-modal

This library provides a decoupled and independent modal component, originally based on the modals from ng-bootstrap but with additional features and flexibility. It aims to offer a more versatile and customizable modal solution for Angular applications.

## Motivation

The main motivation behind the development of this library was to decouple the modal component from ng-bootstrap, allowing it to be used autonomously without relying on the entire ng-bootstrap library. Additionally, new functionalities and customization options have been introduced to better suit the needs of different projects.

## Features

- **Standalone Modal Component**: No need to install ng-bootstrap or any other additional dependencies.
- **Bootstrap-based Styling**: While using its own CSS classes, the modal's appearance follows Bootstrap's design guidelines, making it easier to customize.
- **Flexible Content Projection**: Instead of projecting all content into a single `ng-content`, this library allows defining CSS selectors to project content into different parts of the modal (header, body, footer).
- **Customizable Dismiss Triggers**: You can define a CSS selector for elements that will act as dismiss triggers for the modal.
- **Data Binding to Modal Component**: It's possible to pass additional data to the modal component through the configuration options.
- **New Control Methods**: Methods have been added to show and hide the modal on demand.

## Installation

```
npm install ng-hub-ui-modal
```

## Usage

1. Import the `ModalModule` into your Angular module:

```typescript
import { ModalModule } from 'ng-hub-ui-modal';

@NgModule({
  imports: [
    // ...
    ModalModule
  ]
})
export class AppModule {}
```

2. Inject the `ModalService` into your component:

```typescript
import { ModalService } from 'ng-hub-ui-modal';

@Component({...})
export class MyComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    const modalRef = this.modalService.open(MyModalComponent, {
      headerSelector: '.modal-header',
      footerSelector: '.modal-footer',
      dismissSelector: '[data-dismiss="modal"]',
      data: { /* additional data */ }
    });
  }
}
```

3. Define the modal component:

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Modal Title</h4>
    </div>
    <div class="modal-body">
      Modal Body
    </div>
    <div class="modal-footer">
      <button type="button" data-dismiss="modal">Close</button>
    </div>
  `
})
export class MyModalComponent {}
```

## Documentation

### ModalService

The `ModalService` is the main entry point for creating and managing modals in your application.

#### `open(component, options?)`

Opens a new modal instance with the provided component and options.

**Arguments:**
- `component` (`ComponentType<any>`): The component to be displayed in the modal.
- `options` (`ModalOptions` | *optional*): An object containing the configuration options for the modal.

**Returns:** `ModalRef`

#### `ModalOptions`

The `ModalOptions` object allows you to configure various aspects of the modal.

- `headerSelector` (`string` | *optional*): A CSS selector for the header section of the modal content. Any elements matching this selector will be projected into the modal header.
- `bodySelector` (`string` | *optional*): A CSS selector for the body section of the modal content. Any elements matching this selector will be projected into the modal body.
- `footerSelector` (`string` | *optional*): A CSS selector for the footer section of the modal content. Any elements matching this selector will be projected into the modal footer.
- `dismissSelector` (`string` | *optional*): A CSS selector for elements that should act as dismiss triggers for the modal. When clicked, these elements will dismiss the modal. Default: `'[data-dismiss="modal"]'`.
- `data` (`any` | *optional*): An object containing additional data that will be bound to the modal component instance.

#### `ModalRef`

The `ModalRef` is a reference to the currently open modal instance. It provides methods to interact with the modal.

- `dismiss(reason?)`: Dismisses the modal with an optional reason.
  - `reason` (`any` | *optional*): A value that will be passed to the modal's dismissal event.
- `result`: A promise that resolves when the modal is dismissed, providing the dismissal reason.

### Modal Component

The modal component is the component that you define to be displayed within the modal. It can have any structure and content you desire, but it's recommended to follow the Bootstrap modal structure for consistency.

Here's an example modal component:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      {{ body }}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="confirm()">Confirm</button>
    </div>
  `
})
export class MyModalComponent {
  title: string;
  body: string;

  constructor(@Inject(MODAL_DATA) public data: any) {
    this.title = data.title;
    this.body = data.body;
  }

  confirm() {
    // Perform any necessary actions here
    // ...

    // Dismiss the modal
    this.modalRef.dismiss('confirmed');
  }
}
```

In this example, the modal component receives data through the `MODAL_DATA` injection token, which is populated with the `data` object passed in the `ModalOptions`. The component displays a modal with a header, body, and footer, with a "Cancel" button that dismisses the modal and a "Confirm" button that performs some actions and then dismisses the modal with the reason `'confirmed'`.

Note that the `modalRef` instance is injected into the modal component automatically by the library, allowing you to interact with the modal from within the component.

### Styling

The modal component uses Bootstrap's modal styles by default, but you can override them or define your own styles by targeting the appropriate CSS classes. The modal component has the following structure:

```html
<div class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <!-- Header content projected here -->
      </div>
      <div class="modal-body">
        <!-- Body content projected here -->
      </div>
      <div class="modal-footer">
        <!-- Footer content projected here -->
      </div>
    </div>
  </div>
</div>
```

You can target these classes or add your own classes to customize the modal's appearance.

## Examples

### Basic Modal

```typescript
import { Component } from '@angular/core';
import { ModalService } from 'ng-hub-ui-modal';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="openModal()">Open Modal</button>
  `
})
export class ExampleComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    const modalRef = this.modalService.open(BasicModalComponent);
  }
}

@Component({
  selector: 'app-basic-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Basic Modal</h4>
    </div>
    <div class="modal-body">
      This is a basic modal example.
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    </div>
  `
})
export class BasicModalComponent {}
```

### Modal with Data

```typescript
import { Component, Inject } from '@angular/core';
import { ModalService, MODAL_DATA } from 'ng-hub-ui-modal';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="openModal()">Open Modal</button>
  `
})
export class ExampleComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    const modalRef = this.modalService.open(DataModalComponent, {
      data: { name: 'John Doe' }
    });
  }
}

@Component({
  selector: 'app-data-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Modal with Data</h4>
    </div>
    <div class="modal-body">
      Hello, {{ name }}!
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    </div>
  `
})
export class DataModalComponent {
  name: string;

  constructor(@Inject(MODAL_DATA) public data: any) {
    this.name = data.name;
  }
}
```

### Modal with Content Projection

```typescript
import { Component } from '@angular/core';
import { ModalService } from 'ng-hub-ui-modal';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="openModal()">Open Modal</button>

    <ng-template modalHeader>
      <h4 class="modal-title">Modal with Content Projection</h4>
    </ng-template>

    <ng-template modalBody>
      <p>This is the modal body content.</p>
    </ng-template>

    <ng-template modalFooter>
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary">Save</button>
    </ng-template>
  `
})
export class ExampleComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    const modalRef = this.modalService.open(null, {
      headerSelector: '[modalHeader]',
      bodySelector: '[modalBody]',
      footerSelector: '[modalFooter]'
    });
  }
}
```

### Modal with Dismiss Trigger

```typescript
import { Component } from '@angular/core';
import { ModalService } from 'ng-hub-ui-modal';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="openModal()">Open Modal</button>

    <ng-template modalContent>
      <div class="modal-header">
        <h4 class="modal-title">Modal with Dismiss Trigger</h4>
      </div>
      <div class="modal-body">
        <p>Click the button below to dismiss the modal.</p>
        <button type="button" class="btn btn-primary" myDismissTrigger>Dismiss</button>
      </div>
    </ng-template>
  `
})
export class ExampleComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    const modalRef = this.modalService.open(null, {
      bodySelector: '[modalContent]',
      dismissSelector: '[myDismissTrigger]'
    });
  }
}
```