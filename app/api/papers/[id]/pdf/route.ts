import { SeverityNumber } from "@opentelemetry/api-logs";
import { posthogAppLogger, posthogLogProvider } from "@/instrumentation";
import { getPaperPdfUrlById } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const pdfUrl = await getPaperPdfUrlById(id);

  if (!pdfUrl) {
    posthogAppLogger?.emit({
      body: "pdf_proxy_paper_not_found",
      severityNumber: SeverityNumber.WARN,
      attributes: { paper_id: id },
    });
    await posthogLogProvider?.forceFlush().catch(() => {});
    return new Response("Paper not found", { status: 404 });
  }

  posthogAppLogger?.emit({
    body: "pdf_proxy_fetch_started",
    severityNumber: SeverityNumber.INFO,
    attributes: { paper_id: id },
  });

  const requestHeaders = new Headers();
  const range = request.headers.get("range");
  if (range) requestHeaders.set("range", range);

  const pdfResponse = await fetch(pdfUrl, {
    headers: requestHeaders,
    cache: "force-cache",
  });

  if (!pdfResponse.ok || !pdfResponse.body) {
    posthogAppLogger?.emit({
      body: "pdf_proxy_fetch_failed",
      severityNumber: SeverityNumber.WARN,
      attributes: { paper_id: id, upstream_status: pdfResponse.status },
    });
    await posthogLogProvider?.forceFlush().catch(() => {});
    return new Response("PDF could not be loaded", { status: 502 });
  }

  const responseHeaders = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": 'inline; filename="paper.pdf"',
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "Accept-Ranges": "bytes",
  });

  for (const header of ["accept-ranges", "content-length", "content-range", "etag", "last-modified"]) {
    const value = pdfResponse.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  await posthogLogProvider?.forceFlush().catch(() => {});
  return new Response(pdfResponse.body, {
    status: pdfResponse.status,
    headers: responseHeaders,
  });
}
