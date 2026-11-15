"use server";

import { ObjectId } from "mongodb";
import { guestInquiryToken, inquiryPath } from "@/lib/inquiry-access";

import { currentAccount } from "@/lib/accounts";
import { inbox } from "@/lib/inquiries";
import { plans } from "@/lib/editorial";
import { redirect } from "next/navigation";

export async function send(_: string, form: FormData) {
  const read = (key: string) => String(form.get(key) ?? "").trim();
  const name = read("name"), email = read("email"), topic = read("topic"), message = read("message");
  if(name.length < 2 || name.length > 80 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || message.length > 3000 || !["general",...plans.map(p=>p.id)].includes(topic)) return "Check your name, email, topic, and message.";
  if(read("fax")) return "Unable to submit this message.";
  let destination = "/inquiries";
  try { const account = await currentAccount(); const _id = new ObjectId(); const token = account ? "" : guestInquiryToken(String(_id));
    await (await inbox()).insertOne({_id,name,email:email.toLowerCase(),topic,message,createdAt:new Date(),status:"open",messages:[],...(account ? {ownerId:account._id} : {})});
    destination = inquiryPath(String(_id),token); } catch { return "Your message could not be saved. Please try again."; }
  redirect(destination);
}
