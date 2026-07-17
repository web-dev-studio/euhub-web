#!/usr/bin/env python3
"""
Generate build's OG share images: public/og.png (EN) and public/sk/og.png (SK).

Reproduces the site's current shared design system (teal #006b70 / indigo
#4f46e5 light theme, Plus Jakarta Sans headings, DM Sans body, JetBrains
Mono accents) and the actual Hero.astro / Header.astro visual language —
grid-pattern background, radial glow, numbered "NN // Label" eyebrow, the
teal->indigo gradient on the "AI-ready ..." phrase (mirrors
`bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text
text-transparent`), and the header's wordmark lockup (gradient bar + mono
uppercase "BUILD" + "with EUHUB" sub-label).

Colors/type pulled directly from src/styles/global.css `@theme` (light
values — the site's default/auto theme) and copy pulled from
src/content/{en,sk}/site.ts + src/components/sections/Hero.astro /
Header.astro — see comments below for exactly which file each string
came from. The SK headline is NOT a translation invented for this script:
Hero.astro's <h1> is hardcoded English with no locale branch (a real gap,
left as-is — out of scope here), so there is no dedicated SK hero headline
anywhere in the codebase. The SK card instead uses the actual SK copy that
already exists for this value proposition: the first sentence of
`site.seo.description` in src/content/sk/site.ts, which contains the same
"AI-ready rozhrania" phrase the gradient treatment is built around.

Fonts: real Fontsource variable webfonts already vendored under
node_modules/@fontsource-variable/{plus-jakarta-sans,dm-sans,jetbrains-mono}
(the exact files the site ships), converted from woff2 to TTF in-memory via
fontTools (Pillow cannot load woff2 directly) — nothing is written to disk
outside the two output PNGs. Slovak diacritics outside Latin-1 (š č ž ľ ĺ ŕ
ď ť ň) aren't in the "latin" subset the site loads first, so this script
falls back per-character to the "latin-ext" subset for those glyphs only.

Usage:
    python3 scripts/generate-og-images.py

Requires (not project deps — generation-time only): Pillow, fontTools,
brotli, numpy.
    pip install --user Pillow fonttools brotli numpy
"""

import io
from pathlib import Path

import numpy as np
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT / "node_modules" / "@fontsource-variable"

W, H = 1200, 630

# ---------------------------------------------------------------------------
# Design tokens — copied from src/styles/global.css `@theme` (light values,
# the site's default theme; dark-mode cyan/violet tokens are not used here).
# ---------------------------------------------------------------------------
SURFACE_PAGE = (248, 250, 252)  # --color-surface-page: #f8fafc
TEXT_PRIMARY = (15, 23, 42)  # --color-text-primary: #0f172a
TEXT_SECONDARY = (71, 85, 105)  # --color-text-secondary: #475569
PRIMARY_500 = (0, 107, 112)  # --color-primary-500: #006b70 (teal)
SECONDARY_500 = (79, 70, 229)  # --color-secondary-500: #4f46e5 (indigo)
PRIMARY_GLOW_RGB = (0, 173, 181)  # --color-primary-glow base rgb, 22% alpha
SECONDARY_GLOW_RGB = (99, 102, 241)  # --color-secondary-glow base rgb, 18% alpha
GRID_LINE_RGB = (13, 14, 21)  # --color-border-subtle base rgb

# ---------------------------------------------------------------------------
# Font sources — the exact files global.css imports (latin subset), plus the
# latin-ext subset for Slovak-diacritic fallback only.
# ---------------------------------------------------------------------------
FONT_FILES = {
    "heading": {  # Plus Jakarta Sans Variable — font-heading
        "latin": FONTS_DIR
        / "plus-jakarta-sans"
        / "files"
        / "plus-jakarta-sans-latin-wght-normal.woff2",
        "ext": FONTS_DIR
        / "plus-jakarta-sans"
        / "files"
        / "plus-jakarta-sans-latin-ext-wght-normal.woff2",
    },
    "body": {  # DM Sans Variable — font-sans
        "latin": FONTS_DIR / "dm-sans" / "files" / "dm-sans-latin-wght-normal.woff2",
        "ext": FONTS_DIR
        / "dm-sans"
        / "files"
        / "dm-sans-latin-ext-wght-normal.woff2",
    },
    "mono": {  # JetBrains Mono Variable — font-mono
        "latin": FONTS_DIR
        / "jetbrains-mono"
        / "files"
        / "jetbrains-mono-latin-wght-normal.woff2",
        "ext": FONTS_DIR
        / "jetbrains-mono"
        / "files"
        / "jetbrains-mono-latin-ext-wght-normal.woff2",
    },
}


