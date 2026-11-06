export default function PressImage({ item, alt = '' }) {
  if (!item.image) return null
  return <span className="press-image" data-fit={item.image.fit}>
    <img src={item.image.src} width={item.image.width} height={item.image.height} style={item.image.position?{objectPosition:item.image.position}:undefined} alt={alt} loading="lazy" decoding="async"/>
    {item.type==='video'&&<span className="press-play" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 16 16"><path d="m5 3 8 5-8 5Z" fill="currentColor"/></svg></span>}
  </span>
}
