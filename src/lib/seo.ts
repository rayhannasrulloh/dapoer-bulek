import {
  INSTAGRAM_URL,
  MAPS_URL,
  MENU_GROUPS,
  MENU_ITEMS,
  WHATSAPP_NUMBER,
} from "@/data/menu";

export const SITE_URL = "https://www.dapoerbulek.web.id";
export const SITE_NAME = "Dapoer Bulek";
export const OG_IMAGE_PATH = "/images/og-dapoer-bulek.jpg";

export const BUSINESS_GEO = {
  latitude: -4.6381027255981,
  longitude: 105.07461774540799,
};

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FoodEstablishment", "LocalBusiness"],
        "@id": `${SITE_URL}/#business`,
        name: SITE_NAME,
        alternateName: "Dapoer Bulek Tumijajar",
        url: SITE_URL,
        image: [
          `${SITE_URL}${OG_IMAGE_PATH}`,
          `${SITE_URL}/images/hero-bg.png`,
        ],
        logo: `${SITE_URL}/logo/logo.png`,
        description:
          "Dapur catering rumahan sejak 2019 di Dayamurni, Tumijajar, Tulang Bawang Barat, Lampung. Melayani Tumpeng Nasi Kuning & Uduk, Nasi Liwet, Nasi Kotak, Nasi Bento, Nasi Bakar, Rice Bowl, Mie Gacoan, Ayam & Ikan Bakar, Pepes, Pie Buah, Pudding Tart, dan Snack Box.",
        telephone: `+${WHATSAPP_NUMBER}`,
        sameAs: [INSTAGRAM_URL, MAPS_URL],
        hasMap: MAPS_URL,
        servesCuisine: ["Indonesian", "Javanese", "Sundanese", "Catering"],
        foundingDate: "2019",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Dayamurni, Kec. Tumijajar",
          addressLocality: "Kabupaten Tulang Bawang Barat",
          addressRegion: "Lampung",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: BUSINESS_GEO.latitude,
          longitude: BUSINESS_GEO.longitude,
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Kabupaten Tulang Bawang Barat, Lampung",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "07:00",
          closes: "19:00",
        },
        hasMenu: {
          "@type": "Menu",
          name: "Daftar Menu Pre-Order & Harian Dapoer Bulek",
          hasMenuSection: MENU_GROUPS.map((group) => ({
            "@type": "MenuSection",
            name: group.title,
            description: group.subtitle,
            hasMenuItem: MENU_ITEMS.filter((item) => item.category === group.id).map(
              (item) => ({
                "@type": "MenuItem",
                name: item.name,
                description: item.description,
                ...(item.image ? { image: `${SITE_URL}${item.image}` } : {}),
              })
            ),
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "id-ID",
        publisher: {
          "@id": `${SITE_URL}/#business`,
        },
      },
    ],
  };
}
