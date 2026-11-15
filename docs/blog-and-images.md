# Blog editor and Vercel Blob setup

## Write and publish

1. Sign in at `/admin`, then open **Blog management** (`/admin/blog`).
2. Choose **Write an article**, or open an existing guide.
3. Enter the title, author, category, summary, cover description and content. Slugs become permanent URLs after creation.
4. Use `## Heading` for sections, blank lines for paragraphs, and `- ` for bullets. Each heading needs content. Add an image as its own paragraph using `![Description](https://your-store.public.blob.vercel-storage.com/image.jpg)`.
5. Use **Preview content** to inspect the article body. Save as **Draft** to keep it private, or **Published** to make it public. Switch a published article back to Draft to unpublish it.

MongoDB stores articles in `blogPosts` within the configured `MONGODB_DB` database. Drafts are excluded from public routes and the sitemap, including drafts that override a bundled guide. The editor checks for concurrent updates instead of silently overwriting another saved revision. Publishing updates metadata, the listing page and sitemap.

The seven starter guides have been imported into the configured database. `npm run blog:seed` is safe to rerun: it only inserts missing slugs and never replaces saved articles. A bundled read-only fallback remains available when MongoDB is not configured. Production database errors are not disguised as successful saves.

## Connect a public Blob store

The application code is ready, but a storage token must be configured before uploads can work.

1. In the Vercel project, open **Storage**, create a **Blob** store, and choose **Public** access. Connect it to the IndieRally project and the environments you need.
2. Vercel provides `BLOB_READ_WRITE_TOKEN`. Ensure that exact variable is present in the project environment settings. Do not add `NEXT_PUBLIC_` to its name.
3. Add the same variable to the local `.env.local` file to upload during local development. Keep its value private and never commit it.
4. Restart the local dev server. Redeploy on Vercel after updating environment variables.
5. Open an article in `/admin/blog` and select an image under **Upload to Vercel Blob**. Save the article after the upload finishes.

Uploads require an admin session and a same-origin request. The endpoint checks file size, media type and file signature. It accepts JPEG, PNG and WebP up to 3 MB, below Vercel's 4.5 MB server request limit. Uploaded files receive unique names, so editing one article does not overwrite another article's image. The token stays on the server. These files are public; do not upload private documents or images without publication rights.

## Move the existing editorial images

After configuring the token, run:

```sh
npm run images:upload
```

This uploads all JPEG, PNG and WebP files from `public/editorial` using their existing filenames. Re-running deliberately replaces those same bundled paths; it does not touch uniquely named uploads from the editor.

Copy the printed `BLOG_BLOB_BASE_URL` value into `.env.local` and the Vercel project environment variables. Restart locally and redeploy. The app then resolves existing `/editorial/` cover and inline-image paths through Blob, including saved articles and the services-page image. Keep the local files as a fallback. New admin uploads already store their complete Blob URLs and do not depend on this base variable.

Replacing or unpublishing an article does not delete its old Blob files. Review unused assets in Vercel Storage before removing them; another article or external page may still reference them. Logos and UI icons remain code/static assets.

## Editorial truthfulness

The Khuram Shahzad article is a hypothetical portfolio launch walkthrough, explicitly labeled as an illustrative case study in the listing and article. The only factual context is the public portfolio at https://www.khuramshahzad.dev/. It contains no invented client relationship, testimonial, campaign delivery, traffic metric or revenue outcome. Replace it with a verified customer story only when permission and evidence are available.

## Checks

`npm test` validates article structure, image URLs and starter content. `npm run check:unused` and `npm run build` check the code. After building, run `node tests/blog-smoke.mjs` to verify draft privacy, publication, unpublication, access control, sitemap updates and upload guards in a temporary database. The test does not upload files to a real Blob store.

References: [Vercel public Blob storage](https://vercel.com/docs/vercel-blob/public-storage) and [server uploads](https://vercel.com/docs/vercel-blob/server-upload).
