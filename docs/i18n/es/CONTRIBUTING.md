<a id="contributing-to-opencoast"></a>

# Contribuir a OpenCoast

Gracias por mejorar el mapa o el software. Mantén clara la distinción entre una observación comunicada, una norma jurídica citada y una conclusión revisada por un moderador.

<a id="choose-where-to-contribute"></a>

## Elige dónde contribuir

| Quieres ayudar con | Empieza aquí |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Una playa, zona costera, ruta, entrada o corrección | [Abre el mapa](https://opencoast-web.vercel.app/) y usa Add information o la acción de corrección del registro. |
| Fuentes oficiales y condiciones de acceso locales | Envía la fuente con la afirmación correspondiente del mapa; usa la [política de moderación](docs/moderation-policy.md) para entender su evaluación. |
| Un error de software o una funcionalidad | Busca en los [issues existentes](https://github.com/Ker102/opencoast/issues) y después [abre un issue](https://github.com/Ker102/opencoast/issues/new/choose). |
| Código, documentación o accesibilidad | Lee la [guía de desarrollo](docs/development.md) y los pasos para contribuir código que figuran a continuación. |
| Una vulnerabilidad de seguridad | Usa los [informes privados de vulnerabilidades](https://github.com/Ker102/opencoast/security/advisories/new). |

No necesitas una cuenta de GitHub para enviar información al mapa. GitHub se utiliza para contribuciones de desarrollo; el mapa tiene su propio flujo de revisión por moderadores.

<a id="map-information"></a>

## Información del mapa

Usa **Add information** en la aplicación para proponer una zona, ruta, punto o corrección. No se requiere cuenta. Incluye la geometría más exacta que puedas dibujar, la jurisdicción, lo que crees que está permitido, las condiciones relevantes y una descripción de lo que observaste o leíste. Se recomiendan especialmente documentos oficiales y enlaces directos, pero son opcionales. Un envío sin fuente oficial también puede revisarse, con una etiqueta visible que lo indique. Guarda el enlace privado de seguimiento para seguir la revisión y responder a los moderadores.

<a id="what-makes-a-useful-submission"></a>

### ¿Qué hace útil un envío?

- Identifica la ubicación y dibuja solo la zona, ruta o punto al que se refiere la afirmación.
- Indica el país o jurisdicción pertinente y cualquier categoría local, como una concesión o un sendero costero.
- Describe la actividad y las condiciones, fechas, límites estacionales o incertidumbre.
- Para un documento, incluye enlace directo, título, organismo emisor, fecha y, cuando estén disponibles, la disposición o página pertinentes. Explica qué parte de la afirmación respalda.
- Para una observación personal, describe qué viste y cuándo. Distingue la observación de una conclusión sobre derechos legales.
- Envía la ruta hasta la costa por separado de la zona costera a la que llega. Los moderadores revisan y vinculan esos registros explícitamente.

Se aceptan envíos de todo el mundo. Tras la moderación, un relato útil sin fuente oficial puede publicarse con la etiqueta de revisión comunitaria. Evita rellenar regiones extensas con suposiciones basadas únicamente en una regla general.

No incluyas nombres, rostros, teléfonos ni datos de contacto privados en descripciones o informes públicos de issues. Los originales subidos solo están disponibles para los moderadores; el consentimiento para publicar una imagen es opcional y no garantiza su publicación.

<a id="code-changes"></a>

## Cambios de código

1. Busca issues y pull requests existentes antes de empezar.
2. Abre un issue para una funcionalidad importante o un error, de modo que pueda debatirse el comportamiento previsto.
3. Crea una rama, realiza un cambio concreto, ejecuta las comprobaciones pertinentes de la [guía de desarrollo](docs/development.md#checks) y abre una pull request.
4. Describe qué cambió, por qué, qué probaste y cualquier implicación para la accesibilidad o privacidad.

El repositorio utiliza workspaces de npm: `shared` contiene los contratos de datos, `api` se encarga de la persistencia y la moderación, y `web` contiene la interfaz del mapa. Los endpoints públicos nunca deben revelar propuestas pendientes, tokens de seguimiento, pruebas originales, credenciales de moderadores ni la identidad de los colaboradores. Todo nuevo estado del mapa necesita una leyenda y una explicación detallada correspondientes.

Las fuentes jurídicas pueden tener restricciones de reutilización. Enlázalas y resúmelas con tus propias palabras; no pegues leyes enteras ni copies datos de otro mapa en este repositorio. La atribución a OpenStreetMap debe permanecer visible. No añadas afirmaciones de ejemplo sobre acceso costero a los datos iniciales de producción.

<a id="reporting-security-issues"></a>

## Comunicar problemas de seguridad

Usa los informes privados de vulnerabilidades de GitHub para problemas de seguridad, no un issue público. Incluye una reproducción mínima y evita publicar enlaces reales de seguimiento, archivos de evidencia o credenciales.
