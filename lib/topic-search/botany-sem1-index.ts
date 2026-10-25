/**
 * Curated, local question index for the available Botany Semester 1 papers.
 * Syllabus unit names come from the supplied Bot Sem 1 syllabus PDF.
 * Question strings are transcribed from the source PDFs' OCR text layers;
 * open the linked paper to verify wording where OCR artifacts are visible.
 */
export const BOTANY_S1_TOPICS = [
  { id: "u1-diversity", unit: "Unit 1 · Diversity of Life", label: "Domains of Life: Eubacteria, Archaea and Eukaryotes" },
  { id: "u2-microbes", unit: "Unit 2 · Microbes", label: "Viruses: replication, lytic and lysogenic cycle" },
  { id: "u2-bacteria", unit: "Unit 2 · Microbes", label: "Bacteria: structure, reproduction and genetic recombination" },
  { id: "u2-mycoplasma", unit: "Unit 2 · Microbes", label: "Wall-less forms: L-forms and Mycoplasma" },
  { id: "u3-algae", unit: "Unit 3 · Algae", label: "Blue-green, Green, Brown and Red algae: identification, morphology, reproduction and classification" },
  { id: "u3-nostoc", unit: "Unit 3 · Algae", label: "Nostoc, Volvox and Spirogyra" },
  { id: "u4-fungi", unit: "Unit 4 · Fungi", label: "Rhizopus, Penicillium and Agaricus" },
  { id: "u4-rhizopus", unit: "Unit 4 · Fungi", label: "Rhizopus" },
  { id: "u4-lichens", unit: "Unit 4 · Fungi", label: "Lichens (a general account)" },
  { id: "u5-bryophytes", unit: "Unit 5 · Bryophytes, Pteridophytes and Gymnosperms", label: "Bryophyte identification, morphology and reproduction: Marchantia and Funaria" },
  { id: "u5-pteridophytes", unit: "Unit 5 · Bryophytes, Pteridophytes and Gymnosperms", label: "Pteridophyte identification, morphology and reproduction: Pteris" },
  { id: "u5-gymnosperms", unit: "Unit 5 · Bryophytes, Pteridophytes and Gymnosperms", label: "Gymnosperm identification, morphology and reproduction: Pinus" },
  { id: "u6-angiosperms", unit: "Unit 6 · Angiosperms", label: "Diagnostic features and structure of flower" },
  { id: "u6-inflorescence", unit: "Unit 6 · Angiosperms", label: "Types of inflorescence" },
  { id: "u7-systematics", unit: "Unit 7 · Systematics", label: "Aims and components: description, identification, nomenclature, phylogeny and biosystematics" },
  { id: "u8-nomenclature", unit: "Unit 8 · Systematics in Practices", label: "Botanical nomenclature, type method, author citation and valid publication" },
  { id: "u8-priority", unit: "Unit 8 · Systematics in Practices", label: "Priority, rejection of names, hybrids and cultivars" },
  { id: "u8-taxonomic-hierarchy", unit: "Unit 8 · Systematics in Practices", label: "Taxonomic hierarchy: taxa and categories" },
  { id: "u9-classification", unit: "Unit 9 · Systems of classification", label: "Artificial, Natural and Phylogenetic classification" },
  { id: "u9-bentham-hooker", unit: "Unit 9 · Systems of classification", label: "Bentham and Hooker (up to series), with merits and demerits" },
  { id: "u9-engler-prantl", unit: "Unit 9 · Systems of classification", label: "Engler and Prantl (up to subclasses)" },
  { id: "u9-apg", unit: "Unit 9 · Systems of classification", label: "APG System" },
] as const;

export type BotanyS1TopicId = (typeof BOTANY_S1_TOPICS)[number]["id"];
export type BotanyS1Question = {
  id: string;
  paperId: number;
  title: string;
  year: number;
  page: number;
  questionRef: string;
  text: string;
  topicIds: readonly BotanyS1TopicId[];
  mappingStatus: "verified" | "review";
  ocrStatus: "extracted" | "review";
};

