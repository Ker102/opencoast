<a id="search-and-ai-discovery"></a>

# Descoberta em buscas e IA

Site canônico: [opencoast.kaelux.dev](https://opencoast.kaelux.dev). As alterações de produção foram implantadas em 10 de outubro de 2026 no projeto web Vercel existente. O mapa, o proxy da API e as páginas de informação pública foram verificados no domínio personalizado.

<a id="public-information"></a>

## Informações públicas

- [Sobre](https://opencoast.kaelux.dev/about): propósito, cobertura, anonimato, autoria, código-fonte e atribuição do mapa-base.
- [Como funciona](https://opencoast.kaelux.dev/how-it-works): navegação, desenho, fontes, acompanhamento privado e moderação.
- [Evidências](https://opencoast.kaelux.dev/evidence): situações de acesso, verificação documental, revisão comunitária, datas e limites.

São páginas HTML estáticas e legíveis. A página inicial também inclui HTML útil antes do carregamento de JavaScript e uma explicação sem JavaScript. O mapa interativo tem links para as três páginas. Nenhum registro jurídico ou afirmação de cobertura foi inventado para conteúdo de busca.

`web/scripts/generate-discovery.mjs` é a fonte do texto das páginas, URLs canônicas, descrições, metadados Open Graph e Twitter, dados estruturados WebSite/WebPage/SoftwareApplication, sitemap.xml, robots.txt e llms.txt. O prebuild web os regenera de forma determinística. Edite a data do conteúdo quando o conteúdo subjacente mudar. O estilo público compartilhado é `web/public/discovery.css`; os estilos existentes do aplicativo permanecem separados. A imagem social é gerada da identidade existente por `tools/motion/render.cjs social`.

<a id="routing-and-indexing"></a>

## Roteamento e indexação

O host antigo `opencoast-web.vercel.app` redireciona permanentemente para o domínio personalizado. As páginas de informação pública têm suas próprias URLs canônicas. Caminhos não suportados retornam HTTP 404 em vez da estrutura do aplicativo do mapa. O proxy da API continua encaminhando para o projeto API existente.

O sitemap lista apenas as quatro páginas canônicas públicas. Páginas de contribuição, moderação e acompanhamento privado retornam cabeçalhos X-Robots-Tag noindex. Caminhos de API e fluxos privados são excluídos da descoberta por rastreadores. Esses controles são separados da autenticação do aplicativo; robots.txt não é uma barreira de privacidade. Links de acompanhamento e evidências originais continuam protegidos pelos controles de acesso existentes.

A política geral de rastreamento permite páginas públicas. OpenAI documenta que OAI-SearchBot controla a descoberta em busca e é separado do uso de GPTBot para treinamento. Nenhuma nova política de exclusão de treinamento foi escolhida nesta mudança. Veja a [documentação oficial dos rastreadores OpenAI](https://developers.openai.com/api/docs/bots). `llms.txt` é um auxílio de leitura curto e opcional; não garante indexação nem classificação.

<a id="what-remains-outside-code"></a>

## O que permanece fora do código

Mecanismos de busca decidem quando rastrear, indexar e citar uma página. Esta implementação não estabelece que OpenCoast esteja indexado ou classificado. O proprietário pode verificar o domínio no Google Search Console e Bing Webmaster Tools e enviar `https://opencoast.kaelux.dev/sitemap.xml`. Crie links para o site canônico a partir do repositório GitHub e de artigos genuínos do projeto. Mantenha explicações públicas e informações locais aprovadas atualizadas conforme a cobertura cresce.

O conteúdo segue a ênfase do Google em informações úteis e originais para leitores. Explica evidências e incertezas sem fabricar afirmações jurídicas, avaliações ou notas. Veja as [orientações do Google sobre conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). O roteamento do Vercel usa sua [configuração documentada](https://vercel.com/docs/project-configuration/vercel-json).

<a id="verification-on-10-october"></a>

## Verificação em 10 de outubro

- A compilação web de produção, a verificação de tipos e a formatação das fontes passaram.
- Suíte unitária: 7 testes passaram. Dois testes de integração de banco foram ignorados porque a execução explícita com a base de teste não estava habilitada; dados de produção não foram usados em testes.
- Páginas públicas, arquivos para rastreadores e imagem de compartilhamento retornaram HTTP 200 com os tipos de conteúdo esperados.
- Páginas de fluxos privados retornaram cabeçalhos noindex; caminho desconhecido retornou 404; o host antigo retornou redirecionamento 308 para o domínio personalizado.
- Desktop em 1280px e celular em 390px não mostraram transbordamento horizontal; títulos, tags canônicas e JSON-LD foram analisados corretamente. A página inicial era legível com JavaScript desativado.
- Vídeos exportados foram inspecionados e totalmente decodificados sem erros de FFmpeg; cada um tem 40 segundos, 1280 × 720, 30 fps e nenhum áudio.

Comprovantes e capturas locais estão na pasta ignorada `artifacts/`. ID de implantação: `dpl_7T2D8sR3wagtzm3CWHUiDVtGJfZR`.

A auditoria de dependências existente da implantação relatou quatro alertas: concurrently/shell-quote (ferramentas de desenvolvimento), sharp (processamento de imagens da API) e source-map-js. Esta mudança de descoberta não adicionou dependências ao aplicativo nem afirma que esses alertas foram corrigidos. A auditoria salva é `artifacts/dependency-audit.json`; a correção de dependências deve incluir a API e suas verificações de processamento de evidências.
