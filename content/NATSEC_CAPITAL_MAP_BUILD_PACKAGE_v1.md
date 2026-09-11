# BUILD PACKAGE: National Security Government Capital — VC Landscape Map (v1)

**For:** Claude Code
**Requested by:** Rosc
**Reference builds:** the Rosc Maine map (`maine_map_content_v3.md` plus its build prompt) and the ARI/DARPA/DIU map. Reuse the design system and component library from those builds. Match the house style exactly.

This is a new document in the Rosc VC Landscape Map series. It maps the government capital available to an early-stage national security company: which office holds the money, what shape the money is, and where in a company's life each one bites.

The package has two parts. Part A is the build instruction set. Part B is the complete v1 source content, which is the source of truth.

---

# PART A — BUILD INSTRUCTIONS

## 0. THE THREE RULES THAT OVERRIDE EVERYTHING

**Rule 1. Do not change the content.** Part B is the source of truth and has been edited deliberately. Render it, do not improve it. Do not rewrite sentences, do not resolve figures the content marks as disputed, do not merge entries that overlap across sector tabs (overlap is deliberate and load-bearing). Where the content carries a confidence marker, that marker ships.

If you believe something is wrong, list it in your closing notes. Do not act on it.

**Rule 2. Do not invent contact information.** No emails, no phone numbers, no URLs beyond those already in Part B. Several entries deliberately read "contact not confirmed." Render that state. The only direct contact strings that may appear are the two published government intake addresses already in the content (`OSC.Loan.Application@osc.mil` and `eei@darpa.mil`). No others. No individual's direct line.

**Rule 3. Preserve every confidence marker.** The content carries inline tags in square brackets: `[UNVERIFIED]`, `[STALE]`, `[NOT CONFIRMED]`, `[PENDING LEGISLATION]`, `[CUMULATIVE — REFRESH]`. These are load-bearing. Parse them out and render them as visible chips attached to the claim they qualify. Never drop one, never upgrade a marked claim to unmarked. Unmarked claims are verified as of September 2026.

## 0A. NAMING CONVENTION (house rule, do not "fix")

Across the Rosc series, the department itself is written **Department of War / DoW**, not Department of Defense / DoD. The content already does this. Do not change it back.

Statutory and proper names keep their legal form even when they contain the word "Defense." Leave these exactly as written: Defense Innovation Unit, Defense Production Act, Defense Advanced Research Projects Agency, National Defense Authorization Act, National Defense Stockpile, Office of Strategic Capital, National Security Innovation Capital, Small Business Investment Company. Where a joint program reads "DoW-SBA," that is deliberate.

## 1. WHAT THIS DOCUMENT IS

An analysis of government capital for national security startups, written for internal use at a venture firm.

The organizing spine is a two-dimensional map, not a linear chain. One axis is company stage (pre-seed/seed, Series A/B, growth/scale). The other is the shape of the money (six instrument types). Every vehicle lands in one or more cells. The argument the interface must carry:

- At pre-seed and seed, the doors are non-dilutive capital and first-contract, not loans or equity.
- The large dollars (credit, strategic equity, fund-level facilities) sit at growth and scale. A seed company cannot reach them directly.
- The shape of the available capital differs sharply by sector. That is why the sector tabs exist.
- Inside the last year, the government started taking equity, not just lending. That shift gets its own section (section 7) and must not be buried.

Read section 1, section 2, and section 8 of Part B before building anything. The argument there determines what the interface emphasises.

**This document reads standalone.** It does not cross-reference the Maine, SOCOM, Space Force, or ARI maps. DIU, DARPA, and the OnRamp Hub program appear here because they are capital or commercialization doors, not because of the Maine bid. Do not add cross-references.

## 2. HOW THIS DIFFERS FROM THE MAINE AND ARI BUILDS

Reusing those components wholesale will produce the wrong document. Three differences.

**The signature visual is a matrix, not a chain.** The Maine build's formation chain runs left to right through seven stages. This document's spine is a grid: six instrument-type rows crossed with three stage columns (spec in 4.4). Build it fresh. Keep the Maine chip and callout system, replace the diagram.

**The sector tabs share one template.** The value of the sector view is that a reader sees the same six instrument rows every time and watches which vehicles light up or grey out per sector (spec in 4.5). Do not build nine bespoke layouts. Build one grid component and drive it from data.

**There is an allied layer with an eligibility caveat.** Two NATO vehicles appear. One is open to US companies, one cannot invest in US companies at all. That split is the whole point of including them, and it needs a visible eligibility chip (spec in 4.3), not a footnote.

## 3. HOW THE CONTENT FILE IS STRUCTURED

Same conventions as the Maine build. Parse against these.

| Marker | Means | Render as |
|---|---|---|
| `## N. Title` | Top-level section | Tab or major section |
| `### N.N Title` | Subsection | Card or sub-heading |
| `#### Title` | Sub-subsection | Inline heading inside a card |
| `> [!CALLOUT] LABEL` | Callout box, label on the first line | Callout component, scheme keyed off the label |
| `> text` | Continuation of the callout | Body of that callout |
| `**HEAT: HOT   OPENNESS: MED**` | Vehicle heat and openness rating | Two chips, side by side |
| `\| a \| b \|` | Table row | Data table |
| `[UNVERIFIED]` etc. | Inline confidence marker | Chip attached to the preceding claim |

Callout labels used in Part B: `VC READ`, `VC WHITE SPACE`, `THE DEFINING MECHANIC`, `HANDLE WITH CARE`, `HOW TO READ THIS ENTRY`, `WHY THIS SITS HERE`, `REVISION NOTE`, `ROSC INTERNAL`. Default any label you do not recognise to the neutral rust scheme rather than failing.

## 4. TECHNICAL SPECIFICATION

