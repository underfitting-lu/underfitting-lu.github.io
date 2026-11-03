# Zijian Lu — Academic Homepage

Personal academic website for **Zijian Lu (陆梓健)**.

**Research:** Agent · Speech · Perception  
**Foundations:** Machine Learning · LLMs · Representation Learning

Live site: https://underfitting-lu.github.io/

## Edit

- `content.json`: publication titles, authors, venues, statuses, links, and summaries.
- `scripts/build.py`: page content and the static HTML generator.
- `styles.css`: layout, colors, typography, responsive and print styles.
- `main.js`: topic filters, search, research tabs, theme, and BibTeX dialogs.
- `assets/`: selected public-facing photos and the CV PDF.

After editing content, run `python scripts/build.py`. Preview with
`python -m http.server 8765` and open http://localhost:8765/.

No build system, JavaScript framework, analytics, API key, or server is required.
GitHub Pages serves the files from the `main` branch at the repository root.

## Content sources

- Google Scholar profile `92y6JNMAAAAJ`, checked 3 November 2026: nine public
  works, 21 citations, h-index 2, and i10-index 1. These are dated snapshots.
- The latest public arXiv records take precedence over earlier Scholar titles:
  `2603.19790`, `2607.26913`, `2607.26937`, and `2608.08277`.
- Conference categories for ACM MM 2026 (Poster), NCMMSC 2026 (Oral), and
  UbiComp/ISWC 2026 Student Challenge were supplied by the website owner.
- SuperSenseDoctor uses the updated public title and eight-author list from
  the owner's Scholar record, linked to arXiv `2609.16257`.
- Education, entrepreneurship, honors, portraits, and conference photos were
  selected from the owner's supplied supporting materials.
- The People's Daily link is **project coverage**, not a claim of an individual
  profile or endorsement.
- Only public repositories are linked. Local research drafts and project
  runtime data are not part of this website repository.

The website design and implementation are original, using native HTML, CSS,
and JavaScript. Respect the authorship and licenses of linked research and
third-party material. Personal photographs and CV content belong to their owner.
