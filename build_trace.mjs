// Builds a high-res PNG and a vector PDF of the 2" piping isometry, sized
// as a clean reference to IMPORT INTO CONCEPTS and trace over (Concepts on
// Android imports only JPG/PNG/PSD/PDF — no vector import).
import { writeFileSync, createWriteStream } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import PDFDocument from "pdfkit";

// ---- isometric projection (mm, screen Y-down: works for SVG and PDF) ----
const C = Math.cos(Math.PI/6), S = Math.sin(Math.PI/6);
const pr = (x,y,z) => ({ x:(x-y)*C, y:(x+y)*S - z });   // mm

const COL = { pipe:"#2f6fb0", valve:"#caa000", equip:"#c0392b",
              support:"#8a939c", dim:"#2e7d32", text:"#1f2d3d" };

// ---- dimensions (mm) ----------------------------------------------------
const RUN=5000, H_SUS=4000, H_CON=1500, OD=60, VZ=(H_CON+H_SUS)/2;
const A=[0,0,H_SUS], B=[RUN,0,H_SUS], Cc=[RUN,0,H_CON];

// ---- primitive collectors (2D mm) ---------------------------------------
const segs=[], texts=[];
const bb={minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity};
const grow=(x,y)=>{ if(x<bb.minX)bb.minX=x; if(y<bb.minY)bb.minY=y;
                    if(x>bb.maxX)bb.maxX=x; if(y>bb.maxY)bb.maxY=y; };
const line=(a,b,c,w)=>{ grow(a.x,a.y); grow(b.x,b.y); segs.push({x1:a.x,y1:a.y,x2:b.x,y2:b.y,c,w}); };
const seg3=(P,Q,c,w)=>line(pr(...P),pr(...Q),c,w);
const txt=(P,h,s,c)=>{ const p=pr(...P); grow(p.x,p.y); texts.push({x:p.x,y:p.y,h,s,c}); };

const pipe=(P,Q,capS,capE)=>{
  const a=pr(...P),b=pr(...Q),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy)||1;
  const nx=-dy/L*OD/2, ny=dx/L*OD/2;
  line({x:a.x+nx,y:a.y+ny},{x:b.x+nx,y:b.y+ny},COL.pipe,18);
  line({x:a.x-nx,y:a.y-ny},{x:b.x-nx,y:b.y-ny},COL.pipe,18);
  if(capS) line({x:a.x+nx,y:a.y+ny},{x:a.x-nx,y:a.y-ny},COL.pipe,18);
  if(capE) line({x:b.x+nx,y:b.y+ny},{x:b.x-nx,y:b.y-ny},COL.pipe,18);
};
pipe(A,B,true,false); pipe(B,Cc,false,true);

// valve bowtie
{ const bw=95,hl=160,cx=RUN;
  const TL=[cx-bw,0,VZ+hl],TR=[cx+bw,0,VZ+hl],BL=[cx-bw,0,VZ-hl],BR=[cx+bw,0,VZ-hl],M=[cx,0,VZ];
  [[TL,TR],[TL,M],[TR,M],[BL,BR],[BL,M],[BR,M]].forEach(([p,q])=>seg3(p,q,COL.valve,18)); }

// dispenser + head wireframe
const boxWire=(x0,y0,z0,x1,y1,z1,c)=>{ const e=(P,Q)=>seg3(P,Q,c,14);
  e([x0,y0,z1],[x1,y0,z1]);e([x1,y0,z1],[x1,y1,z1]);e([x1,y1,z1],[x0,y1,z1]);e([x0,y1,z1],[x0,y0,z1]);
  e([x1,y0,z0],[x1,y1,z0]);e([x1,y1,z0],[x1,y1,z1]);e([x1,y0,z0],[x1,y0,z1]);
  e([x0,y1,z0],[x1,y1,z0]);e([x0,y1,z0],[x0,y1,z1]); };
boxWire(RUN-400,-400,0,RUN+400,400,H_CON,COL.equip);
boxWire(RUN-300,-300,H_CON,RUN+300,300,H_CON+350,COL.equip);

// support beam + hangers
boxWire(-300,-120,H_SUS+300,RUN+300,120,H_SUS+550,COL.support);
[1500,3000,4500].forEach(d=>seg3([d,0,H_SUS+300],[d,0,H_SUS+30],COL.support,12));

