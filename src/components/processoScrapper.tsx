import * as React from "react"
import Context from "../context"
import css from "./processso_scrapper.module.css"

export const ProcessoScrapper = (props: {
    processos: string[]
   }) => {
    console.log("olha: props", props)
    return (
        
        <div className={css.scrapper}>
            {
                props.processos.map(
                    p => <span key={p} className={css.proc}>
                        {p}
                    </span>
                )
            }
        </div>
        
        
    )
}

export const TabelaScrapper = (props: {
    info: Array<[string, string, string]>
    deleteDossie: any
}) => {
    console.log("render");
    const ctx = React.useContext(Context)
    const [show, setShow] = React.useState(false);

    const remove = (dossie: string) => {
        const antes = [...props.info];
        const depois = antes.filter(arr => arr[0] !== dossie);
        props.deleteDossie(dossie);
        ctx.setState({
            dossieProcesso: depois
        })
        
    }
    
    React.useEffect(() => {
        setShow(true);
        setTimeout(() => setShow(false), 300)

    }, [props.info.length])
    return (
        <>
        <div className={css.lista}>
            <table>
                <thead>
                    <tr>

                    <td>
                        Dossiê&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9;
                    </td>
                    <td>
                        Processo&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9;
                    </td>
                    <td>
                        Destino
                    </td>
                    <td>
                        X
                    </td>
                    </tr>
                </thead>
                <tbody>
                    {props.info.map(i => {
                        return (

                        <tr style={{
                            color: ctx.processosList.includes(i[0]) ? "inherit" : "grey"
                        }} key={i[0]}>
                            <td>
                                {i[0]}&#9;
                            </td>
                            <td>
                                {i[1]}&#9;
                            </td>
                            <td>
                                {i[2]}
                            </td>
                            <td>
                                <button style={{padding: "2px", borderRadius: "50%", fontSize: "9px"}} onClick={() => remove(i[0])}className="foi">
                                    x
                                </button>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        {show && <div className={css.flutua}>
                    {props.info.slice(-1).length > 0 ? props.info.slice(-1)[0][1]: null}
        </div>}
        </>
    )
}