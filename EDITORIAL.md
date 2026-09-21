# 枢机 / The Seam：编辑与发布

## 开始写作

使用 Node.js 22.12 或以上版本，运行 `npm ci` 后运行 `npm run dev`。

```sh
npm run new-post -- --lang zh --slug my-next-essay --title "文章标题" --description "一句话说明文章判断" --dossier "教育与承诺"
```

新文件默认 `draft: true`，已有路径会拒绝覆盖。开发模式显示草稿；正式构建排除草稿正文、Markdown、RSS、站点地图与分享图。

**这个仓库是公开仓库。** `draft: true`只控制网站产物；提交到公开分支的Markdown依然公开。尚未准备公开的稿件应保留在本地编辑目录，发布候选分支只包含已决定公开的内容。

## 内容结构

文章位于 `src/content/blog/<name>/index.md`，必要字段为 `title`、`description`、`date`、`lang`、`urlSlug`、`authors`。语言为 `zh` 或 `en`；同一篇文章的译文使用相同 `urlSlug`。正式发表后保持slug稳定。

`kind`支持 `essay` 与 `signal`；`dossier`填写专题名，其对应描述与永久slug登记在 `src/lib/dossiers.ts`。只有存在可见文章的专题才显示。

可选字段有 `tags`、`dataAsOf`、`updated`、`sources`（title/url）、`revisions`（date/note）与 `changeMyMind`。只填写真实的来源、修订与判断条件。

## 编辑与验收

先确定文章判断、证据与最强反例，再编辑结构和句子。引用保留出处，动态产品资料标明核验时点。作者确定公开内容后，将该稿改为 `draft: false`。

运行 `npm run check`：构建、站内链接和锚点、深色主题、正文入口、重复slug与草稿排除。然后运行 `npm run preview` 阅读正式产物并检查手机布局。这些检查不能代替事实核验和作者评审。

## 发布与修订

提出PR后，GitHub Actions运行同一套检查；PR不会部署。合并到main后，既有Pages流程构建并部署。以Actions成功回执、正式页面、RSS和专题中实际出现的内容确认上线。

发布记录应保存文章永久链接、日期、提交与部署回执。收到真实反馈后记录原话与出处，再决定修订；修改事实或判断时更新 `updated` 和 `revisions`。邮件订阅仅在配置服务账号后启用，RSS无需额外服务。
