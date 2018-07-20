"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var path = require("path");
console.log(process.argv[2]);
fs.copy('./build', process.argv[2])
    .then(function () { return console.log("Copiado ./build para " + process.argv[2]); })
    .then(injectIndex)["catch"](function (err) { return console.log(err); });
function injectIndex() {
    console.log('');
    var str = fs.readFileSync('./build/index.html').toString();
    var regex = /<script>\s?window\.epro.*?<\/script>/gm;
    console.log(regex);
    str = str.replace(regex, "<script>window.eprocData={{.Data}};window.PORT_SERVER={{.Port}}</script>");
    console.log(str);
    fs.writeFileSync(path.join(process.argv[2], 'index.html'), str);
    console.log('Salvo!');
}
