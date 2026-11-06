import { Heading, Link } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import PressImage from '../components/press-image'
import { dateLabel } from '../lib/format'
import data from '../content.json'

export default function Press() {
  return <Article title="Press">
    <Heading as="h1" className="page-title" mb={3}>Press<span className="name-dot">.</span></Heading>
    <p className="page-intro"><Link href={data.pressSource.url}>勿忘我 · Newsroom ↗</Link></p>
    <div className="press-list">
      {data.press.map(item=><Link className="press-row" href={item.url} key={item.id} id={item.id}>
        <PressImage item={item}/>
        <div className="press-copy">
          <div className="press-meta"><span lang="zh-CN">{item.publisher}</span>{item.date&&<time dateTime={item.date}>{dateLabel(item.date)}</time>}</div>
          <h2 lang="zh-CN">{item.title}</h2>
        </div>
        <span className="press-arrow" aria-hidden="true">↗</span>
      </Link>)}
    </div>
  </Article>
}
