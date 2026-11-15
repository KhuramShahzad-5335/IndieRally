import { put } from "@vercel/blob";
import { readFile } from "node:fs/promises";
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) throw new Error("Set BLOB_READ_WRITE_TOKEN for a public Vercel Blob store.");
const names = ["launch-checklist", "choosing-directories", "write-a-listing"];
for (const name of names) {
  const pathname = "editorial/" + name + ".jpg";
  const blob = await put(pathname, await readFile("public/" + pathname), {
    token, access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "image/jpeg",
  });
  console.log(blob.url);
  if (name === names[0]) console.log("BLOG_BLOB_BASE_URL=" + new URL(blob.url).origin);
}