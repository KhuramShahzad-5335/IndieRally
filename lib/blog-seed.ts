import { articles, cover } from "./editorial.ts";
import type { BlogPost } from "./blog-domain";

const headings: Record<string, string[]> = {
  "launch-checklist": ["Clarify your pitch", "Test the signup journey", "Learn from launch day"],
  "choosing-directories": ["Start with your audience", "Track each submission", "Measure results"],
  "write-a-listing": ["Lead with the outcome", "Show the workflow", "Give readers a next step"],
};
const date = "2026-11-16T00:00:00.000Z";
const guide = (slug: string, title: string, description: string, category: string, imageSlug: string, imageAlt: string, body: string): BlogPost => ({ slug, title, description, category, image: cover(imageSlug), imageAlt, body, author: "IndieRally Editorial", status: "published", createdAt: date, updatedAt: date, publishedAt: date });

export const seedPosts: BlogPost[] = [
  ...articles.map(post => ({ slug: post.slug, title: post.title, description: post.paragraphs[0].split(". ")[0] + ".", author: "IndieRally Editorial", category: "Launch guides", image: cover(post.slug), imageAlt: post.alt, body: post.paragraphs.map((text, index) => "## " + headings[post.slug][index] + "\n\n" + text).join("\n\n"), status: "published" as const, createdAt: "2026-11-14T00:00:00.000Z", updatedAt: "2026-11-14T00:00:00.000Z", publishedAt: "2026-11-14T00:00:00.000Z" })),
  guide("how-indierally-works", "Your product's journey through IndieRally", "A practical guide to submitting your software, working through review, joining a weekly launch, and finding your next step.", "Getting started", "launch-checklist", "Notes being written while preparing a launch", `## Start with a useful product and a clear promise

IndieRally gives independent developers and small teams a place to introduce their software. The core journey is straightforward: create an account, submit a product, work through editorial review, and join a weekly launch round. Visitors can discover the published listing, follow its website link, and support it with an upvote while its round is active.

The platform is a discovery channel. Your own website still handles product onboarding, pricing, payments, and support. A strong listing helps a visitor decide whether your product fits their task; a working onboarding journey helps that visitor actually use it. Prepare both before submitting.

## Prepare your submission

Use the submission form to provide a name, tagline, description, website, maker name, category, and pricing model. Explain a recognizable task in the tagline. Use the description to describe the audience, main workflow, and important limitations. Choose the closest existing category rather than stretching the description to fit a popular one.

- Use a working HTTPS product website.
- Explain what someone can do with the product today.
- Select Free, Freemium, or Paid to match the actual offer.
- Keep your claims consistent with the destination website.
- Test the main action on mobile as well as desktop.

A listing should help a stranger make a decision. Claims such as “the ultimate tool for everyone” make that decision harder. A specific explanation of the input, task, and result is more useful than a long list of adjectives.

## Understand the review states

Your founder dashboard shows your submissions and their current state. Pending means the team has not finished reviewing the listing. Changes requested means there is feedback to address before another review. Open the submission, read the note, revise the details, and submit it again. Rejected means the current submission was declined.

Approval schedules the listing for the next weekly round. A scheduled product is not yet a public launch. This separation lets the team review submissions without making unfinished or future listings visible in discovery. Review timing is not an instant-publication promise; use the inquiry inbox if you need clarification about a specific submission.

## Join the weekly round

Rounds start on Monday at midnight UTC. Once the scheduled time arrives, an approved listing becomes visible without the founder needing to press a second launch button. Signed-in visitors can upvote during the active week. A visitor who is not signed in is asked to sign in first.

Explore shows the current round and the previous three weeks. Closed-round votes become the final result for that round, while the product detail page continues to explain the software. A high rank reflects the platform's recorded votes; it does not establish revenue, customer satisfaction, or suitability for every reader.

## Keep the conversation moving

Use your profile to reach your products and inquiry conversations. If you need help, submit a contact request while signed in so it appears in your account's inquiry inbox. Replies from the IndieRally team are stored in that conversation and emailed to the address on the inquiry.

Guest inquiries have a private management link instead. Keep it safe: it grants access to the conversation. Reply in the web thread to keep the context together, and close the inquiry when the issue is resolved. Deleting a conversation removes it for both participants but cannot recall emails that were already sent.

## Choose your next step

Start with a focused listing and a reliable destination page. If you also want help with external directory submissions, read the service guide and compare the packages. Those campaigns are separate from the platform's weekly launch and need an agreed scope.

After your round, look at the quality of the visits and questions you received. Fix one confusing part of the journey, update your product materials, and use what you learned to decide where to invest next.`),
  guide("directory-services-explained", "What our directory service does for your product", "Understand directory research, listing preparation, submissions, and reporting—and what to agree before a campaign begins.", "Services", "choosing-directories", "A planner open on a desk", `## Begin with the audience you want to reach

A directory campaign starts with the product and the people it serves. Tell us what the software does, who uses it, which markets or languages matter, and where the visitor should land. Share existing descriptions and public product assets so the campaign begins with approved facts.

The aim is to build a relevant distribution plan, not simply collect the largest possible number of URLs. A specialist catalog can be more useful to a product than a general list that does not match its audience. Suitability, submission requirements, and the effort needed from the founder should all inform the shortlist.

## Agree the work before it starts

The pricing page shows our directory submission packages. Selecting a package opens a request for a conversation; it is not an automatic checkout or an instant fulfillment promise. The team needs to confirm the product, destinations, deliverables, and any exceptions before work begins.

Ask what the package count represents and how pending, rejected, duplicate, or unavailable directories will be handled. External directories control their own approvals. A submission can be completed without producing a live listing, so a campaign record should distinguish the work performed from the publication outcome.

- Confirm the target audience and product URL.
- Agree the campaign scope and reporting format.
- Discuss paid directory fees and verification steps before proceeding.
- Decide who will respond when a directory needs founder input.
- Keep a copy of the agreed product description and assets.

## Prepare a consistent listing kit

We use your product information to prepare descriptions that fit each directory's categories and fields. A short tagline may need to focus on the main use case; a longer listing may allow prerequisites, integrations, or pricing details. These versions should describe the same product honestly.

Founders remain the best source for product facts. Tell us if the service is in beta, if an integration requires another subscription, or if a feature is still planned. Public copy should describe what exists. If the positioning is not settled, agree it first rather than making conflicting claims across several destinations.

## Submit and record what happened

Manual submission means following each destination's process and recording its status. Useful records include the directory name, category, submission date, requested action, status, and published URL when one becomes available. When a directory asks for a fee or account verification, that becomes a decision to resolve with the founder.

A campaign is easier to manage when exceptions are visible. “Submitted,” “waiting for verification,” and “published” mean different things. A record of those states lets you see where the work stands and prevents a pending application from being described as an approved placement.

## Evaluate results in the right place

IndieRally can help create and track the distribution work described in the agreed campaign. Visits, signups, activation, and revenue should be evaluated through your own product analytics and business records. A listing being live is evidence of publication; it is not evidence that the listing produced paying customers.

No directory campaign can promise a particular search ranking, backlink attribute, number of leads, or revenue result. External sites set their own link and review policies. Use referral information and user feedback to decide which destinations deserve continued attention.

## Work with us through your inquiry

Start from the pricing or contact page, include your product link, and describe the outcome you want to improve. If you are signed in, your inquiry is available from your profile. The admin team can reply, ask for missing information, and keep the discussion in one conversation.

Service requests are currently coordinated manually. Your account is not a live campaign-management dashboard or a paid subscription portal. The written scope and the team's updates should explain what is being delivered and what still needs your input.`),
  guide("weekly-launch-playbook", "A founder's playbook for a weekly launch", "Prepare your product page, understand the weekly leaderboard, and turn launch feedback into a useful next iteration.", "Launch guides", "write-a-listing", "Laptop on a desk ready for product launch work", `## Decide what a useful launch would teach you

Before launch week, write down the decision you want the launch to inform. You might need to learn whether visitors understand the main use case, whether onboarding works without assistance, or which audience asks the most relevant questions. Pick an observable signal that helps you make that decision.

Votes and position on a leaderboard are visible signals, but they are not the whole customer journey. A launch can be useful when it reveals a confusing setup step, even if its rank is modest. Define success in terms your team can observe instead of treating a public badge as a substitute for learning.

## Make the destination ready

Open your website as a new visitor and follow the main call to action. Confirm that the first useful task can be completed and that errors explain what to do next. If a feature needs sample data, provide safe sample data. If access requires a waitlist or an invitation, make that clear before someone commits time.

Prepare screenshots or a short demo that shows the workflow and its result. Keep product names, feature descriptions, and pricing consistent between the IndieRally listing and your site. A mismatch creates friction precisely when a visitor is deciding whether to trust the product.

## Understand scheduling and voting

An approved IndieRally submission is scheduled for the next Monday at midnight UTC. The dashboard can show a scheduled state before the public listing appears. Use UTC when coordinating your own announcements so a local time-zone assumption does not shift your plans.

Voting requires a signed-in account and is limited to the product's active weekly round. A recorded account vote cannot be added repeatedly by clicking again. At the end of the round, the score remains available as a completed result. Explore lets readers switch between the current round and the previous three weeks.

## Share a useful announcement

Tell people what the product helps them do and link to the page that explains it. If you ask someone to try it, give them a concrete task rather than expecting them to invent a use case. Invite questions and feedback from people who match the intended audience.

- State the product's main workflow in one sentence.
- Explain who it is intended for.
- Mention meaningful prerequisites or limitations.
- Offer a clear way to try the product or learn more.
- Be available to answer questions about the actual experience.

Avoid promising that a position or spotlight is guaranteed. Homepage spotlights are selected placements, and review eligibility is different from a promise of exposure. Share the product on its merits so a reader has a reason to explore beyond the ranking.

## Review what happened after the round

Separate platform activity from activity on your own website. You can observe the product's recorded votes on IndieRally. Referral visits, signups, and meaningful in-product actions need your own analytics or records. Keep the date range consistent when comparing them.

Write down recurring questions. If several visitors ask the same thing, place the answer near the relevant decision in your product journey. If people try the tool but fail at one step, investigate that step before planning a larger distribution campaign.

## Make one informed improvement

Choose one follow-up action with a clear reason: simplify an onboarding screen, replace an unclear screenshot, or rewrite the first line of the listing materials. Record the change and the signal you expect it to affect. That creates a practical learning cycle for a small team.

If your next step is an external directory campaign, bring those lessons into the brief. A sharper audience definition and a better destination page make the distribution work easier to evaluate. IndieRally can provide a place to launch and a conversation about services; your product's ongoing experience turns discovery into lasting value.`),
  guide("khuram-portfolio-launch-walkthrough", "A portfolio launch plan for Khuram Shahzad: an illustrative walkthrough", "A hypothetical campaign for khuramshahzad.dev showing how positioning, destination research, and reporting could work. Not a client success claim.", "Illustrative case study", "write-a-listing", "A software workspace used as an illustrative editorial image", `## What is real and what is hypothetical

This is an illustrative planning exercise using the public portfolio at https://www.khuramshahzad.dev/. The site presents Khuram Shahzad as a software developer and includes examples of web and application work. That public portfolio is the starting point; the campaign described below is hypothetical.

We have not established that Khuram purchased an IndieRally campaign, that submissions were performed for him, or that the work generated leads or revenue. There are no invented testimonials, traffic numbers, or customer outcomes in this walkthrough. Its purpose is to show what a well-scoped engagement could look like before anyone calls it a success story.

## Set a goal that fits a portfolio

Imagine the goal is to help prospective clients understand the kind of development work Khuram offers. The first task would be to choose one audience and one service proposition. A founder seeking an MVP and a team seeking interface improvements may need different examples before they feel ready to start a conversation.

A portfolio is also different from a standalone software product. Before proposing a listing, we would check whether the destination accepts individual developers, services, or portfolios. A software-only directory may be a poor match. The right outcome of research can be excluding a destination rather than forcing the submission into an unrelated category.

## Build a focused submission kit

For this exercise, the kit would contain a short professional introduction, a plain-language service description, a portfolio link, and approved images. Each claim would need to be supported by the portfolio or confirmed by the owner. Conceptual project previews would be described as previews, not presented as evidence of commercial delivery.

The owner would review the copy before it was distributed. If the intended audience were early-stage founders, the opening might explain the kinds of web experiences or MVP work available. That positioning would remain consistent while descriptions were adapted to each destination's field limits.

## Track work instead of manufacturing a result

The hypothetical campaign would maintain a destination log. Each row would identify the site's audience, why it was considered relevant, the submission date, any requested verification, and the final status. A published entry would include its live URL. Pending and declined applications would remain visible as separate outcomes.

If an external site asked for a fee, the decision would return to the owner before proceeding. If a destination did not accept service portfolios, it would be removed from the shortlist with the reason recorded. This is the operational value of the exercise: a clear record of what was attempted and what happened.

## Define what would qualify as success

A completed submission log and approved public listings would be delivery evidence. Relevant inquiries could be a useful business signal, but they would need to be recorded and attributed before being described as campaign results. A new project would be a stronger outcome only if the owner could establish how the opportunity arrived.

We would compare the agreed goal with actual observations, ask which listings or descriptions appeared helpful, and identify one next action. Without that evidence, the honest conclusion is a completed plan or campaign—not a claim that a specific amount of growth occurred.

## Turn this into a real case study later

A verified case study would need permission to publish, a dated scope, actual work records, and results the owner could confirm. It would separate confirmed outcomes from interpretation and include limitations such as a short observation period or other marketing activity running at the same time.

Until those records exist, this article remains a hypothetical portfolio launch plan. If you want a similar plan for your own product or portfolio, send us the website, audience, and intended outcome through the contact page. The first useful step is agreeing what would count as evidence of success.`),
];
