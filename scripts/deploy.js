"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var path = require("path");
var os = require("os");
var destPath;
if (process.argv[2]) {
    destPath = path.resolve(__dirname, process.argv[2]);
}
else {
    destPath = path.resolve(os.homedir(), 'Documents', 'nova', 'front_build');
}
// const moveIfExistsFromBuildToStatic = fileToCopy => {
//   const from = path.resolve(__dirname, `../build/${fileToCopy}`)
//   if (fs.existsSync(from)) {
//     fs.renameSync(
//       from,
//       path.resolve(__dirname, `../build/static/${fileToCopy}`)
//     );
//   }
// }
console.info(process.argv[2], "-->", destPath);
// moveIfExistsFromBuildToStatic("pdf.min.js")
// moveIfExistsFromBuildToStatic("pdf.js")
// moveIfExistsFromBuildToStatic("pdf.worker.min.js")
// moveIfExistsFromBuildToStatic("pdf.worker.js")
fs.copy("./build", destPath)
    .then(function () { return console.log("Copiado ./build para " + destPath); })
    .then(injectIndex)["catch"](function (err) { return console.log(err); });
function injectIndex() {
    console.log("");
    var str = fs.readFileSync("./build/index.html").toString('utf-8');
    var regex = /<script>\s?window\.epro.*?<\/script>/gm;
    console.log(regex);
    str = str.replace(regex, "<script>window.eprocData={{.Data}};window.PORT_SERVER={{.Port}}</script>");
    str = str.replace("pdf.min.js", "static/pdf.min.js");
    str = str.replace("pdf.min.js", "static/pdf.js");
    str = str.replace("pdf.worker.min.js", "static/pdf.worker.min.js");
    str = str.replace("pdf.worker.min.js", "static/pdf.worker.js");
    console.log(str);
    fs.writeFileSync(path.join(destPath, "index.html"), str);
    console.log("Salvo!");
}
