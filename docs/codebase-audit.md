# Codebase review — November 16, 2026

Reviewed the App Router routes, shared components, data adapters, account and moderation actions, metadata, assets, scripts, tests, and setup documentation.

## Implemented

- Consolidated three MongoDB client implementations into one reusable pool. Failed initial connections close and can retry. Existing collections, indexes, transactions and the local JSON adapter remain supported.
- Deduplicated current-account reads within a server render and product lookups shared by metadata and page rendering. This is request-scoped React caching, not a shared cache of signed-in users.
- Pushed category filtering into repository queries, avoided repeated homepage sorting, and built each search string once per listing rather than once per search term.
- Consolidated public metadata, added missing policy descriptions, complete social cards and a local generated sharing image. No external image service is needed for the default card.
- Centralized canonical origin selection. Production falls back to the existing IndieRally Vercel domain rather than localhost; explicitly configure SITE_URL for your actual public domain.
- Kept private routes out of the sitemap and marked the protected submission page noindex. Crawlers can read noindex directives instead of being blocked by robots.txt. Authentication still protects private data.
- Search filter pages remain noindex; marketing tracking parameters alone no longer make the homepage noindex. Sitemap modification times use actual recorded listing history.
- Added article publication and publisher metadata and corrected responsive image sizing to match full-width article and blog layouts.
- Removed redundant connection setup and metadata declarations. No orphaned component files were found; no working components were deleted simply to reduce file count.
- Corrected the obsolete README claim that password recovery was missing and clarified Gmail versus Resend configuration.

## Verification commands

`npm run check:unused` checks application source without reporting Next.js-generated validator code as unused. `npm test` covers domain logic and metadata helpers. `npm run build` checks the production bundle. After building, `node tests/seo-smoke.mjs` checks rendered public metadata and the sharing image without database access. The existing moderation workflow test uses an isolated local catalog.

## Follow-up work, not claimed complete

- The directory still loads the published catalog for search. Database-side search, pagination and vote aggregation should be designed before a large catalog rollout.
- Authentication and reset requests need broader abuse rate limiting; the existing per-account reset cooldown is not an IP-level control. Email verification is not implemented.
- Public pages render dynamically because the shared header reads session cookies. Splitting public and personalized rendering is a larger architectural change, not a safe blanket caching switch.
- Launch scores, Core Web Vitals, Search Console indexing, and rich-result eligibility need verification against the deployed production domain. Code changes alone cannot guarantee a 100% SEO score or rankings.
- Weekly archive URLs currently canonicalize to Explore; a permanent, independently indexed archive would need stable archive routes and sitemap entries beyond the rolling three-week interface.

Sources: [Next.js metadata and request memoization](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing), and [Google sitemap modification guidance](https://developers.google.com/search/blog/2014/10/best-practices-for-xml-sitemaps-rssatom).

## Results

Passed the unused-source check, nine unit tests, production build, rendered SEO smoke test, isolated local moderation workflow, and MongoDB account workflow in a separate audit database. The account workflow verified signup, sign-in, sign-out, protected routes and founder submission, then removed its test records. No production deployment was performed.
