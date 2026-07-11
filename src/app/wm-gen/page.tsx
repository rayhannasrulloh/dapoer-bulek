"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Link from "next/link";
import {
  UploadCloud,
  Download,
  RotateCcw,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function WatermarkGenerator() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("image/jpeg");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Format berkas harus berupa gambar (PNG, JPG, JPEG).");
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas to original image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the uploaded image
        ctx.drawImage(img, 0, 0);

        // Watermark configurations
        const text = "dapoerbulek_354";
        
        // Dynamically size the font relative to image width
        const fontSize = Math.max(18, img.width / 15);
        
        // Use a clean Sans-Serif font for the watermark
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw watermark with 50% opacity
        ctx.fillStyle = "rgba(250, 250, 249, 0.5)"; // Soft Off-White/Cream at 0.5 alpha
        
        // Center of the image
        const x = img.width / 2;
        const y = img.height / 2;

        ctx.fillText(text, x, y);

        // Set state for preview and dimension details
        setPreviewUrl(canvas.toDataURL(file.type));
        setDimensions({ width: img.width, height: img.height });
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!previewUrl) return;

    // Construct download filename (e.g. originalName_watermarked.jpg)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-charcoal text-cream font-sans pb-20">
      {/* Top Header / Navigation */}
      <header className="bg-charcoal-light/50 backdrop-blur-xl sticky top-0 z-10 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cream/70 transition-colors hover:text-golden"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Landing Page
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="font-[var(--font-playfair)] text-lg font-bold tracking-wide">
              Dapoer <span className="text-golden">Bulek</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* Title Area */}
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-golden/10 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-golden" />
            <span className="text-xs font-semibold tracking-wider text-golden uppercase">
              Foto Produk Tools
            </span>
          </div>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-cream sm:text-4xl lg:text-5xl">
            Watermark <span className="text-golden">Generator</span>
          </h1>
          <p className="mt-4 text-base text-cream/60 max-w-xl mx-auto">
            Unggah foto hidangan Dapoer Bulek untuk menambahkan watermark resmi secara otomatis sebelum dibagikan.
          </p>
        </div>

        {/* Canvas element (hidden) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Upload and Processing State Card */}
        {!previewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`cursor-pointer rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center min-h-[350px] text-center ${
              isDragging
                ? "bg-golden/10 text-golden"
                : "bg-charcoal-light/50 hover:bg-charcoal-light/80 text-cream/70"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-golden/10 flex items-center justify-center animate-spin">
                  <div className="h-6 w-6 rounded-full border-2 border-golden border-t-transparent" />
                </div>
                <h3 className="font-semibold text-lg text-cream">Memproses Gambar...</h3>
                <p className="text-sm text-cream/50">Menerapkan watermark dapoerbulek_354</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-golden/10 text-golden">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="font-[var(--font-playfair)] text-xl font-bold text-cream mb-2">
                  Tarik & Lepaskan Gambar
                </h3>
                <p className="text-sm text-cream/50 mb-6 max-w-xs mx-auto">
                  Atau klik untuk memilih berkas dari perangkat Anda. Mendukung file PNG, JPG, atau JPEG.
                </p>
                <div className="rounded-full bg-golden px-6 py-2.5 text-sm font-semibold text-charcoal">
                  Pilih Gambar
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Preview and Action controls */
          <div className="space-y-8 animate-fade-in">
            {/* Live Preview Area */}
            <div className="rounded-3xl bg-charcoal-light/50 p-6 flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-between mb-4 text-xs text-cream/50 px-2">
                <span className="flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  {fileName}
                </span>
                {dimensions && (
                  <span>
                    Resolusi: {dimensions.width} &times; {dimensions.height} px
                  </span>
                )}
              </div>
              
              {/* Image Preview Container */}
              <div className="relative max-h-[500px] w-full overflow-hidden rounded-2xl bg-charcoal flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview watermarked"
                  className="max-h-[480px] w-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-golden to-golden-dark px-8 py-4 text-base font-semibold text-charcoal transition-all duration-300 hover:scale-105"
              >
                <Download className="h-5 w-5" />
                Download Gambar Berwatermark
              </button>
              
              <button
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-cream/5 px-8 py-4 text-base font-semibold text-cream transition-all duration-300 hover:bg-cream/10 hover:text-golden"
              >
                <RotateCcw className="h-5 w-5" />
                Reset / Unggah Ulang
              </button>
            </div>

            {/* Instruction Tip */}
            <div className="flex items-start gap-3 rounded-2xl bg-golden/5 p-4 text-sm text-golden/80 max-w-2xl mx-auto">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Info Pemrosesan:</span> Watermark <span className="font-mono">dapoerbulek_354</span> dipasang dengan opasitas 50% di tengah gambar. Skala tulisan otomatis menyesuaikan dengan dimensi gambar asli agar proporsional dan tidak pecah saat diunduh.
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