### 4.1 Stack
Same as Maine. Single-page static site, React with Vite or plain HTML/CSS/JS. No backend, no runtime API calls, no CDN dependencies if avoidable. Deploys to GitHub Pages, relative base path. Must print to PDF legibly with a `@media print` stylesheet that hides controls, expands accordions, forces page breaks between top-level sections.

### 4.2 Data layer
Parse Part B into structured JSON at build time with a standalone parser script emitting a `data/` directory. Keep the raw markdown in the repo. That way a v2 re-parses without touching components.

### 4.3 Design system
Reuse the Maine house style verbatim. Navy and rust palette. Sans for titles and prose. Monospace is load-bearing, used for badges, chips, numeric values, check sizes, statutory citations, locations, and contact strings, never for body prose. Dark navy header block with a thick rust left border, white bold title, pale blue mid-dot subtitle, top-right `ROSC INTERNAL` badge in letter-spaced rust monospace.

**Callout schemes**, keyed off the label:

| Label pattern | Scheme | Colors |
|---|---|---|
| `VC WHITE SPACE`, `VC READ` | green | pale green fill, green left border, green label |
| `THE DEFINING MECHANIC` | green highlight | the "start here" treatment |
| `HANDLE WITH CARE` | red | pale red fill, red left border, red label |
| `HOW TO READ THIS ENTRY`, `WHY THIS SITS HERE` | amber | pale amber fill, amber left border |
| `ROSC INTERNAL`, `REVISION NOTE` | grey / navy | structural |
| everything else | rust | cream fill, rust left border |

**Chips.** All monospace, uppercase, small, rounded.

| Chip family | Values | Colors |
|---|---|---|
| Vehicle heat | `HOT` / `OPEN` / `WATCH` | red-pink / green / grey |
| Openness | `HIGH` / `MED` / `LOW` | green / amber / pink-red |
| Instrument type | `NON-DILUTIVE` / `CONTRACT` / `MATCHING` / `EQUITY` / `FUND-LEVEL` / `CREDIT` | monospace grey, sits beside the vehicle name |
| Controlling body | `DOW` / `IC` / `ENERGY` / `TRADE` / `ALLIED` / `CIVIL` | small navy tag |
| US eligibility | `US-ELIGIBLE` / `US-INELIGIBLE` | dark green / **dark red** |
| Confidence | `VERIFIED` / `UNVERIFIED` / `STALE` / `NOT CONFIRMED` / `PENDING` | none / amber / grey / grey empty state / amber |

`US-INELIGIBLE` gets a strong red. It marks the NATO Innovation Fund, which cannot invest in US-based companies. A reader must not skim past it and assume the money is reachable.

**Tables.** Dark navy header row, alternating row fills, thin grey internal borders.

**Running header and footer on every section:** the document title, `Rosc`, the date `September 2026`, and `INTERNAL`; footer `For internal Rosc use only · Figures current to September 2026, re-verify before any outreach`.

**Prose rule for anything you author** (empty states, tooltips, labels): no em dashes, no semicolons, no emojis, short, and never a negative-parallelism construction of any kind.

### 4.4 The capital map matrix (signature visual)

Section 2 of Part B gives you the grid. Render it as the default view.

Rows, top to bottom, are the six instrument types in this order: non-dilutive capital, first contract / OTA, matching capital, strategic equity, fund-level, scale credit.

Columns, left to right, are three stages: pre-seed / seed, Series A / B, growth / scale.

Each cell holds the vehicles that belong there as small chips (vehicle name plus its body tag). A vehicle can appear in more than one cell. Empty cells render as an explicit light-grey gap, never blank, so the reader sees where no government money exists.

Two regions get visual weight. The top-left block, pre-seed/seed crossed with non-dilutive and first-contract, is the **priority zone**, highlighted in green. That is where a seed company's real doors are. The bottom-right block, growth/scale crossed with credit, equity, and fund-level, is the **scale stack**, shaded navy. That is where the large dollars sit and where a seed company cannot go directly. The visual contrast between those two blocks is the one thing a reader should remember.

### 4.5 The sector pathway grid (signature visual)

Section 5 of Part B gives you nine sector sub-tabs. Build one grid component, reused for every sector.

The grid has the same six instrument-type rows as the matrix. For a given sector, each vehicle that serves that sector renders lit (navy fill, rust accent); vehicles that exist elsewhere in the document but do not serve this sector render greyed at low opacity, so the reader sees the shape difference. Each sector tab carries a one-line "shape" statement from the content, rendered as an inset monospace label.

Worked example the reader should be able to see at a glance: NSIC renders lit on Hardware, Space, and Marine, and greyed on Software, because it funds hardware only. DIU renders lit on almost every tab because the Commercial Solutions Opening is the universal front door. In-Q-Tel renders lit on Software, AI, Space, Cyber, and Biotech.

Default the sector view to Hardware, which has the fullest set of lit rows.

### 4.6 Tabs

Build navigation from the body headings. Twelve sections:

1. Overview
2. The capital map (default, the matrix)
3. Instrument types
4. Vehicle directory
5. Sector pathways ★
6. Coordination and policy
7. ■ The equity shift
8. Rosc read
9. ■ Constraints and gaps
10. Key names
11. Glossary
12. Sources

Carry two markers: a `★` on Sector pathways, where the white-space analysis lives, and a red `■` on The equity shift and on Constraints and gaps, where the load-bearing developments and the bad news live.

On the Vehicle directory tab, add filters for controlling body (`DOW` / `IC` / `ENERGY` / `TRADE` / `ALLIED` / `CIVIL`), heat, and openness. On the Sector pathways tab, the sub-tab selector switches sectors and re-drives the one grid component.

### 4.7 Deployment and access control
Same as Maine. Client-side password gates on GitHub Pages are obfuscation, not access control, because the check runs in the visitor's browser, and this document names individuals and carries an unverified register. Raise real gating with the user (private repo with Pages on a paid plan, or Cloudflare Access, or Netlify password protection). Add `.env` and local credential files to `.gitignore` before the first commit. Never commit a password.

