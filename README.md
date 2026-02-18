# NGSOCIAL

Proyecto de red social (MEAN) con autenticación, perfil de usuario, edición de datos y experiencia visual moderna. Este repo contiene el **frontend Angular**. El **backend Node/Express** corre en un proyecto separado y expone la API REST.

## Stack

**Frontend**
- Angular 21 (standalone components)
- SSR habilitado
- Bootstrap 5 + estilos propios
- Animaciones y transiciones CSS
- Uso de variables CSS y color accent
- UI/UX moderno y responsive

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Bcrypt para hashing de password
- Subida de avatar con endpoint dedicado

## Funcionalidades implementadas

**Frontend**
- Registro y login con validaciones
- Token e identidad en localStorage (con guardas SSR)
- Navbar con estado según autenticación
- Dropdown de usuario
- Home con hero estilizado
- Perfil: actualización de datos + subida de imagen
- Sidebar avanzado con stats (siguiendo, seguidores, publicaciones)
- Refresh instantáneo de publicaciones tras enviar
- Botones y bordes animados con color accent
- Barra inferior de títulos h1 personalizada y centrada
- Gradientes suaves en tarjetas y sidebar
- Responsive y accesible

**Backend**
- Registro y login
- Generación de token JWT
- Actualización de usuario
- Subida de imagen de perfil

## Requisitos

- Node.js 18+ (recomendado)
- MongoDB en local o remoto

## Configuración Backend (resumen)

- API base: `http://localhost:3800/api/`
- Endpoint login: `POST /login`
- Endpoint registro: `POST /register`
- Endpoint update user: `PUT /update-user/:id`
- Endpoint upload avatar: `POST /upload-image-user/:id`

> Nota: revisa el proyecto backend para variables de entorno y cadena de conexión a MongoDB.

## Frontend - Instalación

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
- El sidebar muestra stats y permite publicar con feedback visual inmediato.
- Todos los botones principales y acciones usan animaciones y color accent para feedback visual.
- El diseño es consistente, moderno y pensado para usabilidad y contraste visual.
