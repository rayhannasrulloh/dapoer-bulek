export type MenuGroup =
  | "Tumpeng & Tampah"
  | "Nasi Kotak & Lauk"
  | "Kue, Pudding & Snack";

export type Category = "Semua" | MenuGroup;

export const CATEGORIES: Category[] = [
  "Semua",
  "Tumpeng & Tampah",
  "Nasi Kotak & Lauk",
  "Kue, Pudding & Snack",
];

export interface MenuGroupMeta {
  id: MenuGroup;
  number: string;
  title: string;
  subtitle: string;
  aspectClass: string;
  desktopGridClass: string;
}

export const MENU_GROUPS: MenuGroupMeta[] = [
  {
    id: "Tumpeng & Tampah",
    number: "01",
    title: "Tumpeng & Tampah",
    subtitle:
      "Tumpeng kerucut klasik, bentuk custom acara, hingga tampah nasi liwet dengan lauk lengkap.",
    aspectClass: "aspect-square",
    desktopGridClass: "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
  },
  {
    id: "Nasi Kotak & Lauk",
    number: "02",
    title: "Nasi Kotak & Ayam Ingkung",
    subtitle:
      "Paket nasi kotak perorangan dan ayam ingkung utuh berbumbu rempah untuk rapat maupun kenduri.",
    aspectClass: "aspect-[4/3]",
    desktopGridClass: "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
  },
  {
    id: "Kue, Pudding & Snack",
    number: "03",
    title: "Pie Buah, Pudding & Snack Box",
    subtitle:
      "Pie buah tart custom, aneka pudding acara, tumpeng buah segar, dan kotak kue jajanan pasar.",
    aspectClass: "aspect-square",
    desktopGridClass:
      "grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
  },
];

