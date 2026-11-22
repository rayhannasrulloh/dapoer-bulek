"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Check, Menu, MessageCircle, MapPin, Phone, Plus, X } from "lucide-react";
import {
  CATEGORIES,
  Category,
  INSTAGRAM_URL,
  MAPS_URL,
  MENU_GROUPS,
  MENU_ITEMS,
  MenuItem,
  OrderSelectionItem,
  getWhatsAppGeneralLink,
  makeOrderItemKey,
} from "@/data/menu";
import { PreOrderBuilder } from "@/components/PreOrderBuilder";
import { MenuDetailModal } from "@/components/MenuDetailModal";
import { EventPackagePlanner } from "@/components/EventPackagePlanner";
import { FloatingOrderBar } from "@/components/FloatingOrderBar";

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
  { label: "Paket Acara", href: "#paket-acara" },
  { label: "Buat Pesanan", href: "#pesan" },
  { label: "Tentang Dapur", href: "#about" },
  { label: "Galeri", href: "#galeri" },
  { label: "Lokasi", href: "#preorder" },
  { label: "Kontak", href: "#contact" },
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
      "Ayam, santan, rempah dapur, dan buah dipilih segar menyesuaikan jumlah porsi yang dipesan.",
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

interface GalleryHighlight {
  src: string;
  width: number;
  height: number;
  objectPosition?: string;
  alt: string;
  caption: string;
}

