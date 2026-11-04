import { motion } from 'framer-motion'

export default function TopicFilter({ value, onChange, id }) {
  return <div className="topic-filter" role="group" aria-label="Research topic">
    {['all','agent','speech','perception'].map(topic=><button type="button" key={topic} onClick={()=>onChange(topic)} aria-pressed={value===topic}>
      {value===topic&&<motion.span className="filter-active" layoutId={`${id}-topic`} transition={{type:'spring',stiffness:400,damping:32}} />}
      <span>{topic[0].toUpperCase()+topic.slice(1)}</span>
    </button>)}
  </div>
}
