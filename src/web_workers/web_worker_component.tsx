import * as React from 'react';

const handleWorkerMessages = function (ev: MessageEvent) {
    const messageParsed: { tipo: string, payload: any } = ev.data
    console.log('WORKER DATA: ', messageParsed.tipo, ' : ', messageParsed);
    const evv: any = new CustomEvent(messageParsed.tipo, { detail: messageParsed.payload })
    window.dispatchEvent(evv)
}

export const WorkerComponentHandler = (props: { wsPort: string, dbVersion: number, dbName: string }) => {

    React.useEffect(() => {
        const workerAddr = `${process.env.PUBLIC_URL}/sw/sw_src/worker.js`
        console.log('workerAddr: ', workerAddr);
        const worker: Worker = new Worker(workerAddr) as any;
        console.log(worker)
        // @ts-ignore
        worker.onerror = function (e) {
            console.error("ERROR WORKER => ", e)
        }
        worker.onmessage = function (e) {
            handleWorkerMessages(e)
        }
        worker.postMessage({ tipo: "WEBSOCKET_PORT", payload: `ws://localhost:${props.wsPort}/ws` })
        worker.postMessage({ tipo: "DATABASE_INFO_START", payload: { name: props.dbName, version: props.dbVersion } })
        // CLEAN CODE
    }, [])

    return null
}

