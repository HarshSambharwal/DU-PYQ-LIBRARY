import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { Paper, Semester } from "@/lib/supabase/queries";

export function PaperCard({
  paper,
  semester,
}: {
  paper: Paper;
  semester?: Semester;
}) {
  return (
    <Link
      href={`/papers/${paper.id}`}
      className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-palette-green/20 bg-white/85 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-palette-gold/70 hover:shadow-xl dark:border-palette-gold/15 dark:bg-palette-green/55"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-palette-green via-palette-gold to-palette-rust opacity-75 transition group-hover:h-1.5" />
      <div className="mb-5 flex items-center justify-between gap-3 pt-1 text-xs text-palette-earth/80 dark:text-palette-cream/65">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-palette-gold/20 px-3 py-1.5 font-semibold text-palette-earth dark:text-palette-gold">
          <Calendar className="h-3.5 w-3.5" /> {paper.year}
        </span>
        {semester ? <span className="rounded-full bg-palette-green/10 px-3 py-1.5 dark:bg-palette-deep/45">Semester {semester.number}</span> : null}
      </div>

      <h3 className="flex-1 text-lg font-semibold leading-snug text-palette-deep dark:text-palette-cream">{paper.title}</h3>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-palette-earth transition group-hover:gap-3 dark:text-palette-gold">
        View details <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
