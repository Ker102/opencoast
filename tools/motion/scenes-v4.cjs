'use strict';
const path = require('node:path');
const { existsSync } = require('node:fs');
const { createCanvas, GlobalFonts, loadImage } = require(process.env.OPENCOAST_CANVAS_MODULE || '@napi-rs/canvas');
const { drawMap, colors: mapColors } = require('./cartography-v4.cjs');
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
let logo, cursor, c;
const duration = 96;
const clamp = x => Math.min(1, Math.max(0, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const enter = (t, start, duration = 1.25) => ease((t - start) / duration);
async function initAssets() {
  logo = await loadImage(path.join(root, 'web/public/favicon.svg'));
  cursor = await loadImage(path.join(__dirname, 'assets/Cursor-standard.svg'));
  for (const name of ['MapTrifold', 'FileMagnifyingGlass', 'SealCheck', 'Cursor', 'Barricade', 'MapPin', 'Tree', 'FileText'])
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
  text('Understand access', 91, 642, 20, t < 65 || t >= 87 ? color : muted, 600, 430);
  text('02', 656, 644, 18, color, 400, 60, 'Coast Mono');
  text('Contribute evidence', 699, 642, 20, t >= 65 ? color : muted, 600, 430);
  if (t < 65) rule(48, 624, 48 + 558 * enter(t, 0, 65), 624, color, 3);
  else if (t < 87) rule(656, 624, 656 + 576 * enter(t, 65, 22), 624, color, 3);
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

const chapters = [
  { start: 0, end: 12, title: 'Find the beach.\nFind the way in.', short: 'Locate the beach and its access.', body: 'See where the area is and how\na separately reviewed route reaches it.', icon: 'MapPin' },
  { start: 12, end: 25, title: 'Read the rules.\nKnow the category.', short: 'Category and access are different.', body: 'Open, leased or privately owned?\nRead the local category and its conditions.', icon: 'MapTrifold' },
  { start: 25, end: 38, title: 'Is the path\nactually open?', short: 'A public right can meet a blocked path.', body: 'A gate, fence or other barrier matters.\nRead observations alongside legal sources.', icon: 'Barricade' },
  { start: 38, end: 51, title: 'Understand\nthe coast.', short: 'Read the terrain and local conditions.', body: 'Check the surface, activities and limits.\nA route can have different rules to a beach.', icon: 'Tree' },
  { start: 51, end: 65, title: 'Read the sources.\nCheck the dates.', short: 'See what supports the access claim.', body: 'Open the available documents and links.\nCheck when the record was edited and reviewed.', icon: 'FileMagnifyingGlass' },
  { start: 65, end: 87, title: 'Add what\nyou know.', short: 'Help make coastal access visible.', body: 'Draw an area or route. Add a description,\nlocal details and sources when available.', icon: 'MapTrifold' }
];
function pointer(x, y) { c.drawImage(cursor, x - 4, y - 4, 32, 32); }
function tag(s, x, y, width, color = mapColors.area) {
  block(x, y, width, 32, '#ffffff', color, 2); text(s, x + 10, y + 8, 14, color, 600, width - 20);
}
function legend(x, y, width, categories = false, proposed = false) {
  block(x, y, width, 30, '#f8f7f2', '#d6dfdb');
  const item = (offset, color, name, line = false, dashed = false) => {
    if (line) { c.setLineDash(dashed ? [6, 5] : []); rule(x + offset, y + 15, x + offset + 23, y + 15, color, 4); c.setLineDash([]); }
    else block(x + offset, y + 9, 14, 12, color + '50', color, 2);
    text(name, x + offset + 30, y + 8, 13, P.ink, 400, 165);
  };
  item(12, mapColors.area, categories ? 'Allowed' : 'Allowed area');
  if (categories) { item(170, mapColors.conditional, 'Conditional'); item(355, mapColors.restricted, 'Restricted'); item(535, mapColors.route, 'Walking route', true); }
  else { item(191, mapColors.route, 'Allowed walking route', true); if (proposed) item(432, mapColors.proposal, 'Proposed route', true, true); }
}
function callout(map, index, t, wide) {
  if (index === 1) {
    reveal(t,14,()=>tag('Conditional', wide ? 550 : 971, wide ? 303 : 251, 120, mapColors.conditional));
    tag('Allowed', wide ? 598 : 1079, wide ? 445 : 414, 99);
    const [px, py] = map.point(.38,.78); reveal(t,18,()=>tag('Restricted', px - 37, py + 12, 110, mapColors.restricted));
    if(wide){const from=t<17?map.route.at(-1):map.point(.69,.31),to=t<17?map.point(.69,.31):map.point(.43,.82),u=enter(t,t<17?12.5:17,3.5);pointer(from[0]+(to[0]-from[0])*u,from[1]+(to[1]-from[1])*u);}
  } else if (index === 2) {
    const [gx, gy] = map.gate;
    reveal(t, 27, () => {
      block(gx - 20, gy - 21, 40, 40, mapColors.restricted, '#ffffff', 2); glyph('Barricade', gx - 15, gy - 16, 30, true);
      tag('Reported gate closed', wide ? gx - 99 : 899, wide ? gy - 63 : 307, 198, mapColors.restricted);
    });
    pointer(gx + 5, gy + 8);
  } else {
    reveal(t, index ? chapters[index].start + .7 : 3.1, () => {
      tag('Access allowed', wide ? 568 : 967, wide ? 374 : 317, 153);
      const [tx, ty] = map.target;
      curve([wide ? 613 : 1029, wide ? 406 : 349], [[[tx + 25, ty - 18], [tx + 10, ty - 12], [tx, ty]]], enter(t, index ? chapters[index].start + 1 : 3.5, 2), mapColors.area, 1.5);
    });
    if (index === 0 && wide) pointer(...trace(map.route, enter(t,4.5,3.5), '#00000000', 0));
  }
}
function illustrative(x, y, dark = false, width = 544) { text('ILLUSTRATIVE RECORDS AND GEOGRAPHY', x, y, 10, dark ? P.darkMuted : P.muted, 400, width, 'Coast Mono'); }
function information(x, y, w, h, heading, icon, items) {
  block(x, y, w, h, '#ffffff', P.line); glyph(icon, x + 24, y + 22, 44);
  text(heading, x + 86, y + 27, 27, P.ink, 700, w - 110, 'Coast Display'); rule(x + 24, y + 89, x + w - 24, y + 89);
  const spacing = (h - 113) / items.length;
  items.forEach(([label, value], i) => {
    const yy = y + 111 + spacing * i;
    text(label, x + 24, yy, 13, P.muted, 400, w - 48, 'Coast Mono');
    rows(value, x + 24, yy + 21, 21, P.ink, w - 48, 500, 'Coast Body', 1.15);
  });
}
function categoryCards() {
  const examples = [
    ['Open public beach', 'Access allowed', 'Read the activities and local limits.', mapColors.area],
    ['Leased / licensed area', 'Conditional access', 'Example terms may limit times or uses.', mapColors.conditional],
    ['Private parcel', 'Restricted access', 'Read the separate access rights, if any.', mapColors.restricted]
  ];
  examples.forEach(([category, status, note, color], i) => {
    const y = 155 + i * 138; block(688, y, 544, 118, '#ffffff', P.line); block(688, y, 6, 118, color);
    text(category, 712, y + 17, 26, P.ink, 700, 488, 'Coast Display');
    text(status, 712, y + 55, 19, color, 600, 488);
    text(note, 712, y + 85, 17, P.muted, 400, 488);
  });
}
function editorial(canvas, t) {
  base(canvas, false, 'WORKFLOW / V4', t);
  chapters.forEach((chapter, index) => fade(t, chapter.start, chapter.end - .8, () => {
    rows(chapter.title, 48, 146, index === 4 ? 57 : 62, P.ink, 595, 700, 'Coast Display', 1.13);
    rows(chapter.body, 51, 333, 24, P.muted, 566, 400, 'Coast Body', 1.35);
    glyph(chapter.icon, 48, 484, 54);
    const notes = ['Location, jurisdiction and approach route.', 'Category alone does not decide access.', 'A physical barrier is not a legal ruling.', 'Read conditions for each separate record.', 'Evidence quality and freshness matter.', 'No account needed to contribute.'];
    rows(notes[index], 123, 492, 21, P.teal, 470, 600);
    if (index === 0 || index === 2) {
      const map = drawMap(c, 688, 155, 544, 402, t, false, { zoom: index === 2 ? 1 + .06 * enter(t,25,5) : 1 });
      callout(map,index,t,false); legend(688,572,544); illustrative(688,609);
    } else if (index === 1) {
      categoryCards(); illustrative(688,591);
    } else if (index === 3) {
      information(688,155,544,416,'Local coast details','Tree',[
        ['LOCATION / SURFACE','Example bay · sand and rock'],
        ['ACTIVITIES / CONDITIONS','Walking and beach use · check limits'],
        ['OBSERVED CONDITIONS','Read descriptions and dated reports'],
        ['BOUNDARIES','Approximate drawing · check the source']
      ]); illustrative(688,591);
    } else if (index === 4) {
      information(688,155,544,416,'Documents and dates','FileText',[
        ['OFFICIAL SOURCES, WHEN AVAILABLE','Municipal rules · lease or license terms'],
        ['OTHER MATERIAL','Maps · public links · approved evidence'],
        ['REVIEW AND EDIT HISTORY','Last edited and last checked against sources'],
        ['EVIDENCE LABEL','Document backed or no official source verified']
      ]); illustrative(688,591);
    } else {
      block(688,155,544,416,P.tint,P.line);
      const steps = [
        ['Draw the area or route','Add location, category and a description.'],
        ['Attach supporting sources','Official documents strongly encouraged.'],
        [t < 80 ? 'Submit for human review' : 'Moderator review','Accepted changes appear on the map.']
      ];
      steps.forEach(([head, body], i) => reveal(t,65 + i*4, () => {
        const yy = 174 + i * 128; block(711,yy,498,108,'#ffffff',P.line);
        text('0' + (i+1),735,yy+19,16,P.teal,400,45,'Coast Mono');
        text(head,780,yy+15,23,P.ink,700,406,'Coast Display');
        rows(body,735,yy+57,18,P.muted,450);
      })); illustrative(688,591);
    }
  }));
  fade(t,87,96.5, () => {
    rows('Know your coast.',48,171,83,P.ink,1100,700,'Coast Display',1.15);
    rows('Know your rights. Read the sources.\nHelp make local access visible.',51,304,30,P.muted,1000);
    block(48,431,460,72,P.teal); text('opencoast.kaelux.dev',73,452,28,P.paper,600,410,'Coast Display');
    glyph('MapTrifold',1038,318,137); curve([860,470],[[[876,332],[955,492],[1013,394]]],enter(t,87,3.2),P.teal,3);
  });
}
function details(index, t) {
  const x=907,y=264,w=325,h=310;
  block(x,y,w,h,'#ffffff',P.line); glyph(chapters[index].icon,x+18,y+18,34);
  const heads=['Example bay','Local category','Approach route','Coast conditions','Sources and dates','Contribute'];
  text(heads[index],x+65,y+22,21,P.ink,700,242,'Coast Display'); rule(x+18,y+69,x+w-18,y+69);
  const yy=y+86;
  if (index === 0) {
    text('Access allowed',x+18,yy,26,mapColors.area,700,289);
    rows('Beach and route\nare separate records.',x+18,yy+50,20,P.ink,289);
    rows('Location and jurisdiction\nLinked walking approach',x+18,yy+118,17,P.muted,289);
  } else if (index === 1) {
    const items=[['Open public beach','Allowed',mapColors.area],['Leased / licensed','Conditional',mapColors.conditional],['Private parcel','Restricted',mapColors.restricted]];
    items.forEach(([category,status,color],i)=>{text(category,x+18,yy+i*65,18,P.ink,600,289);text(status,x+18,yy+25+i*65,17,color,600,289);});
  } else if (index === 2) {
    text('Reported gate closed',x+18,yy,22,mapColors.restricted,700,289);
    rows('A barrier is an observation.\nCheck the route rights\nand its current condition.',x+18,yy+50,19,P.ink,289);
    text('Read dated reports.',x+18,yy+157,17,P.muted,400,289);
  } else if (index === 3) {
    rows('Sand and rock\nActivities and limits\nDescriptions and observations',x+18,yy,19,P.ink,289,500,'Coast Body',1.6);
    rows('Approximate boundary.\nRead the original source.',x+18,yy+144,17,P.muted,289);
  } else if (index === 4) {
    rows('Municipal access rules\nLease / license terms\nMaps and public evidence',x+18,yy,19,P.ink,289,500,'Coast Body',1.6);
    rows('Check edit and review dates.\nNo verified source? It is labelled.',x+18,yy+143,17,P.muted,289);
  } else if (t < 79) {
    rows('Draw a place or route.\nDescribe access and conditions.\nAdd sources when available.',x+18,yy,18,P.ink,289,500,'Coast Body',1.55);
    text('No account needed.',x+18,yy+130,18,P.muted,400,289);
    block(x+18,y+254,w-36,38,P.teal);text('Submit for review',x+43,y+262,18,P.paper,600,250);
  } else {
    glyph('SealCheck',x+18,yy,47);text('Human review',x+18,yy+62,24,P.ink,700,289);
    rows('Accepted changes appear\non the public map.\nEvidence labels remain visible.',x+18,yy+111,18,P.muted,289);
  }
}
function visual(canvas,t) {
  base(canvas,true,'MAP WALKTHROUGH / V4',t);
  chapters.forEach((chapter,index)=>fade(t,chapter.start,chapter.end-.8,()=>{
    text(chapter.short,48,121,index===2?49:51,P.paper,700,1184,'Coast Display');
    const subtitles=['Location, beach boundary and a separately reviewed route.','Open, leased / licensed or private: read the local conditions.','A reported obstruction and legal access are different facts.','Surface, activities, observations and boundaries for this place.','Available documents, evidence labels, edit dates and review dates.','Draw, describe and add sources. No account needed.'];
    text(subtitles[index],51,201,23,P.darkMuted,400,1160);
    const mapTime=index===5?19.5+(t-67):t;
    const map=drawMap(c,48,264,832,310,mapTime,index===5,{categories:index===1,zoom:index===3?1+.07*enter(t,38,6):1});
    if(index!==5)callout(map,index,t,true);
    else {
      if(t<67){const u=enter(t,65,2),from=map.route.at(-1),to=map.extra[0];pointer(from[0]+(to[0]-from[0])*u,from[1]+(to[1]-from[1])*u);}
      else if(t<73){pointer(...trace(map.extra,enter(t,67,4.5),'#00000000',0));}
      else if(t<79){const u=enter(t,73,5),from=map.extra.at(-1);pointer(from[0]+(1050-from[0])*u,from[1]+(535-from[1])*u);}
    }
    details(index,t);legend(48,584,832,index===1,index===5);illustrative(1000,592,true,232);
  }));
  fade(t,87,96.5,()=>{
    rows('Know your coast.\nMake access visible.',48,159,69,P.paper,1120,700,'Coast Display',1.18);
    text('Local rules. Real sources. Human review.',52,358,27,P.darkMuted,400,1120);
    block(48,443,461,72,null,P.paper);text('opencoast.kaelux.dev',73,464,27,P.paper,600,410);
    glyph('FileMagnifyingGlass',1061,398,99,true);curve([685,452],[[[755,370],[858,551],[1027,452]]],enter(t,87,3.2),P.paper,3);
  });
}
module.exports={createCanvas,W,H,warnings,initAssets,editorial,visual,duration,chapters,social:require('./scenes.cjs').social};
