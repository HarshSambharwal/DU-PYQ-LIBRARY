import { getSupabaseClient } from "@/lib/supabase/client";

export type Course = { id: number; name: string };
export type Semester = { id: number; number: number; course_id: number };
export type Subject = { id: number; name: string };
export type SemesterSubject = Subject & { semester_id: number };
export const PAPER_CATEGORIES = ["DSC", "DSE", "VAC", "SEC", "AEC", "GE", "Back Paper"] as const;
export type PaperCategory = (typeof PAPER_CATEGORIES)[number];
export const BROWSE_FILTERS = [
  { value: "botany", label: "Botany", category: "DSC", subjectName: "Botany", sourceLabels: ["Botany", "DSC Botany"] },
  { value: "zoology", label: "Zoology", category: "DSC", subjectName: "Zoology", sourceLabels: ["Zoology", "DSC zoo"] },
  { value: "chemistry", label: "Chemistry", category: "DSC", subjectName: "Chemistry", sourceLabels: ["Chemistry", "DSC CHEM"] },
  { value: "dse-botany", label: "DSE Botany", category: "DSE", subjectName: "Botany", sourceLabels: ["DSE Botany", "Botany"] },
  { value: "dse-zoology", label: "DSE Zoology", category: "DSE", subjectName: "Zoology", sourceLabels: ["DSE Zoology", "Zoology"] },
  { value: "dse-chemistry", label: "DSE Chemistry", category: "DSE", subjectName: "Chemistry", sourceLabels: ["DSE Chemistry", "DSE chem", "DSE CHEM", "Chemistry"] },
  { value: "vac", label: "VAC", category: "VAC" },
  { value: "aec", label: "AEC", category: "AEC" },
  { value: "sec", label: "SEC", category: "SEC" },
  { value: "ge", label: "GE", category: "GE" },
] as const;
export type BrowseFilterValue = (typeof BROWSE_FILTERS)[number]["value"];
export type Paper = {
  id: number;
  title: string;
  sequence_number: number | null;
  year: number | null;
  pdf_url: string;
  subject_id: number | null;
  semester_id: number | null;
  category: PaperCategory | null;
  source_subject_label: string | null;
};

type BrowseResult = {
  papers: Paper[];
  paperCount: number;
  subjectMap: Map<number, Subject>;
  semesterMap: Map<number, Semester>;
};

export async function getHomeData(): Promise<{
  stats: { papers: number; courses: number; subjects: number };
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      stats: { papers: 0, courses: 0, subjects: 0 },
    };
  }

  const [papersCount, coursesCount, subjectsCount] = await Promise.all([
      supabase.from("papers").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("subject_master").select("*", { count: "exact", head: true }),
    ]);

  return {
    stats: {
      papers: papersCount.count ?? 0,
      courses: coursesCount.count ?? 0,
      subjects: subjectsCount.count ?? 0,
    },
  };
}

export async function getBrowseFilters(): Promise<{
  courses: Course[];
  semesters: Semester[];
  filters: typeof BROWSE_FILTERS;
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      courses: [],
      semesters: [],
      filters: BROWSE_FILTERS,
    };
  }

  const [courses, semesters] = await Promise.all([
    supabase.from("courses").select("id,name").order("name"),
    supabase.from("semester").select("id,number,course_id").order("number"),
  ]);

  return {
    courses: (courses.data ?? []) as Course[],
    semesters: (semesters.data ?? []) as Semester[],
    filters: BROWSE_FILTERS,
  };
}

