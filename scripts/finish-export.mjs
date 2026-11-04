import fs from 'node:fs'
import path from 'node:path'
const dir=path.resolve('out')
fs.writeFileSync(path.join(dir,'.nojekyll'),'')
const base='https://underfitting-lu.github.io'
fs.writeFileSync(path.join(dir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/papers/','/works/','/about/'].map(p=>`<url><loc>${base}${p}</loc></url>`).join('')}</urlset>`)
fs.writeFileSync(path.join(dir,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`)
for(const page of ['index.html','papers/index.html','works/index.html','about/index.html']) {
  const html=fs.readFileSync(path.join(dir,page),'utf8')
  if(!html.includes('Zijian Lu')||!html.includes('https://www.craftz.dog/')) throw new Error(`Missing identity/attribution in ${page}`)
  if(/dog\.glb|Takuya's homepage|payhip|@craftzdog/.test(html)) throw new Error(`Unreplaced source content in ${page}`)
}
console.log('Static export ready: home, papers, works, about.')
