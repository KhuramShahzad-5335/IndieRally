import { put } from "@vercel/blob";
import { readFile, readdir } from "node:fs/promises";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Connect a PUBLIC Vercel Blob store, then set BLOB_READ_WRITE_TOKEN in .env.local.");
const folders = ["public/editorial", ".data/blob-image-backup"];
let source;
for (const folder of folders) { try { const files = (await readdir(folder)).filter(name => /\.(jpe?g|png|webp)$/i.test(name)); if (files.length) { source = { folder, files }; break; } } catch {} }
if (!source) throw new Error("No editorial image files found. Put JPEG, PNG or WebP files in public/editorial first.");
const { folder, files } = source;
let origin;
for (const name of files) {
  const pathname = "editorial/" + name;
  const extension = name.split(".").at(-1).toLowerCase();
  const blob = await put(pathname, await readFile(folder + "/" + name), {
    access: "public", addRandomSuffix: false, allowOverwrite: true,
    contentType: extension === "jpg" || extension === "jpeg" ? "image/jpeg" : "image/" + extension,
  });
  origin = new URL(blob.url).origin;
  console.log("Uploaded: " + blob.url);
}
console.log("Set this public origin locally and on Vercel, then restart/redeploy:");
console.log("BLOG_BLOB_BASE_URL=" + origin);
console.log("Public pages now load these assets from Blob. Local source copies are kept in the gitignored .data/blob-image-backup folder for future migrations.");
