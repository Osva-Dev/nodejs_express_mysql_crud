# Users CRUD API

API REST para la gestión de usuarios, construida con **Node.js** y **Express**. Permite crear, consultar, actualizar y eliminar usuarios.

> 🚧 **Estado del proyecto:** en desarrollo. Actualmente los datos se guardan **en memoria** (se pierden al reiniciar el servidor). La integración con **MySQL** y las validaciones están planificadas. Consulta la sección [Roadmap](#roadmap).

---

## Características

- CRUD completo de usuarios (Create, Read, Update, Delete)
- Arquitectura modular, organizada por funcionalidad
- Separación de responsabilidades (rutas y controladores)
- Uso de **ES Modules** (`import` / `export`)
- Códigos de estado HTTP correctos (`200`, `201`, `404`)
- Recarga automática en desarrollo con **nodemon**

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Node.js](https://nodejs.org/) v20 o superior | Entorno de ejecución |
| [Express 5](https://expressjs.com/) | Framework web |
| [nodemon](https://nodemon.io/) | Recarga automática en desarrollo |
| MySQL *(próximamente)* | Base de datos |

---

## Instalación

### Requisitos previos

- [Node.js](https://nodejs.org/) v20 o superior
- npm (se instala junto con Node.js)
- Git

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/<tu-usuario>/users-crud-api.git
cd users-crud-api
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Iniciar el servidor en modo desarrollo**

```bash
npm run dev
```

Deberías ver en la terminal:

```
Servidor corriendo en http://localhost:3000
```

**4. Verificar que funciona**

Abre en tu navegador [http://localhost:3000](http://localhost:3000). Debe responder:

```json
{ "message": "API funcionando" }
```

## Arquitectura

El proyecto usa una **estructura por módulos** (*feature-based*): todo lo relacionado con una funcionalidad vive junto. Para agregar un módulo nuevo (por ejemplo, `products`) basta con crear su propia carpeta dentro de `modules/`.

```
users-crud-api/
├── src/
│   ├── config/                    # Configuración (variables de entorno, base de datos)
│   ├── middlewares/               # Funciones que se ejecutan entre petición y respuesta
│   ├── modules/
│   │   └── users/
│   │       ├── users.routes.js        # Define las URLs y métodos HTTP
│   │       └── users.controller.js    # Lógica que atiende cada petición
│   ├── utils/                     # Utilidades reutilizables
│   ├── app.js                     # Configura Express y registra las rutas
│   └── server.js                  # Enciende el servidor
├── .gitignore
├── package.json
└── README.md
```

### Flujo de una petición

```
Cliente → routes → controller → respuesta
```

| Capa | Responsabilidad |
|---|---|
| **routes** | Asocia cada URL y método HTTP con una función del controlador |
| **controller** | Recibe la petición (`req`), procesa y devuelve la respuesta (`res`) |

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


### Códigos de estado utilizados

| Código | Significado |
|---|---|
| `200` | OK: la petición fue exitosa |
| `201` | Created: el recurso se creó correctamente |
| `404` | Not Found: el recurso o la ruta no existe |

---

## Limitaciones actuales

- Los datos **no persisten**: se pierden al reiniciar el servidor.
- No hay validación de datos: se aceptan peticiones sin `name` o `email`.
- El `id` de los usuarios nuevos se calcula con `users.length + 1`, lo que puede generar IDs duplicados tras eliminar usuarios. Se resolverá con `AUTO_INCREMENT` al integrar MySQL.

## Roadmap

- [x] Servidor con Express y ES Modules
- [x] Estructura modular
- [x] CRUD de usuarios en memoria
- [ ] Validación de datos de entrada
- [ ] Conexión a MySQL
- [ ] Capas `service` y `repository`
- [ ] Manejo centralizado de errores
- [ ] Variables de entorno con `.env`
- [ ] Pruebas automáticas
- [ ] Autenticación con JWT

---

## Autor

**Osvaldo Ochoa**
