import Link from "next/link";

export const metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return <article className="mx-auto w-[90%] max-w-3xl space-y-6 py-12">
    <h1>Privacy</h1>
    <section className="space-y-2"><h2>What we collect</h2><p>IndieRally stores your email, display name, and a password hash when you create an account. We store submissions, votes, and messages when you use those features. Approved listing details appear publicly.</p></section>
    <section className="space-y-2"><h2>How we use it</h2><p>We use this information to sign you in, review products, manage rankings, respond to inquiries, and send password reset links when requested. Session cookies keep you signed in.</p></section>
    <section className="space-y-2"><h2>Service providers</h2><p>Account and listing records are stored in MongoDB. When password reset email is enabled, our email provider receives the recipient address and reset message to deliver it.</p></section>
    <section className="space-y-2"><h2>Your account and requests</h2><p>You can update your name or delete your account from <Link className="underline" href="/profile">Profile</Link>. To ask about information you shared as a guest, use the <Link className="underline" href="/contact">contact form</Link>.</p></section>
  </article>;
}

