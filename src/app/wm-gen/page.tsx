import type { Metadata } from "next";
import { WatermarkStudio } from "@/components/WatermarkStudio";

export const metadata: Metadata = {
  title: "Watermark & Template Konten | Dapoer Bulek",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WatermarkGeneratorPage() {
  return <WatermarkStudio />;
}
