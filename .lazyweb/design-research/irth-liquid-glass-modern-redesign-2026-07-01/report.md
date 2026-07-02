# Design Research: IRTH Store — Liquid Glass + Modern Minimal Enhancement

## TL;DR
IRTH's current Horizon build (ivory/gold/madinah-green, Cormorant + DM Sans, native sections) already matches the luxury-heritage-food pattern used by Bateel, Fortnum & Mason, and To'ak Chocolate — minimal palette, editorial storytelling, restrained typography. The single highest-leverage move: apply liquid-glass translucency **only** to secondary/transient surfaces (cart drawer, sticky header-on-scroll, quick-view popovers) using settings Horizon already exposes — not as a global background treatment. Global glassmorphism would undercut the calm-heritage positioning; scoped glass reinforces it.

## Current State
No live screenshot captured this pass — the local browser-automation tooling (Windows-MCP click/type) hit a parameter-serialization bug in this environment and couldn't drive Chrome reliably. Current state is instead described from the theme's actual pushed JSON (verified via `shopify theme check` + live HTTP fetch in the prior session): ivory (`#F3EFE7`) background, ink (`#111111`) text, madinah-green (`#0E2B22`) and gold (`#B0885E`) accents; Cormorant headings / DM Sans body; hero video → heritage story (media-with-content) → trust badges (Halal/Traceable/Sourced) → dates collection → gift-boxes collection → marquee → journal. Collection pages (dates/gift-boxes/madinah-herbs) already have dedicated hero photography via alternate templates.

## Recommendations / Next Steps

1. **Scope liquid glass to 3 surfaces only: cart drawer, sticky header, quick-view/popover.** Research consensus (LogRocket, Orizon, DesignMonks) is unanimous: glass effects work as a *secondary/transient* layer — modals, overlays, nav-on-scroll — not as a persistent background. Horizon already has the settings for this without new code: `drawer_border_color`, `drawer_background_color`, `popover_border_radius`, `popover_border_color` in `config/settings_data.json`. Add `backdrop-filter: blur(16px)` + translucent background (`rgba` of the ivory token) scoped to `.cart-drawer`, `.header--sticky`, `.popover` classes in a small new `assets/liquid-glass.css` — additive, same pattern as the RTL stylesheet already shipped.

```
┌──────────────────────────────┐
│ ░░░ blurred header (scroll) ░░│  ← translucent, only after scroll > 0
├──────────────────────────────┤
│                                │
│   [ opaque product content ]  │  ← zero glass here — full clarity
│                                │
└──────────────────────────────┘
        ┌───────────────┐
        │ ░░ cart drawer ░░│  ← glass slide-in panel, blurred backdrop
        │  item · item     │
        │  [Checkout →]    │
        └───────────────┘
```

2. **Editorial asymmetry on the About/heritage page.** Aesop's pattern (Work & Co case study): asymmetric split layouts, large photography, serif+sans pairing, subtle scroll-fade — not a standard centered grid. IRTH already has `media-with-content` wired on the homepage; extend the same section type to a dedicated `page.about.json` with `media_position` alternating left/right per block for a magazine-style scroll, instead of a single static hero.

```
┌────────────┬─────────────────┐
│            │  Eyebrow         │
│   image    │  Heading         │
│            │  Body copy       │
├─────────────┬────────────────┤
│  Eyebrow    │                 │
│  Heading    │     image       │
│  Body copy  │                 │
└────────────┴─────────────────┘
```

3. **Enable Horizon's native scroll reveal, currently off.** `settings.page_transition_enabled` and image fade-ins are supported natively but `animations_reveal_on_scroll` is the relevant toggle — confirm it's `true` (it is, per current settings_data.json) but audit that new sections (trust badges, heritage story) inherit it. Aesop's "images fade in gently as you scroll" effect is exactly this toggle — zero custom JS needed, it's a Horizon platform feature.

4. **Shop-by-occasion curation on homepage, matching Bateel/Fortnum & Mason gifting UX.** Both heritage-gift leaders lead with occasion-based entry points (birthdays, corporate, Ramadan) rather than pure category grids. IRTH already has a `رمضان-ramadan` collection and `gift-boxes` — add a `collection-list` section (native, unused so far) styled as 3-4 occasion tiles between the trust badges and the product grids.

```
┌───────┬───────┬───────┬───────┐
│ Ramadan│ Corp. │Wedding│  New  │
│ image  │Gifting│ Gifts │Arrival│
└───────┴───────┴───────┴───────┘
```

5. **Product page: exhaustive craft/heritage detail, not just description.** To'ak Chocolate and Fortnum & Mason both pair the buy box with origin story, tasting notes, and pairing suggestions — not a single generic RTE block. IRTH's `product-information` already accepts `@theme` blocks (confirmed in prior session); add an `accordion` row for "Origin & Harvest" alongside the existing FAQ accordion, sourced from a product metafield once available.

