# Users CRUD API

API REST para la gestión de usuarios, construida con **Node.js**, **Express** y **MySQL**. Permite crear, consultar, actualizar y eliminar usuarios.

> 🚧 **Estado del proyecto:** en desarrollo. La migración de memoria a MySQL se hace operación por operación. Consulta la tabla de [Endpoints](#endpoints) para ver cuáles ya persisten en la base de datos y el [Roadmap](#roadmap) para lo que sigue.

---

## Características

- CRUD de usuarios con persistencia en **MySQL** (migración en progreso)
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
│   ├── middlewares/                   # Funciones entre petición y respuesta
│   ├── modules/
│   │   └── users/
│   │       ├── users.routes.js        # Define las URLs y métodos HTTP
│   │       ├── users.controller.js    # Recibe la petición y responde
│   │       └── users.repository.js    # Consultas SQL (acceso a datos)
│   ├── utils/                         # Utilidades reutilizables
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

| Método | Endpoint | Descripción | Almacenamiento |
|---|---|---|---|
| `GET` | `/api/users` | Obtener todos los usuarios | ✅ MySQL |
| `GET` | `/api/users/:id` | Obtener un usuario por su ID | ⏳ Memoria (pendiente) |
| `POST` | `/api/users` | Crear un usuario | ✅ MySQL |
| `PUT` | `/api/users/:id` | Actualizar un usuario | ✅ MySQL |
| `DELETE` | `/api/users/:id` | Eliminar un usuario | ⏳ Memoria (pendiente) |

> Mientras la migración no termine, `GET /api/users/:id` y `DELETE /api/users/:id` trabajan sobre un arreglo en memoria y **no ven** los usuarios guardados en MySQL.

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

# Crear un usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"María Pérez","email":"maria@mail.com"}'

# Actualizar un usuario
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Osvaldo Actualizado","email":"osva@gmail.com"}'
```

---

## Limitaciones actuales

- `GET /api/users/:id` y `DELETE /api/users/:id` aún usan datos en memoria.
- Un email repetido produce un error `500` en lugar de un `409 Conflict` con un mensaje claro.
- No se valida el formato del email.
- Los errores de base de datos no se capturan de forma centralizada.

## Roadmap

- [x] Servidor con Express y ES Modules
- [x] Estructura modular
- [x] CRUD de usuarios en memoria
- [x] Validación de campos obligatorios en `POST` y `PUT`
- [x] Variables de entorno con `.env`
- [x] Conexión a MySQL con pool de conexiones
- [x] Capa `repository`
- [x] `GET /api/users` con MySQL
- [x] `POST /api/users` con MySQL
- [x] `PUT /api/users/:id` con MySQL
- [ ] `GET /api/users/:id` con MySQL
- [ ] `DELETE /api/users/:id` con MySQL
- [ ] Manejo de email duplicado (`409`)
- [ ] Validación del formato del email
- [ ] Manejo centralizado de errores
- [ ] Capa `service`
- [ ] Archivo `.env.example`
- [ ] Pruebas automáticas
- [ ] Autenticación con JWT

---

## Autor

**Osvaldo Ochoa**