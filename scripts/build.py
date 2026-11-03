"""Generate the static homepage from content.json. Python standard library only."""
from pathlib import Path
import html
import json

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'content.json').read_text(encoding='utf-8'))
esc = html.escape

def bibtex(p):
    kind = 'article' if p['status'] in ('Journal', 'Preprint') else 'inproceedings'
    authors = ' and '.join(name.rsplit(' ', 1)[-1] + ', ' + name.rsplit(' ', 1)[0] for name in p['authors'])
    venue_field = 'journal' if kind == 'article' else 'booktitle'
    link = next(iter(p['links'].values()))
    return f"@{kind}{{lu2026{p['id'].replace('-', '')},\n  title = {{{p['title']}}},\n  author = {{{authors}}},\n  {venue_field} = {{{p['venue']}}},\n  year = {{{p['year']}}},\n  url = {{{link}}},\n  note = {{{p['status']}}}\n}}"

papers = []
citations = []
for i, p in enumerate(data['papers'], 1):
    authors = ', '.join(f'<strong>{esc(a)}</strong>' if a == data['name'] else esc(a) for a in p['authors'])
    links = ''.join(f'<a href="{esc(url, quote=True)}" target="_blank" rel="noopener noreferrer">{esc(label)} <span aria-hidden="true">↗</span></a>' for label, url in p['links'].items())
    primary = next(iter(p['links'].values()))
    previous = f'<details class="previous-title"><summary>Earlier title</summary><p>{esc(p["alternateTitle"])}</p></details>' if p.get('alternateTitle') else ''
    papers.append(f'''<article class="publication" id="paper-{p['id']}" data-topics="{' '.join(p['topics'])}">
      <span class="pub-number" aria-hidden="true">{i:02d}</span><div>
      <div class="pub-heading"><h3 class="pub-title"><a href="{esc(primary, quote=True)}" target="_blank" rel="noopener noreferrer">{esc(p['title'])}</a></h3></div>
      <div class="pub-meta"><span class="venue">{esc(p['venue'])}</span><span>· {p['year']}</span><span class="status status-{p['status'].lower().replace(' ', '-')}">{esc(p['status'])}</span></div>
      <p class="pub-authors">{authors}</p><p class="pub-summary">{esc(p['summary'])}</p>
      <div class="pub-links">{links}<button class="cite-button js-only" data-cite="{p['id']}" aria-label="Cite {esc(p['short'], quote=True)}">BibTeX</button></div>{previous}</div>
      </article>''')
    citations.append(f'<script type="text/plain" id="bib-{p["id"]}">{bibtex(p)}</script>')

schema = {"@context": "https://schema.org", "@type": "Person", "name": data['name'], "alternateName": data['chineseName'], "url": "https://underfitting-lu.github.io/", "image": "https://underfitting-lu.github.io/assets/profile.jpg", "email": data['email'], "affiliation": {"@type": "CollegeOrUniversity", "name": "Nanjing University of Posts and Telecommunications"}, "sameAs": [data['github'], data['scholar']], "knowsAbout": ["AI Agents", "Speech", "Perception", "Machine Learning", "Large Language Models", "Representation Learning"]}

