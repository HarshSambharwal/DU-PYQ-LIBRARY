/**
 * Read-only audited references to the 81 DSC/DSE papers currently eligible for
 * Topic Search. Candidate counts are extraction-review counts, not verified
 * question totals. Semester 6 DSE Chemistry is intentionally omitted pending
 * its official syllabus. Paper 366 is retained under its existing DB metadata
 * per the owner's confirmation; this file does not change the database row.
 */
export type TopicSearchPaperReference = {
  id: number;
  importKey: string;
  title: string;
  year: number | null;
  semesterId: string;
  subjectName: string;
  category: "DSC" | "DSE";
  candidateQuestionCount: number;
};

export const TOPIC_SEARCH_PAPER_REFERENCES: readonly TopicSearchPaperReference[] = [
  { id: 167, importKey: "dupyq-file-e9fd2b3828707d19", title: "LS sem1 bot 2023", year: 2023, semesterId: "1", subjectName: "Botany", category: "DSC", candidateQuestionCount: 4 },
  { id: 172, importKey: "dupyq-file-6241e3dd35d5469c", title: "LS sem1 bot 2024", year: 2024, semesterId: "1", subjectName: "Botany", category: "DSC", candidateQuestionCount: 8 },
  { id: 177, importKey: "dupyq-file-314bb9ae9b74a6c6", title: "LS sem1 bot 2025", year: 2025, semesterId: "1", subjectName: "Botany", category: "DSC", candidateQuestionCount: 7 },
  { id: 182, importKey: "dupyq-file-927955aac8e93eed", title: "LS sem1 chem 2023", year: 2023, semesterId: "1", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 8 },
  { id: 187, importKey: "dupyq-file-01c797c10e78be53", title: "LS sem1 chem 2024", year: 2024, semesterId: "1", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 5 },
  { id: 192, importKey: "dupyq-file-5d256fcb65637434", title: "LS sem1 chem 2025", year: 2025, semesterId: "1", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 4 },
  { id: 197, importKey: "dupyq-file-30974026f8a3283e", title: "LS sem1 zoo 2023", year: 2023, semesterId: "1", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 8 },
  { id: 202, importKey: "dupyq-file-7655d48f42b8a3c1", title: "LS sem1 zoo 2024", year: 2024, semesterId: "1", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 4 },
  { id: 207, importKey: "dupyq-file-7553af1c823c7260", title: "LS sem1 zoo 2025", year: 2025, semesterId: "1", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 9 },
  { id: 212, importKey: "dupyq-file-419e13d73fccfa61", title: "LS sem1 zoo 2022", year: 2022, semesterId: "1", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 6 },
  { id: 328, importKey: "dupyq-file-2e3f8ae2edaaec6b", title: "LS sem1 zoo 2018", year: 2018, semesterId: "1", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 3 },
  { id: 217, importKey: "dupyq-file-806927bbe239802e", title: "LS sem2 bot 2023", year: 2023, semesterId: "2", subjectName: "Botany", category: "DSC", candidateQuestionCount: 2 },
  { id: 221, importKey: "dupyq-file-d2e13a74785a3557", title: "LS sem2 bot 2024", year: 2024, semesterId: "2", subjectName: "Botany", category: "DSC", candidateQuestionCount: 8 },
  { id: 225, importKey: "dupyq-file-3ab054cf8d5c3159", title: "LS sem2 bot 2025", year: 2025, semesterId: "2", subjectName: "Botany", category: "DSC", candidateQuestionCount: 6 },
  { id: 229, importKey: "dupyq-file-18ea3739d7aa34f1", title: "LS sem2 chem 2023", year: 2023, semesterId: "2", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 4 },
  { id: 233, importKey: "dupyq-file-bba64c5d9774f498", title: "LS sem2 chem 2024", year: 2024, semesterId: "2", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 5 },
  { id: 237, importKey: "dupyq-file-c1e89cf2db100b54", title: "LS sem2 chem 2025", year: 2025, semesterId: "2", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 11 },
  { id: 241, importKey: "dupyq-file-5c18f86702882220", title: "LS sem2 zoo 2023", year: 2023, semesterId: "2", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 2 },
  { id: 245, importKey: "dupyq-file-ceea02ff4954d425", title: "LS sem2 zoo 2024", year: 2024, semesterId: "2", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 1 },
  { id: 249, importKey: "dupyq-file-5b6b5e7dac19e772", title: "LS sem2 zoo 2025", year: 2025, semesterId: "2", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 8 },
  { id: 261, importKey: "dupyq-file-bce78c5fc9adb8c6", title: "LS sem3 bot 2023", year: 2023, semesterId: "3", subjectName: "Botany", category: "DSC", candidateQuestionCount: 2 },
  { id: 265, importKey: "dupyq-file-d52b99bbeb0019ea", title: "LS sem3 bot 2025", year: 2025, semesterId: "3", subjectName: "Botany", category: "DSC", candidateQuestionCount: 4 },
  { id: 330, importKey: "dupyq-file-b8f49ce5d3c44121", title: "LS sem3 bot 2024", year: 2024, semesterId: "3", subjectName: "Botany", category: "DSC", candidateQuestionCount: 5 },
  { id: 269, importKey: "dupyq-file-520d0f05e3f15474", title: "LS sem3 chem 2022", year: 2022, semesterId: "3", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 0 },
  { id: 273, importKey: "dupyq-file-364da882b54bdcf1", title: "LS sem3 chem 2023", year: 2023, semesterId: "3", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 11 },
  { id: 277, importKey: "dupyq-file-ce0ad735b18c2f6b", title: "LS sem3 chem 2024", year: 2024, semesterId: "3", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 0 },
  { id: 281, importKey: "dupyq-file-113076e84074674a", title: "LS sem3 chem 2025", year: 2025, semesterId: "3", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 16 },
  { id: 285, importKey: "dupyq-file-bacd77bda3fe70ee", title: "LS sem3 zoo 2024", year: 2024, semesterId: "3", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 1 },
  { id: 288, importKey: "dupyq-file-2f934a7a4e490545", title: "LS sem3 zoo 2025", year: 2025, semesterId: "3", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 2 },
  { id: 332, importKey: "dupyq-file-d47cc5af88dede7c", title: "LS sem3 zoo 2023", year: 2023, semesterId: "3", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 1 },
  { id: 370, importKey: "dupyq-file-c8e6eb678be95f7d", title: "LS sem3 DSE Bot 2025", year: 2025, semesterId: "3", subjectName: "Botany", category: "DSE", candidateQuestionCount: 7 },
  { id: 372, importKey: "dupyq-file-35be1f0f6a4875f9", title: "LS sem3 DSE Bot 2023", year: 2023, semesterId: "3", subjectName: "Botany", category: "DSE", candidateQuestionCount: 8 },
  { id: 334, importKey: "dupyq-file-ee53c86f7fa792de", title: "LS Sem3 DSE Chem 2024", year: 2024, semesterId: "3", subjectName: "Chemistry", category: "DSE", candidateQuestionCount: 7 },
  { id: 336, importKey: "dupyq-file-4d7d6f54dc0d3618", title: "LS Sem3 DSE Chem 2025", year: 2025, semesterId: "3", subjectName: "Chemistry", category: "DSE", candidateQuestionCount: 10 },
  { id: 253, importKey: "dupyq-file-3fa66f138bab2d33", title: "LS sem3 DSE Zoo 2022", year: 2022, semesterId: "3", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 7 },
  { id: 257, importKey: "dupyq-file-32f9a1fef3a44a8e", title: "LS sem3 DSE Zoo 2023", year: 2023, semesterId: "3", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 3 },
  { id: 291, importKey: "dupyq-file-e538a550065c1266", title: "LS sem3 DSE Zoo 2024", year: 2024, semesterId: "3", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 6 },
  { id: 294, importKey: "dupyq-file-be93fdf490d7b269", title: "LS sem4 bot 2024", year: 2024, semesterId: "4", subjectName: "Botany", category: "DSC", candidateQuestionCount: 4 },
  { id: 297, importKey: "dupyq-file-975673fc9bf56943", title: "LS sem4 bot 2025", year: 2025, semesterId: "4", subjectName: "Botany", category: "DSC", candidateQuestionCount: 6 },
  { id: 300, importKey: "dupyq-file-03f90e9ddffacc97", title: "LS sem4 chem 2024", year: 2024, semesterId: "4", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 11 },
  { id: 302, importKey: "dupyq-file-56db16c26b2aef95", title: "LS sem4 chem 2025", year: 2025, semesterId: "4", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 2 },
  { id: 382, importKey: "dupyq-file-aef650fe75ac4fff", title: "LS sem4 chem 2023", year: 2023, semesterId: "4", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 2 },
  { id: 304, importKey: "dupyq-file-521a9e0848a5b993", title: "LS sem4 zoo 2024", year: 2024, semesterId: "4", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 7 },
  { id: 306, importKey: "dupyq-file-148fe6abc2ce0b25", title: "LS sem4 zoo 2025", year: 2025, semesterId: "4", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 2 },
  { id: 338, importKey: "dupyq-file-efbee87ac743878d", title: "LS sem4 DSE Bot 2024", year: 2024, semesterId: "4", subjectName: "Botany", category: "DSE", candidateQuestionCount: 21 },
  { id: 340, importKey: "dupyq-file-66b98393b732e43f", title: "LS sem4 DSE Bot  2023", year: 2023, semesterId: "4", subjectName: "Botany", category: "DSE", candidateQuestionCount: 9 },
  { id: 342, importKey: "dupyq-file-73da21e09b66163f", title: "LS sem4 DSE Bot 2021", year: 2021, semesterId: "4", subjectName: "Botany", category: "DSE", candidateQuestionCount: 18 },
  { id: 344, importKey: "dupyq-file-6abef0222508d10c", title: "LS sem4 DSE Bot 2025", year: 2025, semesterId: "4", subjectName: "Botany", category: "DSE", candidateQuestionCount: 14 },
  { id: 346, importKey: "dupyq-file-7d77404709c666f4", title: "LS sem4 DSE Bot 2022", year: 2022, semesterId: "4", subjectName: "Botany", category: "DSE", candidateQuestionCount: 9 },
  { id: 348, importKey: "dupyq-file-bb35ef2fcfaf64d7", title: "LS sem4 DSE Chem 2025", year: 2025, semesterId: "4", subjectName: "Chemistry", category: "DSE", candidateQuestionCount: 0 },
  { id: 384, importKey: "dupyq-file-29f707a43ff0f7c8", title: "LS sem4 DSE Zoo 2023", year: 2023, semesterId: "4", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 6 },
  { id: 386, importKey: "dupyq-file-cacc5e437b54f951", title: "LS sem4 DSE Zoo 2024", year: 2024, semesterId: "4", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 4 },
  { id: 388, importKey: "dupyq-file-01a3286d226c6dc0", title: "LS sem4 DSE Zoo 2025", year: 2025, semesterId: "4", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 11 },
  { id: 308, importKey: "dupyq-file-42804e683dbcff72", title: "LS sem5 bot 2025", year: 2025, semesterId: "5", subjectName: "Botany", category: "DSC", candidateQuestionCount: 2 },
  { id: 350, importKey: "dupyq-file-e6cb9789fe6fbdbe", title: "LS sem5 bot 2022", year: 2022, semesterId: "5", subjectName: "Botany", category: "DSC", candidateQuestionCount: 6 },
  { id: 352, importKey: "dupyq-file-ad3ec02f7a25991a", title: "LS sem5 bot 2024", year: 2024, semesterId: "5", subjectName: "Botany", category: "DSC", candidateQuestionCount: 10 },
  { id: 354, importKey: "dupyq-file-7bf3da2c0ea77a9c", title: "LS sem5 bot 2023", year: 2023, semesterId: "5", subjectName: "Botany", category: "DSC", candidateQuestionCount: 13 },
  { id: 390, importKey: "dupyq-file-d762fb74866218b9", title: "LS sem5 bot 2021", year: 2021, semesterId: "5", subjectName: "Botany", category: "DSC", candidateQuestionCount: 23 },
  { id: 392, importKey: "dupyq-file-5950d2c223b07bbb", title: "LS sem5 bot 2020", year: 2020, semesterId: "5", subjectName: "Botany", category: "DSC", candidateQuestionCount: 11 },
  { id: 310, importKey: "dupyq-file-8dc9a1b0ecc96d97", title: "LS sem5 chem 2025", year: 2025, semesterId: "5", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 4 },
  { id: 376, importKey: "dupyq-file-e2b3146e865dec3f", title: "LS sem5 chem 2024", year: 2024, semesterId: "5", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 4 },
  { id: 312, importKey: "dupyq-file-3b5374babf144652", title: "LS sem5 zoo 2024", year: 2024, semesterId: "5", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 17 },
  { id: 314, importKey: "dupyq-file-fc559ad964a3762e", title: "LS sem5 zoo 2025", year: 2025, semesterId: "5", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 4 },
  { id: 316, importKey: "dupyq-file-fcb19820ccd81a30", title: "LS sem5 DSE Bot 2024", year: 2024, semesterId: "5", subjectName: "Botany", category: "DSE", candidateQuestionCount: 9 },
  { id: 374, importKey: "dupyq-file-b17296f8561534fa", title: "LS sem5 DSE Bot 2025", year: 2025, semesterId: "5", subjectName: "Botany", category: "DSE", candidateQuestionCount: 5 },
  { id: 366, importKey: "dupyq-file-85a734890c0be239", title: "LS sem5 DSE Chem 2024", year: 2024, semesterId: "5", subjectName: "Chemistry", category: "DSE", candidateQuestionCount: 0 },
  { id: 368, importKey: "dupyq-file-e6d99b60ecfb55a7", title: "LS sem5 DSE Chem 2025", year: 2025, semesterId: "5", subjectName: "Chemistry", category: "DSE", candidateQuestionCount: 3 },
  { id: 394, importKey: "dupyq-file-6e7c3535bd924986", title: "LS sem5 DSE Zoo 2024", year: 2024, semesterId: "5", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 4 },
  { id: 396, importKey: "dupyq-file-4bb2f2f7be4fb500", title: "LS sem5 DSE Zoo 2025", year: 2025, semesterId: "5", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 6 },
  { id: 318, importKey: "dupyq-file-6dbaebf08452031d", title: "LS sem6 bot 2024", year: 2024, semesterId: "6", subjectName: "Botany", category: "DSC", candidateQuestionCount: 12 },
  { id: 356, importKey: "dupyq-file-1efcafa91f243e09", title: "LS sem6 bot 2025", year: 2025, semesterId: "6", subjectName: "Botany", category: "DSC", candidateQuestionCount: 14 },
  { id: 398, importKey: "dupyq-file-dcf2d45ac0c3002a", title: "LS sem6 bot 2023", year: 2023, semesterId: "6", subjectName: "Botany", category: "DSC", candidateQuestionCount: 7 },
  { id: 322, importKey: "dupyq-file-5b3dd22f95ca0c6c", title: "LS sem6 chem 2023", year: 2023, semesterId: "6", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 6 },
  { id: 358, importKey: "dupyq-file-badc5a7039acee77", title: "LS sem6 chem 2018", year: 2018, semesterId: "6", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 22 },
  { id: 360, importKey: "dupyq-file-57bba2e7f07b6278", title: "LS sem6 chem 2024", year: 2024, semesterId: "6", subjectName: "Chemistry", category: "DSC", candidateQuestionCount: 6 },
  { id: 320, importKey: "dupyq-file-55100d71bd123aba", title: "LS sem6 zoo 2022", year: 2022, semesterId: "6", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 6 },
  { id: 324, importKey: "dupyq-file-efdbb7e182e75be3", title: "LS sem6 zoo 2023", year: 2023, semesterId: "6", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 1 },
  { id: 326, importKey: "dupyq-file-d69ad537e62af3b3", title: "LS sem6 zoo 2024", year: 2024, semesterId: "6", subjectName: "Zoology", category: "DSC", candidateQuestionCount: 7 },
  { id: 378, importKey: "dupyq-file-8c8df44a9d5be522", title: "LS sem6 DSE Bot 2025", year: 2025, semesterId: "6", subjectName: "Botany", category: "DSE", candidateQuestionCount: 3 },
  { id: 380, importKey: "dupyq-file-96e5ef6bcf56c58b", title: "LS sem6 DSE Bot 2024", year: 2024, semesterId: "6", subjectName: "Botany", category: "DSE", candidateQuestionCount: 11 },
  { id: 364, importKey: "dupyq-file-98f2812aee69188b", title: "LS sem 6 DSE Zoo 2024", year: 2024, semesterId: "6", subjectName: "Zoology", category: "DSE", candidateQuestionCount: 4 }
];
