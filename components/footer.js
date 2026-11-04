import { Box, Link } from '@chakra-ui/react'
export default function Footer() {
  return <Box as="footer" className="site-footer">
    <p>© 2026 Zijian Lu <Link href="https://github.com/underfitting-lu/underfitting-lu.github.io">Source ↗</Link></p>
    <p>Based on <Link href="https://www.craftz.dog/">Takuya Matsuyama’s website</Link>.</p>
  </Box>
}
