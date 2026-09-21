import test from 'node:test'
import assert from 'node:assert/strict'
import { markdownToHtml } from 'satteri'
import { literalInlineDirectives } from '../src/lib/literal-inline-directives.mjs'

for (const source of [
  '2023 年，我写过一个判断:技术进步的方向,是让生产越来越不需要人。',
  'An observation:technology keeps changing. Another :note[ordinary text].',
  '😀观察:技术进步。后面仍有文字。',
]) {
  test(`preserves prose: ${source}`, async () => {
    const result = await markdownToHtml(source, {
      features: { directive: true },
      mdastPlugins: [literalInlineDirectives],
    })
    assert.ok(result.html.includes(source), result.html)
  })
}
