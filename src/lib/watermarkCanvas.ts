export type WatermarkPosition =
  | "center"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "diagonal";

export type WatermarkContentMode = "text" | "logo" | "both";
export type WatermarkColor = "cream" | "golden" | "dark";
export type AspectPreset = "original" | "ig-feed" | "square" | "ig-story";
export type FramingMode = "cover" | "contain-dark";

export interface PromoTemplateConfig {
  enabled: boolean;
  menuName: string;
  priceText: string;
  footerText: string;
  showBrandBadge: boolean;
}

export interface WatermarkSettings {
  contentMode: WatermarkContentMode;
  text: string;
  position: WatermarkPosition;
  sizePercent: number;
  opacityPercent: number;
  color: WatermarkColor;
  aspectPreset: AspectPreset;
  framingMode: FramingMode;
  cropFocusX: number;
  cropFocusY: number;
  template: PromoTemplateConfig;
}

export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  contentMode: "text",
  text: "Instagram\n@dapoerbule_354",
  position: "center",
  sizePercent: 50,
  opacityPercent: 50,
  color: "cream",
  aspectPreset: "original",
  framingMode: "cover",
  cropFocusX: 50,
  cropFocusY: 50,
  template: {
    enabled: false,
    menuName: "Tumpeng Nasi Kuning Klasik",
    priceText: "Mulai Rp 350.000",
    footerText: "Pre-Order Dapoer Bulek · WA 0821-9356-2480",
    showBrandBadge: true,
  },
};

export const ASPECT_PRESETS: {
  id: AspectPreset;
  label: string;
  ratioText: string;
  width?: number;
  height?: number;
}[] = [
  { id: "original", label: "Asli", ratioText: "Sesuai foto" },
  {
    id: "ig-feed",
    label: "IG Feed",
    ratioText: "4:5 (1080x1350)",
    width: 1080,
    height: 1350,
  },
  {
    id: "square",
    label: "Square",
    ratioText: "1:1 (1080x1080)",
    width: 1080,
    height: 1080,
  },
  {
    id: "ig-story",
    label: "IG Story / Status WA",
    ratioText: "9:16 (1080x1920)",
    width: 1080,
    height: 1920,
  },
];

export const POSITION_OPTIONS: { id: WatermarkPosition; label: string }[] = [
  { id: "center", label: "Tengah" },
  { id: "diagonal", label: "Diagonal Berulang" },
  { id: "top-left", label: "Kiri Atas" },
  { id: "top-right", label: "Kanan Atas" },
  { id: "bottom-left", label: "Kiri Bawah" },
  { id: "bottom-right", label: "Kanan Bawah" },
];

export interface CanvasFonts {
  sans: string;
  serif: string;
}

export function resolveCanvasFonts(): CanvasFonts {
  if (typeof window === "undefined") {
    return {
      sans: "Inter, system-ui, sans-serif",
      serif: "Georgia, serif",
    };
  }
  const styles = getComputedStyle(document.documentElement);
  const playfairVar = styles.getPropertyValue("--font-playfair").trim();
  const interVar = styles.getPropertyValue("--font-inter").trim();
  const bodyFont = getComputedStyle(document.body).fontFamily.trim();

  return {
    sans: interVar || bodyFont || "system-ui, sans-serif",
    serif: playfairVar ? `${playfairVar}, Georgia, serif` : "Georgia, serif",
  };
}

