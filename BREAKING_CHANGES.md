# Breaking Changes in `ng-hub-ui-modal`

This document details the breaking changes introduced in major versions of `ng-hub-ui-modal` and how to migrate your codebase.

## [22.10.0] - 2026-09-05

### Custom-property defaults moved from `:root` to `:where(.hub-modal)`

This partially reverses [22.8.0](#2280---2026-09-02), released three days earlier, and it is worth
saying so plainly: that release put the defaults on `:root` to stop the library out-ranking your
own `.hub-modal { … }` rule, and it did stop it — at the price of a second, larger defect. This one
keeps the win and drops the price.

- **Change**: every default the library declares is now declared on `:where(.hub-modal)` — the
  dialog element itself, matched through a zero-specificity wrapper. Six tokens stay on `:root`,
  and only those: `--hub-modal-zindex`, `--hub-modal-backdrop-zindex`, `--hub-modal-backdrop-bg`,
  `--hub-modal-backdrop-opacity`, `--hub-modal-backdrop-opacity-hidden` and
  `--hub-modal-backdrop-transition`. No value changes as part of *this* move; the one default
  whose value does change in 22.10.0 is `--hub-modal-accent-bar-width`, and it has its own
  section below.

- **Impact 1 — `:root`-level theming of `--hub-modal-*` stops working.** If you assigned a token
  on `:root`, `html` or `body`, the library's own element-level default now wins: the dialog reads
  what is declared on itself before it reads anything inherited. Under 22.8.0 that assignment was
  a coin flip anyway — same element, same specificity, decided by source order, and the library's
  sheet is injected at runtime so it always landed last — but if it happened to be working for
  you, it has stopped.

    Every documented path still works, and now works better: a `.hub-modal { … }` rule in your own
    sheet, a `windowClass` you pass to `HubModal.open()`, a `hub-modal-window { … }` rule, or the
    `hub-modal-theme()` mixin included on any of them. All four match the dialog element, and
    `:where()` contributes zero specificity, so a single class — even a bare element selector —
    beats the default whatever the source order.

- **Impact 2 — the footer of a dialog carrying a `variant` changes colour.** It used to stay white
  under an accent-tinted body; it now takes the tint, because `--hub-modal-footer-bg` derives from
  `--hub-modal-bg` and a variant re-bases `--hub-modal-bg`. This is the second half of the defect
  being fixed, and it is the only rendering the _move_ alters: 19,470 computed properties were
  compared across 81 dialog configurations plus the backdrop, and exactly 18 differ — all of them
  that footer background. (64 differ once the accent-bar change below is counted too.)

- **Impact 3 — the stacking pair is the one thing that still will not follow the dialog, and you
  should know it rather than find it.** `--hub-modal-backdrop-zindex` derives from
  `--hub-modal-zindex`, and both stay on `:root`, so raising `--hub-modal-zindex` on `.hub-modal`
  moves the window and leaves the backdrop behind — measured at 3000 against 1054. Nothing about
  this release caused it and no declaration site can fix it: `.hub-modal__backdrop` is a **sibling**
  of the dialog, and two siblings cannot share a value through inheritance. Set the stacking order
  on `:root`, which both elements descend from, or give the backdrop its own token through
  `backdropClass`.

### The accent bar above a `variant` dialog is gone unless you ask for it

- **Change**: `--hub-modal-accent-bar-width` now defaults to `0` instead of
  `var(--hub-ref-space-1, 0.25rem)`. A dialog opened with a `variant` no longer draws the coloured
  stripe along the top of its content.

- **Impact**: every `variant` dialog loses the bar and becomes 3px shorter. Its meaning is still
  carried, and carried three times over — the accent-tinted surface, the outer and header/footer
  borders, and the title colour. Nothing else about `variant` changed.

    The bar is also drawn differently: it is a layer on `.hub-modal__content` rather than that
    element's `border-top`. As a border it replaced the dialog's own top edge, so switching it
    off would have left a tinted box with three borders and an open top; as a layer it costs no
    height and leaves the frame alone. If you overrode `border-top` on `.hub-modal__content` to
    suppress the bar, that override is now redundant.

- **Migration**: if you want the bar, turn it back on. The assignment has to land on the dialog,
  because that is where the token is declared and an inherited value loses to it. `.hub-modal`
  reaches every dialog in the application; a `windowClass` reaches only the ones you open with it.
  An assignment on `:root` does nothing, which is the same rule Impact 1 describes four paragraphs
  above.

    ```scss
    .hub-modal {
    	--hub-modal-accent-bar-width: 0.25rem;
    }
    ```

    If you had _suppressed_ the bar yourself — setting the token to `0`, or overriding
    `border-top` on `.hub-modal__content` — that declaration is now redundant and can go.

- **Why**: the bar was the loudest part of a variant and the part nobody chose. It competed with
  whatever the host application had already placed at the top of its own chrome, and it was the
  one piece of the accent system that could not be expressed as a token value — it was a border
  the library drew whether or not the design called for it. Zero is a default anybody can change;
  a hard-coded stripe was not.

- **Migration**:

    1. Search your styles for `--hub-modal-`. Any assignment sitting on `:root`, `html` or `body`
       has to move to a selector that matches the dialog: `.hub-modal`, `hub-modal-window`, or the
       class you pass as `windowClass`. The six backdrop-and-stacking tokens listed above are
       the only ones that still belong on `:root`.
    2. Anything already written on the dialog element needs no change — but read it again before
       you ship, because tokens **derived** from what you assigned now follow it. A
       `--hub-modal-padding-x` you set and then compensated for on the header, a
       `--hub-modal-bg` you set and then restated on the footer: both halves now take effect and
       the compensation may double up.
    3. If you use `variant` and had restated `--hub-modal-footer-bg` to paper over the white
       strip, that declaration still wins and is now redundant. Delete it or keep it — it will not
       fight the library either way.

- **Why**: a custom property is substituted on the element where it is **declared**. On `:root`,
  every token this library derives from another — the header's padding from `--hub-modal-padding-x`,
  the title's colour from `--hub-modal-color`, the accent roles from `--hub-modal-accent`, the
  placement radii from `--hub-modal-border-radius` — resolved against the root's values and reached
  the dialog already cooked. Assigning the parent token on the dialog moved the parent and nothing
  else: a `--hub-modal-padding-x: 3rem` left the header at 16px, a dark `--hub-modal-bg` left the
  footer white, and a `warning` variant on a green-branded product drew a yellow bar and a yellow
  title over a green tint. `:where()` is what makes the element the right place for them: it matches
  the dialog and contributes no specificity, so the derivation resolves locally **and** your own
  rule still wins.

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