## 5. BUILD SEQUENCE

1. Write the parser. Clean structured extraction of all 12 sections, every callout, every table, and every vehicle entry with its chips, before any UI. Validate counts against the inventory in section 6.
2. Implement the chip and confidence rendering system. Everything depends on it.
3. Build the section shell and tab navigation with all sections stubbed.
4. Build the callout, chip, and table components.
5. Build the vehicle directory cards, then the sector pathway grid component.
6. Build the capital map matrix, then wire the priority-zone and scale-stack shading.
7. Build the print stylesheet and verify a full PDF export.

## 6. ACCEPTANCE CHECKS

- Parser output matches the inventory: 12 sections, 6 instrument types, roughly two dozen vehicle entries, 9 sector sub-tabs.
- No prose from Part B altered, shortened, or reworded anywhere.
- Every `[UNVERIFIED]`, `[STALE]`, `[NOT CONFIRMED]`, `[PENDING LEGISLATION]`, and `[CUMULATIVE — REFRESH]` marker renders as a visible chip.
- No email, phone, or URL appears that is not in Part B. Only the two published intake addresses render.
- The matrix shows a green priority zone (seed × non-dilutive/contract) and a navy scale stack (growth × credit/equity/fund-level), with empty cells rendered as explicit gaps.
- `US-INELIGIBLE` renders in strong red on the NATO Innovation Fund entry, on the same screen as the NATO DIANA entry that is `US-ELIGIBLE`.
- The sector grid greys NSIC on Software and lights it on Hardware, Space, and Marine.
- Monospace used for chips, values, check sizes, and contacts, not for body prose.
- Full PDF export is legible and paginates sensibly.
- No em dashes or semicolons in any UI text you authored.

## 7. CLOSING NOTES TO PRODUCE

At the end of your run, report:

- Any content you believe is inconsistent or wrong, which you did not change.
- Any callout label you could not classify.
- Any vehicle you could not place cleanly in the matrix.
- The distribution question: this document names sitting officials and describes an evolving equity program. Confirm with the user before any sharing beyond the firm.

---

# PART B — SOURCE CONTENT (v1)

> [!CALLOUT] ROSC INTERNAL
> National Security Government Capital
> VC Landscape Map
> September 2026

## Contents

| 1. Overview | |
| --- | --- |
| How to read this document | |
| 2. The capital map | |
| 3. The six shapes of money | |
| 4. Vehicle directory | |
| 4.1 Department of War | |
| 4.2 Intelligence Community | |
| 4.3 Energy | |
| 4.4 Trade and development finance | |
| 4.5 Allied and multinational | |
| 4.6 Civil agencies | |
| 5. Sector pathways | |
| 6. Coordination and policy | |
| 7. The equity shift | |
| 8. Rosc read | |
| 9. Constraints and gaps | |
| 10. Key names | |
| 11. Glossary | |
| 12. Sources | |

## 1. Overview

This document maps the government capital a national security startup can reach, from a lab-stage idea to a company at scale. It answers three questions for any founder or investor. Which office holds the money. What shape the money is. And where in a company's life that money bites.

The federal picture is not one thing. Some offices write loans. Some hand out matching grants. Some buy prototypes and call it investment. And inside the last year, some began buying equity. The map sorts them so a reader can see, at a glance, which doors open at seed and which only open at scale.

The demand context is real. Venture investment into US defense tech reached more than $14.6 billion in 2026, up from $9.6 billion in 2025. The government is trying to pull more private capital in behind it, and the vehicles below are the tools it uses.

#### How to read this document

Start at section 2, the capital map. The grid crosses company stage against the shape of the money. The green block at the top left is where a seed company's real doors are. The navy block at the bottom right is where the large dollars sit, and a seed company cannot reach them directly.

Section 4 is the directory: one entry per vehicle, with a heat chip for how much money is moving now and an openness chip for how reachable it is by an early company.

Section 5 is the sector view. Each tab shows the same six instrument rows and lights up the vehicles that serve that sector. Overlap between tabs is deliberate. A hardware company and a space company share several doors, and the map shows that rather than hiding it.

Every fact carries its confidence state. Unmarked means verified as of September 2026. A marked claim carries a chip. Gaps are shown as gaps, never filled with a plausible guess.

## 2. The capital map

Six instrument types down the side. Three company stages across the top. Each vehicle lands where it first bites. The full profile of each vehicle is in section 4.

| Instrument type | Pre-seed / seed | Series A / B | Growth / scale |
| --- | --- | --- | --- |
| Non-dilutive capital | NSIC, Space Ventures, NSF Seed Fund, NASA SBIR, DHS SVIP, NATO DIANA | NSIC | (gap) |
| First contract / OTA | DIU CSO, DARPA BTO, service SBIR/STTR | DIU CSO, Replicator/PRIME | DPA Title III awards |
| Matching capital | AFVentures TACFI | AFVentures STRATFI | (gap) |
| Strategic equity | In-Q-Tel | In-Q-Tel | OSC equity [PENDING LEGISLATION], direct DoW stakes |
| Fund-level | (gap) | SBIC-CT | SBIC-CT |
| Scale credit | (gap) | (gap) | OSC credit, DoE EDF, EXIM, DFC, Commerce CHIPS, EDU |

> [!CALLOUT] THE DEFINING MECHANIC
> The top-left corner and the bottom-right corner are two different worlds.
> A pre-seed company's reachable government money is non-dilutive and contract-shaped, in the low millions. NSIC writes $500K to $3M. DIU awards a prototype contract. NATO DIANA runs a non-dilutive challenge. These are the seed doors.
> The bottom-right corner is loans and equity in the tens and hundreds of millions. OSC lends from a $10M floor. DoE and EXIM write nine and ten-figure project credit. Direct equity stakes run to $400M. A seed company reaches none of it without first becoming a scale company, and the only bridge across that gap is a fund the government backs, which is what SBIC-CT is.

