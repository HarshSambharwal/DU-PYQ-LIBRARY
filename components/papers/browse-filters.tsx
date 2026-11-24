"use client";

import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import type { BROWSE_FILTERS, Course, Semester } from "@/lib/supabase/queries";

export function BrowseFilters({
  courses,
  semesters,
  filters,
}: {
  courses: Course[];
  semesters: Semester[];
  filters: typeof BROWSE_FILTERS;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // When only one course exists, use its real database ID automatically.
  const selectedCourse =
    courses.length === 1
      ? String(courses[0].id)
      : searchParams.get("course") ?? "";
  const selectedSemester = searchParams.get("semester") ?? "";
  const selectedFilter = searchParams.get("filter") ?? "";

  const visibleSemesters = useMemo(() => {
    if (!selectedCourse) return semesters;

    return semesters.filter(
      (semester) => String(semester.course_id) === selectedCourse
    );
  }, [semesters, selectedCourse]);

  const update = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove the old search query from the URL.
    params.delete("q");

    // Preserve the single available course when other filters change.
    if (courses.length === 1) {
      params.set("course", String(courses[0].id));
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    // The course cannot be cleared while it is the only available course.
    if (courses.length === 1) {
      params.set("course", String(courses[0].id));
    }

    posthog.capture("paper_browse_filtered", {
      has_search_query: false,
      course_id: params.get("course") || undefined,
      semester_id: params.get("semester") || undefined,
      filter: params.get("filter") || undefined,
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="rounded-3xl border border-palette-gold/25 bg-gradient-to-br from-palette-deep via-palette-deep to-palette-green p-4 text-palette-cream shadow-xl shadow-palette-deep/10 sm:p-5">
      <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-palette-gold">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter Papers
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <select
          value={selectedCourse}
          aria-label="Filter by course"
          onChange={(event) =>
            update({
              course: event.target.value,
              semester: "",
              subject: "",
            })
          }
          className="h-12 w-full rounded-xl border border-palette-cream/15 bg-palette-cream px-3 text-sm text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
        >
          {courses.length !== 1 && <option value="">Select Course</option>}
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSemester}
          aria-label="Filter by semester"
          onChange={(event) =>
            update({
              semester: event.target.value,
              subject: "",
            })
          }
          className="h-12 w-full rounded-xl border border-palette-cream/15 bg-palette-cream px-3 text-sm text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
        >
          <option value="">All Semesters</option>
          {visibleSemesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              Semester {semester.number}
            </option>
          ))}
        </select>

        <select
          value={selectedFilter}
          aria-label="Filter by subject or category"
          onChange={(event) =>
            update({
              filter: event.target.value,
              category: "",
              subject: "",
            })
          }
          className="h-12 w-full rounded-xl border border-palette-cream/15 bg-palette-cream px-3 text-sm text-palette-deep outline-none focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
        >
          <option value="">All Subjects and Categories</option>
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.value === "ge"
                ? "GE (Generic Elective)"
                : filter.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