export const BOTANY_S1_QUESTIONS: BotanyS1Question[] = [
  // 2023 paper (database paper ID 1)
  { id: "1-2023-1a", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 1, questionRef: "1(a)", text: "Fill in the blanks: Engler and Prantl's classification is a ___ system; spiral arrangement of the chloroplast is characteristic of algae ___; ___ is also called black bread mold; the ___ cycle ends with the death or lysis of the bacterial cell; determinate or monotelic inflorescence is also called ___.", topicIds: ["u9-engler-prantl", "u3-algae", "u4-fungi", "u2-microbes", "u6-inflorescence"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "1-2023-1b", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 2, questionRef: "1(b)", text: "Match the following: Nostoc; Pinus; Marchantia; prophage; Euphorbiaceae with the listed options Cyathium, lysogenic cycle, heterocyst, needle and scales.", topicIds: ["u3-nostoc", "u5-gymnosperms", "u5-bryophytes", "u2-microbes", "u6-inflorescence"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "1-2023-1c", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 2, questionRef: "1(c)", text: "Define the following (any five): Akinetes; Isotype; False indusium; Zygospore; Spike; Elaters.", topicIds: ["u3-algae", "u8-nomenclature", "u5-pteridophytes", "u4-fungi", "u6-inflorescence", "u5-bryophytes"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "1-2023-2a", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 3, questionRef: "2(a)", text: "Write short notes (any three): APG; Mycoplasma; Fairy rings; Dwarf shoot.", topicIds: ["u9-apg", "u2-mycoplasma", "u4-fungi", "u5-gymnosperms"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "1-2023-2b", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 3, questionRef: "2(b)", text: "Explain Bentham and Hooker's system of classification.", topicIds: ["u9-bentham-hooker"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "1-2023-3a", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 3, questionRef: "3(a)", text: "Draw well-labelled diagrams of any two: V.S. thallus of Marchantia through gemma cup; bacterial cell; part of magnified coenobium in Volvox.", topicIds: ["u5-bryophytes", "u2-bacteria", "u3-nostoc"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "1-2023-3b", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 4, questionRef: "3(b)", text: "Describe sexual mode of reproduction in Spirogyra.", topicIds: ["u3-nostoc"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "1-2023-4", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 4, questionRef: "4", text: "Differentiate between any three: conjugation and transduction; Gram-positive and Gram-negative bacteria; lytic and lysogenic cycle; artificial and natural classification; eusporangiate and leptosporangiate.", topicIds: ["u2-bacteria", "u2-microbes", "u9-classification", "u5-pteridophytes"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "1-2023-5a", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 4, questionRef: "5(a)", text: "Discuss the Principle of priority with its limitations. Explain the requirement of valid publication of scientific name of plants.", topicIds: ["u8-priority", "u8-nomenclature"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "1-2023-5b", paperId: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, page: 4, questionRef: "5(b)", text: "Describe in brief various modes of reproduction in Rhizopus.", topicIds: ["u4-rhizopus"], mappingStatus: "verified", ocrStatus: "extracted" },

  // 2024 paper (database paper ID 4)
  { id: "4-2024-1a", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 2, questionRef: "1(a)", text: "Match the following (any five): Phaeophyceae; Marchantia; Lamiaceae; Pinus; Spirogyra; TMV; Red Snow.", topicIds: ["u3-algae", "u5-bryophytes", "u6-inflorescence", "u5-gymnosperms", "u3-nostoc", "u2-microbes"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "4-2024-1b", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 2, questionRef: "1(b)", text: "Fill in the blanks (attempt any five): ___ established the binomial system; number of teeth in the outer peristomial ring of Funaria; spores-bearing leaves of Pteridophytes are called ___; according to ICN the family name should end with the suffix ___; ___ is an edible mushroom; ligulate and appendiculate scales are found in ___.", topicIds: ["u7-systematics", "u5-bryophytes", "u5-pteridophytes", "u8-nomenclature", "u4-fungi", "u5-gymnosperms"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "4-2024-1c", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 3, questionRef: "1(c)", text: "Define the following (attempt any five): Heterocyst; Topotype; False indusium; Nomen conservandum; Basidiocarp; Catkin.", topicIds: ["u3-algae", "u8-nomenclature", "u5-pteridophytes", "u4-fungi", "u6-inflorescence"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "4-2024-2", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 3, questionRef: "2", text: "Draw well-labelled diagrams of any three: L.S. sporophyte of Marchantia; coenobium of Volvox with daughter coenobia; V.S. sporophyll of Pteris; L.S. antheridial branch of Funaria; conidiophore of Penicillium.", topicIds: ["u5-bryophytes", "u3-nostoc", "u5-pteridophytes", "u4-fungi"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "4-2024-3", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 3, questionRef: "3", text: "Differentiate between any three: lytic and lysogenic cycle; long shoot and dwarf shoot of Pinus; natural and phylogenetic system of classification; Gymnosperms and Pteridophytes; homonym and synonym.", topicIds: ["u2-microbes", "u5-gymnosperms", "u9-classification", "u5-pteridophytes", "u8-nomenclature"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "4-2024-4", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 4, questionRef: "4", text: "Write short notes on any three: Mycoplasma; chief characteristic features of Algae; Gram-positive and Gram-negative bacteria; asexual reproduction in Rhizopus; adaptations in bryophytes which made them survive on land; morphological types of lichens.", topicIds: ["u2-mycoplasma", "u3-algae", "u2-bacteria", "u4-rhizopus", "u5-bryophytes", "u4-lichens"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "4-2024-5a", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 4, questionRef: "5(a)", text: "Discuss briefly the various food reserves and photosynthetic pigments in algae of major four classes studied by you.", topicIds: ["u3-algae"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "4-2024-5b", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 4, questionRef: "5(b)", text: "Explain Bentham & Hooker's system of classification. Write its merits and demerits.", topicIds: ["u9-bentham-hooker"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "4-2024-6a", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 4, questionRef: "6(a)", text: "Write a short note on different modes of genetic recombination in bacteria explaining one of them in detail.", topicIds: ["u2-bacteria"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "4-2024-6b", paperId: 4, title: "LS sem1 bot 2024", year: 2024, page: 4, questionRef: "6(b)", text: "Discuss the principles of ICN. Explain principle of priority with its limitations.", topicIds: ["u8-nomenclature", "u8-priority"], mappingStatus: "verified", ocrStatus: "extracted" },

  // 2025 paper (database paper ID 6)
  { id: "6-2025-1a", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 2, questionRef: "1(a)", text: "Match the following (any five): Genera Plantarum; wall-less bacteria; bread mould; coenobium; Laminarin; methanogens.", topicIds: ["u9-bentham-hooker", "u2-bacteria", "u4-rhizopus", "u3-nostoc", "u3-algae", "u2-microbes"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "6-2025-1b", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 2, questionRef: "1(b)", text: "Fill in the blanks (any five): ___ is known as the Father of Taxonomy; tuberculate and smooth-walled rhizoids are found in ___; arrangement of flowers on the floral axis is called ___; winged pollen grains are found in ___; APG system of classification is based on ___; ___ is called a rolling algae.", topicIds: ["u7-systematics", "u5-bryophytes", "u6-inflorescence", "u5-gymnosperms", "u9-apg", "u3-algae"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "6-2025-1c", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 3, questionRef: "1(c)", text: "Define the following: Viroids; racemose inflorescence; lectotype; protonema; anisogamy; nomen conservandum.", topicIds: ["u2-microbes", "u6-inflorescence", "u8-nomenclature", "u5-bryophytes", "u3-algae", "u8-nomenclature"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "6-2025-2", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 3, questionRef: "2", text: "Draw well-labelled diagrams of any three: L.S. structure of flower; L.S. of capsule of Funaria; bacterial cell structure; V.S. of thallus of Marchantia through gemma cup; conidiophore of Penicillium.", topicIds: ["u6-angiosperms", "u5-bryophytes", "u2-bacteria", "u4-fungi"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "6-2025-3", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 3, questionRef: "3", text: "Differentiate between any three: crustose and fruticose lichen; scalariform and lateral type of conjugation in Spirogyra; Gram-positive and Gram-negative cell wall; heterocyst and akinete.", topicIds: ["u4-lichens", "u3-nostoc", "u2-bacteria", "u3-algae"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "6-2025-4a", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 4, questionRef: "4(a)", text: "Discuss the outline of the basis of Bentham and Hooker's system of classification. Mention its merits and demerits.", topicIds: ["u9-bentham-hooker"], mappingStatus: "verified", ocrStatus: "review" },
  { id: "6-2025-4b", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 4, questionRef: "4(b)", text: "How does genetic recombination take place in bacteria? Discuss any one of the methods along with diagrams.", topicIds: ["u2-bacteria"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "6-2025-5a", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 4, questionRef: "5(a)", text: "Describe briefly the life-cycle of Rhizopus with a well-labelled diagram.", topicIds: ["u4-rhizopus"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "6-2025-5b", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 4, questionRef: "5(b)", text: "With the help of a labelled diagram, describe the mature sporangium of Pteris.", topicIds: ["u5-pteridophytes"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "6-2025-6a", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 4, questionRef: "6(a)", text: "Write down the principles of priority and its limitations.", topicIds: ["u8-priority"], mappingStatus: "verified", ocrStatus: "extracted" },
  { id: "6-2025-6b", paperId: 6, title: "LS sem1 bot 2025", year: 2025, page: 4, questionRef: "6(b)", text: "Discuss the principles of ICN.", topicIds: ["u8-nomenclature"], mappingStatus: "verified", ocrStatus: "extracted" },
];

export const BOTANY_S1_PAPERS = [
  { id: 1, title: "Botany Sem 1 PYQ 2023", year: 2023, subject: "Botany", semester: 1 },
  { id: 4, title: "LS sem1 bot 2024", year: 2024, subject: "Botany", semester: 1 },
  { id: 6, title: "LS sem1 bot 2025", year: 2025, subject: "Botany", semester: 1 },
] as const;

/** Add future subject/semester indexes here; only populated entries are selectable. */
export const TOPIC_SEARCH_CATALOG = {
  botany: {
    label: "Botany",
    semesters: [
      {
        id: "1",
        label: "Semester 1",
        topics: BOTANY_S1_TOPICS,
        questions: BOTANY_S1_QUESTIONS,
        papers: BOTANY_S1_PAPERS,
      },
    ],
  },
} as const;
