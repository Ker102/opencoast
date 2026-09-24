# Contributing to OpenCoast

Thank you for improving the map or the software. Keep the distinction between a reported observation, a cited legal rule, and a moderator-reviewed conclusion clear.

## Map information

Use **Add information** in the app to propose an area, route, point, or correction. An account is not required. Include the most exact geometry you can draw, the jurisdiction, what you believe is allowed, relevant conditions, and a description of what you observed or read. Official documents and direct links are strongly encouraged but optional. A submission without an official source can still be reviewed, with a visible label saying so. Save the private receipt link to follow the review and answer moderator questions.

Do not put people's names, faces, phone numbers, or private contact details in descriptions or public issue reports. Uploaded originals are private to moderators; consent to publish an image is optional and does not guarantee publication.

## Code changes

1. Search existing issues and pull requests before starting work.
2. Open an issue for a larger feature or bug so the intended behavior can be discussed.
3. Create a branch, make a focused change, run the relevant checks in `README.md`, and open a pull request.
4. Describe what changed, why, what you tested, and any accessibility or privacy implications.

The repository uses npm workspaces: `shared` contains data contracts, `api` owns persistence and moderation, and `web` contains the map interface. Public endpoints must never reveal pending proposals, receipt tokens, raw evidence, moderator credentials, or contributor identity. Any new map status needs a matching legend and detail explanation.

Legal sources may have reuse restrictions. Link to them and summarize in your own words; do not paste entire laws or copy another map's data into this repository. OpenStreetMap attribution must remain visible. Do not add sample coastal access claims to production seed data.

## Reporting security issues

Please use GitHub's private vulnerability reporting for security issues rather than a public issue. Include a minimal reproduction and avoid posting real receipt links, evidence files, or credentials.
