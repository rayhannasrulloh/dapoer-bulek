export type TumpengGalleryCategory =
  | "Semua"
  | "Klasik & Tampah"
  | "Custom & Angka"
  | "Liwet, Sate & Mini";

export interface TumpengGalleryPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
  objectPosition: string;
  category: Exclude<TumpengGalleryCategory, "Semua">;
  title: string;
  caption: string;
  alt: string;
}

export const TUMPENG_GALLERY_CATEGORIES: TumpengGalleryCategory[] = [
  "Semua",
  "Klasik & Tampah",
  "Custom & Angka",
  "Liwet, Sate & Mini",
];

export const TUMPENG_GALLERY: TumpengGalleryPhoto[] = [
  {
    id: "tumpeng-klasik-db",
    src: "/images/real-images/tumpeng-klasik-db.jpg",
    width: 4000,
    height: 3000,
    objectPosition: "50% 52%",
    category: "Klasik & Tampah",
    title: "Tumpeng Nasi Kuning Klasik Tampah",
    caption:
      "Kerucut nasi kuning di tampah daun pisang dengan ayam panggang utuh, mie goreng, sambal goreng tempe, telur rebus, dan hiasan nanas.",
    alt: "Tumpeng nasi kuning klasik beralas daun pisang segitiga dengan ayam panggang utuh, mie goreng, sambal goreng tempe, telur rebus, dan hiasan nanas utuh",
  },
  {
    id: "tumpeng-tampah-klasik",
    src: "/images/real-images/tumpeng-tampah-klasik.jpg",
    width: 4000,
    height: 3000,
    objectPosition: "50% 56%",
    category: "Klasik & Tampah",
    title: "Tumpeng Tampah Hiasan Semangka & Telur",
    caption:
      "Tumpeng nasi kuning tampah bundar berkerucut daun pisang tinggi dengan ayam berbumbu, mie goreng, ukiran semangka, dan hiasan telur.",
    alt: "Tumpeng nasi kuning dalam tampah bundar dengan pucuk daun pisang tinggi, ayam berbumbu, mie goreng, ukiran bunga wortel timun, semangka ukir, dan hiasan telur rebus",
  },
  {
    id: "tumpeng-kotak-nanas",
    src: "/images/real-images/tumpeng-kotak-nanas.jpg",
    width: 3000,
    height: 4000,
    objectPosition: "50% 62%",
    category: "Klasik & Tampah",
    title: "Tumpeng Nasi Kuning Kotak Bertingkat",
    caption:
      "Nasi kuning kerucut bertingkat dalam wadah kotak dilengkapi telur rebus, sate telur puyuh, sambal goreng tempe, dan hiasan nanas utuh.",
    alt: "Tumpeng nasi kuning bertingkat dalam wadah kotak dengan hiasan nanas utuh, bunga wortel merekah, telur rebus, sate telur puyuh, abon, dan sambal goreng tempe",
  },
  {
    id: "tumpeng-angka-75",
    src: "/images/real-images/tumpeng-angka-75.jpg",
    width: 4000,
    height: 3000,
    objectPosition: "50% 54%",
    category: "Custom & Angka",
    title: "Tumpeng Custom Angka 75",
    caption:
      "Nasi kuning custom berbentuk angka perayaan dalam nampan besar bersama kerucut nasi kuning, sate, ayam goreng, tempe bacem, dan urap.",
    alt: "Tumpeng nasi kuning custom berbentuk angka 75 dalam nampan persegi panjang bersama kerucut nasi kuning, sate berikat pita, ayam goreng, tempe bacem, orek tempe, urap, dan wadah sambal buah ukir",
  },
  {
    id: "tumpeng-hati-melon",
    src: "/images/real-images/tumpeng-hati-melon.jpg",
    width: 3000,
    height: 4000,
    objectPosition: "50% 52%",
    category: "Custom & Angka",
    title: "Tumpeng Bentuk Hati Ukir Melon",
    caption:
      "Tumpeng nasi kuning bentuk hati tampak atas dengan mangkuk sambal ukiran melon, ayam goreng, mie goreng, tahu bacem, dan telur rebus.",
    alt: "Tumpeng nasi kuning berbentuk hati tampak atas di atas tampah daun pisang dengan mangkuk sambal dari buah melon ukir, ayam goreng, tahu bacem, tempe orek, mie goreng, dan telur rebus",
  },
  {
    id: "tumpeng-kolam-koi",
    src: "/images/real-images/tumpeng-kolam-koi.jpg",
    width: 3000,
    height: 4000,
    objectPosition: "50% 55%",
    category: "Custom & Angka",
    title: "Tumpeng Anyaman & Kolam Puding Koi",
    caption:
      "Tumpeng nasi kuning bertepi anyaman kacang panjang dengan ukiran bunga lobak, hiasan kolam agar-agar ikan koi, ayam goreng, dan telur.",
    alt: "Tumpeng nasi kuning bertepi anyaman kacang panjang dengan ukiran bunga lobak dan timun, hiasan kolam agar-agar ikan koi, telur balado, ayam goreng, dan mie goreng",
  },
  {
    id: "tumpeng-liwet-besar",
    src: "/images/real-images/tumpeng-liwet-besar.jpg",
    width: 4000,
    height: 3000,
    objectPosition: "50% 54%",
    category: "Liwet, Sate & Mini",
    title: "Tumpeng Nasi Liwet Nampan Besar",
    caption:
      "Sajian nasi liwet kerucut bertingkat dan nasi liwet bundar dikelilingi telur rebus, ayam goreng, mie goreng, abon, dan sambal nanas.",
    alt: "Sajian tumpeng nasi liwet nampan besar terdiri dari kerucut nasi liwet bertingkat dan nasi bulat berhias telur rebus, ayam goreng, mie goreng, abon, urap, dan sambal dalam buah nanas",
  },
  {
    id: "tumpeng-sate-lontong",
    src: "/images/real-images/tumpeng-sate-lontong.jpg",
    width: 4000,
    height: 2256,
    objectPosition: "49% 50%",
    category: "Liwet, Sate & Mini",
    title: "Tumpeng Sate & Lontong",
    caption:
      "Variasi tumpeng non-nasi berisi potongan lontong, tusuk sate berbumbu, serta bumbu kacang dan acar di dalam wadah nanas ukir.",
    alt: "Tumpeng Sate dan Lontong Dapoer Bulek dengan kartu ucapan ulang tahun keluarga dan wadah bumbu kacang serta acar dari nanas ukir",
  },
  {
    id: "tumpeng-mini-cup",
    src: "/images/real-images/tumpeng-mini-cup.jpg",
    width: 1536,
    height: 1920,
    objectPosition: "50% 50%",
    category: "Liwet, Sate & Mini",
    title: "Tumpeng Mini Porsi Satuan",
    caption:
      "Tumpeng mini dalam wadah mika individual berisi kerucut nasi berbalut daun pisang, ayam bakar, sate, mie goreng, dan orek tempe.",
    alt: "Tumpeng mini porsi satuan dalam wadah mika hitam berisi kerucut nasi kuning berbungkus daun pisang, ayam bakar, sate, mie goreng, tempe orek, dan ukiran timun tomat",
  },
];
