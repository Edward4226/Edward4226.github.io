import type { SvgComponent } from "astro/types"
import RSS from "@/assets/icons/rss.svg"

export const SITE = {
  title: "The Seam",
  description:
    "Data-driven, contrarian essays — finding where the data has already turned and consensus hasn't caught up.",
  locale: "en-US",
  dir: "ltr",
  defaultPageImage: "/static/opengraph-image.png",
  // Posts use per-article OG images generated at build time (see
  // src/pages/og/[route].png.ts); only static pages fall back to a shared image.
  // Search-engine verification tokens. Paste the value from
  // Google Search Console / Bing Webmaster (HTML-tag method) here.
  googleSiteVerification: "",
  bingSiteVerification: "",
} as const

export const SOCIALS: { href: string; label: string; icon: SvgComponent }[] = [
  { href: "/rss.xml", label: "RSS", icon: RSS },
]

export const NEWSLETTER = {
  // Buttondown username. Leave "" and the signup form stays hidden everywhere.
  // Once registered at buttondown.com (≤100 subscribers is free), paste the
  // account username here to turn the form on site-wide — no other change needed.
  buttondownUsername: "",
} as const
