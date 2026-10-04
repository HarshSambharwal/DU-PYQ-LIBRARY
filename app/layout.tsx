import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "DU PYQ HUB",
  description: "Delhi University Previous Year Question Papers platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <div className="relative min-h-screen overflow-x-hidden bg-[#F7F5ED] text-palette-deep dark:bg-palette-deep dark:text-palette-cream">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(50,98,77,0.13),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(221,182,67,0.18),transparent_35%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(50,98,77,0.34),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(221,182,67,0.10),transparent_35%)]" />
            <Navbar />
            <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
