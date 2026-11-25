
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://du-pyq-library.vercel.app"),

  title: "DU Previous Year Question Papers | DU PYQ Hub",

  description:
    "Find Delhi University previous year question papers for BSc Life Sciences and other available courses. Browse semester-wise PYQs, search by topic, download and share PDFs.",

  openGraph: {
    title: "DU Previous Year Question Papers | DU PYQ Hub",
    description:
      "Explore Delhi University previous year question papers, including BSc Life Sciences PYQs. Browse by semester and subject, search by topic, download and share papers.",
    url: "https://du-pyq-library.vercel.app/",
    siteName: "DU PYQ Hub",
    type: "website",
    locale: "en_IN",
  },

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "-sIDktU5fq2gaj6tGxuIfjYkR4reMQeh8qmQDbNx4Hk",
  },
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
        <Analytics />
      </body>
    </html>
  );
}
