const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.OPENCOAST_PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://localhost:5188';
const out = path.resolve(__dirname, '../artifacts/discovery-qa');
fs.mkdirSync(out, { recursive: true });
async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const report = [];
  try {
    for (const width of [1280, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 844 } });
      const page = await context.newPage();
      for (const route of ['/about', '/how-it-works', '/evidence']) {
        const response = await page.goto(base + route);
        if (response.status() !== 200) throw new Error(route + ': HTTP ' + response.status());
        const result = await page.evaluate(() => ({ title: document.title, heading: document.querySelector('h1')?.textContent, canonical: document.querySelector('link[rel=canonical]')?.href, overflow: document.documentElement.scrollWidth > innerWidth, links: [...document.querySelectorAll('a')].filter(a => a.getBoundingClientRect().right > innerWidth + 1).length, schema: JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'].length }));
        if (result.overflow || result.links || !result.canonical.startsWith('https://opencoast.kaelux.dev') || !result.heading) throw new Error('Layout or metadata failed: ' + JSON.stringify(result));
        report.push({ width, route, ...result });
        if (route === '/about') await page.screenshot({ path: path.join(out, `about-${width}.png`), fullPage: true });
      }
      if (base.startsWith('https:')) {
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(base + '/');
        await page.locator('.maplibregl-canvas').waitFor({ timeout: 20000 });
        if (width < 650) await page.getByRole('button', { name: 'Open menu', exact: true }).click();
        await page.locator('.project-links a').first().waitFor();
        await page.screenshot({ path: path.join(out, `map-${width}.png`) });
        if (errors.length) throw new Error('Map page error: ' + errors.join('; '));
        report.push({ width, route: '/', mapMounted: true, discoveryLinks: await page.locator('.project-links a').count(), pageErrors: errors.length });
      }
      await context.close();
    }
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(base + '/');
    if (!(await page.locator('h1').textContent()).includes('Know your coast')) throw new Error('No-JavaScript homepage is missing');
    report.push({ noJavaScript: true, homepageReadable: true });
    await context.close();
    fs.writeFileSync(path.join(out, 'browser-report.json'), JSON.stringify({ base, checks: report }, null, 2));
    console.log(JSON.stringify({ pagesChecked: 6, desktopMobilePassed: true, noJavaScriptPassed: true, screenshots: out }));
  } finally { await browser.close(); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
