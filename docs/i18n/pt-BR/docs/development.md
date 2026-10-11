<a id="opencoast-development-and-deployment"></a>

# Desenvolvimento e implantação do OpenCoast

[Voltar ao OpenCoast](../README.md) · [Contribuir](../CONTRIBUTING.md)

Este guia aborda configuração local, validação, criação inicial de moderadores e infraestrutura hospedada. Para o propósito do mapa, rótulos de evidência e participação, comece pelo README do repositório.

<a id="run-locally"></a>

## Executar localmente

Requisitos: Node.js 24+, npm e Docker. A base PostGIS local usa a porta `54329`; a API usa `4000`; o aplicativo web usa `5173`.

```sh
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Abra `http://localhost:5173`. Para criar um moderador local, defina `MODERATOR_BOOTSTRAP_PASSWORD` com uma senha exclusiva de pelo menos 12 caracteres e execute:

```sh
npm run moderator:create -w api -- moderator@example.org
```

A API carrega os valores de ambiente do `.env` do repositório ou de `api/.env`; copie `.env.example` se precisar alterar os padrões. Uploads locais ficam em `.local-evidence/`, ignorado pelo Git. Em produção, configure as credenciais Cloudflare R2 e deixe `LOCAL_EVIDENCE_DIR` sem definir.

<a id="checks"></a>

## Verificações

```sh
npm test
npm run format:check
npm run typecheck
npm run build
npm audit --audit-level=high
```

O teste de integração de banco de dados usa uma base separada, `opencoast_test`, e limpa somente essa base após a execução. Crie-a localmente, execute as migrações nela e então rode o teste:

```sh
docker exec opencoast-postgis-1 createdb -U opencoast opencoast_test
```

Defina `DATABASE_URL=postgres://opencoast:opencoast_local@localhost:54329/opencoast_test` tanto para a migração quanto para `INTEGRATION_TEST=1 npx vitest run api/src/app.integration.test.ts`. O teste recusa qualquer outro nome de banco de dados.

<a id="hosted-deployment"></a>

## Implantação hospedada

A implantação hospedada usa projetos Vercel dedicados de [web](https://opencoast.kaelux.dev) e [API](https://opencoast-api.vercel.app/health), PostgreSQL do Supabase com PostGIS e um bucket **privado** do Cloudflare R2. Defina o diretório raiz de cada projeto Vercel como `web` ou `api`. O arquivo `web/vercel.ts` do projeto web encaminha `/api/*` ao projeto API, mantendo os cookies de moderadores como first-party. Defina `VERCEL_API_ORIGIN` no projeto web com a origem HTTPS da API. Não exponha credenciais do banco ou R2 à compilação web. Veja a [configuração do domínio personalizado](domain-setup.md) para DNS e origens.

Ambiente da API:

| Variável | Finalidade |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL` | String de conexão ao pooler de transações do Supabase com PostGIS habilitado |
| `DATABASE_SSL_CA_B64` | Certificado da CA raiz do Supabase codificado em Base64 para TLS verificado |
| `WEB_ORIGIN` | Origens web exatas separadas por vírgulas para CORS e verificações de mutações de moderadores |
| `S3_ENDPOINT` | Endpoint da conta Cloudflare R2 |
| `S3_REGION` | Região do R2, normalmente `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Credenciais R2 restritas ao bucket de evidências |
| `S3_BUCKET` | Nome do bucket privado de evidências |
| `COOKIE_SECURE` | Seguro por padrão em produção |

Execute `api/db/*.sql` em ordem de nome de arquivo no banco antes de iniciar a API, ou execute `npm run db:migrate -w api` em um ambiente confiável com `DATABASE_URL`. Mantenha R2 privado: uploads originais nunca recebem URL pública de objeto. Configure CORS do R2 para a origem web exata e `PUT` com `Content-Type` (há um exemplo em `infra/r2-cors.json`). Uploads de evidência hospedados usam URLs PUT assinadas de curta duração; depois a API valida o arquivo armazenado antes de copiá-lo para uma chave final privada. Crie contas de moderadores usando `MODERATOR_BOOTSTRAP_PASSWORD` como segredo temporário e remova-o depois.

A URL pública do mapa-base pode ser substituída por `VITE_MAP_STYLE_URL`. OpenFreeMap é adequado para o desenvolvimento inicial, mas não tem garantia de serviço; organize monitoramento e um provedor de tiles com financiamento antes da divulgação ampla. Atualmente o mapa aceita navegação por coordenadas (`latitude, longitude`), não busca por nome de lugar.