## 3. The six shapes of money

Non-dilutive capital. A grant or award that the company keeps without giving up equity or taking on debt. NSIC, the service venture arms, NSF and NASA seed funds, and NATO DIANA. The cleanest money at seed.

First contract / OTA. A prototype or production contract, usually through Other Transaction Authority under 10 U.S.C. 4022. Not investment. The value is first government revenue and a proof point that de-risks a private round. DIU's Commercial Solutions Opening is the model.

Matching capital. A government award that requires the company to bring private or other government dollars alongside it. AFVentures STRATFI and TACFI. The structure pulls a venture firm's own check in next to the government's.

Strategic equity. The government or an affiliated nonprofit takes an ownership stake. In-Q-Tel has done this for the Intelligence Community for years. The Department of War started doing it directly in 2025, and a statutory equity authority for OSC is pending. Section 7 covers this.

Fund-level. The government backs a fund rather than a company. SBIC-CT lets a licensed private fund borrow against its private capital, then deploy at normal venture check sizes. This is the vehicle a venture firm interacts with as a manager.

Scale credit. Large loans and loan guarantees for facilities, equipment, and production. OSC, DoE Energy Dominance Financing, EXIM, DFC, and Commerce CHIPS. Ten-figure programs, project-shaped, late-stage.

## 4. Vehicle directory

### 4.1 Department of War

#### Office of Strategic Capital (OSC)

`DOW`   ·   `CREDIT` `EQUITY`   ·   Washington, D.C.

**HEAT: HOT   OPENNESS: LOW**

The Department of War's finance office, created December 2022 and codified in Section 903 of the FY2024 National Defense Authorization Act. Unlike a procurement office, OSC uses loans and loan guarantees rather than grants and contracts, and it may finance venture and private-equity funds as well as companies. Its authority covers 31 covered technology categories [one CRS product cites 34 for the pilot program; not reconciled].

Its first and so far only direct product is the equipment finance loan. Loan size $10M to $150M, for building, expanding, or modernizing US facilities and equipment tied to a covered category. The initial pool was $984M and drew more than 200 applications requesting $8.9 billion. Terms can include Treasury-rate pricing, long tenors, and deferred payment, and can stack with private equity, corporate debt, and grants.

The pilot authority expires 1 October 2028. The FY2027 budget request for the program jumped above $20 billion. The director chairs the National Security Capital Forum.

Contact for the credit program intake: `OSC.Loan.Application@osc.mil`

> [!CALLOUT] HOW TO READ THIS ENTRY
> OSC does not do small. The floor is $10M and the deals are industrial. The rare-earth miner MP Materials took a $150M OSC loan alongside a separate equity stake. The drone maker Performance Drone Works drew a conditional loan commitment of up to $820M in July 2026.
> For a seed company, OSC is a graduation destination, reached years out or reached one hop removed through a fund it backs. That fund pathway is SBIC-CT below.

#### SBIC Critical Technology Initiative (SBIC-CT)

`DOW`   ·   `FUND-LEVEL`   ·   joint DoW-SBA

**HEAT: OPEN   OPENNESS: LOW**

A joint Department of War and Small Business Administration program that licenses private funds and lets them borrow up to $175M per fund against the private capital they raise. The fund then invests at ordinary venture check sizes. This is the OSC-family vehicle a venture firm touches as a manager rather than as a portfolio company, and it is the only bridge from the seed doors to the OSC scale stack.

#### National Security Innovation Capital (NSIC)

`DOW`   ·   `NON-DILUTIVE`   ·   under DIU   ·   Mountain View, CA

**HEAT: HOT   OPENNESS: HIGH**

The anchor seed door for hardware. Housed within DIU, authorized in the FY2019 National Defense Authorization Act, NSIC funds dual-use hardware startups that private capital underserves. Awards $500K to $3M over 12 to 18 months, open to companies at TRL 3 or higher, structured as Other Transaction agreements. Founders submit a pitch deck at any time, with no fixed solicitation window. It exists because less than 30% of US venture goes to hardware and less than 10% of that lands at early stages. NSIC money also blocks untrusted foreign capital from the cap table. Hardware only. Software may be part of the product but not the primary work. Director Tex Schenkkan [STALE, confirm current].

#### Defense Innovation Unit (DIU)

`DOW`   ·   `CONTRACT`   ·   Mountain View, CA

**HEAT: HOT   OPENNESS: HIGH**

The Pentagon's commercial-technology bridge and the universal front door. DIU is a scout and contracting shop more than an investor. It runs six portfolios (AI/ML, autonomy, cyber, human systems, energy, space) and awards prototype contracts through the Commercial Solutions Opening under Other Transaction Authority (10 U.S.C. 4022). Director Owen West, appointed January 2026. DIU and its components reported more than $983M in FY2024 funding, a 431% increase on the prior year.

Two DIU threads matter beyond the general CSO. The Replicator initiative and the maritime PRIME CSO push unmanned systems to scale. And the OnRamp Hub program places regional intake nodes around the country. New OnRamp Hubs are sub-awardees under a single cooperative agreement held by the Applied Research Institute, not contracts with DIU directly. [Rosc has a live bid in this program; see section 8, kept out of the neutral entry deliberately.]

#### AFWERX / AFVentures

`DOW`   ·   `MATCHING`   ·   Department of the Air Force

**HEAT: OPEN   OPENNESS: MED**

AFWERX is the Air Force innovation arm, with four arms of its own (AFVentures, Spark, Prime, SpaceWERX). It has awarded roughly 10,400 SBIR/STTR contracts worth more than $7.24 billion. The venture-relevant tools are the matching bridges run by AFVentures:

