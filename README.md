# Users CRUD API

API REST con **autenticación JWT**, construida con **Node.js**, **Express** y **MySQL**. Permite registrar usuarios, iniciar sesión y administrar cuentas mediante un CRUD protegido, con contraseñas cifradas, validación de datos y manejo centralizado de errores.

> ✅ **Estado del proyecto:** el backend está completo y probado. Lo que falta (interfaz web, pruebas automáticas y video de demostración) está en el [Roadmap](#roadmap).

---

## Características

- **Registro e inicio de sesión** con contraseñas cifradas con **bcrypt**
- **Autenticación con JWT**: las rutas de usuarios solo responden con un token válido
- CRUD de usuarios con persistencia en **MySQL**
- Arquitectura modular, organizada por funcionalidad
- Separación de responsabilidades: rutas, middlewares, controladores, servicios y repositorio
- Consultas SQL **parametrizadas** (protección contra inyección SQL)
- Pool de conexiones con `mysql2`
- **Middlewares de validación:** campos obligatorios, formato del email, longitud de la contraseña e `id` numérico
- **Manejo centralizado de errores:** `409` por email duplicado, `404` en JSON y `500` sin exponer detalles internos
- Configuración mediante variables de entorno (`.env`)
- Uso de **ES Modules** (`import` / `export`)
- Recarga automática en desarrollo con **nodemon**

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Node.js](https://nodejs.org/) v20.6 o superior | Entorno de ejecución |
| [Express 5](https://expressjs.com/) | Framework web |
| [MySQL 8](https://www.mysql.com/) | Base de datos |
| [mysql2](https://github.com/sidorares/node-mysql2) | Driver de MySQL (con promesas) |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Cifrado de contraseñas |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | Creación y verificación de tokens JWT |
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

Ejecuta el script `database/schema.sql` en MySQL Workbench (**File → Open SQL Script**, y luego el botón del rayo). Es la referencia de la estructura que el código espera, y se puede ejecutar varias veces sin riesgo:

```sql
CREATE DATABASE IF NOT EXISTS crud_db;
USE crud_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(300) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**4. Configurar las variables de entorno**

Copia la plantilla `.env.example` como `.env` y completa tus datos:

```bash
cp .env.example .env
```

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=crud_db
JWT_SECRET=genera_una_cadena_larga_y_aleatoria
JWT_EXPIRES_IN=1h
```

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

> El archivo `.env` está en el `.gitignore` y **nunca debe subirse al repositorio**. Quien conozca el `JWT_SECRET` puede fabricar tokens válidos.

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
{ "message": "API Funcionando" }
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
├── database/
│   └── schema.sql                             # Estructura de la base de datos (referencia)
├── src/
│   ├── config/
│   │   └── database.js                        # Pool de conexiones a MySQL
│   ├── middlewares/
│   │   ├── auth.middleware.js                 # Verifica el token JWT
│   │   ├── error-handler.middleware.js        # Traduce errores a respuestas JSON (400, 409, 500)
│   │   ├── not-found.middleware.js            # Responde 404 en JSON a rutas inexistentes
│   │   ├── validate-id.middleware.js          # Valida que :id sea un entero positivo
│   │   ├── validate-login.middleware.js       # Valida email y password del login
│   │   ├── validate-register.middleware.js    # Valida name, email y password del registro
│   │   └── validate-user.middleware.js        # Valida name, email y su formato
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.js                 # POST /register y POST /login
│   │   │   ├── auth.controller.js             # Recibe la petición y responde
│   │   │   └── auth.service.js                # Lógica: cifrar, comparar y firmar tokens
│   │   └── users/
│   │       ├── users.routes.js                # URLs, métodos HTTP y middlewares
│   │       ├── users.controller.js            # Recibe la petición y responde
│   │       └── users.repository.js            # Consultas SQL (acceso a datos)
│   ├── app.js                                 # Configura Express y registra rutas y middlewares
│   └── server.js                              # Enciende el servidor
├── .env.example                               # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

### Flujo de una petición

```
Registro / login:
Cliente → routes → validación → controller → service → repository → MySQL

CRUD de usuarios:
Cliente → authenticate (JWT) → routes → validación → controller → repository → MySQL

Cualquier error → errorHandler (400 / 409 / 500)
```

| Capa | Responsabilidad |
|---|---|
| **routes** | Asocia cada URL y método HTTP con sus middlewares y su controlador |
| **middlewares** | Autentican, validan la petición y centralizan el manejo de errores |
| **controller** | Recibe la petición (`req`) y decide qué responder (`res`) |
| **service** | Lógica de negocio que no es HTTP ni SQL (cifrar contraseñas, comprobarlas, firmar tokens) |
| **repository** | Es el único lugar con SQL: ejecuta las consultas e informa el resultado |

### Decisiones de diseño

- **Contraseñas:** nunca se guardan ni se devuelven en texto plano. Se almacena un hash de bcrypt, que incluye su propio *salt*.
- **El hash no se filtra:** las consultas piden las columnas de forma explícita (`SELECT id, name, email`), por lo que `password_hash` solo sale de la base de datos en la consulta del login.
- **Login sin pistas:** un email inexistente y una contraseña incorrecta responden lo mismo (`401`), para no revelar qué emails están registrados.
- **Rutas públicas y privadas:** `/api/auth` es público; todo `/api/users` exige un token válido.
- **Unicidad del email:** la garantiza la restricción `UNIQUE` de MySQL, y `errorHandler` traduce ese error a un `409`. Así se evita la condición de carrera de consultar antes de insertar.
- **Errores en funciones `async`:** Express 5 los envía automáticamente al `errorHandler`, por lo que los controladores no necesitan `try/catch`.
- **`app.js` y `server.js` separados:** `app.js` define **qué hace** la aplicación y `server.js` solo **la enciende**. Esto facilita las pruebas automáticas a futuro.

### Convenciones

- Archivos: `nombre.rol.js` en minúsculas (`users.controller.js`)
- Funciones y variables: `camelCase` (`getUserById`)
- Tablas y columnas: `snake_case` en minúsculas, y plural para tablas (`users`)
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`)
- Ramas: `main` (estable) y `develop` (integración), con ramas `feat/...` o `fix/...` por tarea
- Cada tarea se planifica con un **Issue** y se integra mediante **Pull Request**

---

## Endpoints

**URL base:** `http://localhost:3000`

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| `POST` | `/api/auth/register` | Crear una cuenta | Público |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener un token | Público |
| `GET` | `/api/users` | Obtener todos los usuarios | Requiere token |
| `GET` | `/api/users/:id` | Obtener un usuario por su ID | Requiere token |
| `PUT` | `/api/users/:id` | Actualizar un usuario | Requiere token |
| `DELETE` | `/api/users/:id` | Eliminar un usuario | Requiere token |

### Registro

```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Ana López",
  "email": "ana@mail.com",
  "password": "Segura1234"
}
```

**Respuesta `201 Created`** (nunca incluye la contraseña ni el hash):

```json
{ "id": 1, "name": "Ana López", "email": "ana@mail.com" }
```

**Respuestas de error:**

| Código | Cuándo | Mensaje |
|---|---|---|
| `400` | Falta `name`, `email` o `password` | `name, email y password son obligatorios` |
| `400` | El email no tiene formato válido | `El formato del email no es válido` |
| `400` | La contraseña tiene menos de 8 caracteres | `La contraseña debe tener al menos 8 caracteres` |
| `400` | El cuerpo no es un JSON válido | `El cuerpo de la petición no es un JSON válido` |
| `409` | El email ya está registrado | `El email ya está registrado` |

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "ana@mail.com",
  "password": "Segura1234"
}
```

**Respuesta `200 OK`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Ana López", "email": "ana@mail.com" }
}
```

**Respuestas de error:**

| Código | Cuándo | Mensaje |
|---|---|---|
| `400` | Falta `email` o `password` | `email y password son obligatorios` |
| `401` | Email inexistente o contraseña incorrecta | `Credenciales inválidas` |

### Usar el token

Todas las rutas de `/api/users` exigen el token en el encabezado `Authorization`, con el formato `Bearer <token>`. El token dura el tiempo definido en `JWT_EXPIRES_IN` (por defecto, una hora).

```http
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

| Código | Cuándo | Mensaje |
|---|---|---|
| `401` | No se envía el encabezado `Authorization` | `Token requerido` |
| `401` | El token es inválido o expiró | `Token inválido o expirado` |

### Obtener todos los usuarios

```http
GET /api/users
```

**Respuesta `200 OK`:**

```json
[
  { "id": 1, "name": "Ana López", "email": "ana@mail.com" },
  { "id": 2, "name": "Carlos Ruiz", "email": "carlos@mail.com" }
]
```

### Obtener un usuario por ID

```http
GET /api/users/1
```

**Respuesta `200 OK`:**

```json
{ "id": 1, "name": "Ana López", "email": "ana@mail.com" }
```

**Respuestas de error:**

| Código | Cuándo | Mensaje |
|---|---|---|
| `400` | El ID no es un entero positivo (por ejemplo `/api/users/abc`) | `El id debe ser un número entero positivo` |
| `404` | El ID no existe | `Usuario no encontrado` |

### Actualizar un usuario

```http
PUT /api/users/1
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Ana López Actualizada",
  "email": "ana@mail.com"
}
```

**Respuesta `200 OK`:**

```json
{ "id": 1, "name": "Ana López Actualizada", "email": "ana@mail.com" }
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

**Respuestas de error:**

| Código | Cuándo | Mensaje |
|---|---|---|
| `400` | El ID no es un entero positivo | `El id debe ser un número entero positivo` |
| `404` | El ID no existe | `Usuario no encontrado` |

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
| `400` | Bad Request: datos ausentes o con formato inválido |
| `401` | Unauthorized: falta el token, es inválido, o las credenciales son incorrectas |
| `404` | Not Found: el recurso o la ruta no existe |
| `409` | Conflict: el email ya está registrado |
| `500` | Internal Server Error: error inesperado del servidor |

---

## Cómo probar la API

Puedes usar cualquiera de estas herramientas:

- **Thunder Client** (extensión de VS Code). Para enviar el token: pestaña **Auth** → **Bearer**.
- **Postman**
- **curl** desde la terminal

Flujo completo con `curl`:

```bash
# 1. Registrar una cuenta
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana López","email":"ana@mail.com","password":"Segura1234"}'

# 2. Iniciar sesión (copia el token de la respuesta)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@mail.com","password":"Segura1234"}'

# 3. Sin token, la ruta está protegida (devuelve 401)
curl http://localhost:3000/api/users

# 4. Con token, devuelve la lista
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer TU_TOKEN"

# 5. Actualizar un usuario
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"name":"Ana Actualizada","email":"ana@mail.com"}'

# 6. Eliminar un usuario
curl -X DELETE http://localhost:3000/api/users/3 \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## Limitaciones actuales

- Cualquier usuario autenticado puede modificar o eliminar a cualquier otro: todavía no existen roles ni verificación de propiedad.
- Los tokens no se pueden revocar antes de expirar, y no hay *refresh tokens*.
- No hay límite de intentos de inicio de sesión (*rate limiting*).
- No hay pruebas automáticas.

---

## Roadmap

### Completado

- [x] Servidor con Express y ES Modules
- [x] Estructura modular
- [x] Variables de entorno con `.env` y plantilla `.env.example`
- [x] Conexión a MySQL con pool de conexiones
- [x] Capa `repository`
- [x] CRUD completo de usuarios con MySQL
- [x] Middleware de errores y manejo de email duplicado (`409`)
- [x] Middleware `not-found` con respuesta en JSON
- [x] Validación de campos obligatorios y del formato del email
- [x] Validación del `:id` numérico
- [x] Esquema de la base de datos versionado (`database/schema.sql`)
- [x] Registro con contraseña cifrada (bcrypt)
- [x] Login con token JWT
- [x] Middleware de autenticación para proteger rutas
- [x] Flujo de trabajo con issues, ramas y Pull Requests

---

## Autor

**Osvaldo Ochoa**