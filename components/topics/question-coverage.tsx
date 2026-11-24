import type { CoveragePaper, SearchEntry } from "@/lib/topic-search/search-catalog";

function Pages({ paper, pages }: { paper: CoveragePaper; pages: readonly number[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {pages.map((page) => (
        <li key={page}>
          <a href={paper.pdfUrl + "#page=" + page} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center rounded-lg border border-white/20 px-2 text-xs text-palette-gold hover:text-palette-cream"
            aria-label={paper.title + ", open original PDF page " + page}>
            PDF page {page}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function QuestionCoverage({ entry }: { entry: SearchEntry }) {
  if (!entry.coverage?.length) return null;
  return (
    <section data-topic-tier="coverage" aria-labelledby="exam-coverage-heading" className="mt-4 rounded-xl border border-white/20 p-3 sm:p-4">
      <h4 id="exam-coverage-heading" className="text-sm font-semibold">Browse questions by paper</h4>
      <p className="mt-1 text-xs leading-5 text-palette-cream/75">
        Unclassified questions are available here while their topics are reviewed.
        Open any original PDF page for questions, diagrams or tables that still need an extraction check.
      </p>
      <div className="mt-3 grid gap-2">
        {entry.coverage.map((paper) => {
          const readable = paper.records.filter((record) => record.status === "unclassified");
          const original = paper.records.filter((record) => record.status === "original_region");
          return (
            <details key={paper.paperId} className="min-w-0 rounded-lg border border-white/15 bg-palette-deep/35 p-3">
              <summary className="cursor-pointer break-words text-sm font-semibold">
                {paper.title} · {paper.year ?? "Year not recorded"}
              </summary>
              <div className="mt-3 space-y-3">
                <div>
                  <h5 className="mb-1 text-xs font-semibold">Original paper · {paper.pages.length} PDF pages</h5>
                  <Pages paper={paper} pages={paper.pages} />
                </div>
                {readable.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold">Unclassified · needs topic review</h5>
                    <ul className="mt-2 divide-y divide-white/15">
                      {readable.map((record) => (
                        <li key={record.id} className="space-y-1 py-2">
                          <p className="text-xs text-palette-cream/75">Question {record.ref}</p>
                          <p className="whitespace-pre-wrap break-words text-sm">{record.text}</p>
                          <Pages paper={paper} pages={record.pages} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {original.length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold">Read these questions in the original PDF</h5>
                    <ul className="mt-1 divide-y divide-white/15">
                      {original.map((record) => (
                        <li key={record.id} className="py-2">
                          <p className="text-xs text-palette-cream/75">Question {record.ref} · check the original</p>
                          {record.partialText && <>
                            <p className="pt-1 text-xs font-medium">Partial transcription</p>
                            <p className="whitespace-pre-wrap break-words pb-1 text-sm">{record.partialText}</p>
                          </>}
                          <Pages paper={paper} pages={record.pages} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {paper.reviewPages.length > 0 && (
                  <p className="text-xs text-palette-cream/70">
                    Question boundaries still need review on PDF pages {paper.reviewPages.join(", ")}.
                  </p>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