export interface MenuItem {
  id: string;
  name: string;
  category: MenuGroup;
  portionInfo: string;
  leadTime: string;
  leadDays: 2 | 3;
  minOrder: number;
  unitLabel: string;
  supportsGreetingCard?: boolean;
  description: string;
  spotlightNote?: string;
  image: string;
  width: number;
  height: number;
  objectPosition?: string;
  featured?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "tumpeng-nasi-kuning-klasik",
    name: "Tumpeng Nasi Kuning Klasik",
    category: "Tumpeng & Tampah",
    portionInfo: "Porsi 10-15 orang",
    leadTime: "Pre-Order min. H-3",
    leadDays: 3,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Nasi kuning pulen berbentuk kerucut dengan lauk lengkap: telur rebus, mie goreng, tempe orek, serundeng, tahu dan tempe bacem, urap sayur, serta ukiran buah dan sayur segar.",
    spotlightNote:
      "Tersedia penyesuaian porsi dan permintaan lauk tambahan untuk acara syukuran, peresmian, maupun ulang tahun.",
    image: "/images/real-images/tumpeng-300k.jpg",
    width: 3000,
    height: 4000,
    objectPosition: "50% 50%",
    featured: true,
  },
  {
    id: "tumpeng-nasi-liwet-spesial",
    name: "Tumpeng Nasi Liwet Spesial",
    category: "Tumpeng & Tampah",
    portionInfo: "Porsi 10-15 orang",
    leadTime: "Pre-Order min. H-3",
    leadDays: 3,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Kerucut nasi liwet gurih berbumbu rempah dengan ayam panggang utuh, sambal dalam wadah batok, mie goreng, perkedel, ikan asin goreng, tempe orek, tahu goreng, serundeng, dan urap sayur.",
    image: "/images/real-images/tumpeng-nasi-liwet.jpg",
    width: 6000,
    height: 8000,
    objectPosition: "50% 52%",
  },
  {
    id: "tumpeng-kotak-prasmanan",
    name: "Tumpeng Kotak Prasmanan",
    category: "Tumpeng & Tampah",
    portionInfo: "Porsi 10-15 orang",
    leadTime: "Pre-Order min. H-3",
    leadDays: 3,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Tumpeng nasi kuning dalam wadah kotak tampah rapi dilengkapi ayam berbumbu, perkedel kentang, telur puyuh, telur rebus, tempe orek, mie goreng, urap sayur, dan sambal dalam wadah buah nanas.",
    image: "/images/real-images/tumpeng-kotak.jpg",
    width: 4000,
    height: 3000,
    objectPosition: "50% 50%",
  },
  {
    id: "tumpeng-bentuk-hati-custom",
    name: "Tumpeng Bentuk Hati Custom",
    category: "Tumpeng & Tampah",
    portionInfo: "Porsi & ucapan custom",
    leadTime: "Pre-Order min. H-3",
    leadDays: 3,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Nasi kuning dibentuk hati dengan kartu ucapan acara keluarga, disajikan bersama ayam bakar berbumbu, bihun goreng, tempe orek, serundeng, urap sayur, dan ukiran buah.",
    image: "/images/real-images/tumpeng-love.jpg",
    width: 4000,
    height: 3000,
    objectPosition: "43% 50%",
  },
  {
    id: "tumpeng-angka-tema-acara",
    name: "Tumpeng Angka & Tema Acara",
    category: "Tumpeng & Tampah",
    portionInfo: "Porsi besar / acara lembaga",
    leadTime: "Pre-Order min. H-3",
    leadDays: 3,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Tumpeng nasi kuning custom berbentuk angka perayaan yang dipadukan kerucut nasi kuning, ayam goreng, tahu dan tempe goreng, telur rebus, mie goreng, orek tempe, dan urap sayur.",
    image: "/images/real-images/tumpeng-hut-73.jpg",
    width: 4000,
    height: 3000,
    objectPosition: "45% 50%",
  },
  {
    id: "tumpeng-sate-lontong",
    name: "Tumpeng Sate & Lontong",
    category: "Tumpeng & Tampah",
    portionInfo: "Sajian keluarga & ulang tahun",
    leadTime: "Pre-Order min. H-3",
    leadDays: 3,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Variasi tumpeng non-nasi dengan potongan lontong di tengah, puluhan tusuk sate berbumbu kecap dan bawang cabai, serta bumbu kacang dan acar segar di dalam wadah nanas.",
    image: "/images/real-images/tumpeng-sate-lontong.jpg",
    width: 4000,
    height: 2256,
    objectPosition: "49% 50%",
  },
  {
    id: "nasi-liwet-tampah-sunda",
    name: "Nasi Liwet Tampah Sunda",
    category: "Tumpeng & Tampah",
    portionInfo: "Sajian kelompok atau keluarga",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 1,
    unitLabel: "tampah",
    description:
      "Nasi liwet gurih bertabur cabai dan teri di atas tampah bambu beralas daun pisang, dilengkapi ayam bakar, tahu, tempe, ikan asin goreng, sambal, dan lalapan daun kemangi.",
    image: "/images/real-images/nasi-liwet.jpg",
    width: 1536,
    height: 1920,
    objectPosition: "50% 42%",
  },
  {
    id: "ayam-ingkung-bakar",
    name: "Ayam Ingkung Bakar",
    category: "Nasi Kotak & Lauk",
    portionInfo: "Per ekor utuh / paket acara",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 1,
    unitLabel: "ekor",
    description:
      "Ayam utuh dimasak ungkep dengan rempah tradisional lalu dibakar kecokelatan di atas daun pisang, lengkap dengan selada, timun, wortel, dan sambal terpisah.",
    image: "/images/real-images/ayam-ingkung-6.jpg",
    width: 4000,
    height: 2256,
    objectPosition: "50% 50%",
  },
  {
    id: "nasi-kotak-ayam-geprek",
    name: "Nasi Kotak Ayam Geprek",
    category: "Nasi Kotak & Lauk",
    portionInfo: "Minimal 20 kotak",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 20,
    unitLabel: "kotak",
    description:
      "Paket nasi kotak praktis berisi nasi putih bungkus rapi, ayam goreng krispi, sambal cabai merah segar, irisan timun, dan daun kemangi untuk rapat maupun syukuran.",
    image: "/images/real-images/nasi-kotak-ayam-geprek.jpg",
    width: 4000,
    height: 2256,
    objectPosition: "50% 50%",
  },
  {
    id: "nasi-kotak-nasi-liwet",
    name: "Nasi Kotak Nasi Liwet",
    category: "Nasi Kotak & Lauk",
    portionInfo: "Minimal 20 kotak",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 20,
    unitLabel: "kotak",
    description:
      "Nasi liwet bungkus kerucut daun pisang dalam kotak rapi bersama ayam goreng, mie goreng, tempe orek, ikan asin kering, dan sambal dalam wadah tertutup.",
    image: "/images/real-images/nasi-kotak-liwet.jpg",
    width: 3000,
    height: 4000,
    objectPosition: "50% 50%",
  },
  {
    id: "pie-buah-tart-custom",
    name: "Pie Buah Tart Custom",
    category: "Kue, Pudding & Snack",
    portionInfo: "Diameter & topping custom",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 1,
    unitLabel: "loyang",
    supportsGreetingCard: true,
    description:
      "Kulit pie ukuran besar yang renyah dengan isian vla vanila lembut, topping potongan jeruk, kiwi, stroberi, ceri, cokelat, serta topper ucapan ulang tahun sesuai permintaan.",
    spotlightNote:
      "Pilihan buah dan tambahan cokelat atau topper ucapan dapat disesuaikan langsung lewat WhatsApp.",
    image: "/images/real-images/pie-buah.jpg",
    width: 3000,
    height: 4000,
    objectPosition: "50% 24%",
    featured: true,
  },
  {
    id: "tumpeng-pudding-cake",
    name: "Tumpeng Pudding Cake",
    category: "Kue, Pudding & Snack",
    portionInfo: "Diameter loyang menyesuaikan",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 1,
    unitLabel: "loyang",
    supportsGreetingCard: true,
    description:
      "Pudding berlapis berbentuk tumpeng dengan pilihan rasa dan warna yang dapat disesuaikan untuk selamatan maupun kejutan ulang tahun.",
    image: "/images/pudding-tumpeng.png",
    width: 1024,
    height: 1024,
  },
  {
    id: "pudding-cake-birthday",
    name: "Pudding Cake Birthday",
    category: "Kue, Pudding & Snack",
    portionInfo: "Desain & ucapan custom",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 1,
    unitLabel: "loyang",
    supportsGreetingCard: true,
    description:
      "Pudding ulang tahun dengan kombinasi vla dan dekorasi buah atau karakter sesuai permintaan tema acara.",
    image: "/images/pudding-birthday.png",
    width: 1024,
    height: 1024,
  },
  {
    id: "tumpeng-buah",
    name: "Tumpeng Buah",
    category: "Kue, Pudding & Snack",
    portionInfo: "Rangkaian buah segar utuh",
    leadTime: "Pre-Order min. H-3",
    leadDays: 3,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Susunan aneka buah potong segar berbentuk tumpeng sebagai alternatif hantaran atau sajian penutup acara keluarga.",
    image: "/images/tumpeng-buah.png",
    width: 1024,
    height: 1024,
  },
  {
    id: "snack-box-jajanan-pasar",
    name: "Snack Box Jajanan Pasar",
    category: "Kue, Pudding & Snack",
    portionInfo: "Minimal 15 kotak",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 15,
    unitLabel: "kotak",
    description:
      "Isian kue basah dan gurih pilihan seperti klepon, onde-onde, kue lapis, dadar gulung, lemper, dan risoles untuk rapat atau pengajian.",
    image: "/images/snack-box.png",
    width: 1024,
    height: 1024,
  },
];

