import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  FileCheck2,
  Search,
  Sparkles,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { PaperCard } from "@/components/papers/paper-card";
import { getHomeData } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

const subjectAccents = [
  "bg-palette-green text-palette-cream",
  "bg-palette-gold text-palette-deep",
  "bg-palette-earth text-palette-cream",
];

function StudyNook() {
  return (
    <div className="study-nook" aria-hidden="true">
      <div className="study-wall">
        <p className="study-note">
          Same questions.
          <strong>Bigger dreams.</strong>
        </p>
      </div>
      <span className="study-floating-tag"><Sparkles className="h-3.5 w-3.5 text-palette-gold" /> Your revision shelf</span>
      <div className="study-book study-book--base"><span>DU QUESTION PAPERS</span></div>
      <div className="study-book study-book--middle"><span>FIELD NOTES · VOL. 1</span></div>
      <div className="study-book study-book--top"><span>THE STUDY EDITION</span></div>
      <div className="study-pencil-pot">
        <span className="study-pencil study-pencil--one" />
        <span className="study-pencil study-pencil--two" />
        <span className="study-pencil study-pencil--three" />
      </div>
      <div className="study-shelf" />
    </div>
  );
}

export default async function Home() {
  const { stats, featuredSubjects, recentPapers } = await getHomeData();

  return (
    <div className="space-y-12 py-7 sm:space-y-16 sm:py-10">
      <AnimatedSection className="relative isolate overflow-hidden rounded-[2rem] border border-palette-gold/30 bg-gradient-to-br from-palette-deep via-palette-deep to-palette-green p-6 text-palette-cream shadow-2xl shadow-palette-deep/20 sm:p-10 lg:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-palette-gold/15" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-palette-gold/10" />
        <div className="relative grid items-center gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
          <div className="relative z-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-palette-gold/40 bg-palette-gold/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-palette-gold">
              <Sparkles className="h-3.5 w-3.5" /> Delhi University prep, elevated
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-palette-cream sm:text-5xl lg:text-[3.65rem]">
              Find your next
              <span className="block text-palette-gold">right answer.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-palette-cream/75 sm:text-base">
              Previous year papers, neatly arranged by course, semester, and subject. Spend less time searching and more time preparing.
            </p>

            <form action="/browse" className="mt-7 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-palette-earth" />
                <input
                  type="search"
                  name="q"
                  aria-label="Search by subject or paper title"
                  placeholder="Search a subject or paper title"
                  className="h-12 w-full rounded-xl border border-palette-green/15 bg-palette-cream pl-10 pr-4 text-sm text-palette-deep outline-none transition placeholder:text-palette-earth/70 focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
                />
              </div>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-palette-gold px-5 text-sm font-semibold text-palette-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F]">
                Search papers <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-palette-cream/65">
              <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-palette-gold" /> Course-wise archive</span>
              <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-palette-gold" /> Semester filters</span>
            </div>
          </div>

          <div className="relative z-0 -mx-1 mt-3 lg:mx-0 lg:mt-0">
            <StudyNook />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Courses covered", value: stats.courses, icon: Building2 },
            { label: "Subjects to explore", value: stats.subjects, icon: BookOpen },
            { label: "Papers available", value: stats.papers, icon: FileCheck2 },
          ].map((item) => (
            <div key={item.label} className="group flex items-center gap-4 rounded-2xl border border-palette-green/15 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-palette-gold/60 hover:shadow-md dark:border-palette-gold/15 dark:bg-palette-green/50 sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-palette-gold/20 text-palette-earth transition group-hover:rotate-3 dark:text-palette-gold">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold tracking-tight">{item.value}</p>
                <p className="text-xs text-palette-earth/80 dark:text-palette-cream/70">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.12}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-palette-earth dark:text-palette-gold">Pick up where you need</p>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Browse by subject</h2>
          </div>
          <Link href="/browse" className="group inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-palette-earth transition hover:text-palette-rust dark:text-palette-gold dark:hover:text-palette-cream">
            Browse all <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSubjects.map((subject, index) => (
            <Link
              key={subject.id}
              href={`/browse?subject=${subject.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-palette-green/15 bg-white/85 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-palette-gold/70 hover:shadow-lg dark:border-palette-gold/15 dark:bg-palette-green/55 sm:p-5"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition duration-300 group-hover:rotate-3 group-hover:scale-105 ${subjectAccents[index % subjectAccents.length]}`}>
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold capitalize">{subject.name}</span>
                <span className="mt-1 block text-xs text-palette-earth/75 dark:text-palette-cream/65">Explore past papers</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-palette-earth transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-palette-gold" />
            </Link>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.16}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-palette-earth dark:text-palette-gold">Fresh from the archive</p>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Latest papers</h2>
          </div>
          <Link href="/browse" className="group inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-palette-earth transition hover:text-palette-rust dark:text-palette-gold dark:hover:text-palette-cream">
            View all <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="relative isolate overflow-hidden rounded-[2rem] border border-palette-gold/25 bg-gradient-to-r from-palette-green via-palette-deep to-palette-rust p-7 text-palette-cream shadow-xl sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border border-palette-gold/20" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-palette-gold">
              <Sparkles className="h-4 w-4" /> Make your next revision count
            </p>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Your next study session starts here.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-palette-cream/70">Choose a paper, settle in, and see what the past exams can teach you.</p>
          </div>
          <Link href="/browse" className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-palette-gold px-5 py-3 text-sm font-semibold text-palette-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F]">
            Find a paper <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
