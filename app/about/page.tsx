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
    <div className="space-y-10 py-10">
      <AnimatedSection className="rounded-3xl border border-black/5 bg-gradient-to-br from-slate-900 to-indigo-900 p-8 text-white shadow-xl sm:p-12">
        <p className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wider">
          About DU PYQ HUB
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Our mission is to make DU exam prep simpler and smarter.</h1>
        <p className="mt-4 max-w-3xl text-slate-200">
          DU PYQ HUB is designed to help students access previous year question papers in one premium, easy-to-use platform.
          We organize papers by course, semester, and subject so you can spend less time searching and more time learning.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <h2 className="mb-5 text-2xl font-bold">Why students love it</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-black/5 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <benefit.icon className="mb-3 h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="rounded-2xl border border-black/5 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
          <BookOpenCheck className="h-4 w-4" /> Learning-first platform
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          We are continuously improving DU PYQ HUB with cleaner navigation, better search, and richer academic coverage.
        </p>
      </AnimatedSection>
    </div>
  );
}
