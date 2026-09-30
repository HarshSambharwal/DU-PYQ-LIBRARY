# DU PYQ HUB

Modern frontend for Delhi University Previous Year Question Papers.

## Tech Stack

- Next.js 14
- React + TypeScript
- Tailwind CSS
- Supabase
- Framer Motion
- Lucide Icons

## Features

- Premium SaaS-inspired, mobile-first UI
- Dark and light theme support
- Dynamic Supabase-powered data for courses, semesters, subjects, and papers
- Homepage, browse page, paper detail page, and about page
- Loading skeleton states for route-level loading
- Reusable component-driven architecture

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add environment variables in `.env.local` using `.env.example`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

## Supabase Tables Expected

- `courses` (`id`, `name`)
- `semester` (`id`, `number`, `course_id`)
- `subject_master` (`id`, `name`)
- `subjects` (`id`, `semester_id`, `name`)
- `papers` (`id`, `title`, `year`, `pdf_url`, `subject_id`, `semester_id`)
