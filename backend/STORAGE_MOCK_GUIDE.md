# 📦 Sistema de Almacenamiento GCP (Mock Mode)

## 🎯 Descripción

El sistema de almacenamiento de imágenes está configurado para simular Google Cloud Platform (GCP) Storage en modo MOCK. Esto permite desarrollar y probar la funcionalidad sin necesidad de configurar credenciales reales de GCP.

## 🔧 Configuración Actual

### Modo MOCK Activado

```env
STORAGE_MODE=mock
GCP_BUCKET_NAME=cmpc-libros-bucket
GCP_PROJECT_ID=cmpc-libros-project
```

### Comportamiento en Modo MOCK

✅ **Lo que hace:**
- Genera URLs aleatorias simulando GCP Storage
- No guarda archivos físicamente
- Valida tipo y tamaño de archivos
- Registra la URL en la base de datos
- Simula eliminación de archivos

❌ **Lo que NO hace:**
- No sube archivos reales a GCP
- No requiere credenciales de GCP
- No consume recursos de cloud

## 📋 Ejemplo de URL Generada

Cuando subes una imagen, el sistema retorna una URL como:

```
https://storage.googleapis.com/cmpc-libros-bucket/books/1730916000000-a1b2c3d4e5f6g7h8.jpg
```

**Estructura:**
- `https://storage.googleapis.com/` - Dominio de GCP Storage
- `cmpc-libros-bucket` - Nombre del bucket (configurable)
- `books/` - Carpeta dentro del bucket
- `1730916000000` - Timestamp en milisegundos
- `a1b2c3d4e5f6g7h8` - ID aleatorio (16 caracteres)
- `.jpg` - Extensión del archivo original

## 🚀 Uso

### 1. Subir Imagen

**Request:**
```bash
POST /api/books/{book_id}/image
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: [archivo de imagen]
```

**Response (Modo MOCK):**
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Mi Libro",
    "imageUrl": "https://storage.googleapis.com/cmpc-libros-bucket/books/1730916123456-f1a2b3c4d5e6f7g8.png",
    "createdAt": "2025-11-06T15:00:00.000Z",
    "updatedAt": "2025-11-06T15:30:00.000Z"
  }
}
```

**Logs del Backend:**
```
[BooksService] Image uploaded for book 123e4567-e89b-12d3-a456-426614174000: https://storage.googleapis.com/cmpc-libros-bucket/books/1730916123456-f1a2b3c4d5e6f7g8.png
[StorageService] [MOCK] Simulated upload to GCP Storage
[StorageService] [MOCK] File: libro.png (245678 bytes)
[StorageService] [MOCK] Generated URL: https://storage.googleapis.com/cmpc-libros-bucket/books/1730916123456-f1a2b3c4d5e6f7g8.png
```

### 2. Actualizar Imagen

Si subes una nueva imagen a un libro que ya tiene una:

1. Se simula la eliminación de la imagen anterior
2. Se genera una nueva URL para la imagen nueva
3. Se actualiza el registro en la base de datos

**Logs:**
```
[StorageService] [MOCK] Simulated deletion from GCP Storage: https://storage.googleapis.com/.../old-image.jpg
[StorageService] [MOCK] Simulated upload to GCP Storage
[StorageService] [MOCK] Generated URL: https://storage.googleapis.com/.../new-image.jpg
```

## ⚙️ Cambiar a Modo Producción

### 1. Instalar dependencias de GCP

```bash
npm install @google-cloud/storage
```

### 2. Configurar credenciales

Crear un Service Account en GCP y descargar el archivo JSON de credenciales.

### 3. Actualizar .env

```env
STORAGE_MODE=production
GCP_BUCKET_NAME=your-real-bucket-name
GCP_PROJECT_ID=your-real-project-id
GCP_KEYFILE_PATH=/path/to/your-service-account-key.json
```

### 4. El código ya está preparado

El método `realGcpUpload()` en `storage.service.ts` contiene el código comentado para producción. Solo necesitas descomentarlo:

```typescript
private async realGcpUpload(file: Express.Multer.File): Promise<string> {
  const { Storage } = require('@google-cloud/storage');
  const storage = new Storage({
    projectId: this.gcpProjectId,
    keyFilename: process.env.GCP_KEYFILE_PATH,
  });
  
  const bucket = storage.bucket(this.gcpBucketName);
  const randomId = this.generateRandomId(16);
  const timestamp = Date.now();
  const extension = this.getFileExtension(file.originalname);
  const filename = `books/${timestamp}-${randomId}${extension}`;
  const blob = bucket.file(filename);

  await blob.save(file.buffer, {
    contentType: file.mimetype,
    public: true,
  });

  return blob.publicUrl();
}
```

## 📊 Arquitectura

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ POST /api/books/:id/image
       │ (multipart/form-data)
       ▼
┌──────────────────┐
│ BooksController  │ Valida tipo y tamaño (max 5MB)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  BooksService    │ Coordina la subida
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ StorageService   │
└──────┬───────────┘
       │
       ├─ MOCK MODE ──────► Genera URL aleatoria
       │                    (No sube archivo real)
       │
       └─ PROD MODE ──────► Sube a GCP Storage
                            (Requiere credenciales)
```

