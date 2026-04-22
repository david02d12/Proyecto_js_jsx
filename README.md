# CELUACCEL — Sistema de Gestión de Reparaciones Móviles

## Descripción
Plataforma web para la gestión de solicitudes de mantenimiento de dispositivos móviles. Desarrollada con **React** (frontend), **Node.js/Express** (backend) y **MySQL** (base de datos).

---

## Requisitos previos
- Node.js v18+
- MySQL 8.0+
- Git

---

## Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto_js_jsx-nicolas
```

### 2. Configurar el Backend
```bash
cd backend
npm install

# Copiar el archivo de entorno y completar tus credenciales locales
copy .env.example .env   # En Windows
# cp .env.example .env   # En Linux/Mac

# Edita .env con tus datos de MySQL si aplica
npm start
```
> El backend quedará corriendo en `http://localhost:3000`

### 3. Configurar el Frontend
```bash
cd frontend
npm install
npm run dev
```
> La aplicación estará disponible en `http://localhost:5173`

---

## Documentación de la API (Swagger)
Una vez iniciado el backend, accede a:
```
http://localhost:3000/doc
```

---

## Roles del sistema
| Código | Rol | Acceso |
|--------|-----|--------|
| 1 | Técnico | Servicios, Chat, Productos, Categorías, Historial |
| 2 | Cliente | Mis Servicios, Chat, Catálogo, Perfil, Comentarios |
| 3 | Administrador | Todo lo anterior + Usuarios, Roles, Tipos de Documento |

---

## Estructura del proyecto
```
Proyecto_js_jsx-nicolas/
├── backend/
│   ├── controllers/      # Lógica de negocio por entidad
│   ├── routes/           # Rutas API centralizadas
│   ├── middlewares/      # JWT y control de roles
│   ├── config/           # Conexión a base de datos
│   ├── .env.example      # Plantilla de variables de entorno
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── usuario/  # Cliente: MiServicio, ChatVista, Catalogo, Perfil
        │   ├── tecnico/  # Técnico: Servicios, Chats, Historial, Productos…
        │   └── admin/    # Admin: Usuarios, Roles, Tipo
        └── App.jsx       # Enrutador principal por rol
```

---

## Equipo de desarrollo
- Juan Nicolás Montenegro Mariño
- Jhonatan Julian Comezaquira Ochoca
- Anderson David Joya Peña
