import * as React from 'react';
import Context from '../context';

interface ProcessoProps {
    procObj: {
        'assunto comprot'?: string;
        'c_digo da equipe atual'?: string;
        'c_digo de receita na d_vida ativa'?: string;
        'cpf respons_vel _ltimo'?: string;
        'cpf respons_vel atual'?: string;
        'cpf_cnpj correspons_vel'?: string;
        'cpf_cnpj devedor principal'?: string;
        'data da atualiza__o do valor atualizado da inscri_…'?: string;
        'data da inscri__o'?: string;
        'data distribui__o _ltima'?: string;
        'data do protocolo'?: string;
        'data entrada atividade'?: string;
        'data entrada unidade'?: string;
        'data situa__o da inscri__o'?: string;
        'debcad'?: string;
        'idade contribuinte'?: string;
        'indicador grande devedor'?: string;
        'indicadores'?: string;
        'informa__es'?: string;
        'n_mero da inscri__o derivada'?: string;
        'n_mero de inscri__o'?: string;
        'n_mero do processo judicial'?: string;
        'n_mero do processo judicial da inscri__o'?: string;
        'n_mero do requerimento _sicar_pgfn_'?: string;
        'n_mero processo'?: string;
        'ni contribuinte'?: string;
        'nome _ltimo documento confirmado'?: string;
        'nome atividade _ltima'?: string;
        'nome atividade atual'?: string;
        'nome contribuinte'?: string;
        'nome equipe _ltima'?: string;
        'nome equipe atual'?: string;
        'nome respons_vel'?: string;
        'nome tarefa atual'?: string;
        'nome unidade _ltima'?: string;
        'nome unidade atual'?: string;
        'porte contribuinte'?: string;
        'processos vinculados'?: string;
        'procuradoria de inscri__o'?: string;
        'procuradoria respons_vel'?: string;
        'quantidade volumes'?: string;
        'saldo na situa__o atual _multa de of_cio_'?: string;
        'saldo na situa__o atual _principal_'?: string;
        'situa__o'?: string;
        'situa__o da inscri__o'?: string;
        'tipo processo'?: string;
        'todos'?: string;
        'tributo'?: string;
        'valor atualizado da inscri__o'?: string;
        'valor do cr_dito consolidado'?: string;
        'valor do cr_dito lan_ado _multa de of_cio_'?: string;
        'valor origin_rio lan_ado_pleiteado _principal_'?: string;
        'valor processo'?: string;
        'valor total das inscri__es'?: string;
    };
    processo: string;
}
const Processo: React.SFC<ProcessoProps> = (props) => {
    const { processo, procObj } = props;
    const ultres = procObj['nome respons_vel'];
    const tarefa = procObj['nome tarefa atual'];
    let numeroBelo = processo;
    if (procObj && procObj['n_mero processo']) {
        numeroBelo = (procObj['n_mero processo'] as string).replace('D', '').trim();
    }
    return (
        <Context.Consumer>
        {({
            selecionado, 
            situacao,
            loadPDF,
        }) => {
            return (
            <span 
                className="processo-div-component"
            >
                
                <span
                    className="span-processo-title"                    
                    style={selecionado === processo ? {color: 'rgb(0, 125, 89)'} : {}}
                    onClick={() => loadPDF(processo)}
                >{numeroBelo}
                </span>
                    {situacao[processo] && 
                    <div 
                        className="div-processo-caracteristicas div-wrap-flex"
                        style={{border: '2px solid black'}}
                    >
                        {situacao[processo]}
                    </div>}
                    {ultres && <div className="div-processo-caracteristicas div-wrap-flex">
                        {ultres.split(' ')[0]}
                    </div>}
                    {tarefa && <div className="div-processo-caracteristicas div-wrap-flex">
                        {tarefa}
                    </div>}

            </span>
        );
        }}
        </Context.Consumer>
    );
};
export default Processo;