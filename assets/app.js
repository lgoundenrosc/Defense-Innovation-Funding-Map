/* National Security Government Capital, v1. Renders the parsed source document.
   Source prose is never rewritten here. Only labels, chips, grid scaffolding,
   and control text are authored in this file. */

(function () {
  'use strict';

  var DOC = window.__NATSEC__;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function stripTags(s) {
    return String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
  }
  function chip(cls, value, extra) {
    return '<span class="chip ' + cls + '-' + slug(value) + '">' + value + '</span>' + (extra || '');
  }
  function escAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  /* ---------- vehicle registry ---------- */

  var VEHICLES = DOC.vehicles;
  var byHeading = {};
  VEHICLES.forEach(function (v) { byHeading[v.heading] = v; });

  // Compact display key for each directory entry, used only for the matrix's
  // "vehicle plus body tag" chips and the sector grid rows. The matrix and
  // sector-pathway prose in the source is rendered verbatim regardless.
  var SHORT = {
    'Office of Strategic Capital (OSC)': 'OSC',
    'SBIC Critical Technology Initiative (SBIC-CT)': 'SBIC-CT',
    'National Security Innovation Capital (NSIC)': 'NSIC',
    'Defense Innovation Unit (DIU)': 'DIU',
    'AFWERX / AFVentures': 'AFVentures',
    'SpaceWERX / Space Ventures': 'Space Ventures',
    'Defense Production Act Title III': 'DPA Title III',
    'DARPA Commercial Strategy Office and Venture Horizons': 'DARPA CSO',
    'Economic Defense Unit (EDU)': 'EDU',
    'Army Applications Laboratory (AAL) and xTech': 'AAL / xTech',
    'NavalX and the Tech Bridge network': 'NavalX',
    'Office of Naval Research (ONR) SBIR/STTR': 'ONR SBIR/STTR',
    'SOFWERX': 'SOFWERX',
    'Marine Corps Warfighting Laboratory (MCWL)': 'MCWL',
    'In-Q-Tel (IQT)': 'In-Q-Tel',
    'DoE Energy Dominance Financing (formerly the Loan Programs Office)': 'DoE EDF',
    'Export-Import Bank (EXIM)': 'EXIM',
    'Development Finance Corporation (DFC)': 'DFC',
    'NATO DIANA': 'NATO DIANA',
    'NATO Innovation Fund (NIF)': 'NIF',
    'AUKUS Pillar II': 'AUKUS Pillar II',
    "NSF America's Seed Fund": 'NSF Seed Fund',
    'NASA SBIR/STTR and Space Act Agreements': 'NASA SBIR',
    'DHS SVIP': 'DHS SVIP',
    'Rapid Innovation Fund (RIF)': 'RIF',
    'Medical CBRN Defense Consortium (MCDC)': 'MCDC',
    'ARPA-E': 'ARPA-E',
    'National Defense Stockpile': 'National Defense Stockpile',
    'NextFlex and the Manufacturing USA network': 'NextFlex',
    'Commerce CHIPS Program Office': 'Commerce CHIPS'
  };

  // Maps a token as it literally appears in the section 2 matrix table to the
  // directory entry it names. Tokens with no entry (DARPA BTO, service
  // SBIR/STTR, direct DoW stakes) render as unmapped chips and are called
  // out in the build's closing notes, per the build package's instruction
  // to report any vehicle that does not place cleanly.
  var CELL_ALIAS = {
    'NSIC': 'National Security Innovation Capital (NSIC)',
    'Space Ventures': 'SpaceWERX / Space Ventures',
    'NSF Seed Fund': "NSF America's Seed Fund",
    'NASA SBIR': 'NASA SBIR/STTR and Space Act Agreements',
    'DHS SVIP': 'DHS SVIP',
    'NATO DIANA': 'NATO DIANA',
    'AUKUS Pillar II': 'AUKUS Pillar II',
    'DIU CSO': 'Defense Innovation Unit (DIU)',
    'Replicator/PRIME': 'Defense Innovation Unit (DIU)',
    'AFVentures TACFI': 'AFWERX / AFVentures',
    'AFVentures STRATFI': 'AFWERX / AFVentures',
    'In-Q-Tel': 'In-Q-Tel (IQT)',
    'OSC equity': 'Office of Strategic Capital (OSC)',
    'OSC credit': 'Office of Strategic Capital (OSC)',
    'SBIC-CT': 'SBIC Critical Technology Initiative (SBIC-CT)',
    'DoE EDF': 'DoE Energy Dominance Financing (formerly the Loan Programs Office)',
    'EXIM': 'Export-Import Bank (EXIM)',
    'DFC': 'Development Finance Corporation (DFC)',
    'EDU': 'Economic Defense Unit (EDU)',
    'DPA Title III awards': 'Defense Production Act Title III',
    'MCDC': 'Medical CBRN Defense Consortium (MCDC)',
    'RIF': 'Rapid Innovation Fund (RIF)',
    'ARPA-E': 'ARPA-E',
    'National Defense Stockpile': 'National Defense Stockpile',
    'Commerce CHIPS': 'Commerce CHIPS Program Office'
  };
  var UNMAPPED_SEEN = {};

  // Which sectors (by number, section 5.N) each vehicle "lights up" on in the
  // sector pathway grid. Hand-derived from the section 5 prose, since that
  // prose is discursive rather than tabular, following the same approach the
  // ARI build used for its lane and hub data: the source paragraphs are
  // rendered verbatim regardless of this lookup, which drives the grid only.
  // Hardware's own paragraph states a rule, not just a fact: "every
  // physical-product sector inherits this spine" (NSIC, DIU CSO, AFVentures
  // TACFI, NATO DIANA, OSC equipment finance, DPA Title III). Space and
  // Marine are the physical-product sectors, so all six propagate there even
  // where a sector's own write-up does not re-name every one of them.
  // Separately, EXIM and NSF each state their own cross-sector scope in
  // their own directory entries (EXIM's CTEP names AI, biotech, and
  // semiconductors; NSF names AI, semiconductors, and robotics) and are lit
  // accordingly even on sectors whose own paragraph doesn't cite them by
  // name. Both judgment calls are logged in Constraints and gaps.
  var SECTOR_LIT = {
    'National Security Innovation Capital (NSIC)': [1, 4, 5],
    'Defense Innovation Unit (DIU)': [1, 2, 4, 5, 6, 7],
    'AFWERX / AFVentures': [1, 2, 4, 5],
    'NATO DIANA': [1, 2, 4, 5, 6],
    'Defense Production Act Title III': [1, 3, 4, 5, 6],
    'Office of Strategic Capital (OSC)': [1, 3, 4, 5, 7],
    'In-Q-Tel (IQT)': [2, 4, 6],
    'SpaceWERX / Space Ventures': [4],
    'DoE Energy Dominance Financing (formerly the Loan Programs Office)': [3],
    'Export-Import Bank (EXIM)': [2, 3, 6, 7],
    'Development Finance Corporation (DFC)': [3],
    'NASA SBIR/STTR and Space Act Agreements': [4],
    'NavalX and the Tech Bridge network': [5],
    'Office of Naval Research (ONR) SBIR/STTR': [5],
    'SOFWERX': [5],
    'AUKUS Pillar II': [5],
    'Marine Corps Warfighting Laboratory (MCWL)': [5],
    "NSF America's Seed Fund": [1, 2, 7],
    'DHS SVIP': [2],
    'Medical CBRN Defense Consortium (MCDC)': [6],
    'ARPA-E': [3],
    'National Defense Stockpile': [3],
    'Commerce CHIPS Program Office': [7],
    'NextFlex and the Manufacturing USA network': [1, 7]
  };

  var ROWS = [
    { key: 'NON-DILUTIVE', label: 'Non-dilutive capital' },
    { key: 'CONTRACT', label: 'First contract / OTA' },
    { key: 'MATCHING', label: 'Matching capital' },
    { key: 'EQUITY', label: 'Strategic equity' },
    { key: 'FUND-LEVEL', label: 'Fund-level' },
    { key: 'CREDIT', label: 'Scale credit' }
  ];

  var INSTRUMENT_DEFS = DOC.instrumentDefs || {};

  /* ---------- tabs ---------- */

  var TABS = [
    { id: 'overview', label: 'Overview', sections: [1] },
    { id: 'instruments', label: 'Instrument types', sections: [2] },
    { id: 'directory', label: 'Vehicle directory', sections: [3] },
    { id: 'sectors', label: 'Sector pathways', sections: [4], star: true },
    { id: 'coord', label: 'Coordination and policy', sections: [5] },
    { id: 'equity', label: 'The equity shift', sections: [6], sq: true },
    { id: 'rosc', label: 'Rosc read', sections: [7] },
    { id: 'gaps', label: 'Constraints and gaps', sections: [8], sq: true },
    { id: 'names', label: 'Key names', sections: [9] },
    { id: 'glossary', label: 'Glossary', sections: [10] },
    { id: 'sources', label: 'Sources', sections: [11] }
  ];

  /* ---------- callouts ---------- */

  var SCHEME = {
    'VC READ': 'green',
    'VC WHITE SPACE': 'green',
    'THE DEFINING MECHANIC': 'green-strong',
    'HANDLE WITH CARE': 'red',
    'INSTRUMENT NOTE': 'rust',
    'HOW TO READ THIS ENTRY': 'amber',
    'WHY THIS SITS HERE': 'amber',
    'REVISION NOTE': 'navy',
    'ROSC INTERNAL': 'navy'
  };
  var UNRECOGNISED_LABELS = {};

  function renderCallout(b) {
    var scheme = SCHEME[b.label];
    if (!scheme) { scheme = 'rust'; UNRECOGNISED_LABELS[b.label] = true; }
    var body = b.paras.map(function (p) { return '<p>' + p.html + '</p>'; }).join('');
    return '<div class="callout ' + scheme + '"><span class="co-label">' + b.label + '</span>' + body + '</div>';
  }

  /* ---------- tables ---------- */

  function tableKind(t) {
    var h = t.headers.map(function (c) { return stripTags(c.html); }).join('|');
    if (h === 'Instrument type|Pre-seed / seed|Series A / B|Growth / scale') return 'matrix';
    if (h === 'Name|Role|Confidence') return 'names';
    if (h === 'Term|Meaning') return 'glossary';
    return '';
  }

  var CONF_FAMILY = {
    VERIFIED: 'conf-verified', UNVERIFIED: 'conf-unverified', STALE: 'conf-stale',
    'NOT CONFIRMED': 'conf-not-confirmed', PENDING: 'conf-pending-legislation'
  };

  function renderTable(t) {
    var kind = tableKind(t);
    var h = '<div class="table-scroll"><table>';
    h += '<thead><tr>' + t.headers.map(function (c) { return '<th>' + (stripTags(c.html) || '&nbsp;') + '</th>'; }).join('') + '</tr></thead><tbody>';
    t.rows.forEach(function (r) {
      h += '<tr>';
      r.forEach(function (c, ci) {
        var cell = c.html;
        if (kind === 'names' && ci === 2) {
          var val = stripTags(cell);
          cell = '<span class="chip ' + (CONF_FAMILY[val] || 'conf-stale') + '">' + val + '</span>';
        }
        h += '<td>' + cell + '</td>';
      });
      h += '</tr>';
    });
    return h + '</tbody></table></div>';
  }

  /* ---------- vehicle cards ---------- */

  function vehicleTagLine(v) {
    var parts = [];
    v.body.forEach(function (b) { parts.push('<span class="chip body-chip">' + b + '</span>'); });
    v.instruments.forEach(function (i) { parts.push('<span class="chip inst-chip">' + i + '</span>'); });
    v.eligibility.forEach(function (e) {
      parts.push('<span class="chip ' + (e === 'US-ELIGIBLE' ? 'elig-us-eligible' : 'elig-us-ineligible') + '">' + e + '</span>');
    });
    v.meta.forEach(function (m) { parts.push('<span class="veh-loc">' + m + '</span>'); });
    return parts.join('<span class="veh-sep">·</span>');
  }

  function renderVehicle(b) {
    var v = byHeading[b.heading];
    var bodyId = v.id + '-body';
    var h = '<div class="vehicle-card" id="' + v.id + '" data-body="' + v.body.join(' ') + '" data-heat="' + (v.heat || '') + '" data-open="' + (v.openness || '') + '">';
    h += '<button type="button" class="veh-toggle" aria-expanded="false" aria-controls="' + bodyId + '">';
    h += '<h4 class="veh-h">' + b.headingHtml + '</h4>';
    h += '<div class="veh-tagline">' + vehicleTagLine(v) + '</div>';
    if (b.heat) {
      h += '<div class="chip-row">' + chip('heat', b.heat.heat) + chip('open', b.heat.openness) + '</div>';
    }
    h += '<span class="veh-caret" aria-hidden="true">+</span>';
    h += '</button>';
    h += '<div class="veh-body" id="' + bodyId + '" hidden>' + renderBlocks(b.blocks).join('') + '</div>';
    h += '</div>';
    return h;
  }

  /* ---------- capital map matrix ---------- */

  function findMatrixTable() {
    var sec1 = DOC.sections.find(function (s) { return s.number === 1; });
    return sec1.intro.find(function (b) { return b.type === 'table'; });
  }

  function cellVehicleChips(cellHtml) {
    var plainAll = stripTags(cellHtml);
    if (plainAll === '(gap)') return { gap: true, chips: [] };
    var tokens = cellHtml.split(/,\s*/);
    var chips = tokens.map(function (tok) {
      var confHtml = '';
      var conf = tok.match(/<span class="chip chip-conf[^"]*"[^>]*>([^<]*)<\/span>(<span class="conf-extra">[^<]*<\/span>)?/);
      var nameHtml = tok;
      if (conf) { confHtml = conf[0]; nameHtml = tok.replace(conf[0], ''); }
      var name = stripTags(nameHtml).replace(/[.,]\s*$/, '').trim();
      var vehicleHeading = CELL_ALIAS[name];
      var v = vehicleHeading ? byHeading[vehicleHeading] : null;
      if (!v) UNMAPPED_SEEN[name] = true;
      var bodyTag = v ? v.body[0] : (name === 'DARPA BTO' || name === 'service SBIR/STTR' ? 'DOW' : (name === 'Commerce CHIPS' ? 'TRADE' : ''));
      return {
        name: name,
        confHtml: confHtml,
        mapped: !!v,
        bodyTag: bodyTag,
        id: v ? v.id : null,
        tip: v ? v.heading + '. ' + v.summary : ''
      };
    });
    return { gap: false, chips: chips };
  }

  function matrixChipHtml(c) {
    var cls = 'mx-vehicle' + (c.mapped ? '' : ' unmapped');
    var link = c.mapped ? ' data-jump="' + c.id + '"' : '';
    var tip = c.tip ? ' data-tip="' + escAttr(c.tip) + '" tabindex="0"' : '';
    return '<span class="' + cls + '"' + link + tip + '>' + c.name +
      (c.bodyTag ? ' <span class="chip body-chip vb">' + c.bodyTag + '</span>' : '') +
      c.confHtml + '</span>';
  }

  function buildMatrixVisual() {
    var t = findMatrixTable();
    if (!t) return '';
    var html = '<div class="matrix-wrap"><div class="matrix">';
    html += '<div class="mx-head mx-corner"></div>';
    ['Pre-seed / seed', 'Series A / B', 'Growth / scale'].forEach(function (c) { html += '<div class="mx-head">' + c + '</div>'; });

    t.rows.forEach(function (row, ri) {
      var rowLabel = stripTags(row[0].html);
      var isPriorityRow = ri < 2; // non-dilutive, first contract / OTA
      var isScaleRow = false; // scale shading applied per-cell (growth column x credit/equity/fund-level rows)
      var scaleRows = ['Strategic equity', 'Fund-level', 'Scale credit'];
      var rowDef = INSTRUMENT_DEFS[rowLabel];
      var rowTip = rowDef ? ' data-tip="' + escAttr(rowLabel + '. ' + rowDef) + '" tabindex="0"' : '';
      html += '<div class="mx-row-label' + (isPriorityRow ? ' mx-priority-label' : (scaleRows.indexOf(rowLabel) >= 0 ? ' mx-scale-label' : '')) + '"' + rowTip + '>' + rowLabel + '</div>';
      for (var col = 1; col <= 3; col++) {
        var cell = cellVehicleChips(row[col].html);
        var isPriorityCell = isPriorityRow && col === 1;
        var isScaleCell = scaleRows.indexOf(rowLabel) >= 0 && col === 3;
        var cls = 'mx-cell' + (cell.gap ? ' mx-gap' : '') + (isPriorityCell ? ' mx-priority' : '') + (isScaleCell ? ' mx-scale' : '');
        html += '<div class="' + cls + '">';
        if (cell.gap) html += '<span class="mx-gap-label">gap</span>';
        else html += '<div class="mx-chips">' + cell.chips.map(matrixChipHtml).join('') + '</div>';
        html += '</div>';
      }
    });
    html += '</div></div>';
    html += '<div class="matrix-legend">' +
      '<span class="li"><span class="sw priority"></span>Priority zone: seed &times; non-dilutive / first contract</span>' +
      '<span class="li"><span class="sw scale"></span>Scale stack: growth &times; credit / equity / fund-level</span>' +
      '</div>';
    return html;
  }

  /* ---------- sector pathway grid ---------- */

  function sectorGrid(sectorNum) {
    var html = '<div class="sgrid">';
    ROWS.forEach(function (row) {
      var vs = VEHICLES.filter(function (v) { return v.instruments.indexOf(row.key) >= 0; });
      if (!vs.length) return;
      html += '<div class="sgrid-row"><div class="sgrid-label">' + row.label + '</div><div class="sgrid-items">';
      vs.forEach(function (v) {
        var lit = (SECTOR_LIT[v.heading] || []).indexOf(sectorNum) >= 0;
        html += '<span class="sgrid-chip ' + (lit ? 'lit' : 'grey') + '" data-jump="' + (lit ? v.id : '') + '">' +
          (SHORT[v.heading] || v.heading) + ' <span class="chip body-chip vb">' + v.body[0] + '</span></span>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  }

  function sectorShapeLine(ss) {
    var first = ss.blocks.find(function (b) { return b.type === 'para' || b.type === 'confidence'; });
    if (!first || !/^Shape:/.test(first.text)) return null;
    return first;
  }

  function buildSectorTab(sec) {
    var html = '<div class="sector-tabs no-print" role="tablist">';
    sec.subsections.forEach(function (ss, i) {
      html += '<button type="button" class="sector-tab" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-sector="' + ss.number + '">' + ss.number + ' ' + ss.title + '</button>';
    });
    html += '</div>';
    sec.subsections.forEach(function (ss, i) {
      var num = parseFloat(ss.number.split('.')[1]);
      html += '<div class="sector-pane" data-sector-pane="' + ss.number + '"' + (i === 0 ? '' : ' hidden') + '>';
      html += '<h3 class="sub-h"><span class="n">' + ss.number + '</span>' + ss.title + '</h3>';
      var shape = sectorShapeLine(ss);
      var rest = renderBlocks(ss.blocks.filter(function (b) { return b !== shape; }));
      if (shape) html += '<div class="sector-shape"><span class="lbl">Shape</span>' + shape.html + '</div>';
      html += sectorGrid(num);
      html += rest.join('');
      html += '</div>';
    });
    return html;
  }

  /* ---------- vehicle directory filters ---------- */

  function directoryFilterBar() {
    var bodies = ['DOW', 'IC', 'ENERGY', 'TRADE', 'ALLIED', 'CIVIL'];
    var heats = ['HOT', 'OPEN', 'WATCH'];
    var opens = ['HIGH', 'MED', 'LOW'];
    var opt = function (v) { return '<option value="' + v + '">' + v + '</option>'; };
    return '<div class="filters no-print">' +
      '<span><label class="fl" for="f-body">Body</label><select id="f-body"><option value="">All</option>' + bodies.map(opt).join('') + '</select></span>' +
      '<span><label class="fl" for="f-heat">Heat</label><select id="f-heat"><option value="">All</option>' + heats.map(opt).join('') + '</select></span>' +
      '<span><label class="fl" for="f-open">Openness</label><select id="f-open"><option value="">All</option>' + opens.map(opt).join('') + '</select></span>' +
      '</div>';
  }

  function applyDirectoryFilters() {
    var body = $('#f-body') ? $('#f-body').value : '';
    var heat = $('#f-heat') ? $('#f-heat').value : '';
    var open = $('#f-open') ? $('#f-open').value : '';
    $$('.vehicle-card').forEach(function (card) {
      var ok = (!body || card.dataset.body.split(' ').indexOf(body) >= 0) &&
        (!heat || card.dataset.heat === heat) &&
        (!open || card.dataset.open === open);
      card.classList.toggle('is-hidden', !ok);
    });
  }

  /* ---------- generic block rendering ---------- */

  function renderBlocks(blocks) {
    var out = [];
    blocks.forEach(function (b) {
      if (b.type === 'para') out.push('<p>' + b.html + '</p>');
      else if (b.type === 'confidence') out.push('<p class="conf-line">' + b.html + '</p>');
      else if (b.type === 'h4') out.push('<h4 class="sub-h4">' + b.headingHtml + '</h4>');
      else if (b.type === 'vehicle') out.push(renderVehicle(b));
      else if (b.type === 'callout') out.push(renderCallout(b));
      else if (b.type === 'list') {
        out.push('<ul>' + b.items.map(function (it) { return '<li>' + it.html + '</li>'; }).join('') + '</ul>');
      } else if (b.type === 'table') out.push(renderTable(b));
    });
    return out;
  }

  // Coordination and policy. The four bodies now carry real substance, so
  // each renders as its own collapsible card (name visible, detail on
  // demand) rather than a wall of paragraphs. The framing sentence and any
  // trailing callout stay outside the cards, always visible.
  function renderCoordinationPolicy(sec) {
    var body = [];
    var seenFirstPara = false;
    sec.intro.forEach(function (blk) {
      if (blk.type === 'para' && !seenFirstPara) {
        seenFirstPara = true;
        body.push('<p>' + blk.html + '</p>');
        return;
      }
      if (blk.type === 'para') {
        var idx = blk.html.indexOf('. ');
        var name = idx >= 0 ? blk.html.slice(0, idx + 1) : blk.html;
        var rest = idx >= 0 ? blk.html.slice(idx + 2) : '';
        var cardId = 'policy-' + slug(stripTags(name));
        body.push(
          '<div class="policy-card">' +
            '<button type="button" class="policy-toggle" aria-expanded="false" aria-controls="' + cardId + '">' +
              '<span class="policy-name">' + name + '</span>' +
              '<span class="policy-caret" aria-hidden="true">+</span>' +
            '</button>' +
            '<div class="policy-body" id="' + cardId + '" hidden><p>' + rest + '</p></div>' +
          '</div>'
        );
        return;
      }
      body = body.concat(renderBlocks([blk]));
    });
    return body.join('');
  }

  function renderSection(sec, opts) {
    var body = [];
    body.push('<h2 class="sec-h"><span class="n">' + String(sec.number).padStart(2, '0') + '</span>' + sec.title + '</h2>');
    body.push('<div class="rule"></div>');

    if (sec.number === 3) {
      body.push(directoryFilterBar());
      sec.subsections.forEach(function (ss) {
        body.push('<h3 class="sub-h"><span class="n">' + ss.number + '</span>' + ss.title + '</h3>');
        body = body.concat(renderBlocks(ss.blocks));
      });
      return body.join('');
    }

    if (sec.number === 4) {
      body = body.concat(renderBlocks(sec.intro));
      body.push(buildSectorTab(sec));
      return body.join('');
    }

    if (sec.number === 5) {
      body.push(renderCoordinationPolicy(sec));
      return body.join('');
    }

    var intro = renderBlocks(sec.intro);
    if (opts && opts.afterIntro != null) intro.splice(Math.min(opts.afterIntroAt || intro.length, intro.length), 0, opts.afterIntro);
    body = body.concat(intro);
    sec.subsections.forEach(function (ss) {
      body.push('<h3 class="sub-h"><span class="n">' + ss.number + '</span>' + ss.title + '</h3>');
      body = body.concat(renderBlocks(ss.blocks));
    });
    return body.join('');
  }

  /* ---------- glossary tooltips ---------- */

  var GLOSS_ROWS = (function () {
    var sec10 = DOC.sections.find(function (s) { return s.number === 10; });
    var t = sec10.intro.find(function (b) { return b.type === 'table'; });
    if (!t) return [];
    return t.rows.map(function (r) {
      return { term: stripTags(r[0].html), def: stripTags(r[1].html), defHtml: r[1].html };
    });
  })();

  function reFor(alias) {
    var esc = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(?<![A-Za-z0-9])' + esc + '(?![A-Za-z0-9])');
  }
  var SKIP = { CODE: 1, BUTTON: 1, SELECT: 1, OPTION: 1, INPUT: 1, LABEL: 1, DT: 1, DD: 1, H4: 1, TH: 1 };

  function wireTerms(panel) {
    var pending = GLOSS_ROWS.map(function (g) { return { term: g.term, def: g.def, re: reFor(g.term) }; });
    var walker = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        for (var el = n.parentElement; el && el !== panel; el = el.parentElement) {
          if (el.classList.contains('chip') || el.classList.contains('term') ||
            el.classList.contains('runhead') || el.classList.contains('runfoot') ||
            el.classList.contains('standfirst') || el.classList.contains('veh-tagline') ||
            el.classList.contains('gloss-group') || SKIP[el.tagName]) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      if (!pending.length) return;
      for (var i = 0; i < pending.length; i++) {
        var p = pending[i];
        var m = p.re.exec(node.nodeValue);
        if (!m) continue;
        var after = node.splitText(m.index);
        after.splitText(m[0].length);
        var span = document.createElement('span');
        span.className = 'term';
        span.tabIndex = 0;
        span.appendChild(document.createTextNode(m[0]));
        var tip = document.createElement('span');
        tip.className = 'tip';
        tip.setAttribute('role', 'tooltip');
        tip.textContent = p.def;
        span.appendChild(tip);
        after.parentNode.replaceChild(span, after);
        pending.splice(i, 1);
        i--;
        break;
      }
    });
  }

  function renderGlossarySection(sec) {
    var body = [];
    body.push('<h2 class="sec-h"><span class="n">' + String(sec.number).padStart(2, '0') + '</span>' + sec.title + '</h2>');
    body.push('<div class="rule"></div>');
    body.push('<div class="gloss-cards"><div class="gloss-group"><dl>' +
      GLOSS_ROWS.map(function (g) { return '<dt>' + g.term + '</dt><dd>' + g.defHtml + '</dd>'; }).join('') +
      '</dl></div></div>');
    return body.join('');
  }

  /* ---------- build ---------- */

  function runningStrip() {
    return '<span>' + DOC.title + '</span><span class="sep">·</span><span>Rosc</span><span class="sep">·</span><span>' + DOC.date + '</span><span class="flag">Internal</span>';
  }

  function build() {
    $('#doc-head').innerHTML = '<span class="badge">Rosc Internal</span>' +
      '<h1>' + DOC.title + '</h1>' +
      '<p class="sub"><span>' + DOC.subtitle + '</span><span>Rosc</span><span>' + DOC.date + '</span></p>';

    var tabHtml = '', secHtml = '';

    TABS.forEach(function (t, ti) {
      var mark = t.star ? '<span class="star">★</span>' : t.sq ? '<span class="sq">■</span>' : '';
      tabHtml += '<button class="tab" role="tab" id="tab-' + t.id + '" aria-controls="sec-' + t.id + '" aria-selected="false" data-id="' + t.id + '">' +
        '<span class="num">' + String(ti + 1).padStart(2, '0') + '</span>' + mark + t.label + '</button>';

      var body = '<div class="runhead">' + runningStrip() + '</div>';
      t.sections.forEach(function (num) {
        var sec = DOC.sections.find(function (s) { return s.number === num; });
        var opts = null;
        if (num === 1) opts = { afterIntro: buildMatrixVisual(), afterIntroAt: 1 };
        body += '<section class="src-section">' + (num === 10 ? renderGlossarySection(sec) : renderSection(sec, opts)) + '</section>';
      });
      body += '<div class="runfoot"><span>For internal Rosc use only</span><span class="sep">·</span><span>Figures current to ' + DOC.date + ', re-verify before any outreach</span></div>';

      secHtml += '<section class="section" id="sec-' + t.id + '" role="tabpanel" aria-labelledby="tab-' + t.id + '"><div class="panel">' + body + '</div></section>';
    });

    $('#tabs').innerHTML = tabHtml;
    $('#sections').innerHTML = secHtml;

    $$('.section').forEach(wireTerms);

    $('#tabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (b) select(b.dataset.id);
    });

    document.addEventListener('click', function (e) {
      var st = e.target.closest('.sector-tab');
      if (st) {
        var pane = st.closest('.section');
        $$('.sector-tab', pane).forEach(function (x) { x.setAttribute('aria-selected', String(x === st)); });
        $$('.sector-pane', pane).forEach(function (p) { p.hidden = p.dataset.sectorPane !== st.dataset.sector; });
        return;
      }
      var vt = e.target.closest('.veh-toggle');
      if (vt) { toggleCollapsible(vt); return; }
      var pt = e.target.closest('.policy-toggle');
      if (pt) { toggleCollapsible(pt); return; }
      var jump = e.target.closest('[data-jump]');
      if (jump && jump.dataset.jump) {
        select('directory');
        var target = document.getElementById(jump.dataset.jump);
        if (target) {
          $('#f-body').value = ''; $('#f-heat').value = ''; $('#f-open').value = '';
          applyDirectoryFilters();
          var toggle = $('.veh-toggle', target);
          if (toggle) toggleCollapsible(toggle, true);
          setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30);
        }
      }
    });

    ['#f-body', '#f-heat', '#f-open'].forEach(function () {});
    document.addEventListener('change', function (e) {
      if (e.target.id === 'f-body' || e.target.id === 'f-heat' || e.target.id === 'f-open') applyDirectoryFilters();
    });

    window.addEventListener('beforeprint', function () {
      $$('.sector-pane[hidden]').forEach(function (p) { p.hidden = false; });
    });

    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest('[data-tip]');
      if (t) showVizTip(t, t.getAttribute('data-tip'));
    });
    document.addEventListener('pointerout', function (e) {
      var t = e.target.closest && e.target.closest('[data-tip]');
      if (t && !(e.relatedTarget && t.contains(e.relatedTarget))) hideVizTip();
    });
    document.addEventListener('focusin', function (e) {
      var t = e.target.closest && e.target.closest('[data-tip]');
      if (t) showVizTip(t, t.getAttribute('data-tip'));
    });
    document.addEventListener('focusout', function (e) {
      var t = e.target.closest && e.target.closest('[data-tip]');
      if (t) hideVizTip();
    });

    select('overview');
  }

  /* ---------- floating tooltips, for [data-tip] elements ----------
     A CSS-only hover tooltip would get clipped by .matrix-wrap's
     overflow-x: auto, so this uses a single fixed-position element
     positioned in JS instead, the same approach the ARI build used for
     its diagram nodes. */

  var vizTip = null;
  function ensureVizTip() {
    if (vizTip) return vizTip;
    vizTip = document.createElement('div');
    vizTip.className = 'viz-tip';
    vizTip.setAttribute('role', 'tooltip');
    vizTip.hidden = true;
    document.body.appendChild(vizTip);
    return vizTip;
  }
  function showVizTip(target, text) {
    if (!text) return;
    var tip = ensureVizTip();
    tip.textContent = text;
    tip.hidden = false;
    var r = target.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = r.left + r.width / 2 - tw / 2;
    var y = r.top - th - 10;
    if (y < 8) y = r.bottom + 10;
    x = Math.max(8, Math.min(x, window.innerWidth - tw - 8));
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }
  function hideVizTip() { if (vizTip) vizTip.hidden = true; }

  function toggleCollapsible(toggle, forceOpen) {
    var open = forceOpen === true ? true : toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    var body = document.getElementById(toggle.getAttribute('aria-controls'));
    if (body) body.hidden = !open;
    var caret = $('.veh-caret, .policy-caret', toggle);
    if (caret) caret.textContent = open ? '−' : '+';
  }

  function select(id) {
    $$('.tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.id === id)); });
    $$('.section').forEach(function (s) { s.classList.toggle('is-active', s.id === 'sec-' + id); });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  build();

  window.__NATSEC_BUILD_REPORT__ = function () {
    return { unmappedVehicleTokens: Object.keys(UNMAPPED_SEEN), unrecognisedCalloutLabels: Object.keys(UNRECOGNISED_LABELS) };
  };
})();
