import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, useColorMode } from '@chakra-ui/react'

const items = [['/','Home'],['/papers','Papers'],['/works','Works'],['/press','Press'],['/about','About']]
function Glyph({ type }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    {type === 'menu' ? <path d="M4 8h16M4 16h16" /> : type === 'moon' ? <path d="M20.5 14.3A9 9 0 0 1 9.7 3.5 9 9 0 1 0 20.5 14.3Z" /> : <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/></>}
  </svg>
}
export default function Navbar({ path }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <nav aria-label="Main navigation" className={`site-nav${scrolled?' is-scrolled':''}`}>
    <Link as={NextLink} href="/" className="wordmark" color="inherit" aria-label="Zijian Lu home">
      <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true"><path d="M16 3v26M3 16h26M7 7l18 18M7 25 25 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
      <span>Zijian Lu</span>
    </Link>
    <div className="desktop-nav">
      {items.map(([href,label])=><Link key={href} as={NextLink} href={href} className="nav-link" aria-current={path===href?'page':undefined} color="inherit">
        {path===href&&<motion.span className="nav-active" layoutId="nav-active" transition={{type:'spring',stiffness:380,damping:32}} />}
        <span>{label}</span>
      </Link>)}
    </div>
    <div className="nav-actions">
      <IconButton className="theme-toggle" aria-label={colorMode==='light'?'Switch to dark theme':'Switch to light theme'} icon={<Glyph type={colorMode==='light'?'moon':'sun'} />} onClick={toggleColorMode} variant="ghost" borderRadius="full" size="sm" />
      <Box className="mobile-nav"><Menu>
        <MenuButton as={IconButton} variant="ghost" size="sm" borderRadius="full" aria-label="Open navigation" icon={<Glyph type="menu" />} />
        <MenuList>{items.map(([href,label])=><MenuItem key={href} as={NextLink} href={href} aria-current={path===href?'page':undefined}>{label}</MenuItem>)}</MenuList>
      </Menu></Box>
    </div>
  </nav>
}
