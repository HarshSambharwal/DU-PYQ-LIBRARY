"use client";

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PDFJS_BASE = "/vendor/pdfjs-legacy";

type PdfViewport = { width: number; height: number };
type PdfRenderTask = { promise: Promise<void>; cancel: () => void };
type PdfPage = {
  getViewport: (options: { scale: number }) => PdfViewport;
  render: (options: {
    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
    transform?: number[];
  }) => PdfRenderTask;
};
type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
};
type PdfLoadingTask = {
  promise: Promise<PdfDocument>;
  destroy: () => Promise<void>;
};
type PdfJsModule = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (options: {
    url: string;
    disableRange?: boolean;
    disableStream?: boolean;
  }) => PdfLoadingTask;
};
type WindowWithPdfJs = Window & { pdfjsLib?: PdfJsModule };

let pdfJsPromise: Promise<PdfJsModule> | null = null;

function loadPdfJs(): Promise<PdfJsModule> {
  const browserWindow = window as WindowWithPdfJs;
  if (browserWindow.pdfjsLib) return Promise.resolve(browserWindow.pdfjsLib);
  if (pdfJsPromise) return pdfJsPromise;

  const script = document.createElement("script");
  script.src = `${PDFJS_BASE}/pdf.min.js`;
  script.async = true;

  const pending = new Promise<PdfJsModule>((resolve, reject) => {
    const fail = (error: Error) => {
      pdfJsPromise = null;
      if (script.parentNode) script.parentNode.removeChild(script);
      reject(error);
    };

    script.onload = () => {
      if (browserWindow.pdfjsLib) {
        resolve(browserWindow.pdfjsLib);
      } else {
        fail(new Error("PDF.js did not initialize"));
      }
    };
    script.onerror = () => fail(new Error("PDF.js could not be loaded"));
    document.head.appendChild(script);
  });

  pdfJsPromise = pending;
  return pending;
}

export function PdfViewer({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentRef = useRef<PdfDocument | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => setContainerWidth(container.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PdfLoadingTask | null = null;

    documentRef.current = null;
    setStatus("loading");
    setPageCount(0);
    setPageNumber(1);
    setZoom(1);

    const loadPdf = async () => {
      try {
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`;
        loadingTask = pdfjs.getDocument({
          url: src,
          // Fetch the whole file in one request. This is more reliable in mobile
          // browsers and embedded WebViews with limited range-request support.
          disableRange: true,
          disableStream: true,
        });
        const pdf = await loadingTask.promise;
        if (cancelled) {
          await loadingTask.destroy();
          return;
        }

        documentRef.current = pdf;
        setPageCount(pdf.numPages);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void loadPdf();
    return () => {
      cancelled = true;
      documentRef.current = null;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [src]);

  useEffect(() => {
    const pdf = documentRef.current;
    const canvas = canvasRef.current;
    if (status !== "ready" || !pdf || !canvas || !containerWidth) return;

    let cancelled = false;
    let renderTask: PdfRenderTask | null = null;

    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const initialViewport = page.getViewport({ scale: 1 });
        const fitScale = Math.min(1, (containerWidth - 24) / initialViewport.width);
        const viewport = page.getViewport({ scale: fitScale * zoom });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas is unavailable");

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
        });
        await renderTask.promise;
      } catch (error) {
        if (!cancelled && (error as { name?: string }).name !== "RenderingCancelledException") {
          setStatus("error");
        }
      }
    };

    void renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [containerWidth, pageNumber, status, zoom]);

  if (status === "error") {
    return (
      <div className="rounded-2xl bg-palette-cream p-6 text-center text-sm text-palette-earth dark:bg-palette-deep dark:text-palette-cream/80" role="alert">
        This PDF could not be displayed here. Use the Download PDF or Open in new tab buttons above.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-palette-cream dark:bg-palette-deep">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-palette-green/20 px-3 py-3 dark:border-palette-gold/15 sm:px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
            disabled={status !== "ready" || pageNumber <= 1}
            aria-label="Previous page"
            className="rounded-lg border border-palette-green/20 bg-white p-2 text-palette-deep disabled:opacity-40 dark:border-palette-gold/20 dark:bg-palette-green dark:text-palette-cream"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-20 text-center text-sm text-palette-earth dark:text-palette-cream/85" aria-live="polite">
            {status === "ready" ? `Page ${pageNumber} of ${pageCount}` : "Loading PDF…"}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber((current) => Math.min(pageCount, current + 1))}
            disabled={status !== "ready" || pageNumber >= pageCount}
            aria-label="Next page"
            className="rounded-lg border border-palette-green/20 bg-white p-2 text-palette-deep disabled:opacity-40 dark:border-palette-gold/20 dark:bg-palette-green dark:text-palette-cream"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((current) => Math.max(0.75, current - 0.25))}
            disabled={status !== "ready" || zoom <= 0.75}
            aria-label="Zoom out"
            className="rounded-lg border border-palette-green/20 bg-white p-2 text-palette-deep disabled:opacity-40 dark:border-palette-gold/20 dark:bg-palette-green dark:text-palette-cream"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm text-palette-earth dark:text-palette-cream/85">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.min(2.5, current + 0.25))}
            disabled={status !== "ready" || zoom >= 2.5}
            aria-label="Zoom in"
            className="rounded-lg border border-palette-green/20 bg-white p-2 text-palette-deep disabled:opacity-40 dark:border-palette-gold/20 dark:bg-palette-green dark:text-palette-cream"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="max-h-[78vh] overflow-auto p-3 sm:p-4">
        {status === "loading" && (
          <div className="flex min-h-72 items-center justify-center text-sm text-palette-earth/85 dark:text-palette-cream/75">
            Loading {title}…
          </div>
        )}
        <canvas
          ref={canvasRef}
          aria-label={`${title}, page ${pageNumber}`}
          className={status === "ready" ? "mx-auto block shadow-lg" : "hidden"}
        />
      </div>
    </div>
  );
}
