import { getSupabaseClient } from "@/lib/supabase/client";

export type Course = { id: number; name: string };
export type Semester = { id: number; number: number; course_id: number };
export type Subject = { id: number; name: string };
export type Paper = {
  id: number;
  title: string;
  year: number;
  pdf_url: string;
  subject_id: number;
  semester_id: number;
};

type BrowseResult = {
  papers: Paper[];
  subjectMap: Map<number, Subject>;
  semesterMap: Map<number, Semester>;
};

export async function getHomeData(): Promise<{
  stats: { papers: number; courses: number; subjects: number };
  featuredSubjects: Subject[];
  recentPapers: Paper[];
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      stats: { papers: 0, courses: 0, subjects: 0 },
      featuredSubjects: [],
      recentPapers: [],
    };
  }

  const [papersCount, coursesCount, subjectsCount, featuredSubjects, recentPapers] =
    await Promise.all([
      supabase.from("papers").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("subject_master").select("*", { count: "exact", head: true }),
      supabase.from("subject_master").select("id,name,"),
      supabase
        .from("papers")
        .select("id,title,year,pdf_url,subject_id,semester_id")
        .order("year", { ascending: false })
        .limit(6),
    ]);

  return {
    stats: {
      papers: papersCount.count ?? 0,
      courses: coursesCount.count ?? 0,
      subjects: subjectsCount.count ?? 0,
    },
    featuredSubjects: (featuredSubjects.data || []) as Subject[],
    recentPapers: (recentPapers.data ?? []) as Paper[],
  };
}

export async function getBrowseFilters(): Promise<{
  courses: Course[];
  semesters: Semester[];
  subjects: Subject[];
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      courses: [],
      semesters: [],
      subjects: [],
    };
  }

  const [courses, semesters, subjects] = await Promise.all([
    supabase.from("courses").select("id,name").order("name"),
    supabase.from("semester").select("id,number,course_id").order("number"),
    supabase.from("subjects").select("id,name,semester_id").order("name"),
  ]);

  return {
    courses: (courses.data ?? []) as Course[],
    semesters: (semesters.data ?? []) as Semester[],
    subjects: (subjects.data ?? []) as Subject[],
  };
}

export async function getPapers(params: {
  search?: string;
  courseId?: number;
  semesterId?: number;
  subjectId?: number;
}): Promise<BrowseResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      papers: [],
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
        subjectMap: new Map<number, Subject>(),
        semesterMap: new Map<number, Semester>(),
      };
    }
  }

  let query = supabase
    .from("papers")
    .select("id,title,year,pdf_url,subject_id,semester_id")
    .order("year", { ascending: false });

  if (params.search) query = query.ilike("title", `%${params.search}%`);
  if (params.semesterId) query = query.eq("semester_id", params.semesterId);
  if (params.subjectId) query = query.eq("subject_id", params.subjectId);
  if (semesterIdsForCourse) query = query.in("semester_id", semesterIdsForCourse);

  const papersResult = await query;
  const papers = (papersResult.data ?? []) as Paper[];

  const subjectIds = Array.from(new Set(papers.map((paper) => paper.subject_id)));
  const semesterIds = Array.from(new Set(papers.map((paper) => paper.semester_id)));

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
    .select("id,title,year,pdf_url,subject_id,semester_id")
    .eq("id", Number(id))
    .single();

  if (!paper) return null;

  const [subjectRes, semesterRes] = await Promise.all([
    supabase
      .from("subjects")
      .select("id,name,semester_id")
      .eq("id", paper.subject_id)
      .single(),
    supabase
      .from("semester")
      .select("id,number,course_id")
      .eq("id", paper.semester_id)
      .single(),
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
