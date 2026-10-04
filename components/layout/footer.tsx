export function Footer() {
  return (
    <footer className="mt-16 border-t border-palette-green/15 bg-[#FBFAF5]/70 py-10 dark:border-palette-gold/15 dark:bg-palette-deep/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-palette-earth/85 sm:flex-row sm:px-6 lg:px-8 dark:text-palette-cream/70">
        <p>© {new Date().getFullYear()} DU PYQ HUB. Built for Delhi University students.</p>
        <p>Search smarter. Revise faster. Score better.</p>
      </div>
    </footer>
  );
}