def woff2_to_bytes(path: Path) -> bytes:
    """Decompress a woff2 into plain sfnt bytes, in memory (fontTools+brotli)."""
    tt = TTFont(str(path))
    tt.flavor = None
    buf = io.BytesIO()
    tt.save(buf)
    return buf.getvalue()


def load_cmap(font_bytes: bytes) -> set:
    return set(TTFont(io.BytesIO(font_bytes)).getBestCmap().keys())


print("Loading + converting fontsource woff2 -> ttf (in-memory)...")
FONT_BYTES = {
    fam: {variant: woff2_to_bytes(p) for variant, p in variants.items()}
    for fam, variants in FONT_FILES.items()
}
CMAPS = {fam: load_cmap(variants["latin"]) for fam, variants in FONT_BYTES.items()}

_font_cache: dict = {}


def get_font(family: str, weight: int, size: int, variant: str = "latin"):
    key = (family, weight, size, variant)
    if key in _font_cache:
        return _font_cache[key]
    f = ImageFont.truetype(io.BytesIO(FONT_BYTES[family][variant]), size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    _font_cache[key] = f
    return f


# ---------------------------------------------------------------------------
# Mixed-font text helpers — draw/measure per character, falling back to the
# "ext" subset only for glyphs missing from "latin" (Slovak š č ž ľ ĺ ŕ ď ť
# ň). For pure-ASCII/Latin-1 runs (all EN copy, most SK copy) this is
# behaviourally identical to a plain draw.text/textlength call.
# ---------------------------------------------------------------------------
def _char_font(family: str, weight: int, size: int, ch: str):
    variant = "latin" if ord(ch) in CMAPS[family] else "ext"
    return get_font(family, weight, size, variant)


def measure_text(draw, text: str, family: str, weight: int, size: int) -> float:
    return sum(
        draw.textlength(ch, font=_char_font(family, weight, size, ch))
        for ch in text
    )


def draw_text(draw, xy, text: str, family: str, weight: int, size: int, fill):
    x, y = xy
    for ch in text:
        f = _char_font(family, weight, size, ch)
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f)
    return x - xy[0]


def draw_gradient_text(
    canvas: Image.Image, draw, xy, text: str, family: str, weight: int, size: int
):
    """Paints `text` with a horizontal PRIMARY_500 -> SECONDARY_500 gradient
    fill, mirroring `bg-gradient-to-r from-primary-500 to-secondary-500
    bg-clip-text text-transparent`. Renders a per-character glyph mask (same
    mixed-font fallback as draw_text) then composites a gradient through it.
    """
    x, y = xy
    ascent, descent = get_font(family, weight, size).getmetrics()
    line_h = ascent + descent
    total_w = int(round(measure_text(draw, text, family, weight, size))) + 2
    if total_w <= 0:
        return 0

    mask = Image.new("L", (total_w, line_h), 0)
    mdraw = ImageDraw.Draw(mask)
    cx = 0
    for ch in text:
        f = _char_font(family, weight, size, ch)
        mdraw.text((cx, 0), ch, font=f, fill=255)
        cx += mdraw.textlength(ch, font=f)

    xs = np.linspace(0.0, 1.0, total_w, dtype=np.float32)
    grad = np.empty((line_h, total_w, 3), dtype=np.uint8)
    for c in range(3):
        grad[:, :, c] = (
            PRIMARY_500[c] + (SECONDARY_500[c] - PRIMARY_500[c]) * xs
        ).astype(np.uint8)
    grad_img = Image.fromarray(grad, "RGB")

    canvas.paste(grad_img, (int(x), int(y)), mask)
    return cx


