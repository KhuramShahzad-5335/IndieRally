# IndieRally

A reviewed discovery directory for independent SaaS, developer tools, and AI products. Built with Next.js App Router, TypeScript, Tailwind CSS 4, and replaceable JSON and MongoDB repositories.

## Run locally

Use Node.js 22.18 or newer and npm.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The demo opens with eight fictional listings. Submit a product and save its private status URL. Open [moderation](http://localhost:3000/admin) and sign in with the development-only password `launchdeck-demo` to publish, request changes, or decline.

The default adapter writes to `.data/listings.json` on the first mutation. It is for one Node process on a writable local filesystem. The fixtures are used when that file is absent. JSON data stays local when switching to MongoDB.

## Configure deployment

Copy `.env.example` to `.env.local` and set the fields for your environment. Set `SITE_URL` to the production HTTPS origin, `ADMIN_PASSWORD` to a strong password, and `SESSION_SECRET` to an independent random secret of at least 32 characters. Production admin access remains disabled without both secrets. Use a Node deployment with network access to MongoDB.

Set `MONGODB_URI` and optionally `MONGODB_DB`. The adapter creates indexes on startup and starts with an empty catalog. The database user needs read/write and index-creation privileges. Add launch content through the submission workflow. For production run `npm run build` and `npm start`.

## Verify

```sh
npm test
npm run typecheck
npm run build
```

See the [reference audit](docs/reference-audit.md), [requirements and MVP scope](docs/requirements.md), and [architecture and release plan](docs/release.md).

After building, run the end-to-end moderation smoke test with `node tests/workflow.mjs`. It starts a temporary loopback server on port 3199 and uses an isolated local catalog.

The dev and build scripts use webpack because Turbopack failed to start a CSS worker in the Windows development environment.

## Founder accounts

With MongoDB configured, create a founder account at /signup and sign in at /login. Submitting a product requires sign-in. Use /dashboard to view and revise your own submissions. The database uses the launchdeck collection for listings and separate accounts and sessions collections. The account password is chosen at signup. The moderator password is still configured through ADMIN_PASSWORD. The local file adapter retains its account-free workflow.

For a public release, configure HTTPS, rate limits on authentication and submission, and an account recovery process. Password recovery is implemented; email verification and abuse rate limits still need a separate launch review.

## IndieRally pages and launch rounds

Approved listings are queued for the next Monday at midnight UTC. A request after that time sees the listing live without a scheduler. Voting is limited to signed-in accounts and the active UTC week. Explore includes the current round and the last three completed weeks. The database and collection retain their existing names.

Contact and package requests go to the MongoDB inquiries collection. Moderators can read the latest requests at the existing private moderation route. Packages are quote requests with proposed starting prices, with manual fulfillment.

Articles are maintained in lib/editorial.ts. The three bundled editorial covers are served through Next Image. To use Vercel Blob, set BLOB_READ_WRITE_TOKEN for a public store, run node --env-file=.env.local scripts/upload-editorial.mjs, and set BLOG_BLOB_BASE_URL from its output. Rebuild after setting the origin. Local covers are sourced from Unsplash.

## Founder password reset

Choose Gmail SMTP (below), or set RESET_EMAIL_API_KEY to a Resend API key and RESET_EMAIL_FROM to a verified sender address. The Resend variables are not required when both Gmail variables are configured. Set SITE_URL to the origin recipients can open. Recovery links expire after 30 minutes and a successful reset invalidates existing founder sessions. Moderator passwords are still managed through ADMIN_PASSWORD.

### Send resets from Gmail

Enable Google 2-Step Verification and generate an app password at https://myaccount.google.com/apppasswords. Set RESET_GMAIL_USER to your Gmail address and RESET_GMAIL_APP_PASSWORD to the generated app password. Use .env.local for local development and Production environment variables on Vercel. Restart locally and redeploy on Vercel. Retain the correct SITE_URL for each environment.

## Code quality and SEO checks

Run `npm run check:unused`, `npm test`, and `npm run build`. After building, run `node tests/seo-smoke.mjs` for read-only rendered metadata checks. See [the codebase audit](docs/codebase-audit.md) for changes and remaining scale and launch considerations. Set SITE_URL to your public HTTPS origin in production, then rebuild so static metadata routes use the correct domain.

## Inquiry inbox and replies

Open /inquiries from the moderation page for the team inbox, or from the user profile for that user's conversations. Inquiries support replies, open/answered/closed status, reopening, and confirmed permanent deletion by either participant. Deletion removes the database conversation for both sides; previously delivered emails remain in mailboxes.

Contact submissions now open their conversation immediately. Signed-in inquiries are restricted to their account owner. Guests must save the private management URL shown after submitting; never share that link publicly. Existing guest inquiries remain available to admins, and the first admin reply emails their private management link. Guest access uses SESSION_SECRET (at least 32 characters); changing that secret invalidates previous guest links. An email address alone does not grant access to an inquiry.

Admin replies use the existing Gmail SMTP credentials, or the optional Resend configuration already used for password recovery. No additional email variables are required. SITE_URL must match the origin recipients can open. Replies are stored before sending, with provider acceptance/failure visible to admins. Failed deliveries can be retried without adding another message. After five minutes, an interrupted send can be unlocked by an admin. Check Sent before retrying an uncertain delivery to avoid duplicates. Provider acceptance is not proof of inbox delivery.

There are no background email workers or incoming-email sync: users should reply through their inquiry link. Threads are limited to 100 replies of 5,000 characters each. Inbox pages show 20 threads at a time. Access and mutation checks run on the server, including for direct server-action requests.

After a production build, run `node tests/inquiries-smoke.mjs` to verify the flow with a temporary isolated MongoDB database and an intercepted email provider. It sends no real mail and cleans up its own test database.
