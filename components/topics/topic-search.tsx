"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import posthog from "posthog-js";
import {
  BOTANY_S1_PAPERS,
  BOTANY_S1_QUESTIONS,
  BOTANY_S1_TOPICS,
} from "@/lib/topic-search/botany-sem1-index";
import { ADDITIONAL_TOPIC_SEARCH_CATALOG } from "@/lib/topic-search/life-sciences-index";
import { QuestionCoverage } from "@/components/topics/question-coverage";
import {
  groupQuestionsByPaper, questionPdfHref, type SearchEntry, type TopicQuestion, suggestedTopicQuestions, verifiedTopicQuestions,
} from "@/lib/topic-search/search-catalog";

const lifeSciences = "BSc Life Sciences";
const botanySemesterOne: SearchEntry = {
  courseName: lifeSciences,
  key: "s1-bot-dsc",
  semesterId: "1",
  semesterLabel: "Semester 1",
  subjectName: "Botany",
  subjectLabel: "Botany · DSC",
  category: "DSC",
  topics: BOTANY_S1_TOPICS,
  questions: BOTANY_S1_QUESTIONS,
  papers: BOTANY_S1_PAPERS,
  candidateQuestionCount: BOTANY_S1_PAPERS.reduce((total, paper) => total + paper.candidateQuestionCount, 0),
};

const fallbackCatalog: readonly SearchEntry[] = [
  botanySemesterOne,
  ...ADDITIONAL_TOPIC_SEARCH_CATALOG.map((entry) => ({ ...entry, courseName: lifeSciences })),
];

