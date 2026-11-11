/**
 * Every piece of copy and every external link on the site.
 *
 * Anything marked TODO is a placeholder — fill it in HERE and it updates
 * everywhere. Nothing below should be duplicated into JSX.
 */

export const TODO = {
  calendly: "https://calendly.com/TODO", // TODO: real Calendly link
  whatsapp: "https://wa.me/TODO", // TODO: real WhatsApp number, digits only
  email: "goodnessaugustine29@gmail.com",
  formspreeId: "TODO", // TODO: Formspree form id -> https://formspree.io/f/<id>
  leadcoreUrl: "", // TODO: LeadCore AI live URL (empty = CTA hidden)
} as const;

export const site = {
  name: "Goodness Augustine",
  /** Logo wordmark: first part in white, second in accent. */
  brandMark: "APGEM",
  brandAccent: "NEXUS",
  brand: "APGEM Nexus",
  person: "Goodness Augustine",
  role: "Full Stack SaaS Developer · Claude AI Integration",
  // Brand leads, personal name follows — it still carries the SEO weight for
  // anyone searching him by name.
  title:
    "APGEM Nexus — Full Stack SaaS & Claude AI Development | Goodness Augustine",
  description:
    "I help founders, B2B operators and agencies build production-ready SaaS with Claude AI, Next.js, Supabase and Stripe — not demos, not prototypes.",
  email: TODO.email,
  calendly: TODO.calendly,
  whatsapp: TODO.whatsapp,
  socials: {
    upwork: "", // TODO: Upwork profile URL
    linkedin: "", // TODO: LinkedIn profile URL
    twitter: "", // TODO: Twitter/X URL
  },
} as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Is this a fit?", href: "#qualifier" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  badge: "Full Stack SaaS Developer · Claude AI Integration",
  headlineLead: "I Help",
  audiences: ["Founders", "B2B Operators", "Agencies", "Startups"],
  headlineSecondLine: "Build Production SaaS",
  headlineAccent: "That Actually Works.",
  sub: "Not just demos. Not just prototypes. Production-ready SaaS applications built with Claude AI, Next.js, Supabase, and Stripe — from first commit to live users.",
  ctaPrimary: "Book a Discovery Call",
  ctaSecondary: "View My Work",
  trust: [
    "Top Rated on Upwork",
    "100% Job Success Score",
    "5.0 ★ Rating",
    "5+ Projects Delivered",
  ],
} as const;

export const about = {
  label: "About me",
  headline: "I Build the SaaS Others Demo.",
  body: [
    "I'm Goodness Augustine — a full-stack SaaS developer and Claude AI integration specialist based in Lagos, Nigeria, working with founders, B2B operators, and agencies across the US, UK, and worldwide.",
    "I started APGEM Nexus to help serious builders turn AI ideas into production-ready products. Not vibe-coded prototypes that fall apart the moment a real user logs in — but properly architected SaaS applications with multi-tenant data isolation, real billing infrastructure, and automation that runs without a human in the loop.",
    "Most AI-built SaaS looks great on day one and falls apart on day two. Supabase RLS policies leak data. Stripe webhooks receive payments but never sync status back. Automations break silently on the third run.",
    "I build with those failure modes in mind from the first commit. Every line Claude writes gets reviewed before it ships. What you get is something you can actually grow on.",
  ],
} as const;

/**
 * Bento stats grid (reference feel). All real figures — the same ones the hero
 * trust bar and Upwork profile carry. The big accent card anchors the grid;
 * the rest tile around it at varying sizes.
 */
export const stats = {
  label: "By the numbers",
  headline: "Proof, Not Promises.",
  hero: {
    value: "100%",
    label: "Job Success Score on Upwork",
    note: "Every contract completed, every client satisfied — no exceptions, no disputes.",
  },
  items: [
    { value: "5+", label: "Production SaaS builds shipped to real users" },
    { value: "3 wks", label: "From first commit to a live product" },
    { value: "5.0", star: true, label: "Average client rating" },
    { value: "Top Rated", label: "Upwork Talent status" },
  ],
  stack: {
    label: "Core stack",
    tags: ["Next.js", "Supabase", "Claude API", "Stripe", "Twilio", "Vercel"],
  },
  reach: {
    value: "US · UK · 🌍",
    label: "Clients served worldwide — engineered from Lagos, Nigeria",
  },
} as const;