function getTargetDimensions(
  imgWidth: number,
  imgHeight: number,
  aspectPreset: AspectPreset
): { width: number; height: number } {
  const preset = ASPECT_PRESETS.find((p) => p.id === aspectPreset);
  if (!preset?.width || !preset?.height) {
    return { width: imgWidth, height: imgHeight };
  }
  return { width: preset.width, height: preset.height };
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const candidate = `${current} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
      if (lines.length === maxLines - 1) {
        // Append remaining words onto the final line and ellipsize if needed
        const rest = [current, ...words.slice(i + 1)].join(" ");
        let trimmed = rest;
        while (
          trimmed.length > 1 &&
          ctx.measureText(`${trimmed}...`).width > maxWidth
        ) {
          trimmed = trimmed.slice(0, -1).trimEnd();
        }
        lines.push(trimmed === rest ? rest : `${trimmed}...`);
        return lines;
      }
    }
  }

  lines.push(current);
  return lines;
}

function getWatermarkColorCss(color: WatermarkColor, alpha: number): string {
  if (color === "golden") return `rgba(245, 158, 11, ${alpha})`;
  if (color === "dark") return `rgba(26, 26, 26, ${alpha})`;
  return `rgba(250, 250, 249, ${alpha})`;
}

function drawStampUnit(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  settings: WatermarkSettings,
  logoImg: HTMLImageElement | null,
  fontSize: number,
  logoSize: number,
  fonts: CanvasFonts,
  useShadow = true
) {
  const showLogo =
    (settings.contentMode === "logo" || settings.contentMode === "both") &&
    Boolean(logoImg);
  const showText =
    settings.contentMode === "text" || settings.contentMode === "both";

  const rawLines = settings.text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const textLines =
    showText && rawLines.length > 0
      ? rawLines
      : showText
        ? ["Instagram", "@dapoerbule_354"]
        : [];

  const lineHeight = Math.round(fontSize * 1.24);
  const textBlockHeight = textLines.length * lineHeight;
  const gap = showLogo && textLines.length > 0 ? Math.round(fontSize * 0.22) : 0;
  const totalHeight = (showLogo ? logoSize : 0) + gap + textBlockHeight;

  const alpha = Math.max(0.05, Math.min(1, settings.opacityPercent / 100));

  ctx.save();
  ctx.globalAlpha = alpha;
  if (useShadow) {
    ctx.shadowColor =
      settings.color === "dark"
        ? "rgba(250, 250, 249, 0.3)"
        : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = Math.max(2, Math.round(fontSize * 0.14));
  }

  let cursorY = centerY - totalHeight / 2;

  if (showLogo && logoImg) {
    const logoX = centerX - logoSize / 2;

    // Draw circular clipped brand logo so edges stay clean
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      logoX + logoSize / 2,
      cursorY + logoSize / 2,
      logoSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImg, logoX, cursorY, logoSize, logoSize);
    ctx.restore();

    cursorY += logoSize + gap;
  }

  if (textLines.length > 0) {
    ctx.font = `700 ${fontSize}px ${fonts.sans}`;
    ctx.fillStyle = getWatermarkColorCss(settings.color, 1);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    textLines.forEach((line, idx) => {
      const y = cursorY + lineHeight * (idx + 0.5);
      ctx.fillText(line, centerX, y);
    });
  }

  ctx.restore();
}

function measureStampBounds(
  ctx: CanvasRenderingContext2D,
  settings: WatermarkSettings,
  logoImg: HTMLImageElement | null,
  fontSize: number,
  logoSize: number,
  fonts: CanvasFonts
): { width: number; height: number } {
  const showLogo =
    (settings.contentMode === "logo" || settings.contentMode === "both") &&
    Boolean(logoImg);
  const showText =
    settings.contentMode === "text" || settings.contentMode === "both";

  const rawLines = settings.text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const textLines =
    showText && rawLines.length > 0
      ? rawLines
      : showText
        ? ["Instagram", "@dapoerbule_354"]
        : [];

  let textWidth = 0;
  if (textLines.length > 0) {
    ctx.save();
    ctx.font = `700 ${fontSize}px ${fonts.sans}`;
    for (const line of textLines) {
      textWidth = Math.max(textWidth, ctx.measureText(line).width);
    }
    ctx.restore();
  }

  const lineHeight = Math.round(fontSize * 1.24);
  const textHeight = textLines.length * lineHeight;
  const gap = showLogo && textLines.length > 0 ? Math.round(fontSize * 0.22) : 0;

  return {
    width: Math.max(showLogo ? logoSize : 0, textWidth),
    height: (showLogo ? logoSize : 0) + gap + textHeight,
  };
}

interface PromoTemplateMetrics {
  scrimHeight: number;
  titleFontSize: number;
  priceFontSize: number;
  footerFontSize: number;
  titleLineHeight: number;
  ruleHeight: number;
  ruleGap: number;
  priceGap: number;
  priceHeight: number;
  footerGap: number;
  footerHeight: number;
  contentHeight: number;
  scrimTopPad: number;
  padX: number;
  padBottom: number;
  menuLines: string[];
  priceLine: string;
  footerLine: string;
}

function measurePromoTemplate(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  template: PromoTemplateConfig,
  fonts: CanvasFonts
): PromoTemplateMetrics {
  const refDim = Math.min(canvasWidth, canvasHeight);
  const padX = Math.round(canvasWidth * 0.055);
  const padBottom = Math.round(canvasHeight * 0.042);

  const titleFontSize = Math.max(20, Math.round(refDim * 0.048));
  const priceFontSize = Math.max(16, Math.round(refDim * 0.036));
  const footerFontSize = Math.max(13, Math.round(refDim * 0.022));

  const maxTextWidth = canvasWidth - padX * 2;
  ctx.save();
  ctx.font = `700 ${titleFontSize}px ${fonts.serif}`;
  const menuLines = template.menuName.trim()
    ? wrapTextLines(ctx, template.menuName, maxTextWidth, 2)
    : [];
  ctx.restore();

  const priceLine = template.priceText.trim();
  const footerLine = template.footerText.trim();

  const titleLineHeight = Math.round(titleFontSize * 1.18);
  const ruleHeight = Math.max(3, Math.round(refDim * 0.004));
  const ruleGap = Math.round(refDim * 0.018);
  const priceGap = priceLine ? Math.round(refDim * 0.016) : 0;
  const priceHeight = priceLine ? Math.round(priceFontSize * 1.25) : 0;
  const footerGap = footerLine ? Math.round(refDim * 0.014) : 0;
  const footerHeight = footerLine ? Math.round(footerFontSize * 1.3) : 0;

  const contentHeight =
    ruleHeight +
    (menuLines.length > 0 ? ruleGap + menuLines.length * titleLineHeight : 0) +
    priceGap +
    priceHeight +
    footerGap +
    footerHeight;

  const scrimTopPad = Math.round(refDim * 0.065);
  const scrimHeight = contentHeight + scrimTopPad + padBottom;

  return {
    scrimHeight,
    titleFontSize,
    priceFontSize,
    footerFontSize,
    titleLineHeight,
    ruleHeight,
    ruleGap,
    priceGap,
    priceHeight,
    footerGap,
    footerHeight,
    contentHeight,
    scrimTopPad,
    padX,
    padBottom,
    menuLines,
    priceLine,
    footerLine,
  };
}

function drawPromoTemplateOverlay(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  template: PromoTemplateConfig,
  metrics: PromoTemplateMetrics,
  logoImg: HTMLImageElement | null,
  fonts: CanvasFonts,
  isContainMode: boolean
) {
  const refDim = Math.min(canvasWidth, canvasHeight);
  const {
    scrimHeight,
    titleFontSize,
    priceFontSize,
    footerFontSize,
    titleLineHeight,
    ruleHeight,
    ruleGap,
    priceGap,
    priceHeight,
    footerGap,
    contentHeight,
    scrimTopPad,
    padX,
    padBottom,
    menuLines,
    priceLine,
    footerLine,
  } = metrics;

  if (template.showBrandBadge) {
    const badgePadY = Math.round(refDim * 0.014);
    const badgePadX = Math.round(refDim * 0.022);
    const badgeLogoSize = Math.round(refDim * 0.038);
    const badgeFontSize = Math.max(14, Math.round(refDim * 0.022));

    ctx.save();
    ctx.font = `700 ${badgeFontSize}px ${fonts.serif}`;
    const brandText = "Dapoer Bulek";
    const textW = ctx.measureText(brandText).width;
    const gap = logoImg ? Math.round(refDim * 0.014) : 0;
    const boxW = badgePadX * 2 + (logoImg ? badgeLogoSize : 0) + gap + textW;
    const boxH = Math.max(badgeLogoSize, badgeFontSize) + badgePadY * 2;
    const bx = padX;
    const by = Math.round(canvasHeight * 0.038);

    ctx.fillStyle = "rgba(26, 26, 26, 0.92)";
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = Math.max(1, Math.round(refDim * 0.002));
    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, Math.round(refDim * 0.014));
    ctx.fill();
    ctx.stroke();

    let textStartX = bx + badgePadX;
    if (logoImg) {
      const lx = bx + badgePadX;
      const ly = by + (boxH - badgeLogoSize) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        lx + badgeLogoSize / 2,
        ly + badgeLogoSize / 2,
        badgeLogoSize / 2,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logoImg, lx, ly, badgeLogoSize, badgeLogoSize);
      ctx.restore();
      textStartX += badgeLogoSize + gap;
    }

    ctx.fillStyle = "#FAFAF9";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(brandText, textStartX, by + boxH / 2);
    ctx.restore();
  }

  const scrimStartY = canvasHeight - scrimHeight;

  ctx.save();
  if (isContainMode) {
    ctx.fillStyle = "#1A1A1A";
    ctx.fillRect(0, scrimStartY, canvasWidth, scrimHeight);
  } else {
    const grad = ctx.createLinearGradient(0, scrimStartY - scrimTopPad, 0, canvasHeight);
    grad.addColorStop(0, "rgba(26, 26, 26, 0)");
    grad.addColorStop(0.35, "rgba(26, 26, 26, 0.78)");
    grad.addColorStop(1, "rgba(26, 26, 26, 0.96)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, scrimStartY - scrimTopPad, canvasWidth, scrimHeight + scrimTopPad);
  }

  let y = canvasHeight - padBottom - contentHeight;

  // Golden editorial hairline rule
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(padX, y, Math.round(canvasWidth * 0.14), ruleHeight);
  y += ruleHeight;

  if (menuLines.length > 0) {
    y += ruleGap;
    ctx.font = `700 ${titleFontSize}px ${fonts.serif}`;
    ctx.fillStyle = "#FAFAF9";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    for (const line of menuLines) {
      ctx.fillText(line, padX, y);
      y += titleLineHeight;
    }
  }

  if (priceLine) {
    y += priceGap;
    ctx.font = `700 ${priceFontSize}px ${fonts.sans}`;
    ctx.fillStyle = "#F59E0B";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(priceLine, padX, y);
    y += priceHeight;
  }

  if (footerLine) {
    y += footerGap;
    ctx.font = `500 ${footerFontSize}px ${fonts.sans}`;
    ctx.fillStyle = "#D6D3D1";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(footerLine, padX, y);
  }

  ctx.restore();
}

export function renderWatermarkedCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  logoImg: HTMLImageElement | null,
  settings: WatermarkSettings,
  fonts: CanvasFonts
): { width: number; height: number } {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Browser tidak mendukung pemrosesan kanvas 2D.");
  }

  const { width: canvasWidth, height: canvasHeight } = getTargetDimensions(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    settings.aspectPreset
  );

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const isPresetCrop = settings.aspectPreset !== "original";
  const isContainMode = isPresetCrop && settings.framingMode === "contain-dark";

  if (!isPresetCrop) {
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
  } else if (settings.framingMode === "cover") {
    const scale = Math.max(
      canvasWidth / img.width,
      canvasHeight / img.height
    );
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const excessX = drawW - canvasWidth;
    const excessY = drawH - canvasHeight;
    const offsetX = -(excessX * (settings.cropFocusX / 100));
    const offsetY = -(excessY * (settings.cropFocusY / 100));
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  } else {
    // Charcoal dark framing keeps wide dishes completely uncropped
    ctx.fillStyle = "#1A1A1A";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const padX = Math.round(canvasWidth * 0.045);
    const padTop = settings.template.enabled && settings.template.showBrandBadge
      ? Math.round(canvasHeight * 0.1)
      : Math.round(canvasHeight * 0.045);
    const reservedBottom = settings.template.enabled
      ? Math.round(canvasHeight * 0.22)
      : Math.round(canvasHeight * 0.045);

    const availW = Math.max(100, canvasWidth - padX * 2);
    const availH = Math.max(100, canvasHeight - padTop - reservedBottom);
    const scale = Math.min(availW / img.width, availH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const dx = Math.round((canvasWidth - drawW) / 2);
    const dy = Math.round(padTop + (availH - drawH) / 2);

    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = Math.max(1, Math.round(Math.min(canvasWidth, canvasHeight) * 0.002));
    ctx.strokeRect(dx, dy, drawW, drawH);
  }

  const templateMetrics = settings.template.enabled
    ? measurePromoTemplate(
        ctx,
        canvasWidth,
        canvasHeight,
        settings.template,
        fonts
      )
    : null;
  const templateScrimHeight = templateMetrics?.scrimHeight ?? 0;

  const refDim = Math.min(canvasWidth, canvasHeight);
  const sizeRatio = Math.max(0.05, Math.min(1, settings.sizePercent / 100));
  // At 10% slider, text stamp stays subtle (~10-11% of image width)
  const fontSize = Math.max(
    12,
    Math.round(refDim * (0.007 + sizeRatio * 0.055))
  );
  const logoSize =
    settings.contentMode === "logo"
      ? Math.max(24, Math.round(refDim * (0.045 + sizeRatio * 0.55)))
      : Math.max(20, Math.round(fontSize * 2.1));

  const bounds = measureStampBounds(
    ctx,
    settings,
    logoImg,
    fontSize,
    logoSize,
    fonts
  );
  const edgeMargin = Math.round(refDim * 0.04);
  const safeBottomOffset = templateScrimHeight > 0 ? templateScrimHeight : edgeMargin;

  if (settings.position === "diagonal") {
    const stepX = Math.max(bounds.width * 1.55, refDim * 0.38);
    const stepY = Math.max(bounds.height * 2.1, refDim * 0.25);
    const diagSpan = Math.hypot(canvasWidth, canvasHeight) * 1.25;

    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((-26 * Math.PI) / 180);

    let rowIndex = 0;
    for (let y = -diagSpan; y <= diagSpan; y += stepY) {
      const rowShift = rowIndex % 2 === 0 ? 0 : stepX * 0.5;
      for (let x = -diagSpan; x <= diagSpan; x += stepX) {
        drawStampUnit(
          ctx,
          x + rowShift,
          y,
          settings,
          logoImg,
          fontSize,
          logoSize,
          fonts,
          false
        );
      }
      rowIndex += 1;
    }
    ctx.restore();
  } else if (settings.position === "center") {
    const centerY =
      templateScrimHeight > 0
        ? Math.round((canvasHeight - templateScrimHeight * 0.7) / 2)
        : canvasHeight / 2;
    drawStampUnit(
      ctx,
      canvasWidth / 2,
      centerY,
      settings,
      logoImg,
      fontSize,
      logoSize,
      fonts,
      true
    );
  } else if (settings.position === "top-left") {
    const topY =
      settings.template.enabled && settings.template.showBrandBadge
        ? Math.round(canvasHeight * 0.12) + bounds.height / 2
        : edgeMargin + bounds.height / 2;
    drawStampUnit(
      ctx,
      edgeMargin + bounds.width / 2,
      topY,
      settings,
      logoImg,
      fontSize,
      logoSize,
      fonts,
      true
    );
  } else if (settings.position === "top-right") {
    drawStampUnit(
      ctx,
      canvasWidth - edgeMargin - bounds.width / 2,
      edgeMargin + bounds.height / 2,
      settings,
      logoImg,
      fontSize,
      logoSize,
      fonts,
      true
    );
  } else if (settings.position === "bottom-left") {
    drawStampUnit(
      ctx,
      edgeMargin + bounds.width / 2,
      canvasHeight - safeBottomOffset - bounds.height / 2,
      settings,
      logoImg,
      fontSize,
      logoSize,
      fonts,
      true
    );
  } else if (settings.position === "bottom-right") {
    drawStampUnit(
      ctx,
      canvasWidth - edgeMargin - bounds.width / 2,
      canvasHeight - safeBottomOffset - bounds.height / 2,
      settings,
      logoImg,
      fontSize,
      logoSize,
      fonts,
      true
    );
  }

  // Draw template above watermark so diagonal tiles never cover badge or title text
  if (templateMetrics) {
    drawPromoTemplateOverlay(
      ctx,
      canvasWidth,
      canvasHeight,
      settings.template,
      templateMetrics,
      logoImg,
      fonts,
      isContainMode
    );
  }

  return { width: canvasWidth, height: canvasHeight };
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: "image/png" | "image/jpeg",
  quality = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal mengonversi kanvas ke berkas gambar."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

export function buildOutputFileName(
  originalName: string,
  outputMime: "image/png" | "image/jpeg",
  aspectPreset: AspectPreset
): string {
  const dotIdx = originalName.lastIndexOf(".");
  const stem = dotIdx !== -1 ? originalName.slice(0, dotIdx) : originalName;
  const ext = outputMime === "image/png" ? "png" : "jpg";
  const suffix = aspectPreset === "original" ? "wm" : `wm_${aspectPreset}`;
  return `${stem}_${suffix}.${ext}`;
}
