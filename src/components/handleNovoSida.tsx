import * as React from "react";
import { useState } from "react";
import { FrontNovoSidaReport, Re } from "../app_functions/WSEventInfo_interfaces";
import axios from "axios";
import { DB } from "../app_functions/db";

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
  situacoes: { [k: string]: string };
}) => {
  const [consultas, setConsultas] = useState<FrontNovoSidaReport[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [consultou, setConsultou] = useState<boolean>(false)
  const [inscritos, setInstritos] = useState<FrontNovoSidaReport[]>([])
  const textRef = React.useRef<HTMLTextAreaElement>()
  const trataEvent = (event: any) => {
    const info: FrontNovoSidaReport = event.detail;

    setConsultas((state) => {
      const newState = [...state, info].sort((ant: FrontNovoSidaReport, dep: FrontNovoSidaReport) => {

        const antDate = parseDate(props.eprocessoData[ant.processo]['Data Entrada Atividade'])
        const depDate = parseDate(props.eprocessoData[dep.processo]['Data Entrada Atividade'])
        if (antDate.valueOf() < depDate.valueOf()) {
          return 1
        }
        return -1
      })
      console.log("%c_______newState_______:", 'background-color: purple; color: white;', newState)
      setInstritos(getInscritos(newState))
      return newState
    })

  }

  const copy = () => {
    textRef.current.focus()
    textRef.current.value = inscritos.map(i => i.processo).join(',')
    textRef.current.select()
    document.execCommand("copy");
  }

  const getInscritos = (consultas) => {
    return consultas.filter(c => c.ok).filter(c => c.res.every(i => parseDate(props.eprocessoData[c.processo]['Data Entrada Atividade']).valueOf() <= parseDate(i.dataInscricao).valueOf()))
  }


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
    window.addEventListener("FRONT_END_SIDA_REPORT", removeListerners, { once: true })
    const processosNumbersString = Object.keys(props.situacoes).filter(k => props.situacoes[k] === "AGUARDA INSCRIÇÃO").join("|")
    const resp = await axios.post(`${props.host}/novo_sida`, processosNumbersString);
    console.log('%cPROCURA -> fim', 'background-color: red; color: white;', resp)
  }


  return (
    <section className="container">
      {consultas.map(c => <Consulta key={c.processo} consulta={c} eprocDados={props.eprocessoData[c.processo]} arquiva={inscritos.filter(i => i.processo === c.processo).length > 0} />)}
      {!consultou && <button onClick={procura} className={`button ${loading ? 'is-loading' : ''}`}>Pesquisa Sida Novo</button>}
      {inscritos.length > 0 && <div className="level">
        <div className="level-item">
          <textarea ref={textRef} className="textarea">
            {inscritos.length}
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

  let despacho;

  const [showText, setShowText] = useState<boolean>(false)

  const allExtintas = props.consulta.ok && props.consulta.res.every(i => i.situacao.includes('EXTINT'))
  const allSits = props.consulta.ok && new Set(props.consulta.res.map(i => i.situacao))
  const isAllSameSit = props.consulta.ok && allSits.size === 1;

  if (allExtintas && isAllSameSit) {
    if (props.consulta.res.length === 1) {
      despacho = `Processo ${props.consulta.processo} com a inscrição ${props.consulta.res[0].inscricao.replace(/\D/g, '')} na situação "${props.consulta.res[0].situacao}". Encaminhado na data ${props.eprocDados['Data Entrada Atividade']}, passou pelo TRATAPFN, mas ainda não foi gerada nova inscrição porque a situação provavelmente impede a inscrição automática.`
    } else {
      despacho = `Processo ${props.consulta.processo} com as inscrições ${props.consulta.res.map(i => i.inscricao.replace(/\D/g, '')).join(', ')}, todas na situação "${props.consulta.res[0].situacao}". Encaminhado na data ${props.eprocDados['Data Entrada Atividade']}, passou pelo TRATAPFN, mas ainda não foi gerada nenhuma nova inscrição porque a situação provavelmente impede a inscrição automática.`
    }
  }

  return (
    <div className="" style={{ marginBottom: "2rem", backgroundColor: props.arquiva ? "#23d16047" : "#eee", padding: "0.8rem" }}>
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
      <div>
        {allExtintas && isAllSameSit && <button className={`button is-small ${showText && "is-primary"}`} onClick={() => setShowText(!showText)}>{showText ? 'fechas' : 'despacho'}</button>}
        <p className="content despacho__text">{showText && despacho}</p>
      </div>

    </div>
  )
})

const InscricaoInfo = (props: { inscricao: Re, }) => {
  return (
    <tr style={{ fontSize: "0.9em" }}>
      <td>{props.inscricao.inscricao}</td>
      <td>{props.inscricao.dataInscricao}</td>
      <td>{props.inscricao.situacao}</td>
    </tr>

  )
}