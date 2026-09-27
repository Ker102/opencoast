# Contributing to OpenCoast

Thank you for improving the map or the software. Keep the distinction between a reported observation, a cited legal rule, and a moderator-reviewed conclusion clear.

## Choose where to contribute

| You want to help with                                 | Start here                                                                                                                                         |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| A beach, coastal area, route, entrance, or correction | [Open the map](https://opencoast-web.vercel.app/) and use Add information or the record's correction action.                                       |
| Official sources and local access conditions          | Submit the source with the relevant map claim; use the [moderation policy](docs/moderation-policy.md) to understand how it is assessed.            |
| A software bug or feature                             | Search [existing issues](https://github.com/Ker102/opencoast/issues), then [open an issue](https://github.com/Ker102/opencoast/issues/new/choose). |
| Code, documentation, or accessibility                 | Read the [development guide](docs/development.md) and the code contribution steps below.                                                           |
| A security vulnerability                              | Use [private vulnerability reporting](https://github.com/Ker102/opencoast/security/advisories/new).                                                |

You do not need a GitHub account to submit map information. GitHub is used for development contributions; the map has its own moderator review workflow.

## Map information

Use **Add information** in the app to propose an area, route, point, or correction. An account is not required. Include the most exact geometry you can draw, the jurisdiction, what you believe is allowed, relevant conditions, and a description of what you observed or read. Official documents and direct links are strongly encouraged but optional. A submission without an official source can still be reviewed, with a visible label saying so. Save the private receipt link to follow the review and answer moderator questions.

### What makes a useful submission?

- Identify the location and draw only the area, route, or point that the claim concerns.
- State the relevant country or jurisdiction and any local category, such as a concession or a coastal path.
- Describe the activity and any conditions, dates, seasonal limits, or uncertainty.
- For a document, include a direct source link, title, issuing body, date, and the relevant provision or page where available. Explain which part of the claim it supports.
- For a personal observation, describe what you saw and when. Distinguish that observation from a conclusion about legal rights.
- Submit a route to the shore separately from the coastal area it reaches. Moderators review and link those records explicitly.

Worldwide submissions are welcome. A useful account without an official source can be published with the community-reviewed label after moderation. Please avoid filling large regions with assumptions based only on a general rule.

Do not put people's names, faces, phone numbers, or private contact details in descriptions or public issue reports. Uploaded originals are private to moderators; consent to publish an image is optional and does not guarantee publication.

## Code changes

1. Search existing issues and pull requests before starting work.
2. Open an issue for a larger feature or bug so the intended behavior can be discussed.
3. Create a branch, make a focused change, run the relevant checks in the [development guide](docs/development.md#checks), and open a pull request.
4. Describe what changed, why, what you tested, and any accessibility or privacy implications.

The repository uses npm workspaces: `shared` contains data contracts, `api` owns persistence and moderation, and `web` contains the map interface. Public endpoints must never reveal pending proposals, receipt tokens, raw evidence, moderator credentials, or contributor identity. Any new map status needs a matching legend and detail explanation.

Legal sources may have reuse restrictions. Link to them and summarize in your own words; do not paste entire laws or copy another map's data into this repository. OpenStreetMap attribution must remain visible. Do not add sample coastal access claims to production seed data.

## Reporting security issues

Please use GitHub's private vulnerability reporting for security issues rather than a public issue. Include a minimal reproduction and avoid posting real receipt links, evidence files, or credentials.