- STRATFI (Strategic Funding Increase): $3M to $15M, bites at seed to Series A.
- TACFI (Tactical Funding Increase): $375K to $2M, the smaller and earlier bridge.

Both require matching funds from government or private investors, which is how they pull a venture firm's check in alongside Air Force money. Both gate off a prior Phase II award, so there is an SBIR dependency even though this map deprioritises SBIR itself.

#### SpaceWERX / Space Ventures

`DOW`   ·   `NON-DILUTIVE` `MATCHING`   ·   Space Force

**HEAT: OPEN   OPENNESS: MED**

The Space Force branch of AFWERX. Space Ventures puts the Space Force in an early-stage investor seat, offering non-dilutive capital to speed commercialization, with Orbital Prime as a named program and STRATFI/TACFI available for space rounds. The space cousin of the hardware seed doors.

#### Defense Production Act Title III

`DOW`   ·   `CONTRACT` `NON-DILUTIVE`   ·   DPA Investments Office

**HEAT: HOT   OPENNESS: MED**

Real industrial-base dollars, run by the Defense Production Act Investments Office under the Assistant Secretary of Defense for Industrial Base Policy. Title III money scales domestic production of critical materials, biomanufactured inputs, and other supply-chain capacity. It reaches companies as awards rather than equity or loans, and it interfaces closely with OSC and DoE on the large deals. The Department's biomanufacturing push runs partly through Title III (see section 5.7).

#### DARPA Commercial Strategy Office and Venture Horizons

`DOW`   ·   `CONTRACT`   ·   Arlington, VA

**HEAT: OPEN   OPENNESS: MED**

DARPA funds R&D through grants and contracts, not investment, and is often mistaken for an investor. The part that concerns a venture firm is the Commercial Strategy Office, launched 2019, whose stated aims are to reduce adversarial investment in DARPA performers, build companies more likely to attract US capital, and move private investment into defense capabilities.

Its published scorecard, cumulative since 2018 [CUMULATIVE — REFRESH]: roughly $1.24 billion in private investment raised by performers, $639.4M in M&A value, $662M in state funds, $384.7M in other government awards, roughly $2.9 billion combined, across 146 private funding rounds. The office reports only publicly available data.

Four initiatives run under it. Venture Horizons is the one for a venture firm: it connects DARPA program managers and performers with a selected group of investors, and names family offices, angels, venture firms, corporate venture arms, and private equity as participant types. The other three are the Embedded Entrepreneur Initiative, five regional Commercial Accelerators launched 2024 (Capital Factory in Austin, CIMIT in Boston, FedTech in Arlington, SRI International in Menlo Park, and the Wireless Research Center of North Carolina in Wake Forest), and Tiger Teams. Chief of Commercial Strategy is Sha-Chelle Devlin Manning. Expressions of interest go to `eei@darpa.mil`. DARPA director Stephen Winchell.

#### Economic Defense Unit (EDU)

`DOW`   ·   `EQUITY` `CREDIT`   ·   Washington, D.C.

**HEAT: WATCH   OPENNESS: LOW**

A recent Department of War creation working alongside OSC, staffed with recruits from Goldman Sachs, JPMorgan, and other Wall Street firms. Critics have described it as an attempt to build a pseudo-sovereign wealth fund inside the executive branch. Scale-stage, thin public detail. [UNVERIFIED, structure and mandate still forming]

#### Army and Navy on-ramps

`DOW`   ·   `CONTRACT`   ·   service commands

**HEAT: OPEN   OPENNESS: MED**

Each service runs its own front doors. Army Applications Lab and the xTech prize competitions. NavalX, the Office of Naval Research, NAVSEA, and SOFWERX on the SOCOM side. Mostly contracting and prize money rather than equity or loans, but real intake points, and central to the maritime pathway in section 5.5.

### 4.2 Intelligence Community

#### In-Q-Tel (IQT)

`IC`   ·   `EQUITY`   ·   Tysons, VA and Menlo Park, CA

**HEAT: HOT   OPENNESS: MED**

The Intelligence Community's venture arm and, in practice, the only active IC equity vehicle. A nonprofit chartered by the CIA in 1999, IQT now serves the whole community: CIA, NGA, NRO, NSA, DIA, FBI, DHS, several combatant commands, the Space Force, and it now works with OSC. It takes equity, runs roughly $130M to $184M a year in revenue, has backed more than 800 startups (Palantir and Keyhole among the early ones), and co-invests alongside 3,000-plus private investors. That co-invest habit is what makes it useful early: an IQT round brings a mission customer and a syndicate at once. IQT selects the company, not the other way around, which is why openness is medium rather than high.

The other IC funds people mention are gone. The Army's OnPoint Technologies (2002) and NASA's Red Planet Capital both wound down. For this map, one IC node.

### 4.3 Energy

#### DoE Energy Dominance Financing (formerly the Loan Programs Office)

`ENERGY`   ·   `CREDIT`   ·   Washington, D.C.

**HEAT: HOT   OPENNESS: LOW**

The Department of Energy's credit vehicle, rebranded in 2026 from the Loan Programs Office to the Energy Dominance Financing Program, alongside a new Office of Critical Minerals and Energy Innovation. A scale-credit program in the OSC mold, aimed at critical minerals, nuclear, and energy supply chains (Lithium Nevada and MP Materials-type projects). Large loans, project-scale, not seed. DoE's early-stage money runs through ARPA-E and grant FOAs, which are covered in the margins of the sector tabs. [Program rename VERIFIED; confirm current lending posture before use]

### 4.4 Trade and development finance

#### Export-Import Bank (EXIM)

`TRADE`   ·   `CREDIT`   ·   Washington, D.C.

**HEAT: HOT   OPENNESS: LOW**

