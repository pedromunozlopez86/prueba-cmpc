# CMPC Libros - Project Root

## Project Structure

```
cmpc/
├── backend/          # NestJS Backend API
├── frontend/         # React Frontend Application
├── docker-compose.yml
└── README.md
```

## Quick Start

### With Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Run migrations
docker exec -it cmpc-backend npm run migration:run

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000/api
# Swagger Docs: http://localhost:3000/api/docs
```

### Without Docker

See detailed instructions in the main [README.md](./README.md)

## Architecture

- **Backend**: NestJS + TypeScript + PostgreSQL + Sequelize
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Database**: PostgreSQL 15

## Features

- ✅ JWT Authentication
- ✅ CRUD Operations for Books
- ✅ Advanced Filtering and Search
- ✅ Server-side Pagination
- ✅ Image Upload
- ✅ CSV Export
- ✅ Comprehensive Testing (80%+ coverage)
- ✅ API Documentation (Swagger)
- ✅ Dockerized Deployment

## Documentation

- [Complete Documentation](./README.md)
- [API Documentation](http://localhost:3000/api/docs) (when running)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

---

Developed for CMPC Technical Test
