import { ImageResponse } from "next/og";

export const alt = "IndieRally — Launch indie. Get discovered.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#f8f8f8", color: "#212121", padding: 72 }}>
      <div style={{ display: "flex", fontSize: 28 }}>IR / IndieRally</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 86, fontWeight: 700, letterSpacing: -4 }}><span>Launch indie.</span><span>Get discovered.</span></div>
      <div style={{ display: "flex", fontSize: 25, color: "#686868" }}>Independent software. Weekly launches. A place to grow.</div>
    </div>, size,
  );
}
