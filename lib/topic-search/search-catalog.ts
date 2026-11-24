import type { IndexedQuestion, TopicSearchCombination } from "./life-sciences-index";

export type TopicQuestion = Omit<IndexedQuestion, "mappingStatus" | "ocrStatus"> & {
  pdfUrl?: string;
  sourcePages?: readonly number[];
};
export type SearchQuestion = IndexedQuestion & Pick<TopicQuestion, "pdfUrl" | "sourcePages">;
export type SuggestedQuestion = TopicQuestion & {
  pdfUrl: string;
  relatedPartsByTopic: Readonly<Record<string, readonly string[]>>;
};

export type CoverageQuestion = {
  id: string;
  ref: string;
  pages: number[];
  status: "unclassified" | "original_region";
  text: string | null;
  partialText?: string;
};

export type CoveragePaper = {
  paperId: number;
  title: string;
  pdfUrl: string;
  year: number | null;
  pages: number[];
  reviewPages: number[];
  records: CoverageQuestion[];
};

export type SearchEntry = Omit<TopicSearchCombination, "questions"> & {
  courseName: string;
  questions: readonly SearchQuestion[];
  suggestions?: readonly SuggestedQuestion[];
  coverage?: readonly CoveragePaper[];
};

function questionsForTopic<T extends TopicQuestion>(entry: SearchEntry, topicId: string, questions: readonly T[]) {
  if (!entry.topics.some((topic) => topic.id === topicId)) return [];
  const papers = new Map(entry.papers.map((paper) => [paper.id, paper]));
  return questions.filter((question) => {
    const paper = papers.get(question.paperId);
    return question.topicIds.includes(topicId)
      && paper?.importKey === question.importKey
      && paper.subjectName === entry.subjectName
      && paper.category === entry.category
      && paper.semesterId === entry.semesterId
      && paper.year === question.year;
  }).sort((a, b) => (b.year ?? -1) - (a.year ?? -1) || a.paperId - b.paperId || a.page - b.page);
}

export function verifiedTopicQuestions(entry: SearchEntry, topicId: string) {
  return questionsForTopic(entry, topicId, entry.questions.filter((question) =>
    question.mappingStatus === "verified" && question.ocrStatus === "extracted"));
}

export function suggestedTopicQuestions(entry: SearchEntry, topicId: string) {
  return questionsForTopic(entry, topicId, entry.suggestions ?? []);
}

export function groupQuestionsByPaper<T extends TopicQuestion>(questions: readonly T[]) {
  const groups = new Map<number, T[]>();
  for (const question of questions) {
    const existing = groups.get(question.paperId);
    if (existing) existing.push(question);
    else groups.set(question.paperId, [question]);
  }
  return [...groups.values()];
}

export function questionPdfHref(question: TopicQuestion) {
  return question.pdfUrl ? question.pdfUrl + "#page=" + question.page : undefined;
}
