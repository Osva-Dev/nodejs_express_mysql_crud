# Users CRUD API

API REST para la gestión de usuarios, construida con **Node.js**, **Express** y **MySQL**. Permite crear, consultar, actualizar y eliminar usuarios, con persistencia real en base de datos.

> ✅ **Estado del proyecto:** el CRUD completo funciona sobre MySQL. Las siguientes etapas (manejo de errores, registro, login con JWT y una interfaz web) están descritas en [Próximas actualizaciones](#próximas-actualizaciones).

---

## Características

- CRUD completo de usuarios con persistencia en **MySQL**
- Arquitectura modular, organizada por funcionalidad
- Separación de responsabilidades: rutas, controladores y repositorio
- Consultas SQL **parametrizadas** (protección contra inyección SQL)
- Pool de conexiones con `mysql2`
- Configuración mediante variables de entorno (`.env`)
- Validación de datos de entrada en `POST` y `PUT`
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
│   │   └── database.js                # Pool de conexiones a MySQL
│   ├── modules/
│   │   └── users/
│   │       ├── users.routes.js        # Define las URLs y métodos HTTP
│   │       ├── users.controller.js    # Recibe la petición y responde
│   │       └── users.repository.js    # Consultas SQL (acceso a datos)
│   ├── app.js                         # Configura Express y registra las rutas
│   └── server.js                      # Enciende el servidor
├── .gitignore
├── package.json
└── README.md
```

### Flujo de una petición

```
Cliente → routes → controller → repository → MySQL
```

| Capa | Responsabilidad |
|---|---|
| **routes** | Asocia cada URL y método HTTP con una función del controlador |
| **controller** | Recibe la petición (`req`), valida los datos y decide qué responder (`res`) |
| **repository** | Es el único lugar con SQL: ejecuta las consultas e informa el resultado |

`app.js` y `server.js` están separados a propósito: `app.js` define **qué hace** la aplicación y `server.js` solo **la enciende**. Esto facilita las pruebas automáticas a futuro.

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

**Respuesta `400 Bad Request`** (si falta `name` o `email`):

```json
{ "message": "name y email son obligatorios" }
```

**Respuesta `404 Not Found`** (si el ID no existe):

```json
{ "message": "Usuario no encontrado" }
```

### Eliminar un usuario

```http
DELETE /api/users/3
```

**Respuesta `200 OK`:**

```json
{ "message": "Usuario eliminado" }
```

**Respuesta `404 Not Found`** (si el ID no existe):

```json
{ "message": "Usuario no encontrado" }
```

### Códigos de estado utilizados

| Código | Significado |
|---|---|
| `200` | OK: la petición fue exitosa |
| `201` | Created: el recurso se creó correctamente |
| `400` | Bad Request: faltan datos obligatorios |
| `404` | Not Found: el recurso o la ruta no existe |

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
```

---

## Limitaciones actuales

- Un email repetido produce un error `500` en lugar de un `409 Conflict` con un mensaje claro.
- No se valida el formato del email.
- Un `id` que no sea numérico (por ejemplo `/api/users/abc`) no se valida de forma explícita.
- Los errores de base de datos no se capturan de forma centralizada.
- Los endpoints no requieren autenticación: cualquiera puede crear, modificar o eliminar usuarios.

---

## Próximas actualizaciones

El objetivo es convertir el CRUD en una aplicación completa y demostrable: con registro, inicio de sesión, rutas protegidas y una interfaz web. Se trabajará por fases, cada una con su issue, su rama y su Pull Request.

| Fase | Qué se construye | Qué resuelve |
|---|---|---|
| **0. Manejo de errores** | Middleware de errores y `404` en JSON; `409` por email duplicado | Respuestas claras en lugar de errores `500` en HTML |
| **1. Base de datos** | Columna `password_hash` y `created_at` en `users` | Preparar la tabla para guardar credenciales |
| **2. Registro** | `POST /api/auth/register` con contraseñas cifradas con **bcrypt** | Crear cuentas sin guardar contraseñas en texto plano |
| **3. Login** | `POST /api/auth/login` que devuelve un token **JWT** | Identificar al usuario en cada petición |
| **4. Rutas protegidas** | Middleware de autenticación | Que solo usuarios con sesión accedan al CRUD |
| **5. Validaciones** | Formato del email, `:id` numérico, validación en middleware | Rechazar datos inválidos antes de llegar al controlador |
| **6. Frontend** | Interfaz web con pantallas de registro, login y lista de usuarios | Mostrar el proyecto funcionando de punta a punta |
| **7. Presentación** | README final y video de demostración | Documentar y explicar el proyecto |

### Estructura prevista

```
nodejs_express_mysql_crud/
├── frontend/                          # Interfaz web (HTML, CSS y JavaScript)
├── src/
│   ├── config/
│   ├── middlewares/
│   │   ├── error-handler.middleware.js
│   │   ├── not-found.middleware.js
│   │   └── auth.middleware.js
│   ├── modules/
│   │   ├── auth/                      # Registro y login
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   └── users/
│   └── utils/
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

> Esta sección describe trabajo **planificado**, no implementado. Se irá marcando en el [Roadmap](#roadmap) conforme avance.

---

## Roadmap

### Completado

- [x] Servidor con Express y ES Modules
- [x] Estructura modular
- [x] CRUD de usuarios en memoria
- [x] Validación de campos obligatorios en `POST` y `PUT`
- [x] Variables de entorno con `.env`
- [x] Conexión a MySQL con pool de conexiones
- [x] Capa `repository`
- [x] CRUD completo de usuarios con MySQL

### Pendiente

- [ ] Middleware de errores y manejo de email duplicado (`409`)
- [ ] Middleware `not-found` con respuesta en JSON
- [ ] Validación del formato del email
- [ ] Validación del `:id` numérico
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