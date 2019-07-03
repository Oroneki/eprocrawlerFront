import * as React from 'react';
import { useState } from "react";
import { DownloadBytesEventInfo, DownloadConcludedEventInfo, IMALIVEInfo } from '../app_functions/wsevents';
import './downloader.css';
import css from './downloader.module.css';

type Download = {
    processo_filename: string
    bytes: number
}

export const Downloader = (props) => {

    console.log('renderizou')



    const [downloads, setDownloads] = useState<{ [k: string]: Download }>({})


    React.useEffect(() => {
        const action = (ev) => {
            if (ev.detail && ev.detail.processo_filename && ev.detail.bytes) {
                setDownloads((antigo: { [k: string]: Download }) => ({
                    ...antigo,
                    [ev.detail.processo_filename]: ev.detail
                }))
            }
        }
        const remove = (ev) => {
            console.log('REMOVE: ', ev.detail)
            if (ev.detail && ev.detail.processo_filename) {
                setDownloads((antigo: any) => {
                    const novo = { ...antigo }
                    delete novo[ev.detail.processo_filename]
                    return novo
                })
            }
        }
        window.addEventListener(DownloadBytesEventInfo.tipo as any, action)
        window.addEventListener(IMALIVEInfo.tipo as any, action)
        window.addEventListener(DownloadConcludedEventInfo.tipo as any, remove)

        return () => {
            window.removeEventListener(DownloadBytesEventInfo.tipo as any, action);
            window.removeEventListener(IMALIVEInfo.tipo as any, action);
            window.removeEventListener(DownloadConcludedEventInfo.tipo as any, remove)
        }
    }, [])

    const vals = Object.values(downloads)

    if (vals.length === 0) {
        return null
    }
    return (
        <div className={css.downloader}>
            {vals.map(d => <ProcessoDownloading key={d.processo_filename} processo_filename={d.processo_filename} bytes={d.bytes} />)}
        </div>
    )
}

const ProcessoDownloading = React.memo((props: Download) => {
    return (
        <div key={props.processo_filename} className={css.download}>
            <PLoading />
            <span className={css.processo}>
                {props.processo_filename}
            </span>
            <span className={css.bytes}>
                {props.bytes}
            </span>
        </div>
    )
})

export const PLoading = (props: any) => {
    return (<span>
        <svg className={css.spinner} viewBox="0 0 100 100" width="20px" height="20px">
            <circle cx="50" cy="50" fill="#000" r="50" />
            <circle cx="50" cy="50" fill="#fff" r="30" />
            <rect x="50" y="50" width="50" height="50" fill="#fff" />
        </svg>
    </span>)
}