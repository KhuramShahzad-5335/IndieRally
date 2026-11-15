// Loaded only by inquiries-smoke.mjs, never by the application itself.
const fs = require("node:fs");
if (!process.env.INQUIRY_TEST_OUTBOX) throw new Error("Missing isolated test outbox.");
const original = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  if (String(input) === "https://api.resend.com/emails") {
    const mail = JSON.parse(init.body);
    fs.appendFileSync(process.env.INQUIRY_TEST_OUTBOX, JSON.stringify(mail) + "\n");
    const fail = fs.existsSync(process.env.INQUIRY_TEST_OUTBOX + ".fail");
    return new Response(JSON.stringify(fail ? { error: "Test rejection" } : { id: "test-message" }), { status: fail ? 503 : 200, headers: { "Content-Type": "application/json" } });
  }
  return original(input, init);
};
