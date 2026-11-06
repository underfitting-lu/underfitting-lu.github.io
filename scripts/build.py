"""Generate the static homepage from content.json. Python standard library only."""
from pathlib import Path
from datetime import date
import html
import json

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'content.json').read_text(encoding='utf-8'))
esc = html.escape

def date_label(value):
    parts = value.split('-')
    if len(parts) == 1:
        return value
    parsed = date.fromisoformat(value + ('-01' if len(parts) == 2 else ''))
    return parsed.strftime('%b %Y') if len(parts) == 2 else f'{parsed.day} {parsed:%b %Y}'

def date_range(start, end=None):
    if not end or start == end:
        return date_label(start)
    first, last = date.fromisoformat(start), date.fromisoformat(end)
    if (first.year, first.month) == (last.year, last.month):
        return f'{first.day}–{last.day} {last:%b %Y}'
    return f'{date_label(start)} – {date_label(end)}'

def time_html(start, end=None):
    return f'<time datetime="{start}">{esc(date_range(start, end))}</time>'

def external_link(label, url, description=None):
    hint = f' title="{esc(description, quote=True)}"' if description else ''
    return f'<a href="{esc(url, quote=True)}" target="_blank" rel="noopener noreferrer"{hint}>{esc(label)} <span aria-hidden="true">↗</span></a>'

def readable_source(url, fallback):
    return fallback if url.startswith('https://api.crossref.org/') else url

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
    links = ''.join(external_link(label, url) for label, url in p['links'].items() if label != 'Paper')
    primary = next(iter(p['links'].values()))
    previous = f'<p class="previous-title">Earlier title: {esc(p["alternateTitle"])}</p>' if p.get('alternateTitle') else ''
    main_date = next((d for d in p['dates'] if d['label'] == 'Conference dates'), p['dates'][0])
    dates = ''.join(f'<span>{esc(d["label"])} · <a href="{esc(readable_source(d["source"], primary), quote=True)}" target="_blank" rel="noopener noreferrer">{time_html(d["start"], d.get("end"))}</a></span>' for d in p['dates'] if d != main_date)
    status = f'Accepted · {p["status"]}' if p.get('accepted') else p['status']
    issue = f'<p>{esc(p["bibliographicDetails"])}</p>' if p.get('bibliographicDetails') else ''
    venue = 'arXiv' if p['status'] == 'Preprint' else p['venue']
    badge = '' if p['status'] in ('Preprint', 'Journal', 'Conference') else f'<span class="status">{esc(status)}</span>'
    papers.append(f'''<article class="publication" id="paper-{p['id']}" data-topics="{' '.join(p['topics'])}">
      <div>
      <div class="pub-heading"><h3 class="pub-title"><a href="{esc(primary, quote=True)}" target="_blank" rel="noopener noreferrer">{esc(p['title'])} <span class="title-arrow" aria-hidden="true">↗</span></a></h3></div>
      <div class="pub-meta"><a class="venue" href="{esc(p['venueUrl'], quote=True)}" target="_blank" rel="noopener noreferrer">{esc(venue)}</a>{badge}<a href="{esc(readable_source(main_date['source'], primary), quote=True)}" target="_blank" rel="noopener noreferrer">{time_html(main_date['start'], main_date.get('end'))}</a></div>
      <p class="pub-authors">{authors}</p>
      <div class="pub-links">{links}<button class="cite-button js-only" data-cite="{p['id']}" aria-label="Cite {esc(p['short'], quote=True)}">Cite</button></div>
      <details class="paper-details"><summary>Details</summary><p class="pub-summary">{esc(p['summary'])}</p><div class="pub-dates">{dates}</div>{issue}{previous}</details></div>
      </article>''')
    citations.append(f'<script type="text/plain" id="bib-{p["id"]}">{bibtex(p)}</script>')

