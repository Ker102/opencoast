import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const source = process.env.OPENCOAST_PHOSPHOR_DIR;
if (!source) throw new Error('Set OPENCOAST_PHOSPHOR_DIR to an installed @phosphor-icons/react directory.');
const require = createRequire(join(source, 'package.json'));
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const out = resolve('tools/motion/assets');
mkdirSync(out, { recursive: true });
for (const name of ['MapTrifold', 'FileMagnifyingGlass', 'SealCheck', 'Cursor', 'Barricade', 'MapPin', 'Tree', 'FileText']) {
  const mod = await import(pathToFileURL(join(source, 'dist/ssr', name + '.es.js')).href);
  const Icon = mod[name] || mod[name + 'Icon'];
  if (!Icon) throw new Error('Missing official icon export: ' + name);
  for (const [theme, color] of [['paper', '#0d5962'], ['ink', '#f8f7f2']]) {
    const svg = renderToStaticMarkup(React.createElement(Icon, { size: 128, color, weight: name === 'Cursor' ? 'fill' : 'duotone' }));
    writeFileSync(join(out, name + '-' + theme + '.svg'), svg);
  }
  if (name === 'Cursor') {
    const svg = renderToStaticMarkup(React.createElement(Icon, { size: 128, color: '#ffffff', weight: 'fill' }));
    writeFileSync(join(out, 'Cursor-standard.svg'), svg.replace('<path ', '<path stroke="#111111" stroke-width="13" stroke-linejoin="round" paint-order="stroke fill" '));
  }
}
writeFileSync(join(out, 'PHOSPHOR-LICENSE.txt'), readFileSync(join(source, 'LICENSE')));
writeFileSync(join(out, 'README.md'), '# Motion symbols\n\nOfficial Phosphor duotone symbols, rendered from @phosphor-icons/react. Cursor uses its fill weight. Cursor-standard.svg styles that library geometry with white fill and black stroke. Cream and teal variants match the motion palette. See PHOSPHOR-LICENSE.txt for the MIT license. These are library glyphs, not custom-drawn icons.\n');
console.log('Prepared official SVG icon assets, an outlined white cursor and their license.');