function QuestionResults({ groups, grouped, topicId, suggested = false }: {
  groups: readonly (readonly (TopicQuestion & { relatedPartsByTopic?: Readonly<Record<string, readonly string[]>> })[])[];
  grouped: boolean;
  topicId: string;
  suggested?: boolean;
}) {
  const linkClass = "inline-flex min-h-10 items-center gap-1 rounded-lg px-2 font-semibold text-palette-gold hover:text-palette-cream focus-visible:outline-palette-gold";

  return (
    <ul className="grid gap-2.5">
      {groups.map((group) => (
        <li key={group[0].id} className="min-w-0 rounded-xl border border-white/15 bg-palette-deep/35 p-3 sm:p-4">
          {grouped && <h5 className="mb-2 text-sm font-semibold">{group[0].title} · {group[0].year ?? "Year not recorded"}</h5>}
          <ul className="divide-y divide-white/15">
            {group.map((question) => {
              const pdfHref = questionPdfHref(question);
              const parts = question.relatedPartsByTopic?.[topicId] ?? [];
              const trackPaperOpen = () => posthog.capture("paper_opened", {
                paper_id: question.paperId,
                source: "topic_search",
              });
              return (
                <li key={question.id} className="py-2 first:pt-0 last:pb-0">
                  {suggested && <p className="mb-1 text-xs font-semibold text-palette-gold">AI-suggested related question</p>}
                  <p className="whitespace-pre-line break-words text-sm leading-6 text-palette-cream">{question.text}</p>
                  {parts.length > 0 && (
                    <div className="mt-2 text-xs text-palette-cream/75">
                      <p className="font-semibold">Related parts</p>
                      <ul className="list-disc space-y-1 pl-5">{parts.map((part) => <li key={part}>{part}</li>)}</ul>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-palette-cream/65">
                    <span>{!grouped && (question.title + " · " + (question.year ?? "Year not recorded") + " · ")}
                      Question {question.questionRef} · PDF page{question.pageEnd && question.pageEnd !== question.page
                        ? `s ${question.page}–${question.pageEnd}` : ` ${question.page}`}</span>
                    {pdfHref ? (
                      <div className="flex flex-wrap">
                        {(question.sourcePages ?? [question.page]).map((page) => (
                          <a key={page} href={question.pdfUrl + "#page=" + page} target="_blank" rel="noopener noreferrer" className={linkClass} onClick={trackPaperOpen}>
                            Open PDF to page {page} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <Link href={"/papers/" + question.paperId} className={linkClass} onClick={trackPaperOpen}>
                        Open paper <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                  {!pdfHref && <p className="mt-1 text-[0.68rem] text-palette-cream/50">Check the wording on PDF page {question.page} in the viewer.</p>}
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export function TopicSearch({ approvedCatalog, databaseRelease = false }: {
  approvedCatalog: readonly SearchEntry[] | null;
  databaseRelease?: boolean;
}) {
  const usingApproved = !!approvedCatalog?.length;
  const catalog = approvedCatalog?.length ? approvedCatalog : fallbackCatalog;
  const first = catalog[0];
  const [selectedCourse, setSelectedCourse] = useState(first.courseName);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"DSC" | "DSE" | "">("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [searchedTopicId, setSearchedTopicId] = useState("");

  const courses = [...new Set(catalog.map((entry) => entry.courseName))];
  const courseEntries = catalog.filter((entry) => entry.courseName === selectedCourse);
  const availableSemesters = [...new Map(courseEntries.map((entry) => [entry.semesterId, {
    id: entry.semesterId, label: entry.semesterLabel,
  }])).values()].sort((a, b) => Number(a.id) - Number(b.id));
  const availableEntries = courseEntries.filter((entry) => entry.semesterId === selectedSemester);
  const availableSubjects = [...new Set(availableEntries.map((entry) => entry.subjectName))];
  const availableCategories = [...new Set(
    availableEntries.filter((entry) => entry.subjectName === selectedSubject).map((entry) => entry.category),
  )];
  const selectedEntry = availableEntries.find((entry) =>
    entry.subjectName === selectedSubject && entry.category === selectedCategory,
  );
  const selectedTopic = selectedEntry?.topics.find((topic) => topic.id === searchedTopicId);

  const verifiedByTopic = useMemo(() => new Map(selectedEntry ? selectedEntry.topics.map((topic) => [
    topic.id, verifiedTopicQuestions(selectedEntry, topic.id),
  ]) : []), [selectedEntry]);
  const questionsForTopic = verifiedByTopic.get(searchedTopicId) ?? [];
  const groups = usingApproved ? groupQuestionsByPaper(questionsForTopic) : questionsForTopic.map((question) => [question]);

  const suggestedByTopic = useMemo(() => new Map(selectedEntry ? selectedEntry.topics.map((topic) => [
    topic.id, suggestedTopicQuestions(selectedEntry, topic.id),
  ]) : []), [selectedEntry]);
  const related = groupQuestionsByPaper(suggestedByTopic.get(searchedTopicId) ?? []);

  const reviewCount = selectedEntry && searchedTopicId
    ? selectedEntry.questions.filter((question) =>
      question.topicIds.includes(searchedTopicId)
      && (question.mappingStatus !== "verified" || question.ocrStatus !== "extracted"),
    ).length
    : 0;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    posthog.capture("topic_search_submitted", {
      semester: selectedSemester,
      subject: selectedSubject.toLowerCase(),
      topic_id: selectedTopicId,
    });
    setSearchedTopicId(selectedTopicId);
  }

  function clearResults() {
    setSelectedTopicId("");
    setSearchedTopicId("");
  }

  return (
    <section
      aria-labelledby="topic-search-title"
      data-topic-search-source={usingApproved ? (databaseRelease ? "supabase" : first.coverage ? "local-coverage" : "approved-export") : "static"}
      className="relative isolate overflow-hidden rounded-2xl border border-palette-gold/45 bg-gradient-to-br from-palette-deep via-palette-green to-palette-deep p-4 text-palette-cream shadow-lg shadow-palette-deep/15 sm:rounded-3xl sm:p-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-palette-gold/15" />
      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 id="topic-search-title" className="font-serif text-2xl font-semibold sm:text-3xl">Topic Search</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-palette-gold/40 bg-palette-gold/10 px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-palette-gold">
            <Sparkles aria-hidden="true" className="h-3 w-3" /> NEW FEATURE
          </span>
        </div>
        <p className="mb-4 text-sm text-palette-cream/75">
          Topic coverage is expanding. A missing result does not mean the topic was never asked.
        </p>

        <form onSubmit={handleSearch} className="grid gap-3 md:grid-cols-2 md:items-end xl:grid-cols-[minmax(10rem,0.9fr)_minmax(7rem,0.6fr)_minmax(8rem,0.9fr)_minmax(6rem,0.6fr)_minmax(0,1.7fr)_auto]">
          <label className="min-w-0 text-sm font-medium text-palette-cream/90" htmlFor="topic-search-course">
            Course
            <select
              id="topic-search-course"
              value={selectedCourse}
              onChange={(event) => {
                setSelectedCourse(event.target.value);
                setSelectedSemester("");
                setSelectedSubject("");
                setSelectedCategory("");
                clearResults();
              }}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
            >
              {courses.map((course) => <option key={course}>{course}</option>)}
            </select>
          </label>
          <label className="min-w-0 text-sm font-medium text-palette-cream/90" htmlFor="topic-search-semester">
            Semester
            <select
              id="topic-search-semester"
              value={selectedSemester}
              onChange={(event) => {
                setSelectedSemester(event.target.value);
                setSelectedSubject("");
                setSelectedCategory("");
                clearResults();
              }}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
            >
              <option value="">Select semester</option>
              {availableSemesters.map((semester) => (
                <option key={semester.id} value={semester.id}>{semester.label}</option>
              ))}
            </select>
          </label>

          <label className="min-w-0 text-sm font-medium text-palette-cream/90" htmlFor="topic-search-subject">
            Subject
            <select
              id="topic-search-subject"
              value={selectedSubject}
              onChange={(event) => {
                setSelectedSubject(event.target.value);
                setSelectedCategory("");
                clearResults();
              }}
              disabled={!selectedSemester}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40 disabled:opacity-60"
            >
              <option value="">Select subject</option>
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </label>

          <label className="min-w-0 text-sm font-medium text-palette-cream/90" htmlFor="topic-search-category">
            Category
            <select
              id="topic-search-category"
              value={selectedCategory}
              onChange={(event) => {
                setSelectedCategory(event.target.value as "DSC" | "DSE" | "");
                clearResults();
              }}
              disabled={!selectedSubject}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40 disabled:opacity-60"
            >
              <option value="">Select category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="min-w-0 text-sm font-medium text-palette-cream/90" htmlFor="topic-search-topic">
            Syllabus Topic
            <select
              id="topic-search-topic"
              value={selectedTopicId}
              onChange={(event) => {
                setSelectedTopicId(event.target.value);
                setSearchedTopicId("");
              }}
              disabled={!selectedCategory || !selectedEntry}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40 disabled:opacity-60"
            >
              <option value="">Choose a topic</option>
              {selectedEntry && Array.from(new Set(selectedEntry.topics.map((topic) => topic.unit))).map((unit) => (
                <optgroup key={unit} label={unit}>
                  {selectedEntry.topics.filter((topic) => topic.unit === unit).map((topic) => {
                    const topicQuestions = selectedEntry.questions.filter((question) => question.topicIds.includes(topic.id));
                    const verifiedCount = verifiedByTopic.get(topic.id)?.length ?? 0;
                    const reviewQuestions = topicQuestions.filter((question) =>
                      question.mappingStatus !== "verified" || question.ocrStatus !== "extracted",
                    ).length;
                    const suggestedCount = suggestedByTopic.get(topic.id)?.length ?? 0;
                    const availability = verifiedCount > 0
                      ? `${verifiedCount} verified ${verifiedCount === 1 ? "question" : "questions"}`
                      : reviewQuestions > 0 ? "Review pending" : "No verified matches";
                    const relatedLabel = suggestedCount > 0 ? ` · ${suggestedCount} AI-suggested` : "";

                    return <option key={topic.id} value={topic.id}>{topic.label} · {availability}{relatedLabel}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={!selectedTopicId || !selectedEntry}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-palette-gold px-5 text-sm font-semibold text-palette-deep transition hover:bg-[#E8C65F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search aria-hidden="true" className="h-4 w-4" /> Search
          </button>
        </form>

        {searchedTopicId && selectedTopic && selectedEntry && (
          <div className="mt-4 border-t border-white/15 pt-4" aria-live="polite">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-palette-gold/80">
                  {selectedEntry.semesterLabel} · {selectedEntry.subjectName} · {selectedEntry.category} · {selectedTopic.unit}
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-semibold">{selectedTopic.label}</h3>
              </div>
              <span className="text-xs text-palette-cream/65">
                {questionsForTopic.length} verified {questionsForTopic.length === 1 ? "question" : "questions"}
              </span>
            </div>

            <section aria-labelledby="topic-search-verified-heading" data-topic-tier="verified" className="space-y-2">
              <h4 id="topic-search-verified-heading" className="text-sm font-semibold">Verified topic matches</h4>
              {questionsForTopic.length > 0 ? (
                <QuestionResults groups={groups} grouped={usingApproved} topicId={searchedTopicId} />
              ) : (
                <div className="rounded-lg border border-white/15 bg-palette-deep/25 p-3 text-sm text-palette-cream/75">
                  <p>No verified questions found for this topic yet.</p>
                  {selectedEntry.candidateQuestionCount > 0 && (
                    <p className="mt-1 text-xs text-palette-cream/60">
                      The extraction audit recorded {selectedEntry.candidateQuestionCount} candidate blocks for this paper group.
                      Those blocks are still outside verified results.
                    </p>
                  )}
                </div>
              )}
            </section>

            {selectedEntry.suggestions !== undefined && (
              <section aria-labelledby="topic-search-suggestions-heading" data-topic-tier="suggested"
                className="mt-4 space-y-2 rounded-xl border border-palette-gold/40 bg-palette-gold/5 p-3 sm:p-4">
                <h4 id="topic-search-suggestions-heading" className="text-sm font-semibold text-palette-gold">
                  AI-suggested related questions
                </h4>
                <p className="text-xs leading-5 text-palette-cream/75">
                  These suggestions come from the original papers and may help with revision. They still await academic approval.
                </p>
                {related.length > 0 ? (
                  <QuestionResults groups={related} grouped topicId={searchedTopicId} suggested />
                ) : (
                  <p className="text-sm text-palette-cream/75">No AI-suggested questions are available for this topic yet.</p>
                )}
              </section>
            )}

            {reviewCount > 0 && (
              <p className="mt-2 text-xs leading-5 text-palette-gold/90">
                {reviewCount} candidate {reviewCount === 1 ? "question is" : "questions are"} awaiting OCR review and is not included in verified results.
              </p>
            )}
          </div>
        )}
        {selectedEntry && <QuestionCoverage entry={selectedEntry} />}
      </div>
    </section>
  );
}
