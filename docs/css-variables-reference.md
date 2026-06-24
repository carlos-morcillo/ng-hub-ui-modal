# CSS Variables Reference (`ng-hub-ui-modal`)

This guide lists the CSS variables implemented by `ng-hub-ui-modal` and their default values.

## How it works

`hub-modal-window` and `hub-modal-backdrop` consume `--hub-modal-*` tokens.
The fallback chain follows: `component -> sys -> ref -> literal`.

## Importing styles

```scss
@import 'ng-hub-ui-modal/src/lib/modal.scss';
```

## Base system fallbacks (`:root, :host`)

`modal.scss` includes fallback definitions for core `ref/sys` tokens required by the component.

## Token catalog

### Modal container and dialog

| Variable name | Initial value |
| --- | --- |
| `--hub-modal-z-index` | `var(--hub-sys-zindex-modal, 1055)` |
| `--hub-modal-width` | `100%` |
| `--hub-modal-max-width` | `500px` |
| `--hub-modal-margin` | `1.75rem auto` |
| `--hub-modal-margin-top` | `var(--hub-modal-margin-y, 1.75rem)` |
| `--hub-modal-margin-right` | `var(--hub-modal-margin-x, auto)` |
| `--hub-modal-margin-bottom` | `var(--hub-modal-margin-y, 1.75rem)` |
| `--hub-modal-margin-left` | `var(--hub-modal-margin-x, auto)` |
| `--hub-modal-placement-start-margin` | `var(--hub-modal-margin-top, 1.75rem) auto var(--hub-modal-margin-bottom, 1.75rem) 0` |
| `--hub-modal-placement-end-margin` | `var(--hub-modal-margin-top, 1.75rem) 0 var(--hub-modal-margin-bottom, 1.75rem) auto` |
| `--hub-modal-placement-top-margin` | `0 auto 0 auto` |
| `--hub-modal-placement-bottom-margin` | `0 auto 0 auto` |
| `--hub-modal-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-modal-bg` | `var(--hub-sys-surface-page, #ffffff)` |
| `--hub-modal-border-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-modal-border-width` | `var(--hub-ref-border-width, 1px)` |
| `--hub-modal-border-radius` | `var(--hub-ref-radius-lg, 0.5rem)` |
| `--hub-modal-placement-start-border-radius` | `0 var(--hub-modal-border-radius) var(--hub-modal-border-radius) 0` |
| `--hub-modal-placement-end-border-radius` | `var(--hub-modal-border-radius) 0 0 var(--hub-modal-border-radius)` |
| `--hub-modal-placement-top-border-radius` | `0 0 var(--hub-modal-border-radius) var(--hub-modal-border-radius)` |
| `--hub-modal-placement-bottom-border-radius` | `var(--hub-modal-border-radius) var(--hub-modal-border-radius) 0 0` |
| `--hub-modal-inner-border-radius` | `calc(var(--hub-modal-border-radius, var(--hub-ref-radius-lg, 0.5rem)) - var(--hub-modal-border-width, var(--hub-ref-border-width, 1px)))` |
| `--hub-modal-box-shadow` | `var(--hub-sys-shadow-lg, 0 1rem 3rem rgba(0, 0, 0, 0.175))` |
| `--hub-modal-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-modal-padding-y` | `var(--hub-ref-space-3, 1rem)` |

### Semantic accent (variants)

Applied only when a `variant` is set (e.g. `{ variant: 'danger' }` or `windowClass: 'hub-modal--danger'`). A variant re-bases `--hub-modal-accent`; the `subtle` / `border` roles are then derived from it with `color-mix()`, recolouring the whole dialog (top bar, tinted background, accent borders, accent title). A neutral modal is unaffected.

| Variable name | Initial value |
| --- | --- |
| `--hub-modal-accent` | `var(--hub-sys-color-primary, #0d6efd)` |
| `--hub-modal-accent-subtle` | `color-mix(in srgb, var(--hub-modal-accent) 8%, var(--hub-sys-surface-page, #ffffff))` |
| `--hub-modal-accent-border` | `color-mix(in srgb, var(--hub-modal-accent) 35%, var(--hub-sys-surface-page, #ffffff))` |
| `--hub-modal-accent-bar-width` | `var(--hub-ref-space-1, 4px)` |

### Header and title

| Variable name | Initial value |
| --- | --- |
| `--hub-modal-header-padding-x` | `var(--hub-modal-padding-x)` |
| `--hub-modal-header-padding-y` | `var(--hub-modal-padding-y)` |
| `--hub-modal-header-gap` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-modal-header-border-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-modal-header-border-width` | `var(--hub-ref-border-width, 1px)` |
| `--hub-modal-title-font-size` | `var(--hub-ref-font-size-lg, 1.25rem)` |
| `--hub-modal-title-font-weight` | `500` |
| `--hub-modal-title-line-height` | `var(--hub-ref-line-height-base, 1.5)` |
| `--hub-modal-title-margin-x` | `0` |
| `--hub-modal-title-margin-y` | `0` |
| `--hub-modal-title-color` | `var(--hub-modal-color, var(--hub-sys-text-primary, #212529))` |

### Body and footer

| Variable name | Initial value |
| --- | --- |
| `--hub-modal-body-padding-x` | `var(--hub-modal-padding-x)` |
| `--hub-modal-body-padding-y` | `var(--hub-modal-padding-y)` |
| `--hub-modal-footer-padding-x` | `var(--hub-modal-padding-x)` |
| `--hub-modal-footer-padding-y` | `var(--hub-modal-padding-y)` |
| `--hub-modal-footer-gap` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-modal-footer-bg` | `var(--hub-modal-bg, var(--hub-sys-surface-page, #ffffff))` |
| `--hub-modal-footer-border-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-modal-footer-border-width` | `var(--hub-ref-border-width, 1px)` |

### Close button

| Variable name | Initial value |
| --- | --- |
| `--hub-modal-close-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-modal-close-opacity` | `0.5` |
| `--hub-modal-close-hover-opacity` | `0.75` |
| `--hub-modal-close-padding-x` | `0` |
| `--hub-modal-close-padding-y` | `0` |

### Backdrop

| Variable name | Initial value |
| --- | --- |
| `--hub-modal-backdrop-bg` | `var(--hub-ref-color-black, #000000)` |
| `--hub-modal-backdrop-opacity` | `var(--hub-sys-opacity-50, 0.5)` |

### Motion

| Variable name | Initial value |
| --- | --- |
| `--hub-modal-fade-transform` | `translate(0, -50px)` |
| `--hub-modal-show-transform` | `none` |
| `--hub-modal-transition` | `var(--hub-sys-transition-base, all 0.2s ease-in-out)` |
| `--hub-modal-scale-transform` | `scale(1.02)` |

## Examples

Framework-agnostic example:

```scss
hub-modal-window {
  --hub-modal-max-width: 640px;
  --hub-modal-border-radius: 0.75rem;
  --hub-modal-header-padding-y: 0.75rem;
  --hub-modal-backdrop-opacity: 0.6;
}
```

Optional Bootstrap integration:

```scss
hub-modal-window {
  --hub-modal-bg: var(--bs-body-bg);
  --hub-modal-color: var(--bs-body-color);
  --hub-modal-border-color: var(--bs-border-color);
}
```

## Best practices

- Prefer `--hub-modal-*` tokens for modal theming instead of direct class overrides.
- Keep `--hub-modal-transition` aligned with your app motion scale.
- When changing backdrop contrast, adjust both `--hub-modal-backdrop-bg` and `--hub-modal-backdrop-opacity` together.
