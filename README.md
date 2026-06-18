# Prueba Técnica - Gestión de Series y Directores

Aplicación web desarrollada como solución al punto #5 de la prueba técnica profesional OATI - UD.

El sistema permite registrar, consultar, modificar y eliminar información de series de televisión y directores, considerando una relación muchos a muchos: una serie puede tener varios directores y un director puede participar en muchas series.

## Enlaces de despliegue

- Frontend: https://prueba-tecnica-series.vercel.app/
- Backend API: https://prueba-tecnica-series.onrender.com/api/v1
- Swagger: https://prueba-tecnica-series.onrender.com/api/docs
- Health Check: https://prueba-tecnica-series.onrender.com/api/v1/health

> Nota: el backend está desplegado en Render Free, por lo que puede tardar algunos segundos en responder si el servicio ha estado inactivo.

## Objetivo funcional

El sistema permite gestionar la información básica de series de televisión, incluyendo:

- Nombre
- Fecha de lanzamiento
- Sinopsis
- País
- Número de temporadas
- Calificación
- Estado de la serie
- Directores asociados

También permite gestionar directores, incluyendo:

- Nombre completo
- Nacionalidad
- Fecha de nacimiento
- Biografía

La solución contempla que:

- Una serie puede tener varios directores.
- Un director puede estar asociado a varias series.
- Se pueden listar series con sus respectivos directores.
- Se pueden listar todas las series en las que ha participado un director.
- Se puede modificar y eliminar la información de series y directores.

## Stack tecnológico

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger / OpenAPI
- Docker

### Frontend

- React
- Vite
- TypeScript
- CSS
- Fetch API

### Base de datos

- PostgreSQL
- Base de datos local mediante Docker Compose
- Base de datos productiva en Render PostgreSQL

### Despliegue

- Backend: Render
- Base de datos: Render PostgreSQL
- Frontend: Vercel

## Arquitectura general

La solución está estructurada separando responsabilidades entre frontend, backend y base de datos.

```mermaid
flowchart LR
    A[Usuario] --> B[Frontend React + Vite]
    B --> C[API REST NestJS]
    C --> D[Prisma ORM]
    D --> E[(PostgreSQL)]
```

## Modelo de datos

La relación entre series y directores es de muchos a muchos.

```mermaid
erDiagram
    SERIES {
        string id PK
        string name
        datetime releaseDate
        string synopsis
        string country
        int seasons
        float rating
        string status
        datetime createdAt
        datetime updatedAt
    }

    DIRECTORS {
        string id PK
        string fullName
        string nationality
        datetime birthDate
        string biography
        datetime createdAt
        datetime updatedAt
    }

    SERIES_DIRECTORS {
        string id PK
        string serieId FK
        string directorId FK
        string role
    }

    SERIES ||--o{ SERIES_DIRECTORS : has
    DIRECTORS ||--o{ SERIES_DIRECTORS : participates
```

## Decisiones de diseño

### Relación muchos a muchos

Se implementó una tabla intermedia para representar la participación de directores en series. Esto permite que una serie tenga múltiples directores y que un director pueda participar en múltiples series.

Además, la tabla intermedia permite almacenar información adicional de la relación, como el rol del director dentro de la serie.

### Eliminación de directores

Cuando se elimina un director, se eliminan sus asociaciones con las series, pero no se eliminan las series asociadas.

Esta decisión se tomó porque las series y los directores son entidades independientes dentro de una relación muchos a muchos. Eliminar un director no debería provocar la eliminación automática de una serie completa, ya que esto podría generar pérdida accidental de información.

Por ejemplo, si una serie tiene varios directores y uno de ellos es eliminado, la serie debe permanecer registrada en el sistema.

Comportamiento definido:

```text
Eliminar director -> eliminar director y sus relaciones con series.
Eliminar serie -> eliminar serie y sus relaciones con directores.
```

## Estructura del proyecto

```text
.
├── backend
│   ├── prisma
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src
│   │   ├── common
│   │   ├── modules
│   │   │   ├── directors
│   │   │   └── series
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── types
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Ejecución local

### Requisitos previos

- Node.js 20 o superior
- Docker
- Docker Compose
- npm

## 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd Prueba-Tecnica-Series
```

## 2. Levantar PostgreSQL local

Desde la raíz del proyecto:

```bash
docker compose up -d postgres
```

## 3. Configurar backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run start:dev
```

El backend quedará disponible en:

```text
http://localhost:3000/api/v1
```

Swagger estará disponible en:

```text
http://localhost:3000/api/docs
```

## 4. Configurar frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

El frontend quedará disponible en:

```text
http://localhost:5173
```

## Variables de entorno

### Backend

Archivo: `backend/.env`

```env
DATABASE_URL="postgresql://oati:oati_password@localhost:5432/oati_series?schema=public"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

