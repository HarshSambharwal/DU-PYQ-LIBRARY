import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { BrowseFilters } from "@/components/papers/browse-filters";
import { PaperCard } from "@/components/papers/paper-card";
import { BROWSE_FILTERS, getBrowseFilters, getPapers } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

type BrowseSearchParams = {
  q?: string;
  course?: string;
  semester?: string;
  filter?: string;
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<BrowseSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const { courses, semesters, filters } = await getBrowseFilters();
  const selectedFilter = BROWSE_FILTERS.find((filter) => filter.value === resolvedSearchParams.filter);
  const { papers, paperCount, semesterMap } = await getPapers({
    search: resolvedSearchParams.q,
    courseId: resolvedSearchParams.course ? Number(resolvedSearchParams.course) : undefined,
    semesterId: resolvedSearchParams.semester ? Number(resolvedSearchParams.semester) : undefined,
    browseFilter: selectedFilter?.value,
  });
  const hasActiveSearch = Boolean(
    resolvedSearchParams.q?.trim() ||
      resolvedSearchParams.course ||
      resolvedSearchParams.semester ||
      selectedFilter,
  );

  return (
    <div className="space-y-8 py-8 sm:py-10">
      <AnimatedSection className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-palette-gold/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-palette-earth dark:text-palette-gold">
            <ArrowUpRight className="h-3.5 w-3.5" /> Find it in the archive
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Browse previous year papers</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-palette-earth/80 dark:text-palette-cream/70">
            Search by paper or subject name. Semester papers can also be filtered by course and semester.
          </p>
        </div>
        <Link href="/" className="hidden text-sm font-semibold text-palette-earth transition hover:text-palette-rust dark:text-palette-gold dark:hover:text-palette-cream sm:inline-flex">
          Back home
        </Link>
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <BrowseFilters courses={courses} semesters={semesters} filters={filters} />
      </AnimatedSection>

      {hasActiveSearch ? (
        <p aria-live="polite" className="text-sm text-palette-earth/80 dark:text-palette-cream/70">
          {paperCount} matching {paperCount === 1 ? "paper" : "papers"}
        </p>
      ) : null}

      {hasActiveSearch && papers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              semester={paper.semester_id == null ? undefined : semesterMap.get(paper.semester_id)}
            />
          ))}
        </div>
      ) : hasActiveSearch ? (
        <p className="rounded-2xl border border-dashed border-palette-green/25 bg-white/60 p-6 text-center text-sm text-palette-earth/80 dark:border-palette-gold/20 dark:bg-palette-green/25 dark:text-palette-cream/70">
          No papers currently match this search or category.
        </p>
      ) : null}
    </div>
  );
}
