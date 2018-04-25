import { createContext } from 'react';

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
    botoesClickClicados: string[];
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
};

const Context = createContext(defaultState);

export default Context;