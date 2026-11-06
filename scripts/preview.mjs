import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
const root=path.resolve('out')
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf','.json':'application/json'}
http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname))
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html')
  if(!fs.existsSync(file)){res.writeHead(404,{'Content-Type':'text/html'});res.end(fs.readFileSync(path.join(root,'404.html')));return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'})
  fs.createReadStream(file).pipe(res)
}).listen(3000,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:3000'))
