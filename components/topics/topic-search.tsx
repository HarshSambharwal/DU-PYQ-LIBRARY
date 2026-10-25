"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { ArrowUpRight, Search, Sparkles } from "lucide-react";
import { TOPIC_SEARCH_CATALOG } from "@/lib/topic-search/botany-sem1-index";

type TopicSubjectKey = keyof typeof TOPIC_SEARCH_CATALOG;
type TopicSubjectIndex = (typeof TOPIC_SEARCH_CATALOG)[TopicSubjectKey];

const catalogEntries = Object.entries(TOPIC_SEARCH_CATALOG) as [TopicSubjectKey, TopicSubjectIndex][];
const availableSemesters = [...new Map(
  catalogEntries.flatMap(([, subject]) => subject.semesters.map((semester) => [semester.id, semester] as const)),
).values()];

export function BotanySemesterOneTopicSearch() {
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<TopicSubjectKey>("botany");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [searchedTopicId, setSearchedTopicId] = useState<string>("");
  const availableSubjects = catalogEntries.filter(([, subject]) =>
    subject.semesters.some((semester) => semester.id === selectedSemester),
  );
  const subjectIndex = TOPIC_SEARCH_CATALOG[selectedSubjectKey];
  const semesterIndex = subjectIndex.semesters.find((item) => item.id === selectedSemester);
  const selectedTopic = semesterIndex?.topics.find((topic) => topic.id === searchedTopicId);

  const matchingQuestions = useMemo(() => {
    if (!semesterIndex || !searchedTopicId) return [];
    const paperById = new Map<number, (typeof semesterIndex.papers)[number]>(
      semesterIndex.papers.map((paper) => [paper.id, paper]),
    );

    return semesterIndex.questions
      .filter((question) => {
        const paper = paperById.get(question.paperId);
        return question.topicIds.includes(searchedTopicId as (typeof semesterIndex.topics)[number]["id"])
          && paper?.subject === subjectIndex.label
          && String(paper.semester) === selectedSemester
          && paper.year === question.year;
      })
      .sort((a, b) => b.year - a.year || a.paperId - b.paperId || a.page - b.page);
  }, [searchedTopicId, selectedSemester, semesterIndex, subjectIndex.label]);

  const confirmedQuestions = matchingQuestions.filter(
    (question) => question.mappingStatus === "verified" && question.ocrStatus === "extracted",
  );
  const reviewQuestions = matchingQuestions.length - confirmedQuestions.length;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchedTopicId(selectedTopicId);
  }

  return (
    <section
      aria-labelledby="topic-search-title"
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
        <p className="mb-4 text-sm text-palette-cream/75">Find previous-year questions by syllabus topic.</p>

        <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[minmax(7rem,0.7fr)_minmax(8rem,0.8fr)_minmax(0,1.7fr)_auto] sm:items-end">
          <label className="min-w-0 text-sm font-medium text-palette-cream/90" htmlFor="topic-search-semester">
            Semester
            <select
              id="topic-search-semester"
              value={selectedSemester}
              onChange={(event) => {
                const nextSemester = event.target.value;
                const nextSubjects = catalogEntries.filter(([, subject]) =>
                  subject.semesters.some((semester) => semester.id === nextSemester),
                );
                setSelectedSemester(nextSemester);
                if (!nextSubjects.some(([key]) => key === selectedSubjectKey)) {
                  setSelectedSubjectKey(nextSubjects[0]?.[0] ?? selectedSubjectKey);
                }
                setSelectedTopicId("");
                setSearchedTopicId("");
              }}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
            >
              {availableSemesters.map((semester) => (
                <option key={semester.id} value={semester.id}>{semester.label}</option>
              ))}
            </select>
          </label>

          <label className="min-w-0 text-sm font-medium text-palette-cream/90" htmlFor="topic-search-subject">
            Subject
            <select
              id="topic-search-subject"
              value={selectedSubjectKey}
              onChange={(event) => {
                setSelectedSubjectKey(event.target.value as TopicSubjectKey);
                setSelectedTopicId("");
                setSearchedTopicId("");
              }}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
            >
              {availableSubjects.map(([key, subject]) => (
                <option key={key} value={key}>{subject.label}</option>
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
              disabled={!semesterIndex}
              className="mt-1.5 h-11 w-full rounded-lg border border-palette-green/20 bg-palette-cream px-3 text-sm font-normal text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40 disabled:opacity-60"
            >
              <option value="">Choose a topic</option>
              {semesterIndex && Array.from(new Set(semesterIndex.topics.map((topic) => topic.unit))).map((unit) => (
                <optgroup key={unit} label={unit}>
                  {semesterIndex.topics.filter((topic) => topic.unit === unit).map((topic) => {
                    const topicQuestions = semesterIndex.questions.filter((question) => {
                      const paper = semesterIndex.papers.find((item) => item.id === question.paperId);
                      return question.topicIds.includes(topic.id)
                        && paper?.subject === subjectIndex.label
                        && String(paper.semester) === selectedSemester
                        && paper.year === question.year;
                    });
                    const verifiedCount = topicQuestions.filter(
                      (question) => question.mappingStatus === "verified" && question.ocrStatus === "extracted",
                    ).length;
                    const reviewCount = topicQuestions.length - verifiedCount;
                    const availability = verifiedCount > 0
                      ? `${verifiedCount} verified ${verifiedCount === 1 ? "question" : "questions"}`
                      : reviewCount > 0 ? "Review pending" : "No verified matches";

                    return <option key={topic.id} value={topic.id}>{topic.label} · {availability}</option>;
                  })}
                </optgroup>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={!selectedTopicId || !semesterIndex}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-palette-gold px-5 text-sm font-semibold text-palette-deep transition hover:bg-[#E8C65F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search aria-hidden="true" className="h-4 w-4" /> Search
          </button>
        </form>

        {searchedTopicId && selectedTopic && semesterIndex && (
          <div className="mt-4 border-t border-white/15 pt-4" aria-live="polite">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-palette-gold/80">{selectedTopic.unit}</p>
                <h3 className="mt-0.5 font-serif text-lg font-semibold">{selectedTopic.label}</h3>
              </div>
              <span className="text-xs text-palette-cream/65">
                {confirmedQuestions.length} verified {confirmedQuestions.length === 1 ? "question" : "questions"}
              </span>
            </div>

            {confirmedQuestions.length > 0 ? (
              <ul className="grid gap-2.5">
                {confirmedQuestions.map((question) => {
                  const paper = semesterIndex.papers.find((item) => item.id === question.paperId);
                  if (!paper) return null;
                  return (
                    <li key={question.id} className="min-w-0 rounded-xl border border-white/15 bg-palette-deep/35 p-3 sm:p-4">
                      <p className="whitespace-pre-line text-sm leading-6 text-palette-cream">{question.text}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-palette-cream/65">
                        <span>{paper.title} · {paper.year} · Question {question.questionRef} · PDF page {question.page}</span>
                        <Link
                          href={`/papers/${paper.id}`}
                          className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 font-semibold text-palette-gold hover:text-palette-cream focus-visible:outline-palette-gold"
                        >
                          Open paper <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                      <p className="mt-1 text-[0.68rem] text-palette-cream/50">PDF page {question.page}; navigate to this page in the viewer. Check the source PDF for OCR wording.</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="rounded-lg border border-white/15 bg-palette-deep/25 p-3 text-sm text-palette-cream/75">
                No verified questions found for this topic yet.
              </p>
            )}

            {reviewQuestions > 0 && (
              <p className="mt-2 text-xs leading-5 text-palette-gold/90">
                {reviewQuestions} candidate {reviewQuestions === 1 ? "question is" : "questions are"} awaiting OCR review and is not included in verified results.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
