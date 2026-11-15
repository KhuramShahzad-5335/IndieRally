import { ActionForm } from "@/components/forms/action-form";
import { changeStatus, deleteInquiry, reply, retryEmail, recoverEmail } from "@/app/inquiries/actions";
import type { Inquiry } from "@/lib/inquiries";

const date = (value: Date) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(value) + " UTC";

export function InquiryThread({ item, id, admin, token }: { item: Inquiry; id: string; admin: boolean; token: string }) {
  return <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
    <div className="min-w-0 space-y-5">
      <article className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <div className="flex flex-wrap justify-between gap-2 text-sm"><h2 className="text-base tracking-normal">{item.name} · Original inquiry</h2><time className="text-muted" dateTime={item.createdAt.toISOString()}>{date(item.createdAt)}</time></div>
        <p className="mt-4 whitespace-pre-wrap wrap-anywhere leading-7">{item.message}</p>
      </article>
      {item.messages?.map(message => <article key={message.id} className={`rounded-2xl border border-line p-5 sm:p-7 ${message.role === "admin" ? "bg-soft" : "bg-surface"}`}>
        <div className="flex flex-wrap justify-between gap-2 text-sm"><h2 className="text-base tracking-normal">{message.role === "admin" ? "IndieRally team" : item.name}</h2><time className="text-muted" dateTime={message.at.toISOString()}>{date(message.at)}</time></div>
        <p className="mt-4 whitespace-pre-wrap wrap-anywhere leading-7">{message.text}</p>
        {admin && message.delivery && <p className="mt-4 text-xs text-muted">Email: {message.delivery === "sent" ? "accepted by provider" : message.delivery === "sending" ? "processing — refresh for updates" : "delivery not confirmed"}</p>}
        {admin && message.delivery === "failed" && <ActionForm action={retryEmail.bind(null, id, message.id)} label="Retry email" pendingLabel="Retrying…" className="mt-4">
          <label className="!flex items-start gap-2 text-xs"><input type="checkbox" name="confirm" required className="mt-1"/>If the previous request timed out after sending, retrying may send a duplicate email.</label>
        </ActionForm>}
        {admin && message.delivery === "sending" && message.deliveryAt && Date.now() - message.deliveryAt.getTime() > 300000 && <ActionForm action={recoverEmail.bind(null, id, message.id)} label="Unlock interrupted delivery" className="mt-4">
          <label className="!flex items-start gap-2 text-xs"><input type="checkbox" name="confirm" required/>I will check the sender's Sent folder before retrying this email.</label>
        </ActionForm>}
      </article>)}
      {item.status !== "closed" ? <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <h2 className="text-xl">{admin ? "Reply to this inquiry" : "Continue the conversation"}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{admin ? "Your reply is saved here and emailed to the sender. Delivery failures appear in this thread." : "Your message will appear in the team's inquiry inbox."}</p>
        <ActionForm action={reply.bind(null, id, token)} label={admin ? "Save reply & send email" : "Send reply"} pendingLabel="Sending reply…" className="mt-5 [&>button]:w-full">
          <label className="text-sm">Message<textarea name="message" rows={6} required minLength={2} maxLength={5000} placeholder="Write your reply…"/></label>
        </ActionForm>
      </section> : <p role="status" className="rounded-xl bg-soft p-5 text-sm">This inquiry is closed. Reopen it to continue the conversation.</p>}
    </div>
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-lg">Inquiry details</h2>
        <dl className="mt-4 space-y-3 text-sm"><div><dt className="text-muted">Status</dt><dd className="mt-1 capitalize">{item.status ?? "open"}</dd></div><div><dt className="text-muted">Reply address</dt><dd className="mt-1 break-all">{item.email}</dd></div><div><dt className="text-muted">Topic</dt><dd className="mt-1 capitalize">{item.topic}</dd></div><div><dt className="text-muted">Reference</dt><dd className="mt-1 font-mono">{id.slice(-6)}</dd></div></dl>
        <ActionForm action={changeStatus.bind(null, id, token)} label={item.status === "closed" ? "Reopen inquiry" : "Close inquiry"} className="mt-5 [&>button]:w-full">
          <input type="hidden" name="status" value={item.status === "closed" ? "open" : "closed"}/>
        </ActionForm>
      </section>
      <details className="rounded-2xl border border-line p-5">
        <summary className="cursor-pointer text-sm font-semibold">Delete inquiry</summary>
        <p className="mt-3 text-xs leading-6 text-muted">Permanently deletes this conversation for you and the other participant. Emails already sent cannot be recalled.</p>
        <ActionForm action={deleteInquiry.bind(null, id, token)} label="Permanently delete" pendingLabel="Deleting…" className="mt-4 [&>button]:w-full">
          <label className="!flex items-start gap-2 text-xs"><input type="checkbox" name="confirm" required className="mt-1"/>I understand this cannot be undone.</label>
        </ActionForm>
      </details>
    </aside>
  </div>;
}
