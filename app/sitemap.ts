
import type { MetadataRoute } from "next";
import { getSupabaseClient } from "@/lib/supabase/client";

const BASE_URL = "https://du-pyq-library.vercel.app";
const PAGE_SIZE = 500;

// Refresh the sitemap periodically to include newly added papers.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/browse`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured for sitemap generation.");
  }

  const paperPages: MetadataRoute.Sitemap = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("papers")
      .select("id,pdf_url")
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Unable to generate paper sitemap: ${error.message}`);
    }

    for (const paper of data ?? []) {
      if (
        Number.isSafeInteger(paper.id) &&
        paper.id > 0 &&
        typeof paper.pdf_url === "string" &&
        paper.pdf_url.trim().length > 0
      ) {
        paperPages.push({
          url: `${BASE_URL}/papers/${paper.id}`,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    if (!data || data.length < PAGE_SIZE) {
      break;
    }
  }

  return [...staticPages, ...paperPages];
}
