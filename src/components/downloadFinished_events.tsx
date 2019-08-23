import * as React from "react";
import { DownloadConcludedEventInfo } from "../app_functions/wsevents";

export const DownloadFinishedListener = (props: { addProcesso: (s: string) => void }) => {

    React.useEffect(() => {
        const action = (e) => {
            const processo = e.detail.final_filepath.split("\\").pop().replace('.pdf', '')
            console.log('%cDOWNLOAD FINISED:', 'background-color: red; font-size: 1.5em; color: white', e.detail, '\n', processo)
            props.addProcesso(processo)
        }
        window.addEventListener(DownloadConcludedEventInfo.tipo, action)
        return () => window.removeEventListener(DownloadConcludedEventInfo.tipo, action)
    })

    return null
}