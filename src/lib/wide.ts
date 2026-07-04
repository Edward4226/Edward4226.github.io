import { defineMdastPlugin } from "satteri"

// :::wide — data-dense block: tables inside drop the roomy per-cell
// min-width, fill the full content column, and fall back to horizontal
// scroll. For charts/tables that need more room than prose measure.
export const wideDirective = defineMdastPlugin({
  name: "wide-directive",
  containerDirective(node, ctx) {
    if (node.name !== "wide") return
    ctx.setProperty(node, "data", {
      hName: "wide-block",
      hProperties: {},
    })
  },
})
