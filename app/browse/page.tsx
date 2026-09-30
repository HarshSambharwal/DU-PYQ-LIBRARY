import { SearchX } from "lucide-react";
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

  const { papers, subjectMap, semesterMap } = await getPapers({
    search: resolvedSearchParams.q,
    courseId: resolvedSearchParams.course ? Number(resolvedSearchParams.course) : undefined,
    semesterId: resolvedSearchParams.semester ? Number(resolvedSearchParams.semester) : undefined,
    subjectId: resolvedSearchParams.subject ? Number(resolvedSearchParams.subject) : undefined,
  });

  return (
    <div className="space-y-8 py-10">
      <AnimatedSection>
        <h1 className="text-3xl font-bold sm:text-4xl">Browse Previous Year Papers</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Filter by course, semester, and subject to find the exact paper you need.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <BrowseFilters courses={courses} semesters={semesters} subjects={subjects} />
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{papers.length} paper(s) found</p>
        {papers.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {papers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                subject={subjectMap.get(paper.subject_id)}
                semester={semesterMap.get(paper.semester_id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/80 p-10 text-center dark:border-white/15 dark:bg-slate-900">
            <SearchX className="mx-auto h-7 w-7 text-slate-500" />
            <p className="mt-3 font-medium">No papers matched your filters.</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Try changing the search term or removing some filters.</p>
          </div>
        )}
      </AnimatedSection>
    </div>
  );
}
