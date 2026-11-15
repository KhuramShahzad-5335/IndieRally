import "server-only";
import nodemailer from "nodemailer";

export async function sendInquiryEmail(to: string, text: string, id: string) {
  const { RESET_GMAIL_USER, RESET_GMAIL_APP_PASSWORD, RESET_EMAIL_API_KEY, RESET_EMAIL_FROM } = process.env;
  const subject = "IndieRally replied to your inquiry · " + id.slice(-6);
  if (RESET_GMAIL_USER && RESET_GMAIL_APP_PASSWORD) {
    const smtp = nodemailer.createTransport({
      host: "smtp.gmail.com", port: 465, secure: true,
      auth: { user: RESET_GMAIL_USER, pass: RESET_GMAIL_APP_PASSWORD.replace(/\s/g, "") },
      connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 8000,
    });
    try {
      const result = await smtp.sendMail({ from: { name: "IndieRally", address: RESET_GMAIL_USER }, to, subject, text, disableFileAccess: true, disableUrlAccess: true });
      if (!result.accepted.length) throw new Error("Email was not accepted.");
    } finally { smtp.close(); }
    return;
  }
  if (!RESET_EMAIL_API_KEY || !RESET_EMAIL_FROM) throw new Error("Email is not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST", headers: { Authorization: "Bearer " + RESET_EMAIL_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESET_EMAIL_FROM, to: [to], subject, text }), signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Email provider rejected delivery.");
}
