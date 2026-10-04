import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";

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
          <div className="relative isolate min-h-screen overflow-x-hidden bg-[#F6F1E3] text-palette-deep dark:bg-[#102F2D] dark:text-palette-cream">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_5%,rgba(50,98,77,0.14),transparent_36%),radial-gradient(ellipse_at_85%_24%,rgba(221,182,67,0.16),transparent_31%)] dark:bg-[radial-gradient(ellipse_at_15%_5%,rgba(50,98,77,0.3),transparent_36%),radial-gradient(ellipse_at_85%_24%,rgba(221,182,67,0.08),transparent_31%)]"
            />
            <Navbar />
            <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
