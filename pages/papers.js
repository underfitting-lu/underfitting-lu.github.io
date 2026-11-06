import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heading, Link, Input } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import TopicFilter from '../components/topic-filter'
import {dateLabel,bibtex} from '../lib/format'
import data from '../content.json'

export default function Papers() {
  const [query,setQuery] = useState('')
  const [topic,setTopic] = useState('all')
  const papers=data.papers.filter(p=>(topic==='all'||p.topics.includes(topic))&&`${p.title} ${p.authors.join(' ')} ${p.venue} ${p.venueFull||''}`.toLowerCase().includes(query.toLowerCase()))
  return <Article title="Papers">
    <Heading as="h1" className="page-title" mb={3}>Papers<span className="name-dot">.</span></Heading>
    <p className="page-intro"><Link href={data.scholar}>Google Scholar ↗</Link><span> · </span><Link href="/publications.bib" download>Download BibTeX ↓</Link></p>
    <div className="paper-controls"><label className="search-box"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><Input aria-label="Search publications" placeholder="Search papers…" value={query} onChange={e=>setQuery(e.target.value)} variant="unstyled" /></label><TopicFilter value={topic} onChange={setTopic} id="papers" /></div>
    <div aria-live="polite" className="results-count">{papers.length} {papers.length===1?'publication':'publications'}</div>
    <motion.div layout className="paper-list"><AnimatePresence initial={false} mode="popLayout">{papers.map(p=><motion.section layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.985}} transition={{duration:.25}} className="paper" key={p.id} id={p.id}>
      <Link className="paper-preview" href={p.links.Paper} aria-label={`Read ${p.short}`}><img src={p.preview.src} width={p.preview.width} height={p.preview.height} alt="" loading="lazy" decoding="async" /></Link>
      <div className="paper-body">
      <p className="paper-venue"><Link href={p.venueUrl}>{p.status==='Preprint'?'arXiv':p.venueFull||p.venue} {p.year}</Link><span> · {p.status}{p.accepted?' · Accepted':''}</span>{p.ccf&&<> · <Link href={p.ccf.source} fontWeight="bold" title={p.ccf.note||'China Computer Federation recommended conference ranking'}>{p.ccf.label}</Link></>}</p>
      <h2><Link href={p.links.Paper} color="inherit">{p.title}</Link></h2>
      <p className="authors">{p.authors.map((a,i)=><span key={a}>{i?', ':''}{a==='Zijian Lu'?<strong>{a}</strong>:a}</span>)}</p>
      <div className="paper-links">{Object.entries(p.links).map(([label,href])=><Link key={label} href={href}>{label} ↗</Link>)}<details className="cite"><summary>BibTeX</summary><pre>{bibtex(p)}</pre></details></div>
      <details className="paper-details"><summary>Details</summary><p>{p.summary}</p>{p.bibliographicDetails&&<p>{p.bibliographicDetails}.</p>}{p.ccf?.note&&<p>{p.ccf.note}</p>}
        <ul>{p.dates.map(d=><li key={d.label}>{d.label}: <Link href={d.source.includes('api.crossref')?p.links.Paper:d.source}>{dateLabel(d.start,d.end)}</Link></li>)}</ul>
        {p.alternateTitle&&<p>Earlier title: {p.alternateTitle}</p>}
      </details>
      </div>
    </motion.section>)}</AnimatePresence></motion.div>
    {papers.length===0&&<p className="empty-state">No matching papers. Try another title or topic.</p>}
  </Article>
}
