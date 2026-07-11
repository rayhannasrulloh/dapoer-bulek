"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  Award,
  Heart,
  Users,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  Leaf,
} from "lucide-react";

/* Custom Instagram SVG icon (lucide-react removed brand icons) */
function Instagram({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/* ─────────────────────────── DATA ─────────────────────────── */

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "Tentang Kami", href: "#about" },
  { label: "Testimoni", href: "#testimonials" },
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
  category: Category;
  tag: string;
  description: string;
  image: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: "Tumpeng Nasi Kuning Premium",
    category: "Tumpeng & Nasi",
    tag: "Porsi 10-15 Orang",
    description:
      "Nasi kuning berbentuk tumpeng kerucut dengan lauk lengkap: ayam goreng, telur balado, perkedel, urap sayur, dan sambal.",
    image: "/images/tumpeng-nasi-kuning.png",
  },
  {
    name: "Nasi Liwet Sunda",
    category: "Tumpeng & Nasi",
    tag: "Terlaris",
    description:
      "Nasi liwet pulen khas Sunda dengan ikan teri, labu siam, dan sambal terasi, disajikan di atas daun pisang.",
    image: "/images/nasi-liwet-sunda.png",
  },
  {
    name: "Ayam Ingkung Bakar",
    category: "Tumpeng & Nasi",
    tag: "Spesial",
    description:
      "Ayam kampung utuh dimasak ingkung dengan rempah tradisional lalu dibakar hingga kecokelatan, disajikan untuk acara syukuran.",
    image: "/images/ayam-ingkung.png",
  },
  {
    name: "Nasi Kotak Acara",
    category: "Tumpeng & Nasi",
    tag: "Min. 20 Box",
    description:
      "Paket nasi kotak lengkap untuk acara: nasi putih/kuning, ayam goreng, telur, sayur, kerupuk, dan buah.",
    image: "/images/nasi-kotak.png",
  },
  {
    name: "Tumpeng Pudding Cake",
    category: "Sweet & Desserts",
    tag: "Best Seller",
    description:
      "Pudding berbentuk tumpeng dengan lapisan warna-warni cantik, cocok sebagai pengganti kue tart untuk acara spesial.",
    image: "/images/pudding-tumpeng.png",
  },
  {
    name: "Pudding Cake Birthday",
    category: "Sweet & Desserts",
    tag: "Custom Design",
    description:
      "Pudding cake ulang tahun dengan desain custom, pilihan rasa beragam dan dekorasi cantik sesuai tema.",
    image: "/images/pudding-birthday.png",
  },
  {
    name: "Pie Buah Segar",
    category: "Sweet & Desserts",
    tag: "Favorit",
    description:
      "Pie dengan kulit renyah berisi vla lembut ditata rapi dengan buah-buahan segar pilihan, glazur mengkilap.",
    image: "/images/pie-buah.png",
  },
  {
    name: "Tumpeng Buah",
    category: "Sweet & Desserts",
    tag: "Unik & Sehat",
    description:
      "Rangkaian buah segar premium ditata membentuk tumpeng cantik, pilihan sehat untuk acara dan hantaran.",
    image: "/images/tumpeng-buah.png",
  },
  {
    name: "Aneka Kue Tradisional (Snack Box)",
    category: "Jajanan Pasar",
    tag: "Min. 15 Box",
    description:
      "Paket snack box berisi aneka kue tradisional: klepon, onde-onde, kue lapis, dadar gulung, lemper, dan risoles.",
    image: "/images/snack-box.png",
  },
];

