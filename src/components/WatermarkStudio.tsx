"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Crop,
  Download,
  FolderArchive,
  Image as ImageIcon,
  Layers,
  Plus,
  RotateCcw,
  Trash2,
  Type,
  UploadCloud,
  X,
} from "lucide-react";
import { MENU_ITEMS } from "@/data/menu";
import {
  ASPECT_PRESETS,
  DEFAULT_WATERMARK_SETTINGS,
  FramingMode,
  POSITION_OPTIONS,
  WatermarkColor,
  WatermarkContentMode,
  WatermarkSettings,
  buildOutputFileName,
  canvasToBlob,
  renderWatermarkedCanvas,
  resolveCanvasFonts,
} from "@/lib/watermarkCanvas";
import { buildZipBlob } from "@/lib/zipBuilder";

const SUPPORTED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

interface UploadedPhoto {
  id: string;
  fileName: string;
  outputMime: "image/png" | "image/jpeg";
  objectUrl: string;
  naturalWidth: number;
  naturalHeight: number;
}

type ControlTab = "watermark" | "crop" | "template";

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Gagal memuat gambar: ${src}`));
    img.src = src;
  });
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function WatermarkStudio() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);
  const [settings, setSettings] = useState<WatermarkSettings>(
    DEFAULT_WATERMARK_SETTINGS
  );
  const [activeTab, setActiveTab] = useState<ControlTab>("watermark");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [exportProgress, setExportProgress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const photosRef = useRef<UploadedPhoto[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    let active = true;
    loadImageElement("/logo/logo.png")
      .then((img) => {
        if (active) setLogoImg(img);
      })
      .catch(() => {
        // Logo remains optional if unavailable
      });

    return () => {
      active = false;
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.objectUrl));
    };
  }, []);

  const activePhoto =
    photos.find((photo) => photo.id === activePhotoId) ?? photos[0] ?? null;

  const displayedDimensions = activePhoto ? previewDimensions : null;

  useEffect(() => {
    if (!activePhoto || !previewCanvasRef.current) {
      return;
    }

    let cancelled = false;
    loadImageElement(activePhoto.objectUrl)
      .then((img) => {
        if (cancelled || !previewCanvasRef.current) return;
        const fonts = resolveCanvasFonts();
        const dims = renderWatermarkedCanvas(
          previewCanvasRef.current,
          img,
          logoImg,
          settings,
          fonts
        );
        setPreviewDimensions(dims);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage(
            `Gambar ${activePhoto.fileName} tidak dapat dirender di kanvas.`
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activePhoto, logoImg, settings]);

  const handleIncomingFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const invalidNames: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      if (!SUPPORTED_MIME_TYPES.has(file.type)) {
        invalidNames.push(file.name);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setErrorMessage(
        "Format berkas tidak didukung. Gunakan gambar PNG, JPG, JPEG, atau WebP."
      );
      return;
    }

    setErrorMessage(
      invalidNames.length > 0
        ? `${invalidNames.length} berkas dilewati karena bukan PNG/JPG/WebP: ${invalidNames.join(", ")}`
        : null
    );
    setStatusMessage(null);
    setIsLoadingFiles(true);

    try {
      const loaded: UploadedPhoto[] = [];
      for (const file of validFiles) {
        const objectUrl = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(objectUrl);
          loaded.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            fileName: file.name,
            outputMime: file.type === "image/png" ? "image/png" : "image/jpeg",
            objectUrl,
            naturalWidth: img.naturalWidth || img.width,
            naturalHeight: img.naturalHeight || img.height,
          });
        } catch {
          URL.revokeObjectURL(objectUrl);
          invalidNames.push(file.name);
        }
      }

      if (loaded.length > 0) {
        setPhotos((prev) => [...prev, ...loaded]);
        setActivePhotoId((prevId) => prevId ?? loaded[0].id);
        setStatusMessage(`${loaded.length} foto siap diproses.`);
      }
    } finally {
      setIsLoadingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, []);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void handleIncomingFiles(event.dataTransfer.files);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void handleIncomingFiles(event.target.files);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.objectUrl);
      }
      const next = prev.filter((p) => p.id !== id);
      if (activePhotoId === id) {
        setActivePhotoId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  const handleClearAllPhotos = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.objectUrl));
    setPhotos([]);
    setActivePhotoId(null);
    setErrorMessage(null);
    setStatusMessage(null);
    setPreviewDimensions(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadSingle = async () => {
    if (!activePhoto || exportProgress) return;
    setErrorMessage(null);
    setExportProgress("Menyiapkan unduhan...");

    try {
      const exportCanvas = document.createElement("canvas");
      const img = await loadImageElement(activePhoto.objectUrl);
      const fonts = resolveCanvasFonts();
      renderWatermarkedCanvas(exportCanvas, img, logoImg, settings, fonts);
      const blob = await canvasToBlob(exportCanvas, activePhoto.outputMime);
      const outName = buildOutputFileName(
        activePhoto.fileName,
        activePhoto.outputMime,
        settings.aspectPreset
      );
      triggerBlobDownload(blob, outName);
      setStatusMessage(`Berhasil mengunduh ${outName}.`);
    } catch {
      setErrorMessage("Gagal membuat berkas unduhan. Silakan coba lagi.");
    } finally {
      setExportProgress(null);
    }
  };

  const handleDownloadBatchZip = async () => {
    if (photos.length === 0 || exportProgress) return;
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const exportCanvas = document.createElement("canvas");
      const fonts = resolveCanvasFonts();
      const entries: { name: string; data: Uint8Array }[] = [];

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        setExportProgress(`Memproses ${i + 1} dari ${photos.length} foto...`);
        const img = await loadImageElement(photo.objectUrl);
        renderWatermarkedCanvas(exportCanvas, img, logoImg, settings, fonts);
        const blob = await canvasToBlob(exportCanvas, photo.outputMime);
        const buffer = await blob.arrayBuffer();
        entries.push({
          name: buildOutputFileName(
            photo.fileName,
            photo.outputMime,
            settings.aspectPreset
          ),
          data: new Uint8Array(buffer),
        });
      }

      setExportProgress("Mengemas arsip ZIP...");
      const zipBlob = buildZipBlob(entries);
      const zipName =
        settings.aspectPreset === "original"
          ? "dapoer-bulek-watermark.zip"
          : `dapoer-bulek-${settings.aspectPreset}.zip`;
      triggerBlobDownload(zipBlob, zipName);
      setStatusMessage(
        `${entries.length} foto berhasil dikemas dan diunduh ke ${zipName}.`
      );
    } catch {
      setErrorMessage(
        "Terjadi kendala saat mengemas ZIP batch. Coba kurangi jumlah foto sekaligus atau unduh satu per satu."
      );
    } finally {
      setExportProgress(null);
    }
  };

  const updateSettings = <K extends keyof WatermarkSettings>(
    key: K,
    value: WatermarkSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateTemplate = <K extends keyof WatermarkSettings["template"]>(
    key: K,
    value: WatermarkSettings["template"][K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      template: { ...prev.template, [key]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-charcoal text-cream">
      <a
        href="#wm-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-golden focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-charcoal"
      >
        Langsung ke alat watermark
      </a>

      <header className="border-b border-charcoal-border bg-charcoal">
        <nav
          aria-label="Navigasi alat watermark"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8"
        >
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md pr-3 text-sm font-semibold text-ink-light-secondary transition-colors hover:text-golden"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kembali ke Beranda
          </Link>

          <span className="font-serif text-lg font-bold text-cream">
            Dapoer <span className="text-golden">Bulek</span>
          </span>
        </nav>
      </header>

      <main
        id="wm-main"
        tabIndex={-1}
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-charcoal-border pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-golden">
              Alat Internal Dapur
            </p>
            <h1 className="mt-2 font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-tight text-cream">
              Watermark &amp; Template Konten Produk
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-light-secondary sm:text-base">
              Proses satu atau banyak foto sekaligus, atur posisi watermark dan
              logo, sesuaikan rasio IG Feed (4:5) atau Story/Status WA (9:16),
              lalu unduh satuan atau sebagai arsip ZIP.
            </p>
          </div>

          {photos.length > 0 && (
            <button
              type="button"
              onClick={() => setSettings(DEFAULT_WATERMARK_SETTINGS)}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md border border-charcoal-border bg-charcoal-surface px-4 py-2 text-xs font-semibold text-ink-light-secondary transition-colors hover:border-golden hover:text-golden"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Pengaturan
            </button>
          )}
        </div>

        <input
          id="wm-file-input"
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="sr-only"
        />

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-lg border border-red-400/40 bg-[#2B1414] p-4 text-sm text-[#FCA5A5]"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{errorMessage}</p>
          </div>
        )}

        {statusMessage && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 flex items-start gap-3 rounded-lg border border-charcoal-border bg-charcoal-surface p-4 text-sm text-ink-light-secondary"
          >
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-golden"
              aria-hidden="true"
            />
            <p>{statusMessage}</p>
          </div>
        )}

        {photos.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-12 ${
              isDragging
                ? "border-golden bg-charcoal-surface"
                : "border-charcoal-border bg-charcoal-surface"
            }`}
          >
            {isLoadingFiles ? (
              <div aria-live="polite" className="flex flex-col items-center gap-3">
                <div
                  className="h-10 w-10 animate-spin rounded-full border-2 border-golden border-t-transparent"
                  aria-hidden="true"
                />
                <p className="text-base font-semibold text-cream">
                  Membaca berkas gambar...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-charcoal-border bg-charcoal text-golden">
                  <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-serif text-xl font-bold text-cream">
                  Unggah Foto Hidangan (Bisa Banyak Sekaligus)
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-light-secondary">
                  Seret beberapa foto ke kotak ini atau klik tombol di bawah.
                  Mendukung PNG, JPG, JPEG, dan WebP tanpa mengirim berkas ke
                  server.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-golden px-7 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Pilih Foto dari Perangkat
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
            {/* Left 7 columns: Live Preview, Batch Strip & Export */}
            <div className="space-y-5 lg:col-span-7">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-xl border bg-charcoal-surface p-4 transition-colors sm:p-5 ${
                  isDragging ? "border-golden" : "border-charcoal-border"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-light-secondary">
                  <span className="inline-flex min-w-0 items-center gap-1.5 font-medium">
                    <ImageIcon
                      className="h-4 w-4 shrink-0 text-golden"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {activePhoto?.fileName ?? "Pratinjau"}
                    </span>
                  </span>
                  {displayedDimensions && (
                    <span>
                      Output: {displayedDimensions.width} &times;{" "}
                      {displayedDimensions.height} px
                    </span>
                  )}
                </div>

                <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-lg border border-charcoal-border bg-charcoal p-2">
                  <canvas
                    ref={previewCanvasRef}
                    aria-label={
                      activePhoto
                        ? `Pratinjau ${activePhoto.fileName} dengan watermark`
                        : "Pratinjau kanvas watermark"
                    }
                    className="max-h-[520px] h-auto max-w-full rounded object-contain"
                  />
                </div>
              </div>

              {/* Batch Thumbnail Strip */}
              <div className="rounded-xl border border-charcoal-border bg-charcoal-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-cream">
                    Antrean Batch ({photos.length} foto)
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-charcoal-border bg-charcoal px-3.5 py-2 text-xs font-semibold text-cream transition-colors hover:border-golden hover:text-golden"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      Tambah Foto
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllPhotos}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-charcoal-border bg-charcoal px-3.5 py-2 text-xs font-semibold text-[#FCA5A5] transition-colors hover:border-red-400/60"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Hapus Semua
                    </button>
                  </div>
                </div>

                <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {photos.map((photo) => {
                    const isActive = activePhoto?.id === photo.id;
                    return (
                      <li
                        key={photo.id}
                        className={`overflow-hidden rounded-lg border transition-colors ${
                          isActive
                            ? "border-golden bg-charcoal ring-1 ring-golden"
                            : "border-charcoal-border bg-charcoal"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setActivePhotoId(photo.id)}
                          aria-label={`Pilih pratinjau ${photo.fileName}`}
                          className="block w-full text-left"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.objectUrl}
                            alt={photo.fileName}
                            width={photo.naturalWidth}
                            height={photo.naturalHeight}
                            className="aspect-[4/3] h-auto w-full object-cover"
                          />
                        </button>
                        <div className="flex items-center justify-between gap-1 border-t border-charcoal-border pl-2.5">
                          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-ink-light-secondary">
                            {photo.fileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            aria-label={`Hapus ${photo.fileName} dari antrean`}
                            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center text-ink-light-secondary transition-colors hover:text-[#FCA5A5]"
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Download Actions */}
              <div className="space-y-3">
                {exportProgress && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="rounded-lg border border-charcoal-border bg-charcoal-surface px-4 py-2.5 text-sm font-medium text-golden"
                  >
                    {exportProgress}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={Boolean(exportProgress)}
                    onClick={handleDownloadBatchZip}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-golden px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark disabled:opacity-50 sm:text-base"
                  >
                    <FolderArchive className="h-5 w-5" aria-hidden="true" />
                    Unduh Semua ZIP ({photos.length} Foto)
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(exportProgress) || !activePhoto}
                    onClick={handleDownloadSingle}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-charcoal-border bg-charcoal-surface px-5 py-3 text-sm font-semibold text-cream transition-colors hover:border-golden hover:text-golden disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Unduh Foto Ini
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 columns: Controls */}
            <div className="rounded-xl border border-charcoal-border bg-charcoal-surface lg:sticky lg:top-6 lg:col-span-5">
              {/* Control Tabs */}
              <div
                role="tablist"
                aria-label="Pengaturan watermark dan template"
                className="grid grid-cols-3 border-b border-charcoal-border"
              >
                {(
                  [
                    { id: "watermark", label: "Watermark", icon: Type },
                    { id: "crop", label: "Rasio & Crop", icon: Crop },
                    { id: "template", label: "Template", icon: Layers },
                  ] as const
                ).map((tab) => {
                  const selected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex min-h-[48px] items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                        selected
                          ? "border-golden bg-charcoal text-golden"
                          : "border-transparent text-ink-light-secondary hover:text-cream"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-5 p-5">
                {activeTab === "watermark" && (
                  <>
                    {/* Mode Konten */}
                    <fieldset>
                      <legend className="text-xs font-semibold tracking-wide text-golden uppercase">
                        Isi Watermark
                      </legend>
                      <div className="mt-2.5 grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: "text", label: "Teks saja" },
                            { id: "logo", label: "Logo saja" },
                            { id: "both", label: "Logo + Teks" },
                          ] as { id: WatermarkContentMode; label: string }[]
                        ).map((mode) => {
                          const active = settings.contentMode === mode.id;
                          return (
                            <label
                              key={mode.id}
                              className={`flex min-h-[44px] items-center justify-center rounded-md border px-2 text-center text-xs font-semibold transition-colors ${
                                active
                                  ? "border-golden bg-golden text-charcoal"
                                  : "border-charcoal-border bg-charcoal text-ink-light-secondary hover:border-ink-light-muted"
                              }`}
                            >
                              <input
                                type="radio"
                                name="wm-content-mode"
                                value={mode.id}
                                checked={active}
                                onChange={() =>
                                  updateSettings("contentMode", mode.id)
                                }
                                className="sr-only"
                              />
                              <span>{mode.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* Text Input */}
                    {(settings.contentMode === "text" ||
                      settings.contentMode === "both") && (
                      <div>
                        <label
                          htmlFor="wm-text-input"
                          className="block text-xs font-semibold tracking-wide text-golden uppercase"
                        >
                          Teks Watermark (bisa multi-baris)
                        </label>
                        <textarea
                          id="wm-text-input"
                          rows={2}
                          value={settings.text}
                          onChange={(e) => updateSettings("text", e.target.value)}
                          placeholder={"Instagram\n@dapoerbule_354"}
                          className="mt-2 w-full rounded-md border border-charcoal-border bg-charcoal px-3 py-2 text-sm text-cream placeholder:text-ink-light-muted"
                        />
                      </div>
                    )}

                    {/* Position */}
                    <fieldset>
                      <legend className="text-xs font-semibold tracking-wide text-golden uppercase">
                        Posisi Watermark
                      </legend>
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {POSITION_OPTIONS.map((pos) => {
                          const active = settings.position === pos.id;
                          return (
                            <label
                              key={pos.id}
                              className={`flex min-h-[44px] items-center justify-center rounded-md border px-3 text-center text-xs font-semibold transition-colors ${
                                active
                                  ? "border-golden bg-golden text-charcoal"
                                  : "border-charcoal-border bg-charcoal text-ink-light-secondary hover:border-ink-light-muted"
                              }`}
                            >
                              <input
                                type="radio"
                                name="wm-position"
                                value={pos.id}
                                checked={active}
                                onChange={() =>
                                  updateSettings("position", pos.id)
                                }
                                className="sr-only"
                              />
                              <span>{pos.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* Color */}
                    {(settings.contentMode === "text" ||
                      settings.contentMode === "both") && (
                      <fieldset>
                        <legend className="text-xs font-semibold tracking-wide text-golden uppercase">
                          Warna Teks
                        </legend>
                        <div className="mt-2.5 grid grid-cols-3 gap-2">
                          {(
                            [
                              { id: "cream", label: "Putih Cream" },
                              { id: "golden", label: "Emas" },
                              { id: "dark", label: "Gelap" },
                            ] as { id: WatermarkColor; label: string }[]
                          ).map((clr) => {
                            const active = settings.color === clr.id;
                            return (
                              <label
                                key={clr.id}
                                className={`flex min-h-[44px] items-center justify-center rounded-md border px-2 text-center text-xs font-semibold transition-colors ${
                                  active
                                    ? "border-golden bg-golden text-charcoal"
                                    : "border-charcoal-border bg-charcoal text-ink-light-secondary hover:border-ink-light-muted"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="wm-color"
                                  value={clr.id}
                                  checked={active}
                                  onChange={() =>
                                    updateSettings("color", clr.id)
                                  }
                                  className="sr-only"
                                />
                                <span>{clr.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    )}

                    {/* Size & Opacity Sliders */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <label
                            htmlFor="wm-size-range"
                            className="font-semibold text-cream"
                          >
                            Ukuran Watermark
                          </label>
                          <span className="font-semibold text-golden">
                            {settings.sizePercent}%
                          </span>
                        </div>
                        <input
                          id="wm-size-range"
                          type="range"
                          min={5}
                          max={100}
                          step={1}
                          value={settings.sizePercent}
                          onChange={(e) =>
                            updateSettings(
                              "sizePercent",
                              Number(e.target.value)
                            )
                          }
                          className="mt-2 h-8 w-full accent-[#F59E0B]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <label
                            htmlFor="wm-opacity-range"
                            className="font-semibold text-cream"
                          >
                            Opasitas (Transparansi)
                          </label>
                          <span className="font-semibold text-golden">
                            {settings.opacityPercent}%
                          </span>
                        </div>
                        <input
                          id="wm-opacity-range"
                          type="range"
                          min={5}
                          max={90}
                          step={5}
                          value={settings.opacityPercent}
                          onChange={(e) =>
                            updateSettings(
                              "opacityPercent",
                              Number(e.target.value)
                            )
                          }
                          className="mt-2 h-8 w-full accent-[#F59E0B]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "crop" && (
                  <>
                    <fieldset>
                      <legend className="text-xs font-semibold tracking-wide text-golden uppercase">
                        Preset Rasio Output
                      </legend>
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        {ASPECT_PRESETS.map((preset) => {
                          const active = settings.aspectPreset === preset.id;
                          return (
                            <label
                              key={preset.id}
                              className={`flex min-h-[54px] flex-col justify-center rounded-md border px-3 py-2 transition-colors ${
                                active
                                  ? "border-golden bg-golden text-charcoal"
                                  : "border-charcoal-border bg-charcoal text-cream hover:border-ink-light-muted"
                              }`}
                            >
                              <input
                                type="radio"
                                name="wm-aspect-preset"
                                value={preset.id}
                                checked={active}
                                onChange={() =>
                                  updateSettings("aspectPreset", preset.id)
                                }
                                className="sr-only"
                              />
                              <span className="text-xs font-bold">
                                {preset.label}
                              </span>
                              <span
                                className={`text-[11px] ${
                                  active
                                    ? "text-charcoal/80"
                                    : "text-ink-light-muted"
                                }`}
                              >
                                {preset.ratioText}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    {settings.aspectPreset !== "original" ? (
                      <>
                        <fieldset>
                          <legend className="text-xs font-semibold tracking-wide text-golden uppercase">
                            Cara Penyesuaian Foto
                          </legend>
                          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {(
                              [
                                {
                                  id: "cover",
                                  label: "Isi Penuh (Crop)",
                                  desc: "Memenuhi bingkai tanpa ruang kosong",
                                },
                                {
                                  id: "contain-dark",
                                  label: "Pas / Bingkai Gelap",
                                  desc: "Foto utuh di atas latar charcoal #1A1A1A",
                                },
                              ] as {
                                id: FramingMode;
                                label: string;
                                desc: string;
                              }[]
                            ).map((mode) => {
                              const active = settings.framingMode === mode.id;
                              return (
                                <label
                                  key={mode.id}
                                  className={`flex min-h-[56px] flex-col justify-center rounded-md border px-3 py-2 transition-colors ${
                                    active
                                      ? "border-golden bg-charcoal ring-1 ring-golden"
                                      : "border-charcoal-border bg-charcoal hover:border-ink-light-muted"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="wm-framing-mode"
                                    value={mode.id}
                                    checked={active}
                                    onChange={() =>
                                      updateSettings("framingMode", mode.id)
                                    }
                                    className="sr-only"
                                  />
                                  <span
                                    className={`text-xs font-semibold ${
                                      active ? "text-golden" : "text-cream"
                                    }`}
                                  >
                                    {mode.label}
                                  </span>
                                  <span className="mt-0.5 text-[11px] text-ink-light-muted">
                                    {mode.desc}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </fieldset>

                        {settings.framingMode === "cover" && (
                          <div className="space-y-4 border-t border-charcoal-border pt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-cream">
                                Geser Fokus Crop
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  updateSettings("cropFocusX", 50);
                                  updateSettings("cropFocusY", 50);
                                }}
                                className="min-h-[44px] px-2 text-xs font-semibold text-golden underline underline-offset-4"
                              >
                                Reset Tengah
                              </button>
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-ink-light-secondary">
                                <label htmlFor="wm-focus-x">
                                  Posisi Horizontal
                                </label>
                                <span>{settings.cropFocusX}%</span>
                              </div>
                              <input
                                id="wm-focus-x"
                                type="range"
                                min={0}
                                max={100}
                                value={settings.cropFocusX}
                                onChange={(e) =>
                                  updateSettings(
                                    "cropFocusX",
                                    Number(e.target.value)
                                  )
                                }
                                className="mt-1.5 h-8 w-full accent-[#F59E0B]"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-xs text-ink-light-secondary">
                                <label htmlFor="wm-focus-y">
                                  Posisi Vertikal
                                </label>
                                <span>{settings.cropFocusY}%</span>
                              </div>
                              <input
                                id="wm-focus-y"
                                type="range"
                                min={0}
                                max={100}
                                value={settings.cropFocusY}
                                onChange={(e) =>
                                  updateSettings(
                                    "cropFocusY",
                                    Number(e.target.value)
                                  )
                                }
                                className="mt-1.5 h-8 w-full accent-[#F59E0B]"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="rounded-lg border border-charcoal-border bg-charcoal p-3.5 text-xs leading-relaxed text-ink-light-secondary">
                        Mode Asli menjaga dimensi piksel foto apa adanya tanpa
                        pemotongan. Pilih preset IG Feed (4:5), Square (1:1),
                        atau Story/Status WA (9:16) untuk menyesuaikan bingkai.
                      </p>
                    )}
                  </>
                )}

                {activeTab === "template" && (
                  <>
                    <label className="flex min-h-[48px] items-center justify-between gap-3 rounded-lg border border-charcoal-border bg-charcoal px-4 py-2.5">
                      <span>
                        <span className="block text-sm font-semibold text-cream">
                          Aktifkan Template Menu &amp; Harga
                        </span>
                        <span className="block text-xs text-ink-light-muted">
                          Tambahkan judul menu dan label harga di bagian bawah
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.template.enabled}
                        onChange={(e) =>
                          updateTemplate("enabled", e.target.checked)
                        }
                        className="h-5 w-5 shrink-0 accent-[#F59E0B]"
                      />
                    </label>

                    {settings.template.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="wm-menu-preset"
                            className="block text-xs font-semibold tracking-wide text-golden uppercase"
                          >
                            Pilih Cepat dari Katalog (Opsional)
                          </label>
                          <select
                            id="wm-menu-preset"
                            value=""
                            onChange={(e) => {
                              const found = MENU_ITEMS.find(
                                (item) => item.id === e.target.value
                              );
                              if (found) {
                                updateTemplate("menuName", found.name);
                              }
                            }}
                            className="mt-1.5 min-h-[44px] w-full rounded-md border border-charcoal-border bg-charcoal px-3 py-2 text-sm text-cream"
                          >
                            <option value="">
                              -- Isi cepat nama menu dari katalog --
                            </option>
                            {MENU_ITEMS.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="wm-menu-name"
                            className="block text-xs font-semibold text-cream"
                          >
                            Nama Menu
                          </label>
                          <input
                            id="wm-menu-name"
                            type="text"
                            value={settings.template.menuName}
                            onChange={(e) =>
                              updateTemplate("menuName", e.target.value)
                            }
                            placeholder="Contoh: Tumpeng Nasi Kuning Klasik"
                            className="mt-1.5 min-h-[44px] w-full rounded-md border border-charcoal-border bg-charcoal px-3 py-2 text-sm text-cream placeholder:text-ink-light-muted"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wm-price-text"
                            className="block text-xs font-semibold text-cream"
                          >
                            Harga / Keterangan Porsi
                          </label>
                          <input
                            id="wm-price-text"
                            type="text"
                            value={settings.template.priceText}
                            onChange={(e) =>
                              updateTemplate("priceText", e.target.value)
                            }
                            placeholder="Contoh: Mulai Rp 350.000 (10 orang)"
                            className="mt-1.5 min-h-[44px] w-full rounded-md border border-charcoal-border bg-charcoal px-3 py-2 text-sm text-cream placeholder:text-ink-light-muted"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="wm-footer-text"
                            className="block text-xs font-semibold text-cream"
                          >
                            Info Bawah (Pre-Order / Kontak)
                          </label>
                          <input
                            id="wm-footer-text"
                            type="text"
                            value={settings.template.footerText}
                            onChange={(e) =>
                              updateTemplate("footerText", e.target.value)
                            }
                            placeholder="Pre-Order Dapoer Bulek · WA 0821-9356-2480"
                            className="mt-1.5 min-h-[44px] w-full rounded-md border border-charcoal-border bg-charcoal px-3 py-2 text-sm text-cream placeholder:text-ink-light-muted"
                          />
                        </div>

                        <label className="flex min-h-[44px] items-center gap-2.5 text-xs font-medium text-ink-light-secondary">
                          <input
                            type="checkbox"
                            checked={settings.template.showBrandBadge}
                            onChange={(e) =>
                              updateTemplate("showBrandBadge", e.target.checked)
                            }
                            className="h-4 w-4 shrink-0 accent-[#F59E0B]"
                          />
                          <span>
                            Tampilkan badge logo Dapoer Bulek di sudut atas
                          </span>
                        </label>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