6. **Mega-menu for bilingual category nav.** Aesop's "shoppable navigation" pattern — surfacing categories visually, not just as text links — fits IRTH's Arabic/English dual-label collections (`التمور — Dates`, `أعشاب المدينة — Herbs`). Horizon's `header.liquid` menu block supports this natively; worth a follow-up pass once RTL/Arabic locale is installed (per the prior plan's open item).

## Patterns (table stakes across the research)
- Soft neutral palette, generous whitespace, product photography as the hero — not busy navigation or promo banners (BigCommerce, Optimonk, Elementor 2026 roundups all converge here).
- Serif for headings only, sans for body/UI — exactly IRTH's Cormorant/DM Sans split.
- Storytelling content (origin, craft, heritage) treated as a first-class page, not an afterthought footer link.
- Subtle, restrained motion — fade/scroll-reveal, not aggressive parallax or bounce.

## Anti-Patterns to avoid
- Glassmorphism as a full-page background — every 2026 source (Orizon, LogRocket, DesignMonks) flags this as the #1 mistake: it kills contrast/accessibility and reads as a 2021-era trend when overused.
- Oversized "screaming" H1s — luxury sources consistently favor restrained scale + weight over massive type.
- Generic 3-equal-card feature rows — the researched luxury sites (Aesop, Fortnum & Mason) use asymmetric or editorial layouts instead.

## Unique Angle
To'ak Chocolate's homepage opens with a full-screen **cinematic video of the harvesting/production process itself** rather than a styled product shot — the process *is* the hero, which reads as more credible for a heritage-sourcing story than a polished studio photo. IRTH's `hero_loop_video.mp4` already does something similar; worth confirming the video content is process/place-focused (Madinah groves, hand-selection) rather than a generic product loop, to match this pattern's credibility signal.

## Findings
The research strongly validates IRTH's current direction rather than calling for a redesign: minimal palette, serif/sans pairing, native Horizon sections, restrained motion are exactly what the luxury heritage-food category (Bateel, Fortnum & Mason, To'ak) and adjacent minimal-luxury leaders (Aesop) already do. The gap is not "more design" — it's applying the trending liquid-glass motif *narrowly* (drawers/overlays only) rather than not at all, plus deepening the storytelling/occasion-based content that heritage-gifting leaders lean on harder than IRTH currently does (single heritage-story block vs. Fortnum & Mason's occasion-driven, hamper-focused merchandising).

## Sources
- [Liquid Glass UX Trends Shaping Design 2026](https://grafitx.com/liquid-glass-ux-and-sustainable-design-how-major-brands-redefine-visual-standards-in-2026/)
- [UI Design Trend 2026 #2: Glassmorphism and Liquid Design Make a Comeback](https://medium.com/design-bootcamp/ui-design-trend-2026-2-glassmorphism-and-liquid-design-make-a-comeback-50edb60ca81e)
- [Liquid Glass UI: Trend & Dashboard Design](https://www.designmonks.co/blog/liquid-glass-ui)
- [Adopting Apple's Liquid Glass: Examples and best practices — LogRocket](https://blog.logrocket.com/ux-design/adopting-liquid-glass-examples-best-practices/)
- [Glassmorphism in 2026: How to Use Frosted Glass Without Killing UX — Orizon](https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux)
- [Top 10 Luxury Gift Ecommerce Websites — Limely](https://www.limely.co.uk/blog/top-10-luxury-gift-ecommerce-websites)
- [10 Examples of Excellent Luxury eCommerce Product Pages — Vervaunt](https://vervaunt.com/top-10-luxury-ecommerce-product-pages)
- [Bateel — Organic Dates and Luxury Gifts](https://bateel.com/en_us/)
- [Aesop Case Study — Work & Co](https://work.co/clients/aesop/)
- [Aesop Digital Experience — Adrian Van Cooten](https://www.adrianvancooten.com/work/aesop)
- [Shopify Horizon Theme Customization Guide 2026 — Craftshift](https://craftshift.com/shopify-horizon-theme-customization-guide-2026/)
- [A Developer's Technical Breakdown of Shopify's Horizon Theme — Medium](https://johnny-taft.medium.com/a-developers-technical-breakdown-of-shopify-s-horizon-theme-1de79d9949b2)

**Limitation:** Lazyweb MCP is not installed in this environment, and live browser screenshot capture failed due to a tool parameter bug — this report is web-research-only, no downloaded reference images. Ask to enable Lazyweb (`https://www.lazyweb.com/mcp-install`) for a follow-up pass with visual references.
