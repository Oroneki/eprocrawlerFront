import * as React from "react";
import { DownloadConcludedEventInfo } from "../app_functions/wsevents";

export const DownloadFinishedListener = (props: { setState: any }) => {

    React.useEffect(() => {
        const action = (e) => {
            console.log('%cDOWNLOAD FINISED:', 'background-color: red; font-size: 1.5em; color: white', e.detail)
            const processo = e.detail.final_filepath.split("\\").pop().replace('.pdf', '')
            props.setState(s => ({ ...s, downloaded: s.downloaded.add(processo) }))
        }
        window.addEventListener(DownloadConcludedEventInfo.tipo, action)
        return () => window.removeEventListener(DownloadConcludedEventInfo.tipo, action)
    })

    return null
}