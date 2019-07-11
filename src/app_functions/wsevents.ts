import { DocProcesoInfo, DownloadBytesMessage, DownloadConcluded, JanelinhaEvent, JanelinhaProcessoInfo, WSEventInfo } from "./WSEventInfo_interfaces";

export const JanelinhaProcessoInfoEventInfo: WSEventInfo<JanelinhaProcessoInfo> = {
    tipo: "JANELINHA_INFO_PROCESSO",
    parseFunction: (pld) => {
        const striped_prc_events = pld.split('|@@|');
        const processo = striped_prc_events[0]
        const stripped_events = striped_prc_events[1].split('|##|')
        const events: DocProcesoInfo[] = []
        for (const se of stripped_events) {
            if (se.length < 5) {
                return
            }
            const splitted = se.split('|')
            const event: DocProcesoInfo = {
                nome_doc: splitted[0],
                ordem: parseInt(splitted[1], 10),
                pag_inicio: parseInt(splitted[2], 10),
                pag_fim: parseInt(splitted[3], 10),
                situacao: splitted[4],
                tamanho: parseInt(splitted[5], 10),
            }
            events.push(event)
        }
        return {
            processoImpuro: processo,
            infos: events
        }
    },
    callback: null
}

export const DownloadConcludedEventInfo: WSEventInfo<DownloadConcluded> = {
    tipo: "DOWNLOAD_FINISHED",
    parseFunction: (pld) => {
        const striped = pld.split('|');

        return {
            processo_filename: striped[0],
            final_filepath: striped[1],
        }
    },
    callback: null
}

export const JanelinhaEventInfo: WSEventInfo<JanelinhaEvent> = {
    tipo: "JANELINHA_EVENT",
    parseFunction: (pld) => {
        const striped = pld.split('|');
        return {
            janId: striped[0],
            processoImpuro: striped[1],
            descricao: striped[2],
            fase: parseInt(striped[3], 10),
        }
    },
    callback: null
}

export const DownloadBytesEventInfo: WSEventInfo<DownloadBytesMessage> = {
    tipo: "D_REPORTER",
    parseFunction: (pld) => {
        const striped = pld.split('|');
        return {
            processo_filename: striped[0],
            bytes: parseInt(striped[1], 10)
        }
    },
    callback: null
}

export const IMALIVEInfo: WSEventInfo<string> = {
    tipo: "im_alive",
    parseFunction: (pld) => "parsed",
    callback: null
}

export const ALL_DOWNLOADS_FINISHED_EVINFO: WSEventInfo<null> = {
    tipo: "ALL_DOWNLOADS_FINISHED",
    parseFunction: (pld) => null,
    callback: null
}


export const WSEvents: { [k: string]: WSEventInfo<any> } = {
    D_REPORTER: DownloadBytesEventInfo,
    im_alive: IMALIVEInfo,
    DOWNLOAD_FINISHED: DownloadConcludedEventInfo,
    ALL_DOWNLOADS_FINISHED: ALL_DOWNLOADS_FINISHED_EVINFO,
    JANELINHA_EVENT: JanelinhaEventInfo,
    JANELINHA_INFO_PROCESSO: JanelinhaProcessoInfoEventInfo,
}

export const handleWsMessages = function (ev: MessageEvent) {
    const messageParsed: { tipo: string, payload: string } = JSON.parse(ev.data)
    console.log('WSEVENT:', messageParsed);
    const infoEvent = WSEvents[messageParsed.tipo]
    const evv: any = new CustomEvent(infoEvent.tipo, { detail: infoEvent.parseFunction(messageParsed.payload) })
    window.dispatchEvent(evv)
}