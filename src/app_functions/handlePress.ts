import  App  from '../App';
// import { SyntheticEvent as Event } from 'react';

export const handlePress = (self: App) => (ev: any) => {    
    console.log('>', ev.nativeEvent.key, ' - ', ev.nativeEvent.keyCode);
    if (self.state.showInput || self.state.showGotoPageInput) { 
      console.log('ignorar...');    
      return;
    }
    switch (ev.nativeEvent.keyCode) {
      case 70: // f
        console.groupCollapsed('handlePress');
        self.setState(
          s => {
            let antigo = s.selecionado;
            let arrT = self.state.processosList;
            // let key = self.sortKey;
            let indexAntigo = arrT.findIndex(num => num === antigo);
            console.log('indexAntigo', indexAntigo);
            let novo = arrT[indexAntigo + 1];
            if (novo === undefined) {
              novo = arrT[0];
            }            
            console.log('novo', novo);
            self.loadPDF(novo);
            // self.colecao[arr[novoIndex]].focus();        
            return { selecionado: novo };
          },
          () => self.focaNaDivPricincipal()
        );
        console.groupEnd();  
        break;

        case 68: // d
        console.groupCollapsed('handlePress');
        self.setState(
          s => {
            let antigo = s.selecionado;
            let arrT = self.state.processosList;
            // let key = self.sortKey;
            let indexAntigo = arrT.findIndex(num => num === antigo);
            console.log('indexAntigo', indexAntigo);
            let novo: string;
            if (indexAntigo === 0) {
              novo = arrT[arrT.length - 1];
            } else {
              novo = arrT[indexAntigo - 1];
            }
            console.log('novo', novo);
            self.loadPDF(novo);
            // self.colecao[arr[novoIndex]].focus();        
            return { selecionado: novo };
          },
          () => self.focaNaDivPricincipal()
        );
        console.groupEnd();
  
        break;
      case 74: // j
        self.setState(
          (s) => {
            let atual = s.situacao[s.selecionado];
            if (atual === '0') { return null; }
            if (!atual) {
              return {...s, situacao: {...s.situacao, [s.selecionado]: s.destinos[0]}};
            }
            let indexAtual = s.destinos.findIndex( a => a === atual );
            let tam = s.destinos.length;
            if (indexAtual === tam - 1) {
              return {...s, situacao: {...s.situacao, [s.selecionado]: s.destinos[0]}};
            }
            return {...s, situacao: {...s.situacao, [s.selecionado]: s.destinos[indexAtual + 1]}};
          },
          () => {
            let save = JSON.stringify(self.state);
            localStorage.setItem(self.localStorageKey, save);
          }
        );
        break;
      case 73: // i      
        self.setState(
          (s) => {
            if (s.selecionado === '0') {
              return null;
            }
            return {...s, showInput: true};
          },
          () => setTimeout(
            () => {
              (self.input as HTMLInputElement).value = '';
              (self.input as HTMLInputElement).focus();
            },
            0)
        );
        break;
      
      case 71: // g
        self.setState(
          (s) => {
            if (s.selecionado === '0') {
              return null;
            }
            return {...s, showGotoPageInput: true};
          },
          () => setTimeout(
            () => {
              (self.gotoinput as HTMLInputElement).value = '';
              (self.gotoinput as HTMLInputElement).focus();
            },
            0)
        );
        break;
  
      case 109: // - (teclado numerico)
        let stateStr = localStorage.getItem(self.localStorageKey);
        if (stateStr === null) { 
          console.log('Nada salvo no localStorage');
          return; 
        }      
        let stateObj = JSON.parse(stateStr);
        self.setState(stateObj);
        break;
      case 81: // q
        self.pdfDiminuiZoom();
        break;
      case 87: // w
        self.pdfAumentaZoom();
        break;
      case 65: // a
        self.pdfPagAnterior();
        break;
      case 83: // s
        self.pdfPagProxima();
        break;
      case 186: // ç
        self.pdfBaixaVisualizacao();
        break;
      case 76: // l(L)
        self.pdfSobeVisualizacao();
        break;
      case 192: // ' aspas simples
        self.limpaSituacao();
        break;
      default:
        break;
    }
  
  };