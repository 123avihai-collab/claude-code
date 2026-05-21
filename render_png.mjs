import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync(new URL("./isometry-piping.svg", import.meta.url));
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1400 },
  background: "#f3f7fb",
  font: {
    loadSystemFonts: true,
    defaultFontFamily: "FreeSans",
    fontFiles: [
      "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
      "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
    ]
  }
});
const png = resvg.render().asPng();
writeFileSync(new URL("./isometry-piping.png", import.meta.url), png);
console.log(`wrote isometry-piping.png (${png.length} bytes)`);
