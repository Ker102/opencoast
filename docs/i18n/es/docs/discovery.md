<a id="search-and-ai-discovery"></a>

# Descubrimiento en buscadores e IA

Sitio canónico: [opencoast.kaelux.dev](https://opencoast.kaelux.dev). Los cambios de producción se desplegaron el 10 de octubre de 2026 en el proyecto web existente de Vercel. El mapa, el proxy de API y las páginas de información pública se comprobaron en el dominio personalizado.

<a id="public-information"></a>

## Información pública

- [Acerca de](https://opencoast.kaelux.dev/about): propósito, cobertura, anonimato, autoría, código fuente y atribución del mapa base.
- [Cómo funciona](https://opencoast.kaelux.dev/how-it-works): consulta, dibujo, fuentes, seguimiento privado y moderación.
- [Evidencia](https://opencoast.kaelux.dev/evidence): estados de acceso, verificación documental, revisión comunitaria, fechas y límites.

Son páginas HTML estáticas y legibles. La página inicial también incluye HTML útil antes de cargar JavaScript y una explicación sin JavaScript. El mapa interactivo enlaza las tres páginas. No se inventaron registros jurídicos ni afirmaciones de cobertura para el contenido de búsqueda.

`web/scripts/generate-discovery.mjs` es la fuente del texto de las páginas, URL canónicas, descripciones, metadatos Open Graph y Twitter, datos estructurados WebSite/WebPage/SoftwareApplication, sitemap.xml, robots.txt y llms.txt. La fase prebuild de web los regenera de forma determinista. Actualiza la fecha del contenido cuando cambie el contenido subyacente. El estilo público compartido está en `web/public/discovery.css`; los estilos existentes de la aplicación siguen separados. La imagen para redes sociales se genera a partir de la identidad existente mediante `tools/motion/render.cjs social`.

<a id="routing-and-indexing"></a>

## Enrutamiento e indexación

El antiguo host `opencoast-web.vercel.app` redirige permanentemente al dominio personalizado. Las páginas de información pública tienen sus propias URL canónicas. Las rutas no compatibles devuelven HTTP 404 en lugar de la estructura de la aplicación del mapa. El proxy de API sigue reenviando al proyecto API existente.

El mapa del sitio solo enumera las cuatro páginas canónicas públicas. Las páginas de contribución, moderación y seguimiento privado devuelven cabeceras X-Robots-Tag noindex. Las rutas de API y flujos privados quedan excluidas del descubrimiento por rastreadores. Estos controles son independientes de la autenticación de la aplicación; robots.txt no es una barrera de privacidad. Los enlaces de seguimiento y las pruebas originales siguen protegidos por los controles de acceso existentes.

La política general de rastreo permite páginas públicas. OpenAI documenta que OAI-SearchBot controla el descubrimiento para búsqueda y es independiente del uso de GPTBot para entrenamiento. En este cambio no se eligió ninguna nueva política de exclusión del entrenamiento. Consulta la [documentación oficial de rastreadores de OpenAI](https://developers.openai.com/api/docs/bots). `llms.txt` es una ayuda de lectura breve y opcional; no garantiza indexación ni posicionamiento.

<a id="what-remains-outside-code"></a>

## Qué queda fuera del código

Los buscadores deciden cuándo rastrear, indexar y citar una página. Esta implementación no demuestra que OpenCoast esté indexado o posicionado. El propietario puede verificar el dominio en Google Search Console y Bing Webmaster Tools y enviar `https://opencoast.kaelux.dev/sitemap.xml`. Enlaza al sitio canónico desde el repositorio GitHub y artículos auténticos del proyecto. Mantén actualizadas las explicaciones públicas y la información local aprobada a medida que crezca la cobertura.

El contenido sigue el énfasis de Google en información útil y original para lectores. Explica las pruebas y la incertidumbre sin inventar afirmaciones jurídicas, reseñas ni valoraciones. Consulta la [guía de contenido útil de Google](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). El enrutamiento de Vercel utiliza su [configuración documentada](https://vercel.com/docs/project-configuration/vercel-json).

<a id="verification-on-10-october"></a>

## Verificación del 10 de octubre

- Pasaron la compilación web de producción, la comprobación de tipos y el formato del código fuente.
- Suite unitaria: pasaron 7 pruebas. Se omitieron dos pruebas de integración de base de datos porque no se habilitó su ejecución explícita con una base de prueba; no se usaron datos de producción para pruebas.
- Las páginas públicas, archivos para rastreadores e imagen para compartir devolvieron HTTP 200 con los tipos de contenido esperados.
- Las páginas de flujos privados devolvieron cabeceras noindex; una ruta desconocida devolvió 404; el host antiguo devolvió una redirección 308 al dominio personalizado.
- En escritorio a 1280px y móvil a 390px no hubo desbordamiento horizontal; los encabezados, etiquetas canónicas y JSON-LD se analizaron correctamente. La página inicial era legible con JavaScript desactivado.
- Se inspeccionaron y decodificaron completamente los vídeos exportados sin errores de FFmpeg; cada uno dura 40 segundos, con 1280 × 720, 30 fps y sin audio.

Los comprobantes y capturas locales están en la carpeta ignorada `artifacts/`. ID de despliegue: `dpl_7T2D8sR3wagtzm3CWHUiDVtGJfZR`.

La auditoría de dependencias existente del despliegue informó de cuatro avisos: concurrently/shell-quote (herramientas de desarrollo), sharp (procesamiento de imágenes en la API) y source-map-js. Este cambio de descubrimiento no añadió dependencias a la aplicación ni afirma haber solucionado esos avisos. La auditoría guardada está en `artifacts/dependency-audit.json`; la corrección de dependencias debe incluir la API y sus comprobaciones de procesamiento de pruebas.
