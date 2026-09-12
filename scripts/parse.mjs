// Build-time parser. Reads the source markdown and emits structured JSON.
// Rule 1: render the content, do not change it. Every prose string that
// reaches the page comes out of the source file, never out of this script.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'content/NATSEC_CAPITAL_MAP_v1.md');
const OUT_JSON = resolve(ROOT, 'data/natsec.json');
const OUT_JS = resolve(ROOT, 'data/natsec.js');

const MARKERS = ['UNVERIFIED', 'STALE', 'NOT CONFIRMED', 'PENDING LEGISLATION', 'CUMULATIVE — REFRESH'];
const MARK_RE = new RegExp('\\[(' + MARKERS.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(,\\s*([^\\]]*))?\\]', 'g');
const ASIDE_RE = /\[([^\]]+)\]/g;

const BODY_SET = new Set(['DOW', 'IC', 'ENERGY', 'TRADE', 'ALLIED', 'CIVIL']);
const INSTRUMENT_SET = new Set(['NON-DILUTIVE', 'CONTRACT', 'MATCHING', 'EQUITY', 'FUND-LEVEL', 'CREDIT']);
const ELIGIBILITY_SET = new Set(['US-ELIGIBLE', 'US-INELIGIBLE']);

/* ---------- inline ---------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(raw) {
  const confidence = [];
  let s = esc(raw);
  s = s.replace(MARK_RE, (_m, tag, _g2, extra) => {
    confidence.push(tag);
    const note = extra ? '<span class="conf-extra">' + extra.trim() + '</span>' : '';
    return '<span class="chip chip-conf conf-' + slug(tag) + '" data-conf="' + tag + '">' + tag + '</span>' + note;
  });
  // Remaining bracket text is a Rosc-internal or sourcing aside, not a formal
  // confidence marker. Preserve it, but never let it read as a chip.
  s = s.replace(ASIDE_RE, '<span class="aside">[$1]</span>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  return { html: s, confidence };
}

const plain = (raw) => raw.replace(MARK_RE, '$1').replace(/\[|\]/g, '').replace(/\*\*|\*|`/g, '');

/* ---------- vehicle tag line / heat line ---------- */

