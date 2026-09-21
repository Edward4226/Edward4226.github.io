# 「枢机」

在不确定的世界里,留下一些确定的判断。

一个数据驱动的中文个人博客:寻找那些数据已经转向、共识尚未跟上的边界,把判断写下来,留给时间检验。

- 线上地址:https://edward4226.github.io
- 技术栈:[Astro](https://astro.build) 静态站,基于 [astro-erudite](https://github.com/jktrn/astro-erudite)(MIT)二次开发
- 设计:宋体衬线 + 暖棕褐强调色,固定深色(暖墨黑),无主题切换;参考 [stephango.com](https://stephango.com) 与 [oscarmoxon.com](https://www.oscarmoxon.com) 的排版语言
- 写一篇文章:在 `src/content/blog/<slug>/index.md` 新建 Markdown,frontmatter 含 `title / description / date / tags / authors / dataAsOf`,推送到 main 即自动部署

## 本地开发

```sh
npm ci
npm run dev    # http://localhost:4321
npm run check  # 构建并检查正式产物，输出在 dist/
```

当前编辑与发布说明见 [EDITORIAL.md](EDITORIAL.md)。Node.js 22.12以上可运行 `npm ci`、`npm run dev`、`npm run build`；npm工作流使用package-lock.json。原仓库bun.lock保留为历史依赖记录，更新依赖时采用一种包管理器。
