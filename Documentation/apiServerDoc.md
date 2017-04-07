# API Documentation
## Server
> ### Unix

- GET /api/servers/unix/

the `GET /api/servers/unix` request can be used to retrieved all unix servers

Response Code | Content-type | Content
--- | --- | ---
200 | JSON | [Server]

Error Code | Description
--- | ---
500 | Server side error.

***

- GET /api/servers/unix/active

the `GET /api/servers/unix/active` request can be used to retrieved all active unix servers

Response Code | Content-type | Content
--- | --- | ---
200 | JSON | [Server]

Error Code | Description
--- | ---
500 | Server side error.

***

- GET /api/servers/unix/compliant

the `GET /api/servers/unix/compliant` request can be used to retrievel the number of compliant server

Response Code | Content-type | Content
--- | --- | ---
200 | JSON | {nbCompliant, pourcentCompliant}

Error Code | Description
--- | ---
500 | Server side error.

***

- GET /api/servers/unix/:name

the `GET /api/servers/unix/:name` request can be used to retrieved a server

#### Parameters

Key | Value description
name | The server name

Response Code | Content-type | Content
--- | --- | ---
200 | JSON | [Server]

Error Code | Description
--- | ---
404 | Server related to the given id not found
500 | Server side error.
