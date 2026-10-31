import type { Metadata } from "next";
import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata: Metadata = {
  title: "Feedback | DU PYQ HUB",
  description: "Report missing papers, Topic Search issues, website bugs, or suggest improvements.",
};

export default function FeedbackPage() {
  return (
    <section className="mx-auto max-w-3xl py-8 sm:py-12">
      <div className="rounded-3xl border border-palette-gold/35 bg-white/75 p-5 shadow-xl shadow-palette-deep/10 dark:bg-palette-deep/80 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-palette-gold">Help improve the archive</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-palette-deep dark:text-palette-cream sm:text-4xl">Send feedback</h1>
        <p className="mt-2 text-sm leading-6 text-palette-deep/70 dark:text-palette-cream/70">
          Tell us about a missing paper, a Topic Search issue, a website bug, or an idea.
        </p>
        <FeedbackForm />
      </div>
    </section>
  );
}