The US export credit agency, with a $135 billion aggregate exposure cap and a national security lane. That lane is the China and Transformational Exports Program (CTEP), a 2019 congressional mandate to keep the US ahead of China across 10 transformational export areas including semiconductors, AI, quantum, biotech, and clean energy. EXIM must direct at least 20% of its authority toward China-competitive programs. Add the Make More in America domestic financing initiative and the 2025 Supply Chain Resiliency Initiative. The headline is Project Vault, a $10 billion direct loan approved February 2026 to build a US critical-minerals reserve. EXIM does write smaller project checks (IperionX at $11.1M, 6K Additive at $27.4M), but it is export and project credit tied to offtake contracts. Late-stage.

#### Development Finance Corporation (DFC)

`TRADE`   ·   `EQUITY` `CREDIT`   ·   Washington, D.C.

**HEAT: OPEN   OPENNESS: LOW**

The US development finance agency, doing equity and debt for overseas and allied supply chains, and part of the same critical-minerals financing push as EXIM. Relevant where a company's supply chain runs through allied countries. Coordinated with EXIM through the Minerals Security Partnership Finance Network.

### 4.5 Allied and multinational

#### NATO DIANA

`ALLIED`   ·   `NON-DILUTIVE`   ·   `US-ELIGIBLE`   ·   HQ London; North American office Halifax; US sites Boston and Seattle

**HEAT: OPEN   OPENNESS: MED**

The Defence Innovation Accelerator for the North Atlantic. A non-dilutive accelerator and challenge program for dual-use deep tech, open to any incorporated company headquartered in a NATO member nation, which includes the United States. US companies apply and win: the 2026 cohort of 150 firms drew from across the alliance, and the May 2026 Mission Track awards included Mesodyne (Massachusetts) and SkyFi (Texas). Selected companies get contractual funding and access to 16 accelerator sites and more than 200 test centres across 32 nations, across 10 challenge areas including autonomy, energy, and biotech and human resilience. US accelerator sites are MassChallenge in Boston and the Pacific Northwest Mission Acceleration Center in Seattle. Non-dilutive, founders keep IP. US representative Jeffrey Singleton.

#### NATO Innovation Fund (NIF)

`ALLIED`   ·   `EQUITY`   ·   `US-INELIGIBLE`

**HEAT: WATCH   OPENNESS: LOW**

A separate 1 billion euro-plus equity fund with 24 participating NATO nations. The United States did not sign up as a participating nation. The consequence, stated plainly by the US representative to DIANA: the NIF cannot invest in US-based companies. A US founder can graduate through DIANA and still be locked out of NIF equity.

> [!CALLOUT] HANDLE WITH CARE
> DIANA and the NIF are a pair, and the eligibility line runs between them.
> DIANA is open to US companies and gives non-dilutive challenge funding, test access, and allied market pathways. The NIF, the equity follow-on, cannot put money into a US-based company because the US is not one of its 24 funding nations.
> Do not present NIF as reachable capital for a Rosc portfolio company. It is a door that is closed from the US side.

### 4.6 Civil agencies

These are dual-use baselines rather than national security vehicles. They fund the same early companies but with no defense mandate, so they sit adjacent to the core map.

#### NSF America's Seed Fund

`CIVIL`   ·   `NON-DILUTIVE`   ·   nationwide

**HEAT: OPEN   OPENNESS: HIGH**

The National Science Foundation's SBIR/STTR program, roughly $200M a year to about 400 companies, up to $2M per company, no equity taken. Fast-Track proposals up to $1,555,555. Open to US small businesses across nearly all technology areas including AI, semiconductors, and robotics. Non-defense, but the earliest clean non-dilutive R&D money for a deep-tech company.

#### NASA SBIR/STTR and Space Act Agreements

`CIVIL`   ·   `NON-DILUTIVE` `CONTRACT`   ·   nationwide

**HEAT: OPEN   OPENNESS: HIGH**

NASA has no venture arm. Its startup money runs through SBIR/STTR, part of America's Seed Fund, up to roughly $2M non-dilutive, plus funded Space Act Agreements and public-private partnerships for larger commercial work. Civil and space-focused, relevant to the space pathway as a dual-use door rather than a national security one.

#### DHS SVIP

`CIVIL`   ·   `NON-DILUTIVE`   ·   Silicon Valley Innovation Program

**HEAT: OPEN   OPENNESS: MED**

The Department of Homeland Security Science and Technology Directorate's startup program, non-dilutive and structured through Other Transaction agreements, aimed at homeland security problems (border, cyber, first responder). [UNVERIFIED, phase structure and award ceiling around $800K across phases not confirmed at this revision]

## 5. Sector pathways

Each tab shows the same six instrument rows. The vehicles that serve the sector light up; the rest grey out. Overlap across tabs is intended. The "shape" line names how capital reaches that kind of company.

### 5.1 Hardware

Shape: non-dilutive plus contract, the fullest seed menu of any sector.

NSIC is the anchor ($500K to $3M, TRL 3+, hardware only). DIU CSO for first prototype revenue. AFVentures TACFI for a matched bridge. NATO DIANA as a non-dilutive allied door. Then OSC equipment finance and DPA Title III at scale. Every physical-product sector inherits this spine.

### 5.2 Software

Shape: contract-led, not capital-led.

NSIC greys out here because it funds hardware only. A software founder's doors are the customer-and-contract kind: DIU CSO across all six portfolios, service software buyers, and SBIR through AFWERX. In-Q-Tel on the equity side. The message on this tab is that a software seed company chases a paying government customer, because the non-dilutive check mostly is not there.

### 5.3 Critical minerals

Shape: capital-intensive, late, government-as-shareholder. The seed lane is genuinely sparse.

Pathways: DPA Title III, OSC loans and now OSC equity, DoE Energy Dominance Financing, EXIM CTEP and Project Vault, DFC for allied supply, Commerce CHIPS for processing tied to chips, and the National Defense Stockpile as an offtake buyer. Direct equity stakes now sit on top (section 7). A Rosc-stage minerals company mostly interacts through DoE grants and DPA early, then graduates into this stack.

