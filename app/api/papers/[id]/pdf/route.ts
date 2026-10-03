import { getPaperById } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const paperData = await getPaperById(id);

  if (!paperData) {
    return new Response("Paper not found", { status: 404 });
  }

  const requestHeaders = new Headers();
  const range = request.headers.get("range");
  if (range) requestHeaders.set("range", range);

  const pdfResponse = await fetch(paperData.paper.pdf_url, {
    headers: requestHeaders,
    cache: "force-cache",
  });

  if (!pdfResponse.ok || !pdfResponse.body) {
    return new Response("PDF could not be loaded", { status: 502 });
  }

  const responseHeaders = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": 'inline; filename="paper.pdf"',
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
  });

  for (const header of ["accept-ranges", "content-length", "content-range", "etag", "last-modified"]) {
    const value = pdfResponse.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  return new Response(pdfResponse.body, {
    status: pdfResponse.status,
    headers: responseHeaders,
  });
}