// dimensions
const arrow=(P,Q)=>{ const dx=Q.x-P.x,dy=Q.y-P.y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,a=130,w=45;
  const bx=P.x+ux*a,by=P.y+uy*a;
  line(P,{x:bx-uy*w,y:by+ux*w},COL.dim,12); line(P,{x:bx+uy*w,y:by-ux*w},COL.dim,12); };
const isoDim=(P,Q,off,val)=>{ const p=pr(...P),q=pr(...Q);
  const p2=pr(P[0]+off[0],P[1]+off[1],P[2]+off[2]), q2=pr(Q[0]+off[0],Q[1]+off[1],Q[2]+off[2]);
  line(p,p2,COL.dim,12); line(q,q2,COL.dim,12); line(p2,q2,COL.dim,12);
  arrow(p2,q2); arrow(q2,p2);
  grow((p2.x+q2.x)/2,(p2.y+q2.y)/2);
  texts.push({x:(p2.x+q2.x)/2, y:(p2.y+q2.y)/2-90, h:200, s:val, c:COL.dim}); };
isoDim(A,B,[0,0,1500],"5000");
isoDim([0,0,0],A,[-1400,0,0],"4000");
isoDim(Cc,B,[0,1700,0],"2500");
isoDim([RUN,0,0],Cc,[1500,0,0],"1500");

// labels (ASCII)
txt([RUN*0.32,0,H_SUS+OD+300],230,'PIPE 2" (DN50)',COL.text);
txt([RUN+520,0,VZ+300],230,"GATE VALVE",COL.text);
txt([RUN-2000,0,500],230,"FUEL DISPENSER",COL.text);

// ---- layout / scaling ---------------------------------------------------
const MARGIN = 600;  // mm
const w = bb.maxX-bb.minX+MARGIN*2, h = bb.maxY-bb.minY+MARGIN*2;
const ox = -bb.minX+MARGIN, oy = -bb.minY+MARGIN;       // shift to positive

// ===== high-res PNG (via SVG + resvg) ===================================
let body="";
for(const s of segs)
  body+=`<line x1="${(s.x1+ox).toFixed(1)}" y1="${(s.y1+oy).toFixed(1)}" x2="${(s.x2+ox).toFixed(1)}" y2="${(s.y2+oy).toFixed(1)}" stroke="${s.c}" stroke-width="${s.w}" stroke-linecap="round"/>`;
for(const t of texts)
  body+=`<text x="${(t.x+ox).toFixed(1)}" y="${(t.y+oy).toFixed(1)}" font-size="${t.h}" font-family="FreeSans" font-weight="700" fill="${t.c}" text-anchor="middle">${t.s.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</text>`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w.toFixed(0)}" height="${h.toFixed(0)}" viewBox="0 0 ${w.toFixed(0)} ${h.toFixed(0)}"><rect width="100%" height="100%" fill="#ffffff"/>${body}</svg>`;
const png=new Resvg(svg,{fitTo:{mode:"width",value:2800},
  font:{loadSystemFonts:true,defaultFontFamily:"FreeSans",
        fontFiles:["/usr/share/fonts/truetype/freefont/FreeSans.ttf","/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"]}}).render().asPng();
writeFileSync(new URL("./isometry-piping-trace.png",import.meta.url),png);

// ===== vector PDF (PDFKit; PDF is also Y-down top-left) ==================
const PT = 720 / w;                       // scale mm -> points (page ~720pt wide)
const doc = new PDFDocument({ size:[w*PT, h*PT], margin:0 });
const out = createWriteStream(new URL("./isometry-piping-trace.pdf",import.meta.url));
const done = new Promise(r=>out.on("finish",r));
doc.pipe(out);
doc.rect(0,0,w*PT,h*PT).fill("#ffffff");
for(const s of segs)
  doc.save().lineWidth(Math.max(0.6,s.w*PT)).strokeColor(s.c).lineCap("round")
     .moveTo((s.x1+ox)*PT,(s.y1+oy)*PT).lineTo((s.x2+ox)*PT,(s.y2+oy)*PT).stroke().restore();
for(const t of texts){
  const fs=t.h*PT;
  doc.fillColor(t.c).font("Helvetica-Bold").fontSize(fs)
     .text(t.s, (t.x+ox)*PT - 200, (t.y+oy)*PT - fs*0.5, {width:400, align:"center", lineBreak:false});
}
doc.end();
await done;

console.log(`trace assets: ${segs.length} lines, ${texts.length} texts`);
console.log(`PNG 2800px wide, PDF ${(w*PT).toFixed(0)}x${(h*PT).toFixed(0)}pt`);
