'use strict';
const { createCanvas } = require(process.env.OPENCOAST_CANVAS_MODULE || '@napi-rs/canvas');
const C = { land: '#eeeddf', sea: '#add8e9', deep: '#78bad8', sand: '#ead2a0', woodland: '#bdcda9', contour: '#96ad8c', building: '#cabba7', road: '#fffdf7', roadEdge: '#c6c6b8', text: '#36525d', area: '#285bc7', route: '#cf561e', proposal: '#813db0' };
const cache = new Map();
const clamp = n => Math.max(0, Math.min(1, n));
const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };
function bezier(start, segments) {
  const points = [start]; let previous = start;
  for (const [a, b, end] of segments) {
    for (let i = 1; i <= 64; i++) {
      const u = i / 64, v = 1 - u;
      points.push([v ** 3 * previous[0] + 3 * v * v * u * a[0] + 3 * v * u * u * b[0] + u ** 3 * end[0], v ** 3 * previous[1] + 3 * v * v * u * a[1] + 3 * v * u * u * b[1] + u ** 3 * end[1]]);
    }
    previous = end;
  }
  return points;
}
function path(ctx, points, close = false) {
  ctx.beginPath(); ctx.moveTo(...points[0]); points.slice(1).forEach(p => ctx.lineTo(...p)); if (close) ctx.closePath();
}
function line(ctx, points, color, width, progress = 1, dashed = false) {
  const lengths = [0]; for (let i = 1; i < points.length; i++) lengths.push(lengths.at(-1) + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const distance = lengths.at(-1) * clamp(progress); let tip = points[0];
  ctx.beginPath(); ctx.moveTo(...tip);
  for (let i = 1; i < points.length; i++) {
    if (distance >= lengths[i]) { tip = points[i]; ctx.lineTo(...tip); }
    else { const u = (distance - lengths[i - 1]) / (lengths[i] - lengths[i - 1]); tip = [points[i - 1][0] + u * (points[i][0] - points[i - 1][0]), points[i - 1][1] + u * (points[i][1] - points[i - 1][1])]; ctx.lineTo(...tip); break; }
  }
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(dashed ? [8, 7] : []); ctx.stroke(); ctx.setLineDash([]);
  return tip;
}
function caption(ctx, s, x, y, size = 14, color = C.text, family = 'Coast Body') {
  ctx.font = `400 ${size}px "${family}", sans-serif`; ctx.fillStyle = color; ctx.textBaseline = 'top'; ctx.fillText(s, x, y);
}
function geography(w, h) {
  const key = w + 'x' + h; if (cache.has(key)) return cache.get(key);
  const canvas = createCanvas(w, h), ctx = canvas.getContext('2d'), p = (x, y) => [x * w, y * h];
  const shore = bezier(p(.64, -.08), [[p(.51, .06), p(.61, .14), p(.69, .24)], [p(.79, .34), p(.66, .39), p(.66, .49)], [p(.66, .60), p(.76, .70), p(.66, .80)], [p(.59, .86), p(.46, .91), p(.50, 1.08)]]).map(([x, y]) => [x + w * (.003 * Math.sin(y / h * 52) + .0015 * Math.sin(y / h * 127)), y]);
  ctx.fillStyle = C.land; ctx.fillRect(0, 0, w, h);
  // Muted terrain and woodland establish land without resembling legal overlays.
  const woodland = bezier(p(-.06, .10), [[p(.10, -.09), p(.34, .01), p(.39, .20)], [p(.47, .35), p(.31, .45), p(.16, .38)], [p(.00, .40), p(-.05, .32), p(-.06, .10)]]);
  path(ctx, woodland, true); ctx.fillStyle = C.woodland; ctx.fill();
  for (let i = 0; i < 7; i++) {
    ctx.beginPath(); ctx.ellipse(w * .17, h * .22, w * (.17 - i * .019), h * (.15 - i * .016), .09, 0, Math.PI * 2); ctx.strokeStyle = C.contour; ctx.lineWidth = .8; ctx.stroke();
  }
  const park = bezier(p(.40, .69), [[p(.44, .64), p(.52, .73), p(.50, .81)], [p(.46, .91), p(.36, .85), p(.40, .69)]]);
  path(ctx, park, true); ctx.fillStyle = '#d0d9bb'; ctx.fill();
  line(ctx, shore, C.sand, w * .095);
  // Sea fill masks the outer half of the sand stroke, leaving a beach on land.
  path(ctx, [...shore, [w + 10, h + 10], [w + 10, -10]], true);
  const water = ctx.createLinearGradient(w * .58, 0, w, h); water.addColorStop(0, '#c6e5ec'); water.addColorStop(1, C.deep); ctx.fillStyle = water; ctx.fill();
  for (const offset of [.025, .07, .145, .245]) line(ctx, shore.map(([x, y]) => [x + w * offset, y]), '#e3f2f3', 1);
  line(ctx, shore, '#f7fcf9', 4); line(ctx, shore, '#6ba8bf', 1);
  const roads = [
    bezier(p(.22, -.10), [[p(.14, .18), p(.18, .40), p(.25, .52)], [p(.34, .69), p(.17, .87), p(.23, 1.08)]]),
    bezier(p(-.05, .62), [[p(.15, .57), p(.27, .63), p(.39, .53)], [p(.48, .48), p(.53, .50), p(.57, .47)]]),
    bezier(p(.42, -.06), [[p(.44, .17), p(.48, .31), p(.47, .47)], [p(.45, .64), p(.37, .88), p(.36, 1.08)]]),
    bezier(p(.07, .82), [[p(.17, .77), p(.34, .82), p(.40, .72)]])
  ];
  roads.forEach((r, i) => { const width = i === 0 ? 12 : 8; line(ctx, r, C.roadEdge, width + 2); line(ctx, r, C.road, width); });
  // Building footprints: geographic details, never symbols or status markers.
  const buildings = [[.09,.50,.026,.040], [.14,.48,.038,.032], [.19,.49,.029,.046], [.26,.44,.029,.047], [.31,.47,.038,.039], [.35,.56,.039,.032], [.29,.62,.026,.044], [.34,.68,.033,.037], [.27,.74,.024,.037], [.16,.68,.031,.045], [.11,.72,.033,.032], [.12,.87,.026,.037], [.29,.89,.031,.041], [.38,.35,.024,.044], [.40,.41,.031,.035], [.39,.60,.026,.042], [.09,.63,.026,.030]];
  buildings.forEach(([x, y, bw, bh], i) => {
    ctx.save(); ctx.translate(x * w, y * h); ctx.rotate((i % 3 - 1) * .12); ctx.fillStyle = '#b4a897'; ctx.fillRect(1.5, 1.5, bw * w, bh * h); ctx.fillStyle = C.building; ctx.fillRect(0, 0, bw * w, bh * h); ctx.strokeStyle = '#fffdf5'; ctx.lineWidth = 1.2; ctx.strokeRect(0, 0, bw * w, bh * h); ctx.restore();
  });
  caption(ctx, 'WOODED HILLS', w * .055, h * .16, 11, '#4e6747', 'Coast Mono');
  caption(ctx, 'LAND', w * .46, h * .12, 12, '#687262', 'Coast Mono');
  caption(ctx, 'Coastal village', w * .08, h * .39, 15);
  caption(ctx, 'SEA', w * .83, h * .20, 24, '#285b76', 'Coast Display');
  caption(ctx, 'Open water', w * .82, h * .29, 13, '#386d84');
  caption(ctx, 'Sandy beach', w * .77, h * .77, 14, '#655735');
  line(ctx, [p(.77, .83), p(.70, .81)], '#9b8553', 1);
  const coveredShore = shore.filter(([, y]) => y >= h * .43 && y <= h * .67);
  const area = [...coveredShore, ...coveredShore.map(([x, y]) => [x - w * .044, y]).reverse()];
  const route = bezier(p(.17, .64), [[p(.25, .67), p(.27, .59), p(.37, .56)], [p(.44, .51), p(.53, .54), p(.64, .55)]]);
  const extra = bezier(p(.08, .94), [[p(.12, .88), p(.11, .78), p(.18, .77)], [p(.30, .78), p(.40, .72), p(.48, .70)], [p(.53, .68), p(.56, .64), p(.65, .63)]]);
  const data = { canvas, shore, area, route, extra, target: p(.647, .55) }; cache.set(key, data); return data;
}
function drawMap(ctx, x, y, w, h, t, proposal = false) {
  const data = geography(w, h); ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(data.canvas, x, y);
  ctx.translate(x, y);
  const areaAlpha = ease((t - 2.5) / 1.25);
  if (areaAlpha) {
    ctx.save(); ctx.globalAlpha *= areaAlpha; path(ctx, data.area, true); ctx.fillStyle = '#285bc73e'; ctx.fill(); ctx.strokeStyle = C.area; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
  }
  const routeProgress = ease((t - 4.5) / 3.5);
  line(ctx, data.route, '#fffdf7', 8, routeProgress); line(ctx, data.route, C.route, 4, routeProgress);
  if (routeProgress) {
    for (const point of [data.route[0], ...(routeProgress === 1 ? [data.route.at(-1)] : [])]) {
      ctx.beginPath(); ctx.arc(...point, 5.5, 0, Math.PI * 2); ctx.fillStyle = C.route; ctx.fill(); ctx.strokeStyle = '#fffdf7'; ctx.lineWidth = 2; ctx.stroke();
    }
  }
  if (proposal) {
    const progress = ease((t - 19.5) / 4.5);
    line(ctx, data.extra, '#fffdf7', 7, progress, true); line(ctx, data.extra, C.proposal, 3.5, progress, true);
  }
  ctx.restore(); ctx.strokeStyle = '#9eafb0'; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
  const absolute = points => points.map(([px, py]) => [x + px, y + py]);
  return { route: absolute(data.route), extra: absolute(data.extra), target: [x + data.target[0], y + data.target[1]] };
}
module.exports = { drawMap, colors: C };
