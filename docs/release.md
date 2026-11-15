# Architecture, verification and release

## Architecture

App Router renders the public catalog, product detail, and private status and moderation pages. Server actions validate input, apply business rules and write through the repository. MongoDB and the local JSON file implement the same access contract. Repository code stays on the server. React escapes submitted text and the website is stored after HTTPS validation. The server never fetches the supplied website.

A listing contains the product fields, stable slug, moderation status, timeline, dates, optional spotlight eligibility, and votes. Intake writes a pending listing. Moderation atomically changes a pending listing to published, changes requested, or rejected. A holder of the original tracking link can move a changes-requested submission back to pending. Published and rejected are terminal in this release. Local writes are serialized within one process and use an atomic file replacement. MongoDB uses unique indexes, conditional updates, and add-to-set votes.

The MVP uses a shared moderator password and a browser cookie for votes. A visitor can reset the voting cookie. Access to a status link is equivalent to access to that submission's history and editing rights when changes are requested. There is no status-link recovery. Search currently scans published listings, which suits the pilot catalog. Number of listings and vote arrays should be measured before introducing pagination and separate vote storage.

## Test plan

| Scenario | Expected result |
|---|---|
| Browse and filter seeded products | Results reflect the query, category and sort; empty searches offer a reset |
| Submit invalid or valid content | Invalid input is rejected; valid input opens a private tracking URL |
| Review as signed-out visitor | Review action requires an authorized moderator |
| Request changes and resubmit | Note is visible in status history; corrected listing returns to queue |
| Approve | Listing becomes visible through details, search and sitemap |
| Decline | Status shows reason; detail remains unavailable |
| Vote twice in the same browser | Counter increases once and repeat voting is disabled |
| Restart app | File-backed submissions and votes persist |
| Visit with real MongoDB config | Independently confirm the same workflows, unique indexes and conditional writes |
| Review responsive layout and SEO | Verify at phone, tablet and desktop widths; validate metadata, links and structured data |

## Release gates

1. Provision MongoDB and a Node host. Set production environment variables and test database access on staging. Configure backups and verify a restore.
2. Replace the fictional demo catalog with consented initial listings. Confirm terms, privacy disclosures, moderation standards and a takedown contact.
3. Set access and submission rate limits at the host or edge. Add monitoring for failed writes, application errors, abnormal voting and review queue age. Establish moderator coverage and credential rotation.
4. Run the acceptance matrix on staging, including a MongoDB-backed founder review loop, multi-browser and accessibility checks. Validate sitemap and page metadata on the intended domain.
5. Deploy and verify the home page, an indexable published detail, and the private moderation flow. Submit the sitemap and review search indexing after launch. Roll back app code using the previous known-good deployment. Retain the database and its backups when rolling back code.
6. During the pilot, monitor review turnaround, listing visits and outbound clicks. Add recovery or stronger identities when usage warrants it. Treat any production use of shared moderation credentials as a pilot limitation.

Release ownership and targets are pending operator assignment. The project is delivered for local evaluation and staging preparation; production services need to be provisioned.

## Verification record

Five domain tests, TypeScript, and the webpack production build passed on Windows with Node.js 24. HTTP checks passed for the catalog, filtered search, product detail, submission, admin sign-in, robots, sitemap and invalid routes. The isolated JSON-backed smoke test covered submission, request for changes, revision, approval, public detail and sitemap inclusion. Browser layout, production infrastructure and live MongoDB verification remain staging gates.

## IndieRally expansion

Public pages now include Explore, About, Contact, Blog, directory services, and pricing. A launch is visible after its approved UTC start. Voting uses a founder account and closes at the next Monday at midnight UTC. The last three completed rounds derive their standings from stored votes. Contact inquiries remain in MongoDB for moderator review. Directory packages are requests for manual fulfillment. The public brand changed to IndieRally while preserving the existing MongoDB database and collection names.