const GALLERY_HIGHLIGHTS: GalleryHighlight[] = [
  {
    src: "/images/real-images/nasi-kotak-liwet2.jpg",
    width: 3000,
    height: 4000,
    objectPosition: "50% 50%",
    alt: "Susunan kotak Nasi Liwet dengan nasi bungkus daun pisang, ayam goreng, mie goreng, orek tempe, dan sambal",
    caption: "Pesanan Nasi Kotak Liwet siap dikemas rapi",
  },
  {
    src: "/images/real-images/tumpeng-sate-lontong.jpg",
    width: 4000,
    height: 2256,
    objectPosition: "49% 50%",
    alt: "Tumpeng Sate dan Lontong Dapoer Bulek dengan kartu ucapan ulang tahun keluarga",
    caption: "Tumpeng Sate & Lontong untuk kejutan keluarga",
  },
  {
    src: "/images/real-images/nasi-liwet.jpg",
    width: 1536,
    height: 1920,
    objectPosition: "50% 42%",
    alt: "Sajian Nasi Liwet Tampah beralas daun pisang dengan lauk ayam bakar, tahu, tempe, ikan asin, dan kemangi",
    caption: "Tampah Nasi Liwet Sunda beralas daun pisang",
  },
];

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

          <nav aria-label="Navigasi utama" className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[44px] items-center rounded-md px-2.5 text-sm font-medium text-ink-light-secondary transition-colors hover:text-golden xl:px-3.5"
              >
                {link.label}
              </a>
            ))}
            <a
              href={getWhatsAppGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-golden px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark xl:ml-3 xl:px-5"
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
              Melayani Tumpeng Nasi Kuning &amp; Uduk, Nasi Liwet, Nasi Kotak,
              Nasi Bento, Nasi Bakar, Rice Bowl, Mie Gacoan, aneka bakaran dan
              pepes, hingga Pie Buah, Pudding Tart, dan Snack Box untuk wilayah
              Tumijajar dan Tulang Bawang Barat.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#menu"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-golden px-7 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
              >
                Lihat Daftar Menu
              </a>
              <a
                href="#pesan"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-charcoal-border bg-charcoal-surface px-6 py-3 text-base font-semibold text-cream transition-colors hover:border-golden hover:text-golden"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Susun Format Pesanan
              </a>
            </div>

            <dl className="mt-10 grid grid-cols-1 gap-4 border-t border-charcoal-border pt-6 sm:grid-cols-3 sm:gap-6">
              <div>
                <dt className="text-xs font-medium text-ink-light-muted">
                  Sistem Pemesanan
                </dt>
                <dd className="mt-1 text-sm font-semibold text-cream">
                  Pre-Order H-2/H-3 &amp; Menu Harian
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

function MenuSpotlightCard({
  item,
  selectedQty,
  onAddItem,
  onOpenDetail,
}: {
  item: MenuItem;
  selectedQty: number;
  onAddItem: (menuId: string) => void;
  onOpenDetail: (item: MenuItem) => void;
}) {
  return (
    <article className="grid overflow-hidden rounded-xl border border-cream-border bg-white lg:grid-cols-12">
      {item.image && item.width && item.height ? (
        <button
          type="button"
          onClick={() => onOpenDetail(item)}
          aria-label={`Lihat detail dan pilihan varian ${item.name}`}
          className="block overflow-hidden border-b border-cream-border bg-cream-muted text-left lg:col-span-5 lg:border-b-0 lg:border-r"
        >
          <Image
            src={item.image}
            alt={item.name}
            width={item.width}
            height={item.height}
            sizes="(max-width: 1024px) 100vw, 42vw"
            style={
              item.objectPosition
                ? { objectPosition: item.objectPosition }
                : undefined
            }
            className="aspect-square h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </button>
      ) : (
        <div className="flex items-center justify-center border-b border-cream-border bg-cream-muted p-6 text-center lg:col-span-5 lg:border-b-0 lg:border-r">
          <p className="text-sm font-semibold text-ink-dark-muted">
            Foto menu segera menyusul
          </p>
        </div>
      )}
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7 lg:p-10">
        <p className="text-xs font-semibold text-amber-text-strong">
          Menu Utama · {item.portionInfo} · {item.leadTime} · {item.variants.length} varian
        </p>
        <h4 className="mt-2 font-serif text-2xl font-bold text-charcoal sm:text-3xl">
          {item.name}
        </h4>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-dark-secondary">
          {item.description}
        </p>
        {item.spotlightNote && (
          <p className="mt-4 text-sm text-ink-dark-muted">
            {item.spotlightNote}
          </p>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenDetail(item)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-[#78716C] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted sm:text-base"
          >
            Detail &amp; Pilih Varian
          </button>

          <button
            type="button"
            onClick={() => onAddItem(item.id)}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-golden px-7 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark sm:text-base"
          >
            {selectedQty > 0 ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>
                  Tambah Lagi ({selectedQty} {item.unitLabel} dipilih)
                </span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Tambah ke Format Pesanan</span>
              </>
            )}
          </button>

          {selectedQty > 0 && (
            <a
              href="#pesan"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#78716C] bg-white px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted"
            >
              Lihat Form Pesanan
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function MenuCard({
  item,
  aspectClass,
  sizes,
  selectedQty,
  onAddItem,
  onOpenDetail,
}: {
  item: MenuItem;
  aspectClass: string;
  sizes: string;
  selectedQty: number;
  onAddItem: (menuId: string) => void;
  onOpenDetail: (item: MenuItem) => void;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-cream-border bg-white">
      {item.image && item.width && item.height ? (
        <button
          type="button"
          onClick={() => onOpenDetail(item)}
          aria-label={`Lihat detail dan pilihan varian ${item.name}`}
          className="block w-full overflow-hidden border-b border-cream-border bg-cream-muted text-left"
        >
          <Image
            src={item.image}
            alt={item.name}
            width={item.width}
            height={item.height}
            sizes={sizes}
            style={
              item.objectPosition
                ? { objectPosition: item.objectPosition }
                : undefined
            }
            className={`${aspectClass} h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.03]`}
          />
        </button>
      ) : (
        <div className="flex items-center justify-between gap-2 border-b border-cream-border bg-cream-muted px-5 py-3 text-xs text-ink-dark-muted">
          <span className="font-medium">Foto menu segera menyusul</span>
          <span className="font-semibold text-amber-text-strong">
            {item.leadDays === 0 ? "Bisa Hari H" : `PO H-${item.leadDays}`}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-semibold text-amber-text-strong">
          {item.portionInfo} · {item.leadTime}
        </p>

        <h4 className="mt-2 font-serif text-xl font-bold text-charcoal">
          {item.name}
        </h4>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-dark-secondary">
          {item.description}
        </p>

        <p className="mt-3 text-xs font-medium text-ink-dark-muted">
          {item.variantSummary ??
            `${item.variants.length} pilihan varian · Harga dikonfirmasi via WA`}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onOpenDetail(item)}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-[#78716C] bg-white px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted"
          >
            Detail &amp; Pilih Varian
          </button>

          <button
            type="button"
            onClick={() => onAddItem(item.id)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-golden px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
          >
            {selectedQty > 0 ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>
                  Tambah Lagi ({selectedQty} {item.unitLabel})
                </span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Tambah ke Format Pesanan</span>
              </>
            )}
          </button>

          {selectedQty > 0 && (
            <a
              href="#pesan"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-[#78716C] bg-white px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted"
            >
              Lanjut ke Form Pesanan
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function MenuCatalogSection({
  selectedItems,
  onAddItem,
  onOpenDetail,
  onApplyPackage,
}: {
  selectedItems: OrderSelectionItem[];
  onAddItem: (menuId: string) => void;
  onOpenDetail: (item: MenuItem) => void;
  onApplyPackage: (
    entries: {
      menuId: string;
      variantId: string;
      quantity: number;
      note?: string;
    }[]
  ) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("Semua");

  const getQtyForMenu = (menuId: string): number => {
    return selectedItems
      .filter((entry) => entry.menuId === menuId)
      .reduce((total, entry) => total + entry.quantity, 0);
  };

  const visibleGroups =
    activeCategory === "Semua"
      ? MENU_GROUPS
      : MENU_GROUPS.filter((group) => group.id === activeCategory);

  const hasAnyItems = visibleGroups.some((group) =>
    MENU_ITEMS.some((item) => item.category === group.id)
  );

  return (
    <section
      id="menu"
      className="border-t border-cream-border bg-cream py-16 text-charcoal sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 border-b border-cream-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-amber-text-strong">
              Katalog Hidangan
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight text-charcoal">
              Pilihan Menu Pre-Order
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-dark-secondary">
              Pilih kategori sajian untuk melihat detail isi, porsi, dan waktu
              pesan minimal. Tambahkan satu atau beberapa menu ke format pesanan
              untuk dikirim lewat WhatsApp.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori menu"
            className="flex flex-wrap gap-2 lg:shrink-0"
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
                      : "border-[#78716C] bg-white text-ink-dark-secondary hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-charcoal bg-cream-muted px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-charcoal">
              <span className="font-bold">
                {selectedItems.length} jenis menu
              </span>{" "}
              sudah masuk ke format pesanan Pre-Order Anda.
            </p>
            <a
              href="#pesan"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-charcoal px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-charcoal-surface"
            >
              Isi Jadwal &amp; Kirim Format
            </a>
          </div>
        )}

        {!hasAnyItems ? (
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
          <div className="mt-12 space-y-16">
            {visibleGroups.map((group) => {
              const itemsInGroup = MENU_ITEMS.filter(
                (item) => item.category === group.id
              );
              const spotlightItem = itemsInGroup.find((item) => item.featured);
              const gridItems = spotlightItem
                ? itemsInGroup.filter((item) => item.name !== spotlightItem.name)
                : itemsInGroup;
              const isFourColDesktop = group.desktopGridClass.includes(
                "lg:grid-cols-4"
              );
              const cardSizes = isFourColDesktop
                ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

              return (
                <div key={group.id} className="space-y-8">
                  <div className="flex flex-col gap-2 border-b border-cream-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-amber-text-strong">
                        {group.number} · {itemsInGroup.length} pilihan menu
                      </p>
                      <h3 className="mt-1 font-serif text-2xl font-bold text-charcoal sm:text-[1.75rem]">
                        {group.title}
                      </h3>
                    </div>
                    <p className="max-w-md text-sm leading-relaxed text-ink-dark-secondary">
                      {group.subtitle}
                    </p>
                  </div>

                  {spotlightItem && (
                    <MenuSpotlightCard
                      item={spotlightItem}
                      selectedQty={getQtyForMenu(spotlightItem.id)}
                      onAddItem={onAddItem}
                      onOpenDetail={onOpenDetail}
                    />
                  )}

                  {gridItems.length > 0 && (
                    <div className={`grid ${group.desktopGridClass}`}>
                      {gridItems.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          aspectClass={group.aspectClass}
                          sizes={cardSizes}
                          selectedQty={getQtyForMenu(item.id)}
                          onAddItem={onAddItem}
                          onOpenDetail={onOpenDetail}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <EventPackagePlanner onApplyPackage={onApplyPackage} />
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
              Dokumentasi pengiriman harian, variasi tumpeng custom, hingga
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
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#78716C] bg-white px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal sm:text-base"
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
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                  style={
                    photo.objectPosition
                      ? { objectPosition: photo.objectPosition }
                      : undefined
                  }
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
                  Tumpeng Nasi Kuning, Liwet Custom &amp; Tumpeng Sate
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Minimal H-3
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm font-medium text-ink-dark-secondary">
                  Ayam Ingkung, Nasi Kotak (min. 20) &amp; Snack Box (min. 15)
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Minimal H-2
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm font-medium text-ink-dark-secondary">
                  Pie Buah Tart, Pudding Tart/Cake &amp; Tumpeng Buah
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Minimal H-2
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm font-medium text-ink-dark-secondary">
                  Nasi Bakar, Rice Bowl, Bento, Mie Gacoan &amp; Lauk Harian
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Bisa Hari H (H-1 bila stok kosong)
                </dd>
              </div>
              <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <dt className="text-sm font-medium text-ink-dark-secondary">
                  Pengambilan &amp; Pengantaran
                </dt>
                <dd className="text-sm font-semibold text-charcoal">
                  Ambil atau antar (+ ongkir sesuai jarak &amp; kondisi)
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-ink-dark-muted">
              Pesanan mendadak di bawah H-2 atau H-3 tetap bisa ditanyakan ke
              WhatsApp, namun ketersediaan slot menunggu konfirmasi dapur.
            </p>

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
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
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

const ORDER_STORAGE_KEY = "dapoer-bulek-order-v1";
const ORDER_CHANGE_EVENT = "dapoer-bulek-order-change";
const EMPTY_ORDER: OrderSelectionItem[] = [];

let cachedOrderRaw: string | null = null;
let cachedOrderItems: OrderSelectionItem[] = EMPTY_ORDER;
let orderStorageUnavailable = false;

function readOrderStorage(): OrderSelectionItem[] {
  if (typeof window === "undefined") return EMPTY_ORDER;
  if (orderStorageUnavailable) return cachedOrderItems;
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (raw === cachedOrderRaw) return cachedOrderItems;
    cachedOrderRaw = raw;
    if (!raw) {
      cachedOrderItems = EMPTY_ORDER;
      return cachedOrderItems;
    }
    const parsed = JSON.parse(raw);
    cachedOrderItems = Array.isArray(parsed)
      ? (parsed as OrderSelectionItem[])
      : EMPTY_ORDER;
    return cachedOrderItems;
  } catch {
    orderStorageUnavailable = true;
    return cachedOrderItems;
  }
}

function writeOrderStorage(next: OrderSelectionItem[]) {
  const raw = JSON.stringify(next);
  cachedOrderRaw = raw;
  cachedOrderItems = next;
  if (typeof window === "undefined") return;
  if (!orderStorageUnavailable) {
    try {
      window.localStorage.setItem(ORDER_STORAGE_KEY, raw);
    } catch {
      orderStorageUnavailable = true;
    }
  }
  window.dispatchEvent(new Event(ORDER_CHANGE_EVENT));
}

function subscribeOrderStorage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onLocal = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === ORDER_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener(ORDER_CHANGE_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(ORDER_CHANGE_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerOrderSnapshot(): OrderSelectionItem[] {
  return EMPTY_ORDER;
}

function upsertOrderEntries(
  current: OrderSelectionItem[],
  entries: {
    menuId: string;
    variantId?: string;
    quantity?: number;
    note?: string;
  }[]
): OrderSelectionItem[] {
  const next = [...current];

  for (const entry of entries) {
    const menu = MENU_ITEMS.find((item) => item.id === entry.menuId);
    if (!menu) continue;

    const variantId = entry.variantId || menu.variants[0]?.id || "default";
    const key = makeOrderItemKey(menu.id, variantId);
    const addQty = entry.quantity ?? menu.minOrder;
    const trimmedNote = entry.note?.trim() ?? "";

    const existingIdx = next.findIndex((item) => item.key === key);
    if (existingIdx !== -1) {
      const existing = next[existingIdx];
      const increment = entry.quantity ?? 1;
      const mergedNote =
        trimmedNote && trimmedNote !== existing.note
          ? existing.note
            ? `${existing.note}; ${trimmedNote}`
            : trimmedNote
          : existing.note;

      next[existingIdx] = {
        ...existing,
        quantity: existing.quantity + increment,
        note: mergedNote,
      };
    } else {
      next.push({
        key,
        menuId: menu.id,
        variantId,
        quantity: Math.max(menu.minOrder, addQty),
        note: trimmedNote || undefined,
      });
    }
  }

  return next;
}

export default function Home() {
  const selectedItems = useSyncExternalStore(
    subscribeOrderStorage,
    readOrderStorage,
    getServerOrderSnapshot
  );
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);

  const handleAddItem = (menuId: string) => {
    writeOrderStorage(upsertOrderEntries(readOrderStorage(), [{ menuId }]));
  };

  const handleAddDetailedItem = (payload: {
    menuId: string;
    variantId: string;
    quantity: number;
    note: string;
    scrollToForm?: boolean;
  }) => {
    writeOrderStorage(upsertOrderEntries(readOrderStorage(), [payload]));
    if (payload.scrollToForm) {
      document.getElementById("pesan")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyPackage = (
    entries: {
      menuId: string;
      variantId: string;
      quantity: number;
      note?: string;
    }[]
  ) => {
    writeOrderStorage(upsertOrderEntries(readOrderStorage(), entries));
  };

  const handleUpdateQuantity = (itemKey: string, quantity: number) => {
    writeOrderStorage(
      readOrderStorage().map((entry) =>
        entry.key === itemKey ? { ...entry, quantity } : entry
      )
    );
  };

  const handleUpdateVariant = (itemKey: string, nextVariantId: string) => {
    const current = readOrderStorage();
    const target = current.find((entry) => entry.key === itemKey);
    if (!target || target.variantId === nextVariantId) return;

    const nextKey = makeOrderItemKey(target.menuId, nextVariantId);
    const duplicateIdx = current.findIndex((entry) => entry.key === nextKey);

    if (duplicateIdx !== -1) {
      const merged = current
        .filter((entry) => entry.key !== itemKey)
        .map((entry) =>
          entry.key === nextKey
            ? {
                ...entry,
                quantity: entry.quantity + target.quantity,
                note:
                  target.note && target.note !== entry.note
                    ? entry.note
                      ? `${entry.note}; ${target.note}`
                      : target.note
                    : entry.note,
              }
            : entry
        );
      writeOrderStorage(merged);
      return;
    }

    writeOrderStorage(
      current.map((entry) =>
        entry.key === itemKey
          ? { ...entry, key: nextKey, variantId: nextVariantId }
          : entry
      )
    );
  };

  const handleUpdateNote = (itemKey: string, note: string) => {
    writeOrderStorage(
      readOrderStorage().map((entry) =>
        entry.key === itemKey ? { ...entry, note } : entry
      )
    );
  };

  const handleRemoveItem = (itemKey: string) => {
    writeOrderStorage(
      readOrderStorage().filter((entry) => entry.key !== itemKey)
    );
  };

  const handleClearItems = () => {
    writeOrderStorage(EMPTY_ORDER);
  };

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
        <MenuCatalogSection
          selectedItems={selectedItems}
          onAddItem={handleAddItem}
          onOpenDetail={setDetailItem}
          onApplyPackage={handleApplyPackage}
        />
        <PreOrderBuilder
          selectedItems={selectedItems}
          onAddItem={handleAddItem}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdateVariant={handleUpdateVariant}
          onUpdateNote={handleUpdateNote}
          onRemoveItem={handleRemoveItem}
          onClearItems={handleClearItems}
        />
        <AboutKitchenSection />
        <InstagramGallerySection />
        <PreOrderLocationSection />
      </main>
      <FooterSection />
      <MenuDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onAddToOrder={handleAddDetailedItem}
      />
      <FloatingOrderBar
        selectedCount={selectedItems.length}
        hidden={Boolean(detailItem)}
      />
    </>
  );
}
