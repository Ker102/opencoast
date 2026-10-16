'use strict';
const fs = require('node:fs'), path = require('node:path');
const { spawnSync } = require('node:child_process');
const { chromium } = require(process.env.OPENCOAST_PLAYWRIGHT_MODULE || 'playwright');
const out = path.resolve(__dirname, '../../artifacts/opencoast-motion/2026-10-11/v4');
const {duration}=require('./scenes-v4.cjs');
const clips = ['draft-a-workflow', 'draft-b-map'];
async function main() {
  const report = { checkedAt: new Date().toISOString(), clips: [], preview: [] };
  for (const name of clips) {
    const file = path.join(out, name + '.mp4');
    const probe = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], { encoding: 'utf8', windowsHide: true });
    if (probe.status !== 0) throw new Error(probe.stderr);
    const info = JSON.parse(probe.stdout), video = info.streams.find(s => s.codec_type === 'video');
    if (video.width !== 1280 || video.height !== 720 || video.avg_frame_rate !== '60/1' || Number(video.nb_frames) !== duration*60 || Number(info.format.duration) !== duration) throw new Error('Unexpected video format: ' + name);
    const decode = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'null', '-'], { encoding: 'utf8', windowsHide: true });
    if (decode.status !== 0 || decode.stderr.trim()) throw new Error(decode.stderr || 'Decode failed');
    report.clips.push({ name, width: video.width, height: video.height, fps: 60, frames: duration*60, duration, fullDecode: 'passed', bytes: fs.statSync(file).size });
  }
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(process.env.OPENCOAST_PREVIEW_URL || 'http://127.0.0.1:5190/', { waitUntil: 'networkidle' });
    for (let i = 0; i < clips.length; i++) {
      const result = await page.locator('video').nth(i).evaluate(async v => {
        if (v.readyState < 1) await new Promise((resolve, reject) => { v.addEventListener('loadedmetadata', resolve, { once: true }); v.addEventListener('error', reject, { once: true }); });
        v.muted = true;
        const sampled = [];
        for (const t of [8,18,31,44,57,76,91]) {
          await new Promise(resolve => { v.addEventListener('seeked', resolve, { once: true }); v.currentTime = t; });
          sampled.push({ time: v.currentTime, readyState: v.readyState });
        }
        await v.play();
        const start = v.currentTime;
        await new Promise(resolve => setTimeout(resolve, 300));
        const advancing = v.currentTime > start;
        v.pause();
        return { duration: v.duration, width: v.videoWidth, height: v.videoHeight, advancing, sampled, error: v.error?.message || null };
      });
      if (!result.advancing || result.error || result.sampled.some(s => s.readyState < 2)) throw new Error('Browser playback failed: ' + clips[i]);
      report.clips[i].browser = result;
    }
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, squarePanels: [...document.querySelectorAll('video')].every(v => getComputedStyle(v).borderRadius === '0px') }));
      if (layout.scrollWidth > layout.width || !layout.squarePanels) throw new Error('Preview layout failed');
      report.preview.push(layout);
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(out, 'playback-report.json'), JSON.stringify(report, null, 2));
  console.log('Both videos passed full decoding, browser playback and desktop/mobile preview checks.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