# ---------------------------------------------------------------------------
# Background: solid surface + subtle 48px grid (matches `.bg-grid` in
# global.css) + two soft radial glows (matches Hero.astro's radial-gradient
# layer: primary top-left, secondary top-right).
# ---------------------------------------------------------------------------
def make_background() -> Image.Image:
    base = Image.new("RGB", (W, H), SURFACE_PAGE)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)

    # Grid — 48px spacing, same as `.bg-grid` background-size in global.css.
    grid_alpha = 20  # ~8% — a touch stronger than the compiled site's
    # opacity-40-on-10%-alpha (~4%) since this has to read at thumbnail size.
    grid_fill = GRID_LINE_RGB + (grid_alpha,)
    for gx in range(0, W + 1, 48):
        odraw.line([(gx, 0), (gx, H)], fill=grid_fill, width=1)
    for gy in range(0, H + 1, 48):
        odraw.line([(0, gy), (W, gy)], fill=grid_fill, width=1)

    base = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")

    # Radial glows — positions mirror Hero.astro's
    # `radial-gradient(circle at 12% 20%, primary-glow, transparent 30%)` /
    # `radial-gradient(circle at 88% 8%, secondary-glow, transparent 30%)`.
    # CSS radial-gradient defaults to `farthest-corner` sizing with a linear
    # ramp to the "transparent 30%" stop, i.e. fully transparent at ~30% of
    # the farthest-corner distance from center (~1170px for this box) —
    # ~350px — not the near-half-canvas blob a naive large radius produces.
    # Alpha values match --color-primary-glow (22%) / --color-secondary-glow
    # (18%) exactly.
    yy, xx = np.mgrid[0:H, 0:W]

    def glow(cx, cy, radius, rgb, max_alpha):
        dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
        alpha = np.clip(1.0 - dist / radius, 0, 1) * max_alpha
        layer = np.zeros((H, W, 4), dtype=np.uint8)
        layer[:, :, 0] = rgb[0]
        layer[:, :, 1] = rgb[1]
        layer[:, :, 2] = rgb[2]
        layer[:, :, 3] = (alpha * 255).astype(np.uint8)
        return Image.fromarray(layer, "RGBA")

    g1 = glow(0.12 * W, 0.20 * H, 360, PRIMARY_GLOW_RGB, 0.22)
    g2 = glow(0.88 * W, 0.08 * H, 355, SECONDARY_GLOW_RGB, 0.18)

    out = base.convert("RGBA")
    out = Image.alpha_composite(out, g1)
    out = Image.alpha_composite(out, g2)
    return out.convert("RGB")


