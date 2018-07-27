import axios from 'axios';

export const getProcessoInfoSida = (host: string) => async (processosNumbers: string[]): Promise<any> => {
    console.log('pede');
    const processosNumbersString = processosNumbers.join('|');
    const resp = await axios.post(`${host}/pesquisa_sida_varios_processos`, processosNumbersString);
    // const data = {};    
    console.log('\n\n\n', resp.data, '\n\n\n\n');

    const finalInfo = {};

    const gruposDeProcessosArr = resp.data.split('###');

    for (const grupaoStr of gruposDeProcessosArr) {
        if (grupaoStr === '') { continue; }
        const grupinhoArr = grupaoStr.split('$$$');
        const processo = grupinhoArr[0];
        const objCaracteristicas = {};
        const linhas = grupinhoArr[1].split('\n');
        for (const linha of linhas) {
            if (linha === '') { continue; }
            const kv = linha.split('||>');
            objCaracteristicas[kv[0]] = kv[1];
        }
        finalInfo[processo] = objCaracteristicas;
    }

    console.log(finalInfo);
    
    return finalInfo;
};

export const getAguardaNumbersFromDB = async (db) => {
    const tudo = await db.getAll();
    return tudo.filter(p => p.situacao === 'AGUARDA INSCRIÇÃO')
        .map(obj => obj.numero);
};

export const verificaTudoNoSida = async (host, db) => {
    const lista = await getAguardaNumbersFromDB(db);
    console.log(lista);
    const infos = await getProcessoInfoSida(host)(lista);
    console.log('infos: ', infos);
    const quero = Object.keys(infos).map(k => ({...infos[k], proc: k}))
        .filter(obj => obj['Número de Inscrição:'] !== undefined)
        .sort((a, b) => {
            const dta = a['Data da Inscrição:'].split('/');
            const dtb = b['Data da Inscrição:'].split('/');
            return `${dta[2]}${dta[1]}${dta[0]}` > `${dtb[2]}${dtb[1]}${dtb[0]}` ? 1 : -1;            
        })
        .map(obj => {
            console.log(obj.proc, '\t', obj['Número de Inscrição:'], '\t', obj['Data da Inscrição:']);
            return obj.proc;
        });

    console.log('numero de processos inscritos:', quero.length);    
    console.log(quero.join(','));
};
