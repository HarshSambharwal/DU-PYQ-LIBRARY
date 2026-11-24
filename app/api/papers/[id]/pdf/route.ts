import { SeverityNumber } from "@opentelemetry/api-logs";
import { posthogAppLogger, posthogLogProvider } from "@/instrumentation";
import {
  getPaperById,
  getPaperPdfUrlById,
} from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

function safeFilenamePart(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

function shortCourseName(courseName: string | undefined): string {
  if (!courseName) return "DU";
  if (/life\s*sciences?/i.test(courseName)) return "LS";
  return courseName;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const isDownload =
    new URL(request.url).searchParams.get("download") === "1";

  // Fetch paper metadata only for downloads.
  // Regular PDF viewing keeps the existing lightweight lookup.
  const paperData = isDownload ? await getPaperById(id) : null;

  const pdfUrl = isDownload
    ? paperData?.paper.pdf_url ?? null
    : await getPaperPdfUrlById(id);

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

  const filename = paperData
    ? [
        shortCourseName(paperData.course?.name),
        paperData.semester?.number != null
          ? `Sem${paperData.semester.number}`
          : null,
        paperData.paper.source_subject_label ||
          paperData.subject?.name ||
          paperData.paper.title,
        paperData.paper.category,
        paperData.paper.year,
        paperData.paper.sequence_number != null
          ? `P${paperData.paper.sequence_number}`
          : null,
        "DUPYQHUB",
      ]
        .map(safeFilenamePart)
        .filter(Boolean)
        .join("_") + ".pdf"
    : "paper.pdf";

  const responseHeaders = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": isDownload
      ? `attachment; filename="${filename}"`
      : 'inline; filename="paper.pdf"',
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "Accept-Ranges": "bytes",
  });

  for (const header of [
    "accept-ranges",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
  ]) {
    const value = pdfResponse.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  await posthogLogProvider?.forceFlush().catch(() => {});
  return new Response(pdfResponse.body, {
    status: pdfResponse.status,
    headers: responseHeaders,
  });
}
