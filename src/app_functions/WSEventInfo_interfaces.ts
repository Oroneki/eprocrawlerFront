export interface WSEventInfo<T> {
    tipo: string;
    parseFunction: (pld: string) => T;
    callback: (input: T) => void | null;
}
export interface DownloadBytesMessage {
    processo_filename: string;
    bytes: number;
}
export interface DownloadConcluded {
    processo_filename: string;
    final_filepath: string;
}
export interface JanelinhaEvent {
    janId: string;
    processoImpuro: string;
    descricao: string;
    fase: number;
}
export interface DocProcesoInfo {
    nome_doc: string;
    ordem: number;
    pag_inicio: number;
    pag_fim: number;
    situacao: string;
    tamanho: number;
}
export interface JanelinhaProcessoInfo {
    processoImpuro: string;
    infos: DocProcesoInfo[];
}
