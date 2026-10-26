import type { MetadataRoute } from "next";

const baseUrl = "https://du-pyq-library.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/browse`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