export const services = {
  label: "What I build",
  headline: ["Everything You Need.", "Nothing You Don't."],
  sub: "I focus on a handful of things and I do them properly.",
  items: [
    {
      title: "Full-Stack SaaS Development",
      body: "End-to-end SaaS applications built for real users. Multi-tenant architecture, Supabase with row-level security, Stripe billing, real-time features, and clean documentation on handoff. Not a prototype — a product.",
      tags: ["Next.js", "Supabase", "Stripe", "TypeScript"],
      image: "/work-saas-development.jpg",
    },
    {
      title: "Claude AI & LLM Integration",
      body: "Claude API integrated as the core intelligence layer of your product — not a chatbot widget bolted on at the end. Intent scoring, structured output extraction, personalized content generation, and reliable JSON output every time.",
      tags: ["Claude API", "Prompt Engineering", "AI Agents", "LLM"],
      image: "/work-claude-ai-integration.jpg",
    },
    {
      title: "AI Automation & Agent Development",
      body: "Automation pipelines that connect your CRM, lead sources, and outreach tools into one loop that runs without you. RAG agents that answer from your own documents, pricing, and policies instead of guessing — with retrieval you can audit. GoHighLevel, n8n, Make, Twilio, Resend, wired together properly with error handling and retry logic.",
      tags: ["RAG Agents", "GoHighLevel", "n8n", "Twilio", "Webhooks"],
      image: "/work-ai-automation.jpg",
    },
    {
      title: "Chatbot & AI Integration",
      body: "Custom AI chatbots and LLM-powered workflows integrated into your existing stack. Built to return reliable, structured output regardless of what the user sends — not just when the input is clean.",
      tags: ["Chatbot", "API Integration", "Automation", "Claude API"],
      image: "/work-chatbot-integration.jpg",
    },
    {
      title: "Premium Web Development & Management",
      body: "Premium, high-performing websites engineered to convert — built fast, accessible, and SEO-ready from day one, then actively maintained, monitored, and improved long after launch so performance never quietly decays over time.",
      tags: [
        "Next.js",
        "Vercel",
        "Core Web Vitals",
        "SEO",
        "Accessibility",
        "Ongoing Care",
      ],
      image: "/work-web-performance.jpg",
    },
  ],
} as const;

export const portfolio = {
  label: "Recent work",
  headline: "Built. Shipped. Live.",
  sub: "Every project here is a real production build — not a demo, not a prototype.",
  projects: [
    {
      featured: true,
      // Lifted straight out of the existing `result` string below, not a new
      // claim — just surfaced as a scannable badge instead of buried in fine
      // print at the bottom of the card.
      status: "Production",
      name: "LeadCore AI",
      tagline: "Claude-Powered Lead Qualification SaaS",
      body: "A multi-tenant SaaS platform where Claude API scores every incoming lead 0–100, extracts intent signals, and fires personalized SMS or email automatically. No human in the loop for routine leads. High-intent leads get routed to a human rep with a Claude-written context brief already prepared.",
      stack: ["Next.js 14", "Supabase", "Claude API", "Twilio", "Resend", "Stripe"],
      result: "Full production build · Multi-tenant · 3 Stripe plans · 14-day free trial",
      // Proof number. True framing of what the product actually does (Claude
      // scores + routes + replies to routine leads with no human) — not an
      // invented metric. Swap for measured data whenever you have it.
      outcome: {
        value: "0",
        label: "humans in the loop for routine leads — Claude scores, routes and replies on its own",
      },
      url: TODO.leadcoreUrl,
      cta: "View Live App",
      image: "/work-leadcore.webp",
      imageAlt: "LeadCore AI dashboard — pipeline, live lead feed and AI activity feed",
    },
    {
      featured: false,
      status: "Production",
      name: "InsureTrack",
      tagline: "Renewal Automation SaaS for Insurance Agents",
      body: "A renewal automation platform for independent insurance agents. Claude generates personalized renewal reminders and cross-sell alerts per client. Automated email and SMS sequences fire before renewal dates. Agents see a live renewal radar showing clients due in 30, 60, and 90 days.",
      stack: ["Next.js 14", "Supabase", "Claude API", "Twilio", "Resend", "Stripe"],
      result: "Live production app · $49/month SaaS · 14-day free trial",
      outcome: {
        value: "90 days",
        label: "of renewal risk surfaced in advance, so no client quietly lapses",
      },
      url: "https://insure-track-nine.vercel.app",
      cta: "View Live App",
      image: "/work-insuretrack.webp",
      imageAlt: "InsureTrack dashboard — book of business stats and cross-sell opportunities",
    },
    {
      featured: false,
      status: "Prototype",
      name: "Noveraq",
      tagline: "AI-Powered Revenue Discrepancy Detection",
      body: "An MVP prototype that uses Claude API to extract commercial terms from PDF contracts, compare them against billing CSV data, and surface revenue discrepancies with estimated financial impact. Built for B2B finance teams losing revenue because contract terms don't make it into billing systems.",
      stack: ["Next.js", "Claude API", "pdf-parse", "Papa Parse", "React PDF"],
      result: "Working prototype · PDF extraction · AI comparison engine · PDF report export",
      outcome: {
        value: "Seconds",
        label: "to reconcile a contract against billing — a manual audit takes hours",
      },
      url: "",
      cta: "",
      // No screenshot yet — renders as a compact text card. Add a path here
      // and it is promoted to a full-width showcase automatically.
      image: "",
      imageAlt: "",
    },
    {
      featured: false,
      status: "Production",
      name: "USA Care Living",
      tagline: "Claude AI Lead Scoring + GoHighLevel Automation",
      body: "A complete growth engineering system for a veteran career transition platform. Built a silent Claude AI lead scoring engine that analyzes veteran behavior and syncs intent scores to GoHighLevel custom fields. 11 automation workflows, 13 custom fields, 4 smart lists, and cross-platform tracking across Facebook Pixel, GA4, and YouTube API.",
      stack: ["Claude API", "GoHighLevel", "Facebook Pixel", "GA4", "n8n"],
      result: "Live at usacareliving.com · 11 GHL workflows · Full funnel tracking",
      outcome: {
        value: "11",
        label: "automated workflows running the funnel, with lead scoring that never sleeps",
      },
      url: "https://usacareliving.com",
      cta: "View Live Site",
      image: "",
      imageAlt: "",
    },
  ],
} as const;

