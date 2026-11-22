import type { MetadataRoute } from "next";
import { MENU_ITEMS } from "@/data/menu";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const imageUrls = Array.from(
    new Set([
      `${SITE_URL}${OG_IMAGE_PATH}`,
      `${SITE_URL}/images/hero-bg.png`,
      ...MENU_ITEMS.flatMap((item) =>
        item.image ? [`${SITE_URL}${item.image}`] : []
      ),
    ])
  );

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: imageUrls,
    },
  ];
}
