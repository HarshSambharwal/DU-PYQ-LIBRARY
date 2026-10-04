import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Papers" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-palette-gold/25 bg-palette-deep/95 text-palette-cream shadow-lg shadow-palette-deep/10 backdrop-blur-lg">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 text-lg font-semibold tracking-tight text-palette-cream">
          <span className="rounded-xl bg-palette-gold p-2 text-palette-deep transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>DU <span className="text-palette-gold">PYQ HUB</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-palette-cream/80 transition duration-200 hover:bg-palette-green/55 hover:text-palette-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/browse"
            className="hidden rounded-full bg-palette-gold px-4 py-2 text-sm font-semibold text-palette-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F] sm:inline-flex"
          >
            Find a paper
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
