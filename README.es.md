# ng-hub-ui-modal

**Español** | [English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-modal.svg)](https://www.npmjs.com/package/ng-hub-ui-modal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.io)

> Biblioteca de modales standalone para Angular con proyección de contenido flexible, soporte de posición (placement), y tematización completa mediante variables CSS. Sin dependencias de Bootstrap ni ng-bootstrap.

> **⚠️ AVISO: CAMBIOS QUE ROMPEN COMPATIBILIDAD EN VERSIÓN 21.0.0**
> Si estás actualizando desde `1.x.x` a `21.x.x` y has sobrescrito las clases CSS `.modal` o `.modal-dialog` en tus hojas de estilo globales, consulta [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) para migrar al nuevo esquema BEM `hub-modal`.

---

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/modal/overview/
- Ejemplos en vivo: https://hubui.dev/en/modal/examples/
- Hub UI: https://hubui.dev/en/

---

## 🧩 Familia de librerías `ng-hub-ui`

Esta librería forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) _(obsoleto — usa ng-hub-ui-panels)_
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**➡️ ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal) ← _estás aquí_
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 📋 Tabla de contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Inicio rápido](#inicio-rápido)
- [Ejemplos](#ejemplos)
- [Referencia de API](#referencia-de-api)
- [Estilos](#estilos)
- [Contribuciones](#contribuciones)
- [Soporte y Licencia](#soporte-y-licencia)

---

## Características

- **Sin dependencias externas**: sin ng-bootstrap, sin Bootstrap JS.
- **Tres tipos de contenido**: abre modales con `TemplateRef`, clase `Component` o `string`.
- **Proyección de contenido flexible**: usa selectores CSS para enrutar nodos a los slots `header`, `body` y `footer`.
- **Soporte de placement**: ancla el modal a cualquier borde del viewport — `start`, `end`, `top`, `bottom` — o mantenlo centrado.
- **Apilamiento de modales**: múltiples modales abiertos simultáneamente con gestión automática del foco y `aria-hidden`.
- **Guards de cierre programáticos**: el callback `beforeDismiss` permite interceptar y cancelar el cierre.
- **Teclado y backdrop configurables**: tecla ESC, backdrop estático, clic fuera — todo configurable.
- **Variables CSS**: personalización profunda sin sobrescribir clases internas.
- **Arquitectura BEM**: todas las clases estructurales usan el prefijo `hub-modal__*` para evitar conflictos.
- **Observables de ciclo de vida**: `shown`, `hidden`, `closed`, `dismissed` para un control reactivo preciso.
- **Configuración global**: inyecta `HubModalConfig` para definir valores predeterminados en toda la aplicación.

---

## Instalación

```bash
npm install ng-hub-ui-modal
```

---

## Inicio rápido

### Standalone (recomendado)

```typescript
import { Component, inject, TemplateRef } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';

@Component({
	selector: 'app-root',
	standalone: true,
	template: `
		<button (click)="open(tpl)">Abrir modal</button>

		<ng-template #tpl let-close="close">
			<div class="hub-modal__header"><h5>¡Hola!</h5></div>
			<div class="hub-modal__body">Contenido del modal.</div>
			<div class="hub-modal__footer">
				<button (click)="close('done')">Cerrar</button>
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

### NgModule (clásico)

```typescript
import { HubModalModule } from 'ng-hub-ui-modal';

@NgModule({
	imports: [HubModalModule]
})
export class AppModule {}
```

---

## Ejemplos

### Abrir con TemplateRef

```typescript
@Component({
	standalone: true,
	template: `
		<button (click)="open(tpl)">Abrir</button>
		<ng-template #tpl let-close="close" let-dismiss="dismiss">
			<div class="hub-modal__body">
				<p>Modal de plantilla.</p>
				<button (click)="dismiss('cancel')">Cancelar</button>
				<button (click)="close('ok')">OK</button>
			</div>
		</ng-template>
	`
})
export class EjemploComponent {
	private modal = inject(HubModal);
	open(tpl: TemplateRef<unknown>) {
		this.modal
			.open(tpl)
			.result.then((r) => console.log('Cerrado:', r))
			.catch((r) => console.log('Descartado:', r));
	}
}
```

### Abrir con Componente

```typescript
@Component({
	standalone: true,
	template: `
		<div class="hub-modal__header"><h5>Confirmar</h5></div>
		<div class="hub-modal__body">¿Deseas continuar?</div>
		<div class="hub-modal__footer">
			<button (click)="active.dismiss()">No</button>
			<button (click)="active.close(true)">Sí</button>
		</div>
	`
})
export class ConfirmarComponent {
	active = inject(HubActiveModal);
}

// Desde el componente padre
this.modal.open(ConfirmarComponent, {
	headerSelector: '.hub-modal__header',
	footerSelector: '.hub-modal__footer'
});
```

### Placement (posición del modal)

```typescript
import { HubModal, HubModalPlacement } from 'ng-hub-ui-modal';

// Panel derecho
this.modal.open(MiComponente, { placement: HubModalPlacement.End });

// Hoja inferior (bottom sheet)
this.modal.open(MiComponente, { placement: HubModalPlacement.Bottom });

// Cajón izquierdo, centrado verticalmente
this.modal.open(MiComponente, {
	placement: HubModalPlacement.Start,
	centered: true
});
```

| Valor                      | Efecto                                |
| -------------------------- | ------------------------------------- |
| `HubModalPlacement.Center` | Centrado en el viewport (por defecto) |
| `HubModalPlacement.Start`  | Anclado al borde izquierdo            |
| `HubModalPlacement.End`    | Anclado al borde derecho              |
| `HubModalPlacement.Top`    | Anclado al borde superior             |
| `HubModalPlacement.Bottom` | Anclado al borde inferior             |

#### Offcanvas: un cajón que toca su borde

`placement` desliza un diálogo _flotante_ desde un borde y le conserva todo lo de un flotante:
márgenes, redondeo en las cuatro esquinas y una altura que sale de su contenido. Correcto para un
diálogo que entra de lado, equivocado para un cajón: los márgenes dejan una franja de página
asomando por abajo, el redondeo lo despega de su propio borde y un panel corto abre como una caja a
media altura.

`offcanvas: true` lo zanja:

```typescript
// Una sola decisión. Sin placement, abre desde el borde final.
this.modal.open(MyComponent, { offcanvas: true });

// O nombra el borde.
this.modal.open(MyComponent, { offcanvas: true, placement: HubModalPlacement.Start });
```

Pegado a su borde, sin redondeo en el lado por el que se pega, estirado al alto completo (o al ancho,
desde arriba o abajo) y con el cuerpo desplazándose para que la cabecera y el pie no se muevan. Va
aparte de `placement` a propósito: pasar solo `placement` sigue dando exactamente lo de siempre.

Su ancho no sale de la escala de tallas —`size: 'lg'` son 800px, que en una ventana estrecha tapan el
documento que el cajón pretende acompañar—. Lo llevan tres tokens:

| Token                                 | Por defecto        | Efecto                                                                            |
| ------------------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `--hub-modal-offcanvas-width`         | `min(28rem, 100%)` | Ancho de un cajón start/end                                                       |
| `--hub-modal-offcanvas-height`        | `min(60vh, 100%)`  | Alto de una hoja top/bottom                                                       |
| `--hub-modal-offcanvas-border-radius` | `0`                | Redondeo del contenido; `0 1rem 1rem 0` redondea el lado lejano de un cajón start |

### Tamaño y pantalla completa

```typescript
this.modal.open(MiComponente, { size: 'lg' }); // 'sm' | 'lg' | 'xl'
this.modal.open(MiComponente, { fullscreen: true });
this.modal.open(MiComponente, { fullscreen: 'md' }); // solo en pantallas < md
```

### Contenido desplazable (scrollable)

```typescript
this.modal.open(ContenidoLargoComponent, { scrollable: true });
```

### Backdrop estático

```typescript
this.modal.open(MiComponente, { backdrop: 'static', keyboard: false });
```

### Guard de cierre (`beforeDismiss`)

```typescript
this.modal.open(MiFormComponent, {
	beforeDismiss: () => {
		if (this.formularioSuciado) {
			return confirm('¿Descartar cambios?');
		}
		return true;
	}
});
```

### HubActiveModal

Inyecta `HubActiveModal` en el componente de contenido para controlar el modal desde dentro. Es genérico en el tipo del payload y en el del resultado — `HubActiveModal<D = unknown, R = any>` (`close(result?: R)`) — y expone un accesor de solo lectura `data` (equivalente a `inject(HUB_MODAL_DATA)`; `null` si no se pasó `data`). Prefiere `HUB_MODAL_DATA` / `HubActiveModal.data` a leer un campo `data` de la instancia (ese parche `Object.assign` está **obsoleto** y se mantiene solo una versión):

```typescript
export class MiModalComponent {
	activeModal = inject(HubActiveModal);

	guardar() {
		this.activeModal.close({ guardado: true });
	}
	cancelar() {
		this.activeModal.dismiss('cancelado');
	}
}
```

### Selectores de cierre y descarte

```typescript
this.modal.open(MiComponente, {
	dismissSelector: '[data-dismiss="modal"]',
	closeSelector: '[data-close="modal"]'
});
```

### Modales apilados

Angular gestiona automáticamente el foco y `aria-hidden` al abrir modales desde dentro de otros modales.

### dismissAll y hasOpenModals

```typescript
this.modal.dismissAll('cambio_de_ruta');
const hayAbiertos = this.modal.hasOpenModals();
this.modal.activeInstances.subscribe((refs) => console.log(refs.length + ' abiertos'));
```

---

## Referencia de API

### Servicio HubModal

| Método                             | Descripción                                             |
| ---------------------------------- | ------------------------------------------------------- |
| `open<C, R, D>(content, options?)` | Abre un nuevo modal. Devuelve `HubModalRef<C, R>`.      |
| `dismissAll(reason?)`              | Descarta todos los modales abiertos.                    |
| `hasOpenModals()`                  | Devuelve `true` si hay al menos un modal abierto.       |
| `activeInstances`                  | `EventEmitter` que emite al cambiar la pila de modales. |

`C` se infiere de la clase de componente pasada como `content`, `R` tipa el flujo del resultado y `D` el payload `data` (`HubModalOptions<D>`). Todos los genéricos tienen como defecto los tipos laxos anteriores (`any` / `unknown`), así que los usos sin tipar compilan sin cambios.

#### Resultados tipados

```typescript
const ref = this.modal.open<ConfirmDialogComponent, boolean>(ConfirmDialogComponent);

ref.componentInstance; // ConfirmDialogComponent | void — sin casts `as unknown as`
ref.result.then((confirmed) => {
	// confirmed: boolean
});

// Dentro del componente de contenido:
inject<HubActiveModal<unknown, boolean>>(HubActiveModal).close(true); // close(result?: boolean)
```

### HubModalRef

Genérico en el componente de contenido y en el tipo del resultado — `HubModalRef<C = any, R = any>`.

| Miembro             | Descripción                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `result`            | `Promise<R>` que resuelve en `close()` y rechaza en `dismiss()`. |
| `componentInstance` | Instancia del componente de contenido (`C \| void`).             |
| `close(result?: R)` | Cierra el modal.                                                 |
| `dismiss(reason?)`  | Descarta el modal.                                               |
| `update(options)`   | Actualiza opciones en tiempo de ejecución.                       |
| `closed`            | `Observable<R>` que emite al cerrar con `close()`.               |
| `dismissed`         | Observable que emite al descartar.                               |
| `shown`             | Emite cuando la animación de apertura termina.                   |
| `hidden`            | Emite cuando la animación de cierre termina y el DOM se elimina. |

### HubModalOptions

Genérico en el tipo del payload — `HubModalOptions<D = unknown>` tipa la opción `data`, en pareja con `HubActiveModal<D>.data`.

| Opción             | Tipo                                                                  | Default                  | Descripción                                                                                                                                                                                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animation`        | `boolean`                                                             | `true`                   | Activa transiciones de apertura/cierre.                                                                                                                                                                                                                                                                                                                             |
| `backdrop`         | `boolean \| 'static'`                                                 | `true`                   | `'static'` impide cierre al hacer clic fuera.                                                                                                                                                                                                                                                                                                                       |
| `beforeDismiss`    | `() => boolean \| Promise<boolean>`                                   | —                        | Guard de cierre. Devolver `false` lo cancela.                                                                                                                                                                                                                                                                                                                       |
| `centered`         | `boolean`                                                             | `false`                  | Centra el modal en el eje secundario al usar placement lateral.                                                                                                                                                                                                                                                                                                     |
| `placement`        | `HubModalPlacement`                                                   | `Center`                 | Anclaje del modal en el viewport.                                                                                                                                                                                                                                                                                                                                   |
| `fullscreen`       | `boolean \| string`                                                   | `false`                  | Pantalla completa siempre o bajo un breakpoint dado.                                                                                                                                                                                                                                                                                                                |
| `keyboard`         | `boolean`                                                             | `true`                   | Permite cerrar con la tecla ESC.                                                                                                                                                                                                                                                                                                                                    |
| `scrollable`       | `boolean`                                                             | `false`                  | Activa el scroll interno del body del modal.                                                                                                                                                                                                                                                                                                                        |
| `size`             | `'sm' \| 'lg' \| 'xl' \| string`                                      | —                        | Ancho predefinido del diálogo.                                                                                                                                                                                                                                                                                                                                      |
| `variant`          | `'primary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| string` | —                        | Acento semántico para diálogos con significado: superficie, bordes y título tintados con el acento (más una barra superior opcional). Se compilan nueve variantes, que leen `--hub-sys-color-<variant>` del host; cualquier otra cadena aplica la clase `hub-modal--<variant>`, a la que das significado con una sola regla (ver [Estilos](#variantes-semánticas)). |
| `windowClass`      | `string`                                                              | —                        | Clase extra en el host `.hub-modal`.                                                                                                                                                                                                                                                                                                                                |
| `modalDialogClass` | `string`                                                              | —                        | Clase extra en `.hub-modal__dialog`.                                                                                                                                                                                                                                                                                                                                |
| `backdropClass`    | `string`                                                              | —                        | Clase extra en `.hub-modal__backdrop`.                                                                                                                                                                                                                                                                                                                              |
| `headerSelector`   | `string`                                                              | —                        | Selector CSS para nodos del slot de cabecera.                                                                                                                                                                                                                                                                                                                       |
| `footerSelector`   | `string`                                                              | —                        | Selector CSS para nodos del slot de pie.                                                                                                                                                                                                                                                                                                                            |
| `dismissSelector`  | `string`                                                              | `[data-dismiss="modal"]` | Selector para elementos que descartan el modal al hacer clic.                                                                                                                                                                                                                                                                                                       |
| `closeSelector`    | `string`                                                              | `[data-close="modal"]`   | Selector para elementos que cierran el modal al hacer clic.                                                                                                                                                                                                                                                                                                         |
| `data`             | `D`                                                                   | —                        | Payload tipado entregado al componente de contenido vía `inject(HUB_MODAL_DATA)` o `inject(HubActiveModal).data` (el parche de campo en la instancia está obsoleto).                                                                                                                                                                                                |
| `container`        | `string \| HTMLElement`                                               | `body`                   | Contenedor DOM donde se inserta el modal.                                                                                                                                                                                                                                                                                                                           |
| `injector`         | `Injector`                                                            | —                        | Inyector personalizado para el componente de contenido.                                                                                                                                                                                                                                                                                                             |

### HubModalUpdatableOptions

Subconjunto de `HubModalOptions` que puede actualizarse en un modal ya abierto mediante `HubModalRef.update()`:

`ariaLabelledBy`, `ariaDescribedBy`, `centered`, `placement`, `fullscreen`, `backdropClass`, `size`, `variant`, `windowClass`, `modalDialogClass`.

### HubModalPlacement

```typescript
import { HubModalPlacement } from 'ng-hub-ui-modal';
```

| Valor    | Clase aplicada                | Descripción             |
| -------- | ----------------------------- | ----------------------- |
| `Center` | _(ninguna)_                   | Centrado (por defecto). |
| `Start`  | `hub-modal--placement-start`  | Borde izquierdo.        |
| `End`    | `hub-modal--placement-end`    | Borde derecho.          |
| `Top`    | `hub-modal--placement-top`    | Borde superior.         |
| `Bottom` | `hub-modal--placement-bottom` | Borde inferior.         |

---

## Estilos

No hay nada que importar. El componente de ventana lleva su propia hoja de estilos con
`ViewEncapsulation.None`, así que el CSS de la librería se inyecta en el documento la primera vez
que se abre un diálogo. Eso también decide cómo se sobrescribe, y merece un párrafo:

> **Dónde se declaran los valores por defecto.** Desde la 22.10.0 cada default `--hub-modal-*` se
> declara en `:where(.hub-modal)` — el propio elemento del diálogo, alcanzado mediante un
> envoltorio de especificidad cero. De ahí salen dos cosas. Lo que escribas sobre ese elemento
> gana, sea cual sea el orden de las hojas, porque `:where()` no aporta especificidad y la hoja que
> la librería inyecta en tiempo de ejecución ya no puede ganarte por orden. Y cada token derivado
> de otro — el padding de la cabecera desde `--hub-modal-padding-x`, el fondo del pie desde
> `--hub-modal-bg`, los roles de acento desde `--hub-modal-accent` — se resuelve contra el valor
> que ganó **en ese elemento**, de modo que rebasar un token padre arrastra a toda su familia.
>
> Así que asigna sobre un selector que case con el diálogo: `.hub-modal`, `hub-modal-window` o la
> clase que pases como `windowClass`. Asignar en `:root`, `html` o `body` **no** funciona: el
> default de la librería está más cerca del diálogo y gana. Las excepciones son los seis tokens que
> necesitan el backdrop y el orden de apilado (`--hub-modal-zindex`, `--hub-modal-backdrop-zindex`,
> `--hub-modal-backdrop-bg`, `--hub-modal-backdrop-opacity`, `--hub-modal-backdrop-opacity-hidden`,
> `--hub-modal-backdrop-transition`): `.hub-modal__backdrop` es hermano del diálogo, no
> descendiente, así que esos siguen en `:root` y ahí se tematizan.

Referencia completa de tokens: [docs/css-variables-reference.md](./docs/css-variables-reference.md)

### Variables CSS más utilizadas

| Variable                       | Default             | Descripción               |
| ------------------------------ | ------------------- | ------------------------- |
| `--hub-modal-max-width`        | `500px`             | Ancho máximo del diálogo. |
| `--hub-modal-border-radius`    | `0.5rem`            | Radio de esquinas.        |
| `--hub-modal-bg`               | surface del sistema | Color de fondo.           |
| `--hub-modal-backdrop-opacity` | `0.5`               | Opacidad del backdrop.    |
| `--hub-modal-transition`       | `0.2s ease-in-out`  | Velocidad de animación.   |

### Personalización

```scss
/* Los tokens del diálogo van en el diálogo. `hub-modal-window` y `.hub-modal` lo alcanzan. */
hub-modal-window {
	--hub-modal-max-width: 720px;
	--hub-modal-border-radius: 1rem;
}

/* Los del telón de fondo no: es hermano del diálogo, no descendiente, así que nunca ve
   un valor declarado aquí. Van en `:root` o en la clase que pases como `backdropClass`. */
:root {
	--hub-modal-backdrop-opacity: 0.7;
}
```

### Variantes semánticas

Usa `variant` para dar a un diálogo un acento semántico (una confirmación destructiva, un aviso de éxito…). Una variante recolorea todo el diálogo: un fondo tintado con el acento, bordes tintados (exterior + reglas de cabecera/pie) y un título con el color del acento. La barra de acento superior viene incluida, pero con grosor cero: ponle un valor a `--hub-modal-accent-bar-width` para encenderla.

```typescript
this.modal.open(ConfirmDialogComponent, { variant: 'danger' });
```

Se compilan nueve variantes — `primary` · `secondary` · `success` · `danger` · `warning` · `info` · `neutral` · `light` · `dark` —, una por cada acento canónico del design-system, y cada una lee `--hub-sys-color-<variant>` de la aplicación host. El tipo de la opción admite además cualquier otra cadena, y la ventana aplica la clase `hub-modal--<variant>` correspondiente; darle significado a esa clase es una regla que escribes tú, y la siguiente sección es esa regla. La variante es actualizable mediante `HubModalRef.update()` / `HubActiveModal.update()`, y puede aplicarse directamente con `windowClass: 'hub-modal--<variant>'`.

Estos tokens controlan el sistema de acento. Una variante rebasa solo `--hub-modal-accent`; todos los roles de abajo se derivan de él **en el elemento del diálogo**, así que la familia entera lo sigue:

| Variable                       | Default                                                        | Descripción                                                                                                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--hub-modal-accent`           | `var(--hub-sys-color-primary, #0d6efd)`                        | Acento base. Una variante lo rebasa desde `--hub-sys-color-<v>`. Pinta el título de la variante y su barra superior (opcional), y el anillo de foco del botón de cierre.                                                                        |
| `--hub-modal-accent-emphasis`  | `color-mix(in oklch, accent 80%, var(--hub-sys-color-ink))`    | Acento oscurecido, para un trazo más fuerte o un estado hover. Expuesto para el consumidor: la librería no pinta nada con él.                                                                                                                   |
| `--hub-modal-accent-subtle`    | `color-mix(in oklch, accent 12%, var(--hub-sys-surface-page))` | Superficie tintada con el acento. Bajo una variante pasa a ser `--hub-modal-bg`, y el pie la sigue.                                                                                                                                             |
| `--hub-modal-accent-on`        | `oklch(from accent clamp(0, (0.62 - l) * 1000, 1) 0 h)`        | Color de contraste para una superficie rellena con el acento: negro sobre un acento claro, blanco sobre uno oscuro. Expuesto, sin uso interno.                                                                                                  |
| `--hub-modal-accent-border`    | `color-mix(in oklch, accent 35%, var(--hub-sys-surface-page))` | Color de borde tintado con el acento (exterior + reglas de cabecera/pie).                                                                                                                                                                       |
| `--hub-modal-accent-bar-width` | `0`                                                            | Grosor de la barra de acento superior. Sale a `0`, así que la barra está apagada hasta que el host la fije. Se asigna en el diálogo: `.hub-modal` para todos, o un `windowClass` para algunos. En `:root` no, porque pierde frente al elemento. |
| `--hub-modal-title-color`      | `var(--hub-modal-color)`                                       | Color del título; una variante lo reapunta al acento. Se lee en un encabezado con clase `modal-title` o `hub-modal__title` — la biblioteca viste las dos, porque el encabezado lo escribes tú.                                                  |

#### Un acento propio, en una sola regla

El conjunto de variantes es abierto. Un acento `brand` que la aplicación host haya añadido a su design-system — cualquiera fuera de los nueve — no exige recompilar esta librería ni bifurcarla: dale su acento a la clase y apunta los tokens de superficie del diálogo a los roles derivados.

```scss
.hub-modal--brand {
	--hub-modal-accent: var(--hub-sys-color-brand);
	--hub-modal-bg: var(--hub-modal-accent-subtle);
	--hub-modal-border-color: var(--hub-modal-accent-border);
	--hub-modal-title-color: var(--hub-modal-accent);
}
```

```typescript
this.modal.open(ConfirmDialogComponent, { variant: 'brand' });
// o, sin la opción: { windowClass: 'hub-modal--brand' }
```

`--hub-modal-accent-subtle` y `--hub-modal-accent-border` se declaran en el diálogo, así que se vuelven a mezclar a partir del acento que gane ahí — la primera línea de arriba es lo que las mueve. Es exactamente lo que hacen las nueve variantes compiladas: no hay un camino privado que ellas usen y tú no.

Lo único que ellas tienen y esta regla no es la regla de la barra superior, que la dibuja un selector en lugar de llevarla un token (y sigue invisible hasta que se fija `--hub-modal-accent-bar-width`). Añádela si quieres que tu acento también la tenga:

```scss
.hub-modal--brand .hub-modal__content {
	border-top: var(--hub-modal-accent-bar-width) solid var(--hub-modal-accent);
}
```

> Esto es nuevo en la **22.10.0**. La vía de escape estaba documentada desde la 22.2.0 y no funcionaba: los roles se declaraban en `:root`, donde se resolvían contra el acento de la raíz y llegaban al diálogo ya mezclados. Así que `--hub-modal-bg: var(--hub-modal-accent-subtle)` pintaba el tinte del acento _anterior_ y solo cambiaba de color el título. Ver el [changelog](./CHANGELOG.md).

### Mixin de tema Sass

Para una tematización completa en una sola llamada, usa el mixin `hub-modal-theme()`. Cada parámetro es opcional y por defecto vale `null`, por lo que solo se emiten los que pases como overrides `--hub-modal-*`; el resto mantiene sus valores por defecto. Aplícalo a la clase que pases como `windowClass` (o a `.hub-modal` para tematizar todos los diálogos).

```scss
@use 'ng-hub-ui-modal/styles/mixins/modal-theme' as *;

.branded-dialog {
	@include hub-modal-theme(
		$accent: var(--hub-sys-color-success),
		$bg: #f6fff9,
		$border-color: #b7e4c7,
		$border-radius: 0.75rem,
		$box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.2)
	);
}

// this.modal.open(MyDialog, { windowClass: 'branded-dialog' });
```

Cubre acento, superficies, color, título, bordes/radio/sombra, padding y gaps de cabecera/cuerpo/pie y el backdrop — basado en tokens, sin dependencia de Bootstrap.

`$accent` arrastra ahora a toda la familia del acento: el mixin lo emite en el elemento del diálogo, que es donde `--hub-modal-accent-subtle` / `-emphasis` / `-on` / `-border` se vuelven a mezclar a partir de él. Hasta la 22.10.0 esos roles se declaraban en `:root` y se quedaban con el acento anterior, y por eso había que pasar `$accent-subtle` y `$accent-border` junto a `$accent` solo para mantenerlos en sintonía. Pásalos ahora únicamente para romper la derivación a propósito: un tinte que no sea un porcentaje del acento. Lo que el acento pinta lo sigue decidiendo la variante: la superficie tintada, el título con el acento y la barra superior opcional salen de una clase `hub-modal--<variant>` o de una regla propia, como arriba.

### Integración con Bootstrap (opcional)

```scss
hub-modal-window {
	--hub-modal-bg: var(--bs-body-bg);
	--hub-modal-color: var(--bs-body-color);
	--hub-modal-border-color: var(--bs-border-color);
}
```

---

## Contribuciones

```bash
git clone https://github.com/carlos-morcillo/ng-hub-ui-modal.git
npm install
ng build modal --watch   # compilar en modo observador
ng serve                 # aplicación de demo
ng test modal            # tests unitarios
```

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(modal): add new placement option
fix(modal): correct backdrop z-index
docs(modal): update CSS variable table
```

---

## Soporte y Licencia

☕ [Invítame a un café](https://www.buymeacoffee.com/carlosmorcillo)

**Licencia MIT** — © [Carlos Morcillo](https://www.carlosmorcillo.com)
