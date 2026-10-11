<a id="opencoast-development-and-deployment"></a>

# OpenCoast entwickeln und bereitstellen

[Zurück zu OpenCoast](../README.md) · [Mitwirken](../CONTRIBUTING.md)

Dieser Leitfaden behandelt lokale Einrichtung, Validierung, initiale Moderatoranlage und gehostete Infrastruktur. Für Kartenidee, Belegkennzeichnungen und Beteiligung beginne beim Repository-README.

<a id="run-locally"></a>

## Lokal ausführen

Voraussetzungen: Node.js 24+, npm und Docker. Die lokale PostGIS-Datenbank verwendet Port `54329`, die API `4000`, die Webanwendung `5173`.

```sh
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Öffne `http://localhost:5173`. Um einen lokalen Moderator anzulegen, setze `MODERATOR_BOOTSTRAP_PASSWORD` auf ein individuelles Passwort mit mindestens 12 Zeichen und führe aus:

```sh
npm run moderator:create -w api -- moderator@example.org
```

Die API lädt Umgebungswerte aus `.env` im Repository oder `api/.env`; kopiere `.env.example`, wenn du Standardwerte ändern musst. Lokale Uploads liegen im ignorierten `.local-evidence/`. In Produktion müssen Cloudflare-R2-Zugangsdaten konfiguriert und `LOCAL_EVIDENCE_DIR` ungesetzt bleiben.

<a id="checks"></a>

## Prüfungen

```sh
npm test
npm run format:check
npm run typecheck
npm run build
npm audit --audit-level=high
```

Der Datenbankintegrationstest nutzt eine separate Datenbank `opencoast_test` und leert nach Ausführung ausschließlich diese. Erstelle sie lokal, führe Migrationen dagegen aus und anschließend den Test:

```sh
docker exec opencoast-postgis-1 createdb -U opencoast opencoast_test
```

Setze `DATABASE_URL=postgres://opencoast:opencoast_local@localhost:54329/opencoast_test` sowohl für die Migration als auch für `INTEGRATION_TEST=1 npx vitest run api/src/app.integration.test.ts`. Der Test verweigert jeden anderen Datenbanknamen.

<a id="hosted-deployment"></a>

## Gehostete Bereitstellung

Die gehostete Bereitstellung verwendet eigene Vercel-Projekte für [Web](https://opencoast.kaelux.dev) und [API](https://opencoast-api.vercel.app/health), Supabase PostgreSQL mit PostGIS sowie einen **privaten** Cloudflare-R2-Bucket. Setze das Stammverzeichnis jedes Vercel-Projekts auf `web` oder `api`. Die Datei `web/vercel.ts` des Webprojekts leitet `/api/*` zum API-Projekt weiter, damit Moderator-Cookies First-Party-Cookies bleiben. Setze `VERCEL_API_ORIGIN` im Webprojekt auf den HTTPS-Origin der API. Gib Datenbank- oder R2-Zugangsdaten nicht an den Webbuild weiter. Siehe [Einrichtung einer eigenen Domain](domain-setup.md) für DNS und Origin-Konfiguration.

API-Umgebung:

| Variable | Zweck |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL` | Verbindungszeichenfolge des Supabase-Transaktionspoolers mit aktiviertem PostGIS |
| `DATABASE_SSL_CA_B64` | Base64-codiertes Supabase-Root-CA-Zertifikat für verifiziertes TLS |
| `WEB_ORIGIN` | Kommagetrennte exakte Web-Origins für CORS und Prüfungen von Moderatoränderungen |
| `S3_ENDPOINT` | Cloudflare-R2-Konto-Endpunkt |
| `S3_REGION` | R2-Region, normalerweise `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Auf den Beleg-Bucket beschränkte R2-Zugangsdaten |
| `S3_BUCKET` | Name des privaten Beleg-Buckets |
| `COOKIE_SECURE` | In Produktion standardmäßig sicher |

Führe `api/db/*.sql` vor dem API-Start in Dateinamensreihenfolge gegen die Datenbank aus oder `npm run db:migrate -w api` in einer vertrauenswürdigen Umgebung mit `DATABASE_URL`. Halte R2 privat: Original-Uploads erhalten niemals eine öffentliche Objekt-URL. Konfiguriere R2-CORS für den exakten Web-Origin und `PUT` mit `Content-Type` (Beispiel in `infra/r2-cors.json`). Gehostete Beleg-Uploads verwenden kurzlebige signierte PUT-URLs; anschließend prüft die API die gespeicherte Datei, bevor sie sie auf einen privaten endgültigen Schlüssel kopiert. Erstelle Moderatorkonten mit `MODERATOR_BOOTSTRAP_PASSWORD` als temporärem Geheimnis und entferne es danach.

Die URL der öffentlichen Grundkarte kann mit `VITE_MAP_STYLE_URL` ersetzt werden. OpenFreeMap eignet sich für frühe Entwicklung, bietet aber keine Dienstgarantie; organisiere vor breiter Bewerbung Überwachung und einen finanzierten Kachelanbieter. Aktuell unterstützt die Karte Koordinatennavigation (`latitude, longitude`) statt Ortsnamensuche.
