'use strict';
const fs = require('node:fs'), path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas, W, H, warnings, initAssets, editorial, visual, social, duration, chapters } = require('./scenes-v4.cjs');
const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'artifacts/opencoast-motion/2026-10-11/v4');
const clips = [{ name: 'draft-a-workflow', render: editorial }, { name: 'draft-b-map', render: visual }];
const fps = 60;
fs.mkdirSync(out, { recursive: true });
function stills() {
  const contact = createCanvas(1280, 2520), ctx = contact.getContext('2d');
  clips.forEach((clip, i) => {
    [8, 18, 31, 44, 57, 76, 91].forEach((t, j) => {
      const canvas = createCanvas(W, H);
      clip.render(canvas, t); fs.writeFileSync(path.join(out, `${clip.name}-${t}s.png`), canvas.encodeSync('png'));
      ctx.drawImage(canvas, i * 640, j * 360, 640, 360);
    });
  });
  fs.writeFileSync(path.join(out, 'contact-sheet.png'), contact.encodeSync('png'));
  if (warnings.size) throw new Error([...warnings].join('\n'));
  console.log('Rendered fourteen chapter frames and contact sheet.');
}
async function encode(clip) {
  const file = path.join(out, clip.name + '.mp4');
  const child = spawn(process.env.OPENCOAST_FFMPEG || 'ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${W}x${H}`, '-framerate', String(fps), '-i', 'pipe:0', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p', '-threads', '4', '-movflags', '+faststart', '-map_metadata', '-1', file], { stdio: ['pipe', 'ignore', 'pipe'], windowsHide: true });
  let errors = '', failure;
  child.stderr.on('data', b => { errors = (errors + b.toString()).slice(-5000); });
  child.stdin.on('error', e => { failure = e; });
  const finished = new Promise((resolve, reject) => { child.on('error', reject); child.on('close', code => code === 0 ? resolve() : reject(new Error(errors || `FFmpeg exit ${code}`))); });
  finished.catch(() => {});
  const canvas = createCanvas(W, H); let lastReport = Date.now();
  for (let frame = 0; frame < duration * fps; frame++) {
    if (failure) throw failure;
    clip.render(canvas, frame / fps);
    if (!child.stdin.write(canvas.data())) await once(child.stdin, 'drain');
    if (Date.now() - lastReport > 8000) { console.log(clip.name + ' ' + Math.round(frame / (duration * fps) * 100) + '%'); lastReport = Date.now(); }
  }
  child.stdin.end(); await finished;
  if (warnings.size) throw new Error([...warnings].join('\n'));
  console.log('Encoded ' + file);
}
async function main() {
  await initAssets();
  const command = process.argv[2];
  if (command === 'social') { const canvas = createCanvas(1200, 630); social(canvas); fs.writeFileSync(path.join(root, 'web/public/social-card.png'), canvas.encodeSync('png')); }
  else if (command === 'stills') stills();
  else if (command === 'video' || command === 'video-b') { stills(); for (const clip of command === 'video-b' ? clips.slice(1) : clips) await encode(clip); fs.writeFileSync(path.join(out, 'timeline.json'), JSON.stringify({ revision: 4, width: W, height: H, fps, durationEach: duration, audio: false, clips: clips.map(c => c.name), chapters: chapters.map(({start,end,short})=>({start,end,title:short})), goals: ['Understand coastal access', 'Contribute evidence'], design: 'Status colors, pale high-contrast legends, white cursor with black outline. Square components and curved paths.', illustration: 'Invented geography and synthetic records, not real legal claims.' }, null, 2)); }
  else throw new Error('Use stills, video or social.');
}
main().catch(e => { console.error(e.stack); process.exitCode = 1; });
