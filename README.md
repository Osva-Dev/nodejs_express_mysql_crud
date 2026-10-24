# Users CRUD API

API REST para la gestión de usuarios, construida con **Node.js**, **Express** y **MySQL**. Permite crear, consultar, actualizar y eliminar usuarios, con persistencia real en base de datos, validación de datos y manejo centralizado de errores.

> ✅ **Estado del proyecto:** el CRUD completo funciona sobre MySQL, con middlewares de validación y de errores. Las siguientes etapas (registro, login con JWT y una interfaz web) están descritas en [Próximas actualizaciones](#próximas-actualizaciones).

---

## Características

- CRUD completo de usuarios con persistencia en **MySQL**
- Arquitectura modular, organizada por funcionalidad
- Separación de responsabilidades: rutas, middlewares, controladores y repositorio
- Consultas SQL **parametrizadas** (protección contra inyección SQL)
- Pool de conexiones con `mysql2`
- Configuración mediante variables de entorno (`.env`)
- **Middlewares de validación:** campos obligatorios, formato del email e `id` numérico
- **Manejo centralizado de errores:** `409` por email duplicado, `404` en JSON y `500` sin exponer detalles internos
- Uso de **ES Modules** (`import` / `export`)
- Recarga automática en desarrollo con **nodemon**

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Node.js](https://nodejs.org/) v20.6 o superior | Entorno de ejecución |
| [Express 5](https://expressjs.com/) | Framework web |
| [MySQL 8](https://www.mysql.com/) | Base de datos |
| [mysql2](https://github.com/sidorares/node-mysql2) | Driver de MySQL (con promesas) |
| [nodemon](https://nodemon.io/) | Recarga automática en desarrollo |

---

## Instalación

### Requisitos previos

- [Node.js](https://nodejs.org/) v20.6 o superior (necesario para la opción `--env-file`)
- npm (se instala junto con Node.js)
- [MySQL Server](https://dev.mysql.com/downloads/) 8 y un cliente como MySQL Workbench
- Git

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/Osva-Dev/nodejs_express_mysql_crud.git
cd nodejs_express_mysql_crud
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Crear la base de datos y la tabla**

Ejecuta este script en MySQL Workbench (o en tu cliente de preferencia):

```sql
CREATE DATABASE crud_db;
USE crud_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE
);
```

**4. Configurar las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto (junto a `package.json`) con tus datos:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=crud_db
```

> El archivo `.env` está en el `.gitignore` y **nunca debe subirse al repositorio**.

**5. Iniciar el servidor en modo desarrollo**

```bash
npm run dev
```

Deberías ver en la terminal:

```
Servidor corriendo en http://localhost:3000
```

**6. Verificar que funciona**

Abre [http://localhost:3000](http://localhost:3000). Debe responder:

```json
{ "message": "API funcionando" }
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor con nodemon y carga el archivo `.env` |
| `npm start` | Inicia el servidor en modo normal (requiere que las variables de entorno ya estén definidas) |

---

## Arquitectura

El proyecto usa una **estructura por módulos** (*feature-based*): todo lo relacionado con una funcionalidad vive junto. Para agregar un módulo nuevo (por ejemplo, `products`) basta con crear su propia carpeta dentro de `modules/`.

```
nodejs_express_mysql_crud/
├── src/
│   ├── config/
│   │   └── database.js                        # Pool de conexiones a MySQL
│   ├── middlewares/
│   │   ├── error-handler.middleware.js        # Traduce errores a respuestas JSON (409, 500)
│   │   ├── not-found.middleware.js            # Responde 404 en JSON a rutas inexistentes
│   │   ├── validate-id.middleware.js          # Valida que :id sea un entero positivo
│   │   └── validate-user.middleware.js        # Valida name, email y su formato
│   ├── modules/
│   │   └── users/
│   │       ├── users.routes.js                # Define las URLs, métodos HTTP y middlewares
│   │       ├── users.controller.js            # Recibe la petición y responde
│   │       └── users.repository.js            # Consultas SQL (acceso a datos)
│   ├── app.js                                 # Configura Express y registra rutas y middlewares
│   └── server.js                              # Enciende el servidor
├── .gitignore
├── package.json
└── README.md
```

### Flujo de una petición

```
Cliente → routes → middlewares de validación → controller → repository → MySQL
                          │                         │
                          └── 400 si es inválido    └── error → errorHandler (409 / 500)
```

| Capa | Responsabilidad |
|---|---|
| **routes** | Asocia cada URL y método HTTP con sus middlewares y su controlador |
| **middlewares** | Validan la petición antes del controlador y centralizan el manejo de errores |
| **controller** | Recibe la petición (`req`) y decide qué responder (`res`) |
| **repository** | Es el único lugar con SQL: ejecuta las consultas e informa el resultado |

**Decisiones de diseño:**

- Las validaciones de la **petición** (campos, formato, id) viven en middlewares y se escriben una sola vez.
- La unicidad del email la garantiza la restricción `UNIQUE` de MySQL; `errorHandler` traduce ese error a un `409`. Así se evita la condición de carrera de consultar antes de insertar.
- Express 5 envía automáticamente al `errorHandler` los errores de las funciones `async`, por lo que los controladores no necesitan `try/catch`.
- `app.js` y `server.js` están separados a propósito: `app.js` define **qué hace** la aplicación y `server.js` solo **la enciende**. Esto facilita las pruebas automáticas a futuro.

### Convenciones

- Archivos: `nombre.rol.js` en minúsculas (`users.controller.js`)
- Funciones y variables: `camelCase` (`getUserById`)
- Tablas y columnas: `snake_case` en minúsculas, y plural para tablas (`users`)
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`)
- Ramas: `main` (estable) y `develop` (integración), con ramas `feat/...` o `fix/...` por tarea
- Cada tarea se planifica con un **Issue** y se integra mediante **Pull Request**

---

## Endpoints

**URL base:** `http://localhost:3000/api/users`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/users` | Obtener todos los usuarios |
| `GET` | `/api/users/:id` | Obtener un usuario por su ID |
| `POST` | `/api/users` | Crear un usuario |
| `PUT` | `/api/users/:id` | Actualizar un usuario |
| `DELETE` | `/api/users/:id` | Eliminar un usuario |

### Obtener todos los usuarios

```http
GET /api/users
```

**Respuesta `200 OK`:**

```json
[
  { "id": 1, "name": "Osvaldo Ochoa", "email": "osva@gmail.com" },
  { "id": 2, "name": "Isai Castillo", "email": "isai@gmail.com" }
]
```

### Obtener un usuario por ID

```http
GET /api/users/1
```

**Respuesta `200 OK`:**

```json
{ "id": 1, "name": "Osvaldo Ochoa", "email": "osva@gmail.com" }
```

**Respuesta `400 Bad Request`** (si el ID no es un entero positivo, por ejemplo `/api/users/abc`):

```json
{ "message": "El id debe ser un número entero positivo" }
```

**Respuesta `404 Not Found`** (si el ID no existe):

```json
{ "message": "Usuario no encontrado" }
```

### Crear un usuario

```http
POST /api/users
Content-Type: application/json
```

**Body:**

```json
{
  "name": "María Pérez",
  "email": "maria@mail.com"
}
```

**Respuesta `201 Created`** (el `id` lo asigna MySQL con `AUTO_INCREMENT`):

```json
{ "id": 3, "name": "María Pérez", "email": "maria@mail.com" }
```

**Respuesta `400 Bad Request`** (si falta `name` o `email`):

```json
{ "message": "name y email son obligatorios" }
```

**Respuesta `400 Bad Request`** (si el email no tiene un formato válido):

```json
{ "message": "El formato del email no es válido" }
```

**Respuesta `409 Conflict`** (si el email ya está registrado):

```json
{ "message": "El email ya está registrado" }
```

### Actualizar un usuario

```http
PUT /api/users/1
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Osvaldo Ochoa Actualizado",
  "email": "osva@gmail.com"
}
```

**Respuesta `200 OK`:**

```json
{ "id": 1, "name": "Osvaldo Ochoa Actualizado", "email": "osva@gmail.com" }
```

**Respuestas de error:**

| Código | Cuándo | Mensaje |
|---|---|---|
| `400` | El ID no es un entero positivo | `El id debe ser un número entero positivo` |
| `400` | Falta `name` o `email` | `name y email son obligatorios` |
| `400` | El email no tiene formato válido | `El formato del email no es válido` |
| `404` | El ID no existe | `Usuario no encontrado` |
| `409` | El email pertenece a otro usuario | `El email ya está registrado` |

### Eliminar un usuario

```http
DELETE /api/users/3
```

**Respuesta `200 OK`:**

```json
{ "message": "Usuario eliminado" }
```

**Respuesta `400 Bad Request`** (si el ID no es un entero positivo):

```json
{ "message": "El id debe ser un número entero positivo" }
```

**Respuesta `404 Not Found`** (si el ID no existe):

```json
{ "message": "Usuario no encontrado" }
```

### Rutas inexistentes y errores inesperados

Cualquier ruta que no exista responde en JSON:

```json
{ "message": "Ruta no encontrada" }
```

Los errores inesperados responden `500` con un mensaje genérico. El detalle real solo se registra en la consola del servidor y nunca se envía al cliente:

```json
{ "message": "Error interno del servidor" }
```

### Códigos de estado utilizados

| Código | Significado |
|---|---|
| `200` | OK: la petición fue exitosa |
| `201` | Created: el recurso se creó correctamente |
| `400` | Bad Request: datos obligatorios ausentes o con formato inválido |
| `404` | Not Found: el recurso o la ruta no existe |
| `409` | Conflict: el email ya está registrado |
| `500` | Internal Server Error: error inesperado del servidor |

---

## Cómo probar la API

Puedes usar cualquiera de estas herramientas:

- **Thunder Client** (extensión de VS Code)
- **Postman**
- **curl** desde la terminal

Ejemplo con `curl`:

```bash
# Listar usuarios
curl http://localhost:3000/api/users

# Obtener un usuario por ID
curl http://localhost:3000/api/users/1

# Crear un usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"María Pérez","email":"maria@mail.com"}'

# Actualizar un usuario
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Osvaldo Actualizado","email":"osva@gmail.com"}'

# Eliminar un usuario
curl -X DELETE http://localhost:3000/api/users/3

# Probar una validación (devuelve 400)
curl http://localhost:3000/api/users/abc
```

---

## Limitaciones actuales

- Los endpoints no requieren autenticación: cualquiera puede crear, modificar o eliminar usuarios.
- Los usuarios no tienen contraseña, por lo que todavía no existe registro ni inicio de sesión.
- No hay pruebas automáticas.

---

## Próximas actualizaciones

El objetivo es convertir el CRUD en una aplicación completa y demostrable: con registro, inicio de sesión, rutas protegidas y una interfaz web. Se trabaja por fases, cada una con su issue, su rama y su Pull Request.

| Fase | Qué se construye | Qué resuelve | Estado |
|---|---|---|---|
| **0. Manejo de errores** | Middleware de errores y `404` en JSON; `409` por email duplicado | Respuestas claras en lugar de errores `500` en HTML | ✅ Completada |
| **1. Validaciones** | Formato del email, `:id` numérico, validación en middleware | Rechazar datos inválidos antes de llegar al controlador | ✅ Completada |
| **2. Base de datos** | Columnas `password_hash` y `created_at` en `users` | Preparar la tabla para guardar credenciales | ⏳ Pendiente |
| **3. Registro** | `POST /api/auth/register` con contraseñas cifradas con **bcrypt** | Crear cuentas sin guardar contraseñas en texto plano | ⏳ Pendiente |
| **4. Login** | `POST /api/auth/login` que devuelve un token **JWT** | Identificar al usuario en cada petición | ⏳ Pendiente |
| **5. Rutas protegidas** | Middleware de autenticación | Que solo usuarios con sesión accedan al CRUD | ⏳ Pendiente |
| **6. Frontend** | Interfaz web con pantallas de registro, login y lista de usuarios | Mostrar el proyecto funcionando de punta a punta | ⏳ Pendiente |
| **7. Presentación** | README final y video de demostración | Documentar y explicar el proyecto | ⏳ Pendiente |

### Estructura prevista

```
nodejs_express_mysql_crud/
├── frontend/                          # Interfaz web (HTML, CSS y JavaScript)
├── src/
│   ├── config/
│   ├── middlewares/
│   │   ├── error-handler.middleware.js
│   │   ├── not-found.middleware.js
│   │   ├── validate-id.middleware.js
│   │   ├── validate-user.middleware.js
│   │   └── auth.middleware.js         # Nuevo: verifica el token JWT
│   └── modules/
│       ├── auth/                      # Nuevo: registro y login
│       │   ├── auth.routes.js
│       │   ├── auth.controller.js
│       │   └── auth.service.js
│       └── users/
└── ...
```

### Endpoints previstos

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/api/auth/register` | Crear una cuenta | Público |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener un token | Público |
| `GET` | `/api/users` | Listar usuarios | Requiere token |
| `GET` | `/api/users/:id` | Obtener un usuario | Requiere token |
| `PUT` | `/api/users/:id` | Actualizar un usuario | Requiere token |
| `DELETE` | `/api/users/:id` | Eliminar un usuario | Requiere token |

> Las fases pendientes describen trabajo **planificado**, no implementado.

---

## Roadmap

### Completado

- [x] Servidor con Express y ES Modules
- [x] Estructura modular
- [x] Variables de entorno con `.env`
- [x] Conexión a MySQL con pool de conexiones
- [x] Capa `repository`
- [x] CRUD completo de usuarios con MySQL
- [x] Middleware de errores y manejo de email duplicado (`409`)
- [x] Middleware `not-found` con respuesta en JSON
- [x] Validación de campos obligatorios y del formato del email
- [x] Validación del `:id` numérico
- [x] Flujo de trabajo con issues, ramas y Pull Requests

### Pendiente

- [ ] Registro de usuarios con contraseña cifrada (bcrypt)
- [ ] Login con token JWT
- [ ] Middleware de autenticación para proteger rutas
- [ ] Capa `service`
- [ ] Archivo `.env.example`
- [ ] Interfaz web (frontend)
- [ ] Pruebas automáticas
- [ ] Video de demostración

---

## Autor

**Osvaldo Ochoa**