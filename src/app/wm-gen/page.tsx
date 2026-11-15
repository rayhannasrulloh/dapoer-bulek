"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  RotateCcw,
  UploadCloud,
} from "lucide-react";

const SUPPORTED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

export default function WatermarkGenerator() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("image/jpeg");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processFile = (file: File) => {
    if (!SUPPORTED_MIME_TYPES.has(file.type)) {
      setErrorMessage("Format berkas tidak didukung. Gunakan gambar PNG, JPG, JPEG, atau WebP.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setFileName(file.name);
    setFileType(file.type === "image/png" ? "image/png" : "image/jpeg");

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage("Berkas gambar gagal dibaca. Silakan coba pilih berkas lain.");
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        setIsProcessing(false);
        setErrorMessage("Gambar tidak dapat dimuat. Pastikan berkas tidak rusak.");
      };

      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setIsProcessing(false);
          setErrorMessage("Kanvas pratinjau belum siap. Silakan ulangi proses unggah.");
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsProcessing(false);
          setErrorMessage("Browser tidak mendukung pemrosesan kanvas 2D.");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const watermarkText = "dapoerbulek_354";
        const fontSize = Math.max(18, Math.round(img.width / 15));

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(250, 250, 249, 0.4)";
        ctx.fillText(watermarkText, img.width / 2, img.height / 2);

        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        setPreviewUrl(canvas.toDataURL(outputType, 0.92));
        setDimensions({ width: img.width, height: img.height });
        setIsProcessing(false);
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

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

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!previewUrl) return;

    const lastDotIndex = fileName.lastIndexOf(".");
    const baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
    const extension = fileType === "image/png" ? "png" : "jpg";
    const downloadName = `${baseName}_watermarked.${extension}`;

    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setFileName("");
    setDimensions(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8"
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

      <main id="wm-main" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="border-b border-charcoal-border pb-8">
          <p className="text-sm font-semibold text-golden">Alat Internal Dapur</p>
          <h1 className="mt-2 font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-tight text-cream">
            Generator Watermark Foto Produk
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-light-secondary">
            Tambahkan tanda air <span className="font-semibold text-cream">dapoerbulek_354</span> di bagian tengah foto hidangan sebelum dipublikasikan ke media sosial.
          </p>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-lg border border-red-400/40 bg-[#2B1414] p-4 text-sm text-[#FCA5A5]"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="mt-8">
          {!previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors sm:p-10 ${
                isDragging
                  ? "border-golden bg-charcoal-surface"
                  : "border-charcoal-border bg-charcoal-surface"
              }`}
            >
              <input
                id="wm-file-input"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="sr-only"
              />

              {isProcessing ? (
                <div aria-live="polite" className="flex flex-col items-center gap-3">
                  <div
                    className="h-10 w-10 animate-spin rounded-full border-2 border-golden border-t-transparent"
                    aria-hidden="true"
                  />
                  <p className="text-base font-semibold text-cream">Memproses gambar...</p>
                  <p className="text-sm text-ink-light-muted">
                    Menambahkan tanda air dapoerbulek_354
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-charcoal-border bg-charcoal text-golden">
                    <UploadCloud className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-cream">
                    Unggah Foto Hidangan
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-light-secondary">
                    Seret berkas ke kotak ini atau tekan tombol di bawah. Mendukung format PNG, JPG, JPEG, dan WebP.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-golden px-6 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
                    >
                      Pilih Foto dari Perangkat
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-charcoal-border bg-charcoal-surface p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-light-secondary">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <ImageIcon className="h-4 w-4 text-golden" aria-hidden="true" />
                    {fileName}
                  </span>
                  {dimensions && (
                    <span>
                      Resolusi asli: {dimensions.width} &times; {dimensions.height} px
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center overflow-hidden rounded-lg border border-charcoal-border bg-charcoal p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt={`Pratinjau ${fileName} dengan watermark dapoerbulek_354`}
                    width={dimensions?.width}
                    height={dimensions?.height}
                    className="max-h-[480px] h-auto w-auto rounded object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-golden px-6 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-golden-dark active:bg-golden-dark"
                >
                  <Download className="h-5 w-5" aria-hidden="true" />
                  Unduh Gambar Berwatermark
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-charcoal-border bg-charcoal-surface px-6 py-3 text-base font-semibold text-cream transition-colors hover:border-golden hover:text-golden"
                >
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                  Unggah Foto Lain
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-charcoal-border bg-charcoal-surface p-4 text-sm text-ink-light-secondary">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-golden" aria-hidden="true" />
                <p>
                  <span className="font-semibold text-cream">Catatan pemrosesan:</span>{" "}
                  Tanda air <span className="font-mono text-cream">dapoerbulek_354</span> dipasang di tengah gambar dengan opasitas 40% dan ukuran huruf proporsional terhadap lebar gambar asli.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
