# Diagrama de Arquitectura - CMPC Libros

## Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React Frontend                        │   │
│  │                                                           │   │
│  │  Components:                                             │   │
│  │  • Login/Register                                        │   │
│  │  • Dashboard (Statistics)                                │   │
│  │  • BookList (Table, Filters, Pagination, Search)        │   │
│  │  • BookForm (Create/Edit with validation)               │   │
│  │  • BookDetail (View)                                     │   │
│  │                                                           │   │
│  │  State Management:                                       │   │
│  │  • Zustand (Global State - Auth)                        │   │
│  │  • React Query (Server State - Cache)                   │   │
│  │                                                           │   │
│  │  HTTP Client: Axios + Interceptors                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              │ REST API (HTTP/JSON)              │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                      CAPA DE APLICACIÓN                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    NestJS Backend                        │   │
│  │                                                           │   │
│  │  ┌────────────────────────────────────────────────┐     │   │
│  │  │              Controllers Layer                  │     │   │
│  │  │  • AuthController (Login, Register)            │     │   │
│  │  │  • BooksController (CRUD, Export, Stats)       │     │   │
│  │  │                                                 │     │   │
│  │  │  Guards: JwtAuthGuard                          │     │   │
│  │  │  Interceptors: Logging, Transform              │     │   │
│  │  │  Filters: HttpExceptionFilter                  │     │   │
│  │  └────────────────────────────────────────────────┘     │   │
│  │                        │                                 │   │
│  │  ┌────────────────────▼───────────────────────────┐     │   │
│  │  │              Services Layer                     │     │   │
│  │  │  • AuthService (JWT, Validation)               │     │   │
│  │  │  • BooksService (Business Logic)               │     │   │
│  │  │  • UsersService (User Management)              │     │   │
│  │  │                                                 │     │   │
│  │  │  Logger: Winston                               │     │   │
│  │  └────────────────────────────────────────────────┘     │   │
│  │                        │                                 │   │
│  │  ┌────────────────────▼───────────────────────────┐     │   │
│  │  │              Data Access Layer                  │     │   │
│  │  │  • Sequelize ORM                               │     │   │
│  │  │  • TypeScript Models/Entities                  │     │   │
│  │  │  • Repository Pattern                          │     │   │
│  │  └────────────────────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              │ SQL Queries                       │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                       CAPA DE DATOS                              │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   PostgreSQL Database                    │   │
│  │                                                           │   │
│  │  Tables:                                                 │   │
│  │  ┌──────────────┐         ┌──────────────┐             │   │
│  │  │    users     │         │    books     │             │   │
│  │  ├──────────────┤         ├──────────────┤             │   │
│  │  │ id (PK)      │         │ id (PK)      │             │   │
│  │  │ email (UQ)   │         │ title (IX)   │             │   │
│  │  │ password     │         │ author (IX)  │             │   │
│  │  │ name         │         │ editorial(IX)│             │   │
│  │  │ role         │         │ price        │             │   │
│  │  │ createdAt    │         │ availability │             │   │
│  │  │ updatedAt    │         │ genre (IX)   │             │   │
│  │  └──────────────┘         │ imageUrl     │             │   │
│  │                            │ description  │             │   │
│  │                            │ deletedAt    │ Soft Delete│   │
│  │                            │ createdAt    │             │   │
│  │                            │ updatedAt    │             │   │
│  │                            └──────────────┘             │   │
│  │                                                           │   │
│  │  Indexes:                                                │   │
│  │  • books.title, author, editorial, genre, availability  │   │
│  │  • users.email (unique)                                 │   │
│  │                                                           │   │
│  │  Features:                                               │   │
│  │  • ACID Transactions                                     │   │
│  │  • Soft Delete (paranoid)                               │   │
│  │  • Timestamps (createdAt, updatedAt)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘

## Flujo de Datos

1. **Autenticación**:
   ```
   Usuario → Login Form → AuthService → JWT Token → localStorage
   → Axios Interceptor → Authorization Header → Protected Routes
   ```

2. **Operación CRUD**:
   ```
   User Action → React Component → React Query → Axios
   → NestJS Controller → Guards/Interceptors → Service
   → Sequelize ORM → PostgreSQL → Response → Transform
   → Cache (React Query) → UI Update
   ```

3. **Búsqueda y Filtrado**:
   ```
   Search Input (debounced) → Filter State → API Request
   → BookService.findAll() → WHERE clause + LIKE
   → Indexed Search → Paginated Results → Table Display
   ```

## Patrones de Diseño Implementados

1. **Repository Pattern**: Sequelize ORM abstrae el acceso a datos
2. **Dependency Injection**: NestJS DI container
3. **Strategy Pattern**: Passport strategies (JWT, Local)
4. **Observer Pattern**: React Query for state management
5. **Factory Pattern**: NestJS module factory
6. **Interceptor Pattern**: Request/Response transformation
7. **Guard Pattern**: Authentication and authorization
8. **Filter Pattern**: Exception handling

## Seguridad

- JWT con expiración de tokens
- Bcrypt para hash de contraseñas (salt rounds: 10)
- Validación de entrada con class-validator
- CORS configurado
- SQL Injection protection (ORM)
- XSS protection (React auto-escaping)
