/** @type {import('next').NextConfig} */
const PDFJS_VERSION = "4.10.38";
const PDFJS_LEGACY_VERSION = "3.11.174";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/vendor/pdfjs-legacy/:path*",
        destination: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_LEGACY_VERSION}/legacy/build/:path*`,
      },
      {
        source: "/vendor/pdfjs/:path*",
        destination: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/:path*`,
      },
    ];
  },
};

export default nextConfig;
