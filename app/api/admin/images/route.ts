import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Admin sign-in required." }, { status: 401 });
  // Next may use its internal hostname in request.url; Host identifies the browser-facing origin.
  const expectedOrigin = new URL(request.url).protocol + "//" + request.headers.get("host");
  if (request.headers.get("origin") !== expectedOrigin) return Response.json({ error: "Invalid upload origin." }, { status: 403 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Connect a public Vercel Blob store and set BLOB_READ_WRITE_TOKEN first." }, { status: 503 });
  if (Number(request.headers.get("content-length")) > 4 * 1024 * 1024) return Response.json({ error: "Choose an image under 3 MB." }, { status: 413 });
  try {
    const file = (await request.formData()).get("image");
    if (!(file instanceof File) || !file.size || file.size > 3 * 1024 * 1024) return Response.json({ error: "Choose an image under 3 MB." }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    const type = jpeg ? "image/jpeg" : png ? "image/png" : webp ? "image/webp" : "";
    if (!type || file.type !== type) return Response.json({ error: "Only valid JPEG, PNG, or WebP images are allowed." }, { status: 400 });
    const blob = await put("editorial/upload." + (jpeg ? "jpg" : png ? "png" : "webp"), bytes, { access: "public", addRandomSuffix: true, contentType: type });
    return Response.json({ url: blob.url });
  } catch { return Response.json({ error: "Upload failed. Check your public Blob store connection and try again." }, { status: 502 }); }
}
