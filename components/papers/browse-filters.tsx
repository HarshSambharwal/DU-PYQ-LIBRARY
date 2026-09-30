"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Course, Semester, Subject } from "@/lib/supabase/queries";

export function BrowseFilters({
  courses,
  semesters,
  subjects,
}: {
  courses: Course[];
  semesters: Semester[];
  subjects: Subject[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const selectedCourse = searchParams.get("course") ?? "";
  const selectedSemester = searchParams.get("semester") ?? "";
  const selectedSubject = searchParams.get("subject") ?? "";

  const visibleSemesters = useMemo(() => {
    if (!selectedCourse) return semesters;
    return semesters.filter((semester) => String(semester.course_id) === selectedCourse);
  }, [semesters, selectedCourse]);

  const visibleSubjects = useMemo(() => {
    if (!selectedSemester) return subjects;
    return subjects.filter((subject) => String(subject.semester_id) === selectedSemester);
  }, [subjects, selectedSemester]);

  const update = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-black/5 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && update({ q: search })}
          placeholder="Search papers by title..."
          className="h-11 w-full rounded-xl border border-black/10 bg-white pl-10 pr-3 text-sm outline-none ring-indigo-500/40 transition focus:ring dark:border-white/10 dark:bg-slate-950"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={selectedCourse}
          onChange={(event) => update({ course: event.target.value, semester: "", subject: "" })}
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-indigo-500/40 focus:ring dark:border-white/10 dark:bg-slate-950"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSemester}
          onChange={(event) => update({ semester: event.target.value, subject: "" })}
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-indigo-500/40 focus:ring dark:border-white/10 dark:bg-slate-950"
        >
          <option value="">All Semesters</option>
          {visibleSemesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              Semester {semester.number}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(event) => update({ subject: event.target.value })}
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none ring-indigo-500/40 focus:ring dark:border-white/10 dark:bg-slate-950"
        >
          <option value="">All Subjects</option>
          {visibleSubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={() => update({ q: search })}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 text-sm font-medium text-white shadow transition hover:opacity-90"
      >
        Apply filters
      </button>
    </div>
  );
}
