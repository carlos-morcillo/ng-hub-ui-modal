# Functionalities of Modal Library

This table details the functionalities of the `ng-hub-ui-modal` library and indicates which ones are covered by interactive examples.

## Opening Modals

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Content Types** | Open with `TemplateRef` | ✅ |
| | Open with `Component` type | ✅ |
| | Open with `string` content | ✅ |
| **Service** | `HubModal.open()` method | ✅ |
| | `HubModal.dismissAll()` method | ❌ |
| | `HubModal.hasOpenModals()` boolean | ❌ |

## Configuration & Options

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Appearance** | Size (`sm`, `lg`, `xl`, custom) | ✅ |
| | `centered` (vertically) | ✅ |
| | `scrollable` content | ✅ |
| | `fullscreen` (always or responsive) | ❌ |
| | `windowClass` / `modalDialogClass` | ❌ |
| | `backdropClass` | ❌ |
| **Behavior** | `backdrop` (true, false, 'static') | ✅ |
| | `keyboard` (Esc to close) | ✅ |
| | `animation` (fade in/out) | ❌ |
| **Global Config** | `HubModalConfig` injection token | ❌ |

## Modal Reference (HubModalRef)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Control** | `.close(result)` | ✅ |
| | `.dismiss(reason)` | ✅ |
| | `.update(options)` | ❌ |
| **State** | `result` Promise | ✅ |
| | `componentInstance` access | ✅ |
| **Events** | `closed` Observable | ❌ |
| | `dismissed` Observable | ❌ |
| | `shown` / `hidden` Observables | ❌ |

## Active Modal (HubActiveModal)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Usage** | Injecting `HubActiveModal` in content component | ✅ |
| **Methods** | `.close(result)` | ✅ |
| | `.dismiss(reason)` | ✅ |
| | `.update(options)` | ❌ |

## Stack Management

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Stacking** | Multiple modals stacked | ✅ |
| | Recent modal receives focus | ✅ |
