// Renders the piping isometry to a standalone static SVG (no JS / no DOM),
// mirroring isometry-piping.html so it can be previewed directly.
import { writeFileSync } from "node:fs";

const ISO = { cos: Math.cos(Math.PI / 6), sin: Math.sin(Math.PI / 6), scale: 42 };
const project = (x, y, z) => ({
  x: (x - y) * ISO.cos * ISO.scale,
  y: ((x + y) * ISO.sin - z) * ISO.scale
});
const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * f));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * f));
  const b = Math.min(255, Math.round((n & 255) * f));
  return `rgb(${r},${g},${b})`;
};

const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
const track = p => {
  if (p.x < bounds.minX) bounds.minX = p.x;
  if (p.y < bounds.minY) bounds.minY = p.y;
  if (p.x > bounds.maxX) bounds.maxX = p.x;
  if (p.y > bounds.maxY) bounds.maxY = p.y;
};

const RUN = 5.0, H_SUS = 4.0, H_CON = 1.5;
const X0 = 0.6, YC = 2.0, X1 = X0 + RUN;

const boxes = [];
const addBox = (x, y, z, sx, sy, sz, color, stroke = "rgba(0,0,0,0.18)") => {
  const X = x + sx, Y = y + sy, Z = z + sz;
  const P = (a, b, c) => { const p = project(a, b, c); track(p); return p; };
  const top   = [P(x, y, Z), P(X, y, Z), P(X, Y, Z), P(x, Y, Z)];
  const right = [P(X, y, z), P(X, Y, z), P(X, Y, Z), P(X, y, Z)];
  const left  = [P(x, Y, z), P(X, Y, z), P(X, Y, Z), P(x, Y, Z)];
  boxes.push({
    depth: (x+sx/2)+(y+sy/2)+(z+sz/2),
    faces: [
      { pts: left,  fill: shade(color, 0.60) },
      { pts: right, fill: shade(color, 0.78) },
      { pts: top,   fill: shade(color, 1.00) }
    ], stroke
  });
};
const W = 0.28, STEEL = "#5a8fbf";
const pipeX = (xa, xb, yc, zc) => addBox(xa, yc - W/2, zc - W/2, xb - xa, W, W, STEEL);
const pipeZ = (za, zb, xc, yc) => addBox(xc - W/2, yc - W/2, za, W, W, zb - za, STEEL);

