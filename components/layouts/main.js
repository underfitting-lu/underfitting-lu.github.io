// Adapted from craftzdog/craftzdog-homepage. See LICENSE and THIRD_PARTY_NOTICES.md.
import Head from 'next/head'
import { Box } from '@chakra-ui/react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function Main({ children, router }) {
  const path = router.pathname === '/' ? '/' : `${router.pathname}/`
  return <>
    <Head>
      <title>Zijian Lu — Agent, Speech & Perception</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Zijian Lu, an undergraduate at NJUPT. Research in agents, speech, and perception, grounded in machine learning, LLMs, and representations." />
      <meta name="author" content="Zijian Lu" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="canonical" href={`https://underfitting-lu.github.io${path}`} />
      <meta property="og:site_name" content="Zijian Lu" />
      <meta property="og:title" content="Zijian Lu — Agent, Speech & Perception" key="og-title" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://underfitting-lu.github.io${path}`} />
      <meta property="og:image" content="https://underfitting-lu.github.io/assets/profile.jpg" />
      <meta name="twitter:card" content="summary" />
    </Head>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Navbar path={router.pathname} />
    <Box as="main" id="main-content" minH="85vh" pb={8}>
      <div className={`page-shell ${router.pathname === '/' ? 'home-shell' : 'inner-shell'}`}>
        {children}<Footer />
      </div>
    </Box>
  </>
}
