# Guía de Instalación Rápida - CMPC Libros

## Pasos para empezar

### 1. Instalación de Dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configuración de Variables de Entorno

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# Editar .env con las credenciales de tu base de datos local
```

Contenido del archivo `.env`:
```env
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
JWT_SECRET=tu-secreto-super-seguro-cambialo-en-produccion
JWT_EXPIRATION=24h

# Storage (GCP Mock Mode)
STORAGE_MODE=mock
GCP_BUCKET_NAME=cmpc-libros-bucket
GCP_PROJECT_ID=cmpc-libros-project
# GCP_KEYFILE_PATH=/path/to/keyfile.json  # Descomentar en producción

# Frontend
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Contenido del archivo `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local

1. Instalar PostgreSQL si no lo tienes:
   - macOS: `brew install postgresql@15`
   - Ubuntu: `sudo apt install postgresql`
   - Windows: Descargar desde postgresql.org

2. Iniciar PostgreSQL:
   - macOS: `brew services start postgresql@15`
   - Ubuntu: `sudo systemctl start postgresql`

3. Crear la base de datos:
```bash
createdb cmpc_libros
```

O usando psql:
```bash
psql postgres
CREATE DATABASE cmpc_libros;
\q
```

#### Opción B: Docker (Solo PostgreSQL)

```bash
docker run --name cmpc-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cmpc_libros \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 4. Ejecutar Migraciones

Antes de ejecutar las migraciones, asegúrate de que PostgreSQL esté corriendo y la base de datos `cmpc_libros` esté creada.

```bash
cd backend
npm run migration:run
```

Deberías ver un mensaje similar a:
```
== 20241106000001-create-users: migrating =======
== 20241106000001-create-users: migrated (0.020s)

== 20241106000002-create-books: migrating =======
== 20241106000002-create-books: migrated (0.015s)

== 20241106000003-change-price-to-integer: migrating =======
== 20241106000003-change-price-to-integer: migrated (0.012s)
```

**Notas importantes**:
- El sistema almacena los precios en formato CLP (pesos chilenos) como enteros sin decimales.
- Las imágenes se gestionan con un sistema de Storage en modo MOCK para desarrollo (genera URLs simuladas de GCP Storage).
- Para producción, cambia `STORAGE_MODE=mock` a `STORAGE_MODE=gcp` en el `.env` y configura `GCP_KEYFILE_PATH`.

### 5. Iniciar Aplicación

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

Backend estará disponible en: http://localhost:3000
Swagger docs en: http://localhost:3000/api/docs

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend estará disponible en: http://localhost:5173

### 6. Usuario de Prueba

Puedes crear un usuario desde la interfaz de registro, o usar estos pasos:

1. Ve a http://localhost:5173
2. Haz clic en "Regístrate aquí"
3. Completa el formulario:
   - Nombre: Admin CMPC
   - Email: admin@cmpc.com
   - Contraseña: admin123

## Despliegue con Docker (Opción más simple)

Si prefieres usar Docker para todo:

```bash
# En la raíz del proyecto
docker-compose up -d

# Esperar a que los contenedores inicien

# Ejecutar migraciones
docker exec -it cmpc-backend npm run migration:run

# Ver logs
docker-compose logs -f
```

Acceder a:
- Frontend: http://localhost
- Backend API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs

## Testing

### Backend
```bash
cd backend
npm test
npm run test:cov  # Con cobertura
```

### Frontend
```bash
cd frontend
npm test
npm run test:coverage  # Con cobertura
```

## Comandos Útiles

### Backend
```bash
npm run start:dev       # Modo desarrollo con hot reload
npm run start:debug     # Modo debug
npm run build           # Build de producción
npm run lint            # Linter
npm run format          # Formatear código con Prettier
```

### Frontend
```bash
npm run dev             # Servidor de desarrollo
npm run build           # Build de producción
npm run preview         # Preview del build
npm run lint            # Linter
```

### Docker
```bash
docker-compose up -d                  # Iniciar todos los servicios
docker-compose down                   # Detener todos los servicios
docker-compose logs -f                # Ver logs en tiempo real
docker-compose logs -f backend        # Ver logs solo del backend
docker-compose restart backend        # Reiniciar un servicio
docker exec -it cmpc-backend sh       # Acceder al contenedor del backend
```

## Solución de Problemas

### Error: "Cannot connect to database"

1. Verificar que PostgreSQL esté corriendo:
```bash
# macOS/Linux
pg_isready

# O verificar el proceso
ps aux | grep postgres
```

2. Verificar credenciales en el archivo `.env`

3. Si usas Docker:
```bash
docker ps  # Verificar que cmpc-postgres esté corriendo
docker logs cmpc-postgres  # Ver logs
```

### Error: "Port 3000 already in use"

```bash
# Encontrar el proceso usando el puerto
lsof -i :3000

# Matar el proceso
kill -9 <PID>
```

### Error al instalar dependencias

```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Frontend no se conecta con Backend

1. Verificar que el backend esté corriendo en puerto 3000
2. Verificar la variable `VITE_API_URL` en el archivo `.env` del frontend
3. Revisar la consola del navegador para ver errores de CORS

## Próximos Pasos

1. Explorar la API con Swagger: http://localhost:3000/api/docs
2. Crear algunos libros de prueba
3. Probar los filtros y búsqueda
4. Exportar datos a CSV
5. Revisar el código y los tests

## Recursos Adicionales

- [Documentación NestJS](https://docs.nestjs.com/)
- [Documentación React](https://react.dev/)
- [Documentación PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación Sequelize](https://sequelize.org/)
- [Documentación Tailwind CSS](https://tailwindcss.com/)

---

Si encuentras algún problema, revisa el archivo README.md principal o los logs de la aplicación.
