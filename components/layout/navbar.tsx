"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse Papers" },
  { href: "/about", label: "About" },
  { href: "/feedback", label: "Feedback" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-palette-gold/25 bg-palette-deep/95 text-palette-cream shadow-lg shadow-palette-deep/10 backdrop-blur-lg">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 text-lg font-semibold tracking-tight text-palette-cream">
          <Image
            src="/du-pyq-logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="h-11 w-11 shrink-0 object-contain transition duration-300 group-hover:scale-105"
          />
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/browse"
            className="hidden rounded-full bg-palette-gold px-4 py-2 text-sm font-semibold text-palette-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F] sm:inline-flex"
          >
            Find a paper
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-palette-cream/20 text-palette-cream hover:bg-palette-green/55 md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-palette-gold/20 px-4 py-3 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-palette-cream/90 hover:bg-palette-green/55 hover:text-palette-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
