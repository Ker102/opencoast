import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const locales = ['es', 'zh-CN', 'fr', 'ja', 'de', 'pt-BR'];
const names = ['Español', '简体中文', 'Français', '日本語', 'Deutsch', 'Português (Brasil)'];
export const sha256 = (text) => createHash('sha256').update(text.toString().replace(/\r\n/g, '\n'), 'utf8').digest('hex');
const sorted = (values) => [...values].sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const remote = (url) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url);

export function slug(heading) {
  return heading.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}_\-\s]/gu, '').replace(/ /g, '-');
}

// This scanner supports the Markdown forms used by the maintained docs, not MDX.
export function linksIn(text) {
  const links = [];
  const destination = '(?:<([^>]+)>|([^\\s)]+))';
  for (const match of text.matchAll(new RegExp('\\]\\(\\s*' + destination + '(?:\\s+["\'][^"\']*["\'])?\\s*\\)', 'g'))) {
    links.push(match[1] ?? match[2]);
  }
  const definitions = new Map();
  for (const match of text.matchAll(new RegExp('^ {0,3}\\[([^\\]]+)\\]:\\s*' + destination, 'gm'))) {
    definitions.set(match[1].toLowerCase(), match[2] ?? match[3]);
  }
  for (const match of text.matchAll(/\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) {
    const key = (match[2] || match[1]).toLowerCase();
    links.push(definitions.get(key) ?? `missing-reference:${key}`);
  }
  // Include definitions themselves, including shortcut reference destinations.
  links.push(...definitions.values());
  for (const match of text.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) links.push(match[1]);
  for (const match of text.matchAll(/<((?:https?:\/\/|mailto:)[^>]+)>/g)) links.push(match[1]);
  return links;
}

export function document(text) {
  const errors = [];
  text = text.replace(/\r\n/g, '\n');
  const noticeCount = (text.match(/<!-- translation-notice -->/g) ?? []).length;
  const notices = text.match(/<!-- translation-notice -->[\s\S]*?<!-- \/translation-notice -->/g) ?? [];
  if (noticeCount !== notices.length) errors.push('unclosed translation notice');
  text = text.replace(/<!-- translation-notice -->[\s\S]*?<!-- \/translation-notice -->/g, '');
  text = text.replace(/^\[English\]\([^\n]+\) .*$/gm, '');
  const fences = [];
  const prose = [];
  let fence;
  for (const line of text.split('\n')) {
    if (fence) {
      fence.lines.push(line);
      const close = new RegExp('^ {0,3}' + fence.char + '{' + fence.length + ',}\\s*$');
      if (close.test(line)) {
        fences.push(fence.lines.join('\n'));
        fence = undefined;
      }
      prose.push('');
    } else {
      const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (open) {
        fence = { char: open[1][0], length: open[1].length, lines: [line] };
        prose.push('');
      } else prose.push(line);
    }
  }
  if (fence) errors.push('unclosed code fence');
  const body = prose.join('\n');
  const headings = [...body.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((match) => ({ level: match[1].length, text: match[2] }));
  const anchors = new Set([...body.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)].map((match) => match[1]));
  const seen = new Map();
  for (const heading of headings) {
    const base = slug(heading.text);
    const count = seen.get(base) ?? 0;
    anchors.add(count ? `${base}-${count}` : base);
    seen.set(base, count + 1);
  }
  const inlineCode = [...body.matchAll(/(`+)([^`]*?)\1/g)].map((match) => match[2]);
  const links = linksIn(body);
  const plain = body.replace(/(`+)([^`]*?)\1/g, '').replace(/<[^>]*>/g, '').replace(/\]\([^)]*\)/g, ']');
  return {
    errors, fences, headings, anchors, inlineCode, links,
    numbers: plain.match(/\d+(?:\.\d+)*\+?/g) ?? [],
    tableRows: prose.filter((line) => /^\s*\|/.test(line)).length,
    listItems: prose.filter((line) => /^\s*(?:[-*+] |\d+\. )/.test(line)).length,
    paragraphs: body.replace(/<a\b[^>]*><\/a>\s*/g, '').trim().split(/\n\s*\n/).filter(Boolean).length,
  };
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function linkTarget(root, from, url) {
  const [rawFile, rawFragment] = url.split('#');
  const file = decodeURIComponent(rawFile.split('?')[0]);
  const target = path.resolve(path.dirname(path.join(root, from)), file || path.basename(from));
  if (!inside(root, target)) throw new Error(`link escapes repository: ${url}`);
  return { target, fragment: rawFragment ? decodeURIComponent(rawFragment) : undefined };
}

