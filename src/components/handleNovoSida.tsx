import * as React from "react";
import{ useState } from "react";
import { FrontNovoSidaReport, Re } from "../app_functions/WSEventInfo_interfaces";
import axios from "axios";
import { DB } from "../app_functions/db";
import testData from './_test_data'

const parseDate = (date: string) => {
  const dma = date.split('/')
  const newdate = new Date(`${dma[2]}-${dma[1]}-${dma[0]}`)
  console.log('%cparseDate  ', 'background-color: "#ccc";', date, '-->', newdate)
  return newdate
}

export const NovoSidaConsulta = (props: {
  host: string;
  db: DB;
  eprocessoData: { [p: string]: unknown };
  situacoes: {[k: string]: string};
}) => {
  const [consultas, setConsultas] = useState<FrontNovoSidaReport[]>(testData)
  const [loading, setLoading] = useState<boolean>(false)
  const [consultou, setConsultou] = useState<boolean>(false)
  const textRef = React.useRef<HTMLTextAreaElement>()
  const trataEvent = (event: any) => {
    const info: FrontNovoSidaReport = event.detail;
    
    setConsultas((state) => {
      const newState = [...state, info]
      console.log("%cnewState:", 'background-color: green; color: white;', newState)
      return newState
    })
    
  }

  const copy = () => {
    textRef.current.focus()
    textRef.current.select()    
    document.execCommand("copy");
  }

  const inscritos = consultas.filter(c => c.ok).filter(c => c.res.every(i => parseDate(props.eprocessoData[c.processo]['Data Entrada Atividade']).valueOf() <= parseDate(i.dataInscricao).valueOf()))

  console.log('inscritos', inscritos)
  const removeListerners = () => {
    console.log('%cREMOVE LISTENERS INICIO', 'background-color: red; color: white;')
    window.removeEventListener("FRONT_NOVO_SIDA_REPORT", trataEvent);    
    setLoading(false)
    setConsultou(true)
    console.log('%cREMOVE LISTENERS FIM', 'background-color: red; color: white;')
  }

  const procura = async () => {
    console.log('%cPROCURA', 'background-color: red; color: white;')
    setLoading(true)    
    window.addEventListener("FRONT_NOVO_SIDA_REPORT", trataEvent)
    window.addEventListener("FRONT_END_SIDA_REPORT", removeListerners, {once: true})    
    const processosNumbersString = Object.keys(props.situacoes).filter(k => props.situacoes[k] === "AGUARDA INSCRIÇÃO").join("|")
    const resp = await axios.post(`${props.host}/novo_sida`, processosNumbersString);
    console.log('%cPROCURA -> fim', 'background-color: red; color: white;', resp)
  }


  return (
    <section className="container">
      {consultas.map(c => <Consulta key={c.processo} consulta={c} eprocDados={props.eprocessoData[c.processo]} arquiva={inscritos.filter(i => i.processo === c.processo).length > 0}/>)}      
      {!consultou && <button onClick={procura} className={`button ${loading ? 'is-loading' : ''}`}>Pesquisa Sida Novo</button>}
     { inscritos.length > 0 && <div className="level">
      <div className="level-item">
<textarea ref={textRef} className="textarea">
      {inscritos.map(c => c.processo).join(',')}
</textarea>
      </div>
      <div className="level-item">
        <button className="button" onClick={copy}>copy inscritos</button>
      </div>
      </div>}
    </section>
  )
}

const Consulta = React.memo((props: {
  consulta: FrontNovoSidaReport
  eprocDados: any
  arquiva: boolean
}) => {  
  
  
  return (    
  <div className="" style={{marginBottom: "2rem", backgroundColor: props.arquiva ? "#23d16047" : "#eee", padding: "0.8rem"}}>
    <div className="">    
    <p className="title is-5">{props.consulta.processo}</p>
    <p className="subtitle is-6">{props.eprocDados['Data Entrada Atividade']}</p>
    </div>
    <div className="">
    {props.consulta.res && <table className="table is-fullwidth">
      <tbody className="tbody">

      {props.consulta.res.map(r => <InscricaoInfo key={r.insc} inscricao={r} />)}
      </tbody>
      </table>}

    </div>
    
  </div>
  )
})

const InscricaoInfo = (props: {inscricao: Re, }) => {
  return (
    <tr>
      <td>{props.inscricao.inscricao}</td>
      <td>{props.inscricao.dataInscricao}</td>
      <td>{props.inscricao.situacao}</td>      
    </tr>
   
  )
}