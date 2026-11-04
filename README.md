# Zijian Lu — Academic Homepage

Personal academic website for **Zijian Lu (陆梓健)**.

**Research:** Agent · Speech · Perception  
**Foundations:** Machine Learning · LLMs · Representation Learning

Live site: https://underfitting-lu.github.io/

## Development

This is an adaptation of [Craftzdog's complete homepage project](https://github.com/craftzdog/craftzdog-homepage),
built with Next.js, Chakra UI, Framer Motion, and Three.js. The workbench and SVG
research illustrations are original. The original voxel dog is not used.
See LICENSE and THIRD_PARTY_NOTICES.md.

Use Node.js 24. Run `npm ci`, then `npm run dev`. For production,
run `npm run build` and `npm run preview` (http://127.0.0.1:3000).
GitHub Actions builds and deploys only the static `out/` directory to GitHub Pages.

## Edit

- `content.json`: publications, typed dates, upcoming conferences, sourced milestones,
  and selected honors.
- `pages/`: home, papers, works, and about pages.
- `components/`: navigation, layouts, and the original procedural 3D workbench.
- `lib/theme.js` and `styles/site.css`: appearance and responsive styles.
- `public/assets/`: selected public-facing photos and the CV PDF.
- `public/fonts/`: self-hosted heading font and its license.
- `public/publications.bib`: downloadable citations.

The homepage keeps short headings and summaries. Paper abstracts, additional dates,
and earlier titles are available under Details; the full timeline is on About. The data
file retains full records, including honors that already appear in the news.
Paper titles open arXiv, the publisher, or the selected GLOBECOM author PDFs.
The website lists eight papers. Prior Directions is the only standalone preprint;
other accepted or published papers may still link to their arXiv versions.
Project and organization names link to their public sites. Honor
event links identify the organizer or university; they are not individual award
certificates. No private repository or supporting document is published.

The earlier root-level HTML, CSS, JavaScript, assets, and Python generator remain
as a legacy source snapshot. They are not included in the deployed export.
No analytics, API key, or runtime server is required.

## Content sources

- Google Scholar profile `92y6JNMAAAAJ`, checked 3 November 2026: nine public
  works, 21 citations, h-index 2, and i10-index 1. These are dated snapshots.
- The latest public arXiv title for Prior Directions (`2607.26913`) takes
  precedence over its earlier Scholar title.
- Per the owner's 4 November 2026 update, VITAL-RAG, WirelessOpsAgent, and
  Geometric Risk Control are excluded from the website and its bibliography.
- The owner confirmed two GLOBECOM 2026 acceptances: SafePlanner and Worst-Case
  Secrecy Rate Maximization for Fluid Antenna-aided Near-Field ISAC System.
  Titles and author order were checked against the supplied final six-page PDFs,
  which are included as author copies. No oral/poster category or acceptance date
  is inferred. The November homepage news date is the website announcement month.
- Conference categories for ACM MM 2026 (Poster), NCMMSC 2026 (Oral), and
  UbiComp/ISWC 2026 Student Challenge were supplied by the website owner.
- The owner also confirmed CSCWD 2026 as Oral. Full conference names are shown
  on the papers page and in both bibliography formats; the homepage uses short names.
- CCF labels were checked on 4 November 2026 against the official CCF pages:
  [ACM MM — A](https://www.ccf.org.cn/c/2017-03-17/588341.shtml),
  [NCMMSC — C](https://www.ccf.org.cn/Chapters/TC/News_/2026-06-15/903672.shtml),
  [GLOBECOM — C](https://www.ccf.org.cn/Academic_Evaluation/CN/zgjsjxhtjgjxshy/cl/2017-03-13/586307.shtml),
  and [CSCWD — C; UbiComp/IMWUT — A](https://www.ccf.org.cn/Academic_Evaluation/HCIAndPC/).
  The UbiComp A label explicitly refers to the main conference, while
  SuperSenseDoctor remains identified as Student Challenge. No conference grade
  is assigned to the preprint or the journal entry.
- SuperSenseDoctor uses the updated public title and eight-author list from
  the owner's Scholar record, linked to arXiv `2609.16257`.
- Education, entrepreneurship, honors, portraits, and conference photos were
  selected from the owner's supplied supporting materials.
- The People's Daily link is **project coverage**, not a claim of an individual
  profile or endorsement.
- Dates checked 4 November 2026: arXiv dates are **v1 submission dates**;
  journal/proceedings dates come from IEEE-registered Crossref metadata.
  Conference ranges link to the official event sites and do not establish a
  personal presentation day. ACM MM and NCMMSC are accepted/upcoming as of this date.
- The ACM DOI supplied in the original materials did not return a Crossref
  record on the check date; ContractSkill therefore links to its verified arXiv
  page. IEEE DOI links were verified against publisher-registered metadata.
- Public milestone sources are linked beside each entry: Jianye District
  Government, USTC News, Shanghai International Talent Network, and People's
  Daily Overseas Edition. Press dates and event dates are kept separate.
- The March hackathon Gold and July Xuhui OPC Enterprise Group First Prize are
  **team/project awards**. The June Jianye feature explicitly names Zijian Lu
  as a team member; its headline and CEO biography refer to Liu Sizhe.
- China Software Cup (August), service outsourcing competition (July), NJUPT
  Challenge Cup (May), and the university scholarship (year only) are from the
  owner's supporting materials. No more precise dates are inferred.
- Current MICS membership and speech-track recruitment contact are supported
  by the group's own website. No role start date is claimed.
- Only public repositories are linked. Apart from the two selected GLOBECOM
  author copies, local research drafts and project runtime data are not included.

Respect the authorship and licenses of linked research and third-party material.
Personal photographs and CV content belong to their owner.
