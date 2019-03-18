"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var path = require("path");
var destPath = path.resolve(__dirname, process.argv[2]);
if (!fs.existsSync(destPath)) {
    console.info(">", destPath, "não existe.");
    process.exit(1);
}
console.log(process.argv[2], "-->", destPath);
fs.copy("./build", destPath)
    .then(function () { return console.log("Copiado ./build para " + destPath); })
    .then(injectIndex)["catch"](function (err) { return console.log(err); });
function injectIndex() {
    console.log("");
    var str = fs.readFileSync("./build/index.html").toString();
    var regex = /<script>\s?window\.epro.*?<\/script>/gm;
    console.log(regex);
    str = str.replace(regex, "<script>window.eprocData={{.Data}};window.PORT_SERVER={{.Port}}</script>");
    console.log(str);
    fs.writeFileSync(path.join(process.argv[2], "index.html"), str);
    console.log("Salvo!");
}
