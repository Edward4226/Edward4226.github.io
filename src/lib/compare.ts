/**
 * compareDirective — 左右双色背离数据对比块
 *
 * 作者书写语法（容器指令，每行一条对比项）：
 *
 *   :::compare
 *   - 考研报名｜474万 → 343万｜三年 −28%
 *   - 国考过审｜约172万 → 342万｜三年翻倍
 *   :::
 *
 * 每条目用 ｜（全角）或 |（半角）分三段：标签 | 数字变化 | 说明注释
 * 0-index 偶数行渲染为 down（砖红/下行），奇数行渲染为 up（松绿/上行）。
 */

import type { ElementContent } from "hast"
import { toHtml } from "hast-util-to-html"
import { h } from "hastscript"
import { defineMdastPlugin } from "satteri"

/** 递归提取节点纯文本（不依赖 satteri 内部 textContent 的签名） */
function nodeText(n: unknown): string {
  const node = n as { type?: string; value?: string; children?: unknown[] }
  if (node?.type === "text") return node.value ?? ""
  return (node?.children ?? []).map(nodeText).join("")
}

/** 解析单条目文本，用 ｜ 或 | 切成三段 */
function parseItem(text: string): { label: string; nums: string; note: string } {
  const parts = text.split(/｜|\|/).map((s) => s.trim())
  const [label = "", nums = "", note = ""] = parts
  return { label, nums, note }
}

export const compareDirective = defineMdastPlugin({
  name: "compare-directive",
  containerDirective(node, ctx) {
    if (node.name !== "compare") return

    const rawItems: string[] = []
    const childrenToRemove: Parameters<typeof ctx.removeNode>[0][] = []

    for (const child of node.children) {
      const c = child as { type: string; children?: unknown[] }
      if (c.type === "list" && c.children) {
        for (const listItem of c.children) {
          const text = nodeText(listItem).trim()
          if (text) rawItems.push(text)
        }
        childrenToRemove.push(child as Parameters<typeof ctx.removeNode>[0])
      } else if (c.type === "paragraph") {
        const text = nodeText(child).trim()
        for (const line of text.split("\n")) {
          const t = line.trim()
          if (t) rawItems.push(t)
        }
        childrenToRemove.push(child as Parameters<typeof ctx.removeNode>[0])
      }
    }

    if (rawItems.length === 0) return

    const rowsHtml = rawItems
      .map((itemText, index) => {
        const { label, nums, note } = parseItem(itemText)
        const dir = index % 2 === 0 ? "down" : "up"
        const cols: ElementContent[] = []
        if (label) cols.push(h("span.compare-label", label))
        if (nums) cols.push(h("span.compare-nums", nums))
        if (note) cols.push(h("span.compare-note", note))
        return toHtml(h(`div.compare-row[data-dir=${dir}]`, cols), {
          allowDangerousHtml: true,
        })
      })
      .join("\n")

    for (const child of childrenToRemove) {
      ctx.removeNode(child)
    }

    ctx.prependChild(node, { type: "html", value: rowsHtml })
    ctx.setProperty(node, "data", {
      hName: "div",
      hProperties: { dataCompare: "" },
    })
  },
})
