import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import phazeLogo from "@/assets/phaze-ai-logo.png";
import jecrcLogo from "@/assets/jecrc-logo.png";
import { RegisterDialog, openRegister } from "@/components/RegisterDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Phaze AI × JECRC University — AI Workshop for Business Owners, Jaipur" },
      {
        name: "description",
        content:
          "Practical AI workshop for business owners. 18th July, JECRC University Jaipur. Two sessions: AI for Business + AI for Content & Social Media Scaling.",
      },
      { property: "og:title", content: "Phaze AI × JECRC — AI Workshop for Business Owners" },
      {
        property: "og:description",
        content:
          "AI, made useful for your business. Saturday 18th July, JECRC University, Jaipur. ₹1,999/session or ₹2,999 combined.",
      },
    ],
  }),
  component: Landing,
});

function Logo({ size = "default" }: { size?: "default" | "lg" }) {
  const h = size === "lg" ? "h-10 sm:h-11" : "h-8 sm:h-9";
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <img
        src={phazeLogo}
        alt="Phaze AI"
        className={`${h} w-auto object-contain`}
      />
      <span className="text-muted-foreground/50 font-display text-xl leading-none">×</span>
      <img
        src={jecrcLogo}
        alt="JECRC University"
        className={`${h} w-auto object-contain`}
      />
    </div>
  );
}

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#sessions", label: "Sessions" },
  { href: "#outcomes", label: "Outcomes" },
  { href: "#trainer", label: "Trainers" },
  { href: "#faq", label: "FAQ" },
];

