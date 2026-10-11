<a id="opencoast-development-and-deployment"></a>

# Développement et déploiement d’OpenCoast

[Retour à OpenCoast](../README.md) · [Contribuer](../CONTRIBUTING.md)

Ce guide couvre l’installation locale, la validation, l’initialisation des modérateurs et l’infrastructure hébergée. Pour l’objectif de la carte, les labels de preuve et la participation, commencez par le README du dépôt.

<a id="run-locally"></a>

## Exécution locale

Prérequis : Node.js 24+, npm et Docker. La base PostGIS locale utilise le port `54329` ; l’API utilise `4000` ; l’application web utilise `5173`.

```sh
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Ouvrez `http://localhost:5173`. Pour créer un modérateur local, définissez `MODERATOR_BOOTSTRAP_PASSWORD` avec un mot de passe unique d’au moins 12 caractères et exécutez :

```sh
npm run moderator:create -w api -- moderator@example.org
```

L’API charge les variables d’environnement depuis le `.env` du dépôt ou `api/.env` ; copiez `.env.example` si vous devez changer les valeurs par défaut. Les téléversements locaux sont stockés dans `.local-evidence/`, ignoré par Git. En production, configurez les identifiants Cloudflare R2 et laissez `LOCAL_EVIDENCE_DIR` non défini.

<a id="checks"></a>

## Vérifications

```sh
npm test
npm run format:check
npm run typecheck
npm run build
npm audit --audit-level=high
```

Le test d’intégration de base de données utilise une base distincte `opencoast_test` et ne vide que cette base après exécution. Créez-la localement, appliquez-y les migrations, puis lancez le test :

```sh
docker exec opencoast-postgis-1 createdb -U opencoast opencoast_test
```

Définissez `DATABASE_URL=postgres://opencoast:opencoast_local@localhost:54329/opencoast_test` pour la migration et pour `INTEGRATION_TEST=1 npx vitest run api/src/app.integration.test.ts`. Le test refuse tout autre nom de base.

<a id="hosted-deployment"></a>

## Déploiement hébergé

Le déploiement hébergé utilise des projets Vercel dédiés [web](https://opencoast.kaelux.dev) et [API](https://opencoast-api.vercel.app/health), PostgreSQL Supabase avec PostGIS et un bucket Cloudflare R2 **privé**. Définissez le répertoire racine de chaque projet Vercel à `web` ou `api`. Le fichier `web/vercel.ts` du projet web relaie `/api/*` vers le projet API afin que les cookies des modérateurs restent internes au site. Définissez `VERCEL_API_ORIGIN` sur le projet web avec l’origine HTTPS de l’API. N’exposez pas les identifiants de la base ou de R2 à la compilation web. Voir la [configuration du domaine personnalisé](domain-setup.md) pour le DNS et les origines.

Environnement de l’API :

| Variable | Rôle |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL` | Chaîne de connexion au pooler de transactions Supabase avec PostGIS activé |
| `DATABASE_SSL_CA_B64` | Certificat CA racine Supabase encodé en Base64 pour TLS vérifié |
| `WEB_ORIGIN` | Origines web exactes séparées par des virgules pour CORS et les contrôles des mutations de modérateurs |
| `S3_ENDPOINT` | Endpoint du compte Cloudflare R2 |
| `S3_REGION` | Région R2, normalement `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Identifiants R2 limités au bucket de preuves |
| `S3_BUCKET` | Nom du bucket privé de preuves |
| `COOKIE_SECURE` | Sécurisé par défaut en production |

Exécutez `api/db/*.sql` dans l’ordre des noms de fichiers sur la base avant de démarrer l’API, ou `npm run db:migrate -w api` dans un environnement de confiance avec `DATABASE_URL`. Gardez R2 privé : les originaux ne reçoivent jamais d’URL publique d’objet. Configurez CORS R2 pour l’origine web exacte et `PUT` avec `Content-Type` (exemple dans `infra/r2-cors.json`). Les téléversements hébergés utilisent des URL PUT signées de courte durée ; l’API valide ensuite le fichier stocké avant de le copier vers une clé finale privée. Créez les comptes de modérateurs avec `MODERATOR_BOOTSTRAP_PASSWORD` comme secret temporaire, puis supprimez-le.

L’URL du fond de carte public peut être remplacée avec `VITE_MAP_STYLE_URL`. OpenFreeMap convient au développement initial mais n’offre pas de garantie de service ; prévoyez une surveillance et un fournisseur de tuiles financé avant une large promotion. La carte accepte actuellement la navigation par coordonnées (`latitude, longitude`), pas la recherche par nom de lieu.
