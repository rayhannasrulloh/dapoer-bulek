import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dapoerbulek.web.id"),
  title: "Dapoer Bulek | Catering Tumpeng, Nasi Liwet & Kue di Tumijajar",
  description:
    "Dapoer Bulek melayani pemesanan Tumpeng Nasi Kuning & Uduk, Nasi Liwet Sunda, Nasi Kotak, Nasi Bento, Nasi Bakar, Rice Bowl, Mie Gacoan, Ayam & Ikan Bakar, Pudding Tart, dan Jajanan Pasar di Dayamurni, Tumijajar, Tulang Bawang Barat, Lampung.",
  keywords: [
    "Dapoer Bulek",
    "Tumpeng Tulang Bawang Barat",
    "Catering Tumijajar",
    "Nasi Liwet Lampung",
    "Nasi Bakar Tumijajar",
    "Rice Bowl Dayamurni",
    "Nasi Bento",
    "Pudding Tart",
    "Jajanan Pasar",
    "Catering Dayamurni",
  ],
  openGraph: {
    title: "Dapoer Bulek | Catering Tumpeng, Nasi Liwet & Kue di Tumijajar",
    description:
      "Melayani Pre-Order Tumpeng, Nasi Liwet, Pudding Cake, dan Jajanan Pasar di Dayamurni, Tumijajar sejak 2019.",
    url: "https://www.dapoerbulek.web.id/",
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
