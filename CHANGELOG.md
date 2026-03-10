# Changelog

All notable changes to this project will be documented in this file.

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
