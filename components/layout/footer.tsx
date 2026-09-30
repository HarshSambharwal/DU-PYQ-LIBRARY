export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white/60 py-10 dark:border-white/10 dark:bg-slate-950/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-slate-600 sm:flex-row sm:px-6 lg:px-8 dark:text-slate-400">
        <p>© {new Date().getFullYear()} DU PYQ HUB. Built for Delhi University students.</p>
        <p>Search smarter. Revise faster. Score better.</p>
      </div>
    </footer>
  );
}
