import type { APIRoute, GetStaticPaths } from "astro"
import { getCollection, type CollectionEntry } from "astro:content"
import { ogSlug } from "@/lib/content"
import { renderPostOg } from "@/lib/og"

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog", (p) => !p.data.draft)
  return posts.map((post) => ({
    params: { route: ogSlug(post) },
    props: { post },
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const post = (props as { post: CollectionEntry<"blog"> }).post
  const d = post.data.date
  const dateLine = `${d.getUTCFullYear()}·${String(d.getUTCMonth() + 1).padStart(2, "0")}`
  const png = await renderPostOg(post, {
    siteMark: "枢机 · The Seam",
    dateLine,
  })
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