### Frontend

Archivo: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Para producción en Vercel:

```env
VITE_API_URL=https://prueba-tecnica-series.onrender.com/api/v1
```

## Endpoints principales

### Health Check

```http
GET /api/v1/health
```

### Series

```http
GET /api/v1/series
```

Lista todas las series con sus directores asociados.

```http
GET /api/v1/series/:id
```

Consulta una serie por ID.

```http
POST /api/v1/series
```

Crea una nueva serie.

Ejemplo de body:

```json
{
  "name": "Nueva Serie",
  "releaseDate": "2026-06-18",
  "synopsis": "Serie creada para validar la prueba técnica.",
  "country": "Colombia",
  "seasons": 1,
  "rating": 8.5,
  "status": "IN_PRODUCTION",
  "directorIds": ["ID_DEL_DIRECTOR"]
}
```

```http
PATCH /api/v1/series/:id
```

Actualiza la información de una serie.

```http
DELETE /api/v1/series/:id
```

Elimina una serie y sus asociaciones con directores.

### Directores

```http
GET /api/v1/directors
```

Lista todos los directores.

```http
GET /api/v1/directors/:id
```

Consulta un director por ID.

```http
GET /api/v1/directors/:id/series
```

Lista todas las series en las que ha participado un director.

```http
POST /api/v1/directors
```

Crea un nuevo director.

Ejemplo de body:

```json
{
  "fullName": "Christopher Nolan",
  "nationality": "Británico",
  "birthDate": "1970-07-30",
  "biography": "Director, guionista y productor reconocido por sus obras de ciencia ficción y drama."
}
```

```http
PATCH /api/v1/directors/:id
```

Actualiza la información de un director.

```http
DELETE /api/v1/directors/:id
```

Elimina un director y sus asociaciones con series. Las series asociadas permanecen registradas.

## Documentación Swagger

La API cuenta con documentación Swagger disponible en:

```text
https://prueba-tecnica-series.onrender.com/api/docs
```

En ambiente local:

```text
http://localhost:3000/api/docs
```

Desde Swagger se pueden probar directamente los endpoints de series y directores.

## Scripts principales

### Backend

```bash
npm run start:dev
```

Ejecuta el backend en modo desarrollo.

```bash
npm run build
```

Compila el backend.

```bash
npm run db:generate
```

Genera el cliente de Prisma.

```bash
npm run db:push
```

Sincroniza el esquema de Prisma con la base de datos.

```bash
npm run db:seed
```

Carga datos iniciales de prueba.

### Frontend

```bash
npm run dev
```

Ejecuta el frontend en modo desarrollo.

```bash
npm run build
```

Compila el frontend para producción.

## Datos de prueba

El proyecto incluye un seed con datos de ejemplo para validar la funcionalidad del sistema.

Ejemplos de series:

- Breaking Bad
- Mindhunter

Ejemplos de directores:

- Vince Gilligan
- Michelle MacLaren
- David Fincher

## Validaciones y manejo de errores

La API implementa validaciones básicas para los datos de entrada y manejo de excepciones para casos como:

- Recurso no encontrado
- Datos inválidos
- Relaciones inexistentes
- Errores de persistencia

## Buenas prácticas aplicadas

- Separación de responsabilidades por módulos
- Arquitectura backend modular
- Uso de DTOs para entrada de datos
- Uso de Prisma como capa de acceso a datos
- Documentación con Swagger
- Variables de entorno
- Persistencia en PostgreSQL
- Relación muchos a muchos mediante tabla intermedia
- Despliegue separado de frontend, backend y base de datos
- Uso de Docker para backend y base de datos local
- Configuración CORS para consumo desde frontend desplegado

## Evidencia sugerida

Para la entrega se recomienda incluir capturas de:

```text
docs/evidencia/frontend-listado-series.png
docs/evidencia/frontend-listado-directores.png
docs/evidencia/swagger-endpoints.png
docs/evidencia/crear-serie.png
docs/evidencia/series-por-director.png
docs/evidencia/render-backend.png
docs/evidencia/vercel-frontend.png
```

## Estado del proyecto

El proyecto se encuentra desplegado y funcional.

Funcionalidades implementadas:

- CRUD de series
- CRUD de directores
- Asociación de series con directores
- Listado de series con directores
- Listado de series por director
- Persistencia en PostgreSQL
- API REST documentada con Swagger
- Frontend web funcional
- Despliegue en Render y Vercel