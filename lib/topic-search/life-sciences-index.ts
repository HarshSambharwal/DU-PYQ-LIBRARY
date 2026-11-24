import { TOPIC_SEARCH_PAPER_REFERENCES, type TopicSearchPaperReference } from "./eligible-papers";

export type IndexedQuestion = {
  id: string;
  paperId: number;
  importKey: string;
  title: string;
  year: number | null;
  page: number;
  pageEnd?: number;
  questionRef: string;
  text: string;
  topicIds: readonly string[];
  mappingStatus: "verified" | "review";
  ocrStatus: "extracted" | "review";
};

export type IndexedTopic = {
  id: string;
  unit: string;
  label: string;
};

export type TopicSearchCombination = {
  key: string;
  semesterId: string;
  semesterLabel: string;
  subjectName: string;
  subjectLabel: string;
  category: "DSC" | "DSE";
  topics: readonly IndexedTopic[];
  questions: readonly IndexedQuestion[];
  papers: readonly TopicSearchPaperReference[];
  candidateQuestionCount: number;
  syllabusNote?: string;
};

type UnitTopic = readonly [id: string, unit: string, label: string];

function topics(prefix: string, units: readonly UnitTopic[]): IndexedTopic[] {
  return units.map(([id, unit, label]) => ({ id: `${prefix}-${id}`, unit, label }));
}

function combination(
  key: string,
  semester: number,
  subjectLabel: string,
  category: "DSC" | "DSE",
  units: readonly UnitTopic[],
  questions: readonly IndexedQuestion[] = [],
  syllabusNote?: string,
): TopicSearchCombination {
  const papers = TOPIC_SEARCH_PAPER_REFERENCES.filter((paper) =>
    paper.semesterId === String(semester)
    && paper.subjectName === subjectLabel
    && paper.category === category,
  );
  return {
    key,
    semesterId: String(semester),
    semesterLabel: `Semester ${semester}`,
    subjectName: subjectLabel,
    subjectLabel: `${subjectLabel} · ${category}`,
    category,
    topics: topics(key, units),
    questions,
    papers,
    candidateQuestionCount: papers.reduce((total, paper) => total + paper.candidateQuestionCount, 0),
    ...(syllabusNote ? { syllabusNote } : {}),
  };
}

/**
 * Topic choices are taken from the internal course/unit headings in the local
 * syllabus PDFs. Sem 3 syllabus filenames for Botany and Chemistry are swapped;
 * these entries follow the PDF's internal course title/code, not its filename.
 * Unit and topic labels come from the reviewed syllabus sources. All eligible
 * paper references are linked by the current database ID and stable import key.
 * Semester 6 DSE Chemistry remains absent because its official syllabus is
 * unavailable. Paper 366 remains under its owner-confirmed current DB mapping.
 */
