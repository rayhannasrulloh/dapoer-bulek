import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { AnalyticsProviders } from "@/components/AnalyticsProviders";
import {
  getLocalBusinessJsonLd,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
  process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dapoer Bulek | Catering Tumpeng, Nasi Liwet & Kue di Tumijajar",
  description:
    "Dapoer Bulek melayani pemesanan Tumpeng Nasi Kuning & Uduk, Nasi Liwet Sunda, Nasi Kotak, Nasi Bento, Nasi Bakar, Rice Bowl, Mie Gacoan, Ayam & Ikan Bakar, Pudding Tart, dan Jajanan Pasar di Dayamurni, Tumijajar, Tulang Bawang Barat, Lampung.",
  keywords: [
    "Dapoer Bulek",
    "Tumpeng Tulang Bawang Barat",
    "Catering Tumijajar",
    "Catering Tulang Bawang Barat",
    "Nasi Liwet Lampung",
    "Nasi Bakar Tumijajar",
    "Rice Bowl Dayamurni",
    "Nasi Bento",
    "Pudding Tart",
    "Jajanan Pasar",
    "Catering Dayamurni",
  ],
  alternates: {
    canonical: "/",
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  openGraph: {
    title: "Dapoer Bulek | Catering Tumpeng, Nasi Liwet & Kue di Tumijajar",
    description:
      "Melayani Pre-Order Tumpeng, Nasi Liwet, Pudding Cake, dan Jajanan Pasar di Dayamurni, Tumijajar sejak 2019.",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Tumpeng Nasi Kuning Dapoer Bulek khas Dayamurni, Tumijajar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dapoer Bulek | Catering Tumpeng, Nasi Liwet & Kue di Tumijajar",
    description:
      "Dapur rumahan sejak 2019 di Dayamurni, Tumijajar, melayani sekabupaten Tulang Bawang Barat setiap hari pukul 07.00-19.00 WIB.",
    images: [OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = getLocalBusinessJsonLd();

  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
        {children}
        <AnalyticsProviders />
      </body>
    </html>
  );
}
