document.documentElement.classList.remove('no-js');
const themeButton=document.querySelector('#theme-toggle');
function applyTheme(theme){document.documentElement.dataset.theme=theme;themeButton.textContent=theme==='dark'?'☼':'◐';themeButton.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');}
try{const saved=localStorage.getItem('zijian-theme');applyTheme(saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));}catch{applyTheme('light');}
themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme(next);try{localStorage.setItem('zijian-theme',next);}catch{}});

const lenses={
  agent:{number:'01',title:'From a plausible plan to a dependable action.',description:'I study how agents acquire reusable skills, allocate context, verify evidence, and recover from failure. The goal is to make long-horizon behavior more explicit, repairable, and grounded.',paper:'Explore agent research',filter:'agent'},
  speech:{number:'02',title:'Listening for signals that travel across settings.',description:'I work with speech and language as representations of human state. Cognitive screening is one application: understanding which markers survive changes in language, task, and recording conditions.',paper:'Explore speech research',filter:'speech'},
  perception:{number:'03',title:'Keeping representations connected to observations.',description:'My work spans multimodal fusion, contactless sensing, and vision-language models. I am interested in what a model actually sees, how observations become representations, and when the evidence is sufficient to act.',paper:'Explore perception research',filter:'perception'}
};
const lensTabs=[...document.querySelectorAll('.lens-tab')];
function selectLens(tab,focus=false){const lens=lenses[tab.dataset.lens];lensTabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});document.querySelector('#lens-title').textContent=lens.title;document.querySelector('#lens-description').textContent=lens.description;document.querySelector('#lens-number').textContent=lens.number;document.querySelector('#lens-watermark').textContent=lens.number;const link=document.querySelector('#lens-link');link.textContent=lens.paper+' ↗';link.dataset.filter=lens.filter;document.querySelector('#lens-panel').setAttribute('aria-labelledby',tab.id);if(focus)tab.focus();}
lensTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectLens(tab));tab.addEventListener('keydown',e=>{let next;if(['ArrowRight','ArrowDown'].includes(e.key))next=(index+1)%lensTabs.length;if(['ArrowLeft','ArrowUp'].includes(e.key))next=(index+lensTabs.length-1)%lensTabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=lensTabs.length-1;if(next!==undefined){e.preventDefault();selectLens(lensTabs[next],true);}});});

let activeFilter='all';
const filterButtons=[...document.querySelectorAll('.filter-button')];
const papers=[...document.querySelectorAll('.publication')];
const search=document.querySelector('#paper-search');
function filterPapers(filter=activeFilter){activeFilter=filter;const query=search.value.trim().toLowerCase();let visible=0;papers.forEach(p=>{const matchTopic=filter==='all'||p.dataset.topics.split(' ').includes(filter);const matchQuery=!query||p.textContent.toLowerCase().includes(query);p.hidden=!(matchTopic&&matchQuery);if(!p.hidden)visible++;});filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));document.querySelector('#paper-count').textContent=`${visible} of ${papers.length} works`;document.querySelector('#empty-state').hidden=visible!==0;}
filterButtons.forEach(button=>button.addEventListener('click',()=>filterPapers(button.dataset.filter)));
search.addEventListener('input',()=>filterPapers());
document.querySelector('#lens-link').addEventListener('click',e=>filterPapers(e.currentTarget.dataset.filter));
document.querySelector('#reset-search').addEventListener('click',()=>{search.value='';filterPapers('all');search.focus();});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&!document.querySelector('#citation-dialog').open){e.preventDefault();document.querySelector('#publications').scrollIntoView();search.focus();}});

const dialog=document.querySelector('#citation-dialog');
const citationText=document.querySelector('#citation-text');
const copyStatus=document.querySelector('#copy-status');
document.querySelectorAll('.cite-button[data-cite]').forEach(button=>button.addEventListener('click',()=>{citationText.textContent=document.querySelector('#bib-'+button.dataset.cite).textContent.trim();copyStatus.textContent='';dialog.showModal();}));
document.querySelector('#close-citation').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#copy-citation').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(citationText.textContent);copyStatus.textContent='Copied.';}catch{const selection=getSelection(),range=document.createRange();range.selectNodeContents(citationText);selection.removeAllRanges();selection.addRange(range);copyStatus.textContent='Select the text, then press Ctrl/Cmd+C.';}});

if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('nav a[href^="#"]').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main section[id]').forEach(s=>observer.observe(s));}
