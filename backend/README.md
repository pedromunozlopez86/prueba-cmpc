# CMPC Libros - Backend

API Backend NestJS para el sistema de gestión de inventario de libros CMPC.

## ✨ Características

- 🔐 **Autenticación JWT** con Passport y Bcrypt
- 📚 **CRUD completo** de libros con soft delete (paranoid mode)
- 🔍 **Filtrado avanzado** y búsqueda full-text
- 📄 **Paginación** del lado del servidor
- 🖼️ **Sistema de almacenamiento** con GCP Storage (modo MOCK)
- 📊 **Estadísticas** de inventario en tiempo real
- 📥 **Exportación CSV** de datos
- 📝 **Documentación Swagger** completa
- 🧪 **Testing robusto** con cobertura >80%
- 📋 **Logging estructurado** con Winston
- 🛡️ **Validación** con class-validator y class-transformer
- 🔄 **Interceptores** para transformación de respuestas
- ⚠️ **Manejo global** de errores

## 🛠️ Stack Tecnológico

- **NestJS 10** - Framework progresivo de Node.js
- **TypeScript** - Lenguaje tipado
- **PostgreSQL 15** - Base de datos relacional
- **Sequelize 6** - ORM con soporte TypeScript
- **Passport JWT** - Estrategia de autenticación
- **Bcrypt** - Hash de contraseñas
- **Winston** - Sistema de logging
- **Swagger/OpenAPI** - Documentación de API
- **Jest** - Framework de testing
- **class-validator** - Validación de DTOs
- **Multer** - Manejo de archivos multipart

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── common/              # Código compartido
│   │   ├── filters/         # Filtros de excepciones
│   │   └── interceptors/    # Interceptores globales
│   ├── database/            # Configuración de BD
│   │   ├── config/          # Config de Sequelize
│   │   └── migrations/      # Migraciones versionadas
│   ├── modules/
│   │   ├── auth/            # Módulo de autenticación
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/         # DTOs de auth
│   │   │   ├── guards/      # Guards JWT
│   │   │   └── strategies/  # Estrategias Passport
│   │   ├── books/           # Módulo de libros
│   │   │   ├── books.controller.ts
│   │   │   ├── books.service.ts
│   │   │   ├── dto/         # DTOs de libros
│   │   │   └── entities/    # Entidades Sequelize
│   │   ├── users/           # Módulo de usuarios
│   │   │   ├── users.service.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   └── storage/         # Módulo de almacenamiento
│   │       ├── storage.service.ts  # Servicio GCP (MOCK)
│   │       └── storage.module.ts
│   ├── app.module.ts        # Módulo raíz
│   └── main.ts              # Bootstrap de la aplicación
├── uploads/                 # Carpeta temporal (no usada en MOCK)
├── .env                     # Variables de entorno
├── .sequelizerc             # Config de Sequelize CLI
└── package.json
```

## 🚀 Inicio Rápido

Ver el [README principal](../README.md) para instrucciones completas de instalación.

### Instalación Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Crear base de datos
createdb cmpc_libros

# Ejecutar migraciones
npm run migration:run

# Iniciar servidor de desarrollo
npm run start:dev

# La API estará disponible en http://localhost:3000/api
# Swagger: http://localhost:3000/api/docs
```

## 📝 Scripts Disponibles

```bash
npm run start:dev     # Servidor de desarrollo con watch mode
npm run start:prod    # Servidor de producción
npm run build         # Compilar TypeScript
npm run lint          # Ejecutar ESLint
npm run format        # Formatear código con Prettier
npm run test          # Ejecutar tests unitarios
npm run test:cov      # Ejecutar tests con cobertura
npm run test:watch    # Ejecutar tests en modo watch
npm run migration:run # Ejecutar migraciones pendientes
npm run migration:undo# Revertir última migración
```

## 🔧 Variables de Entorno

```bash
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cmpc_libros

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Storage (GCP Mock Mode)
STORAGE_MODE=mock                    # mock | production
GCP_BUCKET_NAME=cmpc-libros-bucket
GCP_PROJECT_ID=cmpc-libros-project
# GCP_KEYFILE_PATH=/path/to/keyfile.json  # Descomentar en producción

# Frontend
FRONTEND_URL=http://localhost:5173
```

## 🗄️ Base de Datos

### Modelos

#### User
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, hashed)
- `name` (VARCHAR)
- `role` (ENUM: user, admin)
- `createdAt`, `updatedAt`

#### Book
- `id` (UUID, PK)
- `title` (VARCHAR, INDEXED)
- `author` (VARCHAR, INDEXED)
- `editorial` (VARCHAR, INDEXED)
- `price` (INTEGER) - Pesos chilenos sin decimales
- `availability` (BOOLEAN, INDEXED)
- `genre` (VARCHAR, INDEXED)
- `imageUrl` (VARCHAR) - URL de GCP Storage
- `description` (TEXT)
- `createdAt`, `updatedAt`, `deletedAt` (Soft delete)

### Migraciones

