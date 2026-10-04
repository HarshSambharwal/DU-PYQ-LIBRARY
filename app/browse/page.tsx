import Link from "next/link";
import { ArrowUpRight, SearchX } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { BrowseFilters } from "@/components/papers/browse-filters";
import { PaperCard } from "@/components/papers/paper-card";
import { getBrowseFilters, getPapers } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

type BrowseSearchParams = {
  q?: string;
  course?: string;
  semester?: string;
  subject?: string;
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<BrowseSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { courses, semesters, subjects } = await getBrowseFilters();

  const { papers, semesterMap } = await getPapers({
    search: resolvedSearchParams.q,
    courseId: resolvedSearchParams.course ? Number(resolvedSearchParams.course) : undefined,
    semesterId: resolvedSearchParams.semester ? Number(resolvedSearchParams.semester) : undefined,
    subjectId: resolvedSearchParams.subject ? Number(resolvedSearchParams.subject) : undefined,
  });

  return (
    <div className="space-y-8 py-8 sm:py-10">
      <AnimatedSection className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-palette-gold/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-palette-earth dark:text-palette-gold">
            <ArrowUpRight className="h-3.5 w-3.5" /> Find it in the archive
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Browse previous year papers</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-palette-earth/80 dark:text-palette-cream/70">
            Filter by course, semester, and subject to find the exact paper you need.
          </p>
        </div>
        <Link href="/" className="hidden text-sm font-semibold text-palette-earth transition hover:text-palette-rust dark:text-palette-gold dark:hover:text-palette-cream sm:inline-flex">
          Back home
        </Link>
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <BrowseFilters courses={courses} semesters={semesters} subjects={subjects} />
      </AnimatedSection>

      <AnimatedSection delay={0.14}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="font-serif text-xl font-semibold sm:text-2xl">The paper shelf</p>
          <span className="inline-flex items-center gap-2 rounded-full border border-palette-gold/40 bg-palette-gold/15 px-3 py-1.5 text-xs font-semibold text-palette-earth dark:text-palette-gold">
            {papers.length} {papers.length === 1 ? "paper" : "papers"} found
          </span>
        </div>
        {papers.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {papers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                semester={semesterMap.get(paper.semester_id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-palette-green/30 bg-white/60 p-10 text-center dark:border-palette-gold/20 dark:bg-palette-green/35">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-palette-gold/20 text-palette-earth dark:text-palette-gold">
              <SearchX className="h-7 w-7" />
            </span>
            <p className="mt-4 font-serif text-xl font-semibold">No papers on this shelf yet</p>
            <p className="mt-2 text-sm text-palette-earth/80 dark:text-palette-cream/70">Try changing the search term or removing some filters.</p>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
