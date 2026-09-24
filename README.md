# IRTH Custom — Shopify Theme for IRTH HOUSE

Custom storefront theme for **IRTH HOUSE — بيت الإرث العربي** ([irth-house.com](https://www.irth-house.com)), a bilingual (Arabic / English) luxury brand of dates, herbs, fragrances and heritage gifts from Al-Madinah Al-Munawwarah.

Built on Shopify's Horizon architecture (Online Store 2.0, theme blocks), then customised for the IRTH brand, Arabic-first content and mobile performance.

## Custom work

**Brand & typography**
- IRTH typefaces bundled in `assets/` (Sakkal Seta, DecoType Thuluth, A-Suls) with Arabic fallbacks.
- IRTH palette (ivory `#F3EFE7`, black `#111111`, gold `#B0885E`) applied across sections.
- `snippets/irth-card-polish.liquid` — card, footer and mobile layout refinements.
- `assets/liquid-glass-header.css` — translucent header treatment.

**Arabic / RTL**
- `assets/rtl-overrides.css` — RTL alignment and typography that keeps brand fonts on `/ar`.
- `layout/theme.liquid` — locale detection from `request.path` (fixes Arabic product pages resolving to English).
- `snippets/meta-tags.liquid` — self-referencing canonical for `/ar/` pages, de-duplicated page titles.
- Full Arabic, French, German and Spanish menu / option translations.

**Localisation & commerce**
- `snippets/irth-single-switcher.liquid` — one native language + currency switcher (third-party switcher UI suppressed).
- Markets: SAR, AED, EGP, GBP, EUR.

**Media & performance**
- `sections/hero.liquid` — three-tier hero video (mobile / tablet-foldable / desktop) with deferred loading and a `loadeddata`-gated play to avoid decode races.
- Preconnect hints for slow third-party scripts; compositor-friendly fixed elements to keep scrolling smooth on mid-range Android.
- Mobile homepage: swipeable product rows, compact trust strip, one-line rotating announcements, 44px tap targets.

**Custom sections & snippets**
- `snippets/irth-social-rail.liquid` — floating social rail with WhatsApp call-to-action (RTL-aware, avoids the chat launcher).
- `sections/irth-gold-membership.liquid` — founding-member sign-up section (Shopify customer form with tags).
- Category carousel, heritage story and trust sections configured in `templates/index.json`.

## Development

```bash
shopify theme dev --store=veje0r-0f.myshopify.com
shopify theme push --theme=<theme-id> --store=veje0r-0f.myshopify.com
```

Test on an unpublished theme first; publish from Shopify Admin → Online Store → Themes.

## Structure

```
assets/     CSS, JS, fonts
blocks/     theme blocks
config/     settings schema and data
layout/     theme.liquid
locales/    translations
sections/   sections and section groups
snippets/   reusable snippets (irth-* are IRTH-specific)
templates/  JSON templates
```

IRTH customisations © IRTH HOUSE. Base theme code © Shopify, used under its theme licence.
