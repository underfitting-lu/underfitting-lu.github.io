import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heading, Link, useColorMode } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import Section from '../components/section'
import ResearchArt from '../components/research-art'
import TopicFilter from '../components/topic-filter'
import data from '../content.json'
const ResearchScene = dynamic(()=>import('../components/research-scene'),{ssr:false,loading:()=> <div className="scene-loading" aria-label="Loading research workbench"><ResearchArt topic="agent" large /></div>})

export default function Home() {
  const {colorMode} = useColorMode()
  const [topic,setTopic] = useState('all')
  const selected = data.papers.filter(p=>p.featured&&(topic==='all'||p.topics.includes(topic)))
  return <Article>
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <div className="hero-intro">
          <img className="portrait" src="/assets/profile.jpg" alt="Zijian Lu" width="48" height="48" fetchPriority="high" />
          <div>Undergraduate researcher<br/><Link href={data.organizations.university}>NJUPT</Link><span className="intro-dot"> / </span><Link href={data.organizations.group}>MICS</Link></div>
        </div>
        <Heading as="h1" id="home-title" className="hero-title">Zijian Lu<span className="name-dot">.</span></Heading>
        <p className="hero-lead">I study how agents<br className="desktop-break"/> perceive, reason, and act.</p>
        <p className="hero-description">Speech and multimodal sensing, grounded in machine learning, LLMs, and representation learning.</p>
        <div className="social-links hero-links">
          <Link href={data.scholar} className="primary-link">Scholar <span>↗</span></Link>
          <Link href={data.github}>GitHub <span>↗</span></Link>
          <Link href="/assets/Zijian_Lu_CV.pdf">CV <span>↗</span></Link>
          <Link href={`mailto:${data.email}`}>Email <span>↗</span></Link>
        </div>
      </div>
      <div className="hero-visual">
        <div className="scene-halo" aria-hidden="true"/><div className="scene-orbit" aria-hidden="true"/>
        <div className="scene-frame"><ResearchScene theme={colorMode} /></div>
        <div className="signal-chip signal-chip-wave" aria-hidden="true"><svg viewBox="0 0 88 28" fill="none"><path d="M2 14h8l4-6 5 13 5-20 6 26 6-22 5 14 5-9 5 4h35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        <div className="signal-chip signal-chip-agent" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><rect x="8" y="8" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v6m8-6v6m-8 16v6m8-6v6M2 12h6m-6 8h6m16-8h6m-6 8h6" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="15" r="1.3" fill="currentColor"/><circle cx="19" cy="15" r="1.3" fill="currentColor"/><path d="M13 19h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
      </div>
    </section>
    <Section id="research">
      <div className="section-heading">
        <Heading as="h2" variant="section-title">Selected research</Heading>
        <Link as={NextLink} href="/papers/" className="text-link">All papers <span>↗</span></Link>
      </div>
      <TopicFilter value={topic} onChange={setTopic} id="home" />
      <motion.div layout className="selected-papers">
        <AnimatePresence initial={false} mode="popLayout">
          {selected.map(p=><motion.div className="research-card-wrap" layout key={p.id} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.97}} transition={{duration:.3}}>
            <NextLink className="selected-paper" href={`/papers/#${p.id}`}>
              <div className="research-card-art"><ResearchArt topic={p.topics[0]} large /><span className="card-arrow" aria-hidden="true">↗</span></div>
              <div className="research-card-copy"><h3>{p.short}</h3>
                <p className="research-meta">{p.venue} {p.year} · {p.status}</p>
                {p.ccf&&<span className="rank-label">{p.ccf.label}</span>}
              </div>
            </NextLink>
          </motion.div>)}
        </AnimatePresence>
      </motion.div>
    </Section>
    <Section>
      <div className="home-bottom">
        <div className="news-panel">
          <div className="section-heading"><Heading as="h2" variant="section-title">Latest</Heading><Link as={NextLink} href="/about/#timeline" className="text-link">Timeline ↗</Link></div>
          <ul className="news-list">
            <li><time>Nov 2026</time><span>Two papers accepted at <Link href="/papers/#safeplanner">IEEE GLOBECOM 2026</Link>.</span></li>
            <li><time>Nov 2026</time><span><Link href="/papers/#contractskill">ContractSkill</Link> at ACM MM (Poster); <Link href="/papers/#speech-screening">speech screening</Link> at NCMMSC (Oral).</span></li>
            <li><time>Aug 2026</time><span>Our project in <Link href={data.milestones[1].links['Read feature']}>People’s Daily Overseas Edition</Link>.</span></li>
          </ul>
        </div>
        <NextLink className="field-note" href="/works/">
          <div className="field-note-image"><img src="/assets/forget-me-not.jpg" width="600" height="400" loading="lazy" alt="The Forget-Me-Not team presenting its community health project"/><span aria-hidden="true">↗</span></div>
          <div><h3>Forget-Me-Not</h3><p>Speech AI for community health care.</p></div>
        </NextLink>
      </div>
    </Section>
  </Article>
}
