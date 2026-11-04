// Adapted from Craftzdog's section component.
import { motion, useReducedMotion } from 'framer-motion'
export default function Section({ children, delay = 0, ...props }) {
  const reduced = useReducedMotion()
  return <motion.section initial={false} whileInView={{y:0}} style={{y:reduced?0:18}} viewport={{once:true,amount:.08}} transition={{duration:.65,delay,ease:[.22,1,.36,1]}} className="section" {...props}>{children}</motion.section>
}
