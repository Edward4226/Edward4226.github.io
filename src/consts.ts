import type { SvgComponent } from "astro/types"
import RSS from "@/assets/icons/rss.svg"

export const SITE = {
  title: "「枢机」",
  description: "在不确定的世界里,留下一些确定的判断。",
  locale: "zh-CN",
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
