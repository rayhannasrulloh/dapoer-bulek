"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Menu, MessageCircle, MapPin, Phone, X } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "Tentang Dapur", href: "#about" },
  { label: "Galeri", href: "#galeri" },
  { label: "Pre-Order & Lokasi", href: "#preorder" },
  { label: "Kontak", href: "#contact" },
];

type Category = "Semua" | "Tumpeng & Nasi" | "Sweet & Desserts" | "Jajanan Pasar";

const CATEGORIES: Category[] = [
  "Semua",
  "Tumpeng & Nasi",
  "Sweet & Desserts",
  "Jajanan Pasar",
];

interface MenuItem {
  name: string;
  category: Exclude<Category, "Semua">;
  portionInfo: string;
  leadTime: string;
  description: string;
  image: string;
  featured?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Tumpeng Nasi Kuning",
    category: "Tumpeng & Nasi",
    portionInfo: "Porsi 10-15 orang",
    leadTime: "Pre-Order min. H-3",
    description:
      "Nasi kuning pulen berbentuk kerucut dengan lauk lengkap: ayam goreng bumbu kuning, telur balado, perkedel kentang, tempe orek, urap sayur, dan sambal terasi.",
    image: "/images/tumpeng-nasi-kuning.png",
    featured: true,
  },
  {
    name: "Nasi Liwet Sunda",
    category: "Tumpeng & Nasi",
    portionInfo: "Sajian kelompok atau keluarga",
    leadTime: "Pre-Order min. H-2",
    description:
      "Nasi liwet gurih dengan ikan teri, daun salam, serai, lauk pendamping, dan sambal, ditata di atas alas daun pisang.",
    image: "/images/nasi-liwet-sunda.png",
  },
  {
    name: "Ayam Ingkung Bakar",
    category: "Tumpeng & Nasi",
    portionInfo: "1 ekor ayam kampung utuh",
    leadTime: "Pre-Order min. H-2",
    description:
      "Ayam kampung utuh dimasak ungkep dengan rempah tradisional lalu dibakar hingga kecokelatan untuk acara syukuran dan kenduri.",
    image: "/images/ayam-ingkung.png",
  },
  {
    name: "Nasi Kotak Acara",
    category: "Tumpeng & Nasi",
    portionInfo: "Minimal 20 kotak",
    leadTime: "Pre-Order min. H-2",
    description:
      "Paket nasi kotak praktis berisi nasi putih atau kuning, lauk ayam goreng, telur, sayur tumis, kerupuk, dan buah potong.",
    image: "/images/nasi-kotak.png",
  },
  {
    name: "Tumpeng Pudding Cake",
    category: "Sweet & Desserts",
    portionInfo: "Diameter loyang menyesuaikan",
    leadTime: "Pre-Order min. H-2",
    description:
      "Pudding berlapis berbentuk tumpeng dengan pilihan rasa dan warna yang dapat disesuaikan untuk selamatan maupun kejutan ulang tahun.",
    image: "/images/pudding-tumpeng.png",
  },
  {
    name: "Pudding Cake Birthday",
    category: "Sweet & Desserts",
    portionInfo: "Desain & ucapan custom",
    leadTime: "Pre-Order min. H-2",
    description:
      "Pudding ulang tahun dengan kombinasi vla dan dekorasi buah atau karakter sesuai permintaan tema acara.",
    image: "/images/pudding-birthday.png",
  },
  {
    name: "Pie Buah Segar",
    category: "Sweet & Desserts",
    portionInfo: "Isi per kotak menyesuaikan",
    leadTime: "Pre-Order min. H-2",
    description:
      "Kulit pie renyah dengan isian vla vanila lembut dan potongan buah segar di atasnya, cocok untuk hantaran maupun suguhan tamu.",
    image: "/images/pie-buah.png",
  },
  {
    name: "Tumpeng Buah",
    category: "Sweet & Desserts",
    portionInfo: "Rangkaian buah segar utuh",
    leadTime: "Pre-Order min. H-3",
    description:
      "Susunan aneka buah potong segar berbentuk tumpeng sebagai alternatif hantaran atau sajian penutup acara keluarga.",
    image: "/images/tumpeng-buah.png",
  },
  {
    name: "Snack Box Jajanan Pasar",
    category: "Jajanan Pasar",
    portionInfo: "Minimal 15 kotak",
    leadTime: "Pre-Order min. H-2",
    description:
      "Isian kue basah dan gurih pilihan seperti klepon, onde-onde, kue lapis, dadar gulung, lemper, dan risoles untuk rapat atau pengajian.",
    image: "/images/snack-box.png",
  },
];