// `DOW`   ·   `CREDIT` `EQUITY`   ·   Washington, D.C.
function parseTagLine(line) {
  const segments = line.split('·').map((s) => s.trim()).filter(Boolean);
  const body = [];
  const instruments = [];
  const eligibility = [];
  const meta = [];
  segments.forEach((seg) => {
    const codes = [...seg.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (!codes.length) { meta.push(seg); return; }
    codes.forEach((c) => {
      if (BODY_SET.has(c)) body.push(c);
      else if (INSTRUMENT_SET.has(c)) instruments.push(c);
      else if (ELIGIBILITY_SET.has(c)) eligibility.push(c);
      else meta.push(c);
    });
  });
  return { body, instruments, eligibility, meta };
}

const HEAT_RE = /^\*\*HEAT:\s*([A-Z]+)\s+OPENNESS:\s*([A-Z]+)\*\*$/;
const TAGLINE_RE = /`[^`]+`/;

/* ---------- block parse ---------- */

const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isSep = (line) => /^\|[\s|:-]+\|?\s*$/.test(line.trim()) && line.includes('-');

function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  let para = [];

  const flush = () => {
    if (!para.length) return;
    const raw = para.join(' ').trim();
    para = [];
    if (!raw) return;
    const { html, confidence } = inline(raw);
    const bare = raw.replace(MARK_RE, '').replace(/^[\s,.]+|[\s,.]+$/g, '');
    const type = confidence.length && bare.split(/\s+/).filter(Boolean).length <= 14 ? 'confidence' : 'para';
    blocks.push({ type, raw, html, text: plain(raw), confidence });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim() || line.trim() === '---') { flush(); i++; continue; }

    // Callout: > [!CALLOUT] LABEL, then continuation lines each starting
    // with '>'. Each continuation line becomes its own paragraph, verbatim.
    const co = line.match(/^>\s*\[!CALLOUT\]\s*(.+?)\s*$/);
    if (co) {
      flush();
      const label = co[1].trim();
      const bodyLines = [];
      i++;
      while (i < lines.length && /^>/.test(lines[i])) {
        bodyLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'callout',
        label,
        paras: bodyLines.filter((l) => l.trim()).map((l) => inline(l.trim())),
      });
      continue;
    }

    if (/^#### /.test(line)) {
      flush();
      const heading = line.replace(/^#### /, '').trim();
      i++;
      // Peek ahead for a vehicle tag line and a heat/openness line. Blank
      // lines between the heading and these markers are skipped, not
      // consumed as a paragraph break, since they carry no content.
      let j = i;
      while (j < lines.length && !lines[j].trim()) j++;
      let tag = null, heat = null;
      if (j < lines.length && TAGLINE_RE.test(lines[j]) && !/^>/.test(lines[j]) && !/^\|/.test(lines[j])) {
        tag = parseTagLine(lines[j].trim());
        j++;
        while (j < lines.length && !lines[j].trim()) j++;
      }
      if (j < lines.length && HEAT_RE.test(lines[j].trim())) {
        const m = lines[j].trim().match(HEAT_RE);
        heat = { heat: m[1], openness: m[2] };
        j++;
      }
      if (tag || heat) i = j;
      blocks.push({ type: 'h4', heading, headingHtml: inline(heading).html, tag, heat });
      continue;
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length && isSep(lines[i + 1])) {
      flush();
      const headers = splitRow(line).map(inline);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]).map(inline));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    if (/^[-*] /.test(line.trim())) {
      flush();
      const items = [];
      while (i < lines.length && (/^[-*] /.test(lines[i].trim()) || (items.length && /^\s{2,}\S/.test(lines[i])))) {
        if (/^[-*] /.test(lines[i].trim())) items.push(lines[i].trim().replace(/^[-*] /, ''));
        else items[items.length - 1] += ' ' + lines[i].trim();
        i++;
      }
      blocks.push({ type: 'list', ordered: false, items: items.map(inline) });
      continue;
    }

    para.push(line.trim());
    i++;
  }
  flush();
  return blocks;
}

// Groups a flat block list into vehicle cards. Every h4 with a tag or heat
// line opens a vehicle card that swallows blocks until the next heading of
// any kind. An h4 with neither (e.g. "How to read this document") stays a
// plain inline heading, not a vehicle.
function groupVehicles(blocks) {
  const out = [];
  let current = null;
  blocks.forEach((b) => {
    if (b.type === 'h4' && (b.tag || b.heat)) {
      current = { type: 'vehicle', heading: b.heading, headingHtml: b.headingHtml, tag: b.tag, heat: b.heat, blocks: [] };
      out.push(current);
      return;
    }
    if (b.type === 'h4') { current = null; out.push(b); return; }
    if (current) current.blocks.push(b);
    else out.push(b);
  });
  return out;
}

/* ---------- document ---------- */

const src = readFileSync(SRC, 'utf8');
const allLines = src.split(/\r?\n/);

const doc = { title: '', subtitle: '', date: '', sections: [] };
const h2Idx = [];
allLines.forEach((l, n) => { if (/^## /.test(l)) h2Idx.push(n); });

// Preamble: the ROSC INTERNAL banner before "## Contents". Its three lines
// are the document title, subtitle, and date, not an in-body callout.
const preambleBlocks = parseBlocks(allLines.slice(0, h2Idx[0]));
const banner = preambleBlocks.find((b) => b.type === 'callout');
if (banner) {
  doc.title = banner.paras[0] ? plain(banner.paras[0].html.replace(/<[^>]+>/g, '')) : '';
  doc.subtitle = banner.paras[1] ? plain(banner.paras[1].html.replace(/<[^>]+>/g, '')) : '';
  doc.date = banner.paras[2] ? plain(banner.paras[2].html.replace(/<[^>]+>/g, '')) : '';
}
// Undo the HTML entity escaping left over from inline() so title text is raw.
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
doc.title = unesc(doc.title);
doc.subtitle = unesc(doc.subtitle);
doc.date = unesc(doc.date);

// "## Contents" is a navigational front-matter index, not one of the 12
// analytical sections enumerated in the build spec. It is parsed here for
// inspection but intentionally not attached to doc.sections, since the tab
// bar itself is the table of contents. Nothing analytical is dropped.
doc.contentsRaw = parseBlocks(allLines.slice(h2Idx[0] + 1, h2Idx[1]));

for (let k = 1; k < h2Idx.length; k++) {
  const start = h2Idx[k];
  const end = k + 1 < h2Idx.length ? h2Idx[k + 1] : allLines.length;
  const heading = allLines[start].replace(/^## /, '').trim();
  const m = heading.match(/^(\d+)\.\s*(.*)$/);
  const body = allLines.slice(start + 1, end);

  const subIdx = [];
  body.forEach((l, n) => { if (/^### /.test(l)) subIdx.push(n); });

  const section = {
    number: m ? Number(m[1]) : k,
    title: m ? m[2] : heading,
    id: 's' + (m ? m[1] : k),
    intro: groupVehicles(parseBlocks(body.slice(0, subIdx.length ? subIdx[0] : body.length))),
    subsections: [],
  };

  subIdx.forEach((s, n) => {
    const e = n + 1 < subIdx.length ? subIdx[n + 1] : body.length;
    const subHeading = body[s].replace(/^### /, '').trim();
    const sm = subHeading.match(/^(\d+\.\d+)\s+(.*)$/);
    section.subsections.push({
      number: sm ? sm[1] : String(n + 1),
      title: sm ? sm[2] : subHeading,
      id: section.id + '-' + (n + 1),
      blocks: groupVehicles(parseBlocks(body.slice(s + 1, e))),
    });
  });

  doc.sections.push(section);
}

/* ---------- vehicle registry ----------
   Flat list of every vehicle card, in document order, for the matrix and
   sector grid to key off. */

// Tooltip summary: the vehicle's own first sentence, verbatim. Capped only
// as a safety limit, never reworded.
function firstSentence(blocks) {
  for (const b of blocks) {
    if (b.type === 'para' || b.type === 'confidence') {
      const t = b.text;
      const idx = t.indexOf('. ');
      if (idx > 0 && idx < 240) return t.slice(0, idx + 1);
      return t.length > 240 ? t.slice(0, 240).trim() + '…' : t;
    }
  }
  return '';
}

const vehicles = [];
function collectVehicles(blocks, sectionNum, subTitle) {
  blocks.forEach((b) => {
    if (b.type === 'vehicle') {
      vehicles.push({
        id: 'v-' + slug(b.heading),
        heading: b.heading,
        section: sectionNum,
        group: subTitle,
        body: b.tag ? b.tag.body : [],
        instruments: b.tag ? b.tag.instruments : [],
        eligibility: b.tag ? b.tag.eligibility : [],
        meta: b.tag ? b.tag.meta : [],
        heat: b.heat ? b.heat.heat : null,
        openness: b.heat ? b.heat.openness : null,
        summary: firstSentence(b.blocks),
      });
    }
  });
}
const sec4 = doc.sections.find((s) => s.number === 3);
sec4.subsections.forEach((ss) => collectVehicles(ss.blocks, 4, ss.title));
// Section 12, State and regional programs, holds its vehicle cards directly
// in its intro (no subsections), a separate appendix tab out of scope for
// the matrix and sector grid.
const sec12 = doc.sections.find((s) => s.number === 12);
if (sec12) collectVehicles(sec12.intro, 12, 'State and regional programs');
doc.vehicles = vehicles;

/* ---------- instrument type definitions ----------
   Section 2 pairs an #### heading with the paragraph right after it, one
   per instrument type. Lifted verbatim for the matrix row tooltips. */

const instrumentDefs = {};
{
  const sec2 = doc.sections.find((s) => s.number === 2);
  let pendingName = null;
  sec2.intro.forEach((b) => {
    if (b.type === 'h4') { pendingName = b.heading; return; }
    if (pendingName && (b.type === 'para' || b.type === 'confidence')) {
      instrumentDefs[pendingName] = b.text;
      pendingName = null;
    }
  });
}
doc.instrumentDefs = instrumentDefs;

/* ---------- counts ---------- */

let tables = 0;
const conf = {};
const walk = (blocks) => {
  blocks.forEach((b) => {
    if (b.type === 'vehicle') { walk(b.blocks); return; }
    if (b.type === 'table') {
      tables++;
      [...b.headers, ...b.rows.flat()].forEach((c) => c.confidence.forEach((x) => { conf[x] = (conf[x] || 0) + 1; }));
    }
    (b.confidence || []).forEach((c) => { conf[c] = (conf[c] || 0) + 1; });
  });
};
doc.sections.forEach((s) => { walk(s.intro); s.subsections.forEach((ss) => walk(ss.blocks)); });

doc.meta = {
  sections: doc.sections.length,
  tables,
  vehicles: vehicles.length,
  sectorSubsections: doc.sections.find((s) => s.number === 4).subsections.length,
  words: src.split(/\s+/).filter(Boolean).length,
  confidence: conf,
  generated: 'September 2026',
};

mkdirSync(dirname(OUT_JSON), { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(doc, null, 2));
writeFileSync(OUT_JS, 'window.__NATSEC__ = ' + JSON.stringify(doc) + ';\n');

console.log('sections :', doc.meta.sections, '(want 12)');
console.log('tables   :', doc.meta.tables);
console.log('vehicles :', doc.meta.vehicles, '(want ~50)');
console.log('sector subtabs:', doc.meta.sectorSubsections, '(want 7)');
console.log('words    :', doc.meta.words);
console.log('markers  :', JSON.stringify(conf));
