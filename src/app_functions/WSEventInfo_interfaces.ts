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

export interface FrontNovoSidaReport {
    ok:       boolean;
    processo: string;
    res:      Re[];
    total:    number;
}

export interface Re {
    inscricao:                       string;
    processoAdministrativo:          string;
    situacao:                        string;
    dataInscricao:                   string;
    numeroPFNResponsavel:            string;
    nomePFNResponsavel:              string;
    numeroPFNInscricao:              string;
    nomePFNInscricao:                string;
    numeroProcessoJudicial:          string;
    numeroProcessoJudicialNovo:      string;
    orgaoOrigem:                     string;
    codigoNaturezaReceita:           string;
    nomeNaturezaReceita:             string;
    codigoReceitaPrincipal:          string;
    nomeReceita:                     string;
    codigoSerie:                     string;
    nomeSerie:                       string;
    codigoOrgaoJustica:              string;
    nomeOrgaoJustica:                string;
    numeroJuizo:                     string;
    descricaoJuizo:                  string;
    dataProtocoloJudExecucao:        string;
    dataDistribuicaoJudicial:        string;
    indicadorMoedaTotalInscrito:     string;
    valorTotalInscritoMoeda:         string;
    valorTotalInscritoIndex:         string;
    indicadorMoedaTotalConsolidado:  string;
    valorTotalConsolidadoMoeda:      string;
    indicadorMoedaTotalRemanescente: string;
    valorRemanescenteMoeda:          string;
    valorRemanescenteIndex:          string;
    dataDevolucaoProcesso:           string;
    numeroAutoInfracao:              string;
    dataDecretacaoFalencia:          string;
    dataFimProcurador:               string;
    numeroImovelITR:                 string;
    dataExtincaoInscricao:           string;
    motivoSuspensaoExigibilidade:    string;
    numeroRipSpu:                    string;
    indicadorAnaliseOrgaoOrigem:     string;
    motivoExtincaoInscricao:         string;
    codigoSituacaoProtesto:          string;
    nomeSituacaoProtesto:            string;
    indicadorProtImpedAjuiz:         string;
    numeroAgrupamento:               string;
    numeroInscricaoOriginal:         string;
    numeroInscricaoDerivada1:        string;
    numeroInscricaoDerivada2:        string;
    numeroInscricaoDerivada3:        string;
    numeroInscricaoDerivada4:        string;
    numeroInscricaoDerivada5:        string;
    numeroInscricaoDerivada6:        string;
    numeroInscricaoDerivada7:        string;
    dcomp:                           string;
    descricaoNaoCalculado:           string;
    codigoMunicipioSPU:              number;
    codigoSistemaOrigem:             string;
    descricaoSistemaOrigem:          string;
    indicadorParcelamento:           string;
    codigoTipoSituacao:              string;
    descricaoTipoSituacao:           string;
    tipoRegularidade:                string;
    dataPostagem:                    string;
    numeroCNO:                       string;
    insc:                            string;
}

export interface EProcInfo {
    "Assunto COMPROT":                  string;
    "CPF Responsável Último":           string;
    "Data Entrada Atividade":           string;
    "Indicador Dossiê":                 string;
    "NI Contribuinte":                  string;
    "Nome Atividade Última":            string;
    "Nome Contribuinte":                string;
    "Nome Equipe Última":               string;
    "Nome Unidade Última":              string;
    "Nome Último Documento Confirmado": string;
    "Número Processo":                  string;
    _s:                                 string;
    "Indicador Grande Devedor"?:        string;
    "Número de Inscrição"?:             string;
    "Situação da Inscrição"?:           string;
    "Valor Atualizado da Inscrição"?:   string;
    dataSitu?:                          Date;
}