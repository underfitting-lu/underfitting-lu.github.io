// Adapted from Craftzdog's section component.
import { motion } from 'framer-motion'
export default function Section({ children, delay = 0, ...props }) {
  return <motion.section initial={false} animate={{y:0,opacity:1}} transition={{duration:.8,delay}} className="section" {...props}>{children}</motion.section>
}
