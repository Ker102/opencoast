'use strict';
const path = require('node:path');
const { existsSync } = require('node:fs');
const { createCanvas, GlobalFonts } = require(process.env.OPENCOAST_CANVAS_MODULE || '@napi-rs/canvas');
const fonts = process.env.OPENCOAST_FONT_DIR || 'C:/Windows/Fonts';
for (const f of ['segoeui.ttf', 'segoeuib.ttf']) if (existsSync(path.join(fonts, f))) GlobalFonts.registerFromPath(path.join(fonts, f), 'Coast Sans');
const W = 1280, H = 720;
const P = { bg: '#f8f7f2', ink: '#203238', teal: '#0d5962', muted: '#647a7e', line: '#dde3dc', water: '#d8e8e9', green: '#147c6d', amber: '#ac721c', white: '#ffffff' };
const clamp = x => Math.max(0, Math.min(1, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const inAt = (t, start, duration = 1.2) => ease((t - start) / duration);
const warnings = new Set();
let c;
function text(s, x, y, size = 24, color = P.ink, weight = 400, maxWidth = W - x - 48) {
  c.font = `${weight} ${size}px "Coast Sans", sans-serif`;
  if (c.measureText(s).width > maxWidth + 1) warnings.add(`${s}: exceeds ${maxWidth}px`);
  c.fillStyle = color; c.textAlign = 'left'; c.textBaseline = 'top'; c.fillText(s, x, y);
}
function lines(s, x, y, size, color, width, weight = 400) {
  c.font = `${weight} ${size}px "Coast Sans", sans-serif`;
  let row = '', n = 0;
  for (const paragraph of s.split('\n')) {
    row = '';
    for (const word of paragraph.split(' ')) {
      const test = row ? row + ' ' + word : word;
      if (row && c.measureText(test).width > width) { text(row, x, y + n++ * size * 1.35, size, color, weight, width); row = word; } else row = test;
    }
    text(row, x, y + n++ * size * 1.35, size, color, weight, width);
  }
  return n * size * 1.35;
}
function box(x, y, w, h, fill = P.white, radius = 18, stroke = P.line, lw = 1.5) {
  c.beginPath(); c.roundRect(x, y, w, h, radius); c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
}
function line(points, color = P.teal, width = 3) {
  c.beginPath(); c.moveTo(...points[0]); for (const p of points.slice(1)) c.lineTo(...p);
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
}
function circle(x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
function reveal(t, start, draw) { const a = inAt(t, start); if (!a) return; c.save(); c.globalAlpha *= a; c.translate(0, 10 * (1 - a)); draw(); c.restore(); }
function phase(t, start, end, draw) { const a = inAt(t, start) * (1 - inAt(t, end)); if (!a) return; c.save(); c.globalAlpha *= a; draw(); c.restore(); }
function brand(x = 48, y = 28, scale = 1) {
  c.save(); c.translate(x, y); c.scale(scale, scale);
  box(0, 0, 36, 36, P.teal, 9, null);
  c.beginPath(); c.moveTo(5, 24); c.bezierCurveTo(12, 23, 13, 15, 19, 15); c.bezierCurveTo(24, 15, 24, 21, 30, 19); c.lineTo(33, 14); c.strokeStyle = P.bg; c.lineWidth = 2.7; c.stroke();
  line([[9, 30], [17, 22]], '#addfce', 2.7);
  text('OpenCoast', 47, 3, 24, P.ink, 700); c.restore();
}
function base(canvas, t, duration, label) {
  c = canvas.getContext('2d'); c.fillStyle = P.bg; c.fillRect(0, 0, W, H);
  brand(); text(label, 958, 37, 14, P.muted, 600, 280);
  line([[48, 680], [1232, 680]], P.line, 1);
  text('Beach access · Routes to shore · Evidence', 48, 692, 13, P.muted);
  text('opencoast.kaelux.dev', 1063, 692, 13, P.teal, 600, 170);
}
function heading(kicker, title, sub) {
  text(kicker.toUpperCase(), 48, 108, 14, P.teal, 700);
  lines(title, 48, 145, 45, P.ink, 1160, 700);
  if (sub) text(sub, 50, 264, 23, P.muted, 400, 1150);
}
const steps = [
  ['Locate', 'Choose a marked area, route or access point.', 'pin'],
  ['Read', 'Check local conditions, evidence and dates.', 'file'],
  ['Contribute', 'Draw a place. Add details and sources.', 'draw'],
  ['Review', 'Moderators check changes before publication.', 'check']
];
function icon(name, x, y) {
  c.save(); c.translate(x, y);
  if (name === 'pin') { circle(0, -2, 17, '#e6f1ed'); circle(0, -2, 5, P.teal); line([[-13, 6], [0, 25], [13, 6]], P.teal, 3); }
  if (name === 'file') { box(-19, -22, 38, 45, P.bg, 5, P.teal, 2); for (const yy of [-10, 0, 10]) line([[-10, yy], [10, yy]], P.teal, 2); }
  if (name === 'draw') { line([[-22, 18], [-10, -15], [20, -8], [12, 18], [-22, 18]], P.teal, 2); for (const p of [[-22, 18], [-10, -15], [20, -8], [12, 18]]) circle(...p, 4, P.teal); }
  if (name === 'check') { circle(0, 0, 22, '#e6f1ed'); line([[-12, 0], [-3, 10], [13, -9]], P.teal, 3); }
  c.restore();
}
function editorial(canvas, t) {
  base(canvas, t, 40, 'DRAFT A / WORKFLOW');
  phase(t, 0, 7, () => {
    heading('Know your rights', 'A private sign is not the whole story.', 'Access rules differ. People need the sources, conditions and routes.');
    box(48, 345, 1184, 235, '#eef2e9', 24, null);
    text('One purpose:', 88, 385, 25, P.muted, 600);
    text('Make coastal access information visible.', 88, 435, 40, P.teal, 700);
    text('A map. Submitted evidence. Human review.', 88, 502, 24, P.muted);
  });
  phase(t, 8.2, 28.5, () => {
    heading('How the map works', 'From local knowledge to a reviewed map.', 'Areas, routes and entrances each carry their own access information.');
    for (let i = 0; i < 3; i++) {
      const start = 8.8 + i * .25;
      reveal(t, start, () => line([[312 + 302 * i, 442], [358 + 302 * i, 442]], '#b9cfca', 2));
    }
    steps.forEach(([title, sub, name], i) => reveal(t, 8.7 + i * .3, () => {
      const x = 48 + i * 302, active = t >= 11 + i * 3.6 && t < 14.6 + i * 3.6;
      c.save(); c.shadowColor = '#2032380a'; c.shadowBlur = 20; c.shadowOffsetY = 7;
      box(x, 345, 276, 228); c.restore();
      if (active) box(x, 345, 276, 228, P.white, 18, P.teal, 2);
      circle(x + 30, 345, 16, P.teal); text(String(i + 1), x + 25, 334, 18, P.white, 700);
      icon(name, x + 40, 398); text(title, x + 24, 448, 26, P.ink, 700);
      lines(sub, x + 24, 492, 19, P.muted, 230);
    }));
    phase(t, 11, 17.2, () => text('Read what supports a claim before relying on it.', 48, 615, 23, P.teal, 600));
    phase(t, 18.4, 27.4, () => text('No account needed. Keep your private receipt to follow review.', 48, 615, 23, P.teal, 600));
  });
  phase(t, 29.7, 39.5, () => {
    heading('Evidence matters', 'Access status and evidence are separate.', 'Read both. A map label needs context.');
    box(48, 345, 568, 216); box(640, 345, 592, 216);
    text('Document backed', 76, 382, 27, P.green, 700);
    lines('A moderator checked an official source against the claim and location.', 76, 437, 23, P.muted, 508);
    text('Community reviewed', 668, 382, 27, P.amber, 700);
    lines('No official source verified. This is clearly labeled on the map.', 668, 437, 23, P.muted, 532);
    text('Explore. Read the sources. Add what you know.', 48, 612, 25, P.teal, 700);
  });
}
const shore = [[705, 334], [664, 384], [681, 424], [641, 475], [662, 535], [614, 599], [620, 654]];
const area = [[638, 431], [681, 424], [641, 475], [662, 535], [614, 599], [579, 580], [603, 522], [591, 472]];
const route = [[335, 556], [391, 540], [423, 493], [478, 487], [532, 516], [603, 522]];
const proposal = [[647, 360], [686, 359], [664, 384], [681, 424], [638, 431], [626, 390], [647, 360]];
function poly(points, fill, stroke) {
  c.beginPath(); c.moveTo(...points[0]); points.slice(1).forEach(p => c.lineTo(...p)); c.closePath(); c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
}
function partial(points, u, color, width = 4) {
  const lengths = [0]; for (let i = 1; i < points.length; i++) lengths.push(lengths.at(-1) + Math.hypot(points[i][0] - points[i-1][0], points[i][1] - points[i-1][1]));
  const d = lengths.at(-1) * clamp(u); const out = [points[0]];
  for (let i = 1; i < points.length; i++) {
    if (d >= lengths[i]) out.push(points[i]);
    else { const q = (d - lengths[i-1]) / (lengths[i] - lengths[i-1]); out.push([points[i-1][0] + (points[i][0] - points[i-1][0]) * q, points[i-1][1] + (points[i][1] - points[i-1][1]) * q]); break; }
  }
  line(out, color, width); return out.at(-1);
}
function cursor(x, y, click = 0) {
  if (click) { c.save(); c.globalAlpha *= click * .35; circle(x, y, 13 + 10 * (1 - click), P.teal); c.restore(); }
  poly([[x, y], [x + 4, y + 26], [x + 11, y + 18], [x + 20, y + 16]], P.white, P.ink);
}
function map(t) {
  box(48, 320, 754, 335, '#eef0e8', 20, null);
  c.save(); c.beginPath(); c.roundRect(48, 320, 754, 335, 20); c.clip();
  poly([...shore, [810, 670], [810, 315], [715, 315]], P.water);
  line(shore, '#a6c6c7', 3);
  for (let i = 0; i < 6; i++) {
    c.beginPath(); c.moveTo(68, 365 + i * 37); c.bezierCurveTo(165, 360 + i * 37, 190, 475 + i * 17, 310, 452 + i * 31);
    c.strokeStyle = '#d9dfd5'; c.lineWidth = 1; c.stroke();
  }
  line([[87, 611], [213, 559], [243, 465], [321, 398], [384, 325]], '#c6cfca', 7);
  line([[149, 355], [243, 465], [357, 453], [476, 389], [572, 338]], '#c6cfca', 5);
  if (t >= 5.5) { c.save(); c.globalAlpha = inAt(t, 5.5); poly(area, '#147c6d22', P.green); c.restore(); }
  if (t >= 7.5) partial(route, inAt(t, 7.5, 2.5), P.green, 5);
  if (t >= 10) reveal(t, 10, () => { circle(335, 556, 10, P.white); circle(335, 556, 5, P.green); });
  if (t >= 23) poly(proposal, t >= 31 ? '#147c6d18' : '#ac721c18', t >= 31 ? P.green : P.amber);
  text('LAND', 100, 343, 13, P.muted, 600, 110); text('SEA', 731, 583, 13, P.muted, 600, 60);
  c.restore();
  text('ILLUSTRATIVE COASTLINE / NO REAL LEGAL CLAIM', 67, 627, 11, P.muted, 600, 710);
}
function card(t) {
  box(834, 320, 398, 335);
  if (t < 5.5) {
    text('Explore marked places', 858, 346, 23, P.ink, 700, 350);
    lines('Select an area, route or point to read its access information.', 858, 409, 23, P.muted, 350);
    lines('An unmarked area has no reviewed information yet.', 858, 543, 19, P.muted, 350);
  } else if (t < 16) {
    reveal(t, 5.5, () => {
      text('Illustrative access record', 858, 346, 22, P.ink, 700, 350);
      box(858, 392, 110, 31, '#e7f2eb', 8, null); text('Allowed', 874, 397, 16, P.green, 600, 90);
      text('Document backed', 858, 447, 20, P.green, 700, 350);
      lines('Read the official source, conditions and last edit date.', 858, 487, 21, P.muted, 350);
      text('Area + route checked separately', 858, 589, 17, P.muted, 400, 350);
    });
  } else if (t < 26) {
    reveal(t, 16.2, () => {
      text('Add information', 858, 346, 23, P.ink, 700, 350);
      lines('Draw an area, route or point.', 858, 401, 22, P.muted, 350);
      line([[858, 467], [1206, 467]], P.line, 1);
      text('Description + local conditions', 858, 491, 19, P.ink, 600, 350);
      text('Official source strongly encouraged', 858, 534, 18, P.muted, 400, 350);
      box(858, 582, 348, 44, P.teal, 9, null); text('Submit for review', 946, 591, 20, P.white, 600, 250);
    });
  } else {
    reveal(t, 26.2, () => {
      text('Change received', 858, 346, 25, P.ink, 700, 350);
      text('No account needed', 858, 397, 22, P.teal, 600, 350);
      lines('Keep your private receipt. Moderators review before publication.', 858, 446, 22, P.muted, 350);
      box(858, 578, 348, 46, '#f1f2ed', 9, null); text(t < 31 ? 'Awaiting moderator review' : 'Approved example', 887, 590, 19, t < 31 ? P.muted : P.green, 600, 290);
    });
  }
}
function visual(canvas, t) {
  base(canvas, t, 40, 'DRAFT B / MAP WALKTHROUGH');
  const labels = [
    [0, 5, 'Where can you reach the coast?', 'The area and the route can have different access rules.'],
    [5.7, 15, 'Select a place. Check what supports it.', 'Read its access conditions, evidence and dates.'],
    [16.2, 25, 'Know something useful? Add it to the map.', 'Draw precisely. Describe the conditions. Link your sources.'],
    [26.2, 34, 'Submit anonymously. Follow the review.', 'Only approved changes appear on the public map.']
  ];
  for (const [start, end, title, sub] of labels) phase(t, start, end, () => {
    text('KNOW YOUR COAST', 48, 108, 14, P.teal, 700);
    lines(title, 48, 148, 42, P.ink, 1170, 700); text(sub, 50, 255, 23, P.muted, 400, 1160);
  });
  if (t < 35.2) {
    map(t); card(t);
    if (t < 16) { const u = inAt(t, 2, 3); cursor(425 + 209 * u, 414 + 105 * u, t > 5.1 && t < 5.8 ? Math.sin((t - 5.1) / .7 * Math.PI) : 0); }
    else if (t < 17.5) { const u = inAt(t, 16, 1.5); cursor(634 + 13 * u, 519 - 159 * u); }
    else if (t < 23) { const u = inAt(t, 17.5, 4); const p = partial(proposal, u, P.amber, 3); cursor(...p); }
    else if (t < 28) { const u = inAt(t, 23, 2.5); cursor(647 + 366 * u, 360 + 248 * u, t > 25.8 && t < 26.5 ? Math.sin((t - 25.8) / .7 * Math.PI) : 0); }
  }
  phase(t, 35.2, 39.7, () => {
    text('ONE PURPOSE', 48, 108, 14, P.teal, 700);
    lines('Help people know their coastal access rights.', 48, 153, 55, P.ink, 1100, 700);
    text('A map with evidence and human review.', 48, 333, 29, P.muted);
    box(48, 424, 1184, 136, '#e8eee5', 22, null);
    text('Explore. Contribute. Help make access visible.', 80, 465, 35, P.teal, 700);
    text('Unmarked places have no reviewed information yet.', 48, 610, 22, P.muted);
  });
}
function social(canvas) {
  c = canvas.getContext('2d'); c.fillStyle = P.bg; c.fillRect(0, 0, 1200, 630);
  brand(60, 48, 1.2);
  text('PUBLIC COASTAL ACCESS, MADE VISIBLE', 60, 173, 15, P.teal, 700);
  text('Know your coast.', 60, 215, 65, P.ink, 700);
  lines('Beach access. Routes to shore.\nEvidence you can read.', 64, 312, 30, P.muted, 800);
  line([[870, 106], [815, 206], [858, 307], [807, 424], [838, 510]], '#afceca', 5);
  partial([[1020, 356], [923, 373], [895, 445], [823, 463]], 1, P.green, 6);
  circle(1020, 356, 9, P.green);
  text('No account needed to browse or contribute.', 64, 481, 22, P.teal, 600);
  line([[60, 560], [1140, 560]], P.line, 1);
  text('opencoast.kaelux.dev', 64, 583, 18, P.muted, 600);
}
module.exports = { createCanvas, W, H, warnings, editorial, visual, social };
