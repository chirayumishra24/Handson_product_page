"""Generate the Tinkupop logo set from the Fredoka font used on the site.

Outputs (store/):
  public/brand/tinkupop-mark.svg      square app-icon mark
  public/brand/tinkupop-logo.svg      mark + wordmark, for light backgrounds
  public/brand/tinkupop-logo-dark.svg mark + wordmark, for dark backgrounds
  src/app/icon.svg                    favicon (Next.js file convention)
  src/components/layout/brandMarkPath.ts  the "t" glyph path for the React mark
"""
import glob
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

# Run from anywhere:  python scripts/make-logo.py   (needs: pip install fonttools brotli)
# Reads Fredoka from the Next.js build cache, so run `npm run build` once first.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def find_fredoka():
    for f in glob.glob(os.path.join(ROOT, ".next/static/media/*.woff2")):
        t = TTFont(f)
        if t["name"].getDebugName(1).startswith("Fredoka") and ord("t") in t.getBestCmap():
            return f
    raise SystemExit("Fredoka not found in .next/static/media - run `npm run build` first.")


FONT = find_fredoka()

font = instantiateVariableFont(TTFont(FONT), {"wght": 700})
gs = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font["hmtx"]

# Palette (matches globals.css tokens)
GREEN, GREEN_DARK, SUN, CREATE = "#2FBF71", "#1E9E58", "#FFC83D", "#FF5C9A"
INK, WHITE = "#1B1F3B", "#FFFFFF"
POP_LIGHT, POP_DARK = "#1E9E58", "#4ADE80"


def glyph_path(ch, scale, dx, dy):
    """SVG path for one glyph, y flipped, scaled and placed with its baseline at dy."""
    g = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[g].draw(TransformPen(pen, (scale, 0, 0, -scale, dx, dy)))
    return pen.getCommands(), hmtx[g][0] * scale


def glyph_bounds(ch):
    bp = BoundsPen(gs)
    gs[cmap[ord(ch)]].draw(bp)
    return bp.bounds  # xMin, yMin, xMax, yMax in font units


# ---- The mark: 120x120 clay tile, white "t", yellow pop bubble -------------
def mark_svg_body(uid):
    xmin, ymin, xmax, ymax = glyph_bounds("t")
    s = 78 / (ymax - ymin)  # "t" ~78px tall
    w = (xmax - xmin) * s
    dx = 56 - w / 2 - xmin * s  # optically a touch left of centre (bubble sits top-right)
    dy = 60 + ((ymax - ymin) * s) / 2 + ymin * s
    t_path, _ = glyph_path("t", s, dx, dy)
    return f"""
  <defs>
    <linearGradient id="{uid}-tile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#43D486"/>
      <stop offset="1" stop-color="{GREEN_DARK}"/>
    </linearGradient>
    <radialGradient id="{uid}-shine" cx="0.3" cy="0.22" r="0.55">
      <stop offset="0" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="{uid}-sun" cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stop-color="#FFE08A"/>
      <stop offset="1" stop-color="{SUN}"/>
    </radialGradient>
  </defs>
  <rect x="6" y="10" width="104" height="104" rx="34" fill="{GREEN_DARK}" opacity="0.35"/>
  <rect x="4" y="4" width="104" height="104" rx="34" fill="url(#{uid}-tile)"/>
  <rect x="4" y="4" width="104" height="104" rx="34" fill="url(#{uid}-shine)"/>
  <path d="{t_path}" fill="{WHITE}"/>
  <circle cx="96" cy="24" r="21" fill="{WHITE}"/>
  <circle cx="96" cy="24" r="16" fill="url(#{uid}-sun)"/>
  <circle cx="90.5" cy="18.5" r="4.2" fill="#fff" opacity="0.85"/>
  <circle cx="114" cy="48" r="5.5" fill="{CREATE}"/>
""", t_path


def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("wrote", path, len(text), "bytes")


body, t_path = mark_svg_body("m")
mark = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122 122" role="img" aria-label="Tinkupop">{body}</svg>\n'
write("public/brand/tinkupop-mark.svg", mark)
write("src/app/icon.svg", mark)


# ---- Wordmark: "tinku" + "pop" -------------------------------------------
def wordmark(x0, baseline, size, tinku_fill, pop_fill, tracking=-0.01):
    scale = size / 1000
    x = x0
    parts = []
    for i, ch in enumerate("tinkupop"):
        d, adv = glyph_path(ch, scale, x, baseline)
        parts.append((d, tinku_fill if i < 5 else pop_fill))
        x += adv + tracking * size
    return parts, x


def lockup(tinku_fill, pop_fill, uid):
    body, _ = mark_svg_body(uid)
    parts, end_x = wordmark(140, 84, 92, tinku_fill, pop_fill)
    paths = "\n".join(f'  <path d="{d}" fill="{c}"/>' for d, c in parts)
    width = int(end_x + 8)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 122" role="img" aria-label="Tinkupop">'
        f"{body}{paths}\n</svg>\n"
    )


write("public/brand/tinkupop-logo.svg", lockup(INK, POP_LIGHT, "l"))
write("public/brand/tinkupop-logo-dark.svg", lockup("#EEF0FF", POP_DARK, "d"))

# ---- React needs only the "t" path; the rest of the mark is simple shapes ---
write(
    "src/components/layout/brandMarkPath.ts",
    "// Generated from Fredoka Bold (the site's display font) by the logo script.\n"
    "// The lowercase \"t\" inside the Tinkupop mark, in the mark's 122x122 viewBox.\n"
    f'export const BRAND_MARK_T_PATH =\n  "{t_path}";\n',
)
