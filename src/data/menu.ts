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

export interface MenuVariant {
  id: string;
  label: string;
  description?: string;
}

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
  variants: MenuVariant[];
  notePlaceholder?: string;
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
    variants: [
      { id: "porsi-10", label: "Porsi 10 orang", description: "Cocok untuk acara keluarga inti" },
      { id: "porsi-15", label: "Porsi 15 orang", description: "Porsi standar syukuran dan kantor" },
      { id: "porsi-20-plus", label: "Porsi 20+ orang (Custom)", description: "Detail porsi dan lauk dikonfirmasi admin" },
    ],
    notePlaceholder: "Contoh: sambal dipisah, request lauk tambahan",
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
    variants: [
      { id: "porsi-10", label: "Porsi 10 orang", description: "Nasi liwet kerucut lengkap dengan lauk" },
      { id: "porsi-15", label: "Porsi 15 orang", description: "Porsi lebih besar untuk acara keluarga" },
      { id: "porsi-20-plus", label: "Porsi 20+ orang (Custom)", description: "Jumlah porsi dan lauk dikonfirmasi admin" },
    ],
    notePlaceholder: "Contoh: ayam panggang bumbu manis, tanpa ikan asin",
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
    variants: [
      { id: "porsi-10", label: "Porsi 10 orang", description: "Wadah kotak tampah praktis dibawa" },
      { id: "porsi-15", label: "Porsi 15 orang", description: "Porsi standar untuk jamuan kantor atau keluarga" },
      { id: "custom", label: "Ukuran Custom", description: "Komposisi lauk menyesuaikan kebutuhan acara" },
    ],
    notePlaceholder: "Contoh: tidak pedas, request warna garnis",
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
    variants: [
      { id: "porsi-10", label: "Porsi 10 orang", description: "Cocok untuk kejutan ulang tahun atau anniversary" },
      { id: "porsi-15", label: "Porsi 15 orang", description: "Ukuran lebih besar untuk acara keluarga" },
    ],
    notePlaceholder: "Contoh: tulisan kartu ucapan dan lauk ayam bakar",
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
    variants: [
      { id: "angka-15", label: "Bentuk Angka (Porsi 15+ orang)", description: "Untuk perayaan ulang tahun atau hari jadi" },
      { id: "angka-25", label: "Bentuk Angka Besar (Porsi 25+ orang)", description: "Untuk acara instansi, sekolah, atau lembaga" },
    ],
    notePlaceholder: "Tulis angka yang diinginkan (mis. 73, 17, 50)",
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
    variants: [
      { id: "standar-10", label: "Paket Standar (10 orang)", description: "Sate ayam bumbu kacang, lontong, dan acar" },
      { id: "besar-15", label: "Paket Besar (15+ orang)", description: "Jumlah tusuk sate dan lontong lebih banyak" },
    ],
    notePlaceholder: "Contoh: bumbu kacang dipisah, tingkat pedas sedang",
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
    variants: [
      { id: "porsi-6", label: "Tampah Kecil (5-6 orang)", description: "Pas untuk makan bersama keluarga di rumah" },
      { id: "porsi-10", label: "Tampah Sedang (10 orang)", description: "Favorit untuk arisan dan kumpul tim" },
      { id: "porsi-15", label: "Tampah Besar (15+ orang)", description: "Acara ramai, lauk dapat disesuaikan" },
    ],
    notePlaceholder: "Contoh: lalapan lengkap, sambal terasi sedang",
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
    variants: [
      { id: "ekor-standar", label: "1 Ekor Utuh (Standar)", description: "Ayam ingkung bakar bumbu gurih manis" },
      { id: "ekor-komplit", label: "1 Ekor Utuh + Sambal & Lalap", description: "Siap saji beralas daun pisang" },
    ],
    notePlaceholder: "Contoh: request ayam kampung atau bumbu agak pedas",
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
    variants: [
      { id: "paket-hemat", label: "Paket Hemat", description: "Nasi putih, ayam geprek krispi, sambal & lalap" },
      { id: "paket-reguler", label: "Paket Reguler", description: "Nasi, ayam geprek, tahu/tempe, sambal & lalap" },
      { id: "paket-spesial", label: "Paket Spesial / Komplit", description: "Tambahan sayur/mie, kerupuk & air mineral atau buah" },
    ],
    notePlaceholder: "Contoh: sambal dipisah dalam plastik/cup, level pedas sedang",
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
    variants: [
      { id: "paket-hemat", label: "Paket Hemat", description: "Nasi liwet daun pisang, ayam goreng & sambal" },
      { id: "paket-reguler", label: "Paket Reguler", description: "Nasi liwet, ayam goreng, mie goreng, orek tempe & sambal" },
      { id: "paket-spesial", label: "Paket Spesial / Komplit", description: "Paket lengkap dengan ikan asin kering, kerupuk & buah" },
    ],
    notePlaceholder: "Contoh: pakai ayam bakar atau ayam goreng",
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
    variants: [
      { id: "tart-sedang", label: "Pie Tart Ukuran Sedang", description: "Diameter loyang standar untuk keluarga" },
      { id: "tart-besar", label: "Pie Tart Ukuran Besar", description: "Cocok untuk hantaran atau perayaan bersama" },
      { id: "pie-mini-box", label: "Paket Pie Mini (Isi Box)", description: "Pie buah ukuran personal dalam kemasan box" },
    ],
    notePlaceholder: "Contoh: tulisan topper ucapan, tanpa kiwi",
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
    variants: [
      { id: "standar", label: "Ukuran Standar", description: "Pudding tumpeng berlapis dilengkapi vla" },
      { id: "besar", label: "Ukuran Besar / Multi-Layer", description: "Lapisan lebih tinggi dengan hiasan pudding tambahan" },
      { id: "custom-tema", label: "Custom Tema & Warna", description: "Warna dan tulisan ucapan sesuai tema acara" },
    ],
    notePlaceholder: "Contoh: dominan warna kuning-putih, pakai vla vanila",
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
    variants: [
      { id: "standar", label: "Ukuran Standar", description: "Cocok untuk perayaan ulang tahun keluarga" },
      { id: "besar-tingkat", label: "Ukuran Besar / Tingkat", description: "Ukuran besar atau susun tingkat untuk pesta" },
      { id: "custom-karakter", label: "Custom Karakter / Tema", description: "Dekorasi tema anak atau dewasa sesuai request" },
    ],
    notePlaceholder: "Contoh: rasa cokelat susu, tema bola, nama anak & usia",
    image: "/images/pudding-birthday.png",
    width: 1024,
    height: 1024,
  },
  {
    id: "tumpeng-buah",
    name: "Tumpeng Buah",
    category: "Kue, Pudding & Snack",
    portionInfo: "Rangkaian buah segar utuh",
    leadTime: "Pre-Order min. H-2",
    leadDays: 2,
    minOrder: 1,
    unitLabel: "paket",
    supportsGreetingCard: true,
    description:
      "Susunan aneka buah potong segar berbentuk tumpeng sebagai alternatif hantaran atau sajian penutup acara keluarga.",
    variants: [
      { id: "sedang", label: "Ukuran Sedang (10-12 orang)", description: "Pas untuk hantaran atau meja tamu" },
      { id: "besar", label: "Ukuran Besar (15-20 orang)", description: "Rangkaian lebih tinggi dengan variasi buah lebih banyak" },
    ],
    notePlaceholder: "Contoh: untuk acara lamaran/hantaran",
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
    variants: [
      { id: "isi-3", label: "Isi 3 Kue + Air Mineral", description: "Kombinasi kue manis dan gurih untuk rapat" },
      { id: "isi-4", label: "Isi 4 Kue + Air Mineral", description: "Isian lebih lengkap untuk pengajian dan tamu" },
      { id: "custom-isi", label: "Custom Pilihan Kue", description: "Jenis kue dapat ditulis di catatan pesanan" },
    ],
    notePlaceholder: "Contoh: isi risoles, lemper ayam, dan onde-onde",
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
  key: string;
  menuId: string;
  variantId: string;
  quantity: number;
  note?: string;
}

