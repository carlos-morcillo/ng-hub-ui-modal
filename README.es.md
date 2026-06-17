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

Este paquete forma parte de [Hub UI](https://hubui.dev/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/modal/overview/
- Ejemplos en vivo: https://hubui.dev/modal/examples/
- Hub UI: https://hubui.dev/

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

Inyecta `HubActiveModal` en el componente de contenido para controlar el modal desde dentro:

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

| Método                    | Descripción                                             |
| ------------------------- | ------------------------------------------------------- |
| `open(content, options?)` | Abre un nuevo modal. Devuelve `HubModalRef`.            |
| `dismissAll(reason?)`     | Descarta todos los modales abiertos.                    |
| `hasOpenModals()`         | Devuelve `true` si hay al menos un modal abierto.       |
| `activeInstances`         | `EventEmitter` que emite al cambiar la pila de modales. |

### HubModalRef

| Miembro             | Descripción                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `result`            | `Promise` que resuelve en `close()` y rechaza en `dismiss()`.    |
| `componentInstance` | Instancia del componente de contenido.                           |
| `close(result?)`    | Cierra el modal.                                                 |
| `dismiss(reason?)`  | Descarta el modal.                                               |
| `update(options)`   | Actualiza opciones en tiempo de ejecución.                       |
| `closed`            | Observable que emite al cerrar con `close()`.                    |
| `dismissed`         | Observable que emite al descartar.                               |
| `shown`             | Emite cuando la animación de apertura termina.                   |
| `hidden`            | Emite cuando la animación de cierre termina y el DOM se elimina. |

### HubModalOptions

| Opción             | Tipo                                | Default                  | Descripción                                                     |
| ------------------ | ----------------------------------- | ------------------------ | --------------------------------------------------------------- |
| `animation`        | `boolean`                           | `true`                   | Activa transiciones de apertura/cierre.                         |
| `backdrop`         | `boolean \| 'static'`               | `true`                   | `'static'` impide cierre al hacer clic fuera.                   |
| `beforeDismiss`    | `() => boolean \| Promise<boolean>` | —                        | Guard de cierre. Devolver `false` lo cancela.                   |
| `centered`         | `boolean`                           | `false`                  | Centra el modal en el eje secundario al usar placement lateral. |
| `placement`        | `HubModalPlacement`                 | `Center`                 | Anclaje del modal en el viewport.                               |
| `fullscreen`       | `boolean \| string`                 | `false`                  | Pantalla completa siempre o bajo un breakpoint dado.            |
| `keyboard`         | `boolean`                           | `true`                   | Permite cerrar con la tecla ESC.                                |
| `scrollable`       | `boolean`                           | `false`                  | Activa el scroll interno del body del modal.                    |
| `size`             | `'sm' \| 'lg' \| 'xl' \| string`    | —                        | Ancho predefinido del diálogo.                                  |
| `windowClass`      | `string`                            | —                        | Clase extra en el host `.hub-modal`.                            |
| `modalDialogClass` | `string`                            | —                        | Clase extra en `.hub-modal__dialog`.                            |
| `backdropClass`    | `string`                            | —                        | Clase extra en `.hub-modal__backdrop`.                          |
| `headerSelector`   | `string`                            | —                        | Selector CSS para nodos del slot de cabecera.                   |
| `footerSelector`   | `string`                            | —                        | Selector CSS para nodos del slot de pie.                        |
| `dismissSelector`  | `string`                            | `[data-dismiss="modal"]` | Selector para elementos que descartan el modal al hacer clic.   |
| `closeSelector`    | `string`                            | `[data-close="modal"]`   | Selector para elementos que cierran el modal al hacer clic.     |
| `data`             | `any`                               | —                        | Datos adicionales que se asignan a la instancia del componente. |
| `container`        | `string \| HTMLElement`             | `body`                   | Contenedor DOM donde se inserta el modal.                       |
| `injector`         | `Injector`                          | —                        | Inyector personalizado para el componente de contenido.         |

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

Importa los estilos una vez en tu aplicación:

```scss
@import 'ng-hub-ui-modal/src/lib/modal.scss';
```

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
hub-modal-window {
	--hub-modal-max-width: 720px;
	--hub-modal-border-radius: 1rem;
	--hub-modal-backdrop-opacity: 0.7;
}
```

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
