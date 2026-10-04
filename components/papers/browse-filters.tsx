"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Course, Semester, SemesterSubject } from "@/lib/supabase/queries";

export function BrowseFilters({
  courses,
  semesters,
  subjects,
}: {
  courses: Course[];
  semesters: Semester[];
  subjects: SemesterSubject[];
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
    <div className="rounded-3xl border border-palette-gold/25 bg-gradient-to-br from-palette-deep via-palette-deep to-palette-green p-4 text-palette-cream shadow-xl shadow-palette-deep/10 sm:p-5">
      <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-palette-gold">
        <SlidersHorizontal className="h-3.5 w-3.5" /> Narrow your search
      </p>
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-palette-earth" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && update({ q: search })}
            placeholder="Search papers by title..."
            aria-label="Search papers by title"
            className="h-12 w-full rounded-xl border border-palette-green/15 bg-palette-cream pl-10 pr-4 text-sm text-palette-deep outline-none transition placeholder:text-palette-earth/65 focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <select
            value={selectedCourse}
            aria-label="Filter by course"
            onChange={(event) => update({ course: event.target.value, semester: "", subject: "" })}
            className="h-12 rounded-xl border border-palette-cream/15 bg-palette-cream px-3 text-sm text-palette-deep outline-none ring-palette-gold/40 transition focus:border-palette-gold focus:ring-2"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>

          <select
            value={selectedSemester}
            aria-label="Filter by semester"
            onChange={(event) => update({ semester: event.target.value, subject: "" })}
            className="h-12 rounded-xl border border-palette-cream/15 bg-palette-cream px-3 text-sm text-palette-deep outline-none ring-palette-gold/40 transition focus:border-palette-gold focus:ring-2"
          >
            <option value="">All Semesters</option>
            {visibleSemesters.map((semester) => (
              <option key={semester.id} value={semester.id}>Semester {semester.number}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            aria-label="Filter by subject"
            onChange={(event) => update({ subject: event.target.value })}
            className="h-12 rounded-xl border border-palette-cream/15 bg-palette-cream px-3 text-sm text-palette-deep outline-none ring-palette-gold/40 transition focus:border-palette-gold focus:ring-2"
          >
            <option value="">All Subjects</option>
            {visibleSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => update({ q: search })}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-palette-gold px-5 text-sm font-semibold text-palette-deep shadow transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F] focus-visible:outline-offset-4"
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}
