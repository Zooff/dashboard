# Structure de l'application

```

|--client
|  |-- css
|  |-- js
|  |   |-- config
|  |   |-- controller
|  |   |-- directive
|  |   |-- interceptor
|  |   |-- service
|  |   |--app.js
|  |-- templates
|  |-- widgets
|  |-- index.html
|--server
|  |-- db
|  |-- routes
|--bower.json
|--package.json
|config.js
|server.js

```

## Client

Le dossier *Client* comporte tout les éléments necessaires au 'Front' de l'application
Il se compose des dossiers/fichiers :
- CSS : Contients les divers fichiers CSS utilisé par l'app client
- JS : Contient tous les scripts JS, il se compose des dossiers suivant :
  - Config : Contient les fichiers de configurations tel que celui permettant d'ajouter des structures au Dash ou de changer les couleurs des graphs
  - Controller : Contient les controllers
  - Directive
  - Interceptor
  - Service
  - app.js
- Templates : Contients les différentes templates HTML
- Widgets : Détaillé plus loin
- index.html

## Widgets


le dossier *widgets* comporte les différents widgets utilisé dans l'application. Chaque widget comporte  :
- un dossier dist obtenu graçe à l'aide de l'utilitaire gulp, ce sont ces fichiers qu'il faut inclure dans le fichier index.html
- un dossier src contenant les sources des widgets.
- bower.json


## Server

Le dossier *server* comportes les dossiers/fichiers utilisé par le Back End de l'application. Il se compose de :
- db : dossier contenant les accès au base de données ainsi que les divers DAO utilisé dans l'application
- routes : dossiers contenant les routes utilisé par le middleware Express

## config.js

Fichier de config du back End, contient les informations nécessaires aux connection DB

## server.js

point d'entrée de l'application
