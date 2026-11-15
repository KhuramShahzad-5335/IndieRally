export const plans = [
  { id: "starter", name: "Starter", price: 49, placements: 20 },
  { id: "growth", name: "Growth", price: 119, placements: 60 },
  { id: "reach", name: "Reach", price: 199, placements: 100 },
];
export const articles = [
  {
    "slug": "launch-checklist",
    "title": "A practical checklist for launch day",
    "alt": "Notes being written by hand",
    "paragraphs": [
      "A launch starts with a promise your audience can understand. Write one sentence that tells readers who the product is for and what they can get done. If the sentence could describe five competitors, add the specific workflow or outcome that makes yours useful. “Turn customer calls into tagged feature requests” gives a product manager something concrete to evaluate.\n\nShow that sentence to someone who has never used the product. Ask them to tell you what it does, who they think should use it, and what they would click next. Disagreement is a useful signal. Revise the listing and landing page together so a visitor arriving from either place gets the same answer.",
      "Walk through the entire path on desktop and mobile in a private browser. Start at the public listing, open the website, create a new account, and complete the first useful task. Record every place where you need a password, sample input, or permission you didn’t expect. Check that the application explains what to do while uploads or background jobs run.\n\nPrepare a lightweight demo for people who want to understand the tool before creating an account. A short screen recording or a pair of screenshots can show what goes in and what comes out. Use sample data you can publish, and check that the images and captions remain legible on a phone.",
      "Set aside time to reply to questions while the launch is active. Keep a simple note with each question and the page or step that prompted it. If several people ask whether they can export a result, add the answer where readers are deciding whether to try the product.\n\nAfter the round closes, compare referral visits with meaningful actions such as publishing a report or inviting a teammate. Small samples rarely tell you which channel will scale. They can still reveal where people got stuck. Pick one change you can make this week and name the signal you’ll watch on the next launch."
    ]
  },
  {
    "slug": "choosing-directories",
    "title": "How to choose software directories",
    "alt": "Open planner on a desk",
    "paragraphs": [
      "Write down two or three situations in which someone would look for your product. A studio evaluating shared asset libraries may browse design communities. An engineer comparing deployment tools may start with a specialized catalog or an ecosystem marketplace. Use those situations to find destinations whose categories already match the decision.\n\nInspect a few recent listings before you commit. Look for clear taxonomy, working product links, and enough detail to compare alternatives. Check when the catalog was last updated and whether its submission requirements are practical for your team.",
      "Build a small campaign sheet with the directory, category, destination URL, date submitted, status, and live link. Capture the version of the copy you used and any approval steps. That record helps you avoid duplicate submissions and makes it clear where the next action belongs.\n\nKeep your facts consistent across directories. You can change the opening sentence for an audience of engineers or marketers, but retain the same pricing, product name, and core capabilities. If a directory asks for verification or a fee, record it and decide whether the placement still fits your budget before proceeding.",
      "Review published listings after enough time for referrals to arrive. Compare visits, signup intent, and the first useful task completed. A niche placement can send a handful of visitors who are already looking for your workflow, while a broad listing can surface a much wider range of intent.\n\nKeep the destinations that send relevant readers or provide a genuinely useful place to compare products. Put low-signal destinations on hold and revisit them when your product or target audience changes. Set a review date for pending applications so the work stays bounded."
    ]
  },
  {
    "slug": "write-a-listing",
    "title": "Write a product listing people can scan",
    "alt": "Laptop on a desk in a software workspace",
    "paragraphs": [
      "The first line should answer what someone can do with the product. “Send a weekly inventory report from Shopify” describes a task a reader can recognize. Follow it with a short explanation of the user, the input, and the result. Include technical terms when they help someone decide whether the tool fits their workflow.\n\nUse the next part of the listing to explain any material prerequisite. If the product requires a paid integration or only supports specific file types, say so early. Readers can then understand what trying it would involve.",
      "Choose screenshots that answer questions raised by the copy. Start with the main workflow, then show the completed result. For an inventory tool, show how a store connects and what the report looks like when it arrives. Use captions to explain decisions a screenshot cannot convey on its own.\n\nOpen the listing on a phone. Check that the smallest text can be understood, crop out unrelated UI, and give meaningful images useful alternative text. Use synthetic or permitted sample data so the screenshots can remain public.",
      "Send people to the page that lets them act on the promise they just read. A working demo, signup page, or documented quickstart makes a good destination when it matches the product. Explain whether the reader needs a credit card or should expect to book a call.\n\nFinally, ask someone to skim the page and describe the product without scrolling back. If they remember a vague benefit and miss the main task, improve the tagline or move the most relevant screenshot up. Keep the listing current as your pricing, integrations, and onboarding change."
    ]
  }
];
export const editorialImageBase = "https://txismjecibo2zetc.public.blob.vercel-storage.com";
export const blogImageBase = () => (process.env.BLOG_BLOB_BASE_URL || editorialImageBase).replace(/\/$/, "");
export const cover = (slug: string) => blogImageBase() + "/editorial/" + slug + ".jpg";
