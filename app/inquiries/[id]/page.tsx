import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentAccount } from "@/lib/accounts";
import { isAdmin } from "@/lib/auth";
import { inquiryAccess } from "@/lib/inquiry-access";
import { InquiryThread } from "@/components/inquiries/inquiry-thread";

export const metadata = { title: "Inquiry conversation", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default async function InquiryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }> }) {
  const { id } = await params;
  const { token } = await searchParams;
  if (!/^[a-f0-9]{24}$/.test(id)) notFound();
  if (!token && !(await isAdmin()) && !(await currentAccount())) redirect("/login?inquiry=" + id);
  const access = await inquiryAccess(id, typeof token === "string" ? token : "");
  if (!access) notFound();
  return <div className="mx-auto w-[calc(100%-32px)] max-w-6xl py-12 md:w-[90%]">
    <Link href={access.admin || access.item.ownerId ? "/inquiries" : "/contact"} className="text-sm text-subtle underline underline-offset-4">← {access.admin || access.item.ownerId ? "All inquiries" : "Contact IndieRally"}</Link>
    <p className="mt-7 text-xs uppercase tracking-widest text-muted">Your conversation with IndieRally</p>
    <h1 className="mt-3 text-3xl sm:text-4xl">{access.item.topic === "general" ? "Let's talk about it." : "Your " + access.item.topic + " request"}</h1>
    {!access.admin && !access.item.ownerId && <p className="mt-4 rounded-xl border border-line bg-soft p-4 text-sm leading-6">Save this page's link to return to your inquiry. It gives access to this conversation, including replies and deletion—keep it private.</p>}
    <InquiryThread item={access.item} id={id} admin={access.admin} token={access.token}/>
  </div>;
}