const KITCHEN_STANDARDS = [
  {
    step: "01",
    title: "Dimasak Mendekati Jam Acara",
    detail:
      "Pesanan diproses berdasarkan sistem Pre-Order agar nasi, lauk, dan kue basah tiba dalam kondisi segar.",
  },
  {
    step: "02",
    title: "Bahan Pasar Harian",
    detail:
      "Ayam kampung, santan, rempah dapur, dan buah dipilih segar menyesuaikan jumlah porsi yang dipesan.",
  },
  {
    step: "03",
    title: "Penataan Rapi Siap Saji",
    detail:
      "Tumpeng, nasi liwet daun pisang, hingga kotak hantaran disusun rapi agar langsung siap dihidangkan di meja acara.",
  },
  {
    step: "04",
    title: "Jadwal Ambil atau Antar Jelas",
    detail:
      "Jam pengambilan di Dayamurni maupun pengantaran area Tumijajar disepakati langsung saat konfirmasi WhatsApp.",
  },
];

const GALLERY_HIGHLIGHTS = [
  {
    src: "/images/nasi-liwet-sunda.png",
    alt: "Sajian Nasi Liwet Sunda beralas daun pisang dari Dapoer Bulek",
    caption: "Nasi Liwet Sunda beralas daun pisang",
  },
  {
    src: "/images/pudding-tumpeng.png",
    alt: "Tumpeng Pudding Cake berlapis dengan hiasan buah segar",
    caption: "Tumpeng Pudding Cake untuk acara keluarga",
  },
  {
    src: "/images/snack-box.png",
    alt: "Snack Box berisi aneka kue tradisional klepon, lemper, dan risoles",
    caption: "Snack Box jajanan pasar untuk rapat & pengajian",
  },
];

const WHATSAPP_NUMBER = "6282193562480";
const INSTAGRAM_URL = "https://www.instagram.com/dapoerbule_354/";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Dapoer+Bulek+Dayamurni+Tumijajar+Tulang+Bawang+Barat+Lampung";

