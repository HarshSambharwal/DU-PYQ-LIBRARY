import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { getPaperById } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function PaperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paperData = await getPaperById(id);

  if (!paperData) {
    notFound();
  }

  const { paper, subject, semester, course } = paperData;

  return (
    <div className="space-y-7 py-10">
      <Link href="/browse" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>

      <AnimatedSection className="rounded-3xl border border-black/5 bg-white/90 p-7 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
          <FileText className="h-3.5 w-3.5" /> PYQ Details
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">{paper.title}</h1>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <p><span className="font-semibold">Subject:</span> {subject?.name ?? "N/A"}</p>
          <p><span className="font-semibold">Semester:</span> {semester?.number ? `Semester ${semester.number}` : "N/A"}</p>
          <p><span className="font-semibold">Course:</span> {course?.name ?? "N/A"}</p>
          <p><span className="font-semibold">Year:</span> {paper.year}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
          >
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </a>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="overflow-hidden rounded-3xl border border-black/5 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <iframe
          src={paper.pdf_url}
          title={paper.title}
          className="h-[65vh] w-full"
          loading="lazy"
        />
      </AnimatedSection>
    </div>
  );
}