milestones = []
milestone_titles = {
    'SuperSenseDoctor at UbiComp / ISWC': 'SuperSenseDoctor · UbiComp / ISWC Student Challenge',
    'Featured in People’s Daily Overseas Edition': 'Forget-Me-Not featured in People’s Daily Overseas Edition',
    'First Prize · Xuhui OPC Special Competition': 'Our team won the Xuhui OPC Enterprise Group First Prize',
    'An interdisciplinary team, featured by Jianye': 'Jianye District featured our team',
    'Sharing secure UAV ISAC research at IEEE CSCWD': 'Secure UAV ISAC · IEEE CSCWD, Fuzhou',
    'Speech AI reaches a community health center': 'Community screening pilot at Haixiacheng Health Center',
    'Establishing Shouyi Technology in Nanjing': 'Shouyi Technology established in Nanjing',
    'Gold · ModelScope AI Hackathon Tour national final': 'Our team won public-interest track Gold at the ModelScope hackathon final',
}
for item in data['milestones']:
    source = item['links'].get('Track details') or item['links'].get('Conference') or next(iter(item['links'].values()))
    title = milestone_titles.get(item['title'], item['title'])
    milestones.append(f'''<li class="milestone"><div class="milestone-date">{time_html(item['start'], item.get('end'))}</div><h3>{external_link(title, source)}</h3></li>''')
timeline = '<ol class="milestone-list">' + ''.join(milestones[:3]) + '</ol>'
timeline += '<details class="earlier-milestones"><summary>More news</summary><ol class="milestone-list">' + ''.join(milestones[3:]) + '</ol></details>'
awards = []
for award in data['awards']:
    if award.get('source'):
        continue  # Team prizes already appear in the news timeline.
    event = external_link(award['event'], award['eventUrl'], award.get('linkDescription'))
    awards.append(f'<li><span class="award-year">{time_html(award["date"], award.get("end"))}</span><span><strong>{esc(award["title"])}</strong><br>{event}</span></li>')

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
  <nav aria-label="Main navigation"><a href="#news">News</a><a href="#research">Research</a><a href="#publications">Papers</a><a href="#building">Projects</a><a href="#about">About</a><button class="theme-button js-only" id="theme-toggle" aria-label="Switch to dark theme">◐</button></nav>
</div></header>
<main id="main" class="wrap">
<section class="hero" id="top" aria-labelledby="hero-title">
  <div>
    <h1 id="hero-title">Zijian Lu</h1><div class="chinese-name" lang="zh-CN">陆梓健</div>
    <p class="hero-topics"><span>Agent</span><span>Speech</span><span>Perception</span></p>
    <p class="hero-bio">Communication Engineering undergraduate at <strong><a class="inline-link" href="__ORG_UNIVERSITY__" target="_blank" rel="noopener noreferrer">NJUPT</a></strong>.<br>Co-founder &amp; Algorithm Lead, <strong><a class="inline-link" href="__ORG_COMPANY__" target="_blank" rel="noopener noreferrer">Shouyi Technology</a></strong>.</p><p class="hero-foundations">ML · LLMs · Representation Learning</p>
    <div class="hero-links"><a class="text-link" href="https://scholar.google.com/citations?user=92y6JNMAAAAJ&amp;hl=en" target="_blank" rel="noopener noreferrer">Google Scholar <span class="external" aria-hidden="true">↗</span></a><a class="text-link" href="https://github.com/underfitting-lu" target="_blank" rel="noopener noreferrer">GitHub <span class="external" aria-hidden="true">↗</span></a><a class="text-link" href="assets/Zijian_Lu_CV.pdf" target="_blank" rel="noopener">CV <span class="external" aria-hidden="true">↓</span></a><a class="text-link" href="mailto:b24011519@njupt.edu.cn">Email <span class="external" aria-hidden="true">↗</span></a></div>
  </div>
  <div class="portrait-block"><img class="portrait" src="assets/profile.jpg" alt="Portrait of Zijian Lu" width="600" height="750" fetchpriority="high"></div>
</section>

<section class="section news-section" id="news" aria-labelledby="news-title">
  <div class="section-heading"><h2 id="news-title">News</h2></div>
  __TIMELINE__
</section>