const TESTIMONIALS = [
  {
    name: "Ibu Sari",
    location: "Tumijajar",
    rating: 5,
    text: "Tumpengnya cantik banget dan rasanya autentik! Tamu-tamu acara syukuran semua memuji. Pasti pesan lagi.",
  },
  {
    name: "Bapak Rendi",
    location: "Dayamurni",
    rating: 5,
    text: "Nasi liwet Sunda-nya juara! Rasa liwetnya berasa banget. Sudah 3 kali pesan untuk acara kantor.",
  },
  {
    name: "Mbak Fitri",
    location: "Tulang Bawang Barat",
    rating: 5,
    text: "Pudding Cake Birthday-nya bikin anak saya senang! Desainnya lucu dan rasanya enak. Terima kasih Dapoer Bulek!",
  },
  {
    name: "Ibu Dewi",
    location: "Tumijajar",
    rating: 5,
    text: "Snack box untuk rapat kantor selalu rapih dan enak. Pengiriman tepat waktu. Sangat recommended!",
  },
  {
    name: "Pak Agus",
    location: "Dayamurni",
    rating: 5,
    text: "Pie buahnya segar dan cantik! Cocok banget untuk hantaran. Keluarga mertua sangat suka.",
  },
  {
    name: "Mbak Rina",
    location: "Gunung Terang",
    rating: 5,
    text: "Ayam Ingkung Bakar untuk acara tujuh bulanan luar biasa! Rempahnya meresap sempurna. The best!",
  },
];

const WHATSAPP_NUMBER = "6282193562480";

