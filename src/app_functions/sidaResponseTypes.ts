export interface SidaConsultaVariosProcessosJSONResponseSingle {
    listaInscrições: ConsultaInscricaoSida[];
    processo:     string;
    qtdInscricoes:   number;
}

export interface SidaConsultaVariosProcessosJSONResponseSingleBefore {
    lista_inscrições: ListaInscricoesBefore[];
    processo_key:     string;
    qtd_inscricoes:   number;
}

export interface ConsultaInscricaoSida {
    cpfCnpj:                         string; // <<<
    dataInsc:                Date; // <<!!!! dataDaInscrição? |  dataInscrição?:
    procuradoriaResponsável:         string; // <<<
    situação:                        string; // <<<
    valorConsolidado:                string; // <<<
    valorInscrito:                   string; // <<<
    numInsc: string;
    
}

export interface ListaInscricoesBefore {
    'CPF/CNPJ':                         string; // <<<   
    'Procuradoria Responsável':         string; // <<<
    Situação:                        string; // <<<
    'Valor Consolidado':                string; // <<<
    'Valor Inscrito':                   string; // <<<
    'Data da Inscrição'?: string;
    'Data Inscrição'?: string;
    'Número de Inscrição'?: string;
    'Nº Inscrição'?: string;
}
