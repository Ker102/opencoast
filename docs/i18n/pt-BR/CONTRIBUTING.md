<a id="contributing-to-opencoast"></a>

# Contribuir com o OpenCoast

Obrigado por melhorar o mapa ou o software. Mantenha clara a distinção entre uma observação relatada, uma regra jurídica citada e uma conclusão revisada por um moderador.

<a id="choose-where-to-contribute"></a>

## Escolha onde contribuir

| Você quer ajudar com | Comece aqui |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uma praia, área costeira, rota, entrada ou correção | [Abra o mapa](https://opencoast-web.vercel.app/) e use Add information ou a ação de correção do registro. |
| Fontes oficiais e condições locais de acesso | Envie a fonte com a afirmação relevante do mapa; consulte a [política de moderação](docs/moderation-policy.md) para entender a avaliação. |
| Um bug de software ou funcionalidade | Pesquise as [issues existentes](https://github.com/Ker102/opencoast/issues) e depois [abra uma issue](https://github.com/Ker102/opencoast/issues/new/choose). |
| Código, documentação ou acessibilidade | Leia o [guia de desenvolvimento](docs/development.md) e as etapas de contribuição de código abaixo. |
| Uma vulnerabilidade de segurança | Use o [canal privado de vulnerabilidades](https://github.com/Ker102/opencoast/security/advisories/new). |

Você não precisa de conta no GitHub para enviar informações ao mapa. GitHub é usado para contribuições de desenvolvimento; o mapa tem seu próprio fluxo de revisão por moderadores.

<a id="map-information"></a>

## Informações do mapa

Use **Add information** no aplicativo para propor uma área, rota, ponto ou correção. Não é preciso ter conta. Inclua a geometria mais exata que conseguir desenhar, a jurisdição, o que acredita ser permitido, condições relevantes e uma descrição do que observou ou leu. Documentos oficiais e links diretos são fortemente recomendados, mas opcionais. Um envio sem fonte oficial também pode ser revisado, com um rótulo visível que informe isso. Salve o link privado de acompanhamento para acompanhar a revisão e responder aos moderadores.

<a id="what-makes-a-useful-submission"></a>

### O que torna um envio útil?

- Identifique o local e desenhe apenas a área, rota ou ponto a que a afirmação se refere.
- Informe o país ou jurisdição relevante e qualquer categoria local, como concessão ou trilha costeira.
- Descreva a atividade e quaisquer condições, datas, limites sazonais ou incertezas.
- Para um documento, inclua link direto da fonte, título, órgão emissor, data e, quando disponível, disposição ou página pertinente. Explique qual parte da afirmação ele sustenta.
- Para uma observação pessoal, descreva o que viu e quando. Distinga a observação de uma conclusão sobre direitos legais.
- Envie a rota até a costa separadamente da área costeira que ela alcança. Moderadores revisam e vinculam esses registros explicitamente.

Envios do mundo inteiro são bem-vindos. Um relato útil sem fonte oficial pode ser publicado com o rótulo de revisão comunitária após moderação. Evite preencher grandes regiões com suposições baseadas apenas em uma regra geral.

Não coloque nomes, rostos, telefones ou dados privados de contato em descrições ou relatos públicos de issues. Os originais enviados são privados para os moderadores; consentir com a publicação de uma imagem é opcional e não garante sua publicação.

<a id="code-changes"></a>

## Alterações de código

1. Pesquise issues e pull requests existentes antes de começar.
2. Abra uma issue para uma funcionalidade maior ou bug, para discutir o comportamento pretendido.
3. Crie uma branch, faça uma alteração focada, execute as verificações relevantes do [guia de desenvolvimento](docs/development.md#checks) e abra uma pull request.
4. Descreva o que mudou, por quê, o que testou e quaisquer implicações de acessibilidade ou privacidade.

O repositório usa workspaces do npm: `shared` contém contratos de dados, `api` cuida da persistência e moderação, e `web` contém a interface do mapa. Endpoints públicos nunca devem revelar propostas pendentes, tokens de acompanhamento, evidências originais, credenciais de moderadores ou identidade dos colaboradores. Todo novo estado do mapa precisa de uma legenda e explicação detalhada correspondentes.

Fontes jurídicas podem ter restrições de reutilização. Crie links e resuma com suas próprias palavras; não cole leis inteiras nem copie dados de outro mapa neste repositório. A atribuição do OpenStreetMap deve permanecer visível. Não adicione afirmações de exemplo sobre acesso costeiro aos dados iniciais de produção.

<a id="reporting-security-issues"></a>

## Relatar problemas de segurança

Use o canal privado de vulnerabilidades do GitHub para questões de segurança em vez de uma issue pública. Inclua uma reprodução mínima e evite publicar links reais de acompanhamento, arquivos de evidência ou credenciais.
