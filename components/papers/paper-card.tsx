import Link from "next/link";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import type { Paper, Semester, Subject } from "@/lib/supabase/queries";

export function PaperCard({
  paper,
  subject,
  semester,
}: {
  paper: Paper;
  subject?: Subject;
  semester?: Semester;
}) {
  return (
    <Link
      href={`/papers/${paper.id}`}
      className="group rounded-2xl border border-black/5 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
    >
      <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
          <Calendar className="h-3.5 w-3.5" /> {paper.year}
        </span>
        {semester ? <span>Semester {semester.number}</span> : null}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{paper.title}</h3>
      <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <FileText className="h-4 w-4" />
        {subject?.name ?? "Subject unavailable"}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:gap-3 dark:text-indigo-300">
        View details <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
