export function dateLabel(start, end) {
  if (!start) return ''
  const [y,m,d] = start.split('-')
  if (!m) return y
  const month = new Date(`${y}-${m}-01T12:00:00Z`).toLocaleString('en-US',{month:'short',timeZone:'UTC'})
  if (!d) return `${month} ${y}`
  if (end && end.slice(0,7) === start.slice(0,7)) return `${Number(d)}–${Number(end.slice(8))} ${month} ${y}`
  return `${Number(d)} ${month} ${y}`
}
export function bibtex(p) {
  const type = ['Poster','Oral','Conference','Student Challenge'].includes(p.status) ? 'inproceedings' : 'article'
  const authors = p.authors.map(a=>{const n=a.split(' ');return `${n.pop()}, ${n.join(' ')}`}).join(' and ')
  const note = ['Oral','Poster','Student Challenge'].includes(p.status) ? `\n  note = {${p.status}},` : ''
  return `@${type}{lu2026${p.id.replaceAll('-','')},\n  title = {${p.title}},\n  author = {${authors}},\n  ${type==='article'?'journal':'booktitle'} = {${p.venueFull||p.venue}},\n  year = {${p.year}},${note}\n  url = {${p.links.Paper}}\n}`
}
