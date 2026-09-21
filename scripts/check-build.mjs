import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
const root=process.cwd(),dist=path.join(root,'dist')
async function walk(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await walk(p));else result.push(p)}return result}
const files=await walk(dist),htmlFiles=files.filter(p=>p.endsWith('.html')),failures=[]
const contents=new Map(await Promise.all(htmlFiles.map(async p=>[p,await readFile(p,'utf8')]))),ids=new Map([...contents].map(([p,s])=>[p,new Set([...s.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]))]))
let checked=0
for(const [file,body] of contents){
  if(!body.includes('data-theme="dark"'))failures.push(`${path.relative(dist,file)}缺少深色主题`)
  if(!body.includes('id="main"'))failures.push(`${path.relative(dist,file)}缺少正文入口`)
  for(const [,href] of body.matchAll(/<a\b[^>]*?\bhref="([^"]+)"/g)){
    if(/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href))continue
    const url=new URL(href,`https://local.invalid/${path.relative(dist,file).replaceAll('\\','/')}`)
    let target=path.join(dist,decodeURIComponent(url.pathname));try{if((await stat(target)).isDirectory())target=path.join(target,'index.html');await stat(target)}catch{failures.push(`${path.relative(dist,file)} -> ${href}`);continue}
    if(url.hash&&ids.has(target)&&!ids.get(target).has(decodeURIComponent(url.hash.slice(1))))failures.push(`无效锚点：${href}`)
    checked++
  }
}
const contentFiles=(await walk(path.join(root,'src/content/blog'))).filter(p=>p.endsWith('.md')),slugs=new Set()
for(const p of contentFiles){const body=await readFile(p,'utf8'),fm=body.split('---')[1]??'',slug=fm.match(/^urlSlug:\s*["']?([^\s"']+)/m)?.[1],lang=fm.match(/^lang:\s*["']?(zh|en)/m)?.[1];if(!slug||!lang){failures.push(`${p}缺少永久slug或语言`);continue}if(slugs.has(`${lang}/${slug}`))failures.push(`重复文章路径：${lang}/${slug}`);slugs.add(`${lang}/${slug}`)
  if(/^draft:\s*true\s*$/m.test(fm)){for(const file of files.filter(p=>/\.(html|md|xml|txt|json)$/.test(p))){if((await readFile(file,'utf8')).includes(slug)||file.includes(slug))failures.push(`草稿出现在正式产物：${path.relative(dist,file)}`)}}
}
console.log(JSON.stringify({htmlPages:htmlFiles.length,checkedInternalLinks:checked,failures},null,2))
if(failures.length)process.exit(1)
