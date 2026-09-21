import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
const args=process.argv.slice(2), values={}
if(args.includes('--help')||args.length===0){console.log('npm run new-post -- --lang zh --slug permanent-slug --title "文章标题" --description "文章简介" [--kind essay|signal] [--dossier "专题名"]');process.exit(0)}
for(let i=0;i<args.length;i+=2){if(!['--lang','--slug','--title','--description','--kind','--dossier'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw new Error('参数无效；运行 npm run new-post -- --help');values[args[i].slice(2)]=args[i+1]}
if(!['zh','en'].includes(values.lang)||!/^([a-z0-9]+-)*[a-z0-9]+$/.test(values.slug??'')||!values.title?.trim()||!values.description?.trim())throw new Error('必须提供语言、英文slug、标题和简介')
if(values.kind&&!['essay','signal'].includes(values.kind))throw new Error('kind应为essay或signal')
const target=path.join(process.cwd(),'src','content','blog',`${values.slug}-${values.lang}`)
const date=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'})
const frontmatter={title:values.title,description:values.description,date,lang:values.lang,urlSlug:values.slug,kind:values.kind??'essay',...(values.dossier?{dossier:values.dossier}:{}),authors:['edward'],draft:true}
await mkdir(target,{recursive:true})
const file=path.join(target,'index.md')
await writeFile(file,'---\n'+Object.entries(frontmatter).map(([k,v])=>`${k}: ${JSON.stringify(v)}`).join('\n')+'\n---\n\n',{encoding:'utf8',flag:'wx'})
console.log(`已创建草稿：${file}\n编辑后运行 npm run dev；发布前运行 npm run check。`)
