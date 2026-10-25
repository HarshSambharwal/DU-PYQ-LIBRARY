import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  FileCheck2,
  Search,
  Sparkles,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { BROWSE_FILTERS, getHomeData } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

const subjectAccents = [
  "bg-palette-green text-palette-cream",
  "bg-palette-gold text-palette-deep",
  "bg-palette-earth text-palette-cream",
  "bg-palette-rust text-palette-cream",
  "bg-palette-deep text-palette-gold",
];

// Quotations are kept here with their work and a source trail so wording,
// translation, and attribution can be checked without a runtime service.
const studyQuotes = [
  { quote: "All men by nature desire to know.", author: "Aristotle", work: "Metaphysics, I.1", source: "https://self.gutenberg.org/wplbn0000622995-metaphysics-by-aristotle.aspx" },
  { quote: "Wonder is the feeling of a philosopher, and philosophy begins in wonder.", author: "Plato", work: "Theaetetus, 155d · trans. Benjamin Jowett", source: "https://www.gutenberg.org/files/1726/1726-h/1726-h.htm" },
  { quote: "To learn something and then, in due season, to practise it—is that not a pleasure?", author: "Confucius", work: "Analects, 1.1 · translation", source: "https://confucius-analects.org/en/books/01/01/" },
  { quote: "To learn without thinking is fruitless; to think without learning is perilous.", author: "Confucius", work: "Analects, 2.15 · translation", source: "https://confucius-analects.org/en/books/02/15/" },
  { quote: "Read not to contradict and confute; nor to believe and take for granted; nor to find talk and discourse; but to weigh and consider.", author: "Francis Bacon", work: "Essays, ‘Of Studies’", source: "https://www.gutenberg.org/files/575/575-h/575-h.htm" },
  { quote: "Reading maketh a full man; conference a ready man; and writing an exact man.", author: "Francis Bacon", work: "Essays, ‘Of Studies’", source: "https://www.gutenberg.org/files/575/575-h/575-h.htm" },
  { quote: "Histories make men wise, poets witty, the mathematics subtle, natural philosophy deep, moral grave, logic and rhetoric able to contend.", author: "Francis Bacon", work: "Essays, ‘Of Studies’", source: "https://www.gutenberg.org/files/575/575-h/575-h.htm" },
  { quote: "That the reading of good books, is like the conversation with the honestest persons of the past age, who were the Authors of them, and even a studyed conversation, wherein they discover to us the best only of their thoughts.", author: "René Descartes", work: "Discourse on the Method, Part I · English translation, 1649", source: "https://www.gutenberg.org/files/25830/25830-h/25830-h.htm" },
  { quote: "Would you have a man reason well, you must use him to it betimes; exercise his mind in observing the connection of ideas and following them in train.", author: "John Locke", work: "Of the Conduct of the Understanding, §6", source: "https://en.wikisource.org/wiki/Page:Of_the_conduct_of_the_understanding_(IA_ofconductofunder00lock).pdf/45" },
  { quote: "Only that education deserves emphatically to be termed cultivation of mind, which teaches young people how to begin to think.", author: "Mary Wollstonecraft", work: "A Vindication of the Rights of Woman", source: "https://www.gutenberg.org/cache/epub/3420/pg3420.html" },
  { quote: "Above all, try to teach them to combine their ideas.", author: "Mary Wollstonecraft", work: "Thoughts on the Education of Daughters", source: "https://www.gutenberg.org/files/67466/67466-h/67466-h.htm" },
  { quote: "He who knows only his own side of the case, knows little of that.", author: "John Stuart Mill", work: "On Liberty, Chapter II", source: "https://www.gutenberg.org/files/34901/34901-h/34901-h.htm" },
  { quote: "Patience and tenacity of purpose are worth more than twice their weight of cleverness.", author: "Thomas Henry Huxley", work: "Aphorisms and Reflections", source: "https://www.gutenberg.org/files/35584/35584-h/35584-h.htm" },
  { quote: "All truth, in the long run, is only common sense clarified.", author: "Thomas Henry Huxley", work: "Aphorisms and Reflections", source: "https://www.gutenberg.org/files/35584/35584-h/35584-h.htm" },
  { quote: "Hardly any faculty is more important for the intellectual progress of man than the power of attention.", author: "Charles Darwin", work: "The Descent of Man, Chapter III", source: "https://darwin-online.org.uk/content/contentblock?basepage=1&hitpage=210&itemID=F937.1&viewtype=side" },
  { quote: "From so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved.", author: "Charles Darwin", work: "On the Origin of Species, Chapter XIV", source: "https://www.gutenberg.org/files/1228/1228-h/1228-h.htm" },
  { quote: "The question is not what you look at, but what you see.", author: "Henry David Thoreau", work: "Journal, 1851", source: "https://www.gutenberg.org/files/59031/59031-h/59031-h" },
  { quote: "Books are the treasured wealth of the world and the fit inheritance of generations and nations.", author: "Henry David Thoreau", work: "Walden, ‘Reading’", source: "https://www.gutenberg.org/files/205/205-h/205-h.htm" },
  { quote: "There is no frigate like a book\nTo take us lands away,\nNor any coursers like a page\nOf prancing poetry.", author: "Emily Dickinson", work: "‘A Book’ · Poems, First Series", source: "https://www.gutenberg.org/files/12242/12242-h/12242-h.htm" },
  { quote: "The brain is wider than the sky,\nFor, put them side by side,", author: "Emily Dickinson", work: "‘The Brain’ · Poems, First Series", source: "https://www.gutenberg.org/files/12242/12242-h/12242-h.htm" },
  { quote: "The important thing is not to stop questioning. Curiosity has its own reason for existence.", author: "Albert Einstein", work: "Statement to William Miller, reported in LIFE, 2 May 1955", source: "https://quoteinvestigator.com/2024/10/17/curiosity-reason/" },
  { quote: "If I have seen further it is by standing on ye shoulders of Giants.", author: "Isaac Newton", work: "Letter to Robert Hooke, 5 February 1675/76", source: "https://www.lindahall.org/about/news/scientist-of-the-day/isaac-newton-3/" },
  { quote: "Chance favors invention only for minds prepared for discoveries by patient study and persevering efforts.", author: "Louis Pasteur", work: "Œuvres de Pasteur, Vol. VII, p. 215", source: "https://www.pasteur.fr/en/whats-new/latest-news/features/institut-pasteur-2018-legacy-excellence" },
  { quote: "Thoughts without content are void; intuitions without conceptions, blind.", author: "Immanuel Kant", work: "Critique of Pure Reason · trans. J. M. D. Meiklejohn", source: "https://www.gutenberg.org/cache/epub/4280/pg4280.html" },
  { quote: "The Analytical Engine has no pretensions whatever to originate anything.", author: "Ada Lovelace", work: "Notes on Menabrea’s ‘Sketch of the Analytical Engine’ (1843)", source: "https://psychclassics.yorku.ca/Lovelace/lovelace.htm" },
  { quote: "Where knowledge is free;\nWhere the world has not been broken up into fragments by narrow domestic walls;", author: "Rabindranath Tagore", work: "Gitanjali, poem 35 · English translation by the author", source: "https://www.gutenberg.org/files/7164/7164-h/7164-h.htm" },
  { quote: "Knowledge unfits a child to be a slave.", author: "Frederick Douglass", work: "My Bondage and My Freedom", source: "https://www.gutenberg.org/files/202/202-h/202-h.htm" },
  { quote: "We discover truth not only by reasoning, but by feeling.", author: "Blaise Pascal", work: "Pensées · trans. W. F. Trotter", source: "https://www.gutenberg.org/files/26726/26726-h/26726-h.htm" },
  { quote: "Nothing is too wonderful to be true, if it be consistent with the laws of nature.", author: "Michael Faraday", work: "Laboratory journal, 19 March 1849", source: "https://calteches.library.caltech.edu/619/2/Thomas.pdf" },
  { quote: "We especially need imagination in science.", author: "Maria Mitchell", work: "Life, Letters and Journals, p. 186", source: "https://www.gutenberg.org/cache/epub/10202/pg10202-images.html" },
  { quote: "The first principle is that you must not fool yourself—and you are the easiest person to fool.", author: "Richard P. Feynman", work: "‘Cargo Cult Science,’ Caltech commencement address (1974)", source: "https://calteches.library.caltech.edu/51/2/CargoCult.htm" },
];

