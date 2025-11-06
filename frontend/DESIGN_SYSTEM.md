# Sistema de Diseño - CMPC Libros

## Paleta de Colores

### Verde CMPC (Color Principal)

Los colores están basados en el verde corporativo de CMPC.

```css
primary-50:  #f0fdf4  /* Verde muy claro - Fondos suaves */
primary-100: #dcfce7  /* Verde pastel - Hover estados */
primary-200: #bbf7d0  /* Verde suave - Bordes */
primary-300: #86efac  /* Verde claro - Badges */
primary-400: #4ade80  /* Verde medio claro - Botones secundarios */
primary-500: #22c55e  /* Verde CMPC Principal - Botones primarios */
primary-600: #16a34a  /* Verde intenso - Hover principal */
primary-700: #15803d  /* Verde oscuro - Textos importantes */
primary-800: #166534  /* Verde muy oscuro - Fondos oscuros */
primary-900: #14532d  /* Verde profundo - Contraste máximo */
```

### Colores CMPC Específicos

```css
cmpc-green:       #22c55e  /* Verde corporativo principal */
cmpc-green-dark:  #16a34a  /* Verde oscuro para hover */
cmpc-green-light: #4ade80  /* Verde claro para acentos */
```

## Uso de Colores

### Botones

- **Primario**: `bg-primary-600 hover:bg-primary-700` - Verde CMPC para acciones principales
- **Secundario**: `bg-gray-200 hover:bg-gray-300` - Gris para acciones secundarias
- **Peligro**: `bg-red-600 hover:bg-red-700` - Rojo para eliminar

### Textos

- **Principal**: `text-gray-800` - Títulos y texto importante
- **Secundario**: `text-gray-600` - Texto descriptivo
- **Enlaces**: `text-primary-600 hover:text-primary-700` - Verde CMPC para links
- **Énfasis**: `text-primary-700` - Verde oscuro para destacar

### Fondos

- **Gradiente Principal**: `from-primary-500 to-primary-700` - Login/Register
- **Card Header**: `bg-primary-600` - Headers de tarjetas importantes
- **Fondo App**: `bg-gray-50` - Fondo general de la aplicación
- **Cards**: `bg-white` - Tarjetas de contenido

### Bordes e Indicadores

- **Borde Principal**: `border-primary-600` - Indicador de sección activa
- **Focus**: `ring-primary-500` - Estado de focus en inputs
- **Disponible**: `text-green-600` - Estados positivos
- **No Disponible**: `text-red-600` - Estados negativos

## Iconos

Todos los iconos usan `lucide-react` con colores de la paleta verde CMPC:

- **Logo/Marca**: `text-primary-600` - h-8 w-8
- **Navegación**: `text-gray-600 hover:text-primary-600` - h-5 w-5
- **Dashboard Stats**: `text-primary-600` en fondo `bg-primary-100` - h-8 w-8
- **Acciones**: `text-primary-600` - h-5 w-5

## Componentes Base

### Input
```css
w-full px-3 py-2 border border-gray-300 rounded-lg 
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
```

### Card
```css
bg-white rounded-lg shadow-md p-6
```

### Card con Borde Verde
```css
card border-l-4 border-primary-600
```

### Badge Verde
```css
bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium
```

## Tipografía

- **Familia**: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif
- **Títulos H1**: text-3xl font-bold text-gray-800
- **Títulos H2**: text-xl font-bold text-gray-800
- **Cuerpo**: text-base text-gray-600
- **Pequeño**: text-sm text-gray-600

## Espaciado

- **Sección**: space-y-6
- **Elementos**: space-y-4
- **Grid Gap**: gap-4 o gap-6
- **Padding Card**: p-6
- **Padding Button**: py-2 px-4

## Sombras

- **Card**: shadow-md
- **Card Elevada**: shadow-lg
- **Login/Register**: shadow-2xl

## Bordes Redondeados

- **Botones**: rounded-lg
- **Cards**: rounded-lg o rounded-xl
- **Badge**: rounded-full
- **Inputs**: rounded-lg

## Transiciones

- **Hover**: transition-colors duration-200
- **General**: transition-all duration-200

## Ejemplo de Uso

```tsx
// Botón Principal
<button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
  Agregar Libro
</button>

// Card con Indicador Verde
<div className="card border-l-4 border-primary-600">
  <h2 className="text-xl font-bold text-gray-800">Título</h2>
  <p className="text-gray-600">Descripción</p>
</div>

// Badge de Estado
<span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
  Disponible
</span>

// Header con Gradiente
<div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg">
  <h1 className="text-3xl font-bold">Dashboard</h1>
</div>
```
