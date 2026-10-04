import { BookOpenCheck, Sparkles, Target, Users } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";

const benefits = [
  {
    title: "Focused Revision",
    description: "Practice real exam patterns to sharpen preparation.",
    icon: Target,
  },
  {
    title: "Time Saving",
    description: "Skip scattered sources and find PYQs quickly.",
    icon: Sparkles,
  },
  {
    title: "Community Friendly",
    description: "Built for DU students across courses and semesters.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-10 py-8 sm:py-10">
      <AnimatedSection className="relative isolate overflow-hidden rounded-[2rem] border border-palette-gold/30 bg-gradient-to-br from-palette-deep via-palette-green to-palette-rust p-7 text-palette-cream shadow-2xl sm:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-palette-gold/20" />
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-palette-gold/35 bg-palette-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-palette-gold">
          <BookOpenCheck className="h-3.5 w-3.5" /> About DU PYQ HUB
        </p>
        <h1 className="relative max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          A little more order for a lot more learning.
        </h1>
        <p className="relative mt-4 max-w-3xl text-sm leading-7 text-palette-cream/75 sm:text-base">
          DU PYQ HUB helps students find previous year question papers in one easy-to-use place. Papers are organized by course, semester, and subject, so you can spend less time searching and more time learning.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <div className="mb-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-palette-earth dark:text-palette-gold">Made for your study rhythm</p>
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">A better way to prepare</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className="group rounded-2xl border border-palette-green/15 bg-white/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-palette-gold/60 hover:shadow-lg dark:border-palette-gold/15 dark:bg-palette-green/50">
              <span className={`mb-4 grid h-12 w-12 place-items-center rounded-xl ${index === 1 ? "bg-palette-gold/25 text-palette-earth dark:text-palette-gold" : "bg-palette-green text-palette-cream"}`}>
                <benefit.icon className="h-5 w-5 transition group-hover:rotate-6" />
              </span>
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-palette-earth/80 dark:text-palette-cream/70">{benefit.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.14} className="rounded-3xl border border-palette-gold/25 bg-palette-green p-6 text-palette-cream shadow-lg sm:p-8">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-palette-gold">
          <BookOpenCheck className="h-4 w-4" /> Learning-first platform
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-palette-cream/80">
          We are continuously improving DU PYQ HUB with cleaner navigation, better search, and richer academic coverage.
        </p>
      </AnimatedSection>
    </div>
  );
}
