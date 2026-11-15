<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- antislop:start -->
# Anti-Slop & Visual Direction

Before writing or editing UI, copy, layout, accessibility, or code comments in this repository:

1. Read `DESIGN.md` in the repository root for Dapoer Bulek's brand identity, palette, typography, and dial targets (`ENERGY 2 / RHYTHM 3 / MOTION 1`).
2. Load and apply the installed Anti-Slop core skill at `.agents/skills/antislop/SKILL.md` together with the task-relevant companion skills:
   - `.agents/skills/antislop-ui/SKILL.md` (visual hierarchy, layout, color, motion, performance)
   - `.agents/skills/antislop-copywriting/SKILL.md` (grounded Bahasa Indonesia copy, zero fabricated claims or AI tropes)
   - `.agents/skills/antislop-human/SKILL.md` (WCAG AA contrast, keyboard navigation, focus states, semantics)
   - `.agents/skills/antislop-layoutmobile/SKILL.md` (mobile-first reflow down to 375px, 44px tap targets, zero horizontal overflow)
   - `.agents/skills/antislop-code/SKILL.md` (clean code comment hygiene)
3. Close every UI or copy task with the mandatory Anti-Slop Delivery Gate PASS/FAIL report backed by verified evidence.
<!-- antislop:end -->
