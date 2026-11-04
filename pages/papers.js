import { useState } from 'react'
import { Heading, Link, Input, Button } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import {dateLabel,bibtex} from '../lib/format'
import data from '../content.json'

export default function Papers() {
  const [query,setQuery] = useState('')
  const [topic,setTopic] = useState('all')
  const papers=data.papers.filter(p=>(topic==='all'||p.topics.includes(topic))&&`${p.title} ${p.authors.join(' ')} ${p.venue} ${p.venueFull||''}`.toLowerCase().includes(query.toLowerCase()))
  return <Article title="Papers">
    <Heading as="h1" size="xl" mb={3}>Papers</Heading>
    <p className="page-intro"><Link href={data.scholar}>Google Scholar ↗</Link><span> · </span><Link href="/publications.bib" download>Download BibTeX ↓</Link></p>
    <div className="paper-controls"><Input aria-label="Search publications" placeholder="Search papers…" value={query} onChange={e=>setQuery(e.target.value)} variant="filled" size="sm" borderRadius="md" /><div className="filter-buttons" role="group" aria-label="Research topic">
      {['all','agent','speech','perception'].map(t=><Button key={t} size="sm" fontWeight="normal" onClick={()=>setTopic(t)} aria-pressed={topic===t} variant={topic===t?'solid':'ghost'} bg={topic===t?'grassTeal':undefined} color={topic===t?'#202023':undefined} _hover={topic===t?{bg:'#9dd6d2'}:undefined}>{t[0].toUpperCase()+t.slice(1)}</Button>)}
    </div></div>
    <div aria-live="polite" className="results-count">{papers.length} {papers.length===1?'publication':'publications'}</div>
    {papers.map(p=><section className="paper" key={p.id} id={p.id}>
      <p className="paper-venue"><Link href={p.venueUrl}>{p.status==='Preprint'?'arXiv':p.venueFull||p.venue} {p.year}</Link><span> · {p.status}{p.accepted?' · Accepted':''}</span>{p.ccf&&<> · <Link href={p.ccf.source} fontWeight="bold" title={p.ccf.note||'China Computer Federation recommended conference ranking'}>{p.ccf.label}</Link></>}</p>
      <h2><Link href={p.links.Paper} color="inherit">{p.title}</Link></h2>
      <p className="authors">{p.authors.map((a,i)=><span key={a}>{i?', ':''}{a==='Zijian Lu'?<strong>{a}</strong>:a}</span>)}</p>
      <div className="paper-links">{Object.entries(p.links).map(([label,href])=><Link key={label} href={href}>{label} ↗</Link>)}<details className="cite"><summary>BibTeX</summary><pre>{bibtex(p)}</pre></details></div>
      <details className="paper-details"><summary>Details</summary><p>{p.summary}</p>{p.bibliographicDetails&&<p>{p.bibliographicDetails}.</p>}{p.ccf?.note&&<p>{p.ccf.note}</p>}
        <ul>{p.dates.map(d=><li key={d.label}>{d.label}: <Link href={d.source.includes('api.crossref')?p.links.Paper:d.source}>{dateLabel(d.start,d.end)}</Link></li>)}</ul>
        {p.alternateTitle&&<p>Earlier title: {p.alternateTitle}</p>}
      </details>
    </section>)}
    {papers.length===0&&<p className="empty-state">No matching papers. Try another title or topic.</p>}
  </Article>
}
