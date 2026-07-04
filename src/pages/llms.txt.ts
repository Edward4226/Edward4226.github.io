import type { APIContext } from "astro"
import { getPosts, postSlug } from "@/lib/content"
import { ui } from "@/i18n"

// llms.txt — index for AI crawlers/agents (llmstxt.org convention).
// Raw markdown of any post: append `.md` to its URL.
export async function GET(context: APIContext) {
  const site = context.site!
  const en = await getPosts("en")
  const zh = await getPosts("zh")

  const line = (post: (typeof en)[number], prefix: string) =>
    `- [${post.data.title}](${new URL(`${prefix}/${postSlug(post)}`, site)}): ${post.data.description}`

  const body = [
    `# ${ui.en.siteName} / ${ui.zh.siteName}`,
    "",
    `> ${ui.en.description}`,
    `> ${ui.zh.description}`,
    "",
    "Raw markdown for any post: append `.md` to its URL.",
    "",
    "## Posts (English)",
    ...en.map((p) => line(p, "/blog")),
    "",
    "## 文章（中文）",
    ...zh.map((p) => line(p, "/zh/blog")),
    "",
    "## Feeds",
    `- RSS (en): ${new URL("/rss.xml", site)}`,
    `- RSS (zh): ${new URL("/zh/rss.xml", site)}`,
  ].join("\n")

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
