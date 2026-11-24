/** Server reader for the local, explicitly selected SQLite export. */
import { createHash } from "node:crypto";
import { open, realpath } from "node:fs/promises";
import path from "node:path";

import examScope from "./exam-season-scope.json" with { type: "json" };

import type { CoverageQuestion, SearchEntry, SearchQuestion, SuggestedQuestion, TopicQuestion } from "./search-catalog";

const MAX_BYTES = 16 * 1024 * 1024;
const COURSE = "BSc Life Sciences";
const SUBJECTS = new Set(["Botany", "Chemistry", "Zoology"]);
const UUID = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
const SHA256 = /^[a-f0-9]{64}$/;

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function positiveInt(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function id(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

function safePdf(value: unknown, host: string, key: string): value is string {
  if (!text(value) || /[\x00-\x20\\]/.test(value)) return false;
  try {
    const url = new URL(value);
    const prefix = "/storage/v1/object/public/PYQ/bulk-import/" + key + "/";
    if (url.protocol !== "https:" || url.host !== host || url.username || url.password
      || url.search || url.hash || !url.pathname.startsWith(prefix)) return false;
    const name = decodeURIComponent(url.pathname.slice(prefix.length));
    return name.toLowerCase().endsWith(".pdf") && !/[/\\\x00-\x1f]/.test(name);
  } catch {
    return false;
  }
}

function pageRange(value: unknown, start: number, end: number, count: number): boolean {
  return Array.isArray(value) && value.length > 0 && value[0] === start
    && value[value.length - 1] === end
    && value.every((page, index) => positiveInt(page) && page <= count && (index === 0 || value[index - 1] < page));
}

function consistent(map: Map<string, string>, key: string, fields: unknown[]) {
  const fingerprint = JSON.stringify(fields);
  const old = map.get(key);
  if (old !== undefined && old !== fingerprint) throw new Error("Conflicting export identity");
  map.set(key, fingerprint);
}

function words(text: string) {
  return text.normalize("NFKC").toLowerCase().replace(/&/g, " and ").replace(/['’]s\b/g, "")
    .replace(/\s+/g, " ").trim();
}

function emptyEntry(course: string, semester: number, subject: string, category: "DSC" | "DSE"): SearchEntry {
  return {
    key: JSON.stringify([course, semester, subject, category]), courseName: course,
    semesterId: String(semester), semesterLabel: "Semester " + semester, subjectName: subject,
    subjectLabel: subject + " · " + category, category, topics: [], questions: [], papers: [], candidateQuestionCount: 0,
  };
}

function parseTopicSearch(input: unknown, examSeasonOnly: boolean, allowSuggestions: boolean): SearchEntry[] {
  if (!object(input) || typeof input.storage_host !== "string" || !/^[a-z0-9]+\.supabase\.co$/.test(input.storage_host)
    || !Array.isArray(input.results)) throw new Error("Invalid Topic Search export");
  const hybrid = allowSuggestions && input.format_version === 3 && input.source === "dupyq-exam-season-hybrid"
    && Array.isArray(input.suggestions);
  if (!hybrid && (input.format_version !== 2 || input.source !== "dupyq-approved-offline-export"
    || "suggestions" in input)) throw new Error("Invalid approved export envelope");
  const rows: { row: unknown; suggested: boolean }[] = input.results.map((row: unknown) => ({ row, suggested: false }));
  if (hybrid) for (const row of input.suggestions as unknown[]) rows.push({ row, suggested: true });

  const entries = new Map<string, SearchEntry>();
  const questions = new Map<string, SearchQuestion>();
  const suggestions = new Map<string, SuggestedQuestion>();
  const mappingIds = new Set<string>();
  const pairs = new Set<string>();
  const paperIdentity = new Map<string, string>();
  const questionIdentity = new Map<string, string>();
  const topicIdentity = new Map<string, string>();
  for (const { row, suggested } of rows) {
    if (!object(row)) throw new Error("Invalid result");
    const { paper_id, paper_title, import_key, course, semester, subject, category, year,
      question_id, question_version_id, question_ref, question_text, question_content_sha256,
      page_start, page_end, source_pages, paper_page_count, syllabus_version_id,
      mapping_id, topic_id, topic_label, unit_label, pdf_url, publication_eligible, related_parts } = row;
    if (publication_eligible !== !suggested || !positiveInt(paper_id) || paper_id === 362
      || course !== COURSE || !positiveInt(semester) || semester > 8 || !text(subject) || !SUBJECTS.has(subject)
      || (category !== "DSC" && category !== "DSE") || (semester === 6 && subject === "Chemistry" && category === "DSE")
      || !(year === null || (positiveInt(year) && year >= 1900 && year <= 2200))
      || !text(import_key) || !/^dupyq-file-[a-f0-9]{16}$/.test(import_key)
      || !safePdf(pdf_url, input.storage_host, import_key) || !text(paper_title)
      || !id(question_id) || !id(question_version_id) || !id(syllabus_version_id) || !id(mapping_id) || !id(topic_id)
      || !text(question_ref) || !text(question_text) || !text(topic_label) || !text(unit_label)
      || createHash("sha256").update(question_text).digest("hex") !== question_content_sha256
      || !positiveInt(page_start) || !positiveInt(page_end) || !positiveInt(paper_page_count)
      || !pageRange(source_pages, page_start, page_end, paper_page_count)) throw new Error("Invalid approved result");

    if (suggested) {
      if (!Array.isArray(related_parts) || related_parts.length > 12
        || new Set(related_parts).size !== related_parts.length
        || related_parts.some((part) => !text(part) || !words(question_text).includes(words(part)))) {
        throw new Error("Invalid suggestion subpart evidence");
      }
    } else if (related_parts !== undefined) {
      throw new Error("Verified rows cannot carry suggested parts");
    }

    const scope = examScope as Record<string, number[]>;
    if (examSeasonOnly && !scope[semester + "/" + subject + "/" + category]?.includes(paper_id)) {
      throw new Error("Unexpected exam-season paper");
    }
    const key = JSON.stringify([course, semester, subject, category]);
    const pair = question_id + ":" + topic_id;
    if (mappingIds.has(mapping_id) || pairs.has(pair)) throw new Error("Duplicate mapping");
    mappingIds.add(mapping_id);
    pairs.add(pair);
    consistent(paperIdentity, String(paper_id), [key, import_key, paper_title, year, pdf_url, paper_page_count, syllabus_version_id]);
    consistent(questionIdentity, question_id, [paper_id, question_version_id, question_ref, question_text, source_pages]);
    consistent(topicIdentity, topic_id, [course, semester, subject, syllabus_version_id, topic_label, unit_label]);

    let entry = entries.get(key);
    if (!entry) {
      entry = { ...emptyEntry(course, semester, subject, category), ...(hybrid && { suggestions: [] }) };
      entries.set(key, entry);
    }
    if (!entry.papers.some((paper) => paper.id === paper_id)) {
      entry.papers = [...entry.papers, {
        id: paper_id, importKey: import_key, title: paper_title, year, semesterId: String(semester),
        subjectName: subject, category, candidateQuestionCount: 0,
      }];
    }
    if (!entry.topics.some((topic) => topic.id === topic_id)) {
      entry.topics = [...entry.topics, { id: topic_id, label: topic_label, unit: unit_label }];
    }
    const base: TopicQuestion = {
      id: question_id, paperId: paper_id, importKey: import_key, title: paper_title, year, page: page_start,
      pageEnd: page_end, questionRef: question_ref, text: question_text, topicIds: [topic_id], pdfUrl: pdf_url,
      sourcePages: source_pages as number[],
    };
    if (suggested) {
      const parts = related_parts as string[];
      const existing = suggestions.get(question_id);
      if (existing) {
        existing.topicIds = [...existing.topicIds, topic_id];
        existing.relatedPartsByTopic = { ...existing.relatedPartsByTopic, [topic_id]: parts };
      } else {
        const next: SuggestedQuestion = { ...base, pdfUrl: pdf_url, relatedPartsByTopic: { [topic_id]: parts } };
        suggestions.set(question_id, next);
        entry.suggestions = [...(entry.suggestions ?? []), next];
      }
    } else {
      const question = questions.get(question_id);
      if (question) question.topicIds = [...question.topicIds, topic_id];
      else {
        const next: SearchQuestion = { ...base, mappingStatus: "verified", ocrStatus: "extracted" };
        questions.set(question_id, next);
        entry.questions = [...entry.questions, next];
      }
    }
  }
  return [...entries.values()].sort((a, b) => Number(a.semesterId) - Number(b.semesterId)
    || a.subjectName.localeCompare(b.subjectName) || a.category.localeCompare(b.category));
}

/** Keep the digest-pinned legacy export approved-only. */
export function parseApprovedTopicSearch(input: unknown, examSeasonOnly = false): SearchEntry[] {
  return parseTopicSearch(input, examSeasonOnly, false);
}

export function parseExamSeasonSnapshot(input: unknown): SearchEntry[] {
  if (object(input) && input.format_version === 4) return parseLocalExamCoverage(input);
  return parseTopicSearch(input, true, true);
}

export function parseLocalExamCoverage(input: unknown): SearchEntry[] {
  const hosted = object(input) && input.format_version === 4 && input.source === "dupyq-exam-season-owner-coverage";
  if (!object(input) || (!hosted && (input.format_version !== 1 || input.source !== "dupyq-local-exam-coverage"))
    || !object(input.hybrid) || input.hybrid.format_version !== 3 || !Array.isArray(input.papers)) {
    throw new Error("Invalid coverage envelope");
  }
  if (hosted && (input.boundary_review !== "owner-confirmed-only" || !positiveInt(input.question_count)
    || !Array.isArray(input.topic_catalog) || input.storage_host !== input.hybrid.storage_host)) {
    throw new Error("Invalid published coverage envelope");
  }
  const entries = parseTopicSearch(input.hybrid, true, true);
  const boundaryOnly = input.boundary_review === "owner-confirmed-only";
  const scope = examScope as Record<string, number[]>;
  const expected = new Set(Object.values(scope).flat());
  const known = new Set(entries.flatMap((entry) => [...entry.questions, ...entry.suggestions ?? []].map((q) => q.id)));
  const verifiedRows = input.hybrid.results as Record<string, unknown>[];
  const suggestedRows = input.hybrid.suggestions as Record<string, unknown>[];
  const mappedRows = [...verifiedRows, ...suggestedRows];
  const mapped = new Map(mappedRows.map((row) => [row.paper_id, row]));
  if (hosted) {
    const verifiedIds = new Set(verifiedRows.map((row) => row.question_id));
    if (suggestedRows.some((row) => verifiedIds.has(row.question_id))) {
      throw new Error("Question appears in both verified and suggested tiers");
    }
  }
  const eligibility = new Map<string, Set<SearchEntry>>();
  for (const row of input.papers) {
    if (!object(row)) throw new Error("Invalid local coverage paper");
    const pages = row.pages;
    if (!positiveInt(row.paper_id) || !expected.delete(row.paper_id)
      || !Array.isArray(row.scope) || row.scope.length !== 4 || row.scope[0] !== COURSE
      || !scope[row.scope.slice(1).join("/")]?.includes(row.paper_id)
      || !positiveInt(row.paper_page_count) || row.paper_page_count > 1000
      || !Array.isArray(pages) || pages.length !== row.paper_page_count
      || pages.some((page, index) => page !== index + 1)
      || !Array.isArray(row.review_pages) || new Set(row.review_pages).size !== row.review_pages.length
      || row.review_pages.some((page) => !positiveInt(page) || !pages.includes(page))
      || (hosted && row.review_pages.length !== 0)
      || !text(row.title) || !text(row.import_key) || !/^dupyq-file-[a-f0-9]{16}$/.test(row.import_key)
      || !(row.year === null || (positiveInt(row.year) && row.year >= 1900 && row.year <= 2200))
      || !id(row.syllabus_version_id) || !safePdf(row.pdf_url, String(input.hybrid.storage_host), row.import_key)
      || !Array.isArray(row.records)) throw new Error("Invalid local coverage paper");
    const citations = mappedRows.filter((citation) => citation.paper_id === row.paper_id);
    if ((!mapped.has(row.paper_id) && !boundaryOnly) || citations.some((citation) => citation.pdf_url !== row.pdf_url
      || citation.import_key !== row.import_key || citation.year !== row.year || citation.paper_title !== row.title
      || citation.paper_page_count !== row.paper_page_count || citation.syllabus_version_id !== row.syllabus_version_id)) {
      throw new Error("Conflicting local coverage paper");
    }
    const [course, semester, subject, category] = row.scope;
    let entry = entries.find((item) => item.key === JSON.stringify(row.scope));
    if (!entry && boundaryOnly) {
      entry = emptyEntry(course, semester, subject, category);
      entries.push(entry);
    }
    if (!entry) throw new Error("Local coverage scope has no matching catalogue entry");
    const version = row.syllabus_version_id;
    if (!eligibility.has(version)) eligibility.set(version, new Set());
    eligibility.get(version)?.add(entry);
    const records: CoverageQuestion[] = [];
    for (const q of row.records) {
      if (!object(q) || !id(q.id) || known.has(q.id) || !text(q.ref) || q.ref.length > 100
        || !Array.isArray(q.pages) || !pageRange(q.pages, q.pages[0], q.pages.at(-1), row.paper_page_count)
        || (q.status !== "unclassified" && q.status !== "original_region")
        || (q.status === "unclassified" ? !text(q.text) : q.text !== null)
        || (q.partial_text !== undefined && (q.status !== "original_region" || !text(q.partial_text)
          || q.partial_text.length > 8000))) {
        throw new Error("Invalid or duplicate coverage question");
      }
      known.add(q.id);
      records.push({ id: q.id, ref: q.ref, pages: q.pages, status: q.status, text: q.text as string | null,
        ...(typeof q.partial_text === "string" && { partialText: q.partial_text }) });
    }
    entry.coverage = [...(entry.coverage ?? []), { paperId: row.paper_id, title: row.title, year: row.year,
      pdfUrl: row.pdf_url, pages, reviewPages: row.review_pages, records }];
  }
  if (expected.size) throw new Error("Local coverage omits papers");
  if (input.question_count !== undefined && input.question_count !== known.size) throw new Error("Coverage count mismatch");
  if (input.topic_catalog !== undefined) {
    if (!Array.isArray(input.topic_catalog)) throw new Error("Invalid syllabus topic catalogue");
    const seen = new Map<string, Record<string, unknown>>();
    const catalogueVersions = new Set<string>();
    for (const topic of input.topic_catalog) {
      if (!object(topic) || !id(topic.id) || !text(topic.label) || !text(topic.unit)
        || !id(topic.syllabus_version_id) || seen.has(topic.id) || !eligibility.has(topic.syllabus_version_id)) {
        throw new Error("Invalid or duplicate syllabus topic");
      }
      seen.set(topic.id, topic);
      catalogueVersions.add(topic.syllabus_version_id);
      for (const entry of eligibility.get(topic.syllabus_version_id) ?? []) {
        const existing = entry.topics.find((item) => item.id === topic.id);
        if (existing && (existing.label !== topic.label || existing.unit !== topic.unit)) {
          throw new Error("Conflicting syllabus label");
        }
        if (!existing) entry.topics = [...entry.topics, { id: topic.id, label: topic.label, unit: topic.unit }];
      }
    }
    for (const row of mappedRows) {
      const topic = id(row.topic_id) ? seen.get(row.topic_id) : undefined;
      if (!topic || topic.syllabus_version_id !== row.syllabus_version_id
        || topic.label !== row.topic_label || topic.unit !== row.unit_label) {
        throw new Error("Mapped topic conflicts with the syllabus catalogue");
      }
    }
    if (hosted && [...eligibility.keys()].some((version) => !catalogueVersions.has(version))) {
      throw new Error("Paper syllabus has no published topic catalogue");
    }
  }
  return entries.sort((a, b) => Number(a.semesterId) - Number(b.semesterId)
    || a.subjectName.localeCompare(b.subjectName) || a.category.localeCompare(b.category));
}

function inside(candidate: string, root: string) {
  const relative = path.relative(root, candidate);
  return relative !== "" && !path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(".." + path.sep);
}

/** Use only an opt-in, immutable export under the ignored local audit directory. */
export async function readApprovedTopicSearch(
  filename = process.env.TOPIC_SEARCH_APPROVED_EXPORT,
  fingerprint = process.env.TOPIC_SEARCH_APPROVED_EXPORT_SHA256,
  workspace = process.cwd(),
): Promise<SearchEntry[] | null> {
  return readLocalPayload(filename, fingerprint, workspace, parseApprovedTopicSearch);
}

export async function readLocalExamCoverage(
  filename = process.env.TOPIC_SEARCH_LOCAL_COVERAGE,
  fingerprint = process.env.TOPIC_SEARCH_LOCAL_COVERAGE_SHA256,
  workspace = process.cwd(),
): Promise<SearchEntry[] | null> {
  if (process.env.VERCEL || process.env.TOPIC_SEARCH_SUPABASE_RELEASE) return null;
  return readLocalPayload(filename, fingerprint, workspace, parseLocalExamCoverage);
}

async function readLocalPayload(
  filename: string | undefined, fingerprint: string | undefined, workspace: string,
  parse: (input: unknown) => SearchEntry[],
): Promise<SearchEntry[] | null> {
  if (!filename || !fingerprint || !SHA256.test(fingerprint) || path.isAbsolute(filename)) return null;
  try {
    const root = await realpath(workspace);
    const audit = await realpath(path.join(root, ".topic-search-audit"));
    const file = await realpath(path.resolve(root, filename));
    if (!inside(audit, root) || !inside(file, audit)) return null;
    const descriptor = await open(file, "r");
    try {
      const stat = await descriptor.stat();
      if (!stat.isFile() || stat.size > MAX_BYTES) return null;
      const bytes = await descriptor.readFile();
      if (bytes.length > MAX_BYTES || createHash("sha256").update(bytes).digest("hex") !== fingerprint) return null;
      const entries = parse(JSON.parse(bytes.toString("utf8")));
      return entries.length ? entries : null;
    } finally {
      await descriptor.close();
    }
  } catch {
    return null;
  }
}

let cachedSnapshot: { endpoint: string; release: string; digest: string; entries: SearchEntry[] } | undefined;

/** Check public visibility on every request and reuse the validated body on warm instances. */
export async function readSupabaseTopicSearch(
  release = process.env.TOPIC_SEARCH_SUPABASE_RELEASE,
  endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  fetcher: typeof fetch = fetch,
): Promise<SearchEntry[] | null> {
  if (!release || !/^exam-season-[a-z0-9-]{1,57}$/.test(release) || !endpoint || !key) return null;
  try {
    const base = new URL(endpoint);
    const loopback = base.protocol === "http:" && base.hostname === "127.0.0.1";
    if (base.pathname !== "/" || base.username || base.password || base.search || base.hash
      || (!loopback && (base.protocol !== "https:" || base.port || !/^[a-z0-9]+\.supabase\.co$/.test(base.hostname)))) {
      return null;
    }
    const query = new URL("/rest/v1/topic_search_release_snapshots", base);
    query.searchParams.set("release_key", "eq." + release);
    query.searchParams.set("limit", "1");
    const read = (fields: string) => {
      query.searchParams.set("select", fields);
      return fetcher(query, {
        headers: { apikey: key, Accept: "application/json" },
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(3000),
      });
    };
    const previous = cachedSnapshot;
    if (previous?.endpoint === endpoint && previous.release === release) {
      const status = await read("release_key,payload_sha256");
      if (!status.ok) return null;
      const rows: unknown = await status.json();
      if (!Array.isArray(rows) || rows.length !== 1 || !object(rows[0]) || rows[0].release_key !== release) return null;
      if (rows[0].payload_sha256 === previous.digest) return previous.entries;
    }
    const response = await read("release_key,payload_text,payload_sha256");
    if (!response.ok) return null;
    const rows: unknown = await response.json();
    if (!Array.isArray(rows) || rows.length !== 1 || !object(rows[0])) return null;
    const snapshot = rows[0];
    if (snapshot.release_key !== release || !text(snapshot.payload_text)
      || Buffer.byteLength(snapshot.payload_text, "utf8") > MAX_BYTES
      || createHash("sha256").update(snapshot.payload_text).digest("hex") !== snapshot.payload_sha256) return null;
    const payload: unknown = JSON.parse(snapshot.payload_text);
    if (!object(payload) || (!loopback && payload.storage_host !== base.hostname)) return null;
    const entries = parseExamSeasonSnapshot(payload);
    if (!entries.length || !text(snapshot.payload_sha256)) return null;
    cachedSnapshot = { endpoint, release, digest: snapshot.payload_sha256, entries };
    return entries;
  } catch {
    return null;
  }
}
