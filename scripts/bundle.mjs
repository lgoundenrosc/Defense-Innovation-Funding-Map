// Inlines data, styles, and script into one self-contained page.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');

const out = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<title>National Security Government Capital — Rosc</title>',
  '<style>\n' + read('assets/styles.css') + '\n</style>',
  '</head>',
  '<body>',
  '<div class="wrap">',
  '  <header class="doc-header" id="doc-head"></header>',
  '  <nav class="tabs no-print" id="tabs" role="tablist" aria-label="Document sections"></nav>',
  '  <main id="sections"></main>',
  '</div>',
  '<script>\n' + read('data/natsec.js') + '\n</script>',
  '<script>\n' + read('assets/app.js') + '\n</script>',
  '</body>',
  '</html>'
].join('\n');

writeFileSync(resolve(ROOT, 'dist/natsec-capital-map.html'), out);
console.log('dist/natsec-capital-map.html', (out.length / 1024).toFixed(1) + ' KB');
