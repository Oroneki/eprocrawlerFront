import * as fs from 'fs-extra';
import * as path from 'path';

console.log(process.argv[2]);
fs.copy('./build', process.argv[2])
    .then(
        () => console.log(`Copiado ./build para ${process.argv[2]}`)
    )
    .then(injectIndex)
    .catch(
        err => console.log(err)
    );

function injectIndex() {
    console.log('');
    let str = fs.readFileSync('./build/index.html').toString();
    const regex = /<script>\s?window\.epro.*?<\/script>/gm;
    console.log(regex);
    str = str.replace(regex, `<script>window.eprocData={{.Data}};window.PORT_SERVER={{.Port}}</script>`);
    console.log(str);
    fs.writeFileSync(path.join(process.argv[2], 'index.html'), str);
    console.log('Salvo!');
}