function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
        <a href="#" className="shrink-0">
          <Logo />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => openRegister("combined")}
          className="hidden rounded-2xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90 md:inline-flex"
        >
          Reserve seat
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-[60] grid h-11 w-11 shrink-0 place-items-center transition active:scale-95 md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 block h-px w-6 bg-foreground transition-transform duration-300 ${
                open ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[8px] block h-px w-6 bg-foreground transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[16px] block h-px w-6 bg-foreground transition-transform duration-300 ${
                open ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile dropdown (below navbar so logos stay visible) */}
      <div
        className={`overflow-hidden border-border/60 bg-background/95 backdrop-blur-md transition-[max-height,border] duration-500 ease-[cubic-bezier(0.83,0,0.17,1)] md:hidden ${
          open ? "max-h-[80vh] border-t" : "max-h-0"
        }`}
        aria-hidden={!open}
      >
        <div className="px-6 pb-8 pt-6">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 font-display text-3xl font-semibold tracking-tight text-foreground"
                style={{
                  transform: open ? "translateY(0)" : "translateY(12px)",
                  opacity: open ? 1 : 0,
                  transitionProperty: "transform, opacity",
                  transitionDuration: "350ms",
                  transitionDelay: open ? `${120 + i * 50}ms` : "0ms",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openRegister("combined");
            }}
            className="mt-6 block w-full rounded-2xl bg-foreground px-6 py-4 text-center text-base font-semibold text-background transition hover:opacity-90"
          >
            Reserve your seat →
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 grain opacity-50" />
      <div
        className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-lime), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-6 sm:pb-20 sm:pt-20 md:pt-24">
        <h1 className="font-display text-[2.75rem] font-bold leading-[0.95] tracking-tight text-balance sm:text-5xl md:text-7xl lg:text-8xl">
          AI, made useful
          <br />
          for your <span className="italic text-muted-foreground">business.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:mt-8 sm:text-lg md:text-xl">
          Learn how to use AI in your business, and how to scale your brand on social media —
          practical sessions built for business owners, not engineers.
        </p>

        <div className="mt-6 flex flex-nowrap items-center gap-3 sm:mt-10 sm:gap-4">
          <button
            type="button"
            onClick={() => openRegister("combined")}
            className="group inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-foreground px-4 py-3.5 text-sm font-medium text-background transition hover:opacity-90 sm:flex-none sm:px-7 sm:py-4 sm:text-base"
          >
            Reserve your seat
            <span className="transition group-hover:translate-x-0.5">→</span>
          </button>
          <a
            href="#sessions"
            className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border px-4 py-3.5 text-sm font-medium text-foreground transition hover:bg-surface sm:flex-none sm:px-7 sm:py-4 sm:text-base"
          >
            See the sessions
          </a>
        </div>

        <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-4 sm:mt-20 sm:gap-x-8 sm:gap-y-6 md:grid-cols-4">

          {[
            ["Date", "Sat, 18 July"],
            ["Time", "12 PM – 5 PM"],
            ["Venue", "JECRC, Jaipur"],
            ["Price", "₹1,999 / session"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">{k}</dt>
              <dd className="mt-1 font-display text-base font-medium sm:text-lg">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["ChatGPT", "Claude", "Gemini", "NotebookLM", "AI Agents", "Content Systems", "SEO & Ads", "Operations"];
  return (
    <div className="overflow-hidden border-b border-border/60 bg-surface py-5">
      <div className="marquee flex w-max gap-12 whitespace-nowrap text-sm uppercase tracking-widest text-muted-foreground">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-12">
            {it}
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Why() {
  return (
    <section className="border-b border-border/60 px-5 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Why this, why now</div>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">AI is moving fast. Don't get left behind.</h2>
        </div>
        <div className="md:col-span-8">
          <blockquote className="border-l-2 border-accent-lime pl-6 font-display text-2xl leading-snug text-balance md:text-3xl">
            "The businesses that adopted the internet early didn't wait for it to mature. The same is
            happening with AI — right now."
          </blockquote>
          <p className="mt-8 text-lg text-muted-foreground">
            Every business owner has heard about AI. Few have actually used it to change how their
            business runs day to day, or how their brand shows up on social media. Your competitors
            aren't smarter than you — some are just already running AI agents for content and
            follow-ups while you're still doing it by hand.
          </p>
        </div>
      </div>
    </section>
  );
}

function Sessions() {
  const sessions = [
    {
      tag: "Session 1",
      time: "12:00 PM – 2:00 PM",
      title: "AI for Business",
      ticketId: "session1",
      points: [
        "Why some businesses are moving 3x faster on the same team — and what they're actually doing differently",
        "Turn Claude into a working employee: set it up once, delegate to it daily",
        "Department by department — how HR, sales, ops, and content teams are using AI agents right now (before/after, not theory)",
        "The onboarding mindset: AI isn't magic, it's a new hire — here's how long it actually takes to get value out of it",
        "What not to hand AI unsupervised, and the one check every business owner should run before publishing AI output",
      ],
    },
    {
      tag: "Session 2",
      time: "3:00 PM – 5:00 PM",
      title: "AI for Content & Social Media",
      ticketId: "session2",
      points: [
        "How to find content ideas that spread — what the algorithm rewards, and how to reverse-engineer it with AI",
        "Go from one idea to 5 platform-ready posts in under 10 minutes — live, in the room",
        "Generate creatives, ad copy, and social visuals without a designer or agency",
        "Build a content system you can run weekly — not a one-off lucky post, an actual repeatable engine",
        "Yashika's personal workflow: how she manages 700K+ across platforms with AI doing the heavy lifting",
      ],
    },
  ];

  return (
    <section id="sessions" className="border-b border-border/60 px-5 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Two sessions, one day</div>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Session breakdown.</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sessions.map((s, i) => (
            <article
              key={s.tag}
              className="group relative flex flex-col rounded-2xl border border-border bg-surface-elevated p-8 transition hover:border-foreground/30 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-foreground px-4 py-1 text-xs font-semibold text-background">
                  {s.tag}
                </span>
                <span className="font-mono text-sm font-medium text-muted-foreground">{s.time}</span>
              </div>
              <h3 className="mt-8 font-display text-3xl font-semibold">{s.title}</h3>
              <ul className="mt-8 space-y-4 text-muted-foreground flex-grow relative z-10">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-4 items-start">
                    <span className="mt-2.5 h-[3px] w-4 shrink-0 bg-foreground rounded-full" />
                    <span className="text-base leading-relaxed text-foreground/80">{p}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-12 flex justify-between items-end relative z-10">
                <div className="font-display text-8xl font-bold text-muted/30 select-none">
                  0{i + 1}
                </div>
                <button
                  type="button"
                  onClick={() => openRegister(s.ticketId as any)}
                  className="rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90"
                >
                  Book now →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Combined Session Banner */}
        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl bg-[#111111] p-8 md:p-10 border border-foreground/10 text-white">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Combined Session</div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-white">
              Book both sessions and save ₹999
            </h3>
          </div>
          <button
            type="button"
            onClick={() => openRegister("combined")}
            className="shrink-0 w-full md:w-auto rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition hover:bg-white/90"
          >
            Book combined →
          </button>
        </div>
      </div>
    </section>
  );
}

function Outcomes() {
  const items = [
    "How to turn Claude into a working employee — not just a chatbot you ask questions",
    "7 Claude skills / AI agents you can start using immediately",
    "A repeatable system for turning one piece of content into 5+ posts across platforms",
    "A checklist for what NOT to hand AI unsupervised",
  ];
  return (
    <section id="outcomes" className="border-b border-border/60 bg-foreground px-5 py-24 text-background sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs uppercase tracking-widest text-background/60">Outcomes</div>
        <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold md:text-6xl">
          What you'll walk away with.
        </h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-background/10 md:grid-cols-2">
          {items.map((it, i) => (
            <div key={it} className="flex gap-6 bg-foreground p-8">
              <div className="font-mono text-sm text-accent-lime">0{i + 1}</div>
              <p className="text-lg leading-snug text-balance">{it}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Audience() {
  const who = [
    "Small & medium business owners",
    "Founders & operators",
    "Marketing / content leads",
    "Anyone tired of AI hype with no substance",
  ];
  return (
    <section className="border-b border-border/60 px-5 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Audience</div>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Who this is for.</h2>
          <p className="mt-6 text-muted-foreground">
            Built for the people running the business — not the people writing the code.
          </p>
        </div>
        <div className="md:col-span-7">
          <ul className="divide-y divide-border border-y border-border">
            {who.map((w, i) => (
              <li key={w} className="flex items-center gap-6 py-5">
                <span className="font-mono text-xs text-muted-foreground">→ 0{i + 1}</span>
                <span className="font-display text-xl md:text-2xl">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Trainer() {
  return (
    <section id="trainer" className="border-b border-border/60 px-5 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Who's teaching</div>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Your trainers.</h2>
        </div>

        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <div className="text-center">
                  <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-2xl bg-foreground/10 font-display text-3xl text-foreground">
                    MJ
                  </div>
                  <div className="text-sm uppercase tracking-widest">Photo placeholder</div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Lead Trainer</div>
            <h3 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Manthan Jethwani
              <a 
                href="https://www.instagram.com/manthanjethwani/" 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 block text-lg text-accent-lime hover:underline"
              >
                @manthanjethwani ↗
              </a>
              <span className="mt-1 block text-muted-foreground text-2xl md:text-3xl">Founder, Phaze AI</span>
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-surface-elevated p-4">
                <div className="font-display text-3xl font-bold">250+</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Businesses consulted</div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-elevated p-4">
                <div className="font-display text-3xl font-bold">125K+</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Followers on Instagram</div>
              </div>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Manthan runs Phaze AI — consulting 250+ businesses and implementing real AI solutions inside their systems: custom agents, content workflows, sales and operations automation.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              This session is built from real implementation work — the same playbooks used with paying clients, simplified for a room of business owners.
            </p>
          </div>
        </div>

        <div className="my-16 h-px bg-border" />

        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:order-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Guest Trainer</div>
            <h3 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
              Yashika Sadhwani
              <a 
                href="https://www.instagram.com/ainoobstoninjas/" 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 block text-lg text-accent-lime hover:underline"
              >
                @ainoobstoninjas ↗
              </a>
              <span className="mt-1 block text-muted-foreground text-2xl md:text-3xl">AI Educator & Creator</span>
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-surface-elevated p-4">
                <div className="font-display text-3xl font-bold">700K+</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Followers across platforms</div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-elevated p-4">
                <div className="font-display text-3xl font-bold">BCG · Zomato</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Previously</div>
              </div>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Yashika is an AI educator and creator with 700K+ followers across platforms — previously at BCG and Zomato, now building one of India's largest communities around AI, content and marketing.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              In this session she shares the exact workflows she uses to create high-converting content, ad creatives and copy using AI — fast and at scale.
            </p>
          </div>
          <div className="md:col-span-5 md:order-1">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-surface">
              <div className="grid h-full w-full place-items-center text-muted-foreground">
                <div className="text-center">
                  <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-2xl bg-foreground/10 font-display text-3xl text-foreground">
                    YS
                  </div>
                  <div className="text-sm uppercase tracking-widest">Photo placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Pricing() {
  return (
    <section id="register" className="border-b border-border/60 px-5 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Reserve your seat</div>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Pick your ticket.</h2>
          <p className="mt-4 text-muted-foreground">Seats are limited — this is a working session, not a lecture hall.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border-2 border-foreground bg-foreground p-8 text-background md:order-2 md:-my-4 md:shadow-2xl">
            <div
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
              style={{ background: "var(--accent-lime)" }}
            />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-background/60">
                <span className="rounded-2xl bg-accent-lime px-2 py-0.5 text-[10px] font-bold text-foreground">
                  Most popular
                </span>
                <span>· Save ₹999</span>
              </div>
              <div className="mt-3 font-display text-2xl font-semibold">Both sessions</div>
              <div className="mt-1 font-mono text-sm text-background/60">12 PM – 5 PM · Full day</div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold">₹2,999</span>
                <span className="font-mono text-sm text-background/50 line-through">₹3,998</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-background/80">
                <li>✓ AI for Business (Session 1)</li>
                <li>✓ AI for Content & Social (Session 2)</li>
                <li>✓ Workbook + agent templates</li>
              </ul>
              <button
                type="button"
                onClick={() => openRegister("combined")}
                className="mt-8 block w-full rounded-2xl bg-accent-lime py-3 text-center font-semibold text-foreground transition hover:opacity-90"
              >
                Reserve combined →
              </button>
            </div>
          </div>

          {([
            { name: "Session 1", desc: "AI for Business", price: "1,999", time: "12 – 2 PM", order: "md:order-1", ticket: "session1" as const },
            { name: "Session 2", desc: "AI for Content & Social", price: "1,999", time: "3 – 5 PM", order: "md:order-3", ticket: "session2" as const },
          ]).map((p) => (
            <div key={p.name} className={`rounded-2xl border border-border bg-surface-elevated p-8 ${p.order}`}>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.name}</div>
              <div className="mt-2 font-display text-2xl font-semibold">{p.desc}</div>
              <div className="mt-1 font-mono text-sm text-muted-foreground">{p.time}</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">₹{p.price}</span>
              </div>
              <button
                type="button"
                onClick={() => openRegister(p.ticket)}
                className="mt-8 block w-full rounded-2xl border border-foreground py-3 text-center font-medium transition hover:bg-foreground hover:text-background"
              >
                Single session
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function FAQ() {
  const faqs: [string, string][] = [
    ["Is this my first AI workshop — will I be lost?", "No. The sessions are built for business owners with zero technical background. If you can use WhatsApp and Google Sheets, you're ready."],
    ["What if I can't make it on the 18th?", "Seats are non-refundable, but if you can't attend, you're welcome to send someone from your team in your place — just let us know in advance."],
    ["Should I bring a laptop?", "Yes, bring a laptop if you can — some parts of the session are live demonstrations and it's better to follow along on your own screen than watch from across the room."],
    ["What's included?", "Both sessions, workbook/resources, and the AI agent templates covered live."],
    ["Can my team attend?", "Yes, multiple seats can be booked."],
    ["What's the reschedule policy?", "In case of a date change from our side, you'll be moved to the new date automatically."],
  ];
  return (
    <section id="faq" className="border-b border-border/60 px-5 py-24 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">FAQ</div>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Common questions.</h2>
        </div>
        <div className="md:col-span-8">
          <dl className="divide-y divide-border border-y border-border">
            {faqs.map(([q, a]) => (
              <div key={q} className="grid gap-2 py-6 md:grid-cols-5 md:gap-8">
                <dt className="font-display text-lg font-medium md:col-span-2">{q}</dt>
                <dd className="text-muted-foreground md:col-span-3">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-32 sm:px-6">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, var(--accent-lime), transparent 50%), radial-gradient(circle at 70% 50%, var(--accent-amber), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-balance md:text-7xl">
          Reserve your spot for the Phaze AI × JECRC workshop.
        </h2>
        <p className="mt-8 text-lg text-muted-foreground">
          Saturday, 18th July · JECRC University, Jaipur
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => openRegister("session1")}
            className="rounded-2xl bg-foreground px-8 py-4 text-base font-medium text-background transition hover:opacity-90"
          >
            Register — ₹1,999 / session
          </button>
          <button
            type="button"
            onClick={() => openRegister("combined")}
            className="rounded-2xl border border-foreground px-8 py-4 text-base font-medium transition hover:bg-foreground hover:text-background"
          >
            Combined — ₹2,999
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-5 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <Logo />
        <div className="text-sm text-muted-foreground">
          Phaze AI × JECRC University · Jaipur · 18 July
        </div>
      </div>
    </footer>
  );
}


export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Why />
        <Sessions />
        <Outcomes />
        <Audience />
        <Trainer />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <RegisterDialog />
    </div>
  );
}
