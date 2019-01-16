import * as React from 'react';
import {
  SidaConsultaVariosProcessosJSONResponseSingle,
  ConsultaInscricaoSida,
} from '../app_functions/sidaResponseTypes';
import { getProcessoInfoSidaNEW } from '../app_functions/getProcessoInfoSida';
import { parseSidaDate } from '../app_functions/parseDate';

interface InscParseada extends ConsultaInscricaoSida {
    foiDepois: boolean;
}

interface ProcessoParseado extends SidaConsultaVariosProcessosJSONResponseSingle {
    dataEntrada: Date;
    listaInscrições: InscParseada[];
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
            <td>               
                <span className="">{props.inscricaoConsulta.situação}</span>
            </td>
            <td>
                <span className="">{props.inscricaoConsulta.valorConsolidado}</span>
            </td>
            <td>
                <span className="">{props.inscricaoConsulta.dataInsc.toLocaleDateString()}</span>
            </td>
            <td>
                {props.inscricaoConsulta.foiDepois ?
                    (<i className=" far fa-check-circle" />) :
                    (<i className=" fas fa-times-circle" />)}
            </td>
        </tr>
    );
};

const ProcessoConsulta = (props: {
  consultaDeProcesso: ProcessoParseado;
}) => {
  return (
    <div className="level">
    <div className="columns" style={{marginBottom: '20px'}}>
    <div className="column">
        <h3 className="title is-4">
                  {props.consultaDeProcesso.processo}</h3> (
        <span className="is-small">{props.consultaDeProcesso.qtdInscricoes || 0}</span>)
      
              {props.consultaDeProcesso.listaInscrições.every(i => i.foiDepois) &&
                  <span className="tag is-success">OK</span>}
    </div>
    <div className="column">
          <table className="table is-bordered is-striped is-narrow is-fullwidth">
          <tbody>

              {props.consultaDeProcesso.listaInscrições.map(i => (
                  <InscricaoConsulta key={i.numInsc} inscricaoConsulta={i} />
                  ))}
            </tbody>
          </table>
          </div>
    </div>
    <hr className="hr"/>
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
      loading: false
    };
  }

//   public consultaTest = () => this.setState({consultasDeProcesso: JSON.parse(sidaInitialStateForTesting) as any});

  public consulta = async () => {
    this.setState({ loading: true });
    // const consultasDeProcesso: ProcessoParseado[] = sidaInitialStateForTesting;
    const consultasDeProcesso = 
        await getProcessoInfoSidaNEW(this.props.host)(this.props.list);    
    const newConsultas = consultasDeProcesso.map(c => {
        
        const d = parseSidaDate(this.props.eprocessoData[c.processo]['Data Entrada Atividade']);        
        
        return {
            ...c,            
            listaInscrições: c.listaInscrições.map(i => ({...i, foiDepois: d < i.dataInsc})),
            dataEntrada: d,
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
                .filter(p => p.listaInscrições
                    .every(i => i.foiDepois))
                    .map(p => p.processo)
                    .join(',')}
        </textarea>
      </div>
      </div>
    );
  }
}
