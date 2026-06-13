import { SITE } from "@/consts"
import { getPosts } from "@/lib/content"
import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import MarkdownIt from "markdown-it"
import sanitizeHtml from "sanitize-html"

const parser = new MarkdownIt({ html: true })

export async function GET(context: APIContext) {
  const posts = await getPosts()
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
      content: sanitizeHtml(parser.render(post.body ?? ""), {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
      }),
    })),
  })
}
