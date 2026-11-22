import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/wm-gen", "/wm-gen/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
