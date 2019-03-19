import * as fs from "fs-extra";
import * as path from "path";

const destPath = path.resolve(__dirname, process.argv[2]);

console.info(process.argv[2], "-->", destPath);

fs.renameSync(
  path.resolve(__dirname, "../build/pdf.min.js"),
  path.resolve(__dirname, "../build/static/pdf.min.js")
);

fs.renameSync(
  path.resolve(__dirname, "../build/pdf.worker.min.js"),
  path.resolve(__dirname, "../build/static/pdf.worker.min.js")
);

fs.copy("./build", destPath)
  .then(() => console.log(`Copiado ./build para ${destPath}`))
  .then(injectIndex)
  .catch(err => console.log(err));

function injectIndex() {
  console.log("");
  let str = fs.readFileSync("./build/index.html").toString();
  const regex = /<script>\s?window\.epro.*?<\/script>/gm;
  console.log(regex);
  str = str.replace(
    regex,
    `<script>window.eprocData={{.Data}};window.PORT_SERVER={{.Port}}</script>`
  );
  str = str.replace(`pdf.min.js`, `static/pdf.min.js`);
  str = str.replace(`pdf.worker.min.js`, `static/pdf.worker.min.js`);
  console.log(str);
  fs.writeFileSync(path.join(destPath, "index.html"), str);
  console.log("Salvo!");
}
