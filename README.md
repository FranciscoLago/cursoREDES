# NGSOCIAL

Proyecto de red social (MEAN) con autenticacion, perfil de usuario y edicion de datos. Este repo contiene el **frontend Angular**. El **backend Node/Express** corre en un proyecto separado y expone la API REST.

## Stack

**Frontend**
- Angular 21 (standalone components)
- SSR habilitado
- Bootstrap 5 + estilos propios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticacion
- Bcrypt para hashing de password
- Subida de avatar con endpoint dedicado

## Funcionalidades implementadas

**Frontend**
- Registro y login con validaciones
- Token e identidad en localStorage (con guardas SSR)
- Navbar con estado segun autenticacion
- Dropdown de usuario
- Home con hero estilizado
- Perfil: actualizacion de datos + subida de imagen

**Backend**
- Registro y login
- Generacion de token JWT
- Actualizacion de usuario
- Subida de imagen de perfil

## Requisitos

- Node.js 18+ (recomendado)
- MongoDB en local o remoto

## Configuracion Backend (resumen)

- API base: `http://localhost:3800/api/`
- Endpoint login: `POST /login`
- Endpoint registro: `POST /register`
- Endpoint update user: `PUT /update-user/:id`
- Endpoint upload avatar: `POST /upload-image-user/:id`

> Nota: revisa el proyecto backend para variables de entorno y cadena de conexion a MongoDB.

## Frontend - Instalacion

```bash
npm install
```

## Frontend - Desarrollo

```bash
npm start
```

La app corre en `http://localhost:4200/`.

## Frontend - Build

```bash
npm run build
```

## Variables / Config

- El frontend consume la API en `http://localhost:3800/api/` (ver [src/app/services/global.ts](src/app/services/global.ts)).

## Rutas principales

- `/login`
- `/register`
- `/home`
- `/mis-datos`

## Notas

- El dropdown de usuario se maneja por estado (no JS de Bootstrap).
- El formulario de perfil usa `NgForm` y fuerza update de UI con `ChangeDetectorRef`.
- El avatar se sube con `UploadService` y `FormData`.
