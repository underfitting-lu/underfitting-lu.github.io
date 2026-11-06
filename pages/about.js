import { Heading, Link } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import Section from '../components/section'
import { BioSection, BioYear } from '../components/bio'
import { dateLabel } from '../lib/format'
import data from '../content.json'

export default function About() {
  return <Article title="About"><Heading as="h1" className="page-title" mb={7}>About me<span className="name-dot">.</span></Heading>
    <Section><p>I’m Zijian Lu (陆梓健), a third-year Communication Engineering undergraduate at <Link href={data.organizations.university}>Nanjing University of Posts and Telecommunications</Link>.</p>
      <p className="paragraph-gap">At <Link href={data.organizations.group}>MICS</Link>, I work on agents, speech, and perception. I’m also a co-founder of <Link href={data.organizations.company}>Shouyi Technology / Forget-Me-Not</Link>, building voice AI for screening and companionship in Alzheimer’s disease, depression, Parkinson’s disease, and related conditions.</p>
      <div className="social-links"><Link href={`mailto:${data.email}`}>Email ↗</Link><Link href="/assets/Zijian_Lu_CV.pdf">CV ↗</Link><Link href={data.organizations.recruitment}>MICS speech group ↗</Link></div>
    </Section>
    <Section><Heading as="h2" variant="section-title">Education</Heading><BioSection><BioYear>2024</BioYear>— 2028 (expected)<br/><Link href={data.organizations.school}>B.Eng. in Communication Engineering, NJUPT</Link></BioSection></Section>
    <Section><Heading as="h2" variant="section-title">Selected honors</Heading><ul className="honors">{data.awards.filter(a=>!a.source).map(a=><li key={a.event}><time>{dateLabel(a.date,a.end)}</time><div><strong>{a.title}</strong><br/><Link href={a.eventUrl} title={a.linkDescription}>{a.event} ↗</Link></div></li>)}</ul></Section>
    <Section id="timeline"><Heading as="h2" variant="section-title">Along the way</Heading>
      <div className="photo-pair"><figure><img src="/assets/cscwd.jpg" width="1000" height="625" loading="lazy" alt="At IEEE CSCWD 2026 in Fuzhou"/><figcaption><Link href="https://fyust.edu.cn/gjhyqk/cscwd2026/">CSCWD 2026 · Fuzhou</Link></figcaption></figure><figure><img src="/assets/ubicomp.jpg" width="1000" height="625" loading="lazy" alt="At UbiComp and ISWC 2026 in Shanghai"/><figcaption><Link href="https://ubicomp.org/ubicomp-iswc-2026/iswc-cfp/">UbiComp 2026 · Shanghai</Link></figcaption></figure></div>
      <ol className="timeline">{data.milestones.map(m=><li key={m.title}><time>{dateLabel(m.start,m.end)}</time><h3><Link href={Object.values(m.links)[0]} color="inherit">{m.title}</Link></h3><p>{m.text}</p><div className="timeline-links">{Object.entries(m.links).map(([label,url])=><Link key={label} href={url}>{label} ↗</Link>)}</div></li>)}</ol>
    </Section>
  </Article>
}
