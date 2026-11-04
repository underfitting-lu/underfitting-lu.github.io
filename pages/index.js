import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { Box, Heading, Link, Text, Button, useColorMode } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import Section from '../components/section'
import ResearchArt from '../components/research-art'
import data from '../content.json'
const ResearchScene = dynamic(()=>import('../components/research-scene'),{ssr:false,loading:()=> <div className="scene-loading" aria-label="Loading research workbench"><ResearchArt topic="agent" large /></div>})

export default function Home() {
  const {colorMode} = useColorMode()
  return <Article>
    <Box className="scene-frame"><ResearchScene theme={colorMode} /></Box>
    <Box className="greeting" textAlign="center" py={2.5} px={3} borderRadius="lg" mb={7}>Agent · Speech · Perception</Box>
    <div className="identity">
      <div><Heading as="h1" size="xl" letterSpacing="-.8px">Zijian Lu</Heading><Text mt={1}>Undergraduate researcher at <Link href={data.organizations.university}>NJUPT</Link></Text></div>
      <img className="portrait" src="/assets/profile.jpg" alt="Zijian Lu" width="96" height="96" fetchPriority="high" />
    </div>
    <Section>
      <Heading as="h2" variant="section-title">About</Heading>
      <p>I study how agents perceive, reason, and act, with a focus on speech and multimodal sensing. My work draws on machine learning, LLMs, and representation learning.</p>
      <p className="paragraph-gap">I’m part of <Link href={data.organizations.group}>MICS</Link> and the <Link href={data.organizations.company}>Forget-Me-Not</Link> team, bringing speech AI into community health care.</p>
      <div className="social-links"><Link href={data.scholar}>Scholar ↗</Link><Link href={data.github}>GitHub ↗</Link><Link href="/assets/Zijian_Lu_CV.pdf">CV ↗</Link><Link href={`mailto:${data.email}`}>Email ↗</Link></div>
    </Section>
    <Section>
      <Heading as="h2" variant="section-title">Selected research</Heading>
      <div className="selected-papers">{data.papers.filter(p=>p.featured).map(p=><NextLink className="selected-paper" key={p.id} href={`/papers/#${p.id}`}>
        <ResearchArt topic={p.topics[0]} /><div><h3>{p.short}</h3><p>{p.venue} {p.year} · {p.status}{p.accepted?' · Accepted':''}{p.ccf&&<strong> · {p.ccf.label}</strong>}</p></div><span aria-hidden="true">↗</span>
      </NextLink>)}</div>
      <Box textAlign="center" mt={5}><Button as={NextLink} href="/papers/" bg="grassTeal" color="#202023" _hover={{bg:'#9dd6d2'}} size="sm">All publications <span aria-hidden="true">&nbsp; →</span></Button></Box>
    </Section>
    <Section>
      <Heading as="h2" variant="section-title">News</Heading>
      <ul className="news-list">
        <li><time>Nov 2026</time><span>Two papers accepted at <Link href="/papers/#safeplanner">IEEE GLOBECOM 2026</Link>.</span></li>
        <li><time>Nov 2026</time><span><Link href="/papers/#contractskill">ContractSkill</Link> accepted at ACM MM (Poster); <Link href="/papers/#speech-screening">speech screening</Link> at NCMMSC (Oral).</span></li>
        <li><time>Aug 2026</time><span>Our project featured in <Link href={data.milestones[1].links['Read feature']}>People’s Daily Overseas Edition</Link>.</span></li>
      </ul>
      <Box textAlign="right" mt={3}><Link as={NextLink} href="/about/#timeline">More from the journey →</Link></Box>
    </Section>
  </Article>
}
