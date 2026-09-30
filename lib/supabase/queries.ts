import { getSupabaseClient } from "@/lib/supabase/client";

export type Course = { id: number; name: string };
export type Semester = { id: number; number: number; course_id: number };
export type Subject = { id: number; semester_id: number; name: string };
export type Paper = {
  id: number;
  title: string;
  year: number;
  pdf_url: string;
  subject_id: number;
  semester_id: number;
};

export async function getHomeData() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      stats: { papers: 0, courses: 0, subjects: 0 },
      featuredSubjects: [] as Subject[],
      recentPapers: [] as Paper[],
    };
  }

  const [papersCount, coursesCount, subjectsCount, featuredSubjects, recentPapers] =
    await Promise.all([
      supabase.from("papers").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("subjects").select("*", { count: "exact", head: true }),
      supabase.from("subjects").select("id,name,semester_id").limit(6),
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
    featuredSubjects: featuredSubjects.data ?? [],
    recentPapers: recentPapers.data ?? [],
  };
}

export async function getBrowseFilters() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      courses: [] as Course[],
      semesters: [] as Semester[],
      subjects: [] as Subject[],
    };
  }

  const [courses, semesters, subjects] = await Promise.all([
    supabase.from("courses").select("id,name").order("name"),
    supabase.from("semester").select("id,number,course_id").order("number"),
    supabase.from("subjects").select("id,name,semester_id").order("name"),
  ]);

  return {
    courses: courses.data ?? [],
    semesters: semesters.data ?? [],
    subjects: subjects.data ?? [],
  };
}

export async function getPapers(params: {
  search?: string;
  courseId?: number;
  semesterId?: number;
  subjectId?: number;
}) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { papers: [] as Paper[], subjectMap: new Map<number, Subject>(), semesterMap: new Map<number, Semester>() };
  }

  let semesterIdsForCourse: number[] | undefined;
  if (params.courseId) {
    const { data } = await supabase
      .from("semester")
      .select("id")
      .eq("course_id", params.courseId);
    semesterIdsForCourse = (data ?? []).map((item) => item.id);
    if (!semesterIdsForCourse.length) {
      return { papers: [] as Paper[], subjectMap: new Map<number, Subject>(), semesterMap: new Map<number, Semester>() };
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

  const { data: papers = [] } = await query;

  const subjectIds = [...new Set(papers.map((paper) => paper.subject_id))];
  const semesterIds = [...new Set(papers.map((paper) => paper.semester_id))];

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
    subjectMap: new Map((subjectsResult.data ?? []).map((subject) => [subject.id, subject])),
    semesterMap: new Map((semestersResult.data ?? []).map((semester) => [semester.id, semester])),
  };
}

export async function getPaperById(id: string) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data: paper } = await supabase
    .from("papers")
    .select("id,title,year,pdf_url,subject_id,semester_id")
    .eq("id", id)
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

  const subject = subjectRes.data ?? null;
  const semester = semesterRes.data ?? null;

  let course: Course | null = null;
  if (semester?.course_id) {
    const { data } = await supabase
      .from("courses")
      .select("id,name")
      .eq("id", semester.course_id)
      .single();
    course = data ?? null;
  }

  return { paper, subject, semester, course };
}