export const ADDITIONAL_TOPIC_SEARCH_CATALOG: readonly TopicSearchCombination[] = [
  combination("s1-chem-dsc", 1, "Chemistry", "DSC", [
    ["u1", "Unit 1 · Fundamentals of organic chemistry", "Fundamentals of organic chemistry"],
    ["u2", "Unit 2 · Stereochemistry", "Stereochemistry"],
    ["u3", "Unit 3 · Types of Organic Reactions", "Types of Organic Reactions"],
  ]),
  combination("s1-zoo-dsc", 1, "Zoology", "DSC", [
    ["u1", "Unit I · Introduction", "Introduction"],
    ["u2", "Unit II · Protista to Pseudocoelomates", "Protista to Pseudocoelomates"],
    ["u3", "Unit III · Coelomates", "Coelomates"],
    ["u4", "Unit IV · Chordates", "Chordates"],
  ]),
  combination("s2-bot-dsc", 2, "Botany", "DSC", [
    ["u1-mendelian", "Unit 1 · Mendelian genetics and extrachromosomal inheritance", "Mendelian genetics and extrachromosomal inheritance"],
    ["u1-polygenic", "Unit 1 · Mendelian genetics and extrachromosomal inheritance", "Polygenic inheritance"],
    ["u2-gene", "Unit 2 · Structure & Function of the gene", "Structure and function of the gene; Central Dogma"],
    ["u3-linkage", "Unit 3 · Linkage, crossing over and chromosome mapping", "Linkage, crossing over and chromosome mapping"],
    ["u4-chromosomes", "Unit 4 · Variation in chromosome number and structure", "Variation in chromosome number and structure"],
    ["u5-dna", "Unit 5 · DNA structure and replication", "DNA structure and replication"],
    ["u6-mutations", "Unit 6 · Mutations", "Mutations"],
    ["u7-expression", "Unit 7 · Gene expression", "Gene expression"],
    ["u8-regulation", "Unit 8 · Regulation of gene expression", "Regulation of gene expression"],
  ]),
  combination("s2-chem-dsc", 2, "Chemistry", "DSC", [
    ["u1-bonding", "Unit I · Chemical Bonding", "Chemical Bonding"],
    ["u1-born-haber", "Unit I · Chemical Bonding", "Born-Haber cycle and lattice enthalpy"],
    ["u2-elements", "Unit II · Elements in Biological System", "Elements in Biological System"],
  ]),
  combination("s2-zoo-dsc", 2, "Zoology", "DSC", [
    ["u1-cell", "Unit I · Cell Division and Differentiation", "Cell Division and Differentiation"],
    ["u2-history", "Unit II · Scope and History of Developmental Biology", "Scope and History of Developmental Biology"],
    ["u3-early", "Unit III · Early Embryonic Development", "Early Embryonic Development"],
    ["u4-late", "Unit IV · Late Embryonic Development", "Late Embryonic Development"],
    ["u5-post", "Unit V · Post Embryonic Development", "Post Embryonic Development"],
  ]),
  combination("s3-bot-dsc", 3, "Botany", "DSC", [
    ["u1-cell", "Unit 1 · Introduction to Plant Cell", "Plant cell structure and function"],
    ["u2-growth", "Unit 2 · Cell growth", "Cell growth"],
    ["u3-polarity", "Unit 3 · Polarity in plant growth", "Polarity in plant growth"],
    ["u4-vegetative", "Unit 4 · Differentiation of tissues: vegetative organs", "Differentiation of tissues in vegetative organs"],
    ["u5-reproductive", "Unit 5 · Differentiation of tissues: reproductive organs", "Differentiation of tissues in reproductive organs"],
    ["u6-pollination", "Unit 6 · Pollination and Fertilization", "Pollination and Fertilization"],
    ["u7-embryo", "Unit 7 · Development of Embryo and Seed", "Development of Embryo and Seed"],
  ]),
  combination("s3-chem-dsc", 3, "Chemistry", "DSC", [
    ["u1-energetics", "Unit 1 · Chemical Energetics", "Chemical Energetics"],
    ["u2-equilibrium", "Unit 2 · Chemical Equilibrium", "Chemical Equilibrium"],
    ["u3-ionic", "Unit 3 · Ionic Equilibria", "Ionic Equilibria"],
  ]),
  combination("s3-zoo-dsc", 3, "Zoology", "DSC", [
    ["u1-carbohydrates", "Unit 1 · Metabolism of Carbohydrates", "Metabolism of Carbohydrates"],
    ["u2-lipids", "Unit 2 · Lipid Metabolism", "Lipid Metabolism"],
    ["u3-proteins", "Unit 3 · Protein metabolism", "Protein metabolism"],
    ["u4-enzymes", "Unit 4 · Enzyme", "Enzymes"],
    ["u5-oxidative", "Unit 5 · Oxidative Phosphorylation", "Oxidative Phosphorylation"],
  ]),
  combination("s3-chem-dse", 3, "Chemistry", "DSE", [
    ["u1-acids-bases", "Unit 1 · Acids & Bases", "Acids and bases: concepts, strength, buffers and aqueous chemistry"],
  ]),
  combination("s3-zoo-dse", 3, "Zoology", "DSE", [
    ["u1-infectious", "Unit 1 · Introduction to Infectious diseases", "Infectious diseases and epidemiology"],
    ["u2-viral", "Unit 2 · Viral infection", "Transmission, prevention and control of viral infection"],
    ["u3-bacterial", "Unit 3 · Bacterial infections", "Bacterial infections"],
    ["u4-parasitic", "Unit 4 · Protozoan and Helminthic infection", "Protozoan and helminthic infections"],
    ["u5-nutrition", "Unit 5 · Nutritional deficiency and lifestyle-based diseases", "Nutritional deficiency and lifestyle-based diseases"],
    ["u6-endocrine", "Unit 6 · Endocrine Diseases", "Endocrine diseases"],
    ["u7-cancer", "Unit 7 · Cancer", "Cancer"],
  ]),
  combination("s4-bot-dse", 4, "Botany", "DSE", [
    ["u1-environment", "Unit 1 · Microbes and quality of environment", "Microbes and quality of environment"],
    ["u2-fermentation", "Unit 2 · Bioreactors/Fermenters and fermentation processes", "Bioreactors, fermenters and fermentation processes"],
    ["u3-products", "Unit 3 · Microbial production of industrial products", "Microbial production of industrial products"],
    ["u4-enzymes", "Unit 4 · Microbial enzymes of industrial importance", "Microbial enzymes of industrial importance"],
    ["u5-water", "Unit 5 · Microbial flora of water", "Microbial flora of water"],
  ]),
  combination("s4-chem-dse", 4, "Chemistry", "DSE", [
    ["u1-polymers", "Unit 1 · Polymers", "Polymers"],
    ["u2-dyes", "Unit 2 · Dyes", "Dyes"],
    ["u3-natural", "Unit 3 · Natural Product Chemistry", "Terpenoids and Alkaloids"],
  ], [
    { id: "348-2025-1a", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 1, questionRef: "1(i)", text: "Fill in the blanks: (a) Simplest unit of polymer is called ___. (b) Tg refers to the ___ temperature of polymer. (c) Methyl orange and Congo red are examples of ___ dyes. (d) Sesquiterpenes contain ___ number of isoprene units. (e) A key source of nicotine is ___ leaves.", topicIds: ["s4-chem-dse-u1-polymers", "s4-chem-dse-u2-dyes", "s4-chem-dse-u3-natural"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-1b", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 1, questionRef: "1(ii)", text: "True or False: (a) Edible dyes are also known as food coloring agents. (b) Thermosetting plastics are harder and more rigid than thermoplastics. (c) Methyl orange belongs to the class of triphenylmethane dyes. (d) Terpenes and alkaloids are both natural products primarily obtained from plants. (e) Citral is an example of a monoterpene.", topicIds: ["s4-chem-dse-u1-polymers", "s4-chem-dse-u2-dyes", "s4-chem-dse-u3-natural"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-1c", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "1(iii)", text: "Draw the structures of both geometrical isomers of the citral molecule.", topicIds: ["s4-chem-dse-u3-natural"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-1d", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "1(iv)", text: "Atactic polymers are generally amorphous, soft and flexible while their isotactic form is crystalline, hard and tough. Explain.", topicIds: ["s4-chem-dse-u1-polymers"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-2a", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "2(i-ii)", text: "(i) What do you mean by copolymerization? Explain with one example. (ii) What is the effect of polymer structure on its properties?", topicIds: ["s4-chem-dse-u1-polymers"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-2b", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "2(iii)", text: "Write the synthesis of polyvinyl chloride and explain its industrial application.", topicIds: ["s4-chem-dse-u1-polymers"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-3a", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "3(i)", text: "Write down all the steps involved in the structure elucidation of Alizarin dye.", topicIds: ["s4-chem-dse-u2-dyes"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-3b", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "3(ii)", text: "Justify the following statements: (a) Azo benzene is a red compound but not a dye while its p-amino and p-hydroxy derivatives are well-established dyes. (b) Alkaline solution of phenolphthalein gives pink colour; however, in excess of alkali it gives a colourless solution.", topicIds: ["s4-chem-dse-u2-dyes"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-3c", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "3(iii)", text: "Explain in brief the modern theory of colour and constitution.", topicIds: ["s4-chem-dse-u2-dyes"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-4a", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "4(i)", text: "Explain all the steps involved in the structure elucidation of citral.", topicIds: ["s4-chem-dse-u3-natural"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-4b", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "4(ii)", text: "What is the role of Hoffmann's exhaustive methylation in the structure elucidation of alkaloids? Explain with an example.", topicIds: ["s4-chem-dse-u3-natural"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-4c", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 2, questionRef: "4(iii)", text: "Write short notes on: Isoprene and Special Isoprene rule.", topicIds: ["s4-chem-dse-u3-natural"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-5a", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 3, questionRef: "5(i-iii)", text: "Differentiate between the following (attempt any two): (a) Classification of terpenes and its uses. (b) Physiological action of nicotine. (c) Crystalline and amorphous polymers.", topicIds: ["s4-chem-dse-u3-natural", "s4-chem-dse-u1-polymers"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-5b", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 3, questionRef: "5(iv)", text: "Explain the terms auxochrome and chromophore with a suitable example.", topicIds: ["s4-chem-dse-u2-dyes"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-5c", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 3, questionRef: "5(v)", text: "Write short notes on (attempt any two): (a) Bulk polymerization technique. (b) Polydispersity index. (c) Kinetic chain length.", topicIds: ["s4-chem-dse-u1-polymers"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "348-2025-6", paperId: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, page: 3, questionRef: "6", text: "Write notes on the following (attempt any three): (i) Mordant and vat dyes; (ii) rubber; (iii) conducting polymers; (iv) plastics.", topicIds: ["s4-chem-dse-u2-dyes", "s4-chem-dse-u1-polymers"], mappingStatus: "verified", ocrStatus: "extracted" },
  ]),
  combination("s5-bot-dsc", 5, "Botany", "DSC", [
    ["u1-water", "Unit 1 · Plant-water relations", "Plant-water relations"],
    ["u2-mineral", "Unit 2 · Mineral nutrition", "Mineral nutrition"],
    ["u4-regulators", "Unit 4 · Plant growth regulators", "Plant growth regulators"],
    ["u5-light", "Unit 5 · Plant response to light and temperature", "Plant response to light and temperature"],
    ["u6-enzymes", "Unit 6 · Enzymes", "Enzymes"],
    ["u7-carbon", "Unit 7 · Carbon metabolism", "Carbon metabolism"],
    ["u8-respiration", "Unit 8 · Respiration", "Respiration"],
    ["u9-nitrogen", "Unit 9 · Nitrogen metabolism", "Nitrogen metabolism"],
    ["u10-stress", "Unit 10 · Stress physiology in plants", "Stress physiology in plants"],
  ]),
  combination("s5-chem-dsc", 5, "Chemistry", "DSC", [
    ["u1-introduction", "Unit 1 · Introduction to Coordination Compounds", "Coordination Compounds"],
    ["u2-bonding", "Unit 2 · Bonding in Coordination Compounds", "Bonding in Coordination Compounds"],
    ["u3-thermodynamics", "Unit 3 · Thermodynamic and Kinetic aspects of Metal Complexes", "Thermodynamic and Kinetic aspects of Metal Complexes"],
    ["u4-biological", "Unit 4 · Application in biological systems", "Coordination compounds in biological systems"],
  ]),
  combination("s5-chem-dse", 5, "Chemistry", "DSE", [
    ["u1-scope", "Unit 1 · Scope of Research", "Research problem, literature review, hypothesis, research or experimental design, data collection and analysis, interpretation and reporting"],
    ["u1-importance", "Unit 1 · Scope of Research", "Scope and importance of research"],
    ["u2-sources", "Unit 2 · Literature Survey, Databases and Research Metrics", "Primary, secondary and tertiary sources of information"],
    ["u2-journals", "Unit 2 · Literature Survey, Databases and Research Metrics", "Journals and journal abbreviations"],
    ["u2-databases", "Unit 2 · Literature Survey, Databases and Research Metrics", "Google Scholar, Web of Science, Scopus, UGC INFONET, SciFinder, PubMed, ResearchGate, e-consortium and e-books"],
    ["u2-search", "Unit 2 · Literature Survey, Databases and Research Metrics", "Phrase, field, Boolean, proximity and concept search; limiting and refining search results"],
    ["u2-metrics", "Unit 2 · Literature Survey, Databases and Research Metrics", "Journal impact factor, h-index, i10 index, Altmetrics and citation index"],
    ["u2-profiles", "Unit 2 · Literature Survey, Databases and Research Metrics", "ORCID, Publons, Google Scholar, ResearchGate and VIDWAN author profiles"],
    ["u3-documents", "Unit 3 · Communication in Science", "Full-length research papers, book chapters, reviews, short communications, project proposals, letters to the editor and theses"],
    ["u3-thesis", "Unit 3 · Communication in Science", "Thesis writing: steps, structure, chapter plan, layout, language, illustrations and tables"],
    ["u3-references", "Unit 3 · Communication in Science", "Bibliography, referencing styles, annotated bibliography and citation-management tools"],
    ["u3-presentation", "Unit 3 · Communication in Science", "Oral presentations, posters, visual aids and effective scientific communication"],
    ["u3-submission", "Unit 3 · Communication in Science", "Electronic manuscript submission"],
    ["u4-ethics", "Unit 4 · Research and Publication Ethics", "Scientific conduct, falsification, fabrication, plagiarism, similarity index, plagiarism-detection tools and redundant publications"],
    ["u4-publication", "Unit 4 · Research and Publication Ethics", "COPE, conflicts of interest, publication misconduct, authorship, contributorship and predatory journals"],
    ["u4-ipr", "Unit 4 · Research and Publication Ethics", "Intellectual property rights, patent law, commercialization, copyright, royalty and TRIPS"],
    ["u5-data", "Unit 5 · Statistical Analysis for Chemists", "Types of data, data collection, data processing and hypothesis testing"],
    ["u5-distributions", "Unit 5 · Statistical Analysis for Chemists", "Normal and binomial distributions"],
    ["u5-tests", "Unit 5 · Statistical Analysis for Chemists", "Tests of significance: t-test, F-test, chi-square test, ANOVA and multiple-range test"],
    ["u5-regression", "Unit 5 · Statistical Analysis for Chemists", "Regression and correlation"],
    ["u5-software", "Unit 5 · Statistical Analysis for Chemists", "Data analysis using Microsoft Excel, Origin and SPSS"],
  ], [
    { id: "366-2024-1a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 1, questionRef: "1(a)", text: "Discuss the role of the TRIPS agreement in protecting intellectual property.", topicIds: ["s5-chem-dse-u4-ipr"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-1b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 1, questionRef: "1(b)", text: "Write short notes on any two: SciFinder; PubMed; Web of Science.", topicIds: ["s5-chem-dse-u2-databases"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-1c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 1, questionRef: "1(c)", text: "What is the difference between qualitative and quantitative data? Give examples.", topicIds: ["s5-chem-dse-u5-data"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-2a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 2, questionRef: "2(a)", text: "Explain: (i) i-10 index; (ii) self-plagiarism.", topicIds: ["s5-chem-dse-u2-metrics", "s5-chem-dse-u4-ethics"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-2b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 2, questionRef: "2(b)", text: "ResearchGate is a social network for researchers. Justify the statement, giving arguments based on its usage and utility.", topicIds: ["s5-chem-dse-u2-profiles"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-2c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 2, questionRef: "2(c)", text: "A company from Hyderabad makes perfumes using traditional distillation methods. They sell it under a brand name ‘Itr-e-Hyderabad’ and in a uniquely shaped glass bottle. The exact ratio of flower extracts is kept confidential. Identify the four forms of IPRs which can be used for protection and state the validity period for each protection in India.", topicIds: ["s5-chem-dse-u4-ipr"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-3a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 2, questionRef: "3(a)", text: "Differentiate between primary and secondary sources of information. Give two examples for each one.", topicIds: ["s5-chem-dse-u2-sources"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-3b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 2, questionRef: "3(b)", text: "Riya, an M.Sc. Chemistry student, was working on a project to develop an eco-friendly dye. She submitted her project report to the department. In her report, she copied two paragraphs about dye chemistry from Wikipedia without any reference. She also did not mention her classmate Arjun, who helped her with the UV-Vis spectra. Based on the above case, answer the following: (i) Discuss the two unethical practices done by Riya. (ii) Why is it important to give credit to sources and co-workers in research?", topicIds: ["s5-chem-dse-u4-ethics", "s5-chem-dse-u4-publication"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-3c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 2, questionRef: "3(c)", text: "Differentiate between Copyright and Patent.", topicIds: ["s5-chem-dse-u4-ipr"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-4a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 3, questionRef: "4(a)", text: "How does the h-index help in assessing the quality of a researcher’s publications? A researcher has citation counts 25, 20, 15, 8, 6, 4 and 2 for the seven research papers. Calculate the h-index of the researcher.", topicIds: ["s5-chem-dse-u2-metrics"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-4b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 3, questionRef: "4(b)", text: "Describe the role of software tools like Turnitin and Urkund in upholding research ethics.", topicIds: ["s5-chem-dse-u4-ethics"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-4c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 3, questionRef: "4(c)", text: "What do you understand by search techniques? How do search techniques improve the literature survey?", topicIds: ["s5-chem-dse-u2-search"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-5a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 3, questionRef: "5(a)", text: "Give the journal abbreviations (any five): Journal of Physical Chemistry A; Chemical Reviews; Journal of the American Chemical Society; Bioorganic Medicinal Chemistry Letters; Journal of Organic Chemistry; Chemical Physics Letters.", topicIds: ["s5-chem-dse-u2-journals"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-5b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 3, questionRef: "5(b)", text: "What is binomial distribution? Represent it graphically.", topicIds: ["s5-chem-dse-u5-distributions"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-5c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 3, questionRef: "5(c)", text: "What is a digital database in research? Why are databases like ScienceDirect and Google Scholar important for researchers?", topicIds: ["s5-chem-dse-u2-databases"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-6a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "6(a)", text: "How should a scientific oral presentation be planned and delivered to effectively communicate research findings?", topicIds: ["s5-chem-dse-u3-presentation"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-6b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "6(b)", text: "Discuss the structure of a thesis. What is the layout of a standard thesis chapter?", topicIds: ["s5-chem-dse-u3-thesis"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-6c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "6(c)", text: "A researcher wants to publish a paper. What factors should be considered while selecting a journal and outline the complete submission process?", topicIds: ["s5-chem-dse-u3-submission"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-7a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "7(a)", text: "Write a short note on SPSS and Microsoft Excel.", topicIds: ["s5-chem-dse-u5-software"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-7b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "7(b)", text: "The percent purity of a gold sample was determined experimentally as 10.2, 10.4, 10.3, 10.5 and 10.6. Calculate mean and standard deviation.", topicIds: ["s5-chem-dse-u5-data"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-7c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "7(c)", text: "A project proposal includes strong methodology but very weak literature review: (i) How does a poor literature review affect the proposal? (ii) What steps should be taken to strengthen it?", topicIds: ["s5-chem-dse-u1-scope", "s5-chem-dse-u2-search"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-8a", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "8(a)", text: "The percentage of uranium in pitchblende ore was found to be 1.2, 1.4, 1.8, 2.0 and 2.4. Using the t-test, determine whether the result differs significantly from the true value 1.0 at the 95% confidence level. Degrees of freedom, df = 4; t(table) at 95% confidence = 2.776.", topicIds: ["s5-chem-dse-u5-tests"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-8b", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "8(b)", text: "What is short communication in scientific writing? How is it different from a full-length research paper?", topicIds: ["s5-chem-dse-u3-documents"], mappingStatus: "verified", ocrStatus: "extracted" },
    { id: "366-2024-8c", paperId: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, page: 4, questionRef: "8(c)", text: "What is correlation? Explain the different types of correlation with graphical representation.", topicIds: ["s5-chem-dse-u5-regression"], mappingStatus: "verified", ocrStatus: "extracted" },
  ]),
  combination("s6-bot-dsc", 6, "Botany", "DSC", [
    ["u1-origin", "Unit 1 · Origin of Cultivated Plants", "Origin of Cultivated Plants"],
    ["u2-cereals", "Unit 2 · Cereals and millets", "Cereals and millets"],
    ["u3-pulses", "Unit 3 · Pulse crops", "Pulse crops"],
    ["u4-spices", "Unit 4 · Spices", "Spices"],
    ["u5-beverage", "Unit 5 · Beverage", "Beverage"],
    ["u6-oils", "Unit 6 · Oils and Fats", "Oils and Fats"],
    ["u7-fibre", "Unit 7 · Fibre Yielding Plants", "Fibre Yielding Plants"],
    ["u8-culture", "Unit 8 · Plant Tissue Culture Technology", "Plant Tissue Culture Technology"],
    ["u9-recombinant", "Unit 9 · DNA Recombinant Technology", "DNA Recombinant Technology"],
  ]),
  combination("s6-chem-dsc", 6, "Chemistry", "DSC", [
    ["u1-conductance", "Unit 1 · Conductance", "Conductance"],
    ["u3-kinetics", "Unit 3 · Chemical Kinetics and Catalysis", "Chemical Kinetics and Catalysis"],
  ]),
  combination("s6-zoo-dsc", 6, "Zoology", "DSC", [
    ["u1-immune", "Unit 1 · Immune System and its components", "Immune System and its components"],
    ["u2-antigens", "Unit 2 · Antigens, Immunogens and Antibodies", "Antigens, Immunogens and Antibodies"],
    ["u3-processing", "Unit 3 · Antigen Processing and Presentation", "Antigen Processing and Presentation"],
    ["u4-cytokines", "Unit 4 · Cytokines & Complement System", "Cytokines and Complement System"],
    ["u5-prevention", "Unit 5 · Role of immune system in Prevention of Diseases", "Immune system in prevention of diseases"],
  ]),
  combination("s6-bot-dse", 6, "Botany", "DSE", [
    ["u1-concepts", "Unit 1 · Basic Concepts of Research", "Basic Concepts of Research"],
    ["u2-design", "Unit 2 · Research Design, Data Collection and Analysis", "Research Design, Data Collection and Analysis"],
    ["u3-ethics", "Unit 3 · Ethical Issues", "Ethical Issues"],
    ["u4-report", "Unit 4 · Report Writing", "Report Writing"],
  ]),
  combination("s3-bot-dse", 3, "Botany", "DSE", [
    ["u1-intro", "Unit 1 · Introduction to Bioinformatics", "Introduction to Bioinformatics"],
    ["u1-crop", "Unit 1 · Introduction to Bioinformatics", "Applications of bioinformatics in crop improvement"],
    ["u2-databases", "Unit 2 · Biological databases", "Biological databases: NCBI, UniProt, PDB and PlantPepDB"],
    ["u3-alignment", "Unit 3 · Basic concepts of Sequence alignment", "Basic concepts of sequence alignment: pairwise and multiple alignment"],
    ["u4-phylogeny", "Unit 4 · Molecular Phylogeny", "Molecular phylogeny: maximum parsimony, maximum likelihood and neighbour-joining"],
    ["u5-biostatistics", "Unit 5 · Introduction to Biostatistics", "Introduction to biostatistics: descriptive and inferential statistics"],
    ["u6-data", "Unit 6 · Data and sampling methods", "Data and sampling methods, tabulation and presentation"],
    ["u7-dispersion", "Unit 7 · Measures and deviations of central tendencies", "Measures of central tendency and dispersion; skewness, kurtosis and coefficient of variation"],
    ["u8-correlation", "Unit 8 · Correlation and Regression", "Correlation and regression: Karl Pearson and Spearman methods"],
    ["u9-tests", "Unit 9 · Statistical tests", "Statistical tests: t-test and chi-square test"],
  ]),
  combination("s4-bot-dsc", 4, "Botany", "DSC", [
    ["u1-ecology", "Unit 1 · Fundamental Concepts of Ecology", "Fundamental Concepts of Ecology"],
    ["u2-factors", "Unit 2 · Ecological Factors", "Ecological Factors"],
    ["u3-population", "Unit 3 · Population Ecology", "Population Ecology and population characteristics"],
    ["u3-dynamics", "Unit 3 · Population Ecology", "Population dispersion, natality, mortality, survivorship curves and age pyramids"],
    ["u3-growth", "Unit 3 · Population Ecology", "Density-dependent and density-independent population growth"],
    ["u3-interactions", "Unit 3 · Population Ecology", "Mutualism, symbiosis, commensalism, competition, parasitism, predation, amensalism and antibiosis"],
    ["u4-communities", "Unit 4 · Plant Communities", "Plant Communities, ecotone and edge effect"],
    ["u4-succession", "Unit 4 · Plant Communities", "Types of succession"],
    ["u5-ecosystem", "Unit 5 · Ecosystem", "Ecosystem structure, niche and habitat"],
    ["u5-food", "Unit 5 · Ecosystem", "Food chains and food webs"],
    ["u5-pyramids", "Unit 5 · Ecosystem", "Ecological pyramids, production and productivity"],
    ["u5-energy", "Unit 5 · Ecosystem", "Energy flow, single-channel and Y-shaped energy-flow models, and trophic organisation"],
    ["u5-cycles", "Unit 5 · Ecosystem", "Biogeochemical cycles: nitrogen and phosphorus"],
    ["u6-evolution", "Unit 6 · Introduction to Evolution", "Origin and history of life; microevolution and macroevolution"],
    ["u6-phylogeny", "Unit 6 · Introduction to Evolution", "Phylogeny and the tree of life"],
    ["u7-theories", "Unit 7 · Evolution of Species", "Lamarckism, Neo-Lamarckism, Darwinism and Neo-Darwinism"],
    ["u7-selection", "Unit 7 · Evolution of Species", "Natural selection and artificial selection"],
    ["u7-speciation", "Unit 7 · Evolution of Species", "Species concepts and speciation"],
    ["u8-phytogeography", "Unit 8 · Phytogeography", "Phytogeographical regions of India"],
    ["u8-endemism", "Unit 8 · Phytogeography", "Endemism: definition, factors and types"],
  ], [], "Official syllabus confirmed by the owner; topics were transcribed from the rendered scan because it has no extractable text layer."),
  combination("s4-chem-dsc", 4, "Chemistry", "DSC", [
    ["u1-acids", "Unit 1 · Carboxylic Acids and their Derivatives", "Aliphatic and aromatic carboxylic acids and their derivatives"],
    ["u2-amines", "Unit 2 · Amines and Diazonium Salts", "Aliphatic and aromatic amines"],
    ["u2-diazonium", "Unit 2 · Amines and Diazonium Salts", "Diazonium salts"],
    ["u3-heterocycles", "Unit 3 · Heterocyclic Compounds", "Furan, pyrrole, thiophene and pyridine"],
  ], [], "Official syllabus confirmed by the owner; topics were transcribed from the rendered scan because it has no extractable text layer."),
  combination("s4-zoo-dsc", 4, "Zoology", "DSC", [
    ["u1-nerve-muscle", "Unit 1 · Nerve and Muscle", "Nerve and Muscle"],
    ["u2-digestion", "Unit 2 · Digestion", "Digestion"],
    ["u3-respiration", "Unit 3 · Respiration", "Respiration"],
    ["u4-excretion", "Unit 4 · Excretion", "Excretion"],
    ["u5-cardiovascular", "Unit 5 · Cardiovascular System", "Cardiovascular System"],
    ["u6-reproduction", "Unit 6 · Reproduction and Endocrine Glands", "Reproduction and Endocrine Glands"],
  ], [], "Official syllabus confirmed by the owner; topics were transcribed from the rendered scan because it has no extractable text layer."),
  combination("s4-zoo-dse", 4, "Zoology", "DSE", [
    ["u1-parasitology", "Unit 1 · Introduction to Parasitology", "Introduction to Parasitology"],
    ["u2-protists", "Unit 2 · Parasitic Protists", "Parasitic Protists: Entamoeba histolytica, Trypanosoma gambiense and Plasmodium vivax"],
    ["u3-platyhelminths", "Unit 3 · Parasitic Platyhelminths", "Parasitic Platyhelminths"],
    ["u4-nematodes", "Unit 4 · Parasitic Nematodes", "Parasitic Nematodes"],
    ["u5-arthropoda", "Unit 5 · Parasitic Arthropoda", "Parasitic Arthropoda"],
    ["u6-vertebrates", "Unit 6 · Parasitic Vertebrates", "Parasitic Vertebrates"],
  ], [], "Official syllabus scan has incomplete upper/lower margins; the confirmed readable main syllabus content is used."),
  combination("s5-zoo-dsc", 5, "Zoology", "DSC", [
    ["u1-intro", "Unit 1 · Introduction to Evolutionary Ecology", "Introduction to Evolutionary Ecology"],
    ["u2-population", "Unit 2 · Population Ecology", "Population Ecology"],
    ["u3-community", "Unit 3 · Community Interactions", "Community Interactions"],
    ["u4-evolution", "Unit 4 · Processes of Evolutionary Change and Species Concept", "Processes of Evolutionary Change and Species Concept"],
    ["u5-coevolution", "Unit 5 · Coevolution", "Coevolution"],
    ["u6-macroecology", "Unit 6 · Macroecology", "Macroecology"],
  ]),
  combination("s5-bot-dse", 5, "Botany", "DSE", [
    ["u1-introduction", "Unit 1 · Introduction", "Introduction: plant disease, disease pyramid, classification, history and significance of phytopathology"],
    ["u2-concepts", "Unit 2 · Basic concepts of Plant Pathology", "Basic concepts of Plant Pathology: pathogen, symptoms, etiology, Koch's postulates, disease cycle, epidemiology and forecasting"],
    ["u3-host-pathogen", "Unit 3 · Host-Pathogen relationship", "Host-Pathogen relationship: penetration, colonization and plant defence mechanisms"],
    ["u4-fungal", "Unit 4 · Fungal diseases", "Fungal diseases: powdery mildew of pea, ergot of rye, apple scab, early blight, red rot, rusts and smuts"],
    ["u5-oomycete", "Unit 5 · Oomycete Diseases", "Oomycete diseases: late blight of potato, white rust of crucifers and downy mildew of grapes"],
    ["u6-bacterial", "Unit 6 · Bacterial Diseases", "Bacterial diseases: citrus canker and angular leaf spot of cotton"],
    ["u7-viral", "Unit 7 · Viral Diseases", "Viral diseases: tobacco mosaic disease and vein clearing of bhindi"],
    ["u8-nematode", "Unit 8 · Nematode Diseases", "Nematode diseases: root-knot disease of brinjal"],
    ["u9-control", "Unit 9 · Plant Disease Control", "Plant quarantine; physical, chemical, cultural and biological methods of disease control"],
  ]),
  combination("s5-zoo-dse", 5, "Zoology", "DSE", [
    ["u1-endocrinology", "Unit 1 · Reproductive Endocrinology", "Hypothalamo-hypophyseal-gonadal axis, gonadotropins, gonadal steroids and steroidogenesis"],
    ["u2-male", "Unit 2 · Male Reproductive System", "Male reproductive anatomy, spermatogenesis, sperm transport and maturation"],
    ["u3-female", "Unit 3 · Female Reproductive System", "Female reproductive anatomy, folliculogenesis, oocyte maturation, ovulation, menstrual cycle and lactation"],
    ["u4-fertilization", "Unit 4 · Fertilization", "Fertilization, implantation, feto-placental unit, gestation and parturition"],
    ["u5-reproduction", "Unit 5 · Reproduction", "Contraception, infertility and assisted reproductive technologies (ART); ethical issues in ART"],
  ]),
  combination("s6-zoo-dse", 6, "Zoology", "DSE", [
    ["u1-foundations", "Unit 1 · Foundations of Research", "Meaning, objectives and motivation; research methods and methodology; types of research"],
    ["u2-design", "Unit 2 · Research Design", "Research design, problem identification, experimentation, experimental design and sample design"],
    ["u3-data", "Unit 3 · Data Collection, Analysis and Report Writing", "Data collection, sampling, sample size, data processing and analysis"],
    ["u3-report", "Unit 3 · Data Collection, Analysis and Report Writing", "Tables, figures, literature reviews, bibliographies, references and research presentation"],
    ["u4-ethics", "Unit 4 · Ethical Issues", "Intellectual property, copyright, patents, commercialization, plagiarism, citations, grants and laboratory-animal guidelines"],
  ]),
];