```bash
# Ejecutar migraciones
npm run migration:run

# Revertir migración
npm run migration:undo

# Estado de migraciones
npx sequelize-cli db:migrate:status
```

## 🔐 Autenticación

### JWT Strategy

El backend usa Passport JWT para autenticación:

1. Usuario envía credenciales a `/api/auth/login`
2. Backend valida y retorna token JWT
3. Token debe incluirse en header: `Authorization: Bearer <token>`
4. Token expira en 24 horas (configurable)

### Endpoints de Auth

```
POST /api/auth/register  # Registro de usuario
POST /api/auth/login     # Inicio de sesión
```

## 📚 API de Libros

### Endpoints

```
GET    /api/books               # Listar con filtros y paginación
GET    /api/books/:id           # Obtener por ID
POST   /api/books               # Crear nuevo
PATCH  /api/books/:id           # Actualizar
DELETE /api/books/:id           # Soft delete
POST   /api/books/:id/image     # Subir imagen
GET    /api/books/export/csv    # Exportar a CSV
GET    /api/books/statistics    # Estadísticas
```

### Filtros Disponibles

- `search` - Búsqueda en title, author, editorial, genre
- `genre` - Filtro por género específico
- `editorial` - Filtro por editorial
- `author` - Filtro por autor
- `availability` - true | false
- `sortBy` - Campo para ordenar (default: createdAt)
- `sortOrder` - ASC | DESC (default: DESC)
- `page` - Número de página (default: 1)
- `limit` - Resultados por página (default: 10)

### Ejemplo de Request

```bash
curl -X GET "http://localhost:3000/api/books?search=García&genre=Ficción&page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### Ejemplo de Response

```json
{
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Cien años de soledad",
        "author": "Gabriel García Márquez",
        "editorial": "Sudamericana",
        "price": 25000,
        "availability": true,
        "genre": "Ficción",
        "imageUrl": "https://storage.googleapis.com/cmpc-libros-bucket/...",
        "description": "Obra maestra...",
        "createdAt": "2025-11-06T...",
        "updatedAt": "2025-11-06T..."
      }
    ],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  },
  "statusCode": 200,
  "timestamp": "2025-11-06T..."
}
```

## 🖼️ Sistema de Almacenamiento

El backend implementa un sistema de almacenamiento modular que simula GCP Storage en modo MOCK.

### Modo MOCK (Actual)

- Genera URLs aleatorias simulando GCP Storage
- No requiere credenciales de GCP
- Perfecto para desarrollo y testing
- Ver [STORAGE_MOCK_GUIDE.md](./STORAGE_MOCK_GUIDE.md) para detalles

### Migrar a Producción

1. Instalar `@google-cloud/storage`
2. Configurar credenciales GCP
3. Cambiar `STORAGE_MODE=production` en `.env`
4. Reiniciar servidor

El código ya está preparado para producción, solo requiere configuración.

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con cobertura (mínimo 80%)
npm run test:cov

# En modo watch
npm run test:watch

# Tests específicos
npm test -- books.service.spec.ts
```

### Cobertura

El proyecto mantiene >80% de cobertura en:
- Statements
- Branches
- Functions
- Lines

## 📋 Logging

El sistema usa Winston para logging estructurado:

```typescript
// Logs de ejemplo
[BooksService] Creating book: Cien años de soledad
[BooksService] Image uploaded for book uuid: https://...
[StorageService] [MOCK] Simulated upload to GCP Storage
```

Niveles de log:
- `error` - Errores críticos
- `warn` - Advertencias
- `info` - Información general
- `debug` - Debugging (solo en desarrollo)

## 🛡️ Validación

Todos los DTOs usan `class-validator`:

```typescript
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsInt()
  @Min(0)
  price: number;  // Entero en CLP

  // ... más campos
}
```

## 🔄 Interceptores

### TransformInterceptor

Transforma todas las respuestas al formato:

```json
{
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2025-11-06T..."
}
```

### LoggingInterceptor

Registra todas las peticiones HTTP con:
- Método y ruta
- Tiempo de respuesta
- Código de estado

## 📖 Documentación Swagger

La documentación completa de la API está disponible en:

**http://localhost:3000/api/docs**

Incluye:
- Todos los endpoints documentados
- Esquemas de request/response
- Posibilidad de probar endpoints
- Autenticación con Bearer token

## 🐳 Docker

El backend se containeriza con:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["node", "dist/main"]
```

## 📊 Estadísticas

Endpoint de estadísticas retorna:

```json
{
  "total": 150,
  "available": 120,
  "unavailable": 30,
  "byGenre": [
    { "genre": "Ficción", "count": 50 },
    { "genre": "Historia", "count": 30 },
    ...
  ]
}
```

## 🔗 Enlaces Útiles

- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de Sequelize](https://sequelize.org)
- [Documentación de Passport](http://www.passportjs.org)
- [Documentación de Winston](https://github.com/winstonjs/winston)

---

**Versión**: 1.0.0  
**Última actualización**: 6 de noviembre de 2025
