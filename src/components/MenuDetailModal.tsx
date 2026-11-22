"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, X } from "lucide-react";
import { MenuItem } from "@/data/menu";

interface MenuDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToOrder: (payload: {
    menuId: string;
    variantId: string;
    quantity: number;
    note: string;
    scrollToForm?: boolean;
  }) => void;
}

export function MenuDetailModal({
  item,
  onClose,
  onAddToOrder,
}: MenuDetailModalProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!item) return;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <MenuDetailModalContent
      key={item.id}
      item={item}
      onClose={onClose}
      onAddToOrder={onAddToOrder}
    />
  );
}

function MenuDetailModalContent({
  item,
  onClose,
  onAddToOrder,
}: {
  item: MenuItem;
  onClose: () => void;
  onAddToOrder: MenuDetailModalProps["onAddToOrder"];
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedVariantId, setSelectedVariantId] = useState(
    item.variants[0]?.id ?? ""
  );
  const [quantityInput, setQuantityInput] = useState(String(item.minOrder));
  const [note, setNote] = useState("");

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const parsedQty = Number.parseInt(quantityInput, 10);
  const validQuantity =
    Number.isFinite(parsedQty) && parsedQty >= item.minOrder
      ? parsedQty
      : item.minOrder;

  const handleSubmitAdd = (scrollToForm: boolean) => {
    onAddToOrder({
      menuId: item.id,
      variantId: selectedVariantId || item.variants[0]?.id || "default",
      quantity: validQuantity,
      note: note.trim(),
      scrollToForm,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/80 p-0 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-xl border border-cream-border bg-cream text-charcoal sm:rounded-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-cream-border bg-white px-5 py-3.5 sm:px-6">
          <p className="text-xs font-semibold text-amber-text-strong">
            {item.category} · {item.leadTime}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup detail menu"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-cream-border bg-white text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-12">
            {item.image && item.width && item.height ? (
              <div className="overflow-hidden rounded-lg border border-cream-border bg-cream-muted sm:col-span-5">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 640px) 100vw, 260px"
                  style={
                    item.objectPosition
                      ? { objectPosition: item.objectPosition }
                      : undefined
                  }
                  className="aspect-square h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col justify-between rounded-lg border border-dashed border-[#78716C] bg-cream-muted p-4 sm:col-span-5">
                <span className="text-xs font-semibold text-amber-text-strong">
                  {item.category}
                </span>
                <p className="mt-4 text-sm font-semibold text-charcoal">
                  Foto menu segera menyusul
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-dark-muted">
                  Tanyakan ketersediaan stok dan rincian lauk langsung melalui
                  WhatsApp.
                </p>
              </div>
            )}

            <div className="sm:col-span-7">
              <h3
                id="detail-modal-title"
                className="font-serif text-2xl font-bold leading-tight text-charcoal"
              >
                {item.name}
              </h3>
              <p className="mt-1.5 text-sm font-semibold text-amber-text-strong">
                {item.portionInfo}
                {item.minOrder > 1
                  ? ` · Minimal ${item.minOrder} ${item.unitLabel}`
                  : ""}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-dark-secondary">
                {item.description}
              </p>
              {item.spotlightNote && (
                <p className="mt-2.5 text-xs leading-relaxed text-ink-dark-muted">
                  {item.spotlightNote}
                </p>
              )}
            </div>
          </div>

          <fieldset className="mt-6 border-t border-cream-border pt-5">
            <legend className="text-sm font-semibold text-charcoal">
              Pilih Varian Ukuran atau Paket
            </legend>
            <div className="mt-3 grid gap-2.5">
              {item.variants.map((variant) => {
                const isSelected = variant.id === selectedVariantId;
                return (
                  <label
                    key={variant.id}
                    className={`flex min-h-[52px] items-start gap-3 rounded-md border p-3.5 transition-colors ${
                      isSelected
                        ? "border-charcoal bg-white ring-1 ring-charcoal"
                        : "border-cream-border bg-white hover:border-[#78716C]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="detail-menu-variant"
                      value={variant.id}
                      checked={isSelected}
                      onChange={() => setSelectedVariantId(variant.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#92400E]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-charcoal">
                        {variant.label}
                      </span>
                      {variant.description && (
                        <span className="mt-0.5 block text-xs text-ink-dark-muted">
                          {variant.description}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label
                htmlFor="detail-qty-input"
                className="block text-sm font-semibold text-charcoal"
              >
                Jumlah ({item.unitLabel})
              </label>
              <div className="mt-2 flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={validQuantity <= item.minOrder}
                  onClick={() =>
                    setQuantityInput(
                      String(Math.max(item.minOrder, validQuantity - 1))
                    )
                  }
                  aria-label={`Kurangi jumlah ${item.name}`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#78716C] bg-white text-charcoal transition-colors hover:bg-cream-muted disabled:border-cream-border disabled:bg-cream-muted disabled:text-ink-dark-muted"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <input
                  id="detail-qty-input"
                  type="number"
                  inputMode="numeric"
                  min={item.minOrder}
                  value={quantityInput}
                  onChange={(event) => setQuantityInput(event.target.value)}
                  onBlur={() => setQuantityInput(String(validQuantity))}
                  className="min-h-[44px] w-full rounded-md border border-[#78716C] bg-white px-2 text-center text-sm font-semibold text-charcoal"
                />
                <button
                  type="button"
                  onClick={() => setQuantityInput(String(validQuantity + 1))}
                  aria-label={`Tambah jumlah ${item.name}`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#78716C] bg-white text-charcoal transition-colors hover:bg-cream-muted"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {item.minOrder > 1 && (
                <p className="mt-1.5 text-xs text-ink-dark-muted">
                  Minimal {item.minOrder} {item.unitLabel}.
                </p>
              )}
            </div>

            <div className="sm:col-span-7">
              <label
                htmlFor="detail-note-input"
                className="block text-sm font-semibold text-charcoal"
              >
                Catatan Khusus Menu (opsional)
              </label>
              <input
                id="detail-note-input"
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={
                  item.notePlaceholder ??
                  "Contoh: sambal dipisah atau catatan ucapan"
                }
                className="mt-2 min-h-[44px] w-full rounded-md border border-[#78716C] bg-white px-3.5 py-2 text-sm text-charcoal placeholder:text-ink-dark-muted"
              />
            </div>
          </div>

          <p className="mt-4 rounded-md border border-cream-border bg-white px-3.5 py-2.5 text-xs leading-relaxed text-ink-dark-secondary">
            Rincian harga dan penyesuaian lauk dikonfirmasi langsung oleh admin
            lewat WhatsApp setelah format pesanan dikirim.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-cream-border bg-white p-4 sm:flex-row sm:px-6">
          <button
            type="button"
            onClick={() => handleSubmitAdd(false)}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-md border border-[#78716C] bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal hover:bg-cream-muted"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah ke Format Pesanan
          </button>
          <button
            type="button"
            onClick={() => handleSubmitAdd(true)}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            Tambah &amp; Isi Jadwal
          </button>
        </div>
      </div>
    </div>
  );
}
