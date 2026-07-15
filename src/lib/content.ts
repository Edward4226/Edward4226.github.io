import { getCollection, type CollectionEntry } from "astro:content"
import { type Lang, defaultLang, ui } from "@/i18n"

export const pageTitle = (title: string, lang: Lang = defaultLang) =>
  `${title} | ${ui[lang].siteName}`

export const postSlug = (post: CollectionEntry<"blog">) =>
  post.data.urlSlug ?? post.id

// Filename-safe, unique-per-entry key for the generated OG image (`/og/<key>.png`).
// The entry id already encodes language (e.g. `diploma-futures-zh`); strip the
// glob loader's trailing `/index` and flatten any path separators.
export const ogSlug = (post: CollectionEntry<"blog">) =>
  post.id.replace(/\/index$/, "").replace(/\//g, "-")

export async function getPosts(
  lang: Lang = defaultLang,
): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  return posts
    .filter((post) => (post.data.lang ?? defaultLang) === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}
