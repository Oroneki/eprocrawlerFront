import { createContext } from 'react';

export type ManejoState = {
  copiados: Set<string>;
  errosDelete: Set<string>;
  deletadosOk: Set<string>;
};

export interface AppState {
  situacao: object;
  selecionado: string;
  destinos: string[];
  showInput: boolean;
  paginaAtual: number;
  totalPaginas: number;
  carregando: boolean;
  showGotoPageInput: boolean;
  separador: string;
  botaoClickAtivo: string;
  copyList: string[];
  botoesClickClicados: string[];
  loadPDF: Function;
  focaNaDivPrincipal: Function;
  setState: Function;
  processosList: string[];
  manejo: {
    copiados: Set<string>;
    errosDelete: Set<string>;
    deletadosOk: Set<string>;
  };
  manejar: Function;
  loading: boolean;
  downloaded: Set<string>;
  pageProcessos: string[];
  dossieProcesso: Array<[string, string, string]>;
}

export const defaultState: AppState = {
  showInput: false,
  situacao: {},
  selecionado: '0',
  destinos: [
    'REVISAO',
    'AGUARDA INSCRIÇÃO',
    'REQUERIMENTOS',
    'INSCRIÇÃO-AJUIZAMENTO',
  ],
  paginaAtual: 0,
  totalPaginas: 0,
  carregando: false,
  showGotoPageInput: false,
  separador: ',',
  botaoClickAtivo: '',
  botoesClickClicados: [],
  processosList: [],
  copyList: [],
  loadPDF: () => ({}),
  focaNaDivPrincipal: () => ({}),
  setState: () => ({}),
  manejar: () => ({}),
  manejo: {
    copiados: new Set(),
    errosDelete: new Set(),
    deletadosOk: new Set(),
  },
  loading: false,
  downloaded: new Set(),
  pageProcessos: ["teste", "testeaa"],
  dossieProcesso: []
};

const Context = createContext(defaultState);

export default Context;