export const process = {
  label: "How I work",
  headline: ["From Idea to Live Product", "in 3 Weeks."],
  steps: [
    {
      n: "01",
      title: "Discovery",
      when: "Day 1",
      body: "We talk about what you're building, what's broken, and what success looks like. I ask the questions most developers skip. You get a clear scope and fixed price before anything starts.",
    },
    {
      n: "02",
      title: "Architecture",
      when: "Days 2–3",
      body: "I design the database schema, API structure, and integration map before writing a single line of code. Production-first architecture from the start — not refactored six months later.",
    },
    {
      n: "03",
      title: "Build & Review",
      when: "Days 4–18",
      body: "Daily progress updates. Every line Claude writes gets reviewed before it ships. You can see the app working from day one — not just at the end.",
    },
    {
      n: "04",
      title: "Ship & Hand Off",
      when: "Days 19–21",
      body: "Deployed to Vercel, connected to your domain, Stripe live, all integrations tested against real services. Full documentation so your team can maintain it without me.",
    },
    {
      n: "05",
      title: "Management & Support",
      when: "Ongoing",
      body: "Launch isn't the finish line. I stay on for monitoring, security patches, performance tuning, and new features — so the product keeps improving instead of quietly decaying. Take it in-house whenever you're ready; there's no lock-in.",
    },
  ],
} as const;

/** Strip that scrolls under the hero — keeps the personal name present now
 *  that the logo is the APGEM brand mark. */
export const marquee = [
  "Goodness Augustine",
  "Full Stack SaaS Development",
  "Claude AI Integration",
  "RAG Agents & Automation",
  "Production, Not Prototypes",
] as const;

/**
 * TODO: paste real Upwork reviews here — 3-4 is plenty.
 *
 * This is the highest-impact gap on the site: the hero claims Top Rated /
 * 100% JSS / 5.0★ with nothing a stranger can verify. Empty array is
 * intentional — the section renders nothing rather than showing placeholder
 * quotes, which read worse than no section at all.
 */
export const testimonials: {
  quote: string;
  name: string;
  /** e.g. "Founder" */
  role: string;
  /** e.g. "SaaS startup, United States" — country matters for US/UK buyers */
  company: string;
}[] = [];

/** Shown above the testimonials as verifiable proof. */
export const proof = {
  rating: "5.0",
  jobSuccess: "100%",
  badge: "Top Rated on Upwork",
  // TODO: your Upwork profile URL — until it's set, the verify link is hidden
  // and the ratings claim stays unverifiable, which is the whole problem.
  profileUrl: "",
} as const;

/**
 * Objection handling. A Lagos-based developer selling into the US and UK gets
 * the same unspoken questions every time; answering them plainly removes more
 * friction than another feature paragraph.
 */
