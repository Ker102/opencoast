<img src="../../../web/public/favicon.svg" width="56" height="56" alt="Logotipo costeiro do OpenCoast">

<a id="opencoast--open-source-coastal-access-map"></a>

# OpenCoast — Mapa de acesso costeiro de código aberto

[English](../../../README.md) · [Español](../es/README.md) · [简体中文](../zh-CN/README.md) · [Français](../fr/README.md) · [日本語](../ja/README.md) · [Deutsch](../de/README.md) · [Português (Brasil)](README.md)

<!-- translation-notice -->
Tradução da documentação em inglês; o original em inglês é a fonte oficial.
<!-- /translation-notice -->

**Direitos de acesso às praias, rotas até a costa e as evidências que os sustentam.**

**Sem conta. Sem login. Explore e contribua anonimamente.**

OpenCoast é um aplicativo web de código aberto para mapear informações revisadas pela comunidade sobre **acesso público às praias e direitos de acesso costeiro**. As pessoas podem desenhar áreas costeiras, caminhos até a costa e pontos de acesso; adicionar descrições, condições locais e fontes; e enviar tudo anonimamente. Moderadores revisam cada proposta antes que ela apareça no mapa público.

[Explorar o mapa](https://opencoast.kaelux.dev/) · [Contribuir](CONTRIBUTING.md) · [Como funciona a revisão](docs/moderation-policy.md) · [Guia de desenvolvimento](docs/development.md) · [Roteiro do projeto](https://github.com/Ker102/opencoast/issues)

Conhecendo o projeto agora? Leia [para que serve o OpenCoast](https://opencoast.kaelux.dev/about), [como usar o mapa e contribuir](https://opencoast.kaelux.dev/how-it-works) e [o significado dos rótulos de evidência](https://opencoast.kaelux.dev/evidence). Essas páginas públicas podem ser lidas sem JavaScript. [Configuração e verificação da descoberta](docs/discovery.md) aborda as URLs canônicas do site, o sitemap e a política para rastreadores. [Rascunhos de animação e guia de gravação](../../../tools/motion/README.md) explica os vídeos editáveis do projeto.

[![CI](https://github.com/Ker102/opencoast/actions/workflows/ci.yml/badge.svg)](https://github.com/Ker102/opencoast/actions/workflows/ci.yml) · [Licença do código: MIT](../../../LICENSE)

> **Projeto em estágio inicial.** O mapa permite navegação e envios no mundo todo; as informações revisadas crescem local por local. Uma costa sem marcação significa **que ainda não há informações de acesso revisadas**. Nunca significa que o acesso seja proibido ou garantido.

<a id="why-opencoast-exists"></a>

## Por que o OpenCoast existe

Encontrar uma praia no mapa deixa várias perguntas sem resposta: Que acesso é permitido? Quais condições se aplicam? Existe uma rota revisada para chegar até ela? Quais fontes sustentam essas informações e quando foram verificadas?

OpenCoast reúne essas perguntas em um único mapa. Cada registro associa um local específico a uma descrição, jurisdição, situação de acesso, rótulo de evidência e histórico de revisão. O projeto é útil para moradores, visitantes do litoral, mapeadores da comunidade, pesquisadores de fontes e desenvolvedores de ferramentas cartográficas de interesse público.

Criado por **[Kristofer Jussmann (Ker102)](https://github.com/Ker102)**, OpenCoast começou com preocupações sobre o acesso costeiro em Montenegro. Seu escopo é global; os [primeiros registros de Montenegro](https://github.com/Ker102/opencoast/issues/5) são um esforço de revisão de fontes, não um conjunto pré-carregado de conclusões jurídicas.

<a id="anonymous-by-default"></a>

## Anônimo por padrão

OpenCoast busca disponibilizar informações de acesso costeiro sem exigir identificação. Você pode explorar o mapa, enviar um local, propor uma correção e acompanhar a revisão sem conta, login, nome ou endereço de e-mail. Guarde seu link privado de acompanhamento para verificar o progresso e responder às perguntas dos moderadores.

Os arquivos originais de evidência são privados e acessíveis aos moderadores. Somente imagens aprovadas separadamente, com consentimento para publicação, podem aparecer publicamente. Evite dados pessoais em descrições ou evidências que deseja publicar. As ferramentas de moderação exigem um login separado.

<a id="what-can-you-map"></a>

## O que você pode mapear?

| Tipo de registro | O que descreve | Por que é separado |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Área de acesso** | Uma praia, faixa entre marés ou outra área costeira delimitada | As condições podem se aplicar a uma área específica, não a toda a costa. |
| **Rota até a costa** | Um caminho, rota de entrada ou via costeira | A situação de acesso de uma área não estabelece permissão para atravessar os terrenos que levam a ela. |
| **Ponto de acesso** | Uma entrada, portão, placa ou outro local relevante | Um ponto preciso pode explicar onde uma condição de acesso ou observação se aplica. |

Os registros podem incluir categorias locais, atividades permitidas, condições, links de fontes e observações. Uma praia arrendada ou concessão pode ser descrita com suas condições e evidências específicas; OpenCoast não presume que um único rótulo determine todos os direitos naquele local.

<a id="what-works-now"></a>

## O que funciona hoje

- **Um mapa global responsivo:** navegue em um navegador de computador ou celular, com um mapa-base derivado do OpenStreetMap fornecido pelo OpenFreeMap.
- **Uma visualização de terreno Focus:** cores neutras do solo e relevo sombreado mantêm a linha costeira legível enquanto áreas, rotas e pontos de acesso revisados se destacam.
- **Ferramentas de desenho precisas:** desenhe e edite pontos, linhas e polígonos, ajuste vértices, desfaça alterações e revise a geometria antes do envio.
- **Contribuições anônimas:** envie informações ou correções sem criar conta. Salve um link privado de acompanhamento para acompanhar a revisão e responder aos moderadores.
- **Evidências e datas:** os registros distinguem a situação de acesso da força das evidências e mostram datas de edição separadas das datas de revisão de fontes.
- **Publicação moderada:** moderadores podem pedir esclarecimentos, editar o texto com justificativa de auditoria, aprovar ou rejeitar propostas e examinar evidências privadas. Registros publicados têm históricos de revisão.
- **Vínculos revisados entre áreas e rotas:** moderadores podem vincular uma área costeira a registros separados de rotas de aproximação. Um rótulo de rota terrestre verificada depende da visibilidade, evidência e situação de acesso atuais da rota vinculada.

<a id="how-to-read-coastal-access-information"></a>

## Como interpretar informações de acesso costeiro

<a id="access-status"></a>

### Situação de acesso

| Situação | Significado no OpenCoast |
| --------------- | --------------------------------------------------------------------------- |
| **Permitido** | A afirmação revisada descreve o acesso como permitido dentro do escopo do registro. |
| **Condicional** | O registro descreve acesso sujeito aos limites ou condições indicados. |
| **Restrito** | O registro descreve uma restrição de acesso. |
| **Em disputa** | A afirmação é contestada ou evidências confiáveis entram em conflito. |
| **Desconhecido** | As informações disponíveis não estabelecem a regra de acesso aplicável. |

Leia a descrição e as condições junto com a situação. Um rótulo de acesso é uma afirmação revisada com escopo definido, não uma garantia para toda atividade ou data.

<a id="evidence-strength"></a>

### Força das evidências

**Com respaldo documental** significa que um moderador verificou pelo menos uma fonte oficial vinculada em relação à afirmação e à geometria. A explicação deve identificar o que a fonte sustenta e qualquer incerteza restante.

**Revisado pela comunidade, sem fonte oficial verificada** significa que um moderador aprovou a exibição das informações sem verificar uma fonte oficial. Esses registros têm um rótulo visível; não devem ser interpretados como direitos de acesso juridicamente verificados.

Limites desenhados à mão são identificados como aproximados. Uma data de edição não implica uma nova revisão de fontes jurídicas. Leia a [política de moderação](docs/moderation-policy.md) para conhecer o padrão completo de revisão.

<a id="contribute-beach-access-information"></a>

## Contribuir com informações de acesso às praias

1. **Encontre o local** no [mapa ao vivo](https://opencoast.kaelux.dev/). Mova e amplie o mapa, ou digite `latitude, longitude`; a busca por nome de lugar está [planejada](https://github.com/Ker102/opencoast/issues/6).
2. **Escolha Add information** e desenhe uma área, rota ou ponto. Os registros existentes também aceitam propostas de correção.
3. **Descreva a afirmação:** inclua a jurisdição, uma categoria local quando útil, as condições e o que você observou ou leu.
4. **Adicione fontes e evidências.** Documentos oficiais e links diretos são fortemente recomendados, mas opcionais. Os originais são privados para os moderadores; somente imagens aprovadas separadamente, com consentimento de publicação, podem aparecer publicamente.
5. **Salve o link privado de acompanhamento.** Um moderador revisa a proposta e pode pedir esclarecimentos antes da publicação.

Relatos de acesso costeiro pertencem ao fluxo de revisão do aplicativo. Use issues do GitHub para bugs de software, documentação e propostas de funcionalidades. Veja o [guia de contribuição](CONTRIBUTING.md) para os dois caminhos.

<a id="frequently-asked-questions"></a>

## Perguntas frequentes

<a id="is-opencoast-a-worldwide-database-of-legally-verified-public-beaches"></a>

### OpenCoast é uma base mundial de praias públicas juridicamente verificadas?

OpenCoast oferece um mapa mundial e contribuições de diferentes jurisdições. A cobertura depende dos registros enviados e revisados, e alguns registros publicados não têm fonte oficial verificada. É um projeto de informação em estágio inicial, não uma base jurídica completa nem uma autoridade legal.

<a id="does-a-blank-map-mean-a-beach-is-private-or-closed"></a>

### Um mapa vazio significa que a praia é privada ou está fechada?

Não. Significa que não há informações de acesso revisadas exibidas ali. Parques, estradas, praias e cores do solo do mapa-base são contexto geográfico, não afirmações de acesso do OpenCoast.

<a id="can-i-submit-without-an-account-or-an-official-document"></a>

### Posso enviar sem conta ou documento oficial?

Sim. Envios públicos não exigem conta, e fontes oficiais são recomendadas, não obrigatórias. Todo envio ainda exige revisão por um moderador. Se uma fonte oficial não foi verificada, o registro publicado informa isso.

<a id="how-is-a-public-beach-connected-to-its-access-route"></a>

### Como uma praia pública se conecta à sua rota de acesso?

A área da praia e a rota são revisadas como registros separados. Um moderador deve vinculá-las explicitamente depois de verificar a geometria e as fontes. OpenCoast não deduz uma rota de acesso só porque uma estrada ou caminho próximo parece chegar à praia.

<a id="does-submitting-to-opencoast-edit-openstreetmap"></a>

### Enviar ao OpenCoast edita o OpenStreetMap?

Não. OpenCoast armazena seus registros de acesso revisados em sua própria base de dados. OpenFreeMap fornece o mapa de fundo derivado do OpenStreetMap. Os envios aqui não são gravados automaticamente no OpenStreetMap.

<a id="is-the-coastal-access-data-open-data"></a>

### Os dados de acesso costeiro são dados abertos?

O software é de código aberto sob a licença MIT. Os registros aprovados na base hospedada ainda não têm licença de dados abertos; obtenha permissão antes de redistribuí-los. Evidências privadas e materiais de fontes de terceiros têm direitos separados. Veja [licenciamento e atribuição](#licensing-and-attribution).

<a id="can-i-use-opencoast-on-my-phone"></a>

### Posso usar OpenCoast no celular?

Sim, pela interface web responsiva. O desenho foi projetado tanto para toque quanto para entradas de computador. Ainda não há aplicativo móvel nativo, e os [testes em dispositivos reais e a revisão de acessibilidade](https://github.com/Ker102/opencoast/issues/4) continuam em andamento.

<a id="help-build-opencoast"></a>

## Ajude a construir o OpenCoast

Contribuições são úteis em várias áreas:

- **Conhecimento local e pesquisa de fontes:** envie registros e correções com escopo cuidadoso pelo mapa. Inclua disposições pertinentes, datas das fontes e incertezas.
- **Mapeamento e experiência do usuário:** melhore desenho, navegação, legendas legíveis, acesso por teclado e interação por toque.
- **Software e infraestrutura:** ajude com consultas geoespaciais, ferramentas de moderação, tratamento de evidências, testes e confiabilidade de implantação.
- **Documentação:** melhore explicações e a integração de desenvolvedores. Traduções e propostas de localização são bem-vindas.

Leia [CONTRIBUTING.md](CONTRIBUTING.md), explore as [issues abertas](https://github.com/Ker102/opencoast/issues) ou [proponha uma melhoria](https://github.com/Ker102/opencoast/issues/new/choose). Relate problemas de segurança pelo [canal privado de vulnerabilidades](https://github.com/Ker102/opencoast/security/advisories/new).

<a id="technology-and-repository-structure"></a>

## Tecnologia e estrutura do repositório

| Camada | Implementação | Local |
| -------------------- | ------------------------------------------------------ | -------------------- |
| Interface web | React, TypeScript, Vite, MapLibre GL JS, Terra Draw | [`web/`](../../../web/) |
| API e moderação | Fastify, TypeScript, tratamento privado de evidências | [`api/`](../../../api/) |
| Contratos de dados | Esquemas Zod e tipos GeoJSON | [`shared/`](../../../shared/) |
| Armazenamento espacial | PostgreSQL e PostGIS; hospedados no Supabase | [`api/db/`](../../../api/db/) |
| Hospedagem e evidências | Projetos web/API do Vercel; armazenamento privado Cloudflare R2 | [`infra/`](../../../infra/) |

<a id="run-locally"></a>

### Executar localmente

O CI atual usa Node.js 24. Instale Node.js 24+, npm e Docker e execute:

```sh
git clone https://github.com/Ker102/opencoast.git
cd opencoast
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Abra `http://localhost:5173`. As bases locais começam sem registros que afirmem acesso. O [guia de desenvolvimento](docs/development.md#run-locally) explica configurações de ambiente, portas, uploads locais e a criação de uma conta de moderador.

<a id="checks"></a>

### Verificações

Veja os [comandos de validação e o teste de integração de banco de dados isolado](docs/development.md#checks).

<a id="hosted-deployment"></a>

### Implantação hospedada

Veja a [configuração de Vercel, Supabase/PostGIS e Cloudflare R2 privado](docs/development.md#hosted-deployment).

<a id="current-release-limits"></a>

## Limitações da versão atual

A implementação atual permite publicação revisada, mas ainda restam tarefas antes de divulgação ampla: [reforço de uploads e controles contra abuso](https://github.com/Ker102/opencoast/issues/3), [testes de toque e acessibilidade em dispositivos reais](https://github.com/Ker102/opencoast/issues/4), [revisão independente de fontes para os primeiros registros de Montenegro](https://github.com/Ker102/opencoast/issues/5) e [busca por nome de lugar](https://github.com/Ker102/opencoast/issues/6).

Nenhuma lei de abrangência jurisdicional é aplicada automaticamente às praias. Uma obstrução relatada e um direito legal documentado são afirmações separadas. Os registros do OpenCoast explicam as evidências revisadas; não substituem os documentos de origem nem estabelecem limites jurídicos.

Veja o [projeto de concepção](../../../docs/plans/2026-09-24-opencoast-design.md) e o [acompanhamento de progresso](../../../task.md). As imagens em `docs/design-reference` são conceitos visuais com afirmações fictícias de exemplo, não dados do mapa.

<a id="licensing-and-attribution"></a>

## Licenciamento e atribuição

- **Software:** [MIT](../../../LICENSE), permitindo uso, modificação e redistribuição conforme seus termos.
- **Registros de acesso hospedados:** controlados pelo operador, ainda sem licença de dados abertos. Discuta a reutilização com o [mantenedor](https://github.com/Ker102).
- **Evidências e documentos de origem:** mantêm seus próprios direitos e restrições de publicação. Os originais enviados são privados.
- **Mapa-base e terreno:** a atribuição a [OpenStreetMap](https://www.openstreetmap.org/copyright), [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://www.openmaptiles.org/) e [Mapterhorn](https://mapterhorn.com/attribution) permanece visível no mapa conforme aplicável.

Para artigos, pesquisas ou reutilização do software, crie um link para [OpenCoast no GitHub](https://github.com/Ker102/opencoast) e use [CITATION.cff](../../../CITATION.cff) para os dados de citação do software. Citar o software não verifica nenhuma afirmação específica de acesso costeiro.

Última revisão da visão geral do projeto: **2026-10-06**.
