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
      className="group rounded-2xl border border-palette-green/15 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:border-palette-gold/50 hover:shadow-lg dark:border-palette-gold/15 dark:bg-palette-green/65"
    >
      <div className="mb-4 flex items-center justify-between text-xs text-palette-earth/75 dark:text-palette-cream/60">
        <span className="inline-flex items-center gap-1 rounded-full bg-palette-gold/20 px-3 py-1 text-palette-earth dark:bg-palette-gold/20 dark:text-palette-cream">
          <Calendar className="h-3.5 w-3.5" /> {paper.year}
        </span>
        {semester ? <span>Semester {semester.number}</span> : null}
      </div>

      <h3 className="text-lg font-semibold text-palette-deep dark:text-palette-cream">{paper.title}</h3>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-palette-earth group-hover:gap-3 dark:text-palette-gold">
        View details <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
