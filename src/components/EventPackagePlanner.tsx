"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, MessageCircle, Minus, Plus, Users } from "lucide-react";
import {
  EVENT_OPTIONS,
  EventPreference,
  EventType,
  buildEventRecommendation,
  getWhatsAppTextLink,
} from "@/data/menu";

interface EventPackagePlannerProps {
  onApplyPackage: (
    entries: {
      menuId: string;
      variantId: string;
      quantity: number;
      note?: string;
    }[]
  ) => void;
}

const EVENT_DEFAULT_PREFS: Record<EventType, EventPreference> = {
  syukuran: {
    includeMainDish: true,
    includeNasiKotak: false,
    includeSnackBox: false,
    includeDessert: true,
  },
  "ulang-tahun": {
    includeMainDish: false,
    includeNasiKotak: false,
    includeSnackBox: true,
    includeDessert: true,
  },
  rapat: {
    includeMainDish: false,
    includeNasiKotak: true,
    includeSnackBox: true,
    includeDessert: false,
  },
  pengajian: {
    includeMainDish: true,
    includeNasiKotak: false,
    includeSnackBox: true,
    includeDessert: false,
  },
};

const PREFERENCE_ITEMS: { key: keyof EventPreference; label: string }[] = [
  { key: "includeMainDish", label: "Sajian Utama (Tumpeng / Liwet)" },
  { key: "includeNasiKotak", label: "Nasi Kotak (min. 20)" },
  { key: "includeSnackBox", label: "Snack Box Kue (min. 15)" },
  { key: "includeDessert", label: "Pie Buah / Pudding Cake" },
];

const GUEST_PRESETS = [15, 25, 50, 100];

