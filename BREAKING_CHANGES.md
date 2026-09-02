# Breaking Changes in `ng-hub-ui-modal`

This document details the breaking changes introduced in major versions of `ng-hub-ui-modal` and how to migrate your codebase.

## [22.8.0] - 2026-09-02

### Custom-property defaults moved from `.hub-modal` to `:root`

- **Change**: every default this library declares — `--hub-modal-width`,
  `--hub-modal-placement-end-margin`, and the rest — is now declared on `:root` instead of on
  `.hub-modal`. The values are identical; only where they are declared changed.
- **Impact**: a `.hub-modal { --hub-modal-… : … }` rule in your own stylesheet **now applies**
  where before it was silently ignored. That is the point of the change, and it is still a change
  in rendering: if you wrote such a rule, found it had no effect, and compensated somewhere else,
  both now take effect and the compensation may double up.
- **Migration**: search your styles for `--hub-modal-` and check each assignment is still the value
  you want, now that it is being read. Anything already written at a higher specificity — a
  `.hub-modal.hub-modal--placement-end` block, which is what this library forced people into —
  keeps winning and needs no change, though it can now be flattened to one class.
- **`offcanvas` is not part of this.** It is additive and defaults to `false`; a dialog opened with
  `placement` alone renders exactly as it did, which a spec pins.
- **Why**: this stylesheet is injected at runtime, so at equal specificity it always landed after a
  consumer's sheet and won by order. Assigning a token — the composition doctrine's own
  instruction — did nothing unless you out-specified the primitive. Declaring the defaults one
  level up trades a fight nobody can win for inheritance, which the closer declaration beats
  regardless of order.

## [22.4.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-modal/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/modal/styles/...` instead of `dist/modal/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-modal/styles' as *;`

## Version 22.1.0

### Removed shorthand CSS tokens (`--hub-modal-close-padding`, `--hub-modal-title-margin`)

The uniform shorthand tokens that set padding/margin equally on every side have been removed in favour of the canonical directional `-x` / `-y` token pairs used across the design system. This change is purely token-level — there is **no visual change** for the default modal.

**Removed:**

- `--hub-modal-close-padding`
- `--hub-modal-title-margin`

**Migration Steps:**
If you set either of the removed shorthands in your global stylesheets or theme layer, replace each one with its directional `-x` / `-y` pair:

- `--hub-modal-close-padding: <value>;` becomes `--hub-modal-close-padding-x: <value>; --hub-modal-close-padding-y: <value>;`
- `--hub-modal-title-margin: <value>;` becomes `--hub-modal-title-margin-x: <value>; --hub-modal-title-margin-y: <value>;`

> The dialog's per-side margin system — `--hub-modal-margin-x` / `--hub-modal-margin-y` plus the placement margins — is **unchanged**.

## Version 21.0.0

### Modal CSS BEM Standardization

To avoid conflicts with Bootstrap's core CSS classes and external stylesheets, all internal CSS classes rendered by the `ng-hub-ui-modal` structural components (Window and Backdrop) have been prefixed and standardized to the BEM (Block Element Modifier) convention using the `hub-modal` prefix.

**Migration Steps:**
If you have written any custom CSS or SCSS in your global stylesheets targeting the modal's internal DOM structure (e.g. `.modal-dialog`, `.modal-content`, `.modal-backdrop`), you must update your selectors:

- `.modal` becomes `.hub-modal`
- `.modal-dialog` becomes `.hub-modal__dialog`
- `.modal-content` becomes `.hub-modal__content`
- `.modal-header` becomes `.hub-modal__header`
- `.modal-body` becomes `.hub-modal__body`
- `.modal-footer` becomes `.hub-modal__footer`
- `.modal-backdrop` becomes `.hub-modal__backdrop`
- Buttons/Close elements such as `.btn-close` become `.hub-modal__close`
