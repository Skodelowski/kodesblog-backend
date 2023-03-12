# Projet Node 4 - Blog CDA

> En charge du développement d'un blog sur l'actualité du métier, pour en faire un outil de veille technologique.
> _Cette plateforme ne sera pas accessible au grand public, mais uniquement à tous les étudiants CDA._

## Étapes de conception :

- [x] Organisation (Trello)
- [x] Schéma MCD
- [x] Définition des technos (NodeJS/Express/MongoDB pour le Back/SGBD, React/ViteJS pour le Front, Bootstrap ou SemanticUI pour le framework CSS)
- [x] Repos Github (un repo pour le back, un pour le front)
- [x] Définitions des routes de l'API

## Initialisation

À créer après clonage : fichier .env avec les valeurs

```
NODE_ENV=... #env
APP_HOSTNAME="localhost" #hostname
APP_PORT=... #port (prévu par défaut sur 8000 par le .env du front)
APP_SECRET=... #Donnée secrète pour le token
```

Routes à lancer en premier pour alimenter un début de database :

**Users**
`(http...)/users/add-fakes`
_Les mots de passe sont en clair pour le fichier de base pour pouvoir utiliser facilement les comptes pour les tests, mais ils seront hashés lors de l'ajout à la base avec la route ci-dessus._

**Categories**
`(http...)/categories/add-base`

Dossier à rajouter à la racine pour les images : public/uploads
