<img src="../../../web/public/favicon.svg" width="56" height="56" alt="OpenCoast-Küstenlogo">

<a id="opencoast--open-source-coastal-access-map"></a>

# OpenCoast — Open-Source-Karte für den Küstenzugang

[English](../../../README.md) · [Español](../es/README.md) · [简体中文](../zh-CN/README.md) · [Français](../fr/README.md) · [日本語](../ja/README.md) · [Deutsch](README.md) · [Português (Brasil)](../pt-BR/README.md)

<!-- translation-notice -->
Übersetzung der englischen Dokumentation; maßgeblich ist das englische Original.
<!-- /translation-notice -->

**Zugangsrechte zu Stränden, Wege zum Ufer und die Belege dafür.**

**Kein Konto. Keine Anmeldung. Anonym erkunden und beitragen.**

OpenCoast ist eine Open-Source-Webanwendung zur Kartierung gemeinschaftlich geprüfter Informationen über **öffentlichen Strandzugang und Küstenzugangsrechte**. Menschen können Küstengebiete, Wege zum Ufer und Zugangspunkte zeichnen, Beschreibungen, örtliche Bedingungen und Quellen hinzufügen und diese anonym einreichen. Moderatoren prüfen jeden Vorschlag, bevor er auf der öffentlichen Karte erscheint.

