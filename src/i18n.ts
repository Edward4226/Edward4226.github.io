export type Lang = "en" | "zh"
export const defaultLang: Lang = "en"
export const langs: Lang[] = ["en", "zh"]

export const ui = {
  en: {
    siteName: "The Seam",
    tagline: "Certain judgments in an uncertain world.",
    description:
      "Data-driven, contrarian essays — finding the places where the data has already turned and consensus hasn't caught up.",
    locale: "en-US",
    ogLocale: "en_US",
    writing: "Writing",
    allPosts: "All posts →",
    notFound: "This page doesn't exist.",
    backHome: "← Back home",
    minRead: (n: number) => `${n} min read`,
    dataAsOf: (d: string) => `data as of ${d}`,
    cite: "Cite",
    cited: "Copied",
    citeSource: "The Seam",
    switchLabel: "中文",
    about: "About",
    homeStance: "No fence-sitting. I post only once I've thought it through — then I say it flat out.",
  },
  zh: {
    siteName: "枢机",
    tagline: "在不确定的世界里,留下一些确定的判断。",
    description: "数据驱动的个人博客。寻找那些数据已经转向、共识尚未跟上的边界。",
    locale: "zh-CN",
    ogLocale: "zh_CN",
    writing: "文章",
    allPosts: "全部文章 →",
    notFound: "这个页面不存在。",
    backHome: "← 回到首页",
    minRead: (n: number) => `约 ${n} 分钟`,
    dataAsOf: (d: string) => `数据截至 ${d}`,
    cite: "引用本文",
    cited: "已复制",
    citeSource: "枢机",
    switchLabel: "EN",
    about: "关于",
    homeStance: "不打太极,不骑墙。想清楚了才发,发了就说死。",
  },
} as const

export function getLang(url: URL): Lang {
  return url.pathname === "/zh" || url.pathname.startsWith("/zh/") ? "zh" : "en"
}

export function t(lang: Lang) {
  return ui[lang]
}

export function homeHref(lang: Lang) {
  return lang === "zh" ? "/zh/" : "/"
}

export function blogHref(lang: Lang) {
  return lang === "zh" ? "/zh/blog" : "/blog"
}

export function postHref(lang: Lang, slug: string) {
  return lang === "zh" ? `/zh/blog/${slug}` : `/blog/${slug}`
}

export function aboutHref(lang: Lang) {
  return lang === "zh" ? "/zh/about" : "/about"
}

// Toggle to the other language, preserving the current section/slug.
// Slugs are identical across languages, so the target always exists.
export function switchHref(url: URL): string {
  const p = url.pathname.replace(/\/+$/, "") || "/"
  if (p === "/zh" || p.startsWith("/zh/")) {
    const rest = p.replace(/^\/zh/, "")
    return rest === "" ? "/" : rest
  }
  return p === "/" ? "/zh/" : `/zh${p}`
}
