import * as React from 'react';
import { dataSitu } from '../App';
import { getDigito } from '../app_functions/getDigitoCPF_CNPJ';
import Context from '../context';

interface ProcessoProps {
    procObj: {
        'Assunto COMPROT'?: string;
        'CPF Responsável Atual'?: string;
        'CPF Responsável Último'?: string;
        'CPF/CNPJ Corresponsável'?: string;
        'CPF/CNPJ Devedor Principal'?: string;
        'Código da Equipe Atual'?: string;
        'Código de Receita na Dívida Ativa'?: string;
        'DEBCAD'?: string;
        'Data Distribuição Última'?: string;
        'Data Entrada Atividade'?: string;
        'Data Entrada Unidade'?: string;
        'Data Situação da Inscrição'?: string;
        'Data da Atualização do Valor Atualizado da Inscrição'?: string;
        'Data da Inscrição'?: string;
        'Data do Protocolo'?: string;
        'Idade Contribuinte'?: string;
        'Indicador Grande Devedor'?: string;
        'Indicadores'?: string;
        'Informações'?: string;
        'NI Contribuinte'?: string;
        'Nome Atividade Atual'?: string;
        'Nome Atividade Última'?: string;
        'Nome Contribuinte'?: string;
        'Nome Equipe Atual'?: string;
        'Nome Equipe Última'?: string;
        'Nome Responsável'?: string;
        'Nome Tarefa Atual'?: string;
        'Nome Unidade Atual'?: string;
        'Nome Unidade Última'?: string;
        'Nome Último Documento Confirmado'?: string;
        'Número Processo'?: string;
        'Número da Inscrição Derivada'?: string;
        'Número de Inscrição'?: string;
        'Número do Processo Judicial'?: string;
        'Número do Processo Judicial da Inscrição'?: string;
        'Número do Requerimento (SICAR-PGFN)'?: string;
        'Porte Contribuinte'?: string;
        'Processos Vinculados'?: string;
        'Procuradoria Responsável'?: string;
        'Procuradoria de Inscrição'?: string;
        'Quantidade Volumes'?: string;
        'Saldo na Situação Atual (Multa de Ofício)'?: string;
        'Saldo na Situação Atual (Principal)'?: string;
        'Situação'?: string;
        'Situação da Inscrição'?: string;
        'Tipo Processo'?: string;
        'Todos'?: string;
        'Tributo'?: string;
        'Valor Atualizado da Inscrição'?: string;
        'Valor Originário Lançado/Pleiteado (Principal)'?: string;
        'Valor Processo'?: string;
        'Valor Total das Inscrições'?: string;
        'Valor do Crédito Consolidado'?: string;
        'Valor do Crédito Lançado (Multa de Ofício)'?: string;
        [dataSitu]?: Date;
    };
    processo: string;
}

const stringToNumber = (s: string) => {
    let arr = Array.from(s);
    const num = arr.reduce((pr, cu, i) => { return (cu.charCodeAt(0) + pr); }, 0);
    return num % 360;
};

const getColor = (situacao: string) => {
    let num = stringToNumber(situacao);
    let color = `hsla(${num}, 100%, 96%, 0.9)`;
    return color;
};

