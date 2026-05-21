// Renders a symbol legend (PNG) the user can reference when marking up a
// drawing: name or point at a symbol and Claude places it in the isometry.
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const PIPE = "#2f6fb0", INK = "#1f2d3d", SUB = "#5b6b7b";
const baseline = (cx, cy) =>
  `<line x1="${cx-78}" y1="${cy}" x2="${cx+78}" y2="${cy}" stroke="${PIPE}" stroke-width="6" stroke-linecap="round"/>`;
const poly = (pts, extra="") => `<polyline points="${pts}" fill="none" stroke="${INK}" stroke-width="3" ${extra}/>`;
const circle = (x,y,r,fill="none") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="3"/>`;

const symbols = [
  ["ברז שער", "Gate valve", (x,y)=>baseline(x,y)+poly(`${x-24},${y-20} ${x},${y} ${x-24},${y+20} ${x-24},${y-20}`)+poly(`${x+24},${y-20} ${x},${y} ${x+24},${y+20} ${x+24},${y-20}`)],
  ["ברז כדורי", "Ball valve", (x,y)=>baseline(x,y)+poly(`${x-24},${y-20} ${x},${y} ${x-24},${y+20} ${x-24},${y-20}`)+poly(`${x+24},${y-20} ${x},${y} ${x+24},${y+20} ${x+24},${y-20}`)+circle(x,y,10,"#fff")],
  ["ברז גלובוס", "Globe valve", (x,y)=>baseline(x,y)+poly(`${x-24},${y-20} ${x},${y} ${x-24},${y+20} ${x-24},${y-20}`)+poly(`${x+24},${y-20} ${x},${y} ${x+24},${y+20} ${x+24},${y-20}`)+circle(x,y,9,INK)],
  ["אל-חזור", "Check valve", (x,y)=>baseline(x,y)+poly(`${x-16},${y-18} ${x-16},${y+18} ${x+16},${y} ${x-16},${y-18}`)+`<line x1="${x+16}" y1="${y-18}" x2="${x+16}" y2="${y+18}" stroke="${INK}" stroke-width="3"/>`],
  ["פרפר", "Butterfly", (x,y)=>baseline(x,y)+poly(`${x-24},${y-20} ${x},${y} ${x-24},${y+20} ${x-24},${y-20}`)+poly(`${x+24},${y-20} ${x},${y} ${x+24},${y+20} ${x+24},${y-20}`)+`<line x1="${x-12}" y1="${y+16}" x2="${x+12}" y2="${y-16}" stroke="${INK}" stroke-width="3"/>`],
  ["משאבה", "Pump", (x,y)=>`<line x1="${x-78}" y1="${y}" x2="${x-24}" y2="${y}" stroke="${PIPE}" stroke-width="6"/><line x1="${x+24}" y1="${y}" x2="${x+78}" y2="${y}" stroke="${PIPE}" stroke-width="6"/>`+circle(x,y,24)+poly(`${x-10},${y-12} ${x-10},${y+12} ${x+14},${y} ${x-10},${y-12}`)],
  ["טי / הסתעפות", "Tee", (x,y)=>baseline(x,y)+`<line x1="${x}" y1="${y}" x2="${x}" y2="${y+30}" stroke="${PIPE}" stroke-width="6" stroke-linecap="round"/>`],
  ["קשת 90°", "Elbow", (x,y)=>`<polyline points="${x-30},${y-12} ${x},${y-12} ${x},${y+30}" fill="none" stroke="${PIPE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`],
  ["אוגן", "Flange", (x,y)=>baseline(x,y)+`<line x1="${x-7}" y1="${y-18}" x2="${x-7}" y2="${y+18}" stroke="${INK}" stroke-width="3"/><line x1="${x+7}" y1="${y-18}" x2="${x+7}" y2="${y+18}" stroke="${INK}" stroke-width="3"/>`],
  ["מעבר קוטר", "Reducer", (x,y)=>`<line x1="${x-78}" y1="${y}" x2="${x-22}" y2="${y}" stroke="${PIPE}" stroke-width="6"/><line x1="${x+22}" y1="${y}" x2="${x+78}" y2="${y}" stroke="${PIPE}" stroke-width="3"/>`+poly(`${x-22},${y-16} ${x+22},${y-7} ${x+22},${y+7} ${x-22},${y+16} ${x-22},${y-16}`)],
  ["מסנן", "Strainer", (x,y)=>baseline(x,y)+`<line x1="${x-14}" y1="${y}" x2="${x+10}" y2="${y+22}" stroke="${INK}" stroke-width="3"/><rect x="${x+6}" y="${y+16}" width="14" height="14" fill="none" stroke="${INK}" stroke-width="3" transform="rotate(45 ${x+13} ${y+23})"/>`],
  ["מד לחץ", "Gauge", (x,y)=>baseline(x,y)+`<line x1="${x}" y1="${y}" x2="${x}" y2="${y-18}" stroke="${INK}" stroke-width="3"/>`+circle(x,y-30,12)],
];

const COLS=3, CW=240, CH=180, PAD=40, HEAD=70;
const ROWS=Math.ceil(symbols.length/COLS);
const W=PAD*2+COLS*CW, H=HEAD+PAD+ROWS*CH;
let body="";
symbols.forEach((s,i)=>{
  const r=Math.floor(i/COLS), c=i%COLS;
  const x0=PAD+c*CW, y0=HEAD+r*CH, cx=x0+CW/2, cy=y0+CH/2-12;
  body+=`<rect x="${x0+10}" y="${y0+10}" width="${CW-20}" height="${CH-20}" rx="12" fill="#fff" stroke="#dbe4ee"/>`;
  body+=s[2](cx,cy);
  body+=`<text x="${cx}" y="${y0+CH-44}" text-anchor="middle" font-size="20" font-weight="700" fill="${INK}">${s[0]}</text>`;
  body+=`<text x="${cx}" y="${y0+CH-22}" text-anchor="middle" font-size="14" fill="${SUB}">${s[1]}</text>`;
});
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="FreeSans" direction="rtl"><rect width="100%" height="100%" fill="#eef3f8"/><text x="${PAD}" y="44" font-size="26" font-weight="700" fill="${INK}">מקרא סמלים — צנרת ואביזרים</text><text x="${PAD}" y="64" font-size="15" fill="${SUB}">סמן על השרטוט איפה, וכתוב/הצבע על השם — ואני אשתול את הסמל</text>${body}</svg>`;

const png=new Resvg(svg,{fitTo:{mode:"width",value:1200},
  font:{loadSystemFonts:true,defaultFontFamily:"FreeSans",
        fontFiles:["/usr/share/fonts/truetype/freefont/FreeSans.ttf","/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"]}}).render().asPng();
writeFileSync(new URL("./isometry-symbol-legend.png",import.meta.url),png);
console.log(`wrote isometry-symbol-legend.png (${W}x${H}, ${symbols.length} symbols)`);
