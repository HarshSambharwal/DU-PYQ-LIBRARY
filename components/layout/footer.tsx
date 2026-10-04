import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-palette-gold/25 bg-palette-deep text-palette-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold">
            <span className="rounded-xl bg-palette-gold p-2 text-palette-deep">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>DU <span className="text-palette-gold">PYQ HUB</span></span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-palette-cream/70">
            A calm corner for Delhi University revision, with papers organized by course, semester, and subject.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-palette-cream/75 sm:justify-end">
          <Link href="/" className="transition hover:text-palette-gold">Home</Link>
          <Link href="/browse" className="transition hover:text-palette-gold">Browse papers</Link>
          <Link href="/about" className="transition hover:text-palette-gold">About</Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-palette-cream/55 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} DU PYQ HUB. Built for Delhi University students.</p>
          <p className="inline-flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-palette-gold" /> Search smarter. Revise faster. Score better.</p>
        </div>
      </div>
    </footer>
  );
}
