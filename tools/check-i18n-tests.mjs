// Kept outside Vitest's *.test.* discovery; these use Node's test runner.
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { audit, compare, document, linksIn, locales, sha256 } from './check-i18n.mjs';

test('text hashes are independent of checkout line endings but detect real edits', () => {
  assert.equal(sha256(Buffer.from('line\r\nnext\r\n')), sha256('line\nnext\n'));
  assert.notEqual(sha256('line\nnext\n'), sha256('line\nchanged\n'));
});

test('fences preserve exact language, commands and comments, including CRLF normalization', () => {
  const source = document('# Test\n\n```sh\n# keep this comment\nnpm ci\n```\n');
  assert.deepEqual(document('# Prueba\r\n\r\n```sh\r\n# keep this comment\r\nnpm ci\r\n```\r\n').fences, source.fences);
  assert.deepEqual(document('~~~sh\nnpm ci\n').errors, ['unclosed code fence']);
  const errors = compare('.', 'docs/example.md', 'docs/i18n/es/docs/example.md', source, document('# Prueba\n\n```sh\nnpm install\n```\n'));
  assert.ok(errors.some((error) => error.includes('fenced code differs')));
});

test('inline identifiers, numbers, omitted paragraphs and changed URLs are rejected', () => {
  const source = document('# Test\n\nNode.js 24+ and `WEB_ORIGIN`.\n\n[Source](https://example.org/a).\n');
  const mirror = document('# Prueba\n\nNode.js 25+ y `WEB_URL`.\n');
  const errors = compare('.', 'example.md', 'docs/i18n/es/example.md', source, mirror).join('\n');
  for (const message of ['inline code differs', 'numeric literals differ', 'paragraph/block count differs', 'link destinations differ']) assert.ok(errors.includes(message));
});

test('local destinations normalize to sources while asset links and English fragments are retained', () => {
  const source = document('# Guide\n\n[Guide](docs/development.md#checks) [Asset](web/icon.svg)\n');
  const mirror = document('<a id="guide"></a>\n\n# Guía\n\n[Guía](docs/development.md#checks) [Imagen](../../../web/icon.svg)\n');
  assert.deepEqual(compare('.', 'README.md', 'docs/i18n/es/README.md', source, mirror), []);
  assert.ok(mirror.anchors.has('guide'));
  assert.ok(compare('.', 'README.md', 'docs/i18n/es/README.md', source, document('# Guía\n\n[Guía](docs/development.md#checks) [Imagen](../../../web/icon.svg)\n')).some((error) => error.includes('source heading anchor missing')));
});

test('inline, reference, autolink and HTML link syntax is recognized', () => {
  const links = linksIn('[a](one.md#x) ![img](<a b.png>) [b][ref]\n[ref]: two.md\n<https://example.org> <img src="icon.svg">');
  for (const link of ['one.md#x', 'a b.png', 'two.md', 'https://example.org', 'icon.svg']) assert.ok(links.includes(link));
  assert.ok(linksIn('[x][absent]').includes('missing-reference:absent'));
});

test('inventory detects drift, missing mirrors, unlisted files, broken fragments and escaped links', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'opencoast-i18n-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (file, text) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), text); };
  const sourceText = '# Guide\n\n[Section](#guide)\n';
  const mirrorText = '<a id="guide"></a>\n\n# Guía\n\n[Sección](#guide)\n';
  put('guide.md', sourceText);
  const source = { path: 'guide.md', sha256: sha256(sourceText), mirrors: {} };
  for (const locale of locales) {
    const file = `docs/i18n/${locale}/guide.md`;
    put(file, mirrorText);
    source.mirrors[locale] = { path: file, sha256: sha256(mirrorText), status: 'complete' };
  }
  const manifest = { schemaVersion: 1, sourceLanguage: 'en', locales, sources: [source], pending: [] };
  const save = () => put('docs/i18n/manifest.json', JSON.stringify(manifest));
  save();
  assert.deepEqual(audit(root).errors, []);
  put('guide.md', sourceText.replace(/\n/g, '\r\n'));
  assert.deepEqual(audit(root).errors, []);
  put('guide.md', sourceText + '\nNew source paragraph.\n');
  assert.ok(audit(root).errors.some((error) => error.includes('source hash drift')));
  put('guide.md', sourceText);
  put(source.mirrors.es.path, mirrorText + '\n[Bad](#absent) [Escape](../../../../outside.md)\n');
  let errors = audit(root).errors.join('\n');
  for (const message of ['mirror hash drift', 'missing fragment', 'link escapes repository']) assert.ok(errors.includes(message));
  put(source.mirrors.es.path, mirrorText);
  rmSync(path.join(root, source.mirrors.fr.path));
  put('docs/i18n/es/extra.md', '# Unlisted\n');
  errors = audit(root).errors.join('\n');
  assert.ok(errors.includes('missing mirror'));
  assert.ok(errors.includes('unlisted mirror'));
  delete source.mirrors.fr;
  manifest.pending.push({ source: 'guide.md', locale: 'fr', reason: 'not translated' });
  save();
  assert.ok(audit(root).errors.some((error) => error.includes('declared pending')));
  assert.equal(readFileSync(path.join(root, 'guide.md'), 'utf8'), sourceText);
});

test('same-locale links are required and language switchers reject changed labels or targets', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'opencoast-i18n-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (file, text) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), text); };
  const names = ['English', 'Español', '简体中文', 'Français', '日本語', 'Deutsch', 'Português (Brasil)'];
  const paths = ['README.md', ...locales.map((locale) => `docs/i18n/${locale}/README.md`)];
  const bar = (from) => paths.map((target, index) => `[${names[index]}](${path.relative(path.dirname(path.join(root, from)), path.join(root, target)).split(path.sep).join('/')})`).join(' · ');
  const text = '# Guide\n\n' + bar('README.md') + '\n\n[Guide](guide.md#guide)\n';
  put('README.md', text);
  put('guide.md', '# Guide\n');
  const sources = [
    { path: 'README.md', sha256: sha256(text), mirrors: {} },
    { path: 'guide.md', sha256: sha256('# Guide\n'), mirrors: {} },
  ];
  for (const locale of locales) {
    for (const source of sources) {
      const file = `docs/i18n/${locale}/${source.path}`;
      const content = '<a id="guide"></a>\n\n# Guía\n' + (source.path === 'README.md' ? '\n' + bar(file) + '\n\n[Guía](guide.md#guide)\n' : '');
      put(file, content);
      source.mirrors[locale] = { path: file, sha256: sha256(content), status: 'complete' };
    }
  }
  const manifest = { schemaVersion: 1, sourceLanguage: 'en', locales, sources, pending: [] };
  put('docs/i18n/manifest.json', JSON.stringify(manifest));
  assert.deepEqual(audit(root).errors, []);
  const file = sources[0].mirrors.es.path;
  const original = readFileSync(path.join(root, file), 'utf8');
  put(file, original.replace('[Español]', '[Spanish]').replace('[Guía](guide.md#guide)', '[Guía](../fr/guide.md#guide)'));
  let errors = audit(root).errors.join('\n');
  assert.ok(errors.includes('incorrect language switcher'));
  assert.ok(errors.includes('maintained document link is not in es'));
  put(file, original.replace('[Guía](guide.md#guide)', '[Guía](../../../guide.md#guide)'));
  assert.ok(audit(root).errors.some((error) => error.includes('maintained document link is not in es')));
});
