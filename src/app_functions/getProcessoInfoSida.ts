import axios from 'axios';
import { 
    SidaConsultaVariosProcessosJSONResponseSingle,
     ListaInscricoesBefore,
      SidaConsultaVariosProcessosJSONResponseSingleBefore,
      ConsultaInscricaoSida,

     } from './sidaResponseTypes';
import { parseSidaDate } from './parseDate';

export const getProcessoInfoSida = (host: string) => async (processosNumbers: string[]): Promise<void> => {
    // console.log('pede');
    const processosNumbersString = processosNumbers.join('|');
    await axios.post(`${host}/pesquisa_sida_varios_processos`, processosNumbersString);
    // const data = {};    
    // console.log('\n\n\n', resp.data, '\n\n\n\n');
    
};

export const getProcessoInfoSidaNEW = 
    (host: string) => async (processosNumbers: string[]): Promise<SidaConsultaVariosProcessosJSONResponseSingle[]> => {
    // console.log('getProcessoInfoSidaNEW');
    const processosNumbersString = processosNumbers.join('|');
    const resp = await axios.post(`${host}/novo_sida`, processosNumbersString);
    
    console.log("%cCONSULTA", "background-color: yellow")
    console.warn('\n\n\n **** getProcessoInfoSidaNEW\n', resp.data, '\n\n\n\n');

    const filteredArray: SidaConsultaVariosProcessosJSONResponseSingle[] = 
        resp.data.map((el: SidaConsultaVariosProcessosJSONResponseSingleBefore) => {
         
        const inscricoes: ConsultaInscricaoSida[] = 
            el.lista_inscrições.map((ins: ListaInscricoesBefore) => {
            const dataObj = ins['Data Inscrição'] || ins['Data da Inscrição'] || null;
            const numInsc = ins['Nº Inscrição'] || ins['Número de Inscrição'] || '';
            
            return {
                cpfCnpj: ins['CPF/CNPJ'],
                dataInsc: parseSidaDate(dataObj!),
                procuradoriaResponsável: ins['Procuradoria Responsável'],
                situação: ins.Situação,
                valorConsolidado: ins['Valor Consolidado'],
                valorInscrito: ins['Valor Inscrito'],
                numInsc,
            };
        });
        return {
            listaInscrições: inscricoes,
            processo: el.processo_key,
            qtdInscricoes: el.qtd_inscricoes,
        };

    });
    // console.log('transformado -> ', filteredArray);
    return filteredArray;
    
};

export const getAguardaNumbersFromDB = async (db, list) => {
    const tudo = await db.getAll();
    const quaseTudo = tudo.filter(p => p.situacao === 'AGUARDA INSCRIÇÃO' && list.includes(p.numero))
        .map(obj => obj.numero);
    // console.log('quaseTudo -> ', quaseTudo.length, 'processos. --> ', quaseTudo);
    return quaseTudo;
};

// export const verificaTudoNoSida = async (host, db, list) => {
//     const lista = await getAguardaNumbersFromDB(db, list);
//     // console.log(lista);
//     const infos = await getProcessoInfoSida(host)(lista);
//     // console.log('infos: ', infos);
//     Object.keys(infos).map(k => ({...infos[k], proc: k}))
//         .filter(obj => obj['Número de Inscrição:'] !== undefined)
//         .sort((a, b) => {
//             const dta = a['Data da Inscrição:'].split('/');
//             const dtb = b['Data da Inscrição:'].split('/');
//             return `${dta[2]}${dta[1]}${dta[0]}` > `${dtb[2]}${dtb[1]}${dtb[0]}` ? 1 : -1;            
//         })
//         .map(obj => {
//             // console.log(obj.proc, '\t', obj['Número de Inscrição:'], '\t', obj['Data da Inscrição:']);
//             return obj.proc;
//         });

//     // console.log('numero de processos inscritos:', quero.length);    
//     // console.log(quero.join(','));
// };

export const verificaTudoNoSidaNEW = async (host, db, list) => {
    const lista = await getAguardaNumbersFromDB(db, list);
    // console.log('lista_db: ', lista);
    await getProcessoInfoSidaNEW(host)(lista);
    // console.log('infos: ', infos);
    
};

export const initSidaWindowApenas = async (host) => {
    return axios.get(`${host}/abre_sida_window`);
};
