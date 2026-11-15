# DESIGN.md — Dapoer Bulek

## Brand Identity
- **Name:** Dapoer Bulek (`@dapoerbule_354`)
- **Domain:** `https://www.dapoerbulek.web.id/`
- **Location:** Dayamurni, Tumijajar, Tulang Bawang Barat, Lampung, Indonesia
- **Operating Since:** 2019
- **Business Model:** Home-kitchen culinary & event catering serving custom Pre-Order (PO) Tumpeng, Nasi Liwet, Ayam Ingkung, Nasi Kotak, Pudding Cake, and Jajanan Pasar for family celebrations, syukuran, birthdays, and office gatherings. Orders and menu consultations run directly via WhatsApp (`+62 821-9356-2480`).
- **Voice & Tone:** Warm, hospitable, grounded, and practical in natural Bahasa Indonesia. Speak directly like a neighborhood kitchen owner who cares about freshness, neat presentation, and timely delivery. Never use fabricated statistics, generic SaaS hype, or placeholder customer quotes.

## Design Dials
Dial: ENERGY 2 / RHYTHM 3 / MOTION 1

- **ENERGY 2 (Balanced, Warm, Grounded):** Appetizing editorial presence anchored by real dish photography and honest ordering details. Confident without loud SaaS hype, neon gradients, or promotional clutter.
- **RHYTHM 3 (Asymmetric, Mixed Compositions):** Sections alternate deliberately between dark charcoal (`#1A1A1A`) and warm cream (`#FAFAF9`) bands and vary structure across every band (split editorial hero with anchored 1:1 dish preview, interactive menu showcase with featured lead dish + structured catalog grid, asymmetric kitchen story paired with concrete ordering standards, verified Instagram `@dapoerbule_354` customer gallery/highlight prompt, and an asymmetric split map + practical pre-order guide footer). Never repeat centered-header + uniform-card-grid across sections.
- **MOTION 1 (Subtle, Purposeful Transitions Only):** Crisp CSS hover, active, and focus-visible transitions on interactive controls and category tabs only. Zero bounce, float, pulse-glow, or infinite animation loops. Respect `prefers-reduced-motion: reduce`.

## Color Palette (Strict 2 Cores + 1 Accent + Neutrals)
- **Primary Dark Surface:** Deep Charcoal `#1A1A1A` (elevated surface `#242424`, subtle hairline `#333333`) for hero, grounded kitchen bands, and footer.
- **Primary Light Surface:** Warm Cream `#FAFAF9` (secondary warm surface `#F3F1ED`, crisp divider `#E7E5E4`) for high-readability menu catalog, ordering clarity, and location bands.
- **Accent (Focal Highlights & Primary CTAs Only):** Warm Golden Yellow `#F59E0B` (hover `#D97706`) strictly for primary WhatsApp/Menu CTAs, active category tab, and deliberate editorial accent rules. Text on `#F59E0B` and `#D97706` is always `#1A1A1A` (8.10:1 and 5.46:1 WCAG AA). On `#FAFAF9` light surfaces, warm amber text accents use `#B45309` (4.81:1) or `#92400E` (6.79:1) to guarantee WCAG AA >= 4.5:1.
- **Accessible Text Neutrals:**
  - On `#1A1A1A`: primary `#FAFAF9` (16.66:1), secondary `#D6D3D1` (11.68:1), muted metadata `#A8A29E` (6.90:1).
  - On `#FAFAF9`: primary `#1A1A1A` (16.66:1), secondary `#44403C` (9.84:1), muted metadata `#57534E` (7.30:1).

## Typography
- **Display / Headings:** `Playfair Display` (editorial serif, weights 600 and 700) to convey culinary heritage, warmth, and local trust established since 2019.
- **Body / UI / Menu Specs:** `Inter` (clean sans-serif, weights 400, 500, 600) for scannable dish descriptions, H-2/H-3 pre-order lead times, portion details, and WhatsApp action buttons.
- **Type Scale & Tracking:** Fluid `clamp()` sizing where appropriate so headings breathe on desktop and stay comfortable at 375px mobile width without overflow. No wide-tracked monospace gimmicks.

## Radius, Elevation & Identity Motif
- **Deliberate Radius Hierarchy:** Square/editorial `rounded-sm` / `rounded-lg` (8px-12px) for photography frames and structured containers; `rounded-md` (6px-8px) for category filters and secondary controls; `rounded-full` reserved selectively for primary WhatsApp/navigation CTAs so pills do not flatten the visual hierarchy.
- **Flat Grounded Planes:** Rely on crisp 1px structural borders (`#E7E5E4` on light, `#2E2E2E` on dark) and surface contrast (`#1A1A1A` vs `#FAFAF9`) instead of blurry drop shadows or glowing orbs. Glassmorphism is limited strictly to the scrolled sticky navbar (`backdrop-blur-md`).
- **Identity Motif:** Thin golden hairline rules (`#F59E0B` / `#B45309`) paired with Playfair Display headings and framed kitchen food photography (`public/images/real-images/*.jpg` and `public/images/*.png`).

## Functional & Content Rules
- Every menu item preserves intrinsic image `width` and `height` inside clean, orientation-matched containers (`aspect-square` for overhead tumpeng/tampah/tart shots, `aspect-[4/3]` for wide nasi kotak and ingkung spreads) with clear portion / minimum order context and a pre-filled `https://wa.me/6282193562480?text=...` CTA.
- Zero invented metrics (no "500+ Pesanan", no "100% Kepuasan", no "4.9 Rating") and zero fictional customer testimonials.
- Every anchor, button, tab, mobile drawer, and external WhatsApp/Instagram/Google Maps link works end-to-end with >= 44px tap targets and full keyboard accessibility.
