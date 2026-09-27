# GitHub discovery and project documentation

## Objective

Make OpenCoast easier to discover through GitHub search and easier for people and search assistants to understand from the repository. Scope is repository metadata and documentation.

## Audit

- The About description is brief, with no homepage or topics.
- The README describes implementation well but offers little orientation for visitors, mappers, or source reviewers.
- The code license and live-data rights are separate and must remain explicit.
- Worldwide navigation must not be described as comprehensive reviewed coverage.

## Plan

1. Add a descriptive About summary, the live map URL, and relevant coastal-access, civic-tech, mapping, and implementation topics.
2. Rewrite the README around the purpose, live map, record types, evidence model, participation, FAQ, current limits, and maintainer identity.
3. Preserve detailed local setup and deployment instructions in a linked development guide.
4. Improve contribution entry points and add software citation metadata.
5. Check all new claims against the source and moderation policy, validate links and citation format, inspect GitHub-rendered Markdown, and publish through a pull request.

## Editorial constraints

Use natural terms such as beach access, coastal access rights, routes to shore, and community mapping where they describe actual features. Do not claim worldwide legal verification, open licensing of live records, native mobile apps, automatic legal decisions, or guaranteed search rankings. Do not add jurisdiction-specific legal claims.

## References

- [GitHub repository topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [GitHub README guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [GitHub citation files](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files)
- [Google guidance for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

GitHub controls its own page metadata and crawler behavior. This change improves project descriptions, navigation, and factual context; search visibility still depends on indexing and relevance.

## Published repository metadata

**Description:** Open-source coastal access map for beach access rights, routes to shore, and entrance points. Anonymous contributions, moderator review, and clear evidence labels. Built with MapLibre and PostGIS.

**Homepage:** <https://opencoast-web.vercel.app/>

**Topics:** coastal-access, beach-access, public-access, coastlines, beaches, civic-tech, crowdsourcing, participatory-mapping, geospatial, gis, web-mapping, openstreetmap, maplibre, postgis, react, typescript.

## Validation

- Checked feature and evidence descriptions against the shared schema, map implementation, contribution guide, and moderation policy.
- Validated `CITATION.cff` against the official Citation File Format JSON Schema.
- Checked local document links and heading anchors, the logo path, and issue contact-link YAML.
- Used GitHub's Markdown renderer to verify the README's heading hierarchy, tables, FAQ, and licensing section.
- Confirmed the original local setup, checks, and deployment instructions were preserved in `docs/development.md`.
- Read back the live About description, homepage, and all 16 topics; confirmed the map responds and private vulnerability reporting is enabled.
