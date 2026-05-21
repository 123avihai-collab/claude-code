// Builds a 2D isometric DXF (AutoCAD R12, units = millimetres) of the
// suspended 2" piping line, plus a PNG preview of the same linework.
// No external CAD libs: DXF is plain ASCII text we emit directly.
import { writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

// ---- isometric projection (mm in, mm out; CAD Y is up) ----------------
const C = Math.cos(Math.PI / 6), S = Math.sin(Math.PI / 6);
const pr = (x, y, z) => ({ x: (x - y) * C, y: z - (x + y) * S });

// ---- dimensions in mm --------------------------------------------------
const RUN = 5000, H_SUS = 4000, H_CON = 1500;
const AX = 0, RY = 0;                    // pipe centreline plane (y=0)
const A = [AX, RY, H_SUS];               // run start (open end)
const B = [AX + RUN, RY, H_SUS];         // elbow / riser top
const Cc = [AX + RUN, RY, H_CON];        // riser bottom / connection
const OD = 60;                           // 2" pipe OD (mm), symbolic
const VZ = (H_CON + H_SUS) / 2;          // gate valve centre on riser

// ---- ACI colour palette (for preview) ----------------------------------
const ACI = { 1:"#d33", 2:"#d9b400", 3:"#2e9e3f", 4:"#1aa3a3", 5:"#2f6fb0", 7:"#222", 8:"#888" };

// ---- primitive collectors ----------------------------------------------
const segs = [];   // {layer,color,x1,y1,x2,y2}  (CAD coords, mm, Y up)
const texts = [];  // {layer,color,x,y,h,s}
const ext = { minX:Infinity, minY:Infinity, maxX:-Infinity, maxY:-Infinity };
const grow = (x, y) => { if(x<ext.minX)ext.minX=x; if(y<ext.minY)ext.minY=y;
                         if(x>ext.maxX)ext.maxX=x; if(y>ext.maxY)ext.maxY=y; };
const seg = (layer, color, a, b) => { grow(a.x,a.y); grow(b.x,b.y);
  segs.push({layer,color,x1:a.x,y1:a.y,x2:b.x,y2:b.y}); };
const seg3 = (layer, color, P, Q) => seg(layer, color, pr(...P), pr(...Q));
const text = (layer, color, P, h, s) => { const p=pr(...P); grow(p.x,p.y);
  texts.push({layer,color,x:p.x,y:p.y,h,s}); };

// ---- pipe as double-line (tube look) -----------------------------------
const drawPipe = (P, Q, capStart, capEnd) => {
  const a = pr(...P), b = pr(...Q);
  const dx = b.x-a.x, dy = b.y-a.y, L = Math.hypot(dx,dy)||1;
  const nx = -dy/L*(OD/2), ny = dx/L*(OD/2);
  seg("PIPE", 5, {x:a.x+nx,y:a.y+ny}, {x:b.x+nx,y:b.y+ny});
  seg("PIPE", 5, {x:a.x-nx,y:a.y-ny}, {x:b.x-nx,y:b.y-ny});
  if (capStart) seg("PIPE", 5, {x:a.x+nx,y:a.y+ny}, {x:a.x-nx,y:a.y-ny});
  if (capEnd)   seg("PIPE", 5, {x:b.x+nx,y:b.y+ny}, {x:b.x-nx,y:b.y-ny});
};
drawPipe(A, B, true, false);             // horizontal run
drawPipe(B, Cc, false, true);            // riser
// centreline
seg3("PIPE-CL", 8, A, B); seg3("PIPE-CL", 8, B, Cc);
// elbow tick
seg3("PIPE", 5, [B[0]-OD/2,0,B[2]], [B[0],0,B[2]-OD/2]);

// ---- gate valve symbol (bowtie) on the riser ---------------------------
{ const bw = 95, hl = 160, cx = AX+RUN;
  const TL=[cx-bw,0,VZ+hl], TR=[cx+bw,0,VZ+hl], BL=[cx-bw,0,VZ-hl], BR=[cx+bw,0,VZ-hl], M=[cx,0,VZ];
  seg3("VALVE",2,TL,TR); seg3("VALVE",2,TL,M); seg3("VALVE",2,TR,M);
  seg3("VALVE",2,BL,BR); seg3("VALVE",2,BL,M); seg3("VALVE",2,BR,M);
}

// ---- dispenser as iso box wireframe (3 visible faces) ------------------
const boxWire = (layer,color,x0,y0,z0,x1,y1,z1) => {
  const e=(P,Q)=>seg3(layer,color,P,Q);
  e([x0,y0,z1],[x1,y0,z1]); e([x1,y0,z1],[x1,y1,z1]); e([x1,y1,z1],[x0,y1,z1]); e([x0,y1,z1],[x0,y0,z1]); // top
  e([x1,y0,z0],[x1,y1,z0]); e([x1,y1,z0],[x1,y1,z1]); e([x1,y0,z0],[x1,y0,z1]);                            // right
  e([x0,y1,z0],[x1,y1,z0]); e([x0,y1,z0],[x0,y1,z1]);                                                      // left
};
boxWire("EQUIP",1, AX+RUN-400, RY-400, 0,   AX+RUN+400, RY+400, H_CON);          // body
boxWire("EQUIP",1, AX+RUN-300, RY-300, H_CON, AX+RUN+300, RY+300, H_CON+350);    // head

// ---- support beam + hangers --------------------------------------------
boxWire("SUPPORT",8, AX-300, RY-120, H_SUS+300, AX+RUN+300, RY+120, H_SUS+550);
[1500,3000,4500].forEach(d => seg3("SUPPORT",8, [AX+d,0,H_SUS+300], [AX+d,0,H_SUS+30]));

// ---- dimension lines (mm) ----------------------------------------------
const arrow = (P, Q) => {                // small V arrowhead at P toward Q
  const dx=Q.x-P.x, dy=Q.y-P.y, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L, a=130, w=45;
  const bx=P.x+ux*a, by=P.y+uy*a;
  seg("DIM",3,P,{x:bx-uy*w,y:by+ux*w}); seg("DIM",3,P,{x:bx+uy*w,y:by-ux*w});
};
const isoDim = (P, Q, off, value) => {
  const p=pr(...P), q=pr(...Q);
  const p2=pr(P[0]+off[0],P[1]+off[1],P[2]+off[2]);
  const q2=pr(Q[0]+off[0],Q[1]+off[1],Q[2]+off[2]);
  seg("DIM",3,p,p2); seg("DIM",3,q,q2);       // witness
  seg("DIM",3,p2,q2);                          // dim line
  arrow(p2,q2); arrow(q2,p2);
  const mx=(p2.x+q2.x)/2, my=(p2.y+q2.y)/2;
  grow(mx,my);
  texts.push({layer:"DIM",color:3,x:mx,y:my+60,h:170,s:value});
};
isoDim(A, B, [0,0,1500], "5000");           // run length
isoDim([0,0,0], A, [-1400,0,0], "4000");    // suspension height
isoDim(Cc, B, [0,1700,0], "2500");          // riser drop
isoDim([AX+RUN,0,0], Cc, [1500,0,0], "1500"); // connection height

// ---- ASCII part labels (Hebrew omitted for CAD compatibility) ----------
text("TEXT",7, [AX+RUN*0.32,0,H_SUS+OD+260], 200, 'PIPE 2" (DN50)');
text("TEXT",7, [AX+RUN+450,0,VZ+260],        200, "GATE VALVE");
text("TEXT",7, [AX+RUN-1700,0,500],          200, "FUEL DISPENSER");

// ========================================================================
//  DXF writer (R12 / AC1009)
// ========================================================================
const layers = [
  ["PIPE",5],["PIPE-CL",8],["VALVE",2],["EQUIP",1],["SUPPORT",8],["DIM",3],["TEXT",7]
];
const N = (code, val) => `${code}\n${val}\n`;
let body = "";
for (const s of segs)
  body += N(0,"LINE")+N(8,s.layer)+N(62,s.color)
        + N(10,s.x1.toFixed(3))+N(20,s.y1.toFixed(3))+N(30,"0.0")
        + N(11,s.x2.toFixed(3))+N(21,s.y2.toFixed(3))+N(31,"0.0");
for (const t of texts)
  body += N(0,"TEXT")+N(8,t.layer)+N(62,t.color)
        + N(10,t.x.toFixed(3))+N(20,t.y.toFixed(3))+N(30,"0.0")
        + N(40,t.h.toFixed(1))+N(1,t.s)+N(7,"STANDARD")+N(50,"0.0");

let dxf = "";
dxf += N(0,"SECTION")+N(2,"HEADER")
     + N(9,"$ACADVER")+N(1,"AC1009")
     + N(9,"$INSUNITS")+N(70,4)
     + N(9,"$EXTMIN")+N(10,ext.minX.toFixed(3))+N(20,ext.minY.toFixed(3))+N(30,"0.0")
     + N(9,"$EXTMAX")+N(10,ext.maxX.toFixed(3))+N(20,ext.maxY.toFixed(3))+N(30,"0.0")
     + N(0,"ENDSEC");
dxf += N(0,"SECTION")+N(2,"TABLES");
dxf += N(0,"TABLE")+N(2,"LTYPE")+N(70,1)
     + N(0,"LTYPE")+N(2,"CONTINUOUS")+N(70,0)+N(3,"Solid line")+N(72,65)+N(73,0)+N(40,"0.0")
     + N(0,"ENDTAB");
dxf += N(0,"TABLE")+N(2,"LAYER")+N(70,layers.length);
for (const [name,color] of layers)
  dxf += N(0,"LAYER")+N(2,name)+N(70,0)+N(62,color)+N(6,"CONTINUOUS");
dxf += N(0,"ENDTAB");
dxf += N(0,"TABLE")+N(2,"STYLE")+N(70,1)
     + N(0,"STYLE")+N(2,"STANDARD")+N(70,0)+N(40,"0.0")+N(41,"1.0")+N(50,"0.0")
     + N(71,0)+N(42,"2.5")+N(3,"txt")+N(4,"")
     + N(0,"ENDTAB");
dxf += N(0,"ENDSEC");
dxf += N(0,"SECTION")+N(2,"ENTITIES")+body+N(0,"ENDSEC");
dxf += N(0,"EOF");

writeFileSync(new URL("./isometry-piping.dxf", import.meta.url), dxf);

// ---- PNG preview of the same linework ----------------------------------
const pad = 700, sc = 0.12;              // mm -> px
const W = (ext.maxX-ext.minX+pad*2)*sc, H = (ext.maxY-ext.minY+pad*2)*sc;
const X = x => (x-ext.minX+pad)*sc, Y = y => (ext.maxY-y+pad)*sc; // flip Y for SVG
let svgBody = "";
for (const s of segs)
  svgBody += `<line x1="${X(s.x1).toFixed(1)}" y1="${Y(s.y1).toFixed(1)}" x2="${X(s.x2).toFixed(1)}" y2="${Y(s.y2).toFixed(1)}" stroke="${ACI[s.color]||"#222"}" stroke-width="${s.layer==="PIPE"?2:1.4}"/>`;
for (const t of texts)
  svgBody += `<text x="${X(t.x).toFixed(1)}" y="${(Y(t.y)).toFixed(1)}" font-size="${(t.h*sc*1.2).toFixed(1)}" font-family="FreeSans" fill="${ACI[t.color]||"#222"}">${t.s.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W.toFixed(0)}" height="${H.toFixed(0)}" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}"><rect width="100%" height="100%" fill="#fbfcfe"/>${svgBody}</svg>`;
const png = new Resvg(svg, { fitTo:{mode:"width",value:1300},
  font:{loadSystemFonts:true,defaultFontFamily:"FreeSans",
        fontFiles:["/usr/share/fonts/truetype/freefont/FreeSans.ttf"]} }).render().asPng();
writeFileSync(new URL("./isometry-piping-dxf-preview.png", import.meta.url), png);

console.log(`DXF: ${segs.length} lines, ${texts.length} texts`);
console.log(`extents mm: x[${ext.minX.toFixed(0)}..${ext.maxX.toFixed(0)}] y[${ext.minY.toFixed(0)}..${ext.maxY.toFixed(0)}]`);
console.log(`preview ${W.toFixed(0)}x${H.toFixed(0)} -> isometry-piping-dxf-preview.png`);