function canonicalLinks(root, from, links) {
  return sorted(links.map((url) => {
    if (remote(url)) return url;
    const { target, fragment } = linkTarget(root, from, url);
    let relative = path.relative(root, target).split(path.sep).join('/');
    relative = relative.replace(/^docs\/i18n\/[^/]+\//, '');
    return relative + (fragment ? `#${fragment}` : '');
  }));
}

export function compare(root, sourcePath, mirrorPath, source, mirror) {
  const errors = mirror.errors.map((error) => `${mirrorPath}: ${error}`);
  const check = (condition, message) => { if (!condition) errors.push(`${mirrorPath}: ${message}`); };
  check(same(source.fences, mirror.fences), 'fenced code differs from source');
  check(same(sorted(source.inlineCode), sorted(mirror.inlineCode)), 'inline code differs from source');
  check(same(source.headings.map((h) => h.level), mirror.headings.map((h) => h.level)), 'heading structure differs from source');
  check([...source.anchors].every((anchor) => mirror.anchors.has(anchor)), 'source heading anchor missing');
  check(source.tableRows === mirror.tableRows, 'table row count differs from source');
  check(source.listItems === mirror.listItems, 'list item count differs from source');
  check(source.paragraphs === mirror.paragraphs, 'paragraph/block count differs from source');
  check(same(sorted(source.numbers), sorted(mirror.numbers)), 'numeric literals differ from source');
  try {
    check(same(canonicalLinks(root, sourcePath, source.links), canonicalLinks(root, mirrorPath, mirror.links)), 'link destinations differ from source');
  } catch (error) { errors.push(`${mirrorPath}: ${error.message}`); }
  return errors;
}

function localLinkErrors(root, from, links) {
  const errors = [];
  for (const url of links) {
    if (url.startsWith('missing-reference:')) {
      errors.push(`${from}: ${url}`);
      continue;
    }
    if (remote(url)) continue;
    try {
      const { target, fragment } = linkTarget(root, from, url);
      if (!existsSync(target)) errors.push(`${from}: missing link target ${url}`);
      else if (fragment && /\.md$/i.test(target) && !document(readFileSync(target, 'utf8')).anchors.has(fragment)) {
        errors.push(`${from}: missing fragment ${url}`);
      }
    } catch (error) { errors.push(`${from}: ${error.message}`); }
  }
  return errors;
}

function switcherErrors(root, from, text) {
  const bars = text.replace(/\r\n/g, '\n').split('\n').filter((line) => line.startsWith('[English]('));
  if (bars.length !== 1) return [`${from}: expected one language switcher`];
  const expectedPaths = ['README.md', ...locales.map((locale) => `docs/i18n/${locale}/README.md`)];
  const expected = expectedPaths.map((file) => path.relative(path.dirname(path.join(root, from)), path.join(root, file)).split(path.sep).join('/'));
  const labels = ['English', ...names];
  const matches = [...bars[0].matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
  return same(matches.map((m) => [m[1], m[2]]), labels.map((label, index) => [label, expected[index]]))
    ? localLinkErrors(root, from, linksIn(bars[0])) : [`${from}: incorrect language switcher labels or paths`];
}

export function audit(root) {
  const errors = [];
  const counts = Object.fromEntries(locales.map((locale) => [locale, 0]));
  const manifest = JSON.parse(readFileSync(path.join(root, 'docs/i18n/manifest.json'), 'utf8'));
  if (manifest.schemaVersion !== 1 || !same(manifest.locales, locales) || manifest.sourceLanguage !== 'en') errors.push('invalid manifest schema/locales');
  const sourcePaths = manifest.sources.map((source) => source.path);
  if (new Set(sourcePaths).size !== sourcePaths.length || !sourcePaths.length) errors.push('empty or duplicate source inventory');
  const inventoried = new Set();
  const pending = manifest.pending ?? [];
  const read = (relative, expected, kind) => {
    if (path.isAbsolute(relative) || !inside(root, path.resolve(root, relative))) {
      errors.push(`${relative}: path escapes repository`);
      return;
    }
    if (!existsSync(path.join(root, relative))) { errors.push(`${relative}: missing ${kind}`); return; }
    const bytes = readFileSync(path.join(root, relative));
    if (!/^[a-f\d]{64}$/.test(expected ?? '') || sha256(bytes) !== expected) errors.push(`${relative}: ${kind} hash drift`);
    return bytes.toString('utf8');
  };
  for (const source of manifest.sources) {
    if (Object.keys(source.mirrors ?? {}).some((locale) => !locales.includes(locale))) errors.push(`${source.path}: unknown mirror locale`);
    const sourceText = read(source.path, source.sha256, 'source');
    if (sourceText === undefined) continue;
    const original = document(sourceText);
    errors.push(...original.errors.map((error) => `${source.path}: ${error}`));
    if (source.path === 'README.md') errors.push(...switcherErrors(root, source.path, sourceText));
    for (const locale of locales) {
      const mirror = source.mirrors?.[locale];
      const expectedPath = `docs/i18n/${locale}/${source.path}`;
      if (!mirror) {
        errors.push(`${expectedPath}: incomplete mirror${pending.some((p) => p.source === source.path && p.locale === locale) ? ' (declared pending)' : ' (not declared pending)'}`);
        continue;
      }
      if (pending.some((p) => p.source === source.path && p.locale === locale)) errors.push(`${expectedPath}: both completed and pending`);
      if (mirror.path !== expectedPath || mirror.status !== 'complete') { errors.push(`${expectedPath}: invalid completed entry`); continue; }
      inventoried.add(mirror.path);
      const mirrorText = read(mirror.path, mirror.sha256, 'mirror');
      if (mirrorText === undefined) continue;
      const translated = document(mirrorText);
      errors.push(...compare(root, source.path, mirror.path, original, translated));
      errors.push(...localLinkErrors(root, mirror.path, translated.links));
      for (const url of translated.links) {
        if (remote(url)) continue;
        try {
          const { target } = linkTarget(root, mirror.path, url);
          const relative = path.relative(root, target).split(path.sep).join('/');
          const localized = relative.match(/^docs\/i18n\/([^/]+)\/(.+)$/);
          if (sourcePaths.includes(relative) || (localized && sourcePaths.includes(localized[2]) && localized[1] !== locale)) {
            errors.push(`${mirror.path}: maintained document link is not in ${locale}: ${url}`);
          }
        } catch { /* Path errors are already reported by localLinkErrors. */ }
      }
      if (source.path === 'README.md') errors.push(...switcherErrors(root, mirror.path, mirrorText));
      counts[locale]++;
    }
  }
  for (const entry of pending) {
    if (!sourcePaths.includes(entry.source) || !locales.includes(entry.locale) || !entry.reason) errors.push('invalid pending entry');
  }
  const scan = (directory) => {
    if (!existsSync(directory)) return;
    for (const name of readdirSync(directory)) {
      const absolute = path.join(directory, name);
      if (statSync(absolute).isDirectory()) scan(absolute);
      else if (/\.md$/i.test(name)) {
        const relative = path.relative(root, absolute).split(path.sep).join('/');
        if (!inventoried.has(relative)) errors.push(`${relative}: unlisted mirror`);
      }
    }
  };
  for (const locale of locales) scan(path.join(root, 'docs/i18n', locale));
  for (const relative of ['docs/i18n/README.md', 'docs/i18n/implementation-plan.md']) {
    if (existsSync(path.join(root, relative))) errors.push(...localLinkErrors(root, relative, document(readFileSync(path.join(root, relative), 'utf8')).links));
  }
  return { errors, counts, sourceCount: sourcePaths.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const result = audit(root);
    for (const [locale, count] of Object.entries(result.counts)) console.log(`${locale}: ${count}/${result.sourceCount} mirrors present`);
    if (result.errors.length) {
      for (const error of result.errors) console.error(error);
      process.exitCode = 1;
    } else console.log('PASS: hashes, coverage, links/fragments, fences, code, numbers and structure');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
