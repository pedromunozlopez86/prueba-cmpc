# CMPC Libros - Frontend

React + TypeScript frontend application para el sistema de gestión de inventario de libros CMPC.

## ✨ Características

- 🔐 **Autenticación completa** (Login/Register) con JWT
- 📊 **Dashboard** con estadísticas en tiempo real
- 📚 **Listado de libros** con filtros avanzados, búsqueda y paginación
- ✏️ **CRUD completo** de libros con validación
- 🖼️ **Carga de imágenes** con preview y drag & drop
- 🎨 **Sistema de diseño CMPC** con paleta de colores verde corporativa
- 💰 **Formato CLP** para precios (sin decimales, con separadores de miles)
- 📱 **Diseño responsive** optimizado para móviles y desktop
- 🔄 **Estado persistente** con Zustand
- ⚡ **Optimización de rendimiento** con React Query
- 📥 **Exportación a CSV** de inventario

## 🛠️ Stack Tecnológico

- **React 18** - Librería UI con componentes funcionales
- **TypeScript** - Tipado estático
- **Vite 5** - Build tool de última generación
- **Tailwind CSS 3** - Framework CSS utility-first
- **React Router 6** - Enrutamiento con rutas protegidas
- **Zustand 4** - Gestión de estado global con persistencia
- **React Query 5** - Gestión de servidor state con caché
- **React Hook Form 7** - Manejo eficiente de formularios
- **Zod 3** - Validación de esquemas TypeScript-first
- **Axios** - Cliente HTTP con interceptores
- **React Toastify** - Notificaciones toast
- **Lucide React** - Iconos modernos

## 🎨 Sistema de Diseño

### Paleta de Colores CMPC Verde

```css
primary-50:  #f0fdf4   /* Fondo suave */
primary-100: #dcfce7   /* Hover suave */
primary-200: #bbf7d0   /* Accents */
primary-300: #86efac   /* Highlights */
primary-400: #4ade80   /* Interactive */
primary-500: #22c55e   /* Principal - CMPC Verde */
primary-600: #16a34a   /* Hover principal */
primary-700: #15803d   /* Active */
primary-800: #166534   /* Dark mode */
primary-900: #14532d   /* Texto oscuro */
```

Ver [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) para la guía completa.

## 🚀 Inicio Rápido

Ver el [README principal](../README.md) para instrucciones completas de instalación.

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

## 📝 Scripts Disponibles

```bash
npm run dev           # Servidor de desarrollo con hot reload
npm run build         # Build para producción
npm run preview       # Vista previa del build de producción
npm run lint          # Ejecutar ESLint
npm run type-check    # Verificación de tipos TypeScript
npm run test          # Ejecutar tests con Vitest
npm run test:ui       # Ejecutar tests con interfaz visual
npm run test:coverage # Ejecutar tests con cobertura
```

## 🔧 Variables de Entorno

```bash
# .env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   └── Layout.tsx   # Layout principal con navegación
│   ├── pages/           # Páginas/vistas de la aplicación
│   │   ├── Login.tsx    # Página de login
│   │   ├── Register.tsx # Página de registro
│   │   ├── Dashboard.tsx# Dashboard con estadísticas
│   │   ├── BookList.tsx # Listado de libros con filtros
│   │   ├── BookDetail.tsx # Detalles de un libro
│   │   └── BookForm.tsx # Formulario crear/editar libro
│   ├── services/        # Servicios de API
│   │   ├── authService.ts  # Autenticación
│   │   └── bookService.ts  # Operaciones de libros
│   ├── store/           # Estado global con Zustand
│   │   └── authStore.ts # Estado de autenticación
│   ├── types/           # Definiciones TypeScript
│   │   ├── auth.ts      # Tipos de autenticación
│   │   └── book.ts      # Tipos de libros
│   ├── App.tsx          # Componente raíz con rutas
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos globales Tailwind
├── DESIGN_SYSTEM.md     # Guía del sistema de diseño
└── package.json
```

## 🔐 Autenticación

El frontend implementa autenticación basada en JWT con:

- **Persistencia de sesión** usando Zustand persist
- **Rutas protegidas** que redirigen a login si no hay token
- **Interceptores Axios** para agregar token automáticamente
- **Manejo de expiración** de tokens con redirección a login

### Flujo de Autenticación

1. Usuario ingresa credenciales en `/login` o `/register`
2. Backend retorna `{ access_token, user }` encapsulado en `{ data, statusCode, timestamp }`
3. Token se guarda en `localStorage` vía Zustand persist
4. Axios interceptor agrega `Authorization: Bearer <token>` a todas las peticiones
5. Al refrescar página, estado se rehidrata desde `localStorage`

## 📚 Gestión de Libros

### Características Principales

- **Listado paginado** con 10 libros por página
- **Búsqueda en tiempo real** con debounce de 300ms
- **Filtros múltiples**: género, editorial, autor, disponibilidad
- **Ordenamiento** por cualquier columna
- **Vista detallada** con toda la información del libro
- **Formulario unificado** para crear y editar
- **Validación robusta** con Zod y React Hook Form
- **Carga de imágenes** con preview antes de enviar
- **Exportación CSV** de todo el inventario

### Formato de Precios

Los precios se manejan como números enteros en CLP:

```typescript
// Input del usuario
<input type="number" step="1" min="0" placeholder="15000" />

// Validación Zod
price: z.number().int('El precio debe ser un número entero').min(0)

// Display en la UI
${Number(book.price).toLocaleString('es-CL')}
// Resultado: $15.000
```

## 🖼️ Manejo de Imágenes

El frontend soporta carga de imágenes con:

- Validación de formato (JPG, PNG, GIF)
- Validación de tamaño (máx 5MB)
- Preview antes de enviar
- Drag & drop
- Estado de carga visual

**Nota**: El backend actualmente opera en modo MOCK generando URLs simuladas de GCP Storage.

## 🎯 Estado Global (Zustand)

### Auth Store

```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}
```

El estado de autenticación se persiste automáticamente en `localStorage` con la key `auth-storage`.

## 🔍 React Query

Configuración con:

- **Stale time**: 5 minutos
- **Cache time**: 10 minutos
- **Retry**: 1 vez en caso de error
- **Refetch on window focus**: Habilitado

Ejemplos de uso:

```typescript
// Query para libros con filtros
const { data, isLoading } = useQuery({
  queryKey: ['books', page, search, filters],
  queryFn: () => bookService.getBooks({ page, search, ...filters }),
  enabled: !!token, // Solo si hay token
});

// Mutation para crear libro
const createMutation = useMutation({
  mutationFn: bookService.createBook,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['books'] });
    toast.success('Libro creado exitosamente');
    navigate('/books');
  },
});
```

## 🧪 Testing

El proyecto usa Vitest para testing:

```bash
# Ejecutar todos los tests
npm test

# Con interfaz visual
npm run test:ui

# Con cobertura
npm run test:coverage
```

## 📦 Build para Producción

```bash
# Generar build optimizado
npm run build

# Los archivos estarán en dist/
# Listo para desplegar en cualquier servidor estático
```

## 🐳 Docker

El frontend se containeriza usando multi-stage build:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

## 🔗 Enlaces Útiles

- [Documentación de React](https://react.dev)
- [Documentación de TypeScript](https://www.typescriptlang.org)
- [Documentación de Vite](https://vitejs.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [Documentación de Zustand](https://github.com/pmndrs/zustand)
- [Documentación de React Query](https://tanstack.com/query)

---

**Versión**: 1.0.0  
**Última actualización**: 6 de noviembre de 2025
