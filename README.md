# Buenas Practicas, Api Rest.
| Nodejs | Express | MongoDB | Jwt |

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)
# Instalación

Ejecute `npm install` para instalar las dependencias:
```
$ npm install
```
Luego asegurese de poner en ejecución con dotenv:
```
$ node -r dotenv/config app.js
```
O si esta en modo desarrollo:
```
$ nodemon -r dotenv/config app.js
```

# Documentacion de Api
Tome en cuenta que `base_url` es una variable y puede variar:
```
$ base_url/api/login
$ https://boiling-brook-54736.herokuapp.com/api
$ localhost:3000/api
```
# # Autenticación
Como autentificarse en la API
```
POST: base_url/api/login
$ Form URL Encoded: email, password
```
`code: 200 OK`:
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfdV8iOiIyODQxZjljZTMwZmNhNDZmYmYyOTM3ZGI4NjBmYTE4ODFmNmRiZDVjMjk3N2I5Mzk2YjFkOGU2OWZhMGIwZmZkZDM3OWRmYTUwNjJjNDMyYzBkOWNkNDQ1YTA3NzQyYjJzY1JrenduK056aFRReFUwZjhmZVQ4QThuenZkN3JscEVqcVR2S3ZqYUlHV0hsd0FVMFF4Z1RTYXNRM1VqbWFsIiwiaWF0IjoxNTY4NDAzODA4LCJleHAiOjE1NzA5OTU4MDh9.20CIyg9IZ2WLZInycAVG9EIVZqY2QFtv3V5BXcYAAGk",
  "user": {
    "name": "Charles Rodriguez",
    "email": "charlesrodriguez19@gmail.com",
    "role": "ADMIN_ROLE",
    "_id": "5d71a607071feb0017244def",
    "updatedAt": "2019-09-06T00:19:19.246Z",
    "createdAt": "2019-09-06T00:19:19.246Z"
  },
  "success": true,
  "msg": 1
}
```

# # Usuarios

#### Visualizar todos los usuarios registrados
```
GET:    base_url/api/users?page=1&limit=16
Query:  page=1 limit=16
Header: Authorization: token
```
`Code 200 OK`:
```
{
  "docs": [
    {
      "name": "Charles Rodriguez",
      "email": "charlesrodriguez19@gmail.com",
      "role": "ADMIN_ROLE",
      "_id": "5d71a607071feb0017244def",
      "updatedAt": "2019-09-06T00:19:19.246Z",
      "createdAt": "2019-09-06T00:19:19.246Z"
    }
  ],
  "totalDocs": 1,
  "limit": 16,
  "hasPrevPage": false,
  "hasNextPage": false,
  "page": 1,
  "totalPages": 1,
  "pagingCounter": 1,
  "prevPage": null,
  "nextPage": null,
  "success": true,
  "msg": 1
}
```
#### Un usuario en especifico
```
GET:    base_url/api/user/:id
id:     5d718c2a6e464d6a06d05946
```
`code 200 OK`:
```
{
  "success": true,
  "msg": 1,
  "users": [
    {
      "name": "test 1",
      "email": "test1@gmail.com",
      "role": "ADMIN_ROLE",
      "googleAt": "2019-09-05T22:28:57.000Z",
      "_id": "5d718c2a6e464d6a06d05946",
      "updatedAt": "2019-09-13T19:45:28.812Z",
      "createdAt": "2019-09-05T22:29:00.679Z"
    }
  ]
}
```
#### Crear un usuario
```
POST: base_url/api/user
$ Form URL Encoded: [name, email, password, role, googleAt]
```
Nota: roles permitidos: `USER_ROLE` y `ADMIN_ROLE`

`code 200 OK`:
```
{
  "success": true,
  "msg": 1,
  "user": {
    "name": "Aaron Rodriguez",
    "email": "aaronrodriguez@gmail.com",
    "role": "USER_ROLE",
    "googleAt": "2019-09-13T01:40:04.000Z",
    "_id": "5d7af3746fbf854bddf5f13f",
    "updatedAt": "2019-09-13T01:40:05.090Z",
    "createdAt": "2019-09-13T01:40:05.090Z"
  }
}
```

#### Editar un usuario en especifico
```
PUT: base_url/api/user/:id
id: 5d718c2a6e464d6a06d05946
Form URL Encoded: [name, email, password, role, googleAt]
Header: Authorization: token
```
`code 200 OK`:
```
{
  "result": {
    "n": 1,
    "nModified": 1,
    "opTime": {
      "ts": "6736243577677938689",
      "t": 1
    },
    "electionId": "7fffffff0000000000000001",
    "ok": 1,
    "operationTime": "6736243577677938689",
    "$clusterTime": {
      "clusterTime": "6736243577677938689",
      "signature": {
        "hash": "Nzj4omvmC3eYAd39XLgPTiPy20s=",
        "keyId": "6732715919174270977"
      }
    }
  },
  "success": true,
  "msg": 1
}
```

#### Eliminar un usuario en especifico
```
DELETE: base_url/api/user/:id
id: 5d718c2a6e464d6a06d05946
Header: Authorization: token
```
`code 200 OK`:
```
{
  "user": {
    "n": 1,
    "nModified": 1,
    "opTime": {
      "ts": "6736243899800485889",
      "t": 1
    },
    "electionId": "7fffffff0000000000000001",
    "ok": 1,
    "operationTime": "6736243899800485889",
    "$clusterTime": {
      "clusterTime": "6736243899800485889",
      "signature": {
        "hash": "SOHwqDLh/AElLFzayaSFq7eYt9U=",
        "keyId": "6732715919174270977"
      }
    }
  },
  "success": true,
  "msg": 1
}
```
#### Codigos de error
En el Json de respuesta siempre encontrará el index `msg`.
```
 1 ~> Operación realizada con éxito
 0 ~>
-1 ~> Error al realizar la operación
-2 ~> Error al encriptar contraseña
-3 ~> Recurso no encontrado
-4 ~> No se pudieron realizar las modificaciones
-5 ~> Sin acceso a su Json Web Token
-6 ~> No posee los privilegios necesarios
-7 ~> Problemas con su Json Web Token
-8 ~> Email o contraseña inválidos
```

# Collección PostMan de Api
> https://documenter.getpostman.com/view/1469666/SVmvTeWF