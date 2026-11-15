# Software requirements and MVP specification

## Purpose and stakeholders

Help visitors discover useful independent software and help makers secure a reviewed public listing. Stakeholders are visitors, makers, moderators and the operator. Requirements were inferred from the brief and public research. Proposed launch success measures are weekly unique product visits, submission completion, approval rate, median review time and outbound click-through. Agree targets after pilot baselines exist.

## Functional requirements and acceptance

| ID | Priority | Requirement and acceptance criteria | Depends on |
|---|---|---|---|
| F01 | Must | Show only published products. Each card links to a stable detail route with description, maker, category, pricing and external website. Unknown or private slugs return 404. | Repository and publication state |
| F02 | Must | Search across product name, tagline, description, maker and category. Combine with category and newest or top-voted sorting. Share filters via URL and provide a clear empty state. | F01 |
| F03 | Must | Accept name, maker, public HTTPS URL, tagline, category, pricing and description. Reject invalid fields server-side. Successful intake starts in review and returns a secret status URL. | Validation and repository |
| F04 | Must | Status URL displays decision and history. Makers can revise when changes are requested. The same URL works after revision and publication. Wrong tokens return 404. | F03 and F05 |
| F05 | Must | Admin requires a session. Reviewers can publish, request changes, or decline. Changes and declines require a reason. Publishing exposes the listing immediately. Concurrent decisions cannot overwrite another decision for the same pending state. | Repository and admin configuration |
| F06 | Should | Visitors may upvote a published product once per browser cookie. Display the recorded total and use it when sorting by top voted. | F01 and cookies |
| F07 | Should | A reviewer can mark a listing eligible for the homepage spotlight on approval. The most recently published eligible listing appears first. | F01 and F05 |
| F08 | Must | Publish canonical metadata, JSON-LD, robots and a sitemap. Keep admin, status and filtered results out of indexable content. Sitemap includes only published product URLs. | F01 and deployment origin |
| F09 | Must | Run the demo without external accounts. Swap to MongoDB through environment configuration with the same listing workflows. | Repository contract |

## Non-functional requirements

| ID | Requirement | Acceptance target |
|---|---|---|
| N01 | Responsive and keyboard usable | Verify at 360, 768 and 1440 px. Use visible focus, labeled fields and controls, semantic landmarks, readable contrast and reduced-motion preferences. |
| N02 | State integrity | Unique slugs, atomic moderation updates, deduplicated votes for a voter ID, and durable writes across restarts on the selected adapter. |
| N03 | Privacy and access | Status token has 192 bits of entropy and is stored as a digest. Admin cookies are signed, scoped, expiring and HTTP-only. Enable secure cookies on HTTPS. |
| N04 | Speed | Render search and detail content on the server. Pilot target p75 LCP below 2.5 s on public pages. Measure on deployed infrastructure with representative traffic. |
| N05 | Maintainability | Use typed domain models and a repository interface with run and deployment instructions. Domain tests, type checks and production build should pass before release. |
| N06 | Discoverability | Verify sitemap, canonical URLs, status codes, robots and valid schema payloads on the production hostname. |
| N07 | Operations | Launch on MongoDB, configure backups, verify restore and define review ownership. Track release and incident follow-up. |

## Scope boundaries and dependencies

The intake and admin sign-in are independent entry points. The catalog can operate independently with seed or existing records. Status tracking depends on intake. Review decisions drive inclusion in the feed, details, search and sitemap. Users can vote only after publication.

Next release candidates include accounts and status recovery, duplicate-domain review, uploaded assets and media, email updates, admin roles and audit identity, takedown and edit workflows, abuse controls, and analytics. Billing, sponsored inventory and scheduling, AI URL import, comparison, third-party directories and public APIs are separate epics.