<section class="section" id="research" aria-labelledby="research-title">
  <div class="section-heading"><h2 id="research-title">Research</h2></div>
  <div class="research-grid">
    <div class="lens-tabs" role="tablist" aria-label="Research directions">
      <button class="lens-tab" id="tab-agent" data-lens="agent" role="tab" aria-selected="true" aria-controls="lens-panel"><span class="lens-label">Agent</span><span class="lens-arrow" aria-hidden="true">↗</span></button>
      <button class="lens-tab" id="tab-speech" data-lens="speech" role="tab" aria-selected="false" aria-controls="lens-panel" tabindex="-1"><span class="lens-label">Speech</span><span class="lens-arrow" aria-hidden="true">↗</span></button>
      <button class="lens-tab" id="tab-perception" data-lens="perception" role="tab" aria-selected="false" aria-controls="lens-panel" tabindex="-1"><span class="lens-label">Perception</span><span class="lens-arrow" aria-hidden="true">↗</span></button>
    </div>
    <div class="lens-panel" id="lens-panel" role="tabpanel" aria-labelledby="tab-agent" tabindex="0"><h3 id="lens-title">Reusable, verifiable agents.</h3><p id="lens-description">Reusable skills, context allocation, and evidence checks for reliable agent actions.</p><a class="lens-paper-link" id="lens-link" href="#publications" data-filter="agent">Related papers ↗</a></div>
  </div>
</section>

<section class="section" id="publications" aria-labelledby="publications-title">
  <div class="section-heading"><h2 id="publications-title">Papers</h2></div>
  <div class="paper-tools"><div class="filter-tabs" role="group" aria-label="Filter publications by topic"><button class="filter-button" data-filter="all" aria-pressed="true">All</button><button class="filter-button" data-filter="agent" aria-pressed="false">Agent</button><button class="filter-button" data-filter="speech" aria-pressed="false">Speech</button><button class="filter-button" data-filter="perception" aria-pressed="false">Perception</button></div><label class="paper-search"><span aria-hidden="true">⌕</span><span class="sr-only">Search papers by title, author, venue, or topic</span><input id="paper-search" type="search" placeholder="Search" autocomplete="off"><kbd aria-hidden="true">/</kbd></label></div>
  <p class="paper-count sr-only" id="paper-count" role="status" aria-live="polite">9 of 9 works</p>
  <div id="publication-list">__PAPERS__</div>
  <div class="empty-state" id="empty-state" hidden>No papers match this search. <button class="cite-button" id="reset-search">Reset filters</button></div>
</section>

<section class="section" id="building" aria-labelledby="building-title">
  <div class="section-heading"><h2 id="building-title">Projects</h2></div>
  <div class="venture"><img class="venture-image" src="assets/forget-me-not.jpg" alt="The Forget-Me-Not project demonstrated at a public technology exhibition" width="1000" height="750" loading="lazy"><div><div class="venture-role">Shouyi Technology · May 2026–present</div><h3><a href="__ORG_COMPANY__" target="_blank" rel="noopener noreferrer">Forget-Me-Not <span lang="zh-CN">勿忘我</span> <span class="title-arrow" aria-hidden="true">↗</span></a></h3><p>Speech-based cognitive screening for older adults, from telephone conversations to community pilots.</p></div></div>
</section>

<section class="section" id="open-source" aria-labelledby="open-source-title">
  <div class="section-heading"><h2 id="open-source-title">Open source</h2></div>
  <div class="open-source-grid"><article class="open-project"><h3><a href="https://github.com/underfitting-lu/contractskill" target="_blank" rel="noopener noreferrer">ContractSkill <span class="title-arrow" aria-hidden="true">↗</span></a></h3><p>Repairable skills for web agents.</p></article><article class="open-project"><h3><a href="https://github.com/underfitting-lu/researchos-campus-agent" target="_blank" rel="noopener noreferrer">ResearchOS <span class="title-arrow" aria-hidden="true">↗</span></a></h3><p>An autonomous research agent.</p></article><article class="open-project"><h3><a href="https://github.com/underfitting-lu/multimodal-maintenance-assistant" target="_blank" rel="noopener noreferrer">Maintenance Assistant <span class="title-arrow" aria-hidden="true">↗</span></a></h3><p>Multimodal RAG for maintenance on LoongArch Kylin.</p></article></div>