export function makeOrderItemKey(menuId: string, variantId: string): string {
  return `${menuId}::${variantId}`;
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
  form: PreOrderFormValues,
  options?: { isUrgentInquiry?: boolean; requiredLeadDays?: number }
): string {
  const isUrgent = Boolean(options?.isUrgentInquiry);
  const leadDays = options?.requiredLeadDays ?? 2;

  const resolvedItems = items
    .map((entry) => {
      const menu = MENU_ITEMS.find((m) => m.id === entry.menuId);
      if (!menu) return null;
      const variant =
        menu.variants.find((v) => v.id === entry.variantId) ?? menu.variants[0];
      return {
        menu,
        variant,
        quantity: entry.quantity,
        note: entry.note?.trim() ?? "",
      };
    })
    .filter(
      (
        entry
      ): entry is {
        menu: MenuItem;
        variant: MenuVariant;
        quantity: number;
        note: string;
      } => entry !== null
    );

  const lines: string[] = [
    isUrgent
      ? "Halo Dapoer Bulek, saya ingin menanyakan apakah masih memungkinkan untuk pesanan mendadak dengan detail berikut:"
      : "Halo Dapoer Bulek, saya ingin mengajukan Pre-Order catering dengan detail berikut:",
    "",
    `Nama Pemesan: ${form.customerName.trim() || "[Belum diisi]"}`,
    `Tanggal Acara: ${formatIndonesianDate(form.eventDate)}`,
    `Jam Acara / Siap Saji: ${form.eventTime.trim() ? `${form.eventTime.trim()} WIB` : "[Belum diisi]"}`,
    `Metode Pengambilan: ${
      form.deliveryMethod === "pickup"
        ? "Ambil di Dapur (Dayamurni, Tumijajar)"
        : "Antar ke Alamat (+ ongkos kirim)"
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
    resolvedItems.forEach(({ menu, variant, quantity, note }, index) => {
      lines.push(
        `${index + 1}. ${menu.name} (${variant.label}, ${quantity} ${menu.unitLabel}, min. H-${menu.leadDays})`
      );
      if (note) {
        lines.push(`   Catatan item: ${note}`);
      }
    });
  }

  if (form.greetingCardText.trim()) {
    lines.push("", `Ucapan Kartu / Topper: ${form.greetingCardText.trim()}`);
  }

  if (form.notes.trim()) {
    lines.push("", `Catatan Tambahan: ${form.notes.trim()}`);
  }

  lines.push("");
  if (isUrgent) {
    lines.push(
      `Catatan Jadwal: Tanggal acara berada di bawah ketentuan normal minimal H-${leadDays}. Mohon konfirmasi admin apakah slot dapur masih tersedia atau belum.`
    );
  }
  if (form.deliveryMethod === "delivery") {
    lines.push(
      "Catatan Ongkir: Ongkos kirim menyesuaikan jarak pengantaran dan tingkat kesulitan membawa pesanan."
    );
  }
  lines.push(
    "Mohon informasi rincian harga, ketersediaan jadwal, dan ketentuan DP. Terima kasih."
  );

  return lines.join("\n");
}

export type EventType = "syukuran" | "ulang-tahun" | "rapat" | "pengajian";

export interface EventPreference {
  includeMainDish: boolean;
  includeNasiKotak: boolean;
  includeSnackBox: boolean;
  includeDessert: boolean;
}

export interface RecommendedPackageItem {
  menu: MenuItem;
  variant: MenuVariant;
  quantity: number;
  reason: string;
}

export const EVENT_OPTIONS: {
  id: EventType;
  label: string;
  description: string;
}[] = [
  {
    id: "syukuran",
    label: "Syukuran / Selamatan",
    description: "Tumpeng, ayam ingkung, atau nasi kotak untuk tamu",
  },
  {
    id: "ulang-tahun",
    label: "Ulang Tahun",
    description: "Pudding cake custom, tumpeng, dan suguhan keluarga",
  },
  {
    id: "rapat",
    label: "Rapat / Acara Kantor",
    description: "Praktis dengan nasi kotak dan snack box kue",
  },
  {
    id: "pengajian",
    label: "Pengajian / Arisan",
    description: "Nasi liwet tampah, jajanan pasar, dan pie buah",
  },
];

function getMenuById(id: string): MenuItem {
  const found = MENU_ITEMS.find((m) => m.id === id);
  if (!found) {
    throw new Error(`Menu item not found: ${id}`);
  }
  return found;
}

export function buildEventRecommendation(
  eventType: EventType,
  guestCount: number,
  pref: EventPreference
): RecommendedPackageItem[] {
  const guests = Math.max(5, Math.min(300, Math.round(guestCount)));
  const result: RecommendedPackageItem[] = [];

  if (pref.includeMainDish) {
    if (eventType === "syukuran") {
      const tumpeng = getMenuById("tumpeng-nasi-kuning-klasik");
      const variant =
        guests <= 12
          ? tumpeng.variants[0]
          : guests <= 18
            ? tumpeng.variants[1]
            : tumpeng.variants[2];
      const qty = guests > 25 ? Math.ceil(guests / 15) : 1;
      result.push({
        menu: tumpeng,
        variant,
        quantity: qty,
        reason: `Sajian utama seremonial untuk sekitar ${guests} tamu (min. H-3)`,
      });

      if (guests >= 15) {
        const ingkung = getMenuById("ayam-ingkung-bakar");
        result.push({
          menu: ingkung,
          variant: ingkung.variants[1],
          quantity: 1,
          reason: "Lauk pelengkap tradisi syukuran atau selamatan",
        });
      }
    } else if (eventType === "pengajian") {
      const liwet = getMenuById("nasi-liwet-tampah-sunda");
      const variant =
        guests <= 8
          ? liwet.variants[0]
          : guests <= 14
            ? liwet.variants[1]
            : liwet.variants[2];
      const qty = guests > 20 ? Math.ceil(guests / 12) : 1;
      result.push({
        menu: liwet,
        variant,
        quantity: qty,
        reason: `Cocok untuk makan bersama sekitar ${guests} orang`,
      });
    } else if (eventType === "ulang-tahun") {
      const tumpengSate = getMenuById("tumpeng-sate-lontong");
      const variant =
        guests <= 12 ? tumpengSate.variants[0] : tumpengSate.variants[1];
      result.push({
        menu: tumpengSate,
        variant,
        quantity: guests > 25 ? Math.ceil(guests / 15) : 1,
        reason: "Sajian tumpeng favorit acara keluarga dan ulang tahun (min. H-3)",
      });
    } else {
      const liwet = getMenuById("nasi-liwet-tampah-sunda");
      const variant = guests <= 12 ? liwet.variants[1] : liwet.variants[2];
      result.push({
        menu: liwet,
        variant,
        quantity: guests > 25 ? Math.ceil(guests / 15) : 1,
        reason: `Hidangan makan bersama untuk sekitar ${guests} peserta`,
      });
    }
  }

  if (pref.includeNasiKotak) {
    const kotakMenu =
      eventType === "rapat"
        ? getMenuById("nasi-kotak-ayam-geprek")
        : getMenuById("nasi-kotak-nasi-liwet");
    const qty = Math.max(kotakMenu.minOrder, guests);
    const variant =
      eventType === "rapat" ? kotakMenu.variants[1] : kotakMenu.variants[2];
    result.push({
      menu: kotakMenu,
      variant,
      quantity: qty,
      reason:
        guests < kotakMenu.minOrder
          ? `Mengikuti ketentuan minimal order ${kotakMenu.minOrder} kotak`
          : `1 kotak untuk masing-masing ${qty} tamu`,
    });
  }

  if (pref.includeSnackBox) {
    const snackBox = getMenuById("snack-box-jajanan-pasar");
    const qty = Math.max(snackBox.minOrder, guests);
    const variant =
      eventType === "rapat" ? snackBox.variants[0] : snackBox.variants[1];
    result.push({
      menu: snackBox,
      variant,
      quantity: qty,
      reason:
        guests < snackBox.minOrder
          ? `Mengikuti ketentuan minimal order ${snackBox.minOrder} kotak`
          : `Suguhan ringan untuk ${qty} tamu`,
    });
  }

  if (pref.includeDessert) {
    if (eventType === "ulang-tahun") {
      const bday = getMenuById("pudding-cake-birthday");
      const variant = guests <= 20 ? bday.variants[0] : bday.variants[1];
      result.push({
        menu: bday,
        variant,
        quantity: 1,
        reason: "Pudding cake utama perayaan ulang tahun dengan desain custom",
      });
    } else if (eventType === "syukuran") {
      const tumpengPudding = getMenuById("tumpeng-pudding-cake");
      const variant =
        guests <= 20 ? tumpengPudding.variants[0] : tumpengPudding.variants[1];
      result.push({
        menu: tumpengPudding,
        variant,
        quantity: 1,
        reason: "Sajian pudding bentuk tumpeng untuk pelengkap acara",
      });
    } else {
      const pie = getMenuById("pie-buah-tart-custom");
      const variant = guests <= 15 ? pie.variants[0] : pie.variants[1];
      result.push({
        menu: pie,
        variant,
        quantity: 1,
        reason: `Sajian pie buah segar untuk meja tamu sekitar ${guests} orang`,
      });
    }
  }

  return result;
}
