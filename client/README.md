# 🚀 SocialApp - Cliente Angular

Bienvenido al cliente de SocialApp, una red social moderna construida con Angular.

---

## 🆕 Novedades y mejoras recientes

- 🔒 **Protección de rutas con UserGuard:** Ahora las rutas sensibles están protegidas mediante un guard personalizado, asegurando que solo usuarios autenticados y con rol adecuado puedan acceder a secciones privadas.
- 🛡️ **Gestión avanzada de roles:** Acceso diferenciado para usuarios y administradores.
- 🧑‍💼 **Gestión de sesión robusta:** El guard verifica la identidad y el rol antes de permitir el acceso.
- 🧭 **Redirección automática:** Si no tienes permisos, serás redirigido a la pantalla de login.
- 🧩 **Arquitectura modular:** Separación clara de componentes, servicios y rutas para facilitar el mantenimiento y la escalabilidad.
- 🎨 **Estilo mejorado:** Interfaz moderna, responsive, con animaciones suaves y feedback visual en todas las acciones.
- 📦 **Código organizado:** Uso de modelos, pipes personalizados y servicios reutilizables.
- 📨 **Sistema de mensajería:** Incluye rutas y componentes para enviar, recibir y gestionar mensajes entre usuarios.
- 🧑‍🤝‍🧑 **Sistema de seguidores/seguidos:** Visualiza y gestiona tus relaciones sociales fácilmente.
- 🖼️ **Carga y previsualización de imágenes:** Sube imágenes en publicaciones y perfiles, con vista previa instantánea.
- 🕒 **Pipe personalizado "time-ago":** Muestra fechas relativas de forma amigable (ej: "hace 2 minutos").

---

## ✨ Características principales

- 📝 Publica textos y fotos
- 🖼️ Vista previa de imágenes y modal elegante
- 🗑️ Elimina tus publicaciones con confirmación animada
- 👤 Perfil de usuario con estadísticas
- 🔒 Autenticación y gestión de usuarios
- 📱 Responsive y diseño atractivo

---

## 🔒 Seguridad y control de acceso

- **UserGuard:** Implementado para proteger rutas privadas como "mis-datos" y otras secciones sensibles.
- **Verificación de rol:** Solo usuarios con roles válidos pueden acceder a ciertas funcionalidades.
- **Redirección segura:** Si no tienes permisos, la app te lleva automáticamente al login.

---

## ⚡ Instalación rápida

```bash
npm install
npm start
```

---


## 🖥️ Estructura del proyecto

```
CursoREDES/
├── api/                # Backend Node.js/Express
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   ├── controllers/    # Lógica de negocio (user, publication, follow, message)
│   ├── models/         # Modelos de datos (user, publication, follow, message)
│   ├── routes/         # Rutas de la API REST
│   ├── middlewares/    # Middlewares (autenticación, etc)
│   ├── services/       # Servicios auxiliares (JWT, etc)
│   └── uploads/        # Imágenes de usuarios y publicaciones
│       ├── users/
│       └── publications/
│
├── client/             # Cliente Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── home/
│   │   │   │   ├── login/
│   │   │   │   ├── profile/
│   │   │   │   ├── publications/
│   │   │   │   ├── register/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── timeline/
│   │   │   │   ├── user-edit/
│   │   │   │   └── users/
│   │   │   ├── models/
│   │   │   ├── pipes/
│   │   │   └── services/
│   │   ├── assets/
│   │   ├── index.html
│   │   └── ...
│   ├── angular.json
│   ├── package.json
│   └── ...
└── README.md
```

---

## 🖌️ Estilo y experiencia

- Paleta cálida y moderna
- Animaciones suaves en modales y alertas
- Botones redondeados y feedback visual
- Mensajes de éxito/error con iconos y colores

- Diseño responsive para móviles y escritorio
- Interfaz coherente y profesional en todos los módulos

---

## 📸 Capturas


![Pantalla de inicio](client/src/assets/Inicio.png)
![Usuarios](client/src/assets/Gente.png)
![Timeline](client/src/assets/TimeLine.png)
![Perfil de usuario](client/src/assets/Useprofile.png)

---

## 🪄 Experiencia de usuario avanzada

- **Pantalla de inicio:** Actualmente en construcción, será el punto de entrada principal a la red social.
- **Usuarios:** Visualiza todos los usuarios dados de alta y accede a sus perfiles haciendo clic sobre ellos.
- **Timeline:** Explora las publicaciones de todos los usuarios, amplía imágenes con un solo clic, borra tus propias publicaciones mediante un modal animado y navega fácilmente por los posts.
- **Perfil de usuario:** Consulta exclusivamente las publicaciones y estadísticas de cada usuario, como número de seguidores, seguidos y publicaciones.

- **Protección de rutas:** Acceso restringido a secciones privadas mediante UserGuard.
- **Gestión de mensajes:** Envía, recibe y visualiza mensajes entre usuarios desde una interfaz intuitiva.
- **Gestión de seguidores/seguidos:** Consulta y administra tus relaciones sociales desde los perfiles.
- **Pipe time-ago:** Fechas relativas para una experiencia más humana.

- **Animaciones profesionales:** Transiciones suaves en modales, alertas y botones para una experiencia moderna y fluida.
- **Modal de borrado personalizado:** Al eliminar una publicación, aparece un modal elegante con animación y confirmación.
- **Autoscroll inteligente:** Al cargar más publicaciones, la vista se desplaza automáticamente para mostrar el nuevo contenido.
- **Feedback visual:** Mensajes de éxito y error con iconos y colores, que desaparecen automáticamente.
- **Botones y formularios:** Estilizados y con feedback visual al interactuar.

Todo el diseño y las interacciones están pensados para ser intuitivos y agradables, siguiendo una línea visual coherente en toda la app.
---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Abre un issue o pull request para sugerir mejoras.

---

## 📝 Licencia

MIT

---