### 5.4 Space

Shape: service-venture plus buyer-pull.

SpaceWERX and Space Ventures (Orbital Prime, non-dilutive), STRATFI and TACFI space rounds, DIU space portfolio, the Space Development Agency and Space RCO as fast buyers, NRO and NGA as commercial-imagery customers often reached through In-Q-Tel, NASA SBIR and Space Act Agreements adjacent, and NATO DIANA for allied dual-use. A close cousin of hardware with its own service arm.

### 5.5 Marine and maritime

Shape: prototype-contract led with a hardware-capital backstop.

DIU's PRIME CSO and the SWAP unmanned-surface-vessel challenge ($100M across sprints plus $200M in follow-on), the Replicator initiative, the Navy's Disruptive Capabilities Office, NAVSEA and the Office of Naval Research, NavalX, SOCOM through SOFWERX, and NSIC since USVs are hardware. AUKUS Pillar II is an allied export channel for autonomous maritime systems. The worked example is Saronic, which paired a private raise with DIU and SOCOM prototype contracts.

### 5.6 AI and autonomy

Shape: contract-led, cross-cutting.

DIU's AI/ML and autonomy portfolios, the CDAO Tradewinds Solutions Marketplace, Replicator, and In-Q-Tel. Big enough and general enough to warrant its own view, but the capital shape matches software: a contract and a customer, not a non-dilutive check.

### 5.7 Biotech and biosecurity

Shape: R&D-grant and offtake led, thin on equity, where it aligns with national security.

The national security alignment is specific. DARPA's Biological Technologies Office runs a standing Broad Agency Announcement (biodefense, biosecurity, human performance, combat casualty care), rolling to 30 September 2026. DPA Title III funds domestic biomanufacturing, part of a Department program of about $1 billion over five years for manufacturing infrastructure plus $200M for biosecurity and cybersecurity at those facilities. The FY2026 National Defense Authorization Act created a Bioindustrial Commercialization Program, a Biotechnology Supply Chain Resiliency Program, and a required Department Biotechnology Strategy, and authorized advance market commitments and offtake agreements for defense-relevant biotech. DIU and In-Q-Tel touch the space. The National Security Commission on Emerging Biotechnology steers the policy. NATO DIANA lists biotech and human resilience as a challenge area.

Adjacent, not core: HHS BARDA and its DRIVe accelerator fund medical countermeasures, and DTRA and JPEO-CBRND buy chem-bio defense. These are health and CBRN customers rather than capital doors.

> [!CALLOUT] WHY THIS SITS HERE
> Biotech earns a tab only where it is defense-relevant. The doors are grant-shaped and offtake-shaped, not venture-shaped. A biosecurity company chases a DARPA BTO award or a Title III biomanufacturing commitment, and increasingly an advance market commitment, rather than a government equity check.

### 5.8 Cyber (phase two)

Shape: contract-and-customer led.

DIU's cyber portfolio, In-Q-Tel, the NSA and Cyber Command as customers, AFWERX SBIR. Build after the first seven tabs.

### 5.9 Microelectronics and semiconductors (phase two)

Shape: capital-heavy, closer to the minerals shape.

The Commerce CHIPS Program Office is the giant here, plus OSC (microelectronics is a covered category), DIU, and the Defense Microelectronics Activity. Build after the first seven tabs.

## 6. Coordination and policy

Four bodies stitch the vehicles together. They hold no company-facing money but they set direction and reduce duplication.

National Security Capital Forum. Established by Section 1092 of the FY2025 National Defense Authorization Act and chaired by the OSC director. The connective tissue on the Department of War side.

National Energy Dominance Council. The interagency body coordinating critical-minerals and energy action across the Department of Energy, the Department of War, Commerce, Interior, EXIM, and others.

Minerals Security Partnership Finance Network. Links DFC, EXIM, and allied finance agencies on critical-minerals projects.

National Security Commission on Emerging Biotechnology. The policy body driving the biotech authorities in section 5.7.

## 7. The equity shift

The single most important development for this map. Inside the last year, the government moved from lending to owning.

In July 2025 the Department of War took a $400M equity stake in MP Materials, the only US rare-earth miner, through convertible preferred shares and a warrant, a stake of roughly 15% that made the Department the company's largest shareholder. The same deal stacked a $150M OSC loan, DPA Title III authorities, a $110 per kilogram price floor on neodymium-praseodymium oxide, and a right to 30% of upside revenue from a second magnet plant.

That was the first of several. A Pentagon-private joint venture took roughly a 40% position in a Korea Zinc US refinery deal worth $1.9 billion in stock, backed by $4.7 billion in loans and $210M in Commerce CHIPS subsidies. The Department also lent to Vulcan Elements, a rare-earth magnet startup that separately took equity from a private venture firm. Officials have said the MP Materials structure is the first of many, and public tallies put federal equity and loans into minerals and battery companies above $2 billion between January 2025 and June 2026. OSC leads these.

The authority is still catching up to the practice. Section 1051 of the Senate FY2027 National Defense Authorization Act would give OSC formal authority to make equity investments up to $500M per deal through a new Treasury account. [PENDING LEGISLATION, not enacted as of this revision]

> [!CALLOUT] VC READ
> The government is now a co-investor and sometimes a lead, at least in critical minerals and industrial base. For a venture firm this cuts two ways. A government equity stake is a strong validation signal and a balance-sheet backstop for a capital-intensive company. It also means a new and price-insensitive actor sits on some cap tables, with offtake terms and price floors attached.
> The stakes so far are strategic-size and concentrated in minerals, batteries, and magnets. This is not seed-stage equity. But the direction of travel is worth tracking, because a formal $500M OSC equity authority would put the Department into growth rounds directly.