[Karte erkunden](https://opencoast.kaelux.dev/) · [Mitwirken](CONTRIBUTING.md) · [So funktioniert die Prüfung](docs/moderation-policy.md) · [Entwicklungsleitfaden](docs/development.md) · [Roadmap](https://github.com/Ker102/opencoast/issues)

Neu beim Projekt? Lies, [wofür OpenCoast gedacht ist](https://opencoast.kaelux.dev/about), [wie du die Karte nutzt und Beiträge einreichst](https://opencoast.kaelux.dev/how-it-works) und [was die Belegkennzeichnungen bedeuten](https://opencoast.kaelux.dev/evidence). Diese öffentlichen Seiten sind ohne JavaScript lesbar. [Einrichtung und Prüfung der Auffindbarkeit](docs/discovery.md) behandelt kanonische URLs, Sitemap und Crawler-Richtlinie. [Animationsentwürfe und Aufnahmeleitfaden](../../../tools/motion/README.md) erläutert die bearbeitbaren Projektvideos.

[![CI](https://github.com/Ker102/opencoast/actions/workflows/ci.yml/badge.svg)](https://github.com/Ker102/opencoast/actions/workflows/ci.yml) · [Codelizenz: MIT](../../../LICENSE)

> **Projekt in einem frühen Stadium.** Die Karte unterstützt weltweite Navigation und Einreichungen; geprüfte Informationen wachsen Ort für Ort. Eine unmarkierte Küste bedeutet **noch keine geprüften Zugangsinformationen**. Sie bedeutet niemals, dass Zugang verboten oder garantiert ist.

<a id="why-opencoast-exists"></a>

## Warum es OpenCoast gibt

Ein Strand auf einer Karte beantwortet mehrere Fragen nicht: Welcher Zugang ist erlaubt? Welche Bedingungen gelten? Gibt es einen geprüften Weg dorthin? Welche Quellen stützen die Informationen, und wann wurden sie überprüft?

OpenCoast führt diese Fragen in einer Karte zusammen. Jeder Datensatz verbindet einen konkreten Ort mit Beschreibung, Rechtsgebiet, Zugangsstatus, Belegkennzeichnung und Prüfverlauf. Das Projekt hilft Anwohnern, Küstenbesuchern, gemeinschaftlichen Kartierenden, Quellenrecherchierenden und Entwicklern gemeinwohlorientierter Kartenwerkzeuge.

OpenCoast wurde von **[Kristofer Jussmann (Ker102)](https://github.com/Ker102)** gegründet und entstand aus Bedenken zum Küstenzugang in Montenegro. Sein Umfang ist global; die [ersten Montenegro-Datensätze](https://github.com/Ker102/opencoast/issues/5) sind ein Vorhaben zur Quellenprüfung, keine vorab geladenen rechtlichen Schlussfolgerungen.

<a id="anonymous-by-default"></a>

## Standardmäßig anonym

OpenCoast möchte Küstenzugangsinformationen zugänglich machen, ohne dass Menschen sich identifizieren müssen. Du kannst die Karte ansehen, einen Ort einreichen, eine Korrektur vorschlagen und die Prüfung verfolgen, ohne Konto, Anmeldung, Namen oder E-Mail-Adresse. Bewahre deinen privaten Eingangslink auf, um den Fortschritt zu prüfen und Fragen der Moderatoren zu beantworten.

Originale Beleg-Uploads sind nur für Moderatoren zugänglich. Nur separat genehmigte Bilder mit Einwilligung zur Veröffentlichung können öffentlich erscheinen. Vermeide persönliche Angaben in Beschreibungen oder Belegen, die du veröffentlichen möchtest. Moderationswerkzeuge erfordern eine eigene Anmeldung.

<a id="what-can-you-map"></a>

## Was lässt sich kartieren?

| Datensatztyp | Was er beschreibt | Warum er getrennt ist |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Zugangsgebiet** | Einen Strand, Gezeitenbereich oder ein anderes abgegrenztes Küstengebiet | Bedingungen können für ein bestimmtes Gebiet statt für die gesamte Küste gelten. |
| **Weg zum Ufer** | Einen Pfad, Eingangsweg oder Küstenweg | Der Zugangsstatus eines Gebiets begründet keine Erlaubnis, die dorthin führenden Grundstücke zu überqueren. |
| **Zugangspunkt** | Einen Eingang, ein Tor, Schild oder einen anderen relevanten Ort | Ein genauer Punkt kann erklären, wo eine Zugangsbedingung oder Beobachtung gilt. |

Datensätze können örtliche Kategorien, erlaubte Aktivitäten, Bedingungen, Quellenlinks und Beobachtungen enthalten. Ein gepachteter Strand oder eine Konzession lässt sich mit konkreten Bedingungen und Belegen beschreiben; OpenCoast nimmt nicht an, dass eine einzige Kennzeichnung alle Rechte an einem Ort bestimmt.

<a id="what-works-now"></a>

## Was bereits funktioniert

- **Eine responsive Weltkarte:** im Desktop- oder Mobilbrowser erkunden, mit einer von OpenFreeMap bereitgestellten, auf OpenStreetMap basierenden Grundkarte.
- **Eine Geländeansicht Focus:** neutrale Landfarben und Reliefschattierung halten die Küstenlinie lesbar und heben geprüfte Zugangsgebiete, Wege und Punkte hervor.
- **Präzise Zeichenwerkzeuge:** Punkte, Linien und Polygone zeichnen und bearbeiten, Stützpunkte anpassen, Änderungen rückgängig machen und die Geometrie vor dem Einreichen prüfen.
- **Anonyme Beiträge:** Informationen oder Korrekturen ohne Konto einreichen. Einen privaten Eingangslink speichern, um die Prüfung zu verfolgen und Moderatorenfragen zu beantworten.
- **Belege und Daten:** Datensätze unterscheiden Zugangsstatus und Belegstärke und zeigen Bearbeitungsdaten getrennt von Quellenprüfungsdaten.
- **Moderierte Veröffentlichung:** Moderatoren können Rückfragen stellen, Formulierungen mit einem dokumentierten Prüfgrund ändern, Vorschläge genehmigen oder ablehnen und private Belege einsehen. Veröffentlichte Datensätze haben Revisionsverläufe.
- **Geprüfte Gebiets-Wege-Verknüpfungen:** Moderatoren können ein Küstengebiet mit getrennten Datensätzen für Zuwege verknüpfen. Eine Kennzeichnung als verifizierter Landweg hängt von der aktuellen Sichtbarkeit, Beleglage und dem Zugangsstatus des verknüpften Wegs ab.

<a id="how-to-read-coastal-access-information"></a>

## Küstenzugangsinformationen richtig lesen

<a id="access-status"></a>

### Zugangsstatus

| Status | Bedeutung in OpenCoast |
| --------------- | --------------------------------------------------------------------------- |
| **Erlaubt** | Die geprüfte Aussage beschreibt den Zugang innerhalb des Datensatzumfangs als erlaubt. |
| **Bedingt** | Der Datensatz beschreibt Zugang mit den genannten Einschränkungen oder Bedingungen. |
| **Eingeschränkt** | Der Datensatz beschreibt eine Zugangsbeschränkung. |
| **Umstritten** | Die Aussage wird bestritten oder glaubwürdige Belege widersprechen sich. |
| **Unbekannt** | Die verfügbaren Informationen belegen die geltende Zugangsregel nicht. |

Lies Beschreibung und Bedingungen gemeinsam mit dem Status. Eine Zugangskennzeichnung ist eine geprüfte Aussage mit festgelegtem Umfang, keine Garantie für jede Aktivität oder jeden Zeitpunkt.

<a id="evidence-strength"></a>

### Belegstärke

**Durch Dokumente belegt** bedeutet, dass ein Moderator mindestens eine verknüpfte amtliche Quelle anhand der Aussage und Geometrie geprüft hat. Die Erklärung sollte benennen, was die Quelle stützt und welche Unsicherheit verbleibt.

**Gemeinschaftlich geprüft, keine amtliche Quelle verifiziert** bedeutet, dass ein Moderator die Anzeige ohne Verifizierung einer amtlichen Quelle genehmigt hat. Diese Datensätze tragen eine sichtbare Kennzeichnung; sie dürfen nicht als rechtlich verifizierte Zugangsrechte verstanden werden.

Handgezeichnete Grenzen werden als ungefähr gekennzeichnet. Ein Bearbeitungsdatum bedeutet keine neue Prüfung rechtlicher Quellen. Den vollständigen Prüfstandard findest du in der [Moderationsrichtlinie](docs/moderation-policy.md).

<a id="contribute-beach-access-information"></a>

## Strandzugangsinformationen beitragen

1. **Finde den Ort** in der [Live-Karte](https://opencoast.kaelux.dev/). Verschiebe und zoome die Karte oder gib `latitude, longitude` ein; die Ortsnamensuche ist [geplant](https://github.com/Ker102/opencoast/issues/6).
2. **Wähle Add information** und zeichne ein Gebiet, einen Weg oder einen Punkt. Auch für bestehende Datensätze lassen sich Korrekturen vorschlagen.
3. **Beschreibe die Aussage:** mit Rechtsgebiet, gegebenenfalls örtlicher Kategorie, Bedingungen und dem, was du beobachtet oder gelesen hast.
4. **Füge Quellen und Belege hinzu.** Amtliche Dokumente und direkte Links werden ausdrücklich empfohlen, sind aber optional. Originale sind nur für Moderatoren zugänglich; nur separat genehmigte Bilder mit Veröffentlichungseinwilligung können öffentlich erscheinen.
5. **Speichere den privaten Eingangslink.** Ein Moderator prüft den Vorschlag und kann vor der Veröffentlichung Rückfragen stellen.

Berichte zum Küstenzugang gehören in den Prüfablauf der Anwendung. Nutze GitHub-Issues für Softwarefehler, Dokumentation und Funktionsvorschläge. Beide Wege erläutert der [Beitragsleitfaden](CONTRIBUTING.md).

<a id="frequently-asked-questions"></a>

## Häufige Fragen

<a id="is-opencoast-a-worldwide-database-of-legally-verified-public-beaches"></a>

### Ist OpenCoast eine weltweite Datenbank rechtlich verifizierter öffentlicher Strände?

OpenCoast unterstützt eine Weltkarte und Beiträge aus unterschiedlichen Rechtsgebieten. Die Abdeckung hängt von eingereichten und geprüften Datensätzen ab; manche veröffentlichten Datensätze haben keine verifizierte amtliche Quelle. Es ist ein Informationsprojekt im frühen Stadium, keine vollständige Rechtsdatenbank oder rechtliche Autorität.

<a id="does-a-blank-map-mean-a-beach-is-private-or-closed"></a>

### Bedeutet eine leere Karte, dass ein Strand privat oder geschlossen ist?

Nein. Dort werden keine geprüften Zugangsinformationen angezeigt. Parks, Straßen, Strände und Landfarben der Grundkarte sind geografischer Kontext, keine Zugangsaussagen von OpenCoast.

<a id="can-i-submit-without-an-account-or-an-official-document"></a>

### Kann ich ohne Konto oder amtliches Dokument etwas einreichen?

Ja. Öffentliche Einreichungen erfordern kein Konto; amtliche Quellen werden empfohlen, sind aber nicht verpflichtend. Jede Einreichung benötigt weiterhin eine Moderatorenprüfung. Wurde keine amtliche Quelle verifiziert, steht das im veröffentlichten Datensatz.

<a id="how-is-a-public-beach-connected-to-its-access-route"></a>

### Wie wird ein öffentlicher Strand mit seinem Zugangsweg verbunden?

Strandgebiet und Weg werden als getrennte Datensätze geprüft. Ein Moderator muss sie nach Prüfung der Geometrie und Quellen ausdrücklich verknüpfen. OpenCoast leitet keinen Zugangsweg daraus ab, dass eine nahe Straße oder ein Pfad den Strand scheinbar erreicht.

<a id="does-submitting-to-opencoast-edit-openstreetmap"></a>

### Ändert eine Einreichung bei OpenCoast OpenStreetMap?

Nein. OpenCoast speichert seine geprüften Zugangsdatensätze in einer eigenen Datenbank. OpenFreeMap liefert die auf OpenStreetMap basierende Hintergrundkarte. Einreichungen hier werden nicht automatisch in OpenStreetMap geschrieben.

<a id="is-the-coastal-access-data-open-data"></a>

### Sind die Küstenzugangsdaten offene Daten?

Die Software ist unter der MIT-Lizenz quelloffen. Genehmigte Datensätze der gehosteten Datenbank haben noch keine Open-Data-Lizenz; hole vor ihrer Weiterverbreitung eine Erlaubnis ein. Private Belege und Quellenmaterial Dritter unterliegen eigenen Rechten. Siehe [Lizenzierung und Attribution](#licensing-and-attribution).

<a id="can-i-use-opencoast-on-my-phone"></a>

### Kann ich OpenCoast auf meinem Telefon nutzen?

Ja, über die responsive Weboberfläche. Das Zeichnen ist für Touch- und Desktop-Eingaben ausgelegt. Es gibt noch keine native Mobilapp, und [Tests auf echten Geräten sowie Barrierefreiheitsprüfung](https://github.com/Ker102/opencoast/issues/4) sind weiterhin in Arbeit.

<a id="help-build-opencoast"></a>

## OpenCoast mitentwickeln

Beiträge helfen in mehreren Bereichen:

- **Ortskenntnis und Quellenrecherche:** sorgfältig abgegrenzte Datensätze und Korrekturen über die Karte einreichen. Relevante Bestimmungen, Quelldaten und Unsicherheiten angeben.
- **Kartierung und Nutzererfahrung:** Zeichnen, Navigation, lesbare Legenden, Tastaturzugang und Touch-Interaktion verbessern.
- **Software und Infrastruktur:** bei räumlichen Abfragen, Moderationswerkzeugen, Belegverarbeitung, Tests und zuverlässiger Bereitstellung helfen.
- **Dokumentation:** Erklärungen und den Einstieg für Entwickler verbessern. Übersetzungen und Lokalisierungsvorschläge sind willkommen.

Lies [CONTRIBUTING.md](CONTRIBUTING.md), sieh dir [offene Issues](https://github.com/Ker102/opencoast/issues) an oder [schlage eine Verbesserung vor](https://github.com/Ker102/opencoast/issues/new/choose). Melde Sicherheitsbedenken über [private Schwachstellenmeldungen](https://github.com/Ker102/opencoast/security/advisories/new).

<a id="technology-and-repository-structure"></a>

## Technologie und Repository-Struktur

| Ebene | Implementierung | Ort |
| -------------------- | ------------------------------------------------------ | -------------------- |
| Weboberfläche | React, TypeScript, Vite, MapLibre GL JS, Terra Draw | [`web/`](../../../web/) |
| API und Moderation | Fastify, TypeScript, private Belegverarbeitung | [`api/`](../../../api/) |
| Datenverträge | Zod-Schemas und GeoJSON-Typen | [`shared/`](../../../shared/) |
| Räumlicher Speicher | PostgreSQL und PostGIS; gehostet auf Supabase | [`api/db/`](../../../api/db/) |
| Hosting und Belege | Vercel-Web/API-Projekte; privater Cloudflare-R2-Speicher | [`infra/`](../../../infra/) |

<a id="run-locally"></a>

### Lokal ausführen

Die aktuelle CI verwendet Node.js 24. Installiere Node.js 24+, npm und Docker, dann:

```sh
git clone https://github.com/Ker102/opencoast.git
cd opencoast
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Öffne `http://localhost:5173`. Lokale Datenbanken starten ohne Datensätze mit Zugangsaussagen. Der [Entwicklungsleitfaden](docs/development.md#run-locally) behandelt Umgebungswerte, Ports, lokale Uploads und das Anlegen eines Moderatorkontos.

<a id="checks"></a>

### Prüfungen

Siehe [Validierungsbefehle und den isolierten Datenbankintegrationstest](docs/development.md#checks).

<a id="hosted-deployment"></a>

### Gehostete Bereitstellung

Siehe [Konfiguration von Vercel, Supabase/PostGIS und privatem Cloudflare R2](docs/development.md#hosted-deployment).

<a id="current-release-limits"></a>

## Grenzen der aktuellen Version

Die aktuelle Implementierung unterstützt geprüfte Veröffentlichung, aber vor breiter Bewerbung bleiben Aufgaben: [Härtung von Uploads und Missbrauchsschutz](https://github.com/Ker102/opencoast/issues/3), [Touch- und Barrierefreiheitstests auf echten Geräten](https://github.com/Ker102/opencoast/issues/4), [unabhängige Quellenprüfung der ersten Montenegro-Datensätze](https://github.com/Ker102/opencoast/issues/5) und [Ortsnamensuche](https://github.com/Ker102/opencoast/issues/6).

Kein für ein ganzes Rechtsgebiet geltendes Gesetz wird automatisch auf Strände angewandt. Eine gemeldete Behinderung und ein dokumentiertes rechtliches Zugangsrecht sind getrennte Aussagen. OpenCoast-Datensätze erklären die geprüften Belege; sie ersetzen keine Quelldokumente und legen keine rechtlichen Grenzen fest.

Siehe [Projektentwurf](../../../docs/plans/2026-09-24-opencoast-design.md) und [Fortschrittsübersicht](../../../task.md). Bilder in `docs/design-reference` sind visuelle Konzepte mit erfundenen Beispielaussagen, keine Kartendaten.

<a id="licensing-and-attribution"></a>

## Lizenzierung und Attribution

- **Software:** [MIT](../../../LICENSE), erlaubt Nutzung, Änderung und Weiterverbreitung gemäß ihren Bedingungen.
- **Gehostete Zugangsdatensätze:** vom Betreiber kontrolliert, noch ohne Open-Data-Lizenz. Besprich Wiederverwendung mit dem [Maintainer](https://github.com/Ker102).
- **Belege und Quelldokumente:** behalten ihre eigenen Rechte und Veröffentlichungsbeschränkungen. Hochgeladene Originale sind privat.
- **Grundkarte und Gelände:** die Attribution für [OpenStreetMap](https://www.openstreetmap.org/copyright), [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://www.openmaptiles.org/) und [Mapterhorn](https://mapterhorn.com/attribution) bleibt je nach Verwendung auf der Karte sichtbar.

Verlinke für Artikel, Forschung oder Softwarewiederverwendung auf [OpenCoast auf GitHub](https://github.com/Ker102/opencoast) und nutze [CITATION.cff](../../../CITATION.cff) für Angaben zur Softwarezitation. Die Zitation der Software verifiziert keine bestimmte Küstenzugangsaussage.

Projektübersicht zuletzt geprüft: **2026-10-06**.