## 🔒 Validaciones

### Tipo de Archivo
Solo se permiten:
- `.jpg`
- `.jpeg`
- `.png`
- `.gif`

### Tamaño
- Máximo: **5 MB**

## 🧪 Testing

### Test con cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | jq -r '.data.access_token')

# 2. Crear libro
BOOK_ID=$(curl -s -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Book",
    "author":"Test Author",
    "editorial":"Test Editorial",
    "genre":"Test",
    "price":10000,
    "availability":true
  }' | jq -r '.data.id')

# 3. Subir imagen
curl -X POST "http://localhost:3000/api/books/$BOOK_ID/image" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@./test-image.jpg" | jq '.'
```

### Test con Postman

1. **Login**: `POST /api/auth/login`
2. **Create Book**: `POST /api/books`
3. **Upload Image**: `POST /api/books/{id}/image`
   - Body: `form-data`
   - Key: `file`
   - Value: Select file

## 📝 Notas Importantes

### URLs Simuladas vs Reales

⚠️ **Las URLs generadas en modo MOCK no son accesibles**

Las URLs como `https://storage.googleapis.com/cmpc-libros-bucket/books/...` son simuladas y no apuntan a archivos reales. Son solo para desarrollo y testing.

### Base de Datos

Las URLs se guardan en la columna `imageUrl` de la tabla `books`:

```sql
SELECT id, title, "imageUrl" FROM books;

┌──────────────────────────────────────┬───────────┬───────────────────────────────────────────────────────────────────────┐
│ id                                   │ title     │ imageUrl                                                              │
├──────────────────────────────────────┼───────────┼───────────────────────────────────────────────────────────────────────┤
│ 123e4567-e89b-12d3-a456-426614174000 │ Mi Libro  │ https://storage.googleapis.com/cmpc-libros-bucket/books/1730916...jpg │
└──────────────────────────────────────┴───────────┴───────────────────────────────────────────────────────────────────────┘
```

### Migración a Producción

Cuando necesites pasar a producción:

1. ✅ Crear bucket en GCP
2. ✅ Configurar Service Account
3. ✅ Descargar credenciales JSON
4. ✅ Actualizar `.env`
5. ✅ Cambiar `STORAGE_MODE=production`
6. ✅ Reiniciar el servidor

**No requiere cambios en el código**, solo configuración.

## 🐛 Troubleshooting

### Error: "Only image files are allowed!"
- Verifica que el archivo sea JPG, JPEG, PNG o GIF

### Error: "File too large"
- El archivo excede 5 MB, reduce su tamaño

### URLs no se ven en el frontend
- Las URLs están en la base de datos
- En modo MOCK son solo simuladas
- Considera usar placeholders o imágenes default

## 🎨 Frontend

En el frontend, las URLs se pueden usar para mostrar placeholders:

```typescript
// BookDetail.tsx
{book.imageUrl ? (
  <img 
    src={book.imageUrl} 
    alt={book.title}
    onError={(e) => {
      // En modo MOCK, usar imagen por defecto
      e.currentTarget.src = '/placeholder-book.png';
    }}
  />
) : (
  <div className="placeholder">Sin imagen</div>
)}
```

---

**Modo actual**: MOCK  
**Fecha**: 6 de noviembre de 2025  
**Proyecto**: CMPC-Libros Backend
