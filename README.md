# National Security Government Capital — VC landscape map

Internal market map for Rosc. Single-page static site, no backend, no
runtime API calls, no CDN dependencies. Opens from the filesystem or from
any static host.

## Layout

```
content/    the source markdown, kept inspectable so a v2 can be re-parsed
scripts/    parse.mjs, the build-time markdown to JSON parser
data/       generated. natsec.json for inspection, natsec.js for the page
assets/     styles.css and app.js
index.html  the shell
dist/       generated. natsec-capital-map.html, the single-file build
```

## Build

```
node scripts/parse.mjs     # markdown to data/
node scripts/bundle.mjs    # data + styles + script to dist/
```

`parse.mjs` regenerates `data/`. `bundle.mjs` inlines everything into one
self-contained page. Nothing else compiles. Open `index.html` directly, or
serve the directory.

The parser prints its counts. Current parse:

| Measure | Count |
| --- | --- |
| Top-level sections | 11 |
| Tables | 3 |
| Vehicle directory entries | 23 |
| Sector sub-tabs | 7 |
| Words | 6,909 |

v1.1 replaced the single "Army and Navy on-ramps" entry with five researched
entries (Army Applications Laboratory and xTech, NavalX and the Tech Bridge
network, ONR SBIR/STTR, SOFWERX, and Marine Corps Warfighting Laboratory),
and fleshed out Coordination and policy with real detail on all four
bodies. Both blocks were researched separately from the rest of the
document via live web search rather than pulled from the original content
package, so they carry a heavier `[UNVERIFIED]` load. Confirm current
award sizes, membership rosters, and program status against primary
sources before citing externally.

v1.2 cut the old "Overview" tab (it restated what the capital map already
shows) and promoted the capital map to tab 1, retitled Overview. Folded
Software, AI and autonomy, and Cyber into one sector tab, since their
capital shape is the same (contract-led). The vehicle directory and
Coordination and policy now render as collapsible cards, collapsed by
default, so the page isn't a long scroll until a reader opens one.

## Content rules the build follows

Source prose is rendered, never rewritten. Confidence markers
(`[UNVERIFIED]`, `[STALE]`, `[NOT CONFIRMED]`, `[PENDING LEGISLATION]`,
`[CUMULATIVE — REFRESH]`) are parsed into visible chips in place, so the
sentence around each one stays intact. Bracketed text that is not one of
those five markers (sourcing caveats, Rosc-internal handling notes) renders
as a plain italic aside, never as a confidence chip. Callout labels
(`> [!CALLOUT] LABEL`) are already explicit in the source; only their color
scheme is assigned here. No email address, phone number, or URL appears
that is not already in the source. The only two contact strings in the
build are `OSC.Loan.Application@osc.mil` and `eei@darpa.mil`.

The capital map matrix (section 1) and the sector pathway grid (section 4)
are built from a hand-authored vehicle-to-cell and vehicle-to-sector lookup
in `assets/app.js`, the same approach the companion ARI/DARPA/DIU build used
for its instrument-flow diagram: the lookup drives which chips render where,
while the source paragraphs and tables are rendered verbatim regardless.

## Print

`@media print` hides the tab bar, the sector sub-tab selector, and the
directory filters, expands every sector pane, turns each glossary tooltip
into an inline parenthetical, and forces a page break between top-level
sections. Every tab carries the running header and footer.

## Deployment

Set up for GitHub Pages with relative paths and a `.nojekyll` marker. There
is no password gate in this build. A client-side gate on GitHub Pages is
obfuscation, because the check runs in the visitor's browser and the
content ships with the page. This document names sitting officials and
describes an evolving equity program, so real access control means a
private repo with Pages on a paid plan, or Cloudflare Access, or Netlify
password protection. `.gitignore` covers `.env` and local credential files.
