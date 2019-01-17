import * as React from 'react';
import { getProcessoInfoSidaNEW } from '../app_functions/getProcessoInfoSida';
import { parseSidaDate } from '../app_functions/parseDate';
// import { sidaTestJSONString } from '../app_functions/sidaResponseTypes';

interface InscParseada {
    cpfCnpj:                         string; // <<<
    dataInsc:                Date; // <<!!!! dataDaInscrição? |  dataInscrição?:
    procuradoriaResponsavel:         string; // <<<
    situacao:                        string; // <<<
    valorConsolidado:                string; // <<<
    valorInscrito:                   string; // <<<
    numInsc: string;
    foiDepois: boolean;
    
}

interface ProcessoParseado  {
    dataEntrada: Date;
    listaInscricoes: InscParseada[];
    processo:     string;
    qtdInscricoes:   number;
}

export interface SidaConsultaProps {
  host: any;
  db: any;
  list: any;
  eprocessoData: {[p: string]: any};
}

export interface SidaConsultaState {
  consultasDeProcesso: ProcessoParseado[];
  loading: boolean;
}

const InscricaoConsulta = (props: {
  inscricaoConsulta: InscParseada;
}) => {
  return (
        <tr>
            <td>
                <span className="">{props.inscricaoConsulta.numInsc}</span>
            </td>
            <td style={{width: '55%'}}>               
                <span className="is-small">{props.inscricaoConsulta.situacao}</span>
            </td>
            <td style={{width: '15%'}}>
                <span className="">{props.inscricaoConsulta.valorConsolidado}</span>
            </td>
            <td>
                <span className="">{(typeof props.inscricaoConsulta.dataInsc === 'object') ? 
                props.inscricaoConsulta.dataInsc.toLocaleDateString() : (new Date().toLocaleDateString())}</span>
            </td>
            <td>
                {props.inscricaoConsulta.foiDepois ?
                    (<span className="icon"><i className=" far fa-check-circle" /></span>) :
                    (<span className="icon"><i className=" fas fa-times-circle" /></span>)}
            </td>
        </tr>
    );
};

const ProcessoConsulta = (props: {
  consultaDeProcesso: ProcessoParseado;

}) => {

    const de = typeof props.consultaDeProcesso.dataEntrada === 'object' ?
        props.consultaDeProcesso.dataEntrada :
        Date.parse('2018-11-17T14:37:21.896Z');

    const diffDias = ((new Date().valueOf()) - de.valueOf()) / (60 * 60 * 24 * 1000); 

    console.log('diffDidas:', diffDias);

  // tslint:disable-next-line:align
  return (
      <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header" style={{ backgroundColor: 'rgb(225, 231, 236)' }}>
              <p className="card-header-title" style={{ fontSize: '1.2em' }}>
                  {props.consultaDeProcesso.processo}
              </p>
              {(props.consultaDeProcesso.listaInscricoes.length > 0) &&
                  props.consultaDeProcesso.listaInscricoes.every(i => i.foiDepois) &&
                  <span className="tag is-success">OK</span>}

              {(props.consultaDeProcesso.listaInscricoes.length === 0) &&
                  diffDias > 30 &&
                  <span className="icon has-text-danger"><i className="fas fa-exclamation-triangle" /></span>}
          </div>
          <div className="card-column">
              <table className="table is-bordered is-striped is-narrow is-fullwidth">
                  <tbody>
                      {props.consultaDeProcesso.listaInscricoes.map(i => (
                          <InscricaoConsulta key={i.numInsc} inscricaoConsulta={i} />
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );
};

export default class SidaConsulta extends React.Component<
  SidaConsultaProps,
  SidaConsultaState
> {
  constructor(props: SidaConsultaProps) {
    super(props);

    this.state = {
      consultasDeProcesso: [],
    //   consultasDeProcesso: sidaTestJSONString,
      loading: false
    };
  }

//   public consultaTest = () => this.setState({consultasDeProcesso: JSON.parse(sidaInitialStateForTesting) as any});

  public consulta = async () => {
    this.setState({ loading: true });
    // const consultasDeProcesso: ProcessoParseado[] = sidaInitialStateForTesting;
    const consultasDeProcesso = 
        await getProcessoInfoSidaNEW(this.props.host)(this.props.list);    
    const newConsultas: ProcessoParseado[] = consultasDeProcesso.map(c => {
        
        const d = parseSidaDate(this.props.eprocessoData[c.processo]['Data Entrada Atividade']);        
        
        return {
            listaInscricoes: c.listaInscrições.map(i => (
                {
                    foiDepois: d < i.dataInsc,                   
                    cpfCnpj: i.cpfCnpj,
                    dataInsc: i.dataInsc,
                    procuradoriaResponsavel: i.procuradoriaResponsável,
                    situacao: i.situação,
                    valorConsolidado: i.valorConsolidado,
                    valorInscrito: i.valorInscrito,
                    numInsc: i.numInsc,
                }
            )
            ),
            dataEntrada: d,
            processo: c.processo,
            qtdInscricoes:   c.qtdInscricoes,

        };
    });
    console.log('newConsultas: \n\n', newConsultas);
    console.log('newConsultas JSON: \n\n', JSON.stringify(newConsultas, undefined, 4));

    this.setState({ consultasDeProcesso: newConsultas, loading: false });
  }

  public render() {
    if (this.state.loading) {
      return <div className="container"> <button className="button is-loading">loadind</button></div>;
    }
    if (this.state.consultasDeProcesso.length === 0) {
      return (
        <div className="container"><button className="button" onClick={this.consulta}>
          Consultar Processos No Sida
        </button></div>
      );
    }
    return (
      <div className="container">      
        {this.state.consultasDeProcesso.map(p => (
          <ProcessoConsulta key={p.processo} consultaDeProcesso={p} />
        ))}
         <div className="level">
         <textarea className="textarea">
            {this.state.consultasDeProcesso
                .filter(p => p.listaInscricoes.length > 0)
                .filter(p => p.listaInscricoes.every(i => i.foiDepois))
                .map(p => p.processo)
                .join(',')}
        </textarea>
      </div>
      </div>
    );
  }
}
