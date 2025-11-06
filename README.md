# CMPC Libros - Sistema de Gestión de Inventario

Sistema completo de gestión de inventario de libros desarrollado con NestJS (Backend), React + TypeScript (Frontend) y PostgreSQL (Base de Datos).

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso de la Aplicación](#uso-de-la-aplicación)
- [Testing](#testing)
- [Decisiones de Diseño](#decisiones-de-diseño)
- [API Documentation](#api-documentation)

## ✨ Características

### Backend (NestJS)
- ✅ Autenticación JWT con registro y login
- ✅ CRUD completo de libros con soft delete (paranoid mode)
- ✅ Filtrado avanzado por género, editorial, autor y disponibilidad
- ✅ Búsqueda en tiempo real (búsqueda insensible a mayúsculas)
- ✅ Paginación del lado del servidor
- ✅ Ordenamiento dinámico por múltiples campos
- ✅ **Sistema de almacenamiento de imágenes con GCP Storage (modo MOCK)**
- ✅ Exportación de datos a CSV
- ✅ Sistema de logging con Winston
- ✅ Interceptores para transformación de respuestas
- ✅ Manejo global de errores
- ✅ Validación de datos con class-validator
- ✅ Documentación con Swagger/OpenAPI
- ✅ Estadísticas de inventario en tiempo real

### Frontend (React + TypeScript)
- ✅ Autenticación con login y registro
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Listado de libros con filtros avanzados
- ✅ Formularios con validación reactiva (React Hook Form + Zod)
- ✅ Búsqueda en tiempo real con debounce
- ✅ **Carga de imágenes con preview y drag & drop**
- ✅ Manejo de estado con Zustand + persistencia
- ✅ **Sistema de diseño personalizado con paleta de colores CMPC verde**
- ✅ Estilos con Tailwind CSS
- ✅ Notificaciones con React Toastify
- ✅ Gestión de servidor state con React Query
- ✅ Rutas protegidas con validación de token
- ✅ Exportación de datos a CSV desde el cliente

### Base de Datos (PostgreSQL)
- ✅ Modelo de datos normalizado
- ✅ Índices para optimización de consultas
- ✅ Soft delete (paranoid) para libros y usuarios
- ✅ Migraciones versionadas con Sequelize CLI
- ✅ Transacciones para integridad de datos
- ✅ **Precio en formato CLP (entero sin decimales)**
- ✅ UUIDs como claves primarias

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│              React + TypeScript + Tailwind CSS               │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │BookList  │  │BookForm  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                         │                                     │
│                    ┌────▼────┐                               │
│                    │ Services │                               │
│                    └────┬────┘                               │
└─────────────────────────┼─────────────────────────────────────┘
                          │ HTTP/REST
                          │
┌─────────────────────────▼─────────────────────────────────────┐
│                        BACKEND                                 │
│                  NestJS + TypeScript                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                    Controllers                        │    │
│  │  ┌──────────────┐  ┌──────────────┐                 │    │
│  │  │AuthController│  │BooksController│                 │    │
│  │  └──────┬───────┘  └──────┬───────┘                 │    │
│  └─────────┼──────────────────┼──────────────────────────┘    │
│            │                  │                                │
│  ┌─────────▼──────────────────▼──────────────────────────┐    │
│  │                     Services                           │    │
│  │  ┌──────────────┐  ┌──────────────┐                   │    │
│  │  │ AuthService  │  │ BooksService  │                   │    │
│  │  └──────┬───────┘  └──────┬───────┘                   │    │
│  └─────────┼──────────────────┼──────────────────────────┘    │
│            │                  │                                │
│  ┌─────────▼──────────────────▼──────────────────────────┐    │
│  │                    Repositories                        │    │
│  │        (Sequelize ORM - TypeScript Models)             │    │
│  └─────────┬──────────────────────────────────────────────┘    │
└────────────┼───────────────────────────────────────────────────┘
             │
             │ SQL
             │
┌────────────▼───────────────────────────────────────────────────┐
│                       DATABASE                                  │
│                      PostgreSQL                                 │
│                                                                  │
│  ┌──────────┐              ┌──────────┐                        │
│  │  users   │              │  books   │                        │
│  ├──────────┤              ├──────────┤                        │
│  │ id (PK)  │              │ id (PK)  │                        │
│  │ email    │              │ title    │ (indexed)              │
│  │ password │              │ author   │ (indexed)              │
│  │ name     │              │ editorial│ (indexed)              │
│  │ role     │              │ price    │                        │
│  └──────────┘              │ availability│ (indexed)           │
│                            │ genre    │ (indexed)              │
│                            │ imageUrl │                        │
│                            │ description│                      │
│                            │ deletedAt│ (soft delete)          │
│                            └──────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **NestJS 10** - Framework Node.js progresivo
- **TypeScript** - Superset tipado de JavaScript
- **PostgreSQL** - Base de datos relacional
- **Sequelize** - ORM para Node.js
- **Passport JWT** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas
- **Winston** - Sistema de logging
- **Swagger** - Documentación de API
- **Jest** - Framework de testing

### Frontend
- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Zustand** - Manejo de estado
- **React Query** - Gestión de datos asíncronos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP
- **Vitest** - Framework de testing

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación de contenedores
- **Nginx** - Servidor web para frontend

## 📦 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14.x (o Docker)
- Docker y Docker Compose (opcional, para despliegue con contenedores)

## 🚀 Instalación y Configuración

### Opción 1: Despliegue con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd cmpc
```

2. **Configurar variables de entorno**
```bash
# No es necesario, el docker-compose ya tiene las variables configuradas
```

3. **Iniciar los contenedores**
```bash
docker-compose up -d
```

4. **Ejecutar migraciones**
```bash
docker exec -it cmpc-backend npm run migration:run
```

5. **Acceder a la aplicación**
- Frontend: http://localhost
- Backend API: http://localhost:3000/api
- Swagger Documentation: http://localhost:3000/api/docs

### Opción 2: Instalación Manual

#### Backend

1. **Navegar al directorio del backend**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Crear la base de datos**
```bash
createdb cmpc_libros
```

5. **Ejecutar migraciones**
```bash
npm run migration:run
```

6. **Iniciar el servidor de desarrollo**
```bash
npm run start:dev
```

El backend estará disponible en http://localhost:3000

#### Frontend

1. **Navegar al directorio del frontend**
```bash
cd frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env si es necesario
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

El frontend estará disponible en http://localhost:5173

## 📖 Uso de la Aplicación

### 1. Registro de Usuario

1. Acceder a la aplicación en http://localhost (o http://localhost:5173 en desarrollo)
2. Hacer clic en "Regístrate aquí"
3. Completar el formulario con:
   - Nombre
   - Email
   - Contraseña (mínimo 6 caracteres)
4. Hacer clic en "Registrarse"

### 2. Inicio de Sesión

1. En la página de login, ingresar:
   - Email
   - Contraseña
2. Hacer clic en "Iniciar Sesión"

### 3. Dashboard

El dashboard muestra:
- Total de libros en el inventario
- Libros disponibles
- Libros no disponibles
- Acciones rápidas para agregar libros o ver el listado

### 4. Gestión de Libros

#### Agregar un Libro
1. Desde el dashboard o menú, hacer clic en "Agregar Nuevo Libro"
2. Completar el formulario:
   - Título *
   - Autor *
   - Editorial *
   - Precio (CLP - sin decimales) *
   - Género *
   - Disponibilidad (opcional, por defecto: true)
   - Descripción (opcional)
   - Imagen (opcional, formatos: JPG, PNG, GIF - máx 5MB)
3. Hacer clic en "Guardar"
4. Si se seleccionó una imagen, se generará una URL simulada de GCP Storage

**Nota sobre imágenes**: El sistema actualmente opera en modo MOCK, generando URLs simuladas de Google Cloud Storage. Ver [STORAGE_MOCK_GUIDE.md](backend/STORAGE_MOCK_GUIDE.md) para más detalles.

#### Listar Libros
1. Navegar a "Libros" desde el menú
2. Usar los filtros disponibles:
   - Búsqueda por texto
   - Filtro por género
   - Filtro por editorial
   - Filtro por autor
   - Filtro por disponibilidad
3. Ordenar por cualquier columna
4. Navegar por las páginas

#### Ver Detalles de un Libro
1. En el listado, hacer clic en "Ver Detalles"
2. Se mostrará toda la información del libro

#### Editar un Libro
1. En el listado o detalles, hacer clic en "Editar"
2. Modificar los campos deseados
3. Hacer clic en "Guardar"

#### Eliminar un Libro
1. En el listado, hacer clic en "Eliminar"
2. Confirmar la eliminación
3. El libro será eliminado (soft delete)

#### Exportar a CSV
1. En el listado de libros, hacer clic en "Exportar CSV"
2. Se descargará un archivo con todos los libros

## 🧪 Testing

### Backend

```bash
cd backend

# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests en modo watch
npm run test:watch
```

El proyecto cuenta con:
- Tests unitarios para servicios
- Tests unitarios para controladores
- Cobertura mínima del 80%

### Frontend

```bash
cd frontend

# Ejecutar todos los tests
npm test

# Ejecutar tests con UI
npm run test:ui

# Ejecutar tests con cobertura
npm run test:coverage
```

## 🎯 Decisiones de Diseño

### Arquitectura Backend

**Modular y Escalable**: Se utilizó la arquitectura modular de NestJS con separación de responsabilidades:
- **Controllers**: Manejan las peticiones HTTP
- **Services**: Contienen la lógica de negocio
- **Entities**: Definen los modelos de datos
- **DTOs**: Validan y transforman datos de entrada/salida

**Principios SOLID**:
- **Single Responsibility**: Cada clase tiene una única responsabilidad
- **Open/Closed**: Uso de interfaces y DTOs para extensibilidad
- **Liskov Substitution**: Implementación correcta de interfaces
- **Interface Segregation**: Interfaces específicas por contexto
- **Dependency Inversion**: Inyección de dependencias con NestJS

**Autenticación JWT**: Se eligió JWT por:
- Stateless (no requiere sesiones en servidor)
- Escalable horizontalmente
- Compatible con arquitecturas de microservicios

**Soft Delete**: Se implementó soft delete para:
- Auditoría y recuperación de datos
- Cumplimiento de normativas de retención de datos
- Mejor experiencia de usuario (deshacer eliminaciones)

**Logging**: Sistema de logging estructurado con Winston para:
- Auditoría de operaciones
- Debugging en producción
- Monitoreo de rendimiento

### Arquitectura Frontend

**Zustand para Estado Global**: Se eligió Zustand sobre Redux por:
- Más simple y menos boilerplate
- TypeScript de primera clase
- Mejor rendimiento
- Persistencia fácil

**React Query**: Para gestión de datos del servidor:
- Caché automático
- Revalidación en background
- Optimistic updates
- Reducción de código boilerplate

**React Hook Form + Zod**: Para formularios:
- Validación declarativa con TypeScript
- Mejor rendimiento (menos re-renders)
- Validación tanto en cliente como en servidor

**Tailwind CSS**: Framework CSS utility-first:
- Desarrollo más rápido
- Consistencia en diseño
- Bundle size optimizado
- Responsive design simplificado

### Base de Datos

**PostgreSQL**: Se eligió PostgreSQL por:
- Robustez y confiabilidad
- Soporte de transacciones ACID
- Rendimiento en consultas complejas
- Extensibilidad

**Índices**: Se crearon índices en:
- Campos de búsqueda frecuente (title, author, editorial, genre)
- Campos de filtrado (availability)
- Mejora significativa en rendimiento de queries

**Sequelize**: ORM TypeScript-first:
- Type safety
- Migraciones versionadas
- Modelos declarativos

## 📚 API Documentation

La documentación completa de la API está disponible en Swagger:

**URL**: http://localhost:3000/api/docs

### Endpoints Principales

#### Autenticación

```
POST /api/auth/register - Registro de usuario
POST /api/auth/login - Inicio de sesión
```

#### Libros

```
GET    /api/books - Listar libros (con filtros, búsqueda, paginación)
GET    /api/books/:id - Obtener un libro
POST   /api/books - Crear un libro
PATCH  /api/books/:id - Actualizar un libro
DELETE /api/books/:id - Eliminar un libro (soft delete)
POST   /api/books/:id/image - Subir imagen de libro
GET    /api/books/export/csv - Exportar libros a CSV
GET    /api/books/statistics - Obtener estadísticas
```

### Ejemplos de Uso

#### Registro
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

#### Crear Libro
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Cien años de soledad",
    "author": "Gabriel García Márquez",
    "editorial": "Editorial Sudamericana",
    "price": 25000,
    "genre": "Ficción",
    "availability": true,
    "description": "Obra maestra de la literatura latinoamericana"
  }'
```

**Nota**: El precio debe ser un número entero en pesos chilenos (CLP), sin decimales.

#### Buscar Libros
```bash
curl -X GET "http://localhost:3000/api/books?search=García&genre=Ficción&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

## 📊 Modelo Relacional de la Base de Datos

```
┌─────────────────────────────┐
│          users              │
├─────────────────────────────┤
│ id              UUID PK     │
│ email           VARCHAR     │ UNIQUE
│ password        VARCHAR     │
│ name            VARCHAR     │
│ role            ENUM        │
│ createdAt       TIMESTAMP   │
│ updatedAt       TIMESTAMP   │
└─────────────────────────────┘

```
┌─────────────────────────────┐
│          books              │
├─────────────────────────────┤
│ id              UUID PK     │
│ title           VARCHAR     │ INDEXED
│ author          VARCHAR     │ INDEXED
│ editorial       VARCHAR     │ INDEXED
│ price           INTEGER     │ (CLP - sin decimales)
│ availability    BOOLEAN     │ INDEXED
│ genre           VARCHAR     │ INDEXED
│ imageUrl        VARCHAR     │ (URL GCP Storage - MOCK)
│ description     TEXT        │
│ createdAt       TIMESTAMP   │
│ updatedAt       TIMESTAMP   │
│ deletedAt       TIMESTAMP   │ (Soft Delete)
└─────────────────────────────┘
```
```

## 🤝 Contribuciones

Este es un proyecto de prueba técnica. Para sugerencias o mejoras, por favor contactar a Pedro Muñoz L. `pedro.developer86@gmail.com` .

## 📄 Licencia

MIT

---

Desarrollado con ❤️ para CMPC

## 📚 Documentación Adicional

- [📖 Guía de Inicio Rápido](./QUICK_START.md)
- [🏗️ Arquitectura del Sistema](./ARCHITECTURE.md)
- [🎨 Sistema de Diseño Frontend](./frontend/DESIGN_SYSTEM.md)
- [⚙️ Backend API Documentation](./backend/README.md)
- [🖥️ Frontend Documentation](./frontend/README.md)
- [💾 Guía de Storage (GCP Mock)](./backend/STORAGE_MOCK_GUIDE.md)
