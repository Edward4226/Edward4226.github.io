import { getPosts } from "@/lib/content"
import type { Lang } from "@/i18n"

const catalog = [
  { slug: "education", zh: { title: "教育与承诺", description: "文凭、技能与工作之间，哪些承诺仍然成立？" }, en: { title: "Education and its promises", description: "Which promises still hold between credentials, skills, and work?" } },
  { slug: "intelligence-and-people", zh: { title: "AI与人的处境", description: "当智能进入现有制度，人的能力与选择会发生什么变化？" }, en: { title: "Intelligence and people", description: "What happens to human ability and choice when intelligence enters existing institutions?" } },
  { slug: "agents-and-work", zh: { title: "Agent与工作方式", description: "从提出请求到持续完成工作，谁发现目标，谁确认结果？" }, en: { title: "Agents and work", description: "From making a request to sustaining work: who sets the goal, and who verifies the result?" } },
] as const

export const dossierHref = (lang: Lang, slug: string) => `${lang === "zh" ? "/zh" : ""}/dossiers/${slug}`

export async function getDossiers(lang: Lang) {
  const posts = await getPosts(lang)
  return catalog.map(topic => ({ slug: topic.slug, ...topic[lang], posts: posts.filter(post => post.data.dossier === topic[lang].title) }))
    .filter(topic => topic.posts.length > 0)
}
