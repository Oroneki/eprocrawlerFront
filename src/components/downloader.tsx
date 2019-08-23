import * as React from 'react';
import { useState } from "react";
import { ALL_DOWNLOADS_FINISHED_EVINFO, DownloadBytesEventInfo, DownloadConcludedEventInfo, JanelinhaProcessoInfoEventInfo } from '../app_functions/wsevents';
import './downloader.css';
import css from './downloader.module.css';

type Download = {
    processo_filename: string
    bytes: number
}

const initialDown = process.env.NODE_ENV === 'development' ? {
    "devel1040.9876987/874684-99": {
        processo_filename: 'devel1040.9876987/874684-99',
        bytes: 1000009888987,
    },
    'devel21040.9876987/874684-99': {
        processo_filename: 'devel21040.9876987/874684-99',
        bytes: 1000009928987,
    }
} : {}

export const Downloader = (props) => {

    const [downloads, setDownloads] = useState<{ [k: string]: Download }>(initialDown)
    const [show, setShow] = useState<boolean>(true)

    React.useEffect(() => {
        const action = (ev) => {
            console.log('%c DETAIL', ev.detail)
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
        const loga = (e) => {
            console.log(e.detail);
        }

        const hide = () => setShow(false)

        window.addEventListener(DownloadBytesEventInfo.tipo as any, action)
        // window.addEventListener(IMALIVEInfo.tipo as any, action)
        window.addEventListener(DownloadConcludedEventInfo.tipo as any, remove)
        window.addEventListener(JanelinhaProcessoInfoEventInfo.tipo as any, loga)
        window.addEventListener(ALL_DOWNLOADS_FINISHED_EVINFO.tipo as any, hide)


        return () => {
            window.removeEventListener(DownloadBytesEventInfo.tipo as any, action);
            // window.removeEventListener(IMALIVEInfo.tipo as any, action);
            window.removeEventListener(DownloadConcludedEventInfo.tipo as any, remove)
            window.removeEventListener(JanelinhaProcessoInfoEventInfo.tipo as any, loga)
            window.removeEventListener(ALL_DOWNLOADS_FINISHED_EVINFO.tipo as any, hide)
        }
    }, [])

    const vals = Object.values(downloads)

    if (vals.length === 0) {
        return null
    }

    return show && (
        <div className={css.downloader}>
            {vals.map(d => <ProcessoDownloading key={d.processo_filename} processo_filename={d.processo_filename} bytes={d.bytes} />)}
            <span style={{ fontSize: '8px' }} onClick={() => setShow(false)}>[close]</span>
        </div>
    )
}

const ProcessoDownloading = React.memo((props: Download) => {
    console.log('css', css)
    console.log('css.download', css.download)

    return (
        <div key={props.processo_filename} className={css.download}>
            <PLoading color='#ccc' />
            <span className={css.processo}>
                {props.processo_filename}
            </span>
            <span className={css.bytes}>
                {props.bytes}
            </span>
        </div>
    )
})

export const PLoading = (props: { color: string }) => {


    return (<span className={css.move}>
        <svg className={css.spinner} viewBox="0 0 100 100" width="20px" height="20px">
            <defs>
                <mask id="m">
                    <circle cx="50" cy="50" fill="white" r="50" />
                    <circle cx="50" cy="50" fill="black" r="20" />
                    <rect x="50" y="50" width="50" height="50" fill="black" />

                </mask>
            </defs>
            <circle cx="52" cy="52" fill={props.color} r="50" mask="url(#m)" />
        </svg>
    </span>)
}

PLoading.defaultProps = {
    color: "#000",
    bgcolor: "#ccc",
}