import type { APIContext } from "astro"
import { getPosts, postSlug } from "@/lib/content"

// Raw markdown endpoint: /blog/<slug>.md — clean source for AI agents & readers.
export async function getStaticPaths() {
  const posts = await getPosts("en")
  return posts.map((post) => ({
    params: { slug: postSlug(post) },
    props: { post },
  }))
}

export async function GET({ props }: APIContext) {
  const { post } = props
  const header = `# ${post.data.title}\n\n> ${post.data.description}\n\n`
  return new Response(header + (post.body ?? ""), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
