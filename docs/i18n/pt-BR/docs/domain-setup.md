<a id="opencoast-custom-domain"></a>

# Domínio personalizado do OpenCoast

`opencoast.kaelux.dev` está atribuído ao projeto Vercel `opencoast-web`. A resolução DNS, HTTPS e a resposta de saúde da API na mesma origem foram verificados em 10 de outubro de 2026. A implantação web atual tem esse hostname como alias. O hostname antigo do Vercel agora redireciona para o domínio personalizado.

<a id="dns-record"></a>

## Registro DNS

O registro existente na zona DNS `kaelux.dev` é:

| Tipo | Nome | Valor |
| --- | --- | --- |
| CNAME | `opencoast` | `d33e801daf5fd3d2.vercel-dns-017.com` |

Esse é o destino específico do projeto retornado pelo comando de verificação de domínio do Vercel em 5 de outubro de 2026. Mantenha os nameservers existentes. O mesmo hostname não deve ter registros A, AAAA ou outros CNAME conflitantes.

A tentativa inicial de alias falhou antes da configuração DNS. Isso foi resolvido: o mapa público e `https://opencoast.kaelux.dev/api/health` respondem por HTTPS. Continue usando o hostname personalizado para links compartilhados e sessões do navegador.

<a id="application-origins"></a>

## Origens do aplicativo

Durante a transição, o valor de produção `WEB_ORIGIN` da API é:

```text
https://opencoast.kaelux.dev,https://opencoast-web.vercel.app
```

A API aceita somente origens exatas dessa lista para CORS e mutações de moderadores. O bucket privado R2 também permite uploads PUT assinados com `Content-Type` das duas origens, conforme registrado em `infra/r2-cors.json`.

O projeto API e o proxy `/api` do projeto web mantêm os endereços existentes. As sessões de moderadores são limitadas ao hostname do navegador; por isso, moderadores entram novamente ao mudar para o domínio personalizado.
