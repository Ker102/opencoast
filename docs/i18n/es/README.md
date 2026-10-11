<img src="../../../web/public/favicon.svg" width="56" height="56" alt="Logotipo costero de OpenCoast">

<a id="opencoast--open-source-coastal-access-map"></a>

# OpenCoast — Mapa de acceso costero de código abierto

[English](../../../README.md) · [Español](README.md) · [简体中文](../zh-CN/README.md) · [Français](../fr/README.md) · [日本語](../ja/README.md) · [Deutsch](../de/README.md) · [Português (Brasil)](../pt-BR/README.md)

<!-- translation-notice -->
Traducción de la documentación inglesa; el original en inglés es la fuente autorizada.
<!-- /translation-notice -->

**Derechos de acceso a las playas, rutas hasta la costa y las pruebas que los respaldan.**

**Sin cuenta. Sin iniciar sesión. Consulta y contribuye de forma anónima.**

OpenCoast es una aplicación web de código abierto para cartografiar información revisada por la comunidad sobre **el acceso público a las playas y los derechos de acceso costero**. Se pueden dibujar zonas costeras, caminos hasta la costa y puntos de acceso; añadir descripciones, condiciones locales y fuentes; y enviarlos anónimamente. Los moderadores revisan cada propuesta antes de que aparezca en el mapa público.

