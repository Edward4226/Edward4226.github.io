# 「压舱石」

在不确定的世界里,留下一些确定的判断。

一个数据驱动的中文个人博客:寻找那些数据已经转向、共识尚未跟上的边界,把判断写下来,留给时间检验。

- 线上地址:https://edward4226.github.io
- 技术栈:[Astro](https://astro.build) 静态站,基于 [astro-erudite](https://github.com/jktrn/astro-erudite)(MIT)二次开发
- 设计:宋体衬线 + 暖棕褐强调色,默认深色(暖墨黑),浅色为书页纸感;参考 [stephango.com](https://stephango.com) 与 [oscarmoxon.com](https://www.oscarmoxon.com) 的排版语言
- 写一篇文章:在 `src/content/blog/<slug>/index.md` 新建 Markdown,frontmatter 含 `title / description / date / tags / authors / dataAsOf`,推送到 main 即自动部署

## 本地开发

```sh
bun install
bun run dev    # http://localhost:4321
bun run build  # 产物在 dist/
```