page = '''<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f7f6f1">
<title>Zijian Lu · Agent, Speech &amp; Perception</title>
<meta name="description" content="Zijian Lu (陆梓健), undergraduate researcher at NJUPT. Agent, speech, and perception research grounded in ML, LLMs, and representation learning.">
<link rel="canonical" href="https://underfitting-lu.github.io/">
<meta property="og:type" content="website"><meta property="og:title" content="Zijian Lu · Agent, Speech &amp; Perception">
<meta property="og:description" content="Research across agents, speech, and perception. ML · LLMs · Representation Learning.">
<meta property="og:url" content="https://underfitting-lu.github.io/"><meta property="og:image" content="https://underfitting-lu.github.io/assets/profile.jpg">
<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="styles.css">
<script src="main.js" defer></script>
<script type="application/ld+json">__SCHEMA__</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner">
  <a class="wordmark" href="#top" aria-label="Zijian Lu, back to top"><span class="wordmark-mark" aria-hidden="true">z.</span> Zijian Lu</a>
  <nav aria-label="Main navigation"><a href="#research">Research</a><a href="#publications">Publications</a><a href="#building">Building</a><a href="#about">About</a><a href="assets/Zijian_Lu_CV.pdf" target="_blank" rel="noopener">CV ↗</a><button class="theme-button js-only" id="theme-toggle" aria-label="Switch to dark theme">◐</button></nav>
</div></header>
<main id="main" class="wrap">
<section class="hero" id="top" aria-labelledby="hero-title">
  <div>
    <div class="eyebrow">Undergraduate researcher · NJUPT</div>
    <h1 id="hero-title">Zijian Lu</h1><div class="chinese-name" lang="zh-CN">陆梓健</div>
    <p class="hero-topics"><span>Agent</span><span>Speech</span><span>Perception</span></p>
    <p class="hero-bio">I study intelligent systems that can <strong>act, listen, and perceive</strong>—and the learned representations that connect them. I am a Communication Engineering undergraduate at <strong>Nanjing University of Posts and Telecommunications</strong>, and a co-founder and algorithm lead at <strong>Shouyi Technology</strong>.</p>
    <div class="hero-links"><a class="text-link" href="https://scholar.google.com/citations?user=92y6JNMAAAAJ&amp;hl=en" target="_blank" rel="noopener noreferrer">Google Scholar <span class="external" aria-hidden="true">↗</span></a><a class="text-link" href="https://github.com/underfitting-lu" target="_blank" rel="noopener noreferrer">GitHub <span class="external" aria-hidden="true">↗</span></a><a class="text-link" href="assets/Zijian_Lu_CV.pdf" target="_blank" rel="noopener">CV <span class="external" aria-hidden="true">↓</span></a><a class="text-link" href="mailto:b24011519@njupt.edu.cn">Email <span class="external" aria-hidden="true">↗</span></a></div>
  </div>
  <div class="portrait-block"><img class="portrait" src="assets/profile.jpg" alt="Portrait of Zijian Lu" width="600" height="750" fetchpriority="high"><div class="portrait-caption"><span>陆梓健 / ZIJIAN LU</span><span>NANJING, CN</span></div></div>
</section>
<div class="foundation"><span class="foundation-label">The foundation</span><div class="foundation-values"><span>Machine Learning</span><span>Large Language Models</span><span>Representation Learning</span></div></div>

<section class="section" id="research" aria-labelledby="research-title">
  <div class="section-heading"><div><div class="section-kicker">01 / Research</div><h2 id="research-title">Three lenses. Shared foundations.</h2></div><p class="section-description">From representations to reasoning, and from observations to real-world systems.</p></div>
  <div class="research-grid">
    <div class="lens-tabs" role="tablist" aria-label="Research directions">
      <button class="lens-tab" id="tab-agent" data-lens="agent" role="tab" aria-selected="true" aria-controls="lens-panel"><span class="lens-number">01</span><span class="lens-label">Agent</span><span class="lens-arrow" aria-hidden="true">↗</span></button>
      <button class="lens-tab" id="tab-speech" data-lens="speech" role="tab" aria-selected="false" aria-controls="lens-panel" tabindex="-1"><span class="lens-number">02</span><span class="lens-label">Speech</span><span class="lens-arrow" aria-hidden="true">↗</span></button>
      <button class="lens-tab" id="tab-perception" data-lens="perception" role="tab" aria-selected="false" aria-controls="lens-panel" tabindex="-1"><span class="lens-number">03</span><span class="lens-label">Perception</span><span class="lens-arrow" aria-hidden="true">↗</span></button>
    </div>
    <div class="lens-panel" id="lens-panel" role="tabpanel" aria-labelledby="tab-agent" tabindex="0"><span class="eyebrow">Research lens <span id="lens-number">01</span></span><span class="lens-watermark" id="lens-watermark" aria-hidden="true">01</span><h3 id="lens-title">From a plausible plan to a dependable action.</h3><p id="lens-description">I study how agents acquire reusable skills, allocate context, verify evidence, and recover from failure. The goal is to make long-horizon behavior more explicit, repairable, and grounded.</p><a class="lens-paper-link" id="lens-link" href="#publications" data-filter="agent">Explore agent research ↗</a></div>
  </div>
</section>

<section class="section" id="publications" aria-labelledby="publications-title">
  <div class="section-heading"><div><div class="section-kicker">02 / Publications &amp; preprints</div><h2 id="publications-title">Papers, with the details.</h2></div><a class="text-link section-description" href="publications.bib" download>Download bibliography ↓</a></div>
  <div class="paper-tools"><div class="filter-tabs" role="group" aria-label="Filter publications by topic"><button class="filter-button" data-filter="all" aria-pressed="true">All works <span aria-hidden="true">9</span></button><button class="filter-button" data-filter="agent" aria-pressed="false">Agent</button><button class="filter-button" data-filter="speech" aria-pressed="false">Speech</button><button class="filter-button" data-filter="perception" aria-pressed="false">Perception</button></div><label class="paper-search"><span aria-hidden="true">⌕</span><span class="sr-only">Search papers by title, author, venue, or topic</span><input id="paper-search" type="search" placeholder="Search papers…" autocomplete="off"><kbd aria-hidden="true">/</kbd></label></div>
  <p class="paper-count" id="paper-count" role="status" aria-live="polite">9 of 9 works</p>
  <div id="publication-list">__PAPERS__</div>
  <div class="empty-state" id="empty-state" hidden>No papers match this search. <button class="cite-button" id="reset-search">Reset filters</button></div>
</section>

<section class="section" id="building" aria-labelledby="building-title">
  <div class="section-heading"><div><div class="section-kicker">03 / From research to practice</div><h2 id="building-title">Building beyond the paper.</h2></div><p class="section-description">Systems become more interesting when people actually use them.</p></div>
  <div class="venture"><img class="venture-image" src="assets/forget-me-not.jpg" alt="The Forget-Me-Not project demonstrated at a public technology exhibition" width="1000" height="750" loading="lazy"><div><div class="venture-role">Co-founder &amp; Algorithm Lead · Shouyi Technology</div><h3>Forget-Me-Not <span lang="zh-CN">勿忘我</span></h3><p>A voice-based cognitive screening project for older adults. We connect familiar telephone conversations with speech and language modeling, conversational agents, and cognitive-risk reporting.</p><p>I work on the algorithms and the path from research prototypes to community and hospital pilots—where dialects, noise, data quality, and uncertainty become very real.</p><div class="project-coverage">Project coverage · People's Daily Overseas Edition<a href="https://paper.people.com.cn/rmrbhwb/pad/content/202608/03/content_30172676.html" target="_blank" rel="noopener noreferrer" lang="zh-CN">让“手搓”不“受挫” <span aria-hidden="true">↗</span></a></div></div></div>
</section>

<section class="section" id="open-source" aria-labelledby="open-source-title">
  <div class="section-heading"><div><div class="section-kicker">04 / Open source</div><h2 id="open-source-title">Tools I put into the world.</h2></div><a class="text-link section-description" href="https://github.com/underfitting-lu" target="_blank" rel="noopener noreferrer">All repositories ↗</a></div>
  <div class="open-source-grid"><article class="open-project"><span class="repo-label">AGENT / RESEARCH ARTIFACT</span><h3>ContractSkill</h3><p>A minimal code release for repairable, contract-based multimodal web-agent skills.</p><a href="https://github.com/underfitting-lu/contractskill" target="_blank" rel="noopener noreferrer">Explore repository ↗</a></article><article class="open-project"><span class="repo-label">AGENT / RESEARCH WORKFLOW</span><h3>ResearchOS</h3><p>An attention-aware autonomous research agent for campus research scenarios.</p><a href="https://github.com/underfitting-lu/researchos-campus-agent" target="_blank" rel="noopener noreferrer">Explore repository ↗</a></article><article class="open-project"><span class="repo-label">MULTIMODAL / EVIDENCE</span><h3>Maintenance Assistant</h3><p>A multimodal RAG and EvidenceLock maintenance assistant for the LoongArch Kylin platform.</p><a href="https://github.com/underfitting-lu/multimodal-maintenance-assistant" target="_blank" rel="noopener noreferrer">Explore repository ↗</a></article></div>
</section>

<section class="section" id="field-notes" aria-labelledby="field-title">
  <div class="section-heading"><div><div class="section-kicker">05 / Out of the lab</div><h2 id="field-title">Conversations in the real world.</h2></div><p class="section-description">Presenting ideas, meeting collaborators, and learning from the room.</p></div>
  <div class="field-grid"><figure><img src="assets/cscwd.jpg" alt="Zijian Lu presenting research at IEEE CSCWD 2026" loading="lazy" width="1000" height="625"><figcaption><strong>Sharing the work</strong><span>IEEE CSCWD · 2026</span></figcaption></figure><figure><img src="assets/ubicomp.jpg" alt="Conference photograph at UbiComp and ISWC 2026" loading="lazy" width="1000" height="625"><figcaption><strong>Ideas meet the community</strong><span>UbiComp / ISWC · 2026</span></figcaption></figure></div>
</section>

<section class="section" id="about" aria-labelledby="about-title">
  <div class="section-heading"><div><div class="section-kicker">06 / A little background</div><h2 id="about-title">Learning, building, repeating.</h2></div></div>
  <div class="about-grid"><div class="education-item"><span class="date">2024 — PRESENT · EXPECTED 2028</span><h3>Nanjing University of Posts and Telecommunications</h3><p>B.Eng. candidate, Communication Engineering<br>School of Communication and Information Engineering</p></div><ul class="awards" aria-label="Selected honors"><li><span class="award-year">2026</span><span><strong>Gold Award</strong><br>Alibaba Cloud hackathon</span></li><li><span class="award-year">2026</span><span><strong>National Third Prize</strong><br>China Software Cup</span></li><li><span class="award-year">2026</span><span><strong>National Third Prize · Maker Track</strong><br>China College Students Service Outsourcing Competition</span></li><li><span class="award-year">2026</span><span><strong>Bronze Award</strong><br>NJUPT Challenge Cup Entrepreneurship Competition</span></li><li><span class="award-year">2026</span><span><strong>Second-Class University Scholarship</strong><br>Nanjing University of Posts and Telecommunications</span></li></ul></div>
  <div class="scholar-strip"><div><a class="text-link" href="https://scholar.google.com/citations?user=92y6JNMAAAAJ&amp;hl=en" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a><p>Snapshot · 3 November 2026</p></div><div class="scholar-stats"><span class="scholar-stat"><b>21</b>citations</span><span class="scholar-stat"><b>2</b>h-index</span><span class="scholar-stat"><b>1</b>i10-index</span></div></div>
</section>

<section class="contact" id="contact" aria-labelledby="contact-title"><div class="contact-top"><div><div class="section-kicker">Say hello</div><h2 id="contact-title">A good conversation starts somewhere.</h2><p>Interested in agents, speech, perception, or the representations underneath? I would be glad to exchange ideas.</p></div><a class="email-link" href="mailto:b24011519@njupt.edu.cn">b24011519@njupt.edu.cn <span aria-hidden="true">↗</span></a></div></section>
</main>
<footer class="wrap"><div class="footer"><span>© 2026 Zijian Lu · Last updated November 2026</span><div class="footer-links"><a href="https://github.com/underfitting-lu/underfitting-lu.github.io" target="_blank" rel="noopener noreferrer">Source ↗</a><a href="#top">Back to top ↑</a></div></div></footer>
<dialog class="citation-dialog" id="citation-dialog" aria-labelledby="citation-title"><div class="dialog-heading"><h2 id="citation-title">Cite this work</h2><button class="dialog-close" id="close-citation" aria-label="Close citation dialog">×</button></div><pre id="citation-text" tabindex="0"></pre><button class="copy-button" id="copy-citation">Copy BibTeX</button><span class="copy-status" id="copy-status" role="status" aria-live="polite"></span></dialog>
__CITATIONS__
</body></html>
'''
page = page.replace('__SCHEMA__', json.dumps(schema, ensure_ascii=False)).replace('__PAPERS__', '\n'.join(papers)).replace('__CITATIONS__', '\n'.join(citations))
(ROOT / 'index.html').write_text(page, encoding='utf-8')
(ROOT / 'publications.bib').write_text('\n\n'.join(bibtex(p) for p in data['papers']) + '\n', encoding='utf-8')
print(f'Built {ROOT / "index.html"} with {len(papers)} works.')
