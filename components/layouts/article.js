// Adapted from Craftzdog's article layout, with progressively visible content.
import { motion } from 'framer-motion'
import Head from 'next/head'
export default function Article({ children, title }) {
  return <motion.article initial={false} animate={{opacity:1,y:0}} transition={{duration:.4,ease:'easeInOut'}}>
    {title && <Head><title>{title} — Zijian Lu</title><meta property="og:title" content={`${title} — Zijian Lu`} key="og-title" /></Head>}
    {children}
  </motion.article>
}
