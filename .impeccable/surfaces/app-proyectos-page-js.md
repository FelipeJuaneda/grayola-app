---
version: 1
slug: "app-proyectos-page-js"
primary_target: "app/proyectos/page.js"
related_targets: ["app/login/page.js","app/register/page.js"]
---

Scope: the whole authenticated app (role dashboards, project list/board, project detail, create/edit, files) plus auth screens. Visitor mode: Operate.
Audience/job: recruiters and tech leads walking three roles in minutes; in-fiction, an agency's client, PM and designers tracking design requests.
Constraints: Spanish (voseo) UI, WCAG 2.2 AA both themes, particle background kept and improved, independent identity (no Grayola brand assets).

## Direction contract

THESIS: The studio as a Swiss poster: grid and type are the structure, each project's status is a signal colour. Refuses the neutral SaaS shell (sidebar + grey cards + one accent) and every card-in-card.
OWN-WORLD: Paper #F3F3EF / ink #121212 (dark: #0F0F0E / #EDEDE8), 12-column grid drawn as hairline rules, flat offset colour: cobalt (in progress), amber (in review), green (delivered), ink outline (pending). Archivo variable grotesk, flush-left ragged, numerals as display. Rules and whitespace instead of boxes; 2px radius max.
STORY: Each role opens on its own first screen and immediately knows what needs attention; status is readable by shape, colour and label; the PM routes work in one gesture.
FIRST VIEWPORT: Dashboard: role greeting as a small kicker; a row of four status counters set as large numerals on the grid (unreached stages drawn as unlit cells); below, the project index as a numbered table with status marker, client, designers, due date. Primary action ("Nuevo proyecto") top-right on the grid baseline. Login: split grid, particles field left with routing nodes, form right, one-click demo roles.
FORM: Swiss International Typographic Style grid, position 5 on the ordered list, seed key 64f88fed.
Raises: status encoded by shape as well as colour (from one-bit desktop); absence designed as unlit cells and empty states on the grid (seven-segment); every control labelled, no bare icon buttons (cassette deck); particles encode the client → PM → designer route (gravity rain); colour lives in rules and markers, text stays achromatic (iridescent edge).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
