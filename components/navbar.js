// Adapted from craftzdog/craftzdog-homepage's translucent navigation.
import NextLink from 'next/link'
import { Box, Container, Link, IconButton, Menu, MenuButton, MenuList, MenuItem, useColorMode, useColorModeValue } from '@chakra-ui/react'

const items = [['/papers','Papers'],['/works','Works'],['/about','About']]
function Glyph({ type }) {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    {type === 'menu' ? <path d="M4 6h16M4 12h16M4 18h16" /> : type === 'moon' ? <path d="M20.5 14.3A9 9 0 0 1 9.7 3.5 9 9 0 1 0 20.5 14.3Z" /> : <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/></>}
  </svg>
}
export default function Navbar({ path }) {
  const { colorMode, toggleColorMode } = useColorMode()
  const background = useColorModeValue('#f0e7dbb8','#202023c4')
  return <Box as="nav" aria-label="Main navigation" position="fixed" top={0} w="100%" zIndex={20} bg={background} css={{backdropFilter:'blur(12px)'}}>
    <Container maxW="container.md" display="flex" alignItems="center" p={2} gap={1}>
      <Link as={NextLink} href="/" className="wordmark" color="inherit" aria-label="Zijian Lu home" mr={{base:'auto',md:5}}>
        <svg viewBox="0 0 28 28" width="27" height="27" fill="none" aria-hidden="true"><path d="m14 2 11 6v12l-11 6-11-6V8Z" stroke="currentColor" strokeWidth="1.7"/><path d="m3 8 11 6 11-6M14 14v12" stroke="currentColor" strokeWidth="1.7"/><circle cx="14" cy="14" r="3" fill="#88ccca"/></svg>
        Zijian Lu
      </Link>
      <Box display={{base:'none',md:'flex'}} gap={1} flex={1}>
        {items.map(([href,label])=><Link key={href} as={NextLink} href={href} aria-current={path===href?'page':undefined} px={3} py={1.5} borderRadius="md" color={path===href?'#202023':'inherit'} bg={path===href?'grassTeal':undefined}>{label}</Link>)}
      </Box>
      <IconButton aria-label={colorMode==='light'?'Switch to dark theme':'Switch to light theme'} icon={<Glyph type={colorMode==='light'?'moon':'sun'} />} onClick={toggleColorMode} bg={colorMode==='light'?'#715b96':'#edc26d'} color={colorMode==='light'?'white':'#202023'} _hover={{opacity:.85}} size="sm" />
      <Box display={{base:'block',md:'none'}} ml={2}><Menu>
        <MenuButton as={IconButton} variant="outline" size="sm" aria-label="Open navigation" icon={<Glyph type="menu" />} />
        <MenuList>{[['/','Home'],...items].map(([href,label])=><MenuItem key={href} as={NextLink} href={href}>{label}</MenuItem>)}</MenuList>
      </Menu></Box>
    </Container>
  </Box>
}
