# Breaking Changes in `ng-hub-ui-modal`

This document details the breaking changes introduced in major versions of `ng-hub-ui-modal` and how to migrate your codebase.

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
