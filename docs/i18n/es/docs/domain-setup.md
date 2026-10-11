<a id="opencoast-custom-domain"></a>

# Dominio personalizado de OpenCoast

`opencoast.kaelux.dev` está asignado al proyecto de Vercel `opencoast-web`. La resolución DNS, HTTPS y la respuesta de salud de la API del mismo origen se verificaron el 10 de octubre de 2026. El despliegue web actual tiene este nombre de host como alias. El antiguo nombre de host de Vercel ahora redirige al dominio personalizado.

<a id="dns-record"></a>

## Registro DNS

El registro existente en la zona DNS de `kaelux.dev` es:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| CNAME | `opencoast` | `d33e801daf5fd3d2.vercel-dns-017.com` |

Este es el destino específico del proyecto devuelto por el comando de verificación de dominio de Vercel el 5 de octubre de 2026. Mantén los servidores de nombres existentes. El mismo nombre de host no debe tener registros A, AAAA u otros CNAME en conflicto.

El primer intento de alias falló antes de configurar DNS. Ya está resuelto: el mapa público y `https://opencoast.kaelux.dev/api/health` responden por HTTPS. Sigue usando el nombre de host personalizado para enlaces compartidos y sesiones del navegador.

<a id="application-origins"></a>

## Orígenes de la aplicación

Durante la transición, el valor de producción de `WEB_ORIGIN` de la API es:

```text
https://opencoast.kaelux.dev,https://opencoast-web.vercel.app
```

La API solo acepta los orígenes exactos de esta lista para CORS y mutaciones de moderadores. El bucket privado R2 también permite cargas PUT firmadas con `Content-Type` desde ambos orígenes, como se registra en `infra/r2-cors.json`.

El proyecto API y el proxy `/api` del proyecto web mantienen sus direcciones existentes. Las sesiones de moderación están vinculadas al nombre de host del navegador, por lo que los moderadores deben iniciar sesión de nuevo al pasar al dominio personalizado.
