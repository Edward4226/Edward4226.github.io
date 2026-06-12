import type { SvgComponent } from "astro/types"
import RSS from "@/assets/icons/rss.svg"

export const SITE = {
  title: "「压舱石」",
  description:
    "一个数据驱动的个人博客:寻找那些数据已经转向、共识尚未跟上的边界,把判断写下来,留给时间检验。",
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