const FX = 7, FY = 4, gfrag = [];
const floor = [project(0,0,0), project(FX,0,0), project(FX,FY,0), project(0,FY,0)];
floor.forEach(track);
gfrag.push(`<polygon points="${floor.map(p=>`${p.x},${p.y}`).join(" ")}" fill="#eaf1f8"/>`);
for (let gx=0; gx<=FX; gx++){ const a=project(gx,0,0),b=project(gx,FY,0);track(a);track(b);
  gfrag.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#bcd0e2" stroke-width="1"/>`); }
for (let gy=0; gy<=FY; gy++){ const a=project(0,gy,0),b=project(FX,gy,0);track(a);track(b);
  gfrag.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#bcd0e2" stroke-width="1"/>`); }

addBox(X0-0.3, YC-0.18, H_SUS+0.6, RUN+0.6, 0.36, 0.34, "#8a939c");
const beamTopZ = H_SUS + 0.6;
[1.5,3.0,4.5].forEach(dd => { const hx=X0+dd;
  addBox(hx-0.05, YC-0.05, H_SUS, 0.10, 0.10, beamTopZ-H_SUS, "#9aa3ac"); });

const DISP = "#c0392b";
{ const s = project(X1, YC, 0);
  gfrag.push(`<ellipse cx="${s.x}" cy="${s.y+6}" rx="48" ry="20" fill="rgba(31,45,61,0.16)"/>`); }
addBox(X1-0.85, YC-0.85, 0.0,   1.7, 1.7, H_CON, DISP);
addBox(X1-0.7,  YC-0.7,  H_CON, 1.4, 1.4, 0.45, "#2c3e50");
addBox(X1-0.45, YC-0.4,  H_CON+0.08, 0.9, 0.8, 0.28, "#67c0e8");
addBox(X1-1.0,  YC-0.3,  0.7,   0.18, 0.6, 0.55, "#2c3e50");

pipeX(X0, X1+W/2, YC, H_SUS);
pipeZ(H_CON, H_SUS+W/2, X1, YC);
addBox(X1-0.30, YC-0.30, H_CON-0.05, 0.60, 0.60, 0.16, "#3f6f96");
const vz = (H_CON+H_SUS)/2 - 0.3;
addBox(X1-0.30, YC-0.30, vz, 0.60, 0.60, 0.6, "#e0b13a");

boxes.sort((a,b)=>a.depth-b.depth);
const frag = [...gfrag];
for (const box of boxes) for (const f of box.faces)
  frag.push(`<polygon points="${f.pts.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ")}" fill="${f.fill}" stroke="${box.stroke}" stroke-width="0.8" stroke-linejoin="round"/>`);

{ const c = project(X1, YC, vz+0.6);
  frag.push(`<ellipse cx="${c.x}" cy="${c.y}" rx="13" ry="6.5" fill="none" stroke="#7a5b12" stroke-width="3"/>`);
  frag.push(`<ellipse cx="${c.x}" cy="${c.y}" rx="5" ry="2.6" fill="#7a5b12"/>`); }
{ const a=project(X1-1.0,YC,1.2), b=project(X1-1.7,YC+0.5,0.05); track(a);track(b);
  frag.push(`<path d="M ${a.x} ${a.y} Q ${a.x-30} ${(a.y+b.y)/2+24} ${b.x} ${b.y}" fill="none" stroke="#2c3e50" stroke-width="4.5" stroke-linecap="round"/>`);
  frag.push(`<circle cx="${b.x}" cy="${b.y}" r="4" fill="#1c2733"/>`); }

const dimFrag = [];
const arrow = (tip, toward) => {
  const dx=toward.x-tip.x, dy=toward.y-tip.y, len=Math.hypot(dx,dy)||1, ux=dx/len, uy=dy/len, s=8;
  const bx=tip.x+ux*s, by=tip.y+uy*s, px=-uy*3.4, py=ux*3.4;
  return `<polygon points="${tip.x.toFixed(1)},${tip.y.toFixed(1)} ${(bx+px).toFixed(1)},${(by+py).toFixed(1)} ${(bx-px).toFixed(1)},${(by-py).toFixed(1)}" fill="#1f3550"/>`;
};
const isoDim = (A,B,off,text,tdx,tdy) => {
  const a=project(...A), b=project(...B);
  const a2=project(A[0]+off[0],A[1]+off[1],A[2]+off[2]);
  const b2=project(B[0]+off[0],B[1]+off[1],B[2]+off[2]);
  [a,b,a2,b2].forEach(track);
  dimFrag.push(`<line x1="${a.x}" y1="${a.y}" x2="${a2.x}" y2="${a2.y}" stroke="#1f3550" stroke-width="0.9" opacity="0.7"/>`);
  dimFrag.push(`<line x1="${b.x}" y1="${b.y}" x2="${b2.x}" y2="${b2.y}" stroke="#1f3550" stroke-width="0.9" opacity="0.7"/>`);
  dimFrag.push(`<line x1="${a2.x}" y1="${a2.y}" x2="${b2.x}" y2="${b2.y}" stroke="#1f3550" stroke-width="1.2"/>`);
  dimFrag.push(arrow(a2,b2)); dimFrag.push(arrow(b2,a2));
  const mx=(a2.x+b2.x)/2+(tdx||0), my=(a2.y+b2.y)/2+(tdy||0);
  track({x:mx-26,y:my-12}); track({x:mx+26,y:my+4});
  dimFrag.push(`<text x="${mx.toFixed(1)}" y="${my.toFixed(1)}" text-anchor="middle" font-family="FreeSans, Arial, sans-serif" font-size="13" font-weight="700" fill="#1f3550" paint-order="stroke" stroke="#fff" stroke-width="3">${text}</text>`);
};
isoDim([X0,YC,H_SUS],[X1,YC,H_SUS],[0,0,1.7],"5.00 מ'",0,-6);
isoDim([X0,YC,0],[X0,YC,H_SUS],[-1.4,0,0],"4.00 מ'",-10,0);
isoDim([X1,YC,H_CON],[X1,YC,H_SUS],[0,1.6,0],"2.50 מ'",18,4);
isoDim([X1,YC,0],[X1,YC,H_CON],[1.5,0,0],"1.50 מ'",14,4);

const labels = [
  { p: project((X0+X1)/2,YC,H_SUS+W/2), dx:0,  dy:-58, t:'צנרת פלדה "2', s:"DN50 · קו תלוי" },
  { p: project(X1,YC,vz+0.3),           dx:-74, dy:-8, t:"ברז שער", s:"ניתוק / בקרה" },
  { p: project(X1,YC,H_CON+0.45),       dx:6,  dy:70,  t:"עמדת תדלוק", s:"חיבור הזנה 1.5 מ'" }
];
const labelFrag = [];
for (const L of labels) {
  const tx=L.p.x+L.dx, ty=L.p.y+L.dy;
  track({x:tx-46,y:ty-16}); track({x:tx+46,y:ty+8});
  labelFrag.push(`<circle cx="${L.p.x.toFixed(1)}" cy="${L.p.y.toFixed(1)}" r="2.5" fill="#7d8b99"/>`);
  labelFrag.push(`<path d="M ${L.p.x.toFixed(1)} ${L.p.y.toFixed(1)} L ${tx.toFixed(1)} ${ty.toFixed(1)}" fill="none" stroke="#7d8b99" stroke-width="1" stroke-dasharray="3 3"/>`);
  labelFrag.push(`<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" font-family="FreeSans, Arial, sans-serif" font-size="13" font-weight="600" fill="#1f2d3d">${L.t}</text>`);
  labelFrag.push(`<text x="${tx.toFixed(1)}" y="${(ty+15).toFixed(1)}" text-anchor="middle" font-family="FreeSans, Arial, sans-serif" font-size="11" fill="#5b6b7b">${L.s}</text>`);
}

const pad = 60;
const vbX = bounds.minX - pad, vbY = bounds.minY - pad;
const vbW = bounds.maxX - bounds.minX + pad*2, vbH = bounds.maxY - bounds.minY + pad*2;
const outW = 1000, outH = Math.round(outW * vbH / vbW);

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}"
     viewBox="${vbX.toFixed(1)} ${vbY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}"
     font-family="FreeSans, Arial, sans-serif" direction="rtl">
  <rect x="${vbX.toFixed(1)}" y="${vbY.toFixed(1)}" width="${vbW.toFixed(1)}" height="${vbH.toFixed(1)}" fill="#f3f7fb"/>
  <g>${frag.join("")}</g>
  <g>${dimFrag.join("")}</g>
  <g>${labelFrag.join("")}</g>
</svg>
`;
writeFileSync(new URL("./isometry-piping.svg", import.meta.url), svg);
console.log(`wrote isometry-piping.svg  (${outW}x${outH}, viewBox ${vbW.toFixed(0)}x${vbH.toFixed(0)})`);