</section>

<section class="section" id="field-notes" aria-labelledby="field-title">
  <div class="section-heading"><h2 id="field-title">In the field</h2></div>
  <div class="field-grid"><figure><a href="https://fyust.edu.cn/gjhyqk/cscwd2026/" target="_blank" rel="noopener noreferrer"><img src="assets/cscwd.jpg" alt="Zijian Lu presenting research at IEEE CSCWD 2026" loading="lazy" width="1000" height="625"></a><figcaption><strong>IEEE CSCWD · Fuzhou</strong><span> <a href="https://fyust.edu.cn/gjhyqk/cscwd2026/" target="_blank" rel="noopener noreferrer">13–15 May 2026 ↗</a></span></figcaption></figure><figure><a href="https://ubicomp.org/ubicomp-iswc-2026/iswc-cfp/" target="_blank" rel="noopener noreferrer"><img src="assets/ubicomp.jpg" alt="Conference photograph at UbiComp and ISWC 2026" loading="lazy" width="1000" height="625"></a><figcaption><strong>UbiComp / ISWC · Shanghai</strong><span> <a href="https://ubicomp.org/ubicomp-iswc-2026/iswc-cfp/" target="_blank" rel="noopener noreferrer">11–15 Oct 2026 ↗</a></span></figcaption></figure></div>
</section>

<section class="section" id="about" aria-labelledby="about-title">
  <div class="section-heading"><h2 id="about-title">About</h2></div>
  <div class="about-grid"><div><div class="education-item"><span class="date">SEP 2024 — PRESENT · EXPECTED 2028</span><h3><a href="__ORG_UNIVERSITY__" target="_blank" rel="noopener noreferrer">Nanjing University of Posts and Telecommunications <span class="title-arrow" aria-hidden="true">↗</span></a></h3><p>B.Eng. candidate, Communication Engineering<br><a class="inline-link" href="__ORG_SCHOOL__" target="_blank" rel="noopener noreferrer">School of Communication and Information Engineering</a></p></div></div><ul class="awards" aria-label="Selected honors">__AWARDS__</ul></div>
</section>


</main>
<footer class="wrap"><div class="footer"><span>© 2026 Zijian Lu</span><div class="footer-links"><a href="https://github.com/underfitting-lu/underfitting-lu.github.io" target="_blank" rel="noopener noreferrer">Source ↗</a><a href="mailto:b24011519@njupt.edu.cn">b24011519@njupt.edu.cn</a></div></div></footer>
<dialog class="citation-dialog" id="citation-dialog" aria-labelledby="citation-title"><div class="dialog-heading"><h2 id="citation-title">Cite this work</h2><button class="dialog-close" id="close-citation" aria-label="Close citation dialog">×</button></div><pre id="citation-text" tabindex="0"></pre><button class="copy-button" id="copy-citation">Copy BibTeX</button><span class="copy-status" id="copy-status" role="status" aria-live="polite"></span></dialog>
__CITATIONS__
</body></html>
'''
page = page.replace('__SCHEMA__', json.dumps(schema, ensure_ascii=False)).replace('__PAPERS__', '\n'.join(papers)).replace('__CITATIONS__', '\n'.join(citations))
page = page.replace('__TIMELINE__', timeline).replace('__AWARDS__', ''.join(awards))
for name, url in data['organizations'].items():
    page = page.replace('__ORG_' + name.upper() + '__', esc(url, quote=True))
(ROOT / 'index.html').write_text(page, encoding='utf-8')
(ROOT / 'publications.bib').write_text('\n\n'.join(bibtex(p) for p in data['papers']) + '\n', encoding='utf-8')
(ROOT / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://underfitting-lu.github.io/</loc><lastmod>{data["updated"]}</lastmod></url></urlset>\n', encoding='utf-8')
print(f'Built {ROOT / "index.html"} with {len(papers)} works.')