export function EventPackagePlanner({
  onApplyPackage,
}: EventPackagePlannerProps) {
  const [eventType, setEventType] = useState<EventType>("syukuran");
  const [guestCount, setGuestCount] = useState<number>(25);
  const [preferences, setPreferences] = useState<EventPreference>(
    EVENT_DEFAULT_PREFS.syukuran
  );
  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

  const recommendations = buildEventRecommendation(
    eventType,
    guestCount,
    preferences
  );

  const currentEventLabel =
    EVENT_OPTIONS.find((item) => item.id === eventType)?.label ?? "Acara";

  const handleSelectEvent = (type: EventType) => {
    setEventType(type);
    setPreferences(EVENT_DEFAULT_PREFS[type]);
    setAppliedMessage(null);
  };

  const handleTogglePreference = (key: keyof EventPreference) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setAppliedMessage(null);
  };

  const handleApply = () => {
    if (recommendations.length === 0) return;
    onApplyPackage(
      recommendations.map((rec) => ({
        menuId: rec.menu.id,
        variantId: rec.variant.id,
        quantity: rec.quantity,
        note: `Paket ${currentEventLabel} (${guestCount} tamu)`,
      }))
    );
    setAppliedMessage(
      `${recommendations.length} menu paket ditambahkan ke formulir pesanan.`
    );
    document.getElementById("pesan")?.scrollIntoView({ behavior: "smooth" });
  };

  const consultUrl = getWhatsAppTextLink(
    [
      "Halo Dapoer Bulek, saya butuh rekomendasi menu dan penawaran harga untuk acara:",
      `- Jenis Acara: ${currentEventLabel}`,
      `- Perkiraan Tamu: ${guestCount} orang`,
      "",
      "Susunan menu yang diminati:",
      ...(recommendations.length > 0
        ? recommendations.map(
            (rec, index) =>
              `${index + 1}. ${rec.menu.name} (${rec.variant.label}, ${rec.quantity} ${rec.menu.unitLabel})`
          )
        : ["- Mohon saran kombinasi menu dari admin"]),
    ].join("\n")
  );

  return (
    <div
      id="paket-acara"
      className="mt-16 rounded-xl border border-charcoal-border bg-charcoal p-6 text-cream sm:p-8 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="space-y-6 lg:col-span-6">
          <div>
            <p className="text-sm font-semibold text-golden">
              Perkiraan Susunan Paket Acara
            </p>
            <div className="mt-3 h-0.5 w-14 bg-golden" aria-hidden="true" />
            <h3 className="mt-4 font-serif text-2xl font-bold leading-tight text-cream sm:text-3xl">
              Sesuaikan Menu dengan Jumlah Tamu
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-light-secondary sm:text-base">
              Pilih jenis acara dan perkiraan tamu untuk menyusun kombinasi
              menu otomatis beserta jumlah minimal ordernya.
            </p>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-cream">
              1. Jenis Acara
            </legend>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {EVENT_OPTIONS.map((opt) => {
                const isSelected = opt.id === eventType;
                return (
                  <label
                    key={opt.id}
                    className={`flex min-h-[56px] items-start gap-2.5 rounded-md border p-3 transition-colors ${
                      isSelected
                        ? "border-golden bg-charcoal-surface"
                        : "border-charcoal-border bg-charcoal-surface/60 hover:border-ink-light-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="planner-event-type"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => handleSelectEvent(opt.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#F59E0B]"
                    />
                    <span>
                      <span
                        className={`block text-sm font-semibold ${
                          isSelected ? "text-golden" : "text-cream"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-ink-light-muted">
                        {opt.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="planner-guest-count"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream"
              >
                <Users className="h-4 w-4 text-golden" aria-hidden="true" />
                2. Perkiraan Jumlah Tamu
              </label>
              <span className="text-sm font-semibold text-golden">
                {guestCount} orang
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setGuestCount((prev) => Math.max(5, prev - 5));
                    setAppliedMessage(null);
                  }}
                  disabled={guestCount <= 5}
                  aria-label="Kurangi 5 tamu"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-charcoal-border bg-charcoal-surface text-cream transition-colors hover:border-golden hover:text-golden disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <input
                  id="planner-guest-count"
                  type="number"
                  inputMode="numeric"
                  min={5}
                  max={300}
                  value={guestCount}
                  onChange={(event) => {
                    const parsed = Number.parseInt(event.target.value, 10);
                    if (Number.isFinite(parsed)) {
                      setGuestCount(Math.max(5, Math.min(300, parsed)));
                      setAppliedMessage(null);
                    }
                  }}
                  className="min-h-[44px] w-20 rounded-md border border-charcoal-border bg-charcoal-surface px-2 text-center text-sm font-semibold text-cream"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGuestCount((prev) => Math.min(300, prev + 5));
                    setAppliedMessage(null);
                  }}
                  disabled={guestCount >= 300}
                  aria-label="Tambah 5 tamu"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-charcoal-border bg-charcoal-surface text-cream transition-colors hover:border-golden hover:text-golden disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {GUEST_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setGuestCount(preset);
                      setAppliedMessage(null);
                    }}
                    className={`min-h-[44px] rounded-md border px-3 text-xs font-semibold transition-colors ${
                      guestCount === preset
                        ? "border-golden bg-golden text-charcoal"
                        : "border-charcoal-border bg-charcoal-surface text-ink-light-secondary hover:border-golden hover:text-golden"
                    }`}
                  >
                    {preset} tamu
                  </button>
                ))}
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-cream">
              3. Kebutuhan Sajian
            </legend>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PREFERENCE_ITEMS.map((item) => {
                const checked = preferences[item.key];
                return (
                  <label
                    key={item.key}
                    className={`flex min-h-[44px] items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                      checked
                        ? "border-golden bg-charcoal-surface text-cream"
                        : "border-charcoal-border bg-charcoal-surface/50 text-ink-light-secondary hover:border-ink-light-muted"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleTogglePreference(item.key)}
                      className="h-4 w-4 shrink-0 accent-[#F59E0B]"
                    />
                    <span className="font-medium">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="rounded-xl border border-charcoal-border bg-charcoal-surface p-5 sm:p-6 lg:col-span-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-charcoal-border pb-3.5">
            <div>
              <h4 className="font-serif text-xl font-bold text-cream">
                Rekomendasi: {currentEventLabel}
              </h4>
              <p className="mt-0.5 text-xs text-ink-light-muted">
                Perkiraan susunan untuk sekitar {guestCount} tamu
              </p>
            </div>
            <span className="text-xs font-semibold text-golden">
              {recommendations.length} menu
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm font-semibold text-cream">
                Belum ada jenis sajian dipilih.
              </p>
              <p className="mt-1 text-xs text-ink-light-muted">
                Centang minimal satu kebutuhan sajian di sebelah kiri untuk
                menampilkan rekomendasi paket.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-charcoal-border">
              {recommendations.map((rec) => (
                <li
                  key={`${rec.menu.id}-${rec.variant.id}`}
                  className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-charcoal-border bg-charcoal">
                    <Image
                      src={rec.menu.image}
                      alt={rec.menu.name}
                      width={rec.menu.width}
                      height={rec.menu.height}
                      sizes="56px"
                      style={
                        rec.menu.objectPosition
                          ? { objectPosition: rec.menu.objectPosition }
                          : undefined
                      }
                      className="aspect-square h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-serif text-base font-bold text-cream">
                        {rec.menu.name}
                      </p>
                      <span className="text-xs font-semibold text-golden">
                        {rec.quantity} {rec.menu.unitLabel}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-ink-light-secondary">
                      {rec.variant.label}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-light-muted">
                      {rec.reason}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 border-t border-charcoal-border pt-3 text-xs leading-relaxed text-ink-light-muted">
            Isi paket dapat disesuaikan kembali di formulir pesanan. Rincian
            harga dan ongkos kirim dikonfirmasi admin melalui WhatsApp.
          </p>

          {appliedMessage && (
            <p
              role="status"
              className="mt-3 flex items-center gap-2 rounded-md border border-[#166534] bg-[#F0FDF4] px-3 py-2 text-xs font-semibold text-[#166534]"
            >
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{appliedMessage}</span>
            </p>
          )}

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              disabled={recommendations.length === 0}
              onClick={handleApply}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-golden px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark disabled:opacity-40"
            >
              Masukkan Paket ke Pesanan
            </button>
            <a
              href={consultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[#85807A] bg-charcoal px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:border-golden hover:text-golden"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Tanya Harga via WA
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
