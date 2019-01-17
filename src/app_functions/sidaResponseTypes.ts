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

export const sidaTestJSONString = JSON.parse(`[
    {
        "listaInscricoes": [],
        "dataEntrada": "2019-01-16T03:00:00.000Z",
        "processo": "10010022761071664",
        "qtdInscricoes": 0
    },
    {
        "listaInscricoes": [
            {
                "foiDepois": false,
                "cpfCnpj": "06234956/0001-34",
                "dataInsc": "2012-08-24T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "ATIVA AJUIZADA",
                "valorConsolidado": "R$ 456.293,92",
                "valorInscrito": "R$ 185.379,84 UFIR 174.212,79",
                "numInsc": "40 4 12 002694-36"
            }
        ],
        "dataEntrada": "2018-06-22T03:00:00.000Z",
        "processo": "10314009517200688",
        "qtdInscricoes": 1
    },
    {
        "listaInscricoes": [],
        "dataEntrada": "2017-07-26T03:00:00.000Z",
        "processo": "10435000598200684",
        "qtdInscricoes": 0
    },
    {
        "listaInscricoes": [
            {
                "foiDepois": false,
                "cpfCnpj": "27078567/0001-37",
                "dataInsc": "2002-04-25T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "AJUIZADA DESMEMBRADA EM RAZAO DA MP 303/06",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 485.744,36)",
                "numInsc": "40 2 02 000220-55"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "27078567/0001-37",
                "dataInsc": "2002-04-25T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "ATIVA COM AJUIZAMENTO A SER PROSSEGUIDO",
                "valorConsolidado": "R$ 1.660.344,08",
                "valorInscrito": "(UFIR 246.092,47)",
                "numInsc": "40 2 02 000221-36"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "27078567/0001-37",
                "dataInsc": "2002-04-25T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "ATIVA COM AJUIZAMENTO A SER PROSSEGUIDO",
                "valorConsolidado": "R$ 2.412.406,72",
                "valorInscrito": "(UFIR 485.744,36)",
                "numInsc": "40 2 02 004298-30"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "27078567/0001-37",
                "dataInsc": "2002-04-25T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "AJUIZADA DESMEMBRADA EM RAZAO DA MP 303/06",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 10.804,22)",
                "numInsc": "40 6 02 000690-42"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "27078567/0001-37",
                "dataInsc": "2002-04-25T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "EXTINTA POR PAGAMENTO COM AJUIZAMENTO A SER CANCELADO",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 10.804,22)",
                "numInsc": "40 6 02 010086-24"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "27078567/0001-37",
                "dataInsc": "2002-04-25T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "NAO AJUIZADA DESMEMBRADA EM RAZAO DA MP 303/06",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 24.695,40)",
                "numInsc": "40 7 02 000119-63"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "27078567/0001-37",
                "dataInsc": "2002-04-25T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "ATIVA COM AJUIZAMENTO A SER PROSSEGUIDO",
                "valorConsolidado": "R$ 17.452,90",
                "valorInscrito": "(UFIR 24.695,40)",
                "numInsc": "40 7 02 002743-87"
            }
        ],
        "dataEntrada": "2017-11-08T03:00:00.000Z",
        "processo": "104800003219358",
        "qtdInscricoes": 7
    },
    {
        "listaInscricoes": [
            {
                "foiDepois": false,
                "cpfCnpj": "35665645/0001-28",
                "dataInsc": "1999-09-14T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "AJUIZADA DESMEMBRADA EM RAZAO DA MP 303/06",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "R$ 22.891,42 (UFIR 25.133,31)",
                "numInsc": "40 3 99 000057-58"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "35665645/0001-28",
                "dataInsc": "1999-09-14T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "AJUIZADA DESMEMBRADA EM RAZAO DA MP 303/06",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "R$ 6.829,95 (UFIR 7.498,84)",
                "numInsc": "40 3 99 000130-09"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "35665645/0001-28",
                "dataInsc": "1999-09-14T03:00:00.000Z",
                "procuradoriaResponsavel": "CARUARU",
                "situacao": "ATIVA AJUIZADA PARCELADA NO SISPAR",
                "valorConsolidado": "R$ 5.098,84",
                "valorInscrito": "R$ 6.829,95 (UFIR 7.498,84)",
                "numInsc": "40 3 99 000135-05"
            }
        ],
        "dataEntrada": "2017-06-19T03:00:00.000Z",
        "processo": "104800025139713",
        "qtdInscricoes": 3
    },
    {
        "listaInscricoes": [
            {
                "foiDepois": false,
                "cpfCnpj": "12797734/0001-22",
                "dataInsc": "2000-09-06T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "ATIVA AJUIZADA",
                "valorConsolidado": "R$ 225.593,20",
                "valorInscrito": "(UFIR 49.064,02)",
                "numInsc": "40 2 00 001197-72"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "12797734/0001-22",
                "dataInsc": "2000-09-06T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "EXTINTA POR PRESCRICAO INTERCORRENTE A SER DEVOLVIDA OU ARQUIVADA",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 25.217,18)",
                "numInsc": "40 2 00 001198-53"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "12797734/0001-22",
                "dataInsc": "2000-09-06T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "EXTINTA POR PRESCRICAO INTERCORRENTE",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 3.915,04)",
                "numInsc": "40 6 00 002365-06"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "12797734/0001-22",
                "dataInsc": "2000-09-06T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "EXTINTA POR PRESCRICAO INTERCORRENTE",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 7.870,84)",
                "numInsc": "40 6 00 002366-89"
            },
            {
                "foiDepois": false,
                "cpfCnpj": "12797734/0001-22",
                "dataInsc": "2000-09-06T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "EXTINTA POR CANCELAMENTO COM AJUIZAMENTO A SER CANCELADO",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "(UFIR 2.452,82)",
                "numInsc": "40 7 00 000865-95"
            }
        ],
        "dataEntrada": "2017-07-26T03:00:00.000Z",
        "processo": "104800034470001",
        "qtdInscricoes": 5
    },
    {
        "listaInscricoes": [
            {
                "foiDepois": false,
                "cpfCnpj": "083936994-87",
                "dataInsc": "2005-05-30T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "EXTINTA POR PRESCRICAO INTERCORRENTE A SER DEVOLVIDA OU ARQUIVADA",
                "valorConsolidado": "R$ 0,00",
                "valorInscrito": "R$ 5.834,76 UFIR 5.483,26",
                "numInsc": "40 1 05 001115-87"
            }
        ],
        "dataEntrada": "2019-01-08T03:00:00.000Z",
        "processo": "10480600877200516",
        "qtdInscricoes": 1
    },
    {
        "listaInscricoes": [
            {
                "foiDepois": false,
                "cpfCnpj": "05463276/0001-20",
                "dataInsc": "2018-11-14T03:00:00.000Z",
                "procuradoriaResponsavel": "QUINTA REGIAO",
                "situacao": "ATIVA NAO AJUIZAVEL PARCELADA NO SISPAR",
                "valorConsolidado": "R$ 8.264,58",
                "valorInscrito": "R$ 5.232,92 UFIR 4.917,69",
                "numInsc": "40 5 18 001186-06"
            }
        ],
        "dataEntrada": "2018-12-26T03:00:00.000Z",
        "processo": "46295005249200991",
        "qtdInscricoes": 1
    }
]`);
