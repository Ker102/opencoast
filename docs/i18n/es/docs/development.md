<a id="opencoast-development-and-deployment"></a>

# Desarrollo y despliegue de OpenCoast

[Volver a OpenCoast](../README.md) · [Contribuir](../CONTRIBUTING.md)

Esta guía explica la configuración local, la validación, la creación inicial de moderadores y la infraestructura alojada. Para el propósito del mapa, las etiquetas de evidencia y la participación, empieza por el README del repositorio.

<a id="run-locally"></a>

## Ejecutar localmente

Requisitos: Node.js 24+, npm y Docker. La base PostGIS local utiliza el puerto `54329`; la API utiliza `4000`; la aplicación web utiliza `5173`.

```sh
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Abre `http://localhost:5173`. Para crear un moderador local, establece `MODERATOR_BOOTSTRAP_PASSWORD` con una contraseña única de al menos 12 caracteres y ejecuta:

```sh
npm run moderator:create -w api -- moderator@example.org
```

La API carga los valores de entorno desde `.env` del repositorio o `api/.env`; copia `.env.example` si necesitas cambiar los valores predeterminados. Los archivos locales se almacenan en `.local-evidence/`, que está ignorado por Git. En producción se deben configurar las credenciales de Cloudflare R2 y dejar `LOCAL_EVIDENCE_DIR` sin establecer.

<a id="checks"></a>

## Comprobaciones

```sh
npm test
npm run format:check
npm run typecheck
npm run build
npm audit --audit-level=high
```

La prueba de integración de base de datos utiliza una base independiente, `opencoast_test`, y solo vacía esa base después de ejecutarse. Créala localmente, ejecuta las migraciones en ella y después la prueba:

```sh
docker exec opencoast-postgis-1 createdb -U opencoast opencoast_test
```

Establece `DATABASE_URL=postgres://opencoast:opencoast_local@localhost:54329/opencoast_test` tanto para la migración como para `INTEGRATION_TEST=1 npx vitest run api/src/app.integration.test.ts`. La prueba rechaza cualquier otro nombre de base de datos.

<a id="hosted-deployment"></a>

## Despliegue alojado

El despliegue alojado utiliza proyectos dedicados de Vercel para [web](https://opencoast.kaelux.dev) y [API](https://opencoast-api.vercel.app/health), PostgreSQL de Supabase con PostGIS y un bucket **privado** de Cloudflare R2. Configura el directorio raíz de cada proyecto de Vercel como `web` o `api`. El archivo `web/vercel.ts` del proyecto web actúa como proxy de `/api/*` hacia el proyecto API para que las cookies de moderación sigan siendo propias del sitio. Establece `VERCEL_API_ORIGIN` en el proyecto web con el origen HTTPS de la API. No expongas credenciales de base de datos o R2 a la compilación web. Consulta la [configuración del dominio personalizado](domain-setup.md) para DNS y orígenes.

Entorno de la API:

| Variable | Finalidad |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL` | Cadena de conexión al pooler de transacciones de Supabase con PostGIS habilitado |
| `DATABASE_SSL_CA_B64` | Certificado de CA raíz de Supabase codificado en Base64 para TLS verificado |
| `WEB_ORIGIN` | Orígenes web exactos separados por comas para CORS y comprobaciones de mutaciones de moderadores |
| `S3_ENDPOINT` | Endpoint de la cuenta de Cloudflare R2 |
| `S3_REGION` | Región de R2, normalmente `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Credenciales de R2 restringidas al bucket de evidencia |
| `S3_BUCKET` | Nombre del bucket privado de evidencia |
| `COOKIE_SECURE` | Seguro de forma predeterminada en producción |

Ejecuta `api/db/*.sql` por orden de nombre de archivo en la base antes de iniciar la API, o ejecuta `npm run db:migrate -w api` en un entorno de confianza con `DATABASE_URL`. Mantén R2 privado: los archivos originales nunca reciben una URL pública de objeto. Configura CORS de R2 para el origen web exacto y `PUT` con `Content-Type` (hay un ejemplo en `infra/r2-cors.json`). Las cargas alojadas utilizan URL PUT firmadas de corta duración; después la API valida el archivo almacenado antes de copiarlo a una clave final privada. Crea cuentas de moderador utilizando `MODERATOR_BOOTSTRAP_PASSWORD` como secreto temporal y después elimínalo.

La URL del mapa base público se puede sustituir con `VITE_MAP_STYLE_URL`. OpenFreeMap es adecuado para el desarrollo inicial, pero no ofrece garantía de servicio; organiza supervisión y un proveedor de teselas financiado antes de una promoción amplia. Actualmente el mapa acepta navegación por coordenadas (`latitude, longitude`), no búsqueda por nombre de lugar.
