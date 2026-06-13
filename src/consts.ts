import type { SvgComponent } from "astro/types"
import RSS from "@/assets/icons/rss.svg"

export const SITE = {
  title: "The Seam",
  description:
    "Data-driven, contrarian essays — finding where the data has already turned and consensus hasn't caught up.",
  locale: "en-US",
  dir: "ltr",
  defaultPageImage: "/static/opengraph-image.png",
  defaultPostImage: "/static/1200x630.png",
} as const

export const NAVIGATION = [
  { href: "/blog", label: "「文章」" },
  { href: "/tags", label: "「标签」" },
]

export const SOCIALS: { href: string; label: string; icon: SvgComponent }[] = [
  { href: "/rss.xml", label: "RSS", icon: RSS },
]