function getWhatsAppMenuLink(menuName: string): string {
  const text = `Halo Dapoer Bulek, saya ingin menanyakan harga, porsi, dan jadwal Pre-Order untuk ${menuName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function getWhatsAppGeneralLink(): string {
  const text =
    "Halo Dapoer Bulek, saya ingin berkonsultasi mengenai menu dan pemesanan catering.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-charcoal-border bg-charcoal/95 backdrop-blur-md"
          : "border-transparent bg-charcoal/90"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <a
            href="#home"
            className="inline-flex min-h-[44px] items-center gap-3 rounded-md pr-2 text-cream transition-colors hover:text-golden"
          >
            <Image
              src="/logo/logo.png"
              alt="Logo Dapoer Bulek"
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full object-contain"
              priority
            />
            <span className="font-serif text-lg font-bold tracking-tight text-cream sm:text-xl">
              Dapoer <span className="text-golden">Bulek</span>
            </span>
          </a>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[44px] items-center rounded-md px-3.5 text-sm font-medium text-ink-light-secondary transition-colors hover:text-golden"
              >
                {link.label}
              </a>
            ))}
            <a
              href={getWhatsAppGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Pesan WhatsApp
            </a>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md border border-charcoal-border bg-charcoal-surface px-3.5 text-sm font-medium text-cream transition-colors hover:border-golden hover:text-golden lg:hidden"
          >
            {mobileOpen ? (
              <>
                <X className="h-4 w-4" aria-hidden="true" />
                <span>Tutup</span>
              </>
            ) : (
              <>
                <Menu className="h-4 w-4" aria-hidden="true" />
                <span>Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Navigasi seluler"
          className="border-t border-charcoal-border bg-charcoal px-4 pb-6 pt-3 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-ink-light-secondary transition-colors hover:bg-charcoal-surface hover:text-golden"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={getWhatsAppGeneralLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-golden px-5 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-golden-dark"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Pesan via WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="bg-charcoal pb-14 pt-24 text-cream sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-golden">
              Dapur Rumahan di Dayamurni, Tumijajar sejak 2019
            </p>
            <div className="mt-3 h-0.5 w-14 bg-golden" aria-hidden="true" />

            <h1 className="mt-6 font-serif text-[clamp(2.125rem,4.5vw,3.625rem)] font-bold leading-[1.12] tracking-tight text-cream">
              Sajian Nusantara untuk Momen Keluarga dan Acara Anda
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-light-secondary sm:text-lg">
              Melayani pemesanan Pre-Order Tumpeng Nasi Kuning, Nasi Liwet Sunda,
              Ayam Ingkung Bakar, Nasi Kotak, Pudding Cake, dan Snack Box
              Jajanan Pasar untuk wilayah Tumijajar dan Tulang Bawang Barat.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#menu"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-golden px-7 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
              >
                Lihat Daftar Menu
              </a>
              <a
                href={getWhatsAppGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-charcoal-border bg-charcoal-surface px-6 py-3 text-base font-semibold text-cream transition-colors hover:border-golden hover:text-golden"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Konsultasi WhatsApp
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-charcoal-border pt-6 sm:grid-cols-3 sm:gap-6">
              <div>
                <dt className="text-xs font-medium text-ink-light-muted">
                  Sistem Pemesanan
                </dt>
                <dd className="mt-1 text-sm font-semibold text-cream">
                  Pre-Order H-2 dan H-3
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-light-muted">
                  Area Layanan
                </dt>
                <dd className="mt-1 text-sm font-semibold text-cream">
                  Tumijajar &amp; Tulang Bawang Barat
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-ink-light-muted">
                  Dokumentasi Menu
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-cream">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-my-2 inline-flex min-h-[44px] items-center text-golden underline-offset-4 hover:underline"
                  >
                    @dapoerbule_354
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-charcoal-border bg-charcoal-surface">
              <Image
                src="/images/hero-bg.png"
                alt="Hidangan tumpeng, lauk tradisional, dan jajanan pasar Dapoer Bulek di atas meja kayu"
                width={1024}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
                fetchPriority="high"
                className="aspect-square h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-cream-border bg-white">
      <div className="overflow-hidden border-b border-cream-border bg-cream-muted">
        <Image
          src={item.image}
          alt={item.name}
          width={1024}
          height={1024}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-square h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold text-amber-text-strong">
          {item.portionInfo} · {item.leadTime}
        </p>

        <h3 className="mt-2 font-serif text-xl font-bold text-charcoal">
          {item.name}
        </h3>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-dark-secondary">
          {item.description}
        </p>

        <a
          href={getWhatsAppMenuLink(item.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-golden px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Tanya &amp; Pesan via WhatsApp
        </a>
      </div>
    </article>
  );
}

function MenuCatalogSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("Semua");

  const filteredItems =
    activeCategory === "Semua"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const featuredItem =
    activeCategory === "Semua"
      ? filteredItems.find((item) => item.featured)
      : undefined;

  const gridItems = featuredItem
    ? filteredItems.filter((item) => item.name !== featuredItem.name)
    : filteredItems;

  return (
    <section
      id="menu"
      className="border-t border-cream-border bg-cream py-16 text-charcoal sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-cream-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-amber-text-strong">
              Katalog Hidangan
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight text-charcoal">
              Pilihan Menu Pre-Order
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-dark-secondary">
              Pilih kategori sajian untuk melihat detail isi dan waktu pesan
              minimal. Harga dan variasi lauk menyesuaikan jumlah porsi acara
              Anda.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori menu"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-[44px] rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
                    isSelected
                      ? "border-charcoal bg-charcoal text-cream"
                      : "border-cream-border bg-white text-ink-dark-secondary hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="mt-10 rounded-lg border border-cream-border bg-white p-8 text-center">
            <p className="text-base font-medium text-charcoal">
              Belum ada menu pada kategori ini.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("Semua")}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-md bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {featuredItem && (
              <article className="grid overflow-hidden rounded-xl border border-cream-border bg-white lg:grid-cols-12">
                <div className="bg-cream-muted lg:col-span-5">
                  <Image
                    src={featuredItem.image}
                    alt={featuredItem.name}
                    width={1024}
                    height={1024}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="aspect-square h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7 lg:p-10">
                  <p className="text-xs font-semibold text-amber-text-strong">
                    Menu Utama · {featuredItem.portionInfo} ·{" "}
                    {featuredItem.leadTime}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-charcoal sm:text-3xl">
                    {featuredItem.name}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-dark-secondary">
                    {featuredItem.description}
                  </p>
                  <p className="mt-4 text-sm text-ink-dark-muted">
                    Tersedia penyesuaian porsi dan permintaan lauk tambahan
                    untuk acara syukuran, peresmian, maupun ulang tahun.
                  </p>
                  <div className="mt-7">
                    <a
                      href={getWhatsAppMenuLink(featuredItem.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-golden px-7 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark sm:text-base"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Konsultasi &amp; Pesan Tumpeng
                    </a>
                  </div>
                </div>
              </article>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridItems.map((item) => (
                <MenuCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AboutKitchenSection() {
  return (
    <section
      id="about"
      className="bg-charcoal py-16 text-cream sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-golden">
              Dapur Kami Sejak 2019
            </p>
            <div className="mt-3 h-0.5 w-14 bg-golden" aria-hidden="true" />

            <h2 className="mt-5 font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight text-cream">
              Masakan Rumahan yang Disiapkan Khusus per Acara
            </h2>

            <p className="mt-5 text-base leading-relaxed text-ink-light-secondary">
              Berangkat dari dapur keluarga di Dayamurni, Tumijajar sejak 2019,
              Dapoer Bulek mengerjakan setiap pesanan secara langsung tanpa
              stok siap jadi yang menginap.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-light-secondary">
              Mulai dari nasi tumpeng untuk syukuran keluarga hingga paket snack
              box rapat kantor di Tulang Bawang Barat, seluruh detail lauk dan
              jadwal serah terima dibicarakan langsung bersama pemilik dapur.
            </p>
          </div>

          <div className="lg:col-span-7">
            <ol className="divide-y divide-charcoal-border border-y border-charcoal-border">
              {KITCHEN_STANDARDS.map((item) => (
                <li
                  key={item.step}
                  className="grid gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <div className="font-serif text-lg font-bold text-golden sm:col-span-2">
                    {item.step}
                  </div>
                  <div className="sm:col-span-10">
                    <h3 className="font-serif text-xl font-bold text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-light-secondary sm:text-base">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramGallerySection() {
  return (
    <section
      id="galeri"
      className="border-t border-cream-border bg-cream py-16 text-charcoal sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-amber-text-strong">
              Dokumentasi Pesanan Nyata
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.4vw,2.625rem)] font-bold leading-tight text-charcoal">
              Lihat Hasil Pesanan dan Sorotan Pelanggan di Instagram
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-dark-secondary">
              Dokumentasi pengiriman harian, variasi bentuk tumpeng pudding, dan
              tanggapan langsung dari pelanggan kami bagikan di akun resmi{" "}
              <span className="font-semibold text-charcoal">
                @dapoerbule_354
              </span>
              .
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-charcoal-surface sm:text-base"
              >
                <InstagramIcon className="h-4 w-4" />
                Buka @dapoerbule_354
              </a>
              <a
                href={getWhatsAppGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-cream-border bg-white px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal sm:text-base"
              >
                Cek Ketersediaan Tanggal
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
            {GALLERY_HIGHLIGHTS.map((photo) => (
              <figure
                key={photo.src}
                className="overflow-hidden rounded-lg border border-cream-border bg-white"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1024}
                  height={1024}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                  className="aspect-square h-auto w-full object-cover"
                />
                <figcaption className="px-3.5 py-3 text-xs font-medium leading-snug text-ink-dark-secondary">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreOrderLocationSection() {
  return (
    <section
      id="preorder"
      className="border-t border-cream-border bg-cream-muted py-16 text-charcoal sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-amber-text-strong">
              Ketentuan Pre-Order &amp; Lokasi
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.4vw,2.625rem)] font-bold leading-tight text-charcoal">
              Jadwal Pemesanan &amp; Area Dapur
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-dark-secondary">
              Pemesanan dilayani dengan sistem Pre-Order melalui WhatsApp agar
              setiap porsi terjamin kesiapan bahan dan waktunya.
            </p>

            <dl className="mt-7 divide-y divide-cream-border rounded-lg border border-cream-border bg-white px-5">
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm font-medium text-ink-dark-secondary">
                  Tumpeng Nasi Kuning &amp; Tumpeng Buah
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Minimal H-3
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm font-medium text-ink-dark-secondary">
                  Nasi Kotak (min. 20) &amp; Snack Box (min. 15)
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Minimal H-2
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm font-medium text-ink-dark-secondary">
                  Pudding Cake &amp; Pie Buah
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Minimal H-2
                </dd>
              </div>
            </dl>

            <div
              id="location"
              className="mt-6 rounded-lg border border-cream-border bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-5 w-5 shrink-0 text-amber-text-strong"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal">
                    Alamat Dapur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-dark-secondary">
                    Dayamurni, Kec. Tumijajar, Kab. Tulang Bawang Barat, Lampung
                  </p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-amber-text-strong underline underline-offset-4 hover:text-charcoal"
                  >
                    Buka Rute di Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-cream-border bg-white p-2">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d591.1478642283023!2d105.07461774540799!3d-4.6381027255981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3f4bcf1b7cf029%3A0xe61adf6a032d5bcf!2sDapoer%20Bule'!5e0!3m2!1sen!2sid!4v1793774700609!5m2!1sen!2sid"
                width={600}
                height={450}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Peta lokasi Dapoer Bulek di Dayamurni, Tumijajar"
                className="aspect-[4/3] w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer
      id="contact"
      className="border-t border-charcoal-border bg-charcoal text-cream"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-8 border-b border-charcoal-border pb-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-golden">
              Kontak Pemesanan
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-tight text-cream">
              Siap Menyiapkan Hidangan untuk Acara Anda
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-light-secondary">
              Hubungi kami lewat WhatsApp untuk menanyakan daftar harga terbaru,
              penyesuaian menu, dan ketersediaan jadwal pengantaran.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={getWhatsAppGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-golden px-7 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Chat WhatsApp (+62 821-9356-2480)
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/logo.png"
              alt="Logo Dapoer Bulek"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-contain"
            />
            <div>
              <p className="font-serif text-base font-bold text-cream">
                Dapoer <span className="text-golden">Bulek</span>
              </p>
              <p className="text-xs text-ink-light-muted">
                Dayamurni, Tumijajar, Tulang Bawang Barat
              </p>
            </div>
          </div>

          <nav aria-label="Navigasi footer" className="flex flex-wrap gap-2 sm:gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[44px] items-center px-2 text-sm text-ink-light-secondary transition-colors hover:text-golden"
              >
                {link.label}
              </a>
            ))}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 px-2 text-sm text-ink-light-secondary transition-colors hover:text-golden"
            >
              <InstagramIcon className="h-4 w-4" />
              @dapoerbule_354
            </a>
          </nav>

          <p className="text-xs text-ink-light-muted">
            &copy; 2019&ndash;{new Date().getFullYear()} Dapoer Bulek
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-golden focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-charcoal"
      >
        Langsung ke konten utama
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <MenuCatalogSection />
        <AboutKitchenSection />
        <InstagramGallerySection />
        <PreOrderLocationSection />
      </main>
      <FooterSection />
    </>
  );
}
