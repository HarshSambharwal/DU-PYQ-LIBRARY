import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { getPaperById } from "@/lib/supabase/queries";
import { PdfViewer } from "@/components/papers/pdf-viewer";

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
    <div className="space-y-7 py-8 sm:py-10">
      <Link href="/browse" className="group inline-flex items-center gap-2 rounded-full border border-palette-green/20 bg-white/70 px-4 py-2 text-sm font-medium text-palette-earth transition hover:border-palette-gold hover:text-palette-rust dark:border-palette-gold/20 dark:bg-palette-green/35 dark:text-palette-cream">
        <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /> Back to browse
      </Link>

      <AnimatedSection className="relative isolate overflow-hidden rounded-[2rem] border border-palette-gold/25 bg-gradient-to-br from-palette-deep via-palette-green to-palette-deep p-6 text-palette-cream shadow-2xl sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-palette-gold/15" />
        <p className="relative mb-3 inline-flex items-center gap-2 rounded-full border border-palette-gold/30 bg-palette-gold/10 px-3 py-1.5 text-xs font-semibold text-palette-gold">
          <FileText className="h-3.5 w-3.5" /> Paper details
        </p>
        <h1 className="relative max-w-4xl font-serif text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">{paper.title}</h1>
        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Subject", value: subject?.name ?? "N/A" },
            { label: "Semester", value: semester?.number ? `Semester ${semester.number}` : "N/A" },
            { label: "Course", value: course?.name ?? "N/A" },
            { label: "Year", value: String(paper.year) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-palette-gold">{item.label}</p>
              <p className="mt-1 text-sm text-palette-cream/90">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-palette-gold px-5 py-3 text-sm font-semibold text-palette-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F]"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-palette-cream/25 bg-palette-deep/40 px-5 py-3 text-sm font-semibold text-palette-cream transition duration-200 hover:border-palette-gold hover:text-palette-gold"
          >
            <ExternalLink className="h-4 w-4" /> Open in new tab
          </a>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.08} className="overflow-hidden rounded-3xl border border-palette-green/20 bg-white/80 p-2 shadow-xl dark:border-palette-gold/20 dark:bg-palette-green/35 sm:p-3">
        <PdfViewer src={`/api/papers/${paper.id}/pdf`} title={paper.title} />
      </AnimatedSection>
    </div>
  );
}