const Processo: React.SFC<ProcessoProps> = React.memo((props) => {
    let { processo, procObj } = props;
    if (!procObj) {
        procObj = {};
    }
    const ultres = procObj['Nome Responsável'] || '';
    const tarefa = procObj['Nome Tarefa Atual'] || '';
    const dataEntrada = procObj['Data Entrada Atividade'] || '';
    let dataSituacao = procObj[dataSitu];
    let numeroBelo = processo;
    if (procObj && procObj['Número Processo']) {
        numeroBelo = (procObj['Número Processo'] as string).replace('D', '').trim();
    }

    const hojeVal = new Date().valueOf();
    const dataEntraSplitted = dataEntrada.split('/');
    const dataEntradaDate = new Date(`${dataEntraSplitted[1]}/${dataEntraSplitted[0]}/${dataEntraSplitted[2]}`);
    const ehAntigaClassificacao = dataSituacao &&
        (hojeVal - dataSituacao.valueOf()) > 1000 * 60 * 60 * 24 * 20; // 30d 
    const opa = dataSituacao &&
        (dataSituacao.valueOf() - dataEntradaDate.valueOf()) < (1000 * 60 * 60); //
    const ehAntigoProcesso =
        Math.floor((hojeVal - dataEntradaDate.valueOf()) / (1000 * 60 * 60 * 24)); // 30d 
    const digito = procObj && procObj['NI Contribuinte'] && getDigito(procObj['NI Contribuinte']);
    const cpfCnpj = procObj && procObj['NI Contribuinte'];

    return (
        <Context.Consumer>
            {({
                selecionado,
                situacao,
                loadPDF,
                setState,
                focaNaDivPrincipal,
                manejo,
            }) => {
                return (
                    <span
                        className="processo-div-component"
                    >
                        {(ehAntigaClassificacao || ehAntigoProcesso > 28 || opa) && <span
                            className="obsdata1"
                        >
                            {ehAntigaClassificacao && 'Class Antiga\n |'}
                            {ehAntigoProcesso > 28 && 'Processo Antigo (' + ehAntigoProcesso + 'd)\n | '}
                            {opa && <span className="opa">OPA!</span>}
                        </span>}
                        <span
                            className="span-processo-title"
                            style={selecionado === processo ? {
                                color: 'rgb(255, 255, 255)',
                                fontSize: '1.2em',
                                backgroundColor: '#f20052'
                            } : {}}
                            onClick={() => {
                                loadPDF(processo);
                                setState({ selecionado: processo }, focaNaDivPrincipal);
                            }}
                        >{numeroBelo}

                        </span>{situacao[processo] &&
                            <div
                                className="div-processo-caracteristicas div-wrap-flex"
                                style={{
                                    backgroundColor: getColor(situacao[processo]),
                                    border: '2px solid rgb(178, 189, 239)',
                                    borderRadius: '12px',
                                    fontSize: '0.6em',
                                }}
                            >
                                {situacao[processo]}
                            </div>}
                        {ultres && <div className="div-processo-caracteristicas div-wrap-flex">
                            {ultres.split(' ')[0]}
                        </div>}
                        {tarefa && <div className="div-processo-caracteristicas div-wrap-flex">
                            {tarefa}
                        </div>}
                        {(situacao[processo] === 'REQUERIMENTOS') &&
                            <div className="div-processo-caracteristicas div-wrap-flex">
                                {cpfCnpj}{' '}<div className="div-processo-caracteristicas-digito">{digito}</div>
                            </div>}

                        {dataSituacao &&
                            <div
                                className="div-processo-caracteristicas div-wrap-flex"
                                style={{ fontSize: '0.8em' }}
                            >
                                {dataSituacao.toLocaleDateString()}
                            </div>
                        }
                        {dataEntrada &&
                            <div
                                className="div-processo-caracteristicas div-wrap-flex"
                                style={{ fontSize: '0.85em' }}
                            >
                                {dataEntrada}{' '}({ehAntigoProcesso}d)
                            </div>
                        }
                        {manejo.copiados.has(processo) && !manejo.deletadosOk.has(processo) &&
                            <div
                                className="div-processo-caracteristicas div-wrap-flex obscopiado"
                            >
                                COPIADO
                    </div>}
                        {manejo.errosDelete.has(processo) &&
                            <div
                                className="div-processo-caracteristicas div-wrap-flex obserro"
                            >
                                ERRO DELETE :(
                    </div>}
                        {manejo.deletadosOk.has(processo) &&
                            <div
                                className="div-processo-caracteristicas div-wrap-flex obsdeletado"
                            >
                                DELETADO
                    </div>}

                    </span>
                );
            }}
        </Context.Consumer>
    );
});
export default Processo;