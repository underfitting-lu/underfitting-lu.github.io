import NextLink from 'next/link'
import { Heading, Link } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import Section from '../components/section'
import PressImage from '../components/press-image'
import data from '../content.json'

export default function Home() {
  return <Article>
    <section className="field-hero" aria-labelledby="home-title">
      <div className="field-visual" aria-hidden="true"><img src="/assets/research-field.svg" width="1400" height="820" alt="" fetchPriority="high" decoding="async" /></div>
      <div className="field-intro">
        <p className="field-kicker"><Link href={data.organizations.university}>Nanjing University of Posts and Telecommunications</Link></p>
        <Heading as="h1" id="home-title">Zijian Lu</Heading>
        <p className="field-role">Third-year undergraduate researcher</p>
      </div>
      <div className="field-foot">
        <div className="field-focus"><p>Agent · Speech · Perception</p><p>Machine learning · LLMs · Representation learning</p></div>
        <div className="field-contacts">
          <Link href={data.scholar}>Scholar ↗</Link>
          <Link href={data.github}>GitHub ↗</Link>
          <Link href="/assets/Zijian_Lu_CV.pdf">CV ↗</Link>
          <Link href={`mailto:${data.email}`}>Email ↗</Link>
        </div>
      </div>
    </section>
    <div className="home-context">
      <img src="/assets/profile.jpg" alt="Zijian Lu" width="56" height="70" className="editorial-portrait"/>
      <p>I study how agents perceive, reason, and act. I’m a co-founder of <Link href={data.organizations.company}>Shouyi Technology</Link>, building voice AI for health.</p>
      <Link as={NextLink} href="/about/" className="context-link">About ↗</Link>
    </div>
    <Section id="research">
      <div className="section-heading">
        <Heading as="h2" variant="section-title">Selected research</Heading>
        <Link as={NextLink} href="/papers/" className="text-link">All papers ↗</Link>
      </div>
      <div className="home-research-grid">
        {data.papers.filter(p=>p.featured).map(p=><NextLink className="research-entry" key={p.id} href={`/papers/#${p.id}`}>
          <div className="research-page"><img src={p.preview.src} width={p.preview.width} height={p.preview.height} alt="" loading="lazy" decoding="async"/></div>
          <div className="research-caption">
            <h3>{p.short}<span className="entry-arrow" aria-hidden="true">↗</span></h3>
            <p className="entry-meta">{p.venue} {p.year} · {p.status}</p>
            {p.ccf&&<p className="entry-rank">{p.ccf.label}</p>}
          </div>
        </NextLink>)}
      </div>
    </Section>
    <Section id="press">
      <div className="section-heading"><Heading as="h2" variant="section-title">Press</Heading><Link as={NextLink} href="/press/" className="text-link">All coverage ↗</Link></div>
      <div className="home-press-list">
        {[[0,'CCTV-1'],[11,'People’s Daily'],[1,'China News Service'],[6,'People.cn']].map(([index,label])=>{
          const item=data.press[index]
          return <Link href={item.url} key={item.id}>
            <PressImage item={item} alt={item.title}/>
            <span className="home-press-caption">{label}<span aria-hidden="true">↗</span></span>
          </Link>
        })}
      </div>
    </Section>
    <Section id="latest">
      <div className="section-heading"><Heading as="h2" variant="section-title">Latest</Heading><Link as={NextLink} href="/about/#timeline" className="text-link">Timeline ↗</Link></div>
      <ul className="editorial-news">
        <li><time>Nov 2026</time><p>Two papers accepted at <Link href="/papers/#safeplanner">IEEE GLOBECOM 2026</Link>.</p></li>
        <li><time>Nov 2026</time><p><Link href="/papers/#contractskill">ContractSkill</Link> at ACM MM (Poster); <Link href="/papers/#speech-screening">speech screening</Link> at NCMMSC (Oral).</p></li>
        <li><time>Aug 2026</time><p>Featured in <Link href={data.milestones[1].links['Read feature']}>People’s Daily Overseas Edition</Link>.</p></li>
      </ul>
    </Section>
  </Article>
}
