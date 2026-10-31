"use client";

import { type FormEvent, useMemo, useState } from "react";

const FEEDBACK_TYPES = [
  ["missing_paper", "Missing paper"],
  ["topic_search_issue", "Topic Search issue / incorrect result"],
  ["website_bug", "Website bug"],
  ["suggestion", "Suggestion"],
] as const;
const MAX_DESCRIPTION_LENGTH = 500;

const fieldClass = "mt-1.5 w-full rounded-xl border border-palette-green/20 bg-[#F6F1E3] px-3.5 py-3 text-sm text-palette-deep outline-none focus:border-palette-gold dark:bg-[#163937] dark:text-palette-cream";
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_FEEDBACK_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export function FeedbackForm() {
  const [error, setError] = useState("");
  const [feedbackType, setFeedbackType] = useState<(typeof FEEDBACK_TYPES)[number][0]>("missing_paper");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const message = useMemo(() => {
    const typeLabel = FEEDBACK_TYPES.find(([value]) => value === feedbackType)?.[1] ?? feedbackType;
    const optionalFields = [
      semester ? `Semester: Semester ${semester}` : "",
      subject.trim() ? `Subject: ${subject.trim()}` : "",
    ].filter(Boolean).join("\n");

    return `*NEW FEEDBACK — DU PYQ HUB*\n\nHello DU PYQ HUB Team!\n\nFeedback Category: ${typeLabel}${optionalFields ? `\n${optionalFields}` : ""}\n\nDescription:\n${description.trim()}\n\nThank you for taking the time to help us improve DU PYQ HUB. Your feedback helps us make the archive more useful for students.`;
  }, [description, feedbackType, semester, subject]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanDescription = description.trim();
    if (!cleanDescription || cleanDescription.length > MAX_DESCRIPTION_LENGTH) {
      setError("Enter a description of up to 500 characters.");
      return;
    }

    if (WHATSAPP_NUMBER.length < 8 || WHATSAPP_NUMBER.length > 15) {
      setError("WhatsApp is not configured yet. Please try again later.");
      return;
    }

    if (!message.trim() || message.includes("\uFFFD")) {
      setError("The feedback message could not be prepared correctly. Please try again.");
      return;
    }
    window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Feedback type <span aria-hidden="true" className="text-red-700">*</span>
          <select className={fieldClass} value={feedbackType} onChange={(event) => setFeedbackType(event.target.value as typeof feedbackType)} required>
            {FEEDBACK_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Semester <span className="font-normal text-palette-deep/60 dark:text-palette-cream/60">(optional)</span>
          <select className={fieldClass} value={semester} onChange={(event) => setSemester(event.target.value)}>
            <option value="">Not specified</option>
            {Array.from({ length: 8 }, (_, index) => String(index + 1)).map((value) => <option key={value} value={value}>Semester {value}</option>)}
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium">
        Subject <span className="font-normal text-palette-deep/60 dark:text-palette-cream/60">(optional)</span>
        <input className={fieldClass} value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={120} placeholder="e.g. Botany" />
      </label>

      <label className="block text-sm font-medium">
        Description <span aria-hidden="true" className="text-red-700">*</span>
        <textarea className={`${fieldClass} min-h-32 resize-y`} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={MAX_DESCRIPTION_LENGTH} required placeholder="What happened, or what should we add?" aria-describedby="feedback-description-count" />
        <span id="feedback-description-count" className="mt-1 block text-right text-xs text-palette-deep/60 dark:text-palette-cream/60">{description.length}/{MAX_DESCRIPTION_LENGTH}</span>
      </label>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <button type="submit" className="w-full rounded-full bg-palette-gold px-5 py-3 text-sm font-semibold text-palette-deep transition hover:bg-[#E8C65F] sm:w-auto">
        Send Feedback
      </button>
      <p className="text-xs leading-5 text-palette-deep/60 dark:text-palette-cream/60">WhatsApp opens with your message ready. Review it and tap Send there; the website does not store your feedback.</p>
    </form>
  );
}