## 8. Rosc read

This section holds all Rosc-facing analysis. Everything else in the document is neutral and descriptive.

Where Rosc's own lever sits. The one vehicle Rosc touches as a manager rather than as a company's backer is SBIC-CT. A licensed fund borrowing up to $175M per fund against private capital is the mechanism that connects the seed doors to the OSC scale stack. If Rosc wants exposure to the government-capital flywheel at the fund level, this is the instrument to study.

Which doors a Rosc portfolio company knocks on first, by shape. A hardware or space portfolio company has the fullest seed menu: NSIC first, then a DIU CSO for revenue, then a TACFI bridge that pulls Rosc's own check in through the match. A software or AI company has no comparable non-dilutive check, so the play is a paying DIU customer early. A critical-minerals company has almost no seed lane and should be evaluated knowing the real money is late and increasingly comes with a government owner attached.

The DARPA angle Rosc should not miss. DARPA is not an investor, but its Commercial Strategy Office runs Venture Horizons, which exists to connect investors like Rosc to DARPA performers before a raise. That is a deal-flow channel, not a capital source, and it is a cleaner fit for Rosc than the education-and-outreach front door.

The OnRamp Hub note. Rosc has a live bid, through First Light Works with Ateklo and Gaven, to operate a DIU Defense Innovation OnRamp Hub at Brunswick Landing under Section 913 of the FY2026 National Defense Authorization Act. New hubs are sub-awardees under a cooperative agreement held by the Applied Research Institute, not contracts with DIU directly. That structure matters for how any hub economics and reporting obligations flow. [Kept out of the neutral DIU entry in section 4.1 on purpose. Handle distribution of this section with care given the open bid.]

The allied caveat. NATO DIANA is a usable non-dilutive door for a US Rosc portfolio company. The NATO Innovation Fund is not, because it cannot invest in US-based companies. Do not build an allied-capital thesis on NIF equity for US portfolio companies.

## 9. Constraints and gaps

What this map does not yet nail down, stated as gaps rather than filled.

- OSC covered-category count is cited as both 31 and 34 across current sources. Not reconciled here.
- OSC equity authority is pending in the FY2027 National Defense Authorization Act and not enacted. Every reference to OSC equity carries that marker.
- EDU structure and mandate are still forming and thinly documented.
- NSIC leadership (Tex Schenkkan) is from an older source and may be stale.
- DHS SVIP award ceiling and phase structure are not confirmed at this revision.
- The DARPA Commercial Strategy Office scorecard is cumulative since 2018 and should be refreshed before any external use.
- DoE Energy Dominance Financing is a 2026 rename of the Loan Programs Office; its current lending posture under the new name should be confirmed.
- This map deprioritises SBIR and STTR by design. It names them as an on-ramp but does not inventory the service programs in full.

## 10. Key names

| Name | Role | Confidence |
| --- | --- | --- |
| Jason Rathje | Director, Office of Strategic Capital | VERIFIED |
| Owen West | Director, Defense Innovation Unit (since Jan 2026) | VERIFIED |
| Stephen Winchell | Director, DARPA | VERIFIED |
| Sha-Chelle Devlin Manning | Chief of Commercial Strategy, DARPA | VERIFIED |
| Jeffrey Singleton | US representative to NATO DIANA | VERIFIED |
| Tex Schenkkan | Director, NSIC | STALE |

## 11. Glossary

| Term | Meaning |
| --- | --- |
| OSC | Office of Strategic Capital, the Department of War finance office using loans, guarantees, and soon equity |
| SBIC-CT | Small Business Investment Company Critical Technology Initiative, a DoW-SBA fund-level facility |
| NSIC | National Security Innovation Capital, DIU's non-dilutive hardware seed program |
| DIU | Defense Innovation Unit, the Pentagon's commercial-technology contracting bridge |
| CSO | Commercial Solutions Opening, DIU's fast prototype-contract vehicle |
| OTA | Other Transaction Authority, 10 U.S.C. 4022, the non-traditional contracting authority most of these programs use |
| STRATFI / TACFI | AFVentures matching bridges, $3M to $15M and $375K to $2M |
| DPA Title III | Defense Production Act industrial-base investment authority |
| EDU | Economic Defense Unit, a new DoW investment body alongside OSC |
| IQT | In-Q-Tel, the Intelligence Community's venture arm |
| EDF | Energy Dominance Financing, the 2026 rename of the DoE Loan Programs Office |
| CTEP | China and Transformational Exports Program at EXIM |
| DFC | Development Finance Corporation |
| DIANA | Defence Innovation Accelerator for the North Atlantic, NATO's dual-use accelerator |
| NIF | NATO Innovation Fund, the alliance equity fund the US did not join |
| TRL | Technology Readiness Level |

## 12. Sources

Primary federal and institutional sources take precedence. Confirm all figures against the current source before external use.

- Office of Strategic Capital, cto.mil/osc, FY2025 Investment Strategy, Credit Program notices
- Congressional Research Service, Office of Strategic Capital: Overview and Considerations (IF13215)
- DIU notices, diu.mil, and NSIC at nsic.mil
- AFWERX and AFVentures published program terms
- In-Q-Tel, iqt.org
- Department of Energy Loan Programs Office / Energy Dominance Financing announcements
- EXIM CTEP and critical-minerals releases, exim.gov, and Department of State critical-minerals materials
- NATO DIANA, diana.nato.int, and reporting on the NATO Innovation Fund
- NSF America's Seed Fund, seedfund.nsf.gov, and NASA SBIR/STTR, nasa.gov
- Senate biotech releases and the FY2026 National Defense Authorization Act biotechnology provisions
- CNBC, DefenseScoop, and CRS coverage of the MP Materials and Korea Zinc equity deals
- Rosc ARI/DARPA/DIU map, for the DARPA Commercial Strategy Office and DIU OnRamp Hub structure
