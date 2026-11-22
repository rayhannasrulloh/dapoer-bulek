"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  X,
} from "lucide-react";
import {
  INSTAGRAM_URL,
  getWhatsAppGeneralLink,
  getWhatsAppMenuLink,
} from "@/data/menu";
import {
  TUMPENG_GALLERY,
  TUMPENG_GALLERY_CATEGORIES,
  TumpengGalleryCategory,
  TumpengGalleryPhoto,
} from "@/data/tumpengGallery";
import { InstagramIcon } from "@/components/InstagramIcon";
import { trackEvent } from "@/lib/analytics";

interface TumpengGallerySectionProps {
  onLightboxOpenChange?: (isOpen: boolean) => void;
}

export function TumpengGallerySection({
  onLightboxOpenChange,
}: TumpengGallerySectionProps) {
  const [activeCategory, setActiveCategory] =
    useState<TumpengGalleryCategory>("Semua");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "Semua"
      ? TUMPENG_GALLERY
      : TUMPENG_GALLERY.filter((photo) => photo.category === activeCategory);

  const countByCategory = (category: TumpengGalleryCategory): number => {
    if (category === "Semua") return TUMPENG_GALLERY.length;
    return TUMPENG_GALLERY.filter((photo) => photo.category === category).length;
  };

  useEffect(() => {
    onLightboxOpenChange?.(lightboxIndex !== null);
  }, [lightboxIndex, onLightboxOpenChange]);

  const handleSelectCategory = (category: TumpengGalleryCategory) => {
    setActiveCategory(category);
    setLightboxIndex(null);
  };

  const featuredPhoto = filteredPhotos[0];
  const gridPhotos = filteredPhotos.slice(1);
  const gridColumnsClass =
    gridPhotos.length <= 2
      ? "grid-cols-1 gap-5 sm:grid-cols-2"
      : "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4";
  const gridSizes =
    gridPhotos.length <= 2
      ? "(max-width: 640px) 100vw, 50vw"
      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

  return (
    <section
      id="galeri"
      className="border-t border-cream-border bg-cream py-16 text-charcoal sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-8 border-b border-cream-border pb-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-amber-text-strong">
              Dokumentasi Pesanan Nyata
            </p>
            <div className="mt-3 h-0.5 w-14 bg-golden" aria-hidden="true" />
            <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.4vw,2.625rem)] font-bold leading-tight text-charcoal">
              Galeri Foto Tumpeng &amp; Hasil Dapur
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-dark-secondary">
              Dokumentasi pesanan tumpeng yang pernah dibuat di Dapoer Bulek:
              nasi kuning tampah klasik, bentuk hati dan angka custom, tumpeng
              nasi liwet, hingga tumpeng mini satuan. Update harian lainnya kami
              bagikan di{" "}
              <span className="font-semibold text-charcoal">
                @dapoerbule_354
              </span>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("click_instagram", { location: "gallery_section" })
              }
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-charcoal-surface sm:text-base"
            >
              <InstagramIcon className="h-4 w-4" />
              Buka @dapoerbule_354
            </a>
            <a
              href={getWhatsAppGeneralLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("click_whatsapp", {
                  location: "gallery_availability",
                })
              }
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#78716C] bg-white px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal sm:text-base"
            >
              Cek Ketersediaan Tanggal
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Filter variasi foto tumpeng"
            className="flex flex-wrap gap-2"
          >
            {TUMPENG_GALLERY_CATEGORIES.map((category) => {
              const isSelected = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectCategory(category)}
                  className={`min-h-[44px] rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
                    isSelected
                      ? "border-charcoal bg-charcoal text-cream"
                      : "border-[#78716C] bg-white text-ink-dark-secondary hover:border-charcoal hover:text-charcoal"
                  }`}
                >
                  {category} ({countByCategory(category)})
                </button>
              );
            })}
          </div>
          <p className="text-xs font-medium text-ink-dark-muted">
            Pilih foto untuk memperbesar tampilan dan menanyakan modelnya.
          </p>
        </div>

        {!featuredPhoto ? (
          <div className="mt-8 rounded-lg border border-cream-border bg-white p-8 text-center">
            <p className="text-base font-medium text-charcoal">
              Belum ada foto tumpeng pada kategori ini.
            </p>
            <button
              type="button"
              onClick={() => handleSelectCategory("Semua")}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-md bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark"
            >
              Tampilkan Semua Foto
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <article className="overflow-hidden rounded-lg border border-cream-border bg-white">
              <div className="grid items-stretch lg:grid-cols-12">
                <button
                  type="button"
                  onClick={() => setLightboxIndex(0)}
                  aria-label={`Lihat foto penuh ${featuredPhoto.title}`}
                  className="group relative block w-full overflow-hidden bg-cream-muted text-left lg:col-span-7"
                >
                  <Image
                    src={featuredPhoto.src}
                    alt={featuredPhoto.alt}
                    width={featuredPhoto.width}
                    height={featuredPhoto.height}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    style={{ objectPosition: featuredPhoto.objectPosition }}
                    className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </button>

                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                  <div>
                    <p className="text-xs font-semibold text-amber-text-strong">
                      {featuredPhoto.category}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-bold leading-snug text-charcoal">
                      {featuredPhoto.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-dark-secondary sm:text-base">
                      {featuredPhoto.caption}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-cream-border pt-5">
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(0)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-[#78716C] bg-white px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted"
                    >
                      <Maximize2 className="h-4 w-4" aria-hidden="true" />
                      Lihat Foto Penuh
                    </button>
                    <a
                      href={getWhatsAppMenuLink(featuredPhoto.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("click_whatsapp", {
                          location: "gallery_featured",
                          item_name: featuredPhoto.title,
                        })
                      }
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Tanya Model Ini
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {gridPhotos.length > 0 && (
              <div className={`grid ${gridColumnsClass}`}>
                {gridPhotos.map((photo, index) => (
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-lg border border-cream-border bg-white transition-colors hover:border-charcoal"
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index + 1)}
                      aria-label={`Lihat foto penuh ${photo.title}`}
                      className="group flex h-full w-full flex-col text-left"
                    >
                      <span className="block w-full overflow-hidden bg-cream-muted">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          sizes={gridSizes}
                          style={{ objectPosition: photo.objectPosition }}
                          className="aspect-square h-auto w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                      </span>
                      <span className="flex flex-1 flex-col justify-between p-4">
                        <span>
                          <span className="block text-xs font-semibold text-amber-text-strong">
                            {photo.category}
                          </span>
                          <span className="mt-1 block font-serif text-base font-bold leading-snug text-charcoal">
                            {photo.title}
                          </span>
                          <span className="mt-1.5 block text-xs leading-relaxed text-ink-dark-secondary">
                            {photo.caption}
                          </span>
                        </span>
                        <span className="mt-4 inline-flex items-center gap-1.5 border-t border-cream-border pt-3 text-xs font-semibold text-charcoal group-hover:text-amber-text-strong">
                          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Lihat ukuran penuh</span>
                        </span>
                      </span>
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <GalleryLightboxModal
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          onChangeIndex={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}

interface GalleryLightboxModalProps {
  photos: TumpengGalleryPhoto[];
  currentIndex: number;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
}

function GalleryLightboxModal({
  photos,
  currentIndex,
  onChangeIndex,
  onClose,
}: GalleryLightboxModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const total = photos.length;
  const activePhoto = photos[currentIndex];

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && total > 1) {
        onChangeIndex((currentIndex - 1 + total) % total);
      } else if (event.key === "ArrowRight" && total > 1) {
        onChangeIndex((currentIndex + 1) % total);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, total, onChangeIndex, onClose]);

  const handlePrev = () => {
    if (total <= 1) return;
    onChangeIndex((currentIndex - 1 + total) % total);
  };

  const handleNext = () => {
    if (total <= 1) return;
    onChangeIndex((currentIndex + 1) % total);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/85 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-lightbox-title"
    >
      <div
        className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-xl border border-cream-border bg-cream text-charcoal sm:rounded-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-cream-border bg-white px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-amber-text-strong">
              {activePhoto.category} · Foto {currentIndex + 1} dari {total}
            </p>
            <h3
              id="gallery-lightbox-title"
              className="truncate font-serif text-lg font-bold text-charcoal sm:text-xl"
            >
              {activePhoto.title}
            </h3>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup foto galeri"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border border-[#78716C] bg-white text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-hidden bg-charcoal-surface p-3 sm:p-5">
          <Image
            src={activePhoto.src}
            alt={activePhoto.alt}
            width={activePhoto.width}
            height={activePhoto.height}
            sizes="(max-width: 768px) 95vw, 820px"
            className="max-h-[58vh] w-auto max-w-full rounded-md object-contain"
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-cream-border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm leading-relaxed text-ink-dark-secondary">
            {activePhoto.caption}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={total <= 1}
              aria-label="Foto sebelumnya"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#78716C] bg-white px-3 text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={total <= 1}
              aria-label="Foto berikutnya"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#78716C] bg-white px-3 text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <a
              href={getWhatsAppMenuLink(activePhoto.title)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("click_whatsapp", {
                  location: "gallery_lightbox",
                  item_name: activePhoto.title,
                })
              }
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Pesan Model Ini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
