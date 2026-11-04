import { Heading, Link, SimpleGrid } from '@chakra-ui/react'
import Article from '../components/layouts/article'
import Section from '../components/section'
import ResearchArt from '../components/research-art'
import data from '../content.json'

const works=[
  {name:'ContractSkill',topic:'agent',url:'https://github.com/underfitting-lu/contractskill',text:'Executable skills with contracts, verification, and local repair for web agents.'},
  {name:'ResearchOS',topic:'speech',url:'https://github.com/underfitting-lu/researchos-campus-agent',text:'A campus research assistant for organizing academic work.'},
  {name:'Multimodal Maintenance Assistant',topic:'perception',url:'https://github.com/underfitting-lu/multimodal-maintenance-assistant',text:'Combining visual and language inputs for equipment maintenance.'}
]
export default function Works() {
  return <Article title="Works"><Heading as="h1" className="page-title" mb={8}>Works<span className="name-dot">.</span></Heading>
    <Section><Link href={data.organizations.company} className="project-photo"><img src="/assets/forget-me-not.jpg" width="1000" height="750" alt="The Forget-Me-Not team presenting its community health project" /></Link>
      <Heading as="h2" size="md" mt={4} mb={2}><Link href={data.organizations.company} color="inherit">Forget-Me-Not ↗</Link></Heading>
      <p>Speech-based cognitive screening, built for familiar telephone conversations and community health care.</p>
      <div className="social-links"><Link href={data.organizations.company}>Website ↗</Link><Link href="https://www.njjy.gov.cn/jyyw/202605/t20260522_5844613.html">Community pilot ↗</Link><Link href="https://paper.people.com.cn/rmrbhwb/pad/content/202608/03/content_30172676.html">Press ↗</Link></div>
    </Section>
    <Section><Heading as="h2" variant="section-title">Open source</Heading><SimpleGrid columns={{base:1,sm:2}} gap={7}>
      {works.map(w=><div className="work" key={w.name}><Link className="work-art" href={w.url} aria-label={w.name}><ResearchArt topic={w.topic} large /></Link><h3><Link href={w.url} color="inherit">{w.name} ↗</Link></h3><p>{w.text}</p></div>)}
    </SimpleGrid></Section>
  </Article>
}
