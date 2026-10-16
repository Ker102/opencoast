'use strict';
const path = require('node:path');
const { existsSync } = require('node:fs');
const { createCanvas, GlobalFonts, loadImage } = require(process.env.OPENCOAST_CANVAS_MODULE || '@napi-rs/canvas');
const { drawMap, colors: mapColors } = require('./cartography.cjs');
const root = path.resolve(__dirname, '../..');
const fontRoot = process.env.OPENCOAST_FONT_DIR || 'C:/Windows/Fonts';
const displayFont = path.join(root, 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2');
const bodyFont = path.join(root, 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');
if (!GlobalFonts.registerFromPath(displayFont, 'Coast Display')) throw new Error('Space Grotesk font unavailable. Run the project npm install.');
if (!GlobalFonts.registerFromPath(bodyFont, 'Coast Body')) throw new Error('Manrope font unavailable. Run the project npm install.');
const mono = path.join(fontRoot, 'consola.ttf');
if (existsSync(mono)) GlobalFonts.registerFromPath(mono, 'Coast Mono');
const W = 1280, H = 720;
const P = { paper: '#f8f7f2', teal: '#0d5962', ink: '#093c44', muted: '#587378', line: '#c3d2cd', tint: '#e8efea', dark: '#093c44', darkField: '#104d55', darkMuted: '#b6ccca', darkLine: '#3b6e74', water: '#d7e7e2' };
const warnings = new Set();
const icons = {};
let logo, c;
const clamp = x => Math.min(1, Math.max(0, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const enter = (t, start, duration = 1.25) => ease((t - start) / duration);
async function initAssets() {
  logo = await loadImage(path.join(root, 'web/public/favicon.svg'));
  for (const name of ['MapTrifold', 'FileMagnifyingGlass', 'SealCheck', 'Cursor'])
    for (const theme of ['paper', 'ink']) icons[name + theme] = await loadImage(path.join(__dirname, 'assets', name + '-' + theme + '.svg'));
}
// The canvas CSS parser requires standard hundred-step weights.
function font(size, weight = 400, family = 'Coast Body') { c.font = `${Math.round(weight / 100) * 100} ${size}px "${family}", sans-serif`; }
function text(s, x, y, size = 24, color = P.ink, weight = 400, width = W - x - 48, family = 'Coast Body') {
  font(size, weight, family); c.fillStyle = color; c.textAlign = 'left'; c.textBaseline = 'top';
  if (c.measureText(s).width > width + 1) warnings.add('Text width: ' + s);
  if (y + size * 1.2 > H - 10) warnings.add('Text height: ' + s);
  c.fillText(s, x, y);
}
function rows(s, x, y, size, color, width, weight = 400, family = 'Coast Body', leading = 1.3) {
  font(size, weight, family); let count = 0;
  for (const paragraph of s.split('\n')) {
    let row = '';
    for (const word of paragraph.split(' ')) {
      const next = row ? row + ' ' + word : word;
      if (row && c.measureText(next).width > width) { text(row, x, y + count++ * size * leading, size, color, weight, width, family); row = word; } else row = next;
    }
    text(row, x, y + count++ * size * leading, size, color, weight, width, family);
  }
}
// All component rectangles have radius zero. Curves belong to routes and diagrams.
function block(x, y, w, h, fill, stroke = null, lw = 1) {
  if (fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.strokeRect(x, y, w, h); }
}
function rule(x1, y1, x2, y2, color = P.line, width = 1) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = color; c.lineWidth = width; c.stroke(); }
function dot(x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
function glyph(name, x, y, size, dark = false) { c.drawImage(icons[name + (dark ? 'ink' : 'paper')], x, y, size, size); }
function fade(t, start, end, draw) {
  const a = enter(t, start) * (1 - enter(t, end));
  if (a <= 0) return; c.save(); c.globalAlpha *= a; draw(); c.restore();
}
function reveal(t, start, draw, duration = 1.25) {
  const a = enter(t, start, duration); if (!a) return;
  c.save(); c.globalAlpha *= a; c.translate(0, 6 * (1 - a)); draw(); c.restore();
}
function base(canvas, dark, label, t) {
  c = canvas.getContext('2d'); c.clearRect(0, 0, W, H); c.fillStyle = dark ? P.dark : P.paper; c.fillRect(0, 0, W, H);
  c.drawImage(logo, 48, 28, 36, 36);
  text('OpenCoast', 96, 30, 26, dark ? P.paper : P.ink, 700, 330, 'Coast Display');
  text(label, 1005, 39, 12, dark ? P.darkMuted : P.muted, 400, 230, 'Coast Mono');
  rule(48, 91, 1232, 91, dark ? P.darkLine : P.line);
  rail(t, dark);
}
function rail(t, dark) {
  const color = dark ? P.paper : P.teal, muted = dark ? P.darkMuted : P.muted;
  rule(48, 624, 1232, 624, dark ? P.darkLine : P.line);
  text('01', 48, 644, 18, color, 400, 60, 'Coast Mono');
  text('Understand access', 91, 642, 20, t < 18 || t >= 35 ? color : muted, 600, 430);
  text('02', 656, 644, 18, color, 400, 60, 'Coast Mono');
  text('Contribute evidence', 699, 642, 20, t >= 18 ? color : muted, 600, 430);
  if (t < 18) rule(48, 624, 48 + 558 * enter(t, 0, 18), 624, color, 3);
  else if (t < 35) rule(656, 624, 656 + 576 * enter(t, 18, 17), 624, color, 3);
  else { rule(48, 624, 606, 624, color, 3); rule(656, 624, 1232, 624, color, 3); }
  text('opencoast.kaelux.dev', 48, 692, 13, muted, 400, 400, 'Coast Mono');
  text('A map with sources and human review.', 940, 692, 12, muted, 400, 294, 'Coast Mono');
}
function sampled(start, segments) {
  const points = [start]; let previous = start;
  for (const [a, b, end] of segments) {
    for (let i = 1; i <= 90; i++) {
      const u = i / 90, v = 1 - u;
      points.push([v ** 3 * previous[0] + 3 * v * v * u * a[0] + 3 * v * u * u * b[0] + u ** 3 * end[0], v ** 3 * previous[1] + 3 * v * v * u * a[1] + 3 * v * u * u * b[1] + u ** 3 * end[1]]);
    }
    previous = end;
  }
  return points;
}
function trace(points, progress, color, width = 3, dashed = false) {
  const lengths = [0]; for (let i = 1; i < points.length; i++) lengths.push(lengths.at(-1) + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const distance = lengths.at(-1) * clamp(progress); let tip = points[0];
  c.beginPath(); c.moveTo(...tip);
  for (let i = 1; i < points.length; i++) {
    if (distance >= lengths[i]) { tip = points[i]; c.lineTo(...tip); }
    else { const u = (distance - lengths[i - 1]) / (lengths[i] - lengths[i - 1]); tip = [points[i - 1][0] + u * (points[i][0] - points[i - 1][0]), points[i - 1][1] + u * (points[i][1] - points[i - 1][1])]; c.lineTo(...tip); break; }
  }
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.setLineDash(dashed ? [9, 8] : []); c.stroke(); c.setLineDash([]);
  return tip;
}
function curve(start, segments, progress, color, width = 3) { return trace(sampled(start, segments), progress, color, width); }
function label(s, x, y, width, dark = false) {
  block(x, y, width, 37, P.paper, mapColors.area);
  text(s, x + 12, y + 9, 14, mapColors.area, 600, width - 24);
}
function mapLegend(x, y, dark, proposed = false) {
  const color = dark ? P.paper : P.ink;
  block(x, y + 2, 16, 13, '#285bc74d', mapColors.area, 2);
  text('Document-backed area', x + 25, y, 14, color, 400, 170);
  rule(x + 218, y + 9, x + 247, y + 9, mapColors.route, 4);
  text('Walking route', x + 257, y, 14, color, 400, 137);
  if (proposed) {
    c.setLineDash([7, 6]); rule(x + 410, y + 9, x + 440, y + 9, mapColors.proposal, 4); c.setLineDash([]);
    text('Proposed route', x + 450, y, 14, color, 400, 155);
  }
}
function editorial(canvas, t) {
  base(canvas, false, 'WORKFLOW / V3', t);
  fade(t, 0, 17.4, () => {
    reveal(t, .15, () => {
      rows('Know where\nyou can go.', 48, 153, 72, P.ink, 595, 700, 'Coast Display', 1.12);
      rows(t < 5 ? 'A map of coastal access,\nroutes and evidence.' : 'Read local rules, routes\nand the evidence behind them.', 51, 361, 25, P.muted, 515);
      glyph('MapTrifold', 48, 500, 59);
      rows('A beach and its path\ncan have different rules.', 125, 505, 20, P.teal, 470, 600);
    });
    reveal(t, .45, () => {
      const map = drawMap(c, 688, 155, 544, 402, t);
      reveal(t, 3.1, () => {
        label('Access area', 969, 317, 147);
        curve([1027, 354], [[[1027, 367], [1020, 370], map.target]], enter(t, 3.5, 2), mapColors.area, 1.5);
      });
      mapLegend(688, 572, false);
      text('ILLUSTRATIVE PLACE AND ACCESS RECORD', 688, 599, 10, P.muted, 400, 544, 'Coast Mono');
    });
  });
  fade(t, 18.5, 34.8, () => {
    rows('Add what\nyou know.', 48, 153, 72, P.ink, 595, 700, 'Coast Display', 1.12);
    rows('Draw the place. Add details\nand a source when you can.', 51, 361, 25, P.muted, 515);
    text('No account needed.', 51, 519, 25, P.teal, 600, 515);
    block(688, 155, 544, 402, P.tint, P.line);
    reveal(t, 19.1, () => {
      glyph('MapTrifold', 718, 247, 98);
      text('Your local', 718, 369, 22, P.teal, 600, 212);
      text('knowledge', 718, 400, 22, P.teal, 600, 212);
    });
    reveal(t, 21.1, () => {
      block(950, 180, 256, 236, P.paper, P.line);
      glyph('FileMagnifyingGlass', 974, 196, 56);
      text('Sources', 974, 266, 28, P.ink, 700, 205, 'Coast Display');
      rows('Official documents\nstrongly encouraged.', 974, 318, 18, P.muted, 208);
    });
    curve([823, 300], [[[868, 300], [855, 242], [940, 242]]], enter(t, 20, 3.2), P.teal, 2.5);
    curve([1078, 426], [[[1078, 443], [1130, 446], [1130, 463]]], enter(t, 25, 2.5), P.teal, 2.5);
    reveal(t, 27, () => {
      block(950, 474, 256, 63, P.teal);
      text('Moderator review', 967, 486, 18, P.paper, 600, 190);
      text('Before publication', 967, 513, 12, P.paper, 400, 180, 'Coast Mono');
      glyph('SealCheck', 1160, 484, 34, true);
    });
    text('CONTRIBUTIONS ARE REVIEWED BEFORE THEY APPEAR.', 688, 575, 12, P.muted, 400, 544, 'Coast Mono');
  });
  fade(t, 35.8, 40.5, () => {
    rows('Know your coast.', 48, 171, 83, P.ink, 1100, 700, 'Coast Display', 1.15);
    rows('Know your rights.\nHelp make local access visible.', 51, 304, 30, P.muted, 780);
    block(48, 431, 460, 72, P.teal);
    text('opencoast.kaelux.dev', 73, 452, 28, P.paper, 600, 410, 'Coast Display');
    glyph('MapTrifold', 1038, 318, 137);
    curve([860, 470], [[[876, 332], [955, 492], [1013, 394]]], enter(t, 35.8, 3.2), P.teal, 3);
  });
}
function evidencePanel(t, contribute) {
  const x = 907, y = 279;
  block(x, y, 301, 294, P.dark, '#6b9699');
  glyph(contribute ? 'MapTrifold' : 'FileMagnifyingGlass', x + 22, y + 22, 39, true);
  text(contribute ? 'Contribute' : 'Read the evidence', x + 74, y + 28, 20, P.paper, 700, 209);
  rule(x + 22, y + 84, x + 279, y + 84, P.darkLine);
  if (!contribute) {
    text('Allowed', x + 23, y + 108, 29, P.paper, 700, 250);
    text('Document backed', x + 23, y + 164, 20, P.paper, 600, 250);
    rows('Official source checked\nby a moderator.', x + 23, y + 203, 18, P.darkMuted, 253);
    text('ILLUSTRATIVE RECORD', x + 23, y + 270, 11, P.darkMuted, 400, 253, 'Coast Mono');
  } else if (t < 28.5) {
    rows('Draw the route.\nAdd details and sources.', x + 23, y + 105, 22, P.paper, 253, 600);
    text('No account needed.', x + 23, y + 196, 18, P.darkMuted, 400, 253);
    block(x + 22, y + 238, 257, 39, P.paper);
    text('Submit for review', x + 44, y + 246, 20, P.teal, 600, 229);
  } else {
    glyph('SealCheck', x + 23, y + 109, 43, true);
    rows('Moderator review', x + 23, y + 170, 23, P.paper, 253, 650);
    rows('Accepted changes appear\non the public map.', x + 23, y + 223, 18, P.darkMuted, 253);
  }
}
function pointer(x, y, dark) { glyph('Cursor', x - 4, y - 3, 30, dark); }
function visual(canvas, t) {
  base(canvas, true, 'MAP WALKTHROUGH / V3', t);
  fade(t, 0, 17.4, () => {
    text('Know where you can go.', 48, 121, 57, P.paper, 700, 1180, 'Coast Display');
    text('Read the access conditions and their sources.', 51, 207, 25, P.darkMuted, 400, 1160);
  });
  fade(t, 18.5, 34.8, () => {
    text('Put local knowledge on the map.', 48, 121, 53, P.paper, 700, 1180, 'Coast Display');
    text('Draw a route. Add a source. Submit for human review.', 51, 207, 25, P.darkMuted, 400, 1160);
  });
  fade(t, .25, 34.8, () => {
    const map = drawMap(c, 48, 264, 832, 310, t, t >= 18.5);
    reveal(t, 3, () => {
      label('Document-backed area', 566, 372, 212);
      curve([617, 409], [[[610, 420], [597, 421], map.target]], enter(t, 3.5, 1.75), mapColors.area, 1.5);
    });
    if (t < 18.5) {
      reveal(t, 4, () => evidencePanel(t, false));
      const tip = trace(map.route, enter(t, 4.5, 3.5), '#00000000', 0);
      pointer(...tip, false);
    } else {
      reveal(t, 18.5, () => evidencePanel(t, true));
      if (t < 19.5) { const u = enter(t, 18.5, 1), target = map.extra[0], from = map.route.at(-1); pointer(from[0] + (target[0] - from[0]) * u, from[1] + (target[1] - from[1]) * u, false); }
      else if (t < 24.6) { const tip = trace(map.extra, enter(t, 19.5, 4.5), '#00000000', 0); pointer(...tip, false); }
      else if (t < 28.5) { const u = enter(t, 24.6, 3.6), from = map.extra.at(-1); pointer(from[0] + (1030 - from[0]) * u, from[1] + (534 - from[1]) * u, false); }
    }
    mapLegend(48, 590, true, t >= 18.5);
    text('ILLUSTRATIVE MAP', 1090, 590, 10, P.darkMuted, 400, 142, 'Coast Mono');
  });
  fade(t, 35.8, 40.5, () => {
    rows('Know your coast.\nMake access visible.', 48, 159, 69, P.paper, 1120, 700, 'Coast Display', 1.18);
    text('Access information. Sources. Human review.', 52, 358, 27, P.darkMuted, 400, 1120);
    block(48, 443, 461, 72, null, P.paper);
    text('opencoast.kaelux.dev', 73, 464, 27, P.paper, 600, 410);
    glyph('FileMagnifyingGlass', 1061, 398, 99, true);
    curve([685, 452], [[[755, 370], [858, 551], [1027, 452]]], enter(t, 35.8, 3.2), P.paper, 3);
  });
}
module.exports = { createCanvas, W, H, warnings, initAssets, editorial, visual, social: require('./scenes.cjs').social };
