import Link from "next/link";
import { ArrowRight, BookOpen, Building2, FileCheck2, Search } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { PaperCard } from "@/components/papers/paper-card";
import { getHomeData } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { stats, featuredSubjects, recentPapers } = await getHomeData();

  return (
    <div className="space-y-14 py-10">
      <AnimatedSection className="rounded-3xl border border-palette-gold/35 bg-gradient-to-br from-palette-deep via-palette-green to-palette-earth p-8 text-white shadow-2xl sm:p-12">
        <p className="mb-3 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest">
          Delhi University prep, elevated
        </p>
        <h1 className="max-w-3xl text-3xl font-bold sm:text-5xl">Find previous year papers in seconds on DU PYQ HUB</h1>
        <p className="mt-4 max-w-2xl text-sm text-palette-cream/90 sm:text-base">
          A modern archive for course-wise, semester-wise, and subject-wise question papers.
        </p>
        <form action="/browse" className="mt-8 flex flex-col gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-palette-gold" />
            <input
              type="text"
              name="q"
              placeholder="Search by subject or paper title"
              className="h-11 w-full rounded-xl border border-white/30 bg-white/10 pl-10 pr-3 text-sm placeholder:text-palette-cream/75 focus:outline-none focus:ring-2 focus:ring-palette-gold/70"
            />
          </div>
          <button className="inline-flex h-11 items-center justify-center rounded-xl bg-palette-gold px-5 text-sm font-semibold text-palette-deep transition hover:bg-palette-cream">
            Search papers
          </button>
        </form>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Papers", value: stats.papers, icon: FileCheck2 },
            { label: "Courses", value: stats.courses, icon: Building2 },
            { label: "Subjects", value: stats.subjects, icon: BookOpen },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-palette-green/15 bg-white/90 p-5 shadow-sm dark:border-palette-gold/15 dark:bg-palette-green/65">
              <item.icon className="mb-2 h-5 w-5 text-palette-earth dark:text-palette-gold" />
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-sm text-palette-earth/85 dark:text-palette-cream/75">{item.label} available</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Subjects</h2>
          <Link href="/browse" className="text-sm font-medium text-palette-earth dark:text-palette-gold">
            Browse all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSubjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/browse?subject=${subject.id}`}
              className="rounded-2xl border border-palette-green/15 bg-white/90 p-5 text-sm font-medium text-palette-deep transition hover:-translate-y-1 hover:border-palette-gold/60 hover:shadow-md dark:border-palette-gold/15 dark:bg-palette-green/65 dark:text-palette-cream"
            >
              {subject.name}
            </Link>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Papers</h2>
          <Link href="/browse" className="text-sm font-medium text-palette-earth dark:text-palette-gold">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.4} className="rounded-3xl border border-palette-green/15 bg-white/90 p-8 text-center shadow-sm dark:border-palette-gold/15 dark:bg-palette-green/65">
        <h3 className="text-2xl font-bold">Ready to practice smarter?</h3>
        <p className="mt-2 text-palette-earth/85 dark:text-palette-cream/75">Access curated PYQs and build exam confidence, one paper at a time.</p>
        <Link
          href="/browse"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-palette-gold px-5 py-3 text-sm font-semibold text-palette-deep shadow transition hover:bg-palette-earth hover:text-palette-cream"
        >
          Start browsing <ArrowRight className="h-4 w-4" />
        </Link>
      </AnimatedSection>
    </div>
  );
}
