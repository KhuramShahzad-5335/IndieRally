import { put } from "@vercel/blob";
import { readFile, readdir } from "node:fs/promises";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Connect a PUBLIC Vercel Blob store, then set BLOB_READ_WRITE_TOKEN in .env.local.");
const files = (await readdir("public/editorial")).filter(name => /\.(jpe?g|png|webp)$/i.test(name));
let origin;
for (const name of files) {
  const pathname = "editorial/" + name;
  const extension = name.split(".").at(-1).toLowerCase();
  const blob = await put(pathname, await readFile("public/" + pathname), {
    access: "public", addRandomSuffix: false, allowOverwrite: true,
    contentType: extension === "jpg" || extension === "jpeg" ? "image/jpeg" : "image/" + extension,
  });
  origin = new URL(blob.url).origin;
  console.log("Uploaded: " + blob.url);
}
console.log("Set this public origin locally and on Vercel, then restart/redeploy:");
console.log("BLOG_BLOB_BASE_URL=" + origin);
console.log("Bundled and saved /editorial/ image paths now resolve through that origin; keep local copies as a fallback.");