export const faq = {
  label: "Before you ask",
  headline: "The Questions You're Already Thinking.",
  items: [
    {
      q: "You're in Lagos. How does that work with my timezone?",
      a: "I'm on WAT (UTC+1), which overlaps the UK working day almost entirely and covers the US East Coast morning through mid-afternoon. I keep daily written updates so progress never depends on catching each other live, and I hold calls in your working hours, not mine. In practice most clients say it feels faster than working with someone in their own city, because there's always something finished waiting for them.",
    },
    {
      q: "Who owns the code?",
      a: "You do — completely, from the first commit. It's your repository, your Vercel project, your Supabase instance, your Stripe account, all under your own logins. I work inside your accounts rather than mine so there's nothing to transfer and nothing I can hold. No license, no retainer lock-in, no dependency on me to keep it running.",
    },
    {
      q: "What if you disappear halfway through?",
      a: "Everything lives in your accounts as it's built, not on my machine, so at any moment you have the current working state. Work is staged in milestones you approve and pay against, so you're never more than one milestone exposed. And because the architecture and schema are documented as I go, another competent developer can pick it up without archaeology.",
    },
    {
      q: "What happens after launch?",
      a: "You get full documentation, a walkthrough of how everything fits together, and a period of support to catch anything real users surface in the first weeks. After that it's your call: some clients take it in-house, others keep me on for hosting, monitoring, updates and new features under Premium Web Development & Management. There's no obligation either way.",
    },
    {
      q: "How do payments work?",
      a: "Fixed price agreed before any code is written — no hourly billing and no scope-creep invoices. It's split across milestones, so you pay as working software appears rather than up front. If we're working through Upwork, everything runs through their escrow and protection.",
    },
    {
      q: "What if it's not what I asked for?",
      a: "You'll know long before the end. You get a working deployed URL from the first week and daily updates after that, so course corrections happen in days rather than at a big reveal. Scope is agreed in writing at the start, and genuine changes get repriced openly instead of quietly absorbed or silently dropped.",
    },
  ],
} as const;

export const contact = {
  label: "Let's build",
  headline: "Ready to Build Something Real?",
  sub: "I take on a limited number of projects at a time. If you're a founder, B2B operator, or agency with a serious SaaS project — let's talk.",
  budgets: [
    "Under $2,000",
    "$2,000 – $5,000",
    "$5,000 – $10,000",
    "$10,000+",
    "Not sure yet",
  ],
} as const;

/**
 * Four-step scored qualifier. Weights are a business decision, not a design
 * one — edit the `score` values here, not the component, if the bar needs to
 * move. Max score is 12 (3 points available per step).
 *
 * Thresholds (see Qualifier.tsx `outcomeFor`):
 *   9–12  -> good fit, straight to booking
 *   5–8   -> workable, but ask to confirm scope/budget on the call first
 *   0–4   -> honest decline, with a cheaper path forward instead of a pitch
 */
export const qualifier = {
  label: "Is this a fit?",
  headline: "60 Seconds, Then You'll Know.",
  sub: "Four quick questions instead of a sales call neither of us needs. Answer honestly — the point is to save your time if it's not a fit, not to talk you into one.",
  steps: [
    {
      id: "project",
      question: "What are you building?",
      options: [
        { label: "A production SaaS product", score: 3 },
        { label: "Claude/AI integration or automation for an existing product", score: 3 },
        { label: "A premium website that needs to convert and perform", score: 2 },
        { label: "Not sure yet — I have an idea, not a spec", score: 1 },
      ],
    },
    {
      id: "budget",
      question: "What's the budget for this?",
      options: [
        { label: "$10,000+", score: 3 },
        { label: "$5,000 – $10,000", score: 2 },
        { label: "$2,000 – $5,000", score: 1 },
        { label: "Under $2,000", score: 0 },
        { label: "Not sure yet", score: 1 },
      ],
    },
    {
      id: "timeline",
      question: "When do you need this started?",
      options: [
        { label: "In the next 2 weeks", score: 3 },
        { label: "Within 1–2 months", score: 2 },
        { label: "Flexible — a few months out", score: 1 },
        { label: "Just exploring, no timeline", score: 0 },
      ],
    },
    {
      id: "authority",
      question: "Who makes the call to move forward?",
      options: [
        { label: "Me — I can approve and pay a deposit directly", score: 3 },
        { label: "Me, with one other person's sign-off", score: 2 },
        { label: "I'm gathering options to present to someone else", score: 1 },
        { label: "Just researching for now", score: 0 },
      ],
    },
  ],
  outcomes: {
    good: {
      heading: "This looks like a good fit.",
      body: "That's a project I can take on properly — fixed scope, milestone billing, a live URL from week one. Book a discovery call and we'll turn this into a real plan.",
      cta: "Book a Discovery Call",
    },
    maybe: {
      heading: "Could work, with the right scope.",
      body: "There's enough here to be worth a short call — mainly to pin down budget and timeline before either of us commits. No pressure either way; worst case it takes 15 minutes to find out it isn't the right fit yet.",
      cta: "Book a 15-Minute Call",
    },
    decline: {
      heading: "I'm probably not the right fit for this, right now.",
      body: "Honestly — at this budget/timeline I'd either be rushing something that deserves more care, or you'd be overpaying for less than a template or a no-code tool would get you today. That's not a knock on the idea; it's just not where I add the most value yet. Revisit this if the scope or budget changes, or email me directly and I'll point you somewhere cheaper if I can.",
      cta: "Email Me Instead",
    },
  },
} as const;

export const footer = {
  tagline: "Built with Claude Code",
  copyright: `© ${new Date().getFullYear()} Goodness Augustine · APGEM Nexus · All rights reserved.`,
} as const;
