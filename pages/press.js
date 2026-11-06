import { Heading, Link } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import { dateLabel } from '../lib/format'
import data from '../content.json'

function PressIcon({ video }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {video ? <><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none"/></> : <><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/></>}
  </svg>
}

export default function Press() {
  return <Article title="Press">
    <Heading as="h1" className="page-title" mb={3}>Press<span className="name-dot">.</span></Heading>
    <p className="page-intro"><Link href={data.pressSource.url}>勿忘我 · Newsroom ↗</Link></p>
    <div className="press-list">
      {data.press.map(item=><Link className="press-row" href={item.url} key={item.id} id={item.id}>
        <span className="press-icon"><PressIcon video={item.type==='video'}/></span>
        <div className="press-copy">
          <div className="press-meta"><span lang="zh-CN">{item.publisher}</span>{item.date&&<time dateTime={item.date}>{dateLabel(item.date)}</time>}{item.type==='video'&&<span className="video-label">Video</span>}</div>
          <h2 lang="zh-CN">{item.title}</h2>
        </div>
        <span className="press-arrow" aria-hidden="true">↗</span>
      </Link>)}
    </div>
  </Article>
}