function getWhatsAppLink(menuName: string): string {
  const text = `Halo Dapoer Bulek, saya tertarik memesan ${menuName}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function getWhatsAppGeneral(): string {
  const text = "Halo Dapoer Bulek, saya ingin bertanya tentang menu dan pemesanan.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* ──────────────────── INTERSECTION OBSERVER HOOK ──────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ─────────────────────────── NAVBAR ─────────────────────────── */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-charcoal/95 backdrop-blur-xl"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand */}
          <a
            href="#home"
            className="group flex items-center gap-3"
          >
            <img
              src="/logo/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="font-[var(--font-playfair)] text-xl font-bold tracking-wide text-cream">
              Dapoer <span className="text-golden">Bulek</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-cream/70 transition-colors duration-300 hover:text-golden after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-golden after:transition-all after:duration-300 hover:after:w-6"
              >
                {link.label}
              </a>
            ))}
            <a
              href={getWhatsAppGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-golden to-golden-dark px-5 py-2.5 text-sm font-semibold text-charcoal transition-all duration-300 hover:scale-105"
            >
              <Phone className="h-4 w-4" />
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-cream transition-colors hover:text-golden md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-charcoal/98 backdrop-blur-xl px-4 pb-6 pt-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-cream/70 transition-colors hover:bg-cream/5 hover:text-golden"
            >
              {link.label}
            </a>
          ))}
          <a
            href={getWhatsAppGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-golden to-golden-dark px-5 py-3 text-base font-semibold text-charcoal"
          >
            <Phone className="h-4 w-4" />
            Hubungi Kami
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.png"
          alt="Dapoer Bulek catering"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-golden/5 blur-[120px]" />
      <div className="absolute -left-20 bottom-1/4 h-72 w-72 rounded-full bg-golden/8 blur-[100px]" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full bg-golden/10 px-4 py-2 backdrop-blur-sm transition-all duration-700 ${isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
              }`}
          >
            <span className="text-sm font-medium text-golden">
              Dipercaya Sejak 2019
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`font-[var(--font-playfair)] text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl lg:text-6xl transition-all duration-700 delay-150 ${isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
              }`}
          >
            Sajian{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-golden via-golden-light to-golden bg-clip-text text-transparent">
                Istimewa
              </span>
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-golden to-golden-dark opacity-50" />
            </span>{" "}
            untuk Momen Berharga Anda
          </h1>

          {/* Subheadline */}
          <p
            className={`mt-6 max-w-lg text-lg leading-relaxed text-cream/70 transition-all duration-700 delay-300 ${isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
              }`}
          >
            Melayani pemesanan{" "}
            <span className="font-semibold text-cream">Tumpeng</span>,{" "}
            <span className="font-semibold text-cream">Nasi Liwet</span>,{" "}
            <span className="font-semibold text-cream">Pudding Cake</span>, dan{" "}
            <span className="font-semibold text-cream">Jajanan Pasar</span>{" "}
            premium untuk wilayah Dayamurni, Tumijajar, dan sekitarnya.
          </p>

          {/* CTAs */}
          <div
            className={`mt-10 flex flex-wrap items-center gap-4 transition-all duration-700 delay-[450ms] ${isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
              }`}
          >
            <a
              href="#menu"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-golden to-golden-dark px-7 py-4 text-base font-semibold text-charcoal transition-all duration-300 hover:scale-105"
            >
              Lihat Menu & Pesan
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={getWhatsAppGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cream/5 px-7 py-4 text-base font-semibold text-cream backdrop-blur-sm transition-all duration-300 hover:bg-golden/10 hover:text-golden"
            >
              <MessageCircle className="h-5 w-5" />
              Chat WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div
            className={`mt-16 flex items-center gap-8 sm:gap-12 transition-all duration-700 delay-[600ms] ${isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
              }`}
          >
            {[
              { value: "6+", label: "Tahun Melayani" },
              { value: "500+", label: "Pesanan" },
              { value: "100%", label: "Kepuasan" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-[var(--font-playfair)] text-2xl font-bold text-golden sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-cream/50 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <a href="#menu" className="flex flex-col items-center gap-2 text-cream/40 transition-colors hover:text-golden">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────── MENU CATALOG ─────────────────────── */

function MenuCatalog() {
  const [activeCategory, setActiveCategory] = useState<Category>("Semua");
  const { ref, isVisible } = useInView(0.05);

  const filteredItems =
    activeCategory === "Semua"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" ref={ref} className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/30 to-charcoal" />
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-golden/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-golden/10 px-4 py-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5 text-golden" />
            <span className="text-xs font-semibold tracking-wider text-golden uppercase">
              Menu Pilihan
            </span>
          </div>
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-cream sm:text-4xl lg:text-5xl">
            Katalog Menu <span className="text-golden">Kami</span>
          </h2>
          <p className="mt-4 text-base text-cream/60 sm:text-lg">
            Pilih sajian favorit Anda. Setiap hidangan dibuat dengan bahan segar
            dan penuh cinta.
          </p>
        </div>

        {/* Category Tabs */}
        <div
          className={`mt-12 flex flex-wrap justify-center gap-2 sm:gap-3 transition-all duration-700 delay-200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${activeCategory === cat
                  ? "bg-gradient-to-r from-golden to-golden-dark text-charcoal"
                  : "bg-cream/5 text-cream/60 hover:text-golden"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <MenuCard key={item.name} item={item} index={index} parentVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MenuCard({
  item,
  index,
  parentVisible,
}: {
  item: MenuItem;
  index: number;
  parentVisible: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-charcoal-light/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 ${parentVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0"
        }`}
      style={{ transitionDelay: parentVisible ? `${300 + index * 100}ms` : "0ms" }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

        {/* Tag */}
        <div className="absolute right-3 top-3 rounded-full bg-golden/90 px-3 py-1 text-xs font-bold text-charcoal backdrop-blur-sm">
          {item.tag}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-[var(--font-playfair)] text-lg font-bold text-cream transition-colors group-hover:text-golden">
          {item.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-cream/50">
          {item.description}
        </p>
        <a
          href={getWhatsAppLink(item.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-golden to-golden-dark px-4 py-3 text-sm font-semibold text-charcoal transition-all duration-300 hover:scale-[1.02]"
        >
          <MessageCircle className="h-4 w-4" />
          Pesan via WhatsApp
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────── ABOUT US ─────────────────────── */

function AboutSection() {
  const { ref, isVisible } = useInView(0.1);

  const features = [
    {
      icon: ShieldCheck,
      title: "Higienis & Bersih",
      description: "Proses masak dalam dapur bersih dengan standar kebersihan tinggi.",
    },
    {
      icon: Leaf,
      title: "Bahan Premium",
      description: "Menggunakan bahan-bahan segar dan bumbu pilihan berkualitas terbaik.",
    },
    {
      icon: Award,
      title: "Presentasi Cantik",
      description: "Setiap hidangan ditata dengan estetika tinggi untuk momen spesial Anda.",
    },
    {
      icon: CalendarCheck,
      title: "Tepat Waktu",
      description: "Komitmen pengiriman tepat waktu sesuai jadwal acara Anda.",
    },
  ];

  return (
    <section id="about" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal" />
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-golden/3 blur-[150px]" />
      <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-golden/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left — Text */}
          <div
            className={`transition-all duration-700 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-golden/10 px-4 py-1.5">
              <Heart className="h-3.5 w-3.5 text-golden" />
              <span className="text-xs font-semibold tracking-wider text-golden uppercase">
                Tentang Kami
              </span>
            </div>

            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-cream sm:text-4xl lg:text-5xl">
              Cita Rasa <span className="text-golden">Rumahan</span>,{" "}
              <br className="hidden sm:block" />
              Kualitas Premium
            </h2>

            <p className="mt-6 text-base leading-relaxed text-cream/60 sm:text-lg">
              <span className="font-semibold text-cream">Dapoer Bulek</span> hadir
              sejak <span className="text-golden font-semibold">2019</span> sebagai
              pilihan catering terpercaya di Tulang Bawang Barat. Berawal dari dapur
              rumahan di Dayamurni, kami berkomitmen menyajikan hidangan yang tidak
              hanya lezat, tetapi juga memiliki tampilan yang memukau.
            </p>
            <p className="mt-4 text-base leading-relaxed text-cream/60 sm:text-lg">
              Setiap pesanan kami tangani dengan sepenuh hati — dari pemilihan bahan
              segar hingga penataan yang estetik. Karena kami percaya, setiap momen
              berharga Anda layak mendapatkan sajian istimewa.
            </p>

            {/* Stats row */}
            <div className="mt-10 flex items-center gap-8">
              {[
                { icon: Users, value: "500+", label: "Pelanggan Puas" },
                { icon: Award, value: "6+", label: "Tahun Pengalaman" },
                { icon: Star, value: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-golden/10">
                    <stat.icon className="h-5 w-5 text-golden" />
                  </div>
                  <div>
                    <div className="font-[var(--font-playfair)] text-xl font-bold text-cream">
                      {stat.value}
                    </div>
                    <div className="text-xs text-cream/50">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Feature Cards */}
          <div
            className={`grid gap-4 sm:grid-cols-2 transition-all duration-700 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
          >
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-2xl bg-charcoal-light/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-charcoal-light/80"
                style={{ transitionDelay: `${400 + i * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-golden/20 to-golden/5 transition-colors group-hover:from-golden/30 group-hover:to-golden/10">
                  <feature.icon className="h-6 w-6 text-golden" />
                </div>
                <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-cream">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/50">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── TESTIMONIALS ─────────────────── */

function TestimonialsSection() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section id="testimonials" ref={ref} className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal" />
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-golden/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-golden/10 px-4 py-1.5">
            <Star className="h-3.5 w-3.5 text-golden" />
            <span className="text-xs font-semibold tracking-wider text-golden uppercase">
              Testimoni
            </span>
          </div>
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-cream sm:text-4xl lg:text-5xl">
            Apa Kata <span className="text-golden">Mereka?</span>
          </h2>
          <p className="mt-4 text-base text-cream/60 sm:text-lg">
            Kepercayaan pelanggan adalah kebanggaan terbesar kami.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={testimonial.name}
              className={`group rounded-2xl bg-charcoal-light/40 p-6 backdrop-blur-sm transition-all duration-500 ${isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
                }`}
              style={{ transitionDelay: isVisible ? `${200 + i * 100}ms` : "0ms" }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-golden text-golden"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 text-sm leading-relaxed text-cream/70 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-golden to-golden-dark text-sm font-bold text-charcoal">
                  {testimonial.name.charAt(0)}
                  {testimonial.name.split(" ")[1]?.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-cream">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-cream/40">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Banner */}
        <div
          className={`mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-charcoal-light via-charcoal-lighter/50 to-charcoal-light p-8 sm:p-12 transition-all duration-700 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E1306C] via-[#F77737] to-[#FCAF45]">
              <Instagram className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-[var(--font-playfair)] text-xl font-bold text-cream sm:text-2xl">
                Follow Kami di Instagram
              </h3>
              <p className="mt-1 text-sm text-cream/60 sm:text-base">
                Lihat update menu terbaru, behind the scenes, dan promo spesial di{" "}
                <span className="font-semibold text-golden">@dapoerbule_354</span>
              </p>
            </div>
            <a
              href="https://www.instagram.com/dapoerbule_354/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E1306C] via-[#F77737] to-[#FCAF45] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            >
              <Instagram className="h-4 w-4" />
              Kunjungi Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── FOOTER / CONTACT ─────────────────── */

function Footer() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden">
      {/* Top separator */}
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-golden/20 to-transparent" />

      {/* Contact CTA Section */}
      <div className="relative bg-charcoal py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-golden/5 via-transparent to-transparent" />

        <div
          className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          {/* CTA Banner */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-golden/10 px-4 py-1.5">
              <Phone className="h-3.5 w-3.5 text-golden" />
              <span className="text-xs font-semibold tracking-wider text-golden uppercase">
                Hubungi Kami
              </span>
            </div>
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-cream sm:text-4xl">
              Siap Memesan untuk <span className="text-golden">Acara Anda?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-cream/60">
              Hubungi kami via WhatsApp untuk konsultasi menu, harga, dan
              pemesanan. Kami siap membantu!
            </p>
            <a
              href={getWhatsAppGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-golden to-golden-dark px-8 py-4 text-base font-semibold text-charcoal transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              Chat via WhatsApp
            </a>
          </div>

          {/* Info Cards */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {/* Operational Info */}
            <div className="rounded-2xl bg-charcoal-light/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-golden/10">
                <Clock className="h-6 w-6 text-golden" />
              </div>
              <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-cream">
                Info Pemesanan
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-cream/60">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                  Pemesanan Tumpeng Besar: minimal H-3
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                  Nasi Kotak & Snack Box: minimal H-2
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                  Pudding & Kue: minimal H-2
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                  Sistem: Pre-Order (PO) via WhatsApp
                </li>
              </ul>
            </div>

            {/* Address */}
            <div className="rounded-2xl bg-charcoal-light/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-golden/10">
                <MapPin className="h-6 w-6 text-golden" />
              </div>
              <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-cream">
                Lokasi Kami
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">
                Dayamurni, Tumijajar,
                <br />
                Tulang Bawang Barat,
                <br />
                Lampung, Indonesia
              </p>
              <p className="mt-3 text-sm text-cream/40">
                Area layanan: Tumijajar dan sekitarnya
              </p>
            </div>

            {/* Social & Contact */}
            <div className="rounded-2xl bg-charcoal-light/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-golden/10">
                <MessageCircle className="h-6 w-6 text-golden" />
              </div>
              <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-cream">
                Kontak & Sosial Media
              </h3>
              <div className="mt-3 space-y-3">
                <a
                  href={getWhatsAppGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-cream/60 transition-colors hover:text-golden"
                >
                  <Phone className="h-4 w-4" />
                  +62 821-9356-2480
                </a>
                <a
                  href="https://www.instagram.com/dapoerbule_354/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-cream/60 transition-colors hover:text-golden"
                >
                  <Instagram className="h-4 w-4" />
                  @dapoerbule_354
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-charcoal">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-golden to-golden-dark">
                <UtensilsCrossed className="h-4 w-4 text-charcoal" />
              </div>
              <span className="font-[var(--font-playfair)] text-sm font-bold text-cream">
                Dapoer <span className="text-golden">Bulek</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-xs text-cream/40 transition-colors hover:text-golden"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs text-cream/30">
              &copy; {new Date().getFullYear()} Dapoer Bulek. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────── MAIN PAGE ─────────────────────── */

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MenuCatalog />
      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
}
