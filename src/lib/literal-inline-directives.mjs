import { defineMdastPlugin } from 'satteri'

// Only block directives are part of this blog's authoring syntax. The parser
// also recognizes prose such as ":技术进步的方向" as an inline directive and
// drops its name unless we restore it as literal text.
export const literalInlineDirectives = defineMdastPlugin({
  name: 'literal-inline-directives',
  options: { position: true },
  textDirective(node, ctx) {
    const start = node.position?.start.offset
    const end = node.position?.end.offset
    if (start === undefined || end === undefined) {
      throw new Error('Inline directive is missing its source position')
    }
    ctx.replaceNode(node, { type: 'text', value: ctx.source.slice(start, end) })
  },
})
