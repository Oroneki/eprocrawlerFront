import * as React from 'react';
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
    };
    processo: string;
}

const stringToNumber = (s: string) => {
    let arr = Array.from(s);
    const num = arr.reduce((pr, cu, i) => {return (cu.charCodeAt(0) + pr); } , 0);
    return num % 360;
};

const getColor = (situacao: string) => {
    let num = stringToNumber(situacao);    
    let color = `hsla(${num}, 100%, 96%, 0.9)`;
    return color;
};

const Processo: React.SFC<ProcessoProps> = (props) => {
    const { processo, procObj } = props;
    const ultres = procObj['Nome Responsável'];
    const tarefa = procObj['Nome Tarefa Atual'];
    const dataEntrada = procObj['Data Entrada Atividade'];
    let numeroBelo = processo;
    if (procObj && procObj['Número Processo']) {
        numeroBelo = (procObj['Número Processo'] as string).replace('D', '').trim();
    }
    return (
        <Context.Consumer>
        {({
            selecionado, 
            situacao,
            loadPDF,
            setState, 
            focaNaDivPrincipal
        }) => {
            return (
            <span 
                className="processo-div-component"   
                
            >
                
                <span
                    className="span-processo-title"                    
                    style={selecionado === processo ? {color: 'rgb(0, 125, 89)'} : {}}
                    onClick={() => {
                        loadPDF(processo);
                        setState({selecionado: processo}, focaNaDivPrincipal);
                    }}
                >{numeroBelo}
                </span>
                    {situacao[processo] && 
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
                    {dataEntrada && 
                        <div 
                            className="div-processo-caracteristicas div-wrap-flex"
                            style={{fontSize: '0.85em'}}
                        >
                        {dataEntrada}
                        </div>
                         }

            </span>
        );
        }}
        </Context.Consumer>
    );
};
export default Processo;