export default function ResearchArt({ topic, large = false }) {
  return <svg className={`research-art ${topic}`} viewBox="0 0 160 112" width={large?'100%':104} height={large?180:80} fill="none" aria-hidden="true">
    <path d="m22 81 57-31 59 31-57 31Z" fill="currentColor" opacity=".09"/>
    {topic==='agent' ? <>
      <path d="m80 15 27 15v31L80 77 53 61V30Z" fill="#88aaa0"/><path d="m53 30 27 15 27-15M80 45v32" stroke="#34594f" strokeWidth="2"/>
      <path d="M41 43H26v39h33m60-39h15v39h-33" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5"/><path d="m97 79 6 3-6 3m-44-6-6 3 6 3" stroke="currentColor" strokeWidth="2"/>
    </> : topic==='speech' ? <>
      <path d="M27 57h11l5-9 7 30 10-56 10 70 10-50 9 28 7-18 8 5h29" stroke="#3c776a" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M27 30v-9h20m66 0h20v9M27 85v9h20m66 0h20v-9" stroke="currentColor" strokeWidth="1.5" opacity=".45"/>
    </> : <>
      <ellipse cx="81" cy="77" rx="38" ry="17" stroke="#3c776a" strokeWidth="2"/><ellipse cx="81" cy="77" rx="56" ry="26" stroke="#3c776a" opacity=".4" strokeWidth="2"/>
      <path d="m66 41 15-9 15 9v30l-15 9-15-9Z" fill="#ce967e"/><path d="m66 41 15 9 15-9M81 50v30" stroke="#865d4e" strokeWidth="1.5"/>
      <path d="M81 18v-8m-24 17-6-7m54 7 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </>}
  </svg>
}