# ---------------------------------------------------------------------------
# Wordmark lockup — mirrors Header.astro: vertical gradient bar +
# "BUILD" (mono, uppercase) + "with EUHUB" (mono, uppercase, primary-500).
# Drawn right-aligned to `right`, vertically centered on `cy`.
# ---------------------------------------------------------------------------
def draw_wordmark(canvas, draw, right: int, cy: int):
    build_size, sub_size = 32, 14
    build_w = measure_text(draw, "BUILD", "mono", 600, build_size)
    sub_w = measure_text(draw, "with EUHUB", "mono", 600, sub_size)
    text_w = max(build_w, sub_w)

    bar_w, bar_h = 7, 46
    gap = 14
    block_w = bar_w + gap + text_w
    left = int(right - block_w)

    # Gradient bar (rounded), primary_500 -> secondary_500 top to bottom.
    bar_x0, bar_y0 = left, cy - bar_h // 2
    bar_x1, bar_y1 = bar_x0 + bar_w, bar_y0 + bar_h
    bar_grad = np.empty((bar_h, bar_w, 3), dtype=np.uint8)
    ys = np.linspace(0.0, 1.0, bar_h, dtype=np.float32)
    for c in range(3):
        bar_grad[:, :, c] = (
            PRIMARY_500[c] + (SECONDARY_500[c] - PRIMARY_500[c]) * ys
        ).astype(np.uint8)[:, None]
    bar_img = Image.fromarray(bar_grad, "RGB")
    mask = Image.new("L", (bar_w, bar_h), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rounded_rectangle([0, 0, bar_w - 1, bar_h - 1], radius=3, fill=255)
    canvas.paste(bar_img, (bar_x0, bar_y0), mask)

    text_x = bar_x1 + gap
    line_gap = 4
    build_top = cy - (build_size + line_gap + sub_size) // 2 - 4
    draw_text(draw, (text_x, build_top), "BUILD", "mono", 600, build_size, TEXT_PRIMARY)
    sub_top = build_top + build_size + line_gap
    draw_text(
        draw, (text_x, sub_top), "with EUHUB", "mono", 600, sub_size, PRIMARY_500
    )


# ---------------------------------------------------------------------------
# Card assembly
# ---------------------------------------------------------------------------
def fit_headline_size(draw, headline_lines, max_width, start=60, floor=34):
    """Manual line breaks are chosen per-card (see main()) so the gradient
    phrase always stays on its own line; this only shrinks the font size
    (in 2px steps) until every line's rendered width fits `max_width`, since
    SK's verbatim sentence runs longer per line than EN's."""
    size = start
    while size > floor:
        fits = True
        for line_runs in headline_lines:
            w = sum(
                measure_text(draw, text, "heading", 800, size)
                for text, _ in line_runs
            )
            if w > max_width:
                fits = False
                break
        if fits:
            return size
        size -= 2
    return floor


def render_card(
    out_path: Path,
    eyebrow_label: str,
    headline_lines,  # list of (text, is_gradient) tuples, one entry per rendered line's runs; each line is a list of runs
    trust_line: str,
    domain_text: str,
):
    canvas = make_background().convert("RGBA")
    draw = ImageDraw.Draw(canvas)

    LEFT, RIGHT, TOP = 76, 76, 60

    # --- Top row: eyebrow (left) + wordmark (right) ---
    eyebrow_size = 19
    eyebrow_full = f"01 // {eyebrow_label}"
    eyebrow_h = sum(get_font("mono", 500, eyebrow_size).getmetrics())
    eyebrow_cy = TOP + eyebrow_h // 2
    draw_text(
        draw,
        (LEFT, TOP),
        eyebrow_full,
        "mono",
        500,
        eyebrow_size,
        PRIMARY_500,
    )
    draw_wordmark(canvas, draw, W - RIGHT, eyebrow_cy)

    # --- Headline + trust line, vertically centered in the space between
    # the top row and the domain row (SK's verbatim sentence runs 4 lines
    # vs EN's 3, so this keeps both cards visually balanced instead of
    # pinning to a fixed top offset that leaves EN with a big empty gap). ---
    max_headline_width = W - LEFT - RIGHT
    headline_size = fit_headline_size(draw, headline_lines, max_headline_width)
    line_height = int(headline_size * 1.2)
    headline_block_h = line_height * len(headline_lines)

    trust_size = 21
    trust_gap = 30
    trust_h = sum(get_font("body", 400, trust_size).getmetrics())

    content_h = headline_block_h + trust_gap + trust_h

    domain_size = 21
    domain_y = H - 64
    top_row_bottom = TOP + eyebrow_h
    available_h = domain_y - 40 - top_row_bottom
    y = top_row_bottom + max(40, (available_h - content_h) // 2)

    for line_runs in headline_lines:
        x = LEFT
        for text, is_gradient in line_runs:
            if is_gradient:
                x += draw_gradient_text(
                    canvas, draw, (x, y), text, "heading", 800, headline_size
                )
            else:
                x += draw_text(
                    draw, (x, y), text, "heading", 800, headline_size, TEXT_PRIMARY
                )
        y += line_height

    y += trust_gap - (line_height - headline_size)  # tighten baseline gap
    draw_text(draw, (LEFT, y), trust_line, "body", 400, trust_size, TEXT_SECONDARY)

    # --- Domain, bottom-left ---
    draw_text(draw, (LEFT, domain_y), domain_text, "mono", 600, domain_size, TEXT_PRIMARY)

    out = canvas.convert("RGB")
    out.save(out_path, "PNG", optimize=True)
    print(f"wrote {out_path}  ({out.size[0]}x{out.size[1]})  headline_size={headline_size}")


def main():
    out_en = ROOT / "public" / "og.png"
    out_sk = ROOT / "public" / "sk" / "og.png"
    out_sk.parent.mkdir(parents=True, exist_ok=True)

    # EN — headline text is Hero.astro's literal <h1> content (lines 66-72),
    # eyebrow is Hero.astro's `heroEyebrow` for locale 'en' (line 41), trust
    # line is `trustLine` in src/content/en/site.ts (line 45).
    render_card(
        out_en,
        eyebrow_label="Web engineering studio · EUHUB",
        headline_lines=[
            [("Premium websites, web apps, and", False)],
            [("AI-ready interfaces", True)],
            [("for European businesses.", False)],
        ],
        trust_line="Based in Slovakia · Built for EU businesses · GDPR-aware by default",
        domain_text="build.euhub-ai.com",
    )

    # SK — eyebrow is Hero.astro's `heroEyebrow` for locale 'sk' (line 40).
    # Headline: Hero.astro's <h1> has NO sk branch (hardcoded English, out of
    # scope to fix here) so there is no dedicated SK hero headline in the
    # codebase. Using the actual SK copy that exists for this value prop,
    # verbatim — the first sentence of `seo.description` in
    # src/content/sk/site.ts, which contains the same "AI-ready rozhrania"
    # phrase — with only line-break placement chosen here, no reworded copy:
    # "Staviame rýchle, bezpečné, konverzné webové platformy, webové
    # aplikácie a AI-ready rozhrania pre európske firmy."
    # Trust line is `trustLine` in src/content/sk/site.ts (line 45).
    render_card(
        out_sk,
        eyebrow_label="Webové inžinierske štúdio · EUHUB",
        headline_lines=[
            [("Staviame rýchle, bezpečné, konverzné", False)],
            [("webové platformy, webové aplikácie a", False)],
            [("AI-ready rozhrania", True)],
            [("pre európske firmy.", False)],
        ],
        trust_line="Sídlo na Slovensku · Postavené pre firmy v EÚ · GDPR-aware v základe",
        domain_text="build.euhub-ai.com/sk",
    )


if __name__ == "__main__":
    main()
