# Changelog

All notable changes to this project will be documented in this file.

## [22.2.0] - 2026-06-26

### Changed

- Canonical `zindex` token names (BREAKING): `--hub-modal-z-index` → `--hub-modal-zindex`, `--hub-modal-backdrop-z-index` → `--hub-modal-backdrop-zindex` (no hyphen, matching the `--hub-sys-zindex-*` convention).
- **Accent system migrated to the open-set "local accent slot" pattern.** A modal `variant` now re-bases a single `--hub-modal-accent` slot, and the role family — `--hub-modal-accent-emphasis`, `--hub-modal-accent-subtle`, `--hub-modal-accent-border` and the new `--hub-modal-accent-on` (contrast colour) — is derived **locally** from it with `color-mix(in oklch, …)` / relative color, mirroring the `ng-hub-ui-ds` engine. The built-in variant list grew from 5 to the **nine canonical accents** (`primary · secondary · success · danger · warning · info · neutral · light · dark`). Because the roles re-derive from the slot, **any custom accent** (e.g. a `brand` the host app adds to the ds `$hub-accents` map) recolours the whole dialog with one rule that only re-bases `--hub-modal-accent` — open it with `{ variant: 'brand' }` or `windowClass: 'hub-modal--brand'`, no library recompilation.

### Added

- New token `--hub-modal-accent-on` (grayscale contrast flip driven by the accent's own lightness, ready for accent-filled surfaces) and `--hub-modal-accent-emphasis`.

### Fixed

- Migrated the accent `color-mix()` derivations (`--hub-modal-accent-subtle` / `-border`) from the `srgb` colour space to `oklch` for perceptually uniform tints, matching `ng-hub-ui-ds`. The subtle tint is now derived at 12% (was 8%).

## [22.1.2] - 2026-06-26

### Fixed

- Corrected the Angular peer dependency range to `>=18.0.0`. The library uses APIs introduced in Angular 17 (signal `input()`/`output()`, the `@if` control flow and/or signal queries), whose real minimum is Angular 17.3, so the previous `>=16.0.0` range was too low and let it install on incompatible versions.
- Corrected the `ng-hub-ui-utils` peer dependency range to `>=1.0.0`. The previous caret range (`^1.x`) resolved to `>=1 <2`, which excluded the current `ng-hub-ui-utils` (22.x) and made the peer impossible to satisfy.

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Added

- New `variant` option on `HubModal.open()` selecting a **semantic accent** for meaningful dialogs: `this.modal.open(Cmp, { variant: 'danger' })`. The built-in values (`primary` / `success` / `danger` / `warning` / `info`) map to the design-system colours, but **any string is accepted** — the modal reads `--hub-sys-color-<variant>` from the host application. A variant recolours the whole dialog: a top accent **bar**, a lightly accent-tinted **background**, accent-tinted **borders** (outer + header/footer rules) and an accent **title**. Defaults to neutral (no accent). The option is also updatable through `HubModalRef.update()` / `HubActiveModal.update()`, and can be applied directly via `windowClass: 'hub-modal--<variant>'`. Mirrors the accent system in panels/nav/table/list/board.
- New **`hub-modal-theme()` Sass mixin** (`styles/mixins/modal-theme`) — theme a dialog in one call: accent, surfaces, colour, title, borders/radius/shadow, header/body/footer padding & gaps, backdrop. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-modal-*` overrides; the rest keep their defaults. Apply it to the class you pass as `windowClass` (or to `.hub-modal` for all dialogs). Token-based, no Bootstrap dependency.
- New tokens: `--hub-modal-accent` (default `--hub-sys-color-primary`), `--hub-modal-accent-subtle` (variant tinted background, generated from the accent with `color-mix`), `--hub-modal-accent-border` (variant accent-tinted border), `--hub-modal-accent-bar-width` (default `--hub-ref-space-1`, 4px) and `--hub-modal-title-color` (default neutral). No visual change for a neutral modal.

### Changed

- Replaced the uniform `--hub-modal-close-padding` and `--hub-modal-title-margin` shorthands with the canonical directional `-x` / `-y` tokens. No visual change. **BREAKING**: set the `-x`/`-y` tokens instead of the removed shorthands. (The dialog's per-side margin system — `--hub-modal-margin-x/-y` + placement margins — is unchanged.)

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [21.0.3] - 2026-06-14

### Fixed

- Guard `parentNode` when removing the modal window and backdrop elements during teardown, preventing a `Cannot read properties of null (reading 'removeChild')` error when an element is already detached.

## [21.0.2] - 2026-03-31

### Changed

- Standardized modal padding variables.

### Fixed

- Improved fullscreen modal layout responsiveness.

## [21.0.1] - 2026-03-19

### Changed

- Removed hardcoded design system token defaults (`--hub-ref-*`, `--hub-sys-*`) from the
  component stylesheet. These tokens now rely solely on the host application's design system
  layer; all `--hub-modal-*` variables retain their literal fallback values for standalone usage.

### Fixed

- Fixed `modal-backdrop.spec.ts` tests: added required `animation` input initialization and
  `async`/`await fixture.whenStable()` for proper async test stability.
- Fixed `modal.spec.ts` event subscription ordering: subscribe before emitting to ensure
  handler is registered in time.

## [21.0.0] - 2026-03-10

### Added

- Implemented a new internal `Select` UI component with full accessibility, proper keyboard handling, and dropdown options.
- Added `HubModalPlacement` configuration and placement CSS classes to support launching modals anchored to specific viewport edges (`start`, `end`, `top`, `bottom`, `center`).
- Added exhaustive CSS Variables documentation for the `modal` component (`docs/css-variables-reference.md`).
- Fully documented the internal library files (`HubModalWindow`, `HubModalStack`, `HubModalBackdrop`, `HubModalPlacement`) using english JSDoc comments.

### Changed

- **BREAKING CHANGE:** Standardized modal CSS class names to the `hub-modal` BEM convention.
- Removed legacy `NgIf` imports to utilize Angular's modern control flow (`@if`).
- Improved modal component internal DOM rendering architecture by utilizing standard `document.activeElement` operations with boundaries mapping.
