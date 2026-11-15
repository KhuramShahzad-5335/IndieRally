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

For a public release, configure HTTPS, rate limits on authentication and submission, and an account recovery process. This version has no email verification or password reset.

## IndieRally pages and launch rounds

Approved listings are queued for the next Monday at midnight UTC. A request after that time sees the listing live without a scheduler. Voting is limited to signed-in accounts and the active UTC week. Explore includes the current round and the last three completed weeks. The database and collection retain their existing names.

Contact and package requests go to the MongoDB inquiries collection. Moderators can read the latest requests at the existing private moderation route. Packages are quote requests with proposed starting prices, with manual fulfillment.

Articles are maintained in lib/editorial.ts. The three bundled editorial covers are served through Next Image. To use Vercel Blob, set BLOB_READ_WRITE_TOKEN for a public store, run node --env-file=.env.local scripts/upload-editorial.mjs, and set BLOG_BLOB_BASE_URL from its output. Rebuild after setting the origin. Local covers are sourced from Unsplash.

## Founder password reset

Set RESET_EMAIL_API_KEY to a Resend API key and RESET_EMAIL_FROM to a verified sender address. Set SITE_URL to the origin recipients can open. Recovery links expire after 30 minutes and a successful reset invalidates existing founder sessions. Moderator passwords are still managed through ADMIN_PASSWORD.

### Send resets from Gmail

Enable Google 2-Step Verification and generate an app password at https://myaccount.google.com/apppasswords. Set RESET_GMAIL_USER to your Gmail address and RESET_GMAIL_APP_PASSWORD to the generated app password. Use .env.local for local development and Production environment variables on Vercel. Restart locally and redeploy on Vercel. Retain the correct SITE_URL for each environment.
