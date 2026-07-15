// Build-time Open Graph image generation.
//
// Renders a per-post 1200×630 share image (paper background, a centered title
// framed above and below by terracotta rules, and the brand mark + date on one
// centered line) with satori (layout → SVG) and sharp (SVG → PNG). Runs
// only inside the `/og/[route].png` endpoint at build time — never shipped to
// the client, and never imported by page components (that stays lightweight via
// `ogSlug` in content.ts).
//
// Chinese fonts: satori needs the glyphs embedded, but @fontsource ships Noto
// Serif SC split across ~100 unicode-range subset .woff files. satori won't
// fall back across several fonts that share one family name, so each needed
// subset block is registered under a *distinct* family name and listed as a
// CSS font-family fallback chain — satori then falls back per glyph. Only the
// blocks a given string actually touches are loaded, so no full CJK font (and
// no download) is needed.

import fs from "node:fs"
import path from "node:path"
import satori from "satori"
import sharp from "sharp"
import type { CollectionEntry } from "astro:content"

const PKG = "@fontsource/noto-serif-sc"
const FONT_DIR = path.resolve("node_modules", PKG, "files")
const unicode: Record<string, string> = JSON.parse(
  fs.readFileSync(path.resolve("node_modules", PKG, "unicode.json"), "utf8"),
)

type Interval = [number, number]
const BLOCKS: { n: string; ivs: Interval[] }[] = Object.entries(unicode).map(
  ([id, ranges]) => ({
    n: id.replace(/[[\]]/g, ""),
    ivs: ranges
      .split(",")
      .map((r): Interval => {
        const m = r.trim().replace("U+", "")
        if (m.includes("-")) {
          const [a, b] = m.split("-")
          return [parseInt(a, 16), parseInt(b, 16)]
        }
        const v = parseInt(m, 16)
        return [v, v]
      })
      .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b)),
  }),
)
// Latin/punctuation/digits always needed for the brand mark and numerals.
const ALWAYS = ["latin", "latin-ext"]

const bufCache = new Map<string, Buffer | null>()
function woff(n: string, weight: number): Buffer | null {
  const key = `${n}-${weight}`
  const cached = bufCache.get(key)
  if (cached !== undefined) return cached
  const file = path.join(FONT_DIR, `noto-serif-sc-${n}-${weight}-normal.woff`)
  const buf = fs.existsSync(file) ? fs.readFileSync(file) : null
  bufCache.set(key, buf)
  return buf
}

type FontOpt = { name: string; data: Buffer; weight: number; style: "normal" }
function fontsFor(
  text: string,
  weight: number,
): { family: string; fonts: FontOpt[] } {
  const need = new Set<string>()
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    if (cp === undefined) continue
    for (const b of BLOCKS) {
      if (b.ivs.some(([lo, hi]) => cp >= lo && cp <= hi)) need.add(b.n)
    }
  }
  const names: string[] = []
  const fonts: FontOpt[] = []
  for (const n of [...need, ...ALWAYS]) {
    const data = woff(n, weight)
    if (!data) continue
    const name = `NSSC-${weight}-${n}`
    names.push(name)
    fonts.push({ name, data, weight, style: "normal" })
  }
  return { family: names.join(", "), fonts }
}

const W = 1200
const H = 630
// Brand palette, converted from the site's light-mode OKLCH tokens to sRGB
// (satori's CSS engine doesn't parse oklch()).
const PAPER = "#f5f0de" // --paper-bg
const INK = "#2c251d" // --paper-ink
const MUTED = "#564f42" // --paper-muted-fg
const ACCENT = "#853900" // --accent (light)
const TITLE_WEIGHT = 500

// Shrink the title font so long headlines still fit ~3 lines. CJK glyphs are
// ~1 em wide, Latin ~0.56 em; the content box is ~1020px. The centered, twice-
// ruled layout has a tighter vertical budget than a top-aligned one, so the cap
// is a touch lower.
function titleSize(title: string): number {
  let visual = 0
  for (const ch of title) {
    const cp = ch.codePointAt(0) ?? 0
    visual += cp > 0x2e7f ? 1 : 0.56
  }
  return Math.max(44, Math.min(74, Math.floor(2640 / Math.max(visual, 1))))
}

export async function renderPostOg(
  post: CollectionEntry<"blog">,
  opts: { siteMark: string; dateLine: string },
): Promise<Buffer> {
  const title = post.data.title
  const { siteMark, dateLine } = opts
  const { family, fonts } = fontsFor(title + siteMark + dateLine, TITLE_WEIGHT)
  const size = titleSize(title)

  const rule = {
    type: "div",
    props: {
      style: {
        width: "56px",
        height: "5px",
        backgroundColor: ACCENT,
        borderRadius: "1px",
      },
    },
  }

  const element = {
    type: "div",
    props: {
      style: {
        width: `${W}px`,
        height: `${H}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: PAPER,
        color: INK,
        padding: "80px 90px",
        fontFamily: family,
      },
      children: [
        {
          ...rule,
          props: { style: { ...rule.props.style, marginBottom: "40px" } },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: `${size}px`,
              fontWeight: TITLE_WEIGHT,
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              textAlign: "center",
            },
            children: title,
          },
        },
        {
          ...rule,
          props: {
            style: {
              ...rule.props.style,
              marginTop: "40px",
              marginBottom: "30px",
            },
          },
        },
        {
          type: "div",
          props: {
            style: { fontSize: "30px", color: MUTED, textAlign: "center" },
            children: `${siteMark}  ·  ${dateLine}`,
          },
        },
      ],
    },
  }

  // biome-ignore lint/suspicious/noExplicitAny: satori's vnode type is structural
  const svg = await satori(element as any, { width: W, height: H, fonts })
  return sharp(Buffer.from(svg)).png().toBuffer()
}