function StudyNook() {
  return (
    <div className="study-nook" aria-hidden="true">
      <div className="study-wall">
        <p className="study-note">
          Same questions.
          <strong>Bigger dreams.</strong>
        </p>
      </div>
      <span className="study-floating-tag"><Sparkles className="h-3.5 w-3.5 text-palette-gold" /> Your revision shelf</span>
      <div className="study-book study-book--base"><span>DU QUESTION PAPERS</span></div>
      <div className="study-book study-book--middle"><span>FIELD NOTES · VOL. 1</span></div>
      <div className="study-book study-book--top"><span>THE STUDY EDITION</span></div>
      <div className="study-pencil-pot">
        <span className="study-pencil study-pencil--one" />
        <span className="study-pencil study-pencil--two" />
        <span className="study-pencil study-pencil--three" />
      </div>
      <div className="study-shelf" />
    </div>
  );
}

export default async function Home() {
  const { stats } = await getHomeData();
  const studyQuote = studyQuotes[Math.floor(Math.random() * studyQuotes.length)];

  return (
    <div className="space-y-12 py-7 sm:space-y-16 sm:py-10">
      <AnimatedSection className="relative isolate overflow-hidden rounded-[2rem] border border-palette-gold/30 bg-gradient-to-br from-palette-deep via-palette-deep to-palette-green p-6 text-palette-cream shadow-2xl shadow-palette-deep/20 sm:p-10 lg:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-palette-gold/15" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-palette-gold/10" />
        <div className="relative grid items-center gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
          <div className="relative z-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-palette-gold/40 bg-palette-gold/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-palette-gold">
              <Sparkles className="h-3.5 w-3.5" /> Delhi University prep, elevated
            </p>
            <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-palette-cream sm:text-5xl lg:text-[3.65rem]">
              Find your next
              <span className="block text-palette-gold">right answer.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-palette-cream/75 sm:text-base">
              Previous year papers, neatly arranged by course, semester, and subject. Spend less time searching and more time preparing.
            </p>

            <form action="/browse" className="mt-7 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-palette-earth" />
                <input
                  type="search"
                  name="q"
                  aria-label="Search by subject or paper title"
                  placeholder="Search a subject or paper title"
                  className="h-12 w-full rounded-xl border border-palette-green/15 bg-palette-cream pl-10 pr-4 text-sm text-palette-deep outline-none transition placeholder:text-palette-earth/70 focus:border-palette-gold focus:ring-2 focus:ring-palette-gold/40"
                />
              </div>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-palette-gold px-5 text-sm font-semibold text-palette-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F]">
                Search papers <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-palette-cream/65">
              <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-palette-gold" /> Course-wise archive</span>
              <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-palette-gold" /> Semester filters</span>
            </div>
          </div>

          <div className="relative z-0 -mx-1 mt-3 lg:mx-0 lg:mt-0">
            <StudyNook />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.08}>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Courses covered", value: stats.courses, icon: Building2 },
            { label: "Subjects to explore", value: BROWSE_FILTERS.length, icon: BookOpen },
            { label: "Papers available", value: stats.papers, icon: FileCheck2 },
          ].map((item) => (
            <div key={item.label} className="group flex items-center gap-4 rounded-2xl border border-palette-green/15 bg-white/80 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-palette-gold/60 hover:shadow-md dark:border-palette-gold/15 dark:bg-palette-green/50 sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-palette-gold/20 text-palette-earth transition group-hover:rotate-3 dark:text-palette-gold">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-bold tracking-tight">{item.value}</p>
                <p className="text-xs text-palette-earth/80 dark:text-palette-cream/70">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.12}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-palette-earth dark:text-palette-gold">Pick up where you need</p>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Browse by subject</h2>
          </div>
          <Link href="/browse" className="group inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-palette-earth transition hover:text-palette-rust dark:text-palette-gold dark:hover:text-palette-cream">
            Browse all <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {BROWSE_FILTERS.map((filter, index) => (
            <Link
              key={filter.value}
              href={`/browse?filter=${filter.value}`}
              className="group flex items-center gap-4 rounded-2xl border border-palette-green/15 bg-white/85 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-palette-gold/70 hover:shadow-lg dark:border-palette-gold/15 dark:bg-palette-green/55 sm:p-5"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition duration-300 group-hover:rotate-3 group-hover:scale-105 ${subjectAccents[index % subjectAccents.length]}`}>
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold">{filter.label}</span>
                <span className="mt-1 block text-xs text-palette-earth/75 dark:text-palette-cream/65">
                  {filter.value === "ge" ? "Generic Elective" : "Search this category"}
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-palette-earth transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-palette-gold" />
            </Link>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.16} className="relative isolate overflow-hidden rounded-[2rem] border border-palette-gold/30 bg-palette-cream p-7 shadow-lg shadow-palette-deep/5 dark:bg-palette-green/45 sm:p-10 lg:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-palette-gold/30" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-palette-green/15 dark:border-palette-gold/15" />
        <div className="relative max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-palette-earth dark:text-palette-gold">
            <Sparkles className="h-3.5 w-3.5" /> From the history of ideas
          </p>
          <div className="mt-5 flex items-start gap-3 sm:gap-5">
            <span aria-hidden="true" className="-mt-2 font-serif text-6xl leading-none text-palette-gold sm:text-7xl">“</span>
            <figure>
              <blockquote className="whitespace-pre-line font-serif text-2xl font-medium leading-snug text-palette-deep dark:text-palette-cream sm:text-3xl lg:text-4xl">
                {studyQuote.quote}
              </blockquote>
              <figcaption className="mt-5 max-w-2xl border-l-2 border-palette-gold pl-4 text-sm leading-6 text-palette-earth/80 dark:text-palette-cream/70 sm:text-base">
                <span className="font-semibold">— {studyQuote.author}</span>
                <span className="mt-1 block text-xs leading-5 opacity-80 sm:text-sm">{studyQuote.work}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="relative isolate overflow-hidden rounded-[2rem] border border-palette-gold/25 bg-gradient-to-r from-palette-green via-palette-deep to-palette-rust p-7 text-palette-cream shadow-xl sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border border-palette-gold/20" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-palette-gold">
              <Sparkles className="h-4 w-4" /> Make your next revision count
            </p>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Your next study session starts here.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-palette-cream/70">Choose a paper, settle in, and see what the past exams can teach you.</p>
          </div>
          <Link href="/browse" className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-palette-gold px-5 py-3 text-sm font-semibold text-palette-deep transition duration-200 hover:-translate-y-0.5 hover:bg-[#E8C65F]">
            Find a paper <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
