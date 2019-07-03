
export interface WSEventInfo<T> {
    tipo: string,
    parseFunction: (pld: string) => T
}

export interface DownloadBytesMessage {
    processo_filename: string
    bytes: number
}

export interface DownloadConcluded {
    processo_filename: string
    final_filepath: string
}

export const DownloadConcludedEventInfo: WSEventInfo<DownloadConcluded> = {
    tipo: "DOWNLOAD_FINISHED",
    parseFunction: (pld) => {
        const striped = pld.split('|');
        return {
            processo_filename: striped[0],
            final_filepath: striped[1],
        }
    }
}

export const DownloadBytesEventInfo: WSEventInfo<DownloadBytesMessage> = {
    tipo: "D_REPORTER",
    parseFunction: (pld) => {
        const striped = pld.split('|');
        return {
            processo_filename: striped[0],
            bytes: parseInt(striped[1], 10)
        }
    }
}

export const IMALIVEInfo: WSEventInfo<string> = {
    tipo: "im_alive",
    parseFunction: (pld) => "parsed"
}


const WSEents: { [k: string]: WSEventInfo<unknown> } = {
    D_REPORTER: DownloadBytesEventInfo,
    im_alive: IMALIVEInfo,
    DOWNLOAD_FINISHED: DownloadConcludedEventInfo,
}

export const handleWsMessages = function (ev: MessageEvent) {
    const messageParsed: { tipo: string, payload: string } = JSON.parse(ev.data)
    console.log('WSEVENT:', messageParsed);
    const infoEvent = WSEents[messageParsed.tipo]
    const evv: any = new CustomEvent(infoEvent.tipo, { detail: infoEvent.parseFunction(messageParsed.payload) })
    window.dispatchEvent(evv)
}