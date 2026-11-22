"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import {
  MENU_GROUPS,
  MENU_ITEMS,
  MenuVariant,
  OrderSelectionItem,
  PreOrderFormValues,
  buildPreOrderWhatsAppMessage,
  formatIndonesianDate,
  getWhatsAppTextLink,
} from "@/data/menu";
import { trackEvent } from "@/lib/analytics";

interface PreOrderBuilderProps {
  selectedItems: OrderSelectionItem[];
  onAddItem: (
    menuId: string,
    source?: "card" | "spotlight" | "builder_picker"
  ) => void;
  onUpdateQuantity: (itemKey: string, quantity: number) => void;
  onUpdateVariant: (itemKey: string, variantId: string) => void;
  onUpdateNote: (itemKey: string, note: string) => void;
  onRemoveItem: (itemKey: string) => void;
  onClearItems: () => void;
}

interface ValidationErrors {
  items?: string;
  itemQuantities: Record<string, string>;
  customerName?: string;
  eventDate?: string;
  eventTime?: string;
  deliveryAddress?: string;
}

function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysToLocalDate(base: Date, days: number): string {
  const copy = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + days
  );
  return toLocalDateInputValue(copy);
}

const emptySubscribe = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const INITIAL_FORM_VALUES: PreOrderFormValues = {
  customerName: "",
  eventDate: "",
  eventTime: "09:00",
  deliveryMethod: "pickup",
  deliveryAddress: "",
  greetingCardText: "",
  notes: "",
};

export function PreOrderBuilder({
  selectedItems,
  onAddItem,
  onUpdateQuantity,
  onUpdateVariant,
  onUpdateNote,
  onRemoveItem,
  onClearItems,
}: PreOrderBuilderProps) {
  const isClient = useIsClient();
  const [pickerMenuId, setPickerMenuId] = useState<string>(MENU_ITEMS[0].id);
  const [formValues, setFormValues] =
    useState<PreOrderFormValues>(INITIAL_FORM_VALUES);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<
    string | null
  >(null);

  const pickerSelectRef = useRef<HTMLSelectElement>(null);
  const customerNameRef = useRef<HTMLInputElement>(null);
  const eventDateRef = useRef<HTMLInputElement>(null);
  const eventTimeRef = useRef<HTMLInputElement>(null);
  const deliveryAddressRef = useRef<HTMLTextAreaElement>(null);

  const dateBounds = useMemo(() => {
    if (!isClient) return null;
    const now = new Date();
    return {
      todayStr: toLocalDateInputValue(now),
      h2Str: addDaysToLocalDate(now, 2),
      h3Str: addDaysToLocalDate(now, 3),
    };
  }, [isClient]);

  useEffect(() => {
    if (copyStatus !== "copied") return;
    const timer = window.setTimeout(() => setCopyStatus("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const resolvedItems = useMemo(() => {
    return selectedItems
      .map((entry) => {
        const menu = MENU_ITEMS.find((m) => m.id === entry.menuId);
        if (!menu) return null;
        const variant =
          menu.variants.find((v) => v.id === entry.variantId) ??
          menu.variants[0];
        return {
          key: entry.key,
          menu,
          variant,
          quantity: entry.quantity,
          note: entry.note ?? "",
        };
      })
      .filter(
        (
          entry
        ): entry is {
          key: string;
          menu: (typeof MENU_ITEMS)[number];
          variant: MenuVariant;
          quantity: number;
          note: string;
        } => entry !== null
      );
  }, [selectedItems]);

  const requiredLeadDays: 0 | 2 | 3 = useMemo(() => {
    if (resolvedItems.some((entry) => entry.menu.leadDays === 3)) return 3;
    if (resolvedItems.some((entry) => entry.menu.leadDays === 2)) return 2;
    return 0;
  }, [resolvedItems]);

  const earliestValidDate = useMemo(() => {
    if (!dateBounds) return "";
    if (requiredLeadDays === 3) return dateBounds.h3Str;
    if (requiredLeadDays === 2) return dateBounds.h2Str;
    return dateBounds.todayStr;
  }, [dateBounds, requiredLeadDays]);

  const isUrgentDate = Boolean(
    requiredLeadDays > 0 &&
      dateBounds &&
      earliestValidDate &&
      formValues.eventDate &&
      formValues.eventDate >= dateBounds.todayStr &&
      formValues.eventDate < earliestValidDate
  );

  const hasGreetingEligibleItem = useMemo(() => {
    return resolvedItems.some((entry) => entry.menu.supportsGreetingCard);
  }, [resolvedItems]);

  const validation = useMemo<ValidationErrors>(() => {
    const itemQuantities: Record<string, string> = {};
    for (const { key, menu, quantity } of resolvedItems) {
      if (!Number.isFinite(quantity) || quantity < menu.minOrder) {
        itemQuantities[key] = `Minimal pemesanan ${menu.name} adalah ${menu.minOrder} ${menu.unitLabel}.`;
      }
    }

    let itemsError: string | undefined;
    if (resolvedItems.length === 0) {
      itemsError = "Pilih minimal satu menu sebelum mengirim format pesanan.";
    }

    let customerNameError: string | undefined;
    if (!formValues.customerName.trim()) {
      customerNameError = "Masukkan nama pemesan atau penanggung jawab acara.";
    }

    let eventDateError: string | undefined;
    if (!formValues.eventDate) {
      eventDateError = "Pilih tanggal acara Anda.";
    } else if (dateBounds && formValues.eventDate < dateBounds.todayStr) {
      eventDateError = "Tanggal acara tidak boleh di masa lalu.";
    }

    let eventTimeError: string | undefined;
    if (!formValues.eventTime.trim()) {
      eventTimeError = "Tentukan perkiraan jam acara atau waktu siap saji.";
    }

    let deliveryAddressError: string | undefined;
    if (
      formValues.deliveryMethod === "delivery" &&
      !formValues.deliveryAddress.trim()
    ) {
      deliveryAddressError =
        "Tuliskan alamat atau patokan lokasi pengantaran secara lengkap.";
    }

    return {
      items: itemsError,
      itemQuantities,
      customerName: customerNameError,
      eventDate: eventDateError,
      eventTime: eventTimeError,
      deliveryAddress: deliveryAddressError,
    };
  }, [resolvedItems, formValues, dateBounds]);

  const hasAnyError =
    Boolean(validation.items) ||
    Object.keys(validation.itemQuantities).length > 0 ||
    Boolean(validation.customerName) ||
    Boolean(validation.eventDate) ||
    Boolean(validation.eventTime) ||
    Boolean(validation.deliveryAddress);

  const previewMessage = useMemo(
    () =>
      buildPreOrderWhatsAppMessage(selectedItems, formValues, {
        isUrgentInquiry: isUrgentDate,
        requiredLeadDays,
      }),
    [selectedItems, formValues, isUrgentDate, requiredLeadDays]
  );

  const handleAddFromPicker = () => {
    onAddItem(pickerMenuId, "builder_picker");
    setSubmittedWhatsAppUrl(null);
  };

  const handleFieldChange = <K extends keyof PreOrderFormValues>(
    field: K,
    value: PreOrderFormValues[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setSubmittedWhatsAppUrl(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (hasAnyError) {
      setSubmittedWhatsAppUrl(null);
      if (validation.items) {
        pickerSelectRef.current?.focus();
      } else if (Object.keys(validation.itemQuantities).length > 0) {
        const firstInvalidKey = Object.keys(validation.itemQuantities)[0];
        document.getElementById(`qty-${firstInvalidKey}`)?.focus();
      } else if (validation.customerName) {
        customerNameRef.current?.focus();
      } else if (validation.eventDate) {
        eventDateRef.current?.focus();
      } else if (validation.eventTime) {
        eventTimeRef.current?.focus();
      } else if (validation.deliveryAddress) {
        deliveryAddressRef.current?.focus();
      }
      return;
    }

    const whatsappUrl = getWhatsAppTextLink(previewMessage);
    setSubmittedWhatsAppUrl(whatsappUrl);
    const totalPortions = resolvedItems.reduce(
      (sum, entry) => sum + entry.quantity,
      0
    );
    trackEvent("submit_whatsapp_order", {
      mode: isUrgentDate ? "urgent" : "scheduled",
      items_count: resolvedItems.length,
      total_portions: totalPortions,
      delivery_method: formValues.deliveryMethod,
    });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyMessage = async () => {
    const trackCopySuccess = () => {
      trackEvent("copy_whatsapp_format", {
        mode: isUrgentDate ? "urgent" : "scheduled",
        items_count: resolvedItems.length,
      });
    };

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(previewMessage);
        setCopyStatus("copied");
        trackCopySuccess();
        return;
      }

      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = previewMessage;
      tempTextarea.setAttribute("readonly", "");
      tempTextarea.style.position = "fixed";
      tempTextarea.style.left = "-9999px";
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(tempTextarea);

      if (copied) {
        setCopyStatus("copied");
        trackCopySuccess();
      } else {
        setCopyStatus("error");
      }
    } catch {
      setCopyStatus("error");
    }
  };

  const handleReset = () => {
    onClearItems();
    setFormValues(INITIAL_FORM_VALUES);
    setSubmitAttempted(false);
    setCopyStatus("idle");
    setSubmittedWhatsAppUrl(null);
  };

  const hasUserInput =
    selectedItems.length > 0 ||
    formValues.customerName.trim().length > 0 ||
    formValues.eventDate.length > 0 ||
    formValues.deliveryAddress.trim().length > 0 ||
    formValues.greetingCardText.trim().length > 0 ||
    formValues.notes.trim().length > 0;

  return (
    <section
      id="pesan"
      className="border-t border-cream-border bg-cream-muted py-16 text-charcoal sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-amber-text-strong">
            Formulir Pre-Order
          </p>
          <div className="mt-3 h-0.5 w-14 bg-golden" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-tight text-charcoal">
            Susun Format Pesanan ke WhatsApp
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-dark-secondary">
            Pilih menu, varian ukuran, dan jumlah porsi, lalu kirim format
            pesanan yang sudah tersusun rapi ke WhatsApp Dapoer Bulek untuk
            konfirmasi harga, ongkir, dan jadwal.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-10 grid items-start gap-8 lg:grid-cols-12 lg:gap-10"
        >
          <div className="space-y-8 rounded-xl border border-cream-border bg-white p-5 sm:p-8 lg:col-span-7">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">
                1. Daftar Menu, Varian &amp; Porsi
              </h3>
              <p className="mt-1 text-sm text-ink-dark-muted">
                Tambahkan satu atau beberapa menu sekaligus. Paket nasi kotak
                minimal 20 kotak dan snack box minimal 15 kotak, sedangkan menu
                harian seperti nasi bakar, rice bowl, dan bento mulai 1 porsi.
              </p>

              <div className="mt-4">
                <label
                  htmlFor="builder-menu-select"
                  className="block text-sm font-semibold text-charcoal"
                >
                  Pilih Menu untuk Ditambahkan
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <select
                    ref={pickerSelectRef}
                    id="builder-menu-select"
                    value={pickerMenuId}
                    onChange={(event) => setPickerMenuId(event.target.value)}
                    className="min-h-[44px] w-full flex-1 rounded-md border border-[#78716C] bg-white px-3.5 py-2.5 text-sm text-charcoal"
                  >
                    {MENU_GROUPS.map((group) => {
                      const items = MENU_ITEMS.filter(
                        (item) => item.category === group.id
                      );
                      return (
                        <optgroup key={group.id} label={group.title}>
                          {items.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} (
                              {item.minOrder > 1
                                ? `min. ${item.minOrder} ${item.unitLabel}`
                                : `per ${item.unitLabel}`}
                              ,{" "}
                              {item.leadDays === 0
                                ? "Hari H / H-1"
                                : `H-${item.leadDays}`}
                              )
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddFromPicker}
                    className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md bg-charcoal px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-charcoal-surface active:bg-charcoal-surface"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Tambah Menu
                  </button>
                </div>
              </div>

              <div className="mt-5">
                {resolvedItems.length === 0 ? (
                  <div
                    className={`rounded-lg border border-dashed p-5 ${
                      submitAttempted && validation.items
                        ? "border-[#B91C1C] bg-[#FEF2F2]"
                        : "border-[#78716C] bg-cream"
                    }`}
                  >
                    <p className="text-sm font-semibold text-charcoal">
                      Belum ada menu yang dipilih.
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-dark-secondary">
                      Pilih menu dari dropdown di atas, klik Detail &amp; Varian
                      pada kartu menu di atas, atau gunakan susunan Paket Acara.
                    </p>
                    {submitAttempted && validation.items && (
                      <p
                        id="po-items-error"
                        role="alert"
                        className="mt-3 flex items-start gap-2 text-sm font-semibold text-[#B91C1C]"
                      >
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{validation.items}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                      <p className="text-sm font-semibold text-charcoal">
                        Menu Dipilih ({resolvedItems.length} item)
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onClearItems();
                          setSubmittedWhatsAppUrl(null);
                        }}
                        className="inline-flex min-h-[44px] items-center px-2 text-sm font-semibold text-amber-text-strong underline underline-offset-4 hover:text-charcoal"
                      >
                        Hapus semua menu
                      </button>
                    </div>

                    <ul className="divide-y divide-cream-border rounded-lg border border-cream-border bg-cream">
                      {resolvedItems.map(({ key, menu, variant, quantity, note }) => {
                        const qtyError = validation.itemQuantities[key];
                        const showQtyError =
                          Boolean(qtyError) &&
                          (submitAttempted || quantity < menu.minOrder);

                        return (
                          <li key={key} className="space-y-3 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <p className="font-serif text-base font-bold text-charcoal">
                                  {menu.name}
                                </p>
                                <p className="mt-0.5 text-xs font-medium text-ink-dark-muted">
                                  {menu.portionInfo} · {menu.leadTime}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={quantity <= menu.minOrder}
                                    onClick={() => {
                                      onUpdateQuantity(
                                        key,
                                        Math.max(menu.minOrder, quantity - 1)
                                      );
                                      setSubmittedWhatsAppUrl(null);
                                    }}
                                    aria-label={`Kurangi jumlah ${menu.name}`}
                                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#78716C] bg-white text-charcoal transition-colors hover:bg-cream-muted active:bg-cream-muted disabled:border-cream-border disabled:bg-cream-muted disabled:text-ink-dark-muted"
                                  >
                                    <Minus
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  </button>

                                  <label
                                    htmlFor={`qty-${key}`}
                                    className="sr-only"
                                  >
                                    {`Jumlah ${menu.name} dalam ${menu.unitLabel}`}
                                  </label>
                                  <input
                                    id={`qty-${key}`}
                                    type="number"
                                    inputMode="numeric"
                                    min={menu.minOrder}
                                    value={Number.isNaN(quantity) ? "" : quantity}
                                    aria-invalid={showQtyError}
                                    aria-describedby={
                                      showQtyError
                                        ? `qty-error-${key}`
                                        : undefined
                                    }
                                    onChange={(event) => {
                                      const parsed = Number.parseInt(
                                        event.target.value,
                                        10
                                      );
                                      onUpdateQuantity(
                                        key,
                                        Number.isNaN(parsed)
                                          ? 0
                                          : Math.max(0, parsed)
                                      );
                                      setSubmittedWhatsAppUrl(null);
                                    }}
                                    className={`min-h-[44px] w-20 rounded-md border bg-white px-2 text-center text-sm font-semibold text-charcoal ${
                                      showQtyError
                                        ? "border-[#B91C1C]"
                                        : "border-[#78716C]"
                                    }`}
                                  />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateQuantity(
                                        key,
                                        Math.max(menu.minOrder, quantity + 1)
                                      );
                                      setSubmittedWhatsAppUrl(null);
                                    }}
                                    aria-label={`Tambah jumlah ${menu.name}`}
                                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#78716C] bg-white text-charcoal transition-colors hover:bg-cream-muted active:bg-cream-muted"
                                  >
                                    <Plus
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>

                                <span className="min-w-[52px] text-sm font-medium text-ink-dark-secondary">
                                  {menu.unitLabel}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    onRemoveItem(key);
                                    setSubmittedWhatsAppUrl(null);
                                  }}
                                  aria-label={`Hapus ${menu.name} (${variant.label})`}
                                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-md border border-[#78716C] bg-white px-3 text-xs font-semibold text-[#B91C1C] transition-colors hover:border-[#B91C1C] hover:bg-[#FEF2F2] active:bg-[#FEF2F2]"
                                >
                                  <Trash2
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              <div>
                                <label
                                  htmlFor={`variant-${key}`}
                                  className="block text-xs font-semibold text-ink-dark-secondary"
                                >
                                  Varian Ukuran / Paket
                                </label>
                                <select
                                  id={`variant-${key}`}
                                  value={variant.id}
                                  onChange={(event) => {
                                    onUpdateVariant(key, event.target.value);
                                    setSubmittedWhatsAppUrl(null);
                                  }}
                                  className="mt-1 min-h-[44px] w-full rounded-md border border-[#78716C] bg-white px-3 py-2 text-xs font-medium text-charcoal"
                                >
                                  {menu.variants.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label
                                  htmlFor={`note-${key}`}
                                  className="block text-xs font-semibold text-ink-dark-secondary"
                                >
                                  Catatan Menu (opsional)
                                </label>
                                <input
                                  id={`note-${key}`}
                                  type="text"
                                  value={note}
                                  onChange={(event) => {
                                    onUpdateNote(key, event.target.value);
                                    setSubmittedWhatsAppUrl(null);
                                  }}
                                  placeholder={
                                    menu.notePlaceholder ??
                                    "Request lauk, pedas, atau catatan"
                                  }
                                  className="mt-1 min-h-[44px] w-full rounded-md border border-[#78716C] bg-white px-3 py-2 text-xs text-charcoal placeholder:text-ink-dark-muted"
                                />
                              </div>
                            </div>

                            {showQtyError && (
                              <p
                                id={`qty-error-${key}`}
                                role="alert"
                                className="flex items-start gap-2 text-xs font-semibold text-[#B91C1C]"
                              >
                                <AlertCircle
                                  className="mt-0.5 h-4 w-4 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>{qtyError}</span>
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-cream-border pt-7">
              <h3 className="font-serif text-xl font-bold text-charcoal">
                2. Data Pemesan &amp; Jadwal Acara
              </h3>
              <p className="mt-1 text-sm text-ink-dark-muted">
                Lengkapi nama, waktu acara, dan lokasi agar dapur dapat mengecek
                ketersediaan jadwal masak dan pengantaran.
              </p>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="po-customer-name"
                    className="block text-sm font-semibold text-charcoal"
                  >
                    Nama Pemesan{" "}
                    <span className="text-[#B91C1C]" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    ref={customerNameRef}
                    id="po-customer-name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Nama pemesan atau penanggung jawab"
                    value={formValues.customerName}
                    aria-invalid={
                      submitAttempted && Boolean(validation.customerName)
                    }
                    aria-describedby={
                      submitAttempted && validation.customerName
                        ? "po-customer-name-error"
                        : undefined
                    }
                    onChange={(event) =>
                      handleFieldChange("customerName", event.target.value)
                    }
                    className={`mt-2 min-h-[44px] w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-dark-muted ${
                      submitAttempted && validation.customerName
                        ? "border-[#B91C1C]"
                        : "border-[#78716C]"
                    }`}
                  />
                  {submitAttempted && validation.customerName && (
                    <p
                      id="po-customer-name-error"
                      role="alert"
                      className="mt-2 flex items-start gap-2 text-xs font-semibold text-[#B91C1C]"
                    >
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{validation.customerName}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="po-event-date"
                      className="block text-sm font-semibold text-charcoal"
                    >
                      Tanggal Acara{" "}
                      <span className="text-[#B91C1C]" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      ref={eventDateRef}
                      id="po-event-date"
                      type="date"
                      required
                      min={dateBounds?.todayStr || undefined}
                      value={formValues.eventDate}
                      aria-invalid={
                        (submitAttempted && Boolean(validation.eventDate)) ||
                        (Boolean(formValues.eventDate) &&
                          Boolean(validation.eventDate))
                      }
                      aria-describedby="po-event-date-help po-event-date-error"
                      onChange={(event) =>
                        handleFieldChange("eventDate", event.target.value)
                      }
                      className={`mt-2 min-h-[44px] w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-charcoal ${
                        (submitAttempted && validation.eventDate) ||
                        (formValues.eventDate && validation.eventDate)
                          ? "border-[#B91C1C]"
                          : "border-[#78716C]"
                      }`}
                    />
                    <p
                      id="po-event-date-help"
                      className="mt-1.5 text-xs leading-relaxed text-ink-dark-muted"
                    >
                      {!dateBounds
                        ? "Menyiapkan kalender jadwal pemesanan..."
                        : requiredLeadDays === 0
                          ? "Menu pilihan dapat dipesan untuk Hari H (terkadang perlu H-1 jika stok bahan sedang kosong)."
                          : `PO normal minimal H-${requiredLeadDays} (${formatIndonesianDate(
                              earliestValidDate
                            )}). Jadwal mendadak dapat ditanyakan ke admin via WA.`}
                    </p>
                    {(submitAttempted || Boolean(formValues.eventDate)) &&
                      validation.eventDate && (
                        <p
                          id="po-event-date-error"
                          role="alert"
                          className="mt-2 flex items-start gap-2 text-xs font-semibold text-[#B91C1C]"
                        >
                          <AlertCircle
                            className="mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span>{validation.eventDate}</span>
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="po-event-time"
                      className="block text-sm font-semibold text-charcoal"
                    >
                      Jam Acara / Siap Saji{" "}
                      <span className="text-[#B91C1C]" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      ref={eventTimeRef}
                      id="po-event-time"
                      type="time"
                      required
                      value={formValues.eventTime}
                      aria-invalid={
                        submitAttempted && Boolean(validation.eventTime)
                      }
                      aria-describedby="po-event-time-help po-event-time-error"
                      onChange={(event) =>
                        handleFieldChange("eventTime", event.target.value)
                      }
                      className={`mt-2 min-h-[44px] w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-charcoal ${
                        submitAttempted && validation.eventTime
                          ? "border-[#B91C1C]"
                          : "border-[#78716C]"
                      }`}
                    />
                    <p
                      id="po-event-time-help"
                      className="mt-1.5 text-xs leading-relaxed text-ink-dark-muted"
                    >
                      Waktu hidangan siap diambil atau tiba di lokasi (WIB).
                    </p>
                    {submitAttempted && validation.eventTime && (
                      <p
                        id="po-event-time-error"
                        role="alert"
                        className="mt-2 flex items-start gap-2 text-xs font-semibold text-[#B91C1C]"
                      >
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{validation.eventTime}</span>
                      </p>
                    )}
                  </div>
                </div>

                {isUrgentDate && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-lg border border-[#B45309] bg-[#FFFBEB] p-3.5 text-xs leading-relaxed text-[#92400E]"
                  >
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold">
                        Jadwal Mendadak (di bawah minimal normal H-{requiredLeadDays})
                      </p>
                      <p className="mt-1">
                        Pemesanan normal untuk menu pilihan Anda paling cepat{" "}
                        {formatIndonesianDate(earliestValidDate)}. Anda tetap
                        dapat mengirim pertanyaan ke WhatsApp admin untuk cek
                        slot, namun belum menentukan bisa atau tidaknya sebelum
                        dikonfirmasi.
                      </p>
                    </div>
                  </div>
                )}

                <fieldset>
                  <legend className="text-sm font-semibold text-charcoal">
                    Metode Pengambilan / Pengantaran
                  </legend>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label
                      className={`flex min-h-[56px] items-start gap-3 rounded-md border p-3.5 transition-colors ${
                        formValues.deliveryMethod === "pickup"
                          ? "border-charcoal bg-cream-muted ring-1 ring-charcoal"
                          : "border-[#78716C] bg-white hover:bg-cream"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={formValues.deliveryMethod === "pickup"}
                        onChange={() =>
                          handleFieldChange("deliveryMethod", "pickup")
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-[#92400E]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-charcoal">
                          Ambil di Dapur
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-dark-muted">
                          Dayamurni, Kec. Tumijajar (tanpa ongkir)
                        </span>
                      </span>
                    </label>

                    <label
                      className={`flex min-h-[56px] items-start gap-3 rounded-md border p-3.5 transition-colors ${
                        formValues.deliveryMethod === "delivery"
                          ? "border-charcoal bg-cream-muted ring-1 ring-charcoal"
                          : "border-[#78716C] bg-white hover:bg-cream"
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="delivery"
                        checked={formValues.deliveryMethod === "delivery"}
                        onChange={() =>
                          handleFieldChange("deliveryMethod", "delivery")
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-[#92400E]"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-charcoal">
                          Antar ke Alamat
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-dark-muted">
                          Ada ongkos kirim sesuai jarak &amp; kondisi
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                {formValues.deliveryMethod === "delivery" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="po-delivery-address"
                      className="block text-sm font-semibold text-charcoal"
                    >
                      Alamat Pengantaran{" "}
                      <span className="text-[#B91C1C]" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <textarea
                      ref={deliveryAddressRef}
                      id="po-delivery-address"
                      rows={3}
                      required
                      placeholder="Nama kampung atau jalan, RT/RW, dan patokan lokasi pengantaran"
                      value={formValues.deliveryAddress}
                      aria-invalid={
                        submitAttempted && Boolean(validation.deliveryAddress)
                      }
                      aria-describedby="po-shipping-note po-delivery-address-error"
                      onChange={(event) =>
                        handleFieldChange("deliveryAddress", event.target.value)
                      }
                      className={`mt-1 w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-dark-muted ${
                        submitAttempted && validation.deliveryAddress
                          ? "border-[#B91C1C]"
                          : "border-[#78716C]"
                      }`}
                    />
                    <p
                      id="po-shipping-note"
                      className="rounded-md border border-cream-border bg-cream px-3 py-2 text-xs leading-relaxed text-ink-dark-secondary"
                    >
                      Pengantaran dikenakan ongkos kirim sesuai jarak lokasi dan
                      tingkat kesulitan membawa pesanan. Nominal ongkir akan
                      dikonfirmasi oleh admin melalui WhatsApp.
                    </p>
                    {submitAttempted && validation.deliveryAddress && (
                      <p
                        id="po-delivery-address-error"
                        role="alert"
                        className="flex items-start gap-2 text-xs font-semibold text-[#B91C1C]"
                      >
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{validation.deliveryAddress}</span>
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="po-greeting"
                    className="block text-sm font-semibold text-charcoal"
                  >
                    Tulisan Kartu Ucapan atau Topper (opsional)
                  </label>
                  <input
                    id="po-greeting"
                    type="text"
                    placeholder="Contoh: Barakallah fii Umrik atau Syukuran Rumah Baru"
                    value={formValues.greetingCardText}
                    onChange={(event) =>
                      handleFieldChange("greetingCardText", event.target.value)
                    }
                    className="mt-2 min-h-[44px] w-full rounded-md border border-[#78716C] bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-dark-muted"
                  />
                  {hasGreetingEligibleItem && (
                    <p className="mt-1.5 text-xs text-amber-text-strong">
                      Menu tumpeng, pie buah, atau pudding pilihan Anda dapat
                      dilengkapi kartu ucapan atau topper sesuai catatan ini.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="po-notes"
                    className="block text-sm font-semibold text-charcoal"
                  >
                    Catatan Tambahan (opsional)
                  </label>
                  <textarea
                    id="po-notes"
                    rows={2}
                    placeholder="Contoh: Sambal dipisah, request tingkat pedas, atau jumlah porsi tamu"
                    value={formValues.notes}
                    onChange={(event) =>
                      handleFieldChange("notes", event.target.value)
                    }
                    className="mt-2 w-full rounded-md border border-[#78716C] bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-dark-muted"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-charcoal-border bg-charcoal p-5 text-cream sm:p-7 lg:sticky lg:top-24 lg:col-span-5">
            <p className="text-xs font-semibold text-golden">
              Pratinjau Pesan WhatsApp
            </p>
            <h3 className="mt-1.5 font-serif text-xl font-bold text-cream sm:text-2xl">
              Ringkasan Format Pesanan
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-light-secondary">
              Periksa kembali daftar menu, varian, dan jadwal acara sebelum
              mengirim ke WhatsApp Dapoer Bulek (+62 821-9356-2480).
            </p>

            <div className="mt-5 rounded-lg border border-charcoal-border bg-charcoal-surface px-4 py-3 text-xs leading-relaxed text-ink-light-secondary">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-cream">
                  {resolvedItems.length > 0
                    ? `${resolvedItems.length} item menu dipilih`
                    : "Belum ada menu dipilih"}
                </span>
                <span className="font-semibold text-golden">
                  {isUrgentDate
                    ? "Cek slot mendadak via WA"
                    : requiredLeadDays === 0
                      ? "Batas pesan: Hari H (cek stok)"
                      : `Batas pesan: min. H-${requiredLeadDays}`}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-charcoal-border bg-charcoal-surface p-4">
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-cream">
                {previewMessage}
              </pre>
            </div>

            {submitAttempted && hasAnyError && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#B91C1C] bg-[#FEF2F2] p-3.5 text-sm font-medium text-[#B91C1C]"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Lengkapi atau perbaiki kolom yang ditandai merah pada formulir
                  di sebelah kiri sebelum mengirim pesan.
                </span>
              </div>
            )}

            {submittedWhatsAppUrl && (
              <div
                role="status"
                className="mt-4 rounded-lg border border-[#166534] bg-[#F0FDF4] p-4 text-sm text-[#166534]"
              >
                <p className="flex items-start gap-2 font-semibold">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>Format pesanan siap dikirim di tab WhatsApp Anda.</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed">
                  Jika jendela WhatsApp tidak terbuka otomatis oleh browser,
                  buka langsung lewat tautan di bawah ini.
                </p>
                <a
                  href={submittedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("click_whatsapp", {
                      location: "builder_resend_link",
                    })
                  }
                  className="mt-2 inline-flex min-h-[44px] items-center font-semibold text-[#166534] underline underline-offset-4 hover:text-charcoal"
                >
                  Buka Ulang Halaman WhatsApp
                </a>
              </div>
            )}

            <div className="mt-5 space-y-3">
              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-golden px-6 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                {isUrgentDate
                  ? "Tanya Slot Mendadak via WhatsApp"
                  : "Kirim Format ke WhatsApp"}
              </button>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-[#85807A] bg-charcoal-surface px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-golden hover:text-golden active:bg-charcoal"
                >
                  {copyStatus === "copied" ? (
                    <>
                      <Check
                        className="h-4 w-4 text-[#86EFAC]"
                        aria-hidden="true"
                      />
                      <span>Format Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      <span>Salin Format Pesanan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={!hasUserInput}
                  onClick={handleReset}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-[#78716C] bg-transparent px-4 py-2.5 text-sm font-medium text-ink-light-secondary transition-colors hover:border-cream hover:text-cream disabled:border-charcoal-border disabled:text-ink-light-muted"
                >
                  Kosongkan Form
                </button>
              </div>

              <div aria-live="polite" className="min-h-[1.25rem]">
                {copyStatus === "copied" && (
                  <p className="text-xs font-medium text-[#86EFAC]">
                    Teks format pesanan sudah disalin ke clipboard.
                  </p>
                )}
                {copyStatus === "error" && (
                  <p className="text-xs font-medium text-[#FCA5A5]">
                    Salin otomatis gagal di browser ini. Anda dapat menyalin
                    langsung teks pada kotak pratinjau di atas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