export async function getPapers(params: {
  search?: string;
  courseId?: number;
  semesterId?: number;
  subjectId?: number;
  browseFilter?: BrowseFilterValue;
  category?: PaperCategory;
}): Promise<BrowseResult> {
  const supabase = getSupabaseClient();
  const search = params.search?.trim();

  if (!supabase) {
    return {
      papers: [],
      paperCount: 0,
      subjectMap: new Map<number, Subject>(),
      semesterMap: new Map<number, Semester>(),
    };
  }

  const hasFilters = Boolean(
    search || params.courseId || params.semesterId || params.subjectId || params.browseFilter || params.category,
  );
  if (!hasFilters) {
    const { count } = await supabase.from("papers").select("id", { count: "exact", head: true });
    return {
      papers: [],
      paperCount: count ?? 0,
      subjectMap: new Map<number, Subject>(),
      semesterMap: new Map<number, Semester>(),
    };
  }

  let semesterIdsForCourse: number[] | undefined;
  if (params.courseId) {
    const { data } = await supabase
      .from("semester")
      .select("id")
      .eq("course_id", params.courseId);
    semesterIdsForCourse = (data ?? []).map((item) => item.id as number);
    if (!semesterIdsForCourse.length) {
      return {
        papers: [],
        paperCount: 0,
        subjectMap: new Map<number, Subject>(),
        semesterMap: new Map<number, Semester>(),
      };
    }
  }

  let query = supabase
    .from("papers")
    .select("id,title,sequence_number,year,pdf_url,subject_id,semester_id,category,source_subject_label");

  const browseFilter = BROWSE_FILTERS.find((item) => item.value === params.browseFilter);
  let browseSubjectIds: number[] = [];
  if (browseFilter && "subjectName" in browseFilter) {
    const { data } = await supabase
      .from("subjects")
      .select("id")
      .ilike("name", browseFilter.subjectName);
    browseSubjectIds = (data ?? []).map((subject) => subject.id as number);
  }

  const sequenceOrderedFilter = browseFilter && ["VAC", "SEC", "AEC"].includes(browseFilter.category);
  if (search || sequenceOrderedFilter || ["VAC", "SEC", "AEC"].includes(params.category ?? "")) {
    query = query
      .order("sequence_number", { ascending: true, nullsFirst: false })
      .order("year", { ascending: false, nullsFirst: false })
      .order("title", { ascending: true });
  } else {
    query = query.order("year", { ascending: false, nullsFirst: false });
  }

  if (search) query = query.ilike("title", `%${search}%`);
  if (params.semesterId) query = query.eq("semester_id", params.semesterId);
  if (params.subjectId) query = query.eq("subject_id", params.subjectId);
  if (browseFilter && "subjectName" in browseFilter) {
    const branches: string[] = [];
    if (browseSubjectIds.length) {
      branches.push(`and(category.eq.${browseFilter.category},subject_id.in.(${browseSubjectIds.join(",")}))`);
      if (browseFilter.category === "DSC") {
        branches.push(`and(category.is.null,subject_id.in.(${browseSubjectIds.join(",")}))`);
      }
    }
    for (const sourceLabel of browseFilter.sourceLabels) {
      const quotedLabel = `"${sourceLabel.replaceAll('"', '\\"')}"`;
      branches.push(`and(category.eq.${browseFilter.category},source_subject_label.eq.${quotedLabel})`);
      if (browseFilter.category === "DSC") {
        branches.push(`and(category.is.null,source_subject_label.eq.${quotedLabel})`);
      }
    }
    query = query.or(branches.join(","));
  } else if (browseFilter?.value === "ge") {
    query = query.or('category.eq.GE,source_subject_label.eq.GE,source_subject_label.eq."Generic Elective"');
  } else if (browseFilter) {
    query = query.eq("category", browseFilter.category);
  } else if (params.category === "DSC") {
    query = query.or("category.eq.DSC,and(category.is.null,subject_id.not.is.null)");
  } else if (params.category) {
    query = query.eq("category", params.category);
  }
  if (semesterIdsForCourse) query = query.in("semester_id", semesterIdsForCourse);

  const papersResult = await query;
  const papers = (papersResult.data ?? []) as Paper[];

  const subjectIds = Array.from(new Set(papers.flatMap((paper) => paper.subject_id ? [paper.subject_id] : [])));
  const semesterIds = Array.from(new Set(papers.flatMap((paper) => paper.semester_id ? [paper.semester_id] : [])));

  const [subjectsResult, semestersResult] = await Promise.all([
    subjectIds.length
      ? supabase.from("subjects").select("id,name,semester_id").in("id", subjectIds)
      : Promise.resolve({ data: [] as Subject[] }),
    semesterIds.length
      ? supabase.from("semester").select("id,number,course_id").in("id", semesterIds)
      : Promise.resolve({ data: [] as Semester[] }),
  ]);

  return {
    papers,
    paperCount: papers.length,
    subjectMap: new Map(
      ((subjectsResult.data ?? []) as Subject[]).map((subject) => [subject.id, subject]),
    ),
    semesterMap: new Map(
      ((semestersResult.data ?? []) as Semester[]).map((semester) => [semester.id, semester]),
    ),
  };
}

export async function getPaperById(id: string): Promise<{
  paper: Paper;
  subject: Subject | null;
  semester: Semester | null;
  course: Course | null;
} | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data: paper } = await supabase
    .from("papers")
    .select("id,title,sequence_number,year,pdf_url,subject_id,semester_id,category,source_subject_label")
    .eq("id", Number(id))
    .single();

  if (!paper) return null;

  const [subjectRes, semesterRes] = await Promise.all([
    paper.subject_id ? supabase
      .from("subjects")
      .select("id,name,semester_id")
      .eq("id", paper.subject_id)
      .single() : Promise.resolve({ data: null }),
    paper.semester_id ? supabase
      .from("semester")
      .select("id,number,course_id")
      .eq("id", paper.semester_id)
      .single() : Promise.resolve({ data: null }),
  ]);

  const subject = (subjectRes.data as Subject | null) ?? null;
  const semester = (semesterRes.data as Semester | null) ?? null;

  let course: Course | null = null;
  if (semester?.course_id) {
    const { data } = await supabase
      .from("courses")
      .select("id,name")
      .eq("id", semester.course_id)
      .single();
    course = (data as Course | null) ?? null;
  }

  return { paper: paper as Paper, subject, semester, course };
}

export async function getPaperPdfUrlById(id: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const paperId = Number(id);

  if (!supabase || !Number.isSafeInteger(paperId) || paperId <= 0) return null;

  const { data, error } = await supabase
    .from("papers")
    .select("pdf_url")
    .eq("id", paperId)
    .single();

  if (error || typeof data?.pdf_url !== "string" || data.pdf_url.length === 0) return null;
  return data.pdf_url;
}