export const WHATSAPP_NUMBER = "6282193562480";
export const INSTAGRAM_URL = "https://www.instagram.com/dapoerbule_354/";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Dapoer+Bulek+Dayamurni+Tumijajar+Tulang+Bawang+Barat+Lampung";

export function getWhatsAppMenuLink(menuName: string): string {
  const text = `Halo Dapoer Bulek, saya ingin menanyakan harga, porsi, dan jadwal Pre-Order untuk ${menuName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppGeneralLink(): string {
  const text =
    "Halo Dapoer Bulek, saya ingin berkonsultasi mengenai menu dan pemesanan catering.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppTextLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export interface OrderSelectionItem {
  menuId: string;
  quantity: number;
}

export type DeliveryMethod = "pickup" | "delivery";

export interface PreOrderFormValues {
  customerName: string;
  eventDate: string;
  eventTime: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  greetingCardText: string;
  notes: string;
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return "[Belum diisi]";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = Number(parts[0]);
  const monthIndex = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  if (
    Number.isNaN(year) ||
    Number.isNaN(monthIndex) ||
    Number.isNaN(day) ||
    monthIndex < 0 ||
    monthIndex > 11
  ) {
    return dateStr;
  }

  const dateObj = new Date(year, monthIndex, day);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
}

export function buildPreOrderWhatsAppMessage(
  items: OrderSelectionItem[],
  form: PreOrderFormValues
): string {
  const resolvedItems = items
    .map((entry) => {
      const menu = MENU_ITEMS.find((m) => m.id === entry.menuId);
      if (!menu) return null;
      return { menu, quantity: entry.quantity };
    })
    .filter((entry): entry is { menu: MenuItem; quantity: number } => entry !== null);

  const lines: string[] = [
    "Halo Dapoer Bulek, saya ingin mengajukan Pre-Order catering dengan detail berikut:",
    "",
    `Nama Pemesan: ${form.customerName.trim() || "[Belum diisi]"}`,
    `Tanggal Acara: ${formatIndonesianDate(form.eventDate)}`,
    `Jam Acara / Siap Saji: ${form.eventTime.trim() ? `${form.eventTime.trim()} WIB` : "[Belum diisi]"}`,
    `Metode Pengambilan: ${
      form.deliveryMethod === "pickup"
        ? "Ambil di Dapur (Dayamurni, Tumijajar)"
        : "Antar ke Alamat"
    }`,
  ];

  if (form.deliveryMethod === "delivery") {
    lines.push(
      `Alamat Pengantaran: ${form.deliveryAddress.trim() || "[Belum diisi]"}`
    );
  }

  lines.push("", "Daftar Pesanan:");
  if (resolvedItems.length === 0) {
    lines.push("- [Belum ada menu yang dipilih]");
  } else {
    resolvedItems.forEach(({ menu, quantity }, index) => {
      lines.push(
        `${index + 1}. ${menu.name} (${quantity} ${menu.unitLabel}, min. H-${menu.leadDays})`
      );
    });
  }

  if (form.greetingCardText.trim()) {
    lines.push("", `Ucapan Kartu / Topper: ${form.greetingCardText.trim()}`);
  }

  if (form.notes.trim()) {
    lines.push("", `Catatan Tambahan: ${form.notes.trim()}`);
  }

  lines.push(
    "",
    "Mohon informasi rincian harga, ketersediaan jadwal, dan ketentuan DP. Terima kasih."
  );

  return lines.join("\n");
}