[Explorar el mapa](https://opencoast.kaelux.dev/) · [Contribuir](CONTRIBUTING.md) · [Cómo funciona la revisión](docs/moderation-policy.md) · [Guía de desarrollo](docs/development.md) · [Hoja de ruta](https://github.com/Ker102/opencoast/issues)

¿Acabas de conocer el proyecto? Lee [para qué sirve OpenCoast](https://opencoast.kaelux.dev/about), [cómo usar el mapa y contribuir](https://opencoast.kaelux.dev/how-it-works) y [qué significan sus etiquetas de evidencia](https://opencoast.kaelux.dev/evidence). Estas páginas públicas se pueden leer sin JavaScript. [Configuración y verificación del descubrimiento](docs/discovery.md) trata las URL canónicas del sitio, el mapa del sitio y la política para rastreadores. [Borradores de animación y guía de grabación](../../../tools/motion/README.md) explica los vídeos editables del proyecto.

[![CI](https://github.com/Ker102/opencoast/actions/workflows/ci.yml/badge.svg)](https://github.com/Ker102/opencoast/actions/workflows/ci.yml) · [Licencia del código: MIT](../../../LICENSE)

> **Proyecto en fase inicial.** El mapa permite navegar y enviar propuestas en todo el mundo; la información revisada crece lugar por lugar. Una costa sin marcar significa **que todavía no hay información de acceso revisada**. Nunca significa que el acceso esté prohibido o garantizado.

<a id="why-opencoast-exists"></a>

## Por qué existe OpenCoast

Encontrar una playa en un mapa deja varias preguntas sin respuesta: ¿Qué acceso está permitido? ¿Qué condiciones se aplican? ¿Hay una ruta revisada para llegar? ¿Qué fuentes respaldan esa información y cuándo se comprobaron?

OpenCoast reúne estas preguntas en un único mapa. Cada registro vincula una ubicación concreta con una descripción, jurisdicción, estado de acceso, etiqueta de evidencia e historial de revisión. El proyecto resulta útil para residentes, visitantes de la costa, cartógrafos comunitarios, investigadores de fuentes y desarrolladores de herramientas cartográficas de interés público.

Creado por **[Kristofer Jussmann (Ker102)](https://github.com/Ker102)**, OpenCoast nació de inquietudes sobre el acceso costero en Montenegro. Su alcance es mundial; los [primeros registros de Montenegro](https://github.com/Ker102/opencoast/issues/5) son un trabajo de revisión de fuentes, no un conjunto precargado de conclusiones jurídicas.

<a id="anonymous-by-default"></a>

## Anónimo por defecto

OpenCoast pretende ofrecer información de acceso costero sin obligar a las personas a identificarse. Puedes consultar el mapa, enviar una ubicación, proponer una corrección y seguir la revisión sin cuenta, inicio de sesión, nombre ni correo electrónico. Conserva tu enlace privado de seguimiento para consultar el progreso y responder a las preguntas de los moderadores.

Los archivos de evidencia originales solo están disponibles para los moderadores. Únicamente pueden mostrarse públicamente imágenes aprobadas por separado y con consentimiento de publicación. Evita incluir datos personales en descripciones o pruebas que quieras publicar. Las herramientas de moderación requieren un inicio de sesión independiente.

<a id="what-can-you-map"></a>

## ¿Qué puedes cartografiar?

| Tipo de registro | Qué describe | Por qué es independiente |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Zona de acceso** | Una playa, franja intermareal u otra zona costera delimitada | Las condiciones pueden aplicarse a una zona concreta y no a toda la costa. |
| **Ruta hasta la costa** | Un camino, una ruta de entrada o una vía costera | El estado de acceso de una zona no establece permiso para cruzar los terrenos que llevan a ella. |
| **Punto de acceso** | Una entrada, puerta, señal u otra ubicación relevante | Un punto preciso puede explicar dónde se aplica una condición de acceso o una observación. |

Los registros pueden incluir categorías locales, actividades permitidas, condiciones, enlaces a fuentes y observaciones. Una playa arrendada o una concesión puede describirse con sus condiciones y pruebas específicas; OpenCoast no supone que una sola etiqueta determine todos los derechos en ese lugar.

<a id="what-works-now"></a>

## Qué funciona actualmente

- **Un mapa mundial adaptable:** consulta desde un navegador de escritorio o móvil, con un mapa base derivado de OpenStreetMap proporcionado por OpenFreeMap.
- **Una vista Focus del terreno:** los colores neutros del suelo y el sombreado del relieve mantienen legible la costa mientras destacan las zonas, rutas y puntos de acceso revisados.
- **Herramientas de dibujo precisas:** dibuja y edita puntos, líneas y polígonos, ajusta vértices, deshaz cambios y revisa la geometría antes de enviarla.
- **Contribuciones anónimas:** envía información o correcciones sin crear una cuenta. Guarda un enlace privado de seguimiento para seguir la revisión y responder a los moderadores.
- **Evidencia y fechas:** los registros distinguen el estado de acceso de la solidez de la evidencia y muestran las fechas de edición por separado de las fechas de revisión de fuentes.
- **Publicación moderada:** los moderadores pueden pedir aclaraciones, editar la redacción con un motivo de auditoría, aprobar o rechazar propuestas e inspeccionar pruebas privadas. Los registros publicados tienen historial de revisiones.
- **Vínculos revisados entre zonas y rutas:** los moderadores pueden vincular una zona costera con registros independientes de rutas de aproximación. Una etiqueta de ruta terrestre verificada depende de la visibilidad, evidencia y estado de acceso actuales de la ruta vinculada.

<a id="how-to-read-coastal-access-information"></a>

## Cómo interpretar la información de acceso costero

<a id="access-status"></a>

### Estado de acceso

| Estado | Significado en OpenCoast |
| --------------- | --------------------------------------------------------------------------- |
| **Permitido** | La afirmación revisada describe el acceso como permitido dentro del alcance del registro. |
| **Condicionado** | El registro describe un acceso sujeto a límites o condiciones indicados. |
| **Restringido** | El registro describe una restricción de acceso. |
| **En disputa** | La afirmación está cuestionada o existen pruebas creíbles contradictorias. |
| **Desconocido** | La información disponible no establece la norma de acceso aplicable. |

Lee la descripción y las condiciones junto con el estado. Una etiqueta de acceso es una afirmación revisada con un alcance definido, no una garantía para cualquier actividad o fecha.

<a id="evidence-strength"></a>

### Solidez de la evidencia

**Respaldado por documentos** significa que un moderador comprobó al menos una fuente oficial enlazada frente a la afirmación y la geometría. La explicación debe indicar qué respalda la fuente y cualquier incertidumbre restante.

**Revisado por la comunidad, sin fuente oficial verificada** significa que un moderador aprobó mostrar la información sin verificar una fuente oficial. Estos registros llevan una etiqueta visible; no deben interpretarse como derechos de acceso verificados jurídicamente.

Los límites dibujados a mano se etiquetan como aproximados. Una fecha de edición no implica una nueva revisión de fuentes jurídicas. Consulta la [política de moderación](docs/moderation-policy.md) para conocer el estándar completo de revisión.

<a id="contribute-beach-access-information"></a>

## Contribuir información sobre el acceso a playas

1. **Encuentra la ubicación** en el [mapa en línea](https://opencoast.kaelux.dev/). Desplázate y amplía, o introduce `latitude, longitude`; la búsqueda por nombre de lugar está [prevista](https://github.com/Ker102/opencoast/issues/6).
2. **Elige Add information** y dibuja una zona, ruta o punto. Los registros existentes también admiten propuestas de corrección.
3. **Describe la afirmación:** incluye la jurisdicción, una categoría local cuando sea útil, las condiciones y lo que observaste o leíste.
4. **Añade fuentes y pruebas.** Se recomiendan especialmente documentos oficiales y enlaces directos, pero son opcionales. Los archivos originales solo están disponibles para los moderadores; únicamente pueden mostrarse imágenes aprobadas por separado y con consentimiento de publicación.
5. **Guarda el enlace privado de seguimiento.** Un moderador revisará la propuesta y podrá pedir aclaraciones antes de publicarla.

Los informes de acceso costero corresponden al flujo de revisión de la aplicación. Usa los issues de GitHub para errores de software, documentación y propuestas de funcionalidades. Consulta la [guía de contribución](CONTRIBUTING.md) para ambas vías.

<a id="frequently-asked-questions"></a>

## Preguntas frecuentes

<a id="is-opencoast-a-worldwide-database-of-legally-verified-public-beaches"></a>

### ¿Es OpenCoast una base mundial de playas públicas verificadas jurídicamente?

OpenCoast ofrece un mapa mundial y contribuciones de distintas jurisdicciones. La cobertura depende de los registros enviados y revisados, y algunos registros publicados no tienen una fuente oficial verificada. Es un proyecto de información en fase inicial, no una base jurídica completa ni una autoridad legal.

<a id="does-a-blank-map-mean-a-beach-is-private-or-closed"></a>

### ¿Un mapa vacío significa que una playa es privada o está cerrada?

No. Significa que allí no se muestra información de acceso revisada. Los parques, caminos, playas y colores del suelo del mapa base son contexto geográfico; no son afirmaciones de acceso de OpenCoast.

<a id="can-i-submit-without-an-account-or-an-official-document"></a>

### ¿Puedo enviar información sin cuenta ni documento oficial?

Sí. Los envíos públicos no requieren cuenta, y las fuentes oficiales se recomiendan, pero no son obligatorias. Cada envío sigue necesitando revisión de un moderador. Si no se ha verificado una fuente oficial, el registro publicado lo indica.

<a id="how-is-a-public-beach-connected-to-its-access-route"></a>

### ¿Cómo se conecta una playa pública con su ruta de acceso?

La zona de playa y la ruta se revisan como registros independientes. Un moderador debe vincularlas explícitamente tras comprobar la geometría y las fuentes. OpenCoast no deduce una ruta de acceso porque una carretera o camino cercano parezca llegar a la playa.

<a id="does-submitting-to-opencoast-edit-openstreetmap"></a>

### ¿Enviar información a OpenCoast modifica OpenStreetMap?

No. OpenCoast almacena sus registros de acceso revisados en su propia base de datos. OpenFreeMap proporciona el mapa de fondo derivado de OpenStreetMap. Los envíos realizados aquí no se escriben automáticamente en OpenStreetMap.

<a id="is-the-coastal-access-data-open-data"></a>

### ¿Los datos de acceso costero son datos abiertos?

El software es de código abierto bajo la licencia MIT. Los registros aprobados de la base alojada todavía no tienen una licencia de datos abiertos; obtén permiso antes de redistribuirlos. Las pruebas privadas y el material de fuentes de terceros tienen derechos independientes. Consulta [licencias y atribución](#licensing-and-attribution).

<a id="can-i-use-opencoast-on-my-phone"></a>

### ¿Puedo usar OpenCoast en mi teléfono?

Sí, mediante su interfaz web adaptable. El dibujo está diseñado tanto para interacción táctil como de escritorio. Todavía no existe una aplicación móvil nativa, y las [pruebas en dispositivos reales y la revisión de accesibilidad](https://github.com/Ker102/opencoast/issues/4) siguen en curso.

<a id="help-build-opencoast"></a>

## Ayuda a desarrollar OpenCoast

Las contribuciones son útiles en varias áreas:

- **Conocimiento local e investigación de fuentes:** envía registros y correcciones de alcance preciso mediante el mapa. Incluye disposiciones pertinentes, fechas de las fuentes e incertidumbre.
- **Cartografía y experiencia de usuario:** mejora el dibujo, la navegación, las leyendas legibles, el acceso por teclado y la interacción táctil.
- **Software e infraestructura:** ayuda con consultas geoespaciales, herramientas de moderación, gestión de pruebas, pruebas de software y fiabilidad de despliegue.
- **Documentación:** mejora las explicaciones y la incorporación de desarrolladores. Se aceptan traducciones y propuestas de localización.

Lee [CONTRIBUTING.md](CONTRIBUTING.md), consulta los [issues abiertos](https://github.com/Ker102/opencoast/issues) o [propón una mejora](https://github.com/Ker102/opencoast/issues/new/choose). Comunica problemas de seguridad mediante [informes privados de vulnerabilidades](https://github.com/Ker102/opencoast/security/advisories/new).

<a id="technology-and-repository-structure"></a>

## Tecnología y estructura del repositorio

| Capa | Implementación | Ubicación |
| -------------------- | ------------------------------------------------------ | -------------------- |
| Interfaz web | React, TypeScript, Vite, MapLibre GL JS, Terra Draw | [`web/`](../../../web/) |
| API y moderación | Fastify, TypeScript, gestión privada de pruebas | [`api/`](../../../api/) |
| Contratos de datos | Esquemas Zod y tipos GeoJSON | [`shared/`](../../../shared/) |
| Almacenamiento espacial | PostgreSQL y PostGIS; alojados en Supabase | [`api/db/`](../../../api/db/) |
| Alojamiento y pruebas | Proyectos web/API de Vercel; almacenamiento privado Cloudflare R2 | [`infra/`](../../../infra/) |

<a id="run-locally"></a>

### Ejecutar localmente

El CI actual utiliza Node.js 24. Instala Node.js 24+, npm y Docker; después:

```sh
git clone https://github.com/Ker102/opencoast.git
cd opencoast
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Abre `http://localhost:5173`. Las bases locales comienzan sin registros que afirmen derechos de acceso. La [guía de desarrollo](docs/development.md#run-locally) explica la configuración del entorno, los puertos, los archivos locales y la creación de una cuenta de moderador.

<a id="checks"></a>

### Comprobaciones

Consulta los [comandos de validación y la prueba de integración de base de datos aislada](docs/development.md#checks).

<a id="hosted-deployment"></a>

### Despliegue alojado

Consulta la [configuración de Vercel, Supabase/PostGIS y Cloudflare R2 privado](docs/development.md#hosted-deployment).

<a id="current-release-limits"></a>

## Limitaciones de la versión actual

La implementación actual permite la publicación revisada, pero quedan varias tareas antes de una promoción amplia: [refuerzo de cargas y controles contra abusos](https://github.com/Ker102/opencoast/issues/3), [pruebas táctiles en dispositivos reales y accesibilidad](https://github.com/Ker102/opencoast/issues/4), [revisión independiente de fuentes para los primeros registros de Montenegro](https://github.com/Ker102/opencoast/issues/5) y [búsqueda por nombre de lugar](https://github.com/Ker102/opencoast/issues/6).

Ninguna ley de alcance jurisdiccional se aplica automáticamente a las playas. Una obstrucción denunciada y un derecho legal documentado son afirmaciones diferentes. Los registros de OpenCoast explican las pruebas revisadas; no sustituyen los documentos originales ni establecen límites jurídicos.

Consulta el [diseño del proyecto](../../../docs/plans/2026-09-24-opencoast-design.md) y el [seguimiento de progreso](../../../task.md). Las imágenes de `docs/design-reference` son conceptos visuales con afirmaciones ficticias de ejemplo; no son datos del mapa.

<a id="licensing-and-attribution"></a>

## Licencias y atribución

- **Software:** [MIT](../../../LICENSE), que permite el uso, modificación y redistribución conforme a sus condiciones.
- **Registros de acceso alojados:** controlados por el operador, todavía sin licencia de datos abiertos. Consulta la reutilización con el [responsable del mantenimiento](https://github.com/Ker102).
- **Pruebas y documentos fuente:** conservan sus propios derechos y restricciones de publicación. Los originales subidos son privados.
- **Mapa base y terreno:** la atribución a [OpenStreetMap](https://www.openstreetmap.org/copyright), [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://www.openmaptiles.org/) y [Mapterhorn](https://mapterhorn.com/attribution) permanece visible en el mapa según corresponda.

Para artículos, investigación o reutilización del software, enlaza a [OpenCoast en GitHub](https://github.com/Ker102/opencoast) y usa [CITATION.cff](../../../CITATION.cff) para los datos de cita del software. Citar el software no verifica ninguna afirmación concreta de acceso costero.

Última revisión de la presentación del proyecto: **2026-10-06**.
