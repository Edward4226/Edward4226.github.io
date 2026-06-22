/**
 * sparklineDirective — 构建期 inline SVG 趋势图（零客户端 JS）
 *
 * 作者书写语法（容器指令，空正文 + 属性）：
 *
 *   :::sparkline{data="474,438,388,343" label="考研报名(万)" caption="2023→2026"}
 *   :::
 *
 * 属性：
 *   data    — 必填，逗号分隔的数字
 *   label   — 可选，语义标签 / aria 前缀（也作可见前缀文本）
 *   caption — 可选，折线后的小字说明
 *   width   — 可选，SVG 宽度 px（默认 200）
 *   height  — 可选，SVG 高度 px（默认 40）
 */

import { defineMdastPlugin } from "satteri"

const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 40
const PAD_X = 6
const PAD_Y = 4
const DOT_R = 2.5

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** 确定性 id（避免每次构建产物变动） */
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function buildSparklineSvg(
  values: number[],
  label: string,
  width: number,
  height: number,
): string {
  const n = values.length
  if (n === 0) return ""

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max === min ? 1 : max - min
  const innerW = width - PAD_X * 2
  const innerH = height - PAD_Y * 2

  const points = values.map((v, i) => {
    const x = PAD_X + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
    const y = PAD_Y + (1 - (v - min) / range) * innerH
    return [x, y] as [number, number]
  })

  const polyPts = points
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ")
  const titleText = label
    ? `${label}: ${values.join(", ")}`
    : `trend: ${values.join(", ")}`
  const first = points[0]!
  const last = points[n - 1]!
  const lastVal = String(values[n - 1])
  const titleId = `sp-${hashStr(titleText + width + height)}`

  return `<svg class="sparkline-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${titleId}" xmlns="http://www.w3.org/2000/svg"><title id="${titleId}">${escapeHtml(
    titleText,
  )}</title><polyline points="${polyPts}" fill="none" stroke="var(--sparkline-line, var(--accent))" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${first[0].toFixed(
    2,
  )}" cy="${first[1].toFixed(
    2,
  )}" r="${DOT_R}" fill="var(--sparkline-dot, var(--muted-foreground))"/><circle cx="${last[0].toFixed(
    2,
  )}" cy="${last[1].toFixed(
    2,
  )}" r="${DOT_R}" fill="var(--sparkline-line, var(--accent))"/><text x="${(
    last[0] +
    DOT_R +
    3
  ).toFixed(2)}" y="${(last[1] + 4).toFixed(
    2,
  )}" font-size="9" text-anchor="start" fill="var(--sparkline-label, var(--muted-foreground))">${escapeHtml(
    lastVal,
  )}</text></svg>`
}

export const sparklineDirective = defineMdastPlugin({
  name: "sparkline-directive",
  containerDirective(node, ctx) {
    if (node.name !== "sparkline") return

    const attrs = (node.attributes ?? {}) as Record<string, string>
    const label = attrs.label ?? ""
    const caption = attrs.caption ?? ""
    const width = Math.max(40, Number(attrs.width) || DEFAULT_WIDTH)
    const height = Math.max(20, Number(attrs.height) || DEFAULT_HEIGHT)
    const values = (attrs.data ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((v) => !Number.isNaN(v))

    if (values.length === 0) return

    const svg = buildSparklineSvg(values, label, width, height)
    const labelHtml = label
      ? `<span class="sparkline-label-text">${escapeHtml(label)}</span>`
      : ""
    const captionHtml = caption
      ? `<span class="sparkline-caption">${escapeHtml(caption)}</span>`
      : ""

    ctx.prependChild(node, {
      type: "html",
      value: labelHtml + svg + captionHtml,
    })
    ctx.setProperty(node, "data", {
      hName: "span",
      hProperties: { className: ["sparkline-wrap"] },
    })
  },
})
