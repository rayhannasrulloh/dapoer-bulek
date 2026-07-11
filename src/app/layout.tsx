import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dapoer Bulek — Sajian Istimewa untuk Momen Berharga Anda",
  description:
    "Dapoer Bulek melayani pemesanan Tumpeng, Nasi Liwet, Pudding Cake, dan Jajanan Pasar premium untuk wilayah Dayamurni, Tumijajar, Tulang Bawang Barat, Lampung. Pesan sekarang via WhatsApp!",
  keywords: [
    "Dapoer Bulek",
    "Tumpeng Tulang Bawang Barat",
    "Catering Tumijajar",
    "Nasi Liwet Lampung",
    "Pudding Cake",
    "Jajanan Pasar",
    "Catering Dayamurni",
  ],
  openGraph: {
    title: "Dapoer Bulek — Sajian Istimewa untuk Momen Berharga Anda",
    description:
      "Melayani pemesanan Tumpeng, Nasi Liwet, Pudding Cake & Jajanan Pasar premium sejak 2019.",
    url: "https://dapoerbulek.web.id",
    siteName: "Dapoer Bulek",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
