"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { inquiryAccess, inquiryPath, guestInquiryToken } from "@/lib/inquiry-access";
import { inbox, type InquiryMessage } from "@/lib/inquiries";
import { sendInquiryEmail } from "@/lib/inquiry-email";
import { siteOrigin } from "@/lib/seo";

function refresh(id: string) {
  revalidatePath("/inquiries"); revalidatePath("/admin"); revalidatePath("/profile"); revalidatePath("/inquiries/" + id);
}

export async function reply(id: string, token: string, _: string, form: FormData) {
  const access = await inquiryAccess(id, token);
  if (!access) return "This inquiry is unavailable.";
  const text = String(form.get("message") ?? "").trim();
  if (text.length < 2 || text.length > 5000) return "Use 2–5,000 characters.";
  if (access.item.status === "closed") return "Reopen this inquiry before replying.";
  const message: InquiryMessage = { id: randomUUID(), role: access.admin ? "admin" : "user", text, at: new Date(), ...(access.admin ? { delivery: "sending" as const } : {}) };
  if (access.admin) message.deliveryAt = message.at;
  const collection = await inbox();
  const saved = await collection.updateOne({ _id: access.item._id, status: { $ne: "closed" }, "messages.99": { $exists: false }, "messages.delivery": { $ne: "sending" } }, {
    $push: { messages: message }, $set: { updatedAt: message.at, status: access.admin ? "answered" : "open" },
  });
  if (!saved.modifiedCount) return "A reply is being processed, this inquiry changed, or the 100-message limit was reached. Refresh and try again.";
  if (access.admin) {
    const delivered = await deliver(id, access.item, message);
    refresh(id);
    if (!delivered) return "Reply saved, but email delivery could not be confirmed. Use Retry email below; do not submit the reply again.";
  }
  refresh(id);
  redirect(inquiryPath(id, access.token));
}

async function deliver(id: string, item: { email: string; ownerId?: string }, message: InquiryMessage) {
  let sent = false;
  try {
    const link = new URL(inquiryPath(id, item.ownerId ? "" : guestInquiryToken(id)), siteOrigin());
    await sendInquiryEmail(item.email, message.text + "\n\nRead and reply securely on IndieRally:\n" + link.href + "\n\nKeep this link private. Reply in the inquiry thread to keep the conversation together.", id);
    sent = true;
  } catch { /* Keep credentials, recipient addresses and access links out of logs. */ }
  await (await inbox()).updateOne({ "messages.id": message.id }, { $set: { "messages.$.delivery": sent ? "sent" : "failed" } });
  return sent;
}

export async function retryEmail(id: string, messageId: string, _: string, form: FormData) {
  const access = await inquiryAccess(id);
  if (!access?.admin) return "Admin access is required.";
  if (form.get("confirm") !== "on") return "Confirm the retry first.";
  const message = access.item.messages?.find(entry => entry.id === messageId && entry.role === "admin" && entry.delivery === "failed");
  if (!message) return "This email is not available for retry.";
  const claimed = await (await inbox()).updateOne({ _id: access.item._id, messages: { $elemMatch: { id: messageId, delivery: "failed" } }, "messages.delivery": { $ne: "sending" } }, { $set: { "messages.$.delivery": "sending", "messages.$.deliveryAt": new Date() } });
  if (!claimed.modifiedCount) return "Another delivery is in progress. Refresh this page.";
  const sent = await deliver(id, access.item, message);
  refresh(id);
  return sent ? "Email accepted by the provider." : "Delivery could not be confirmed. Check your email configuration before retrying.";
}

export async function recoverEmail(id: string, messageId: string, _: string, form: FormData) {
  const access = await inquiryAccess(id);
  if (!access?.admin) return "Admin access is required.";
  if (form.get("confirm") !== "on") return "Confirm recovery first.";
  const changed = await (await inbox()).updateOne({ _id: access.item._id, messages: { $elemMatch: { id: messageId, delivery: "sending", deliveryAt: { $lt: new Date(Date.now() - 300000) } } } }, { $set: { "messages.$.delivery": "failed" } });
  refresh(id);
  return changed.modifiedCount ? "Interrupted attempt unlocked. Check the sender's Sent folder before retrying." : "Wait five minutes after delivery started, then refresh.";
}

export async function changeStatus(id: string, token: string, _: string, form: FormData) {
  const access = await inquiryAccess(id, token);
  if (!access) return "This inquiry is unavailable.";
  const status = form.get("status");
  if (status !== "open" && status !== "closed") return "Choose open or closed.";
  await (await inbox()).updateOne({ _id: access.item._id }, { $set: { status, updatedAt: new Date() } });
  refresh(id);
  redirect(inquiryPath(id, access.token));
}

export async function deleteInquiry(id: string, token: string, _: string, form: FormData) {
  const access = await inquiryAccess(id, token);
  if (!access) return "This inquiry is unavailable.";
  if (form.get("confirm") !== "on") return "Confirm permanent deletion first.";
  const result = await (await inbox()).deleteOne({ _id: access.item._id, "messages.delivery": { $ne: "sending" } });
  if (!result.deletedCount) return "An email is being processed. Try again after it finishes.";
  refresh(id);
  redirect(access.admin ? "/inquiries?deleted=1" : access.item.ownerId ? "/inquiries?deleted=1" : "/contact?deleted=1");
}
