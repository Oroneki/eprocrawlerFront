import * as React from 'react';
import './App.css';
import Linha from './Linha';
import { PDFJSStatic, 
  PDFDocumentProxy,
  PDFPageProxy,
  PDFPageViewport,

} from 'pdfjs-dist';

export const trans = {
  'todos': 'Todos',
  'informa__es': 'Informações',
  'indicadores': 'Indicadores',
  'n_mero processo': 'Número Processo',
  'ni contribuinte': 'NI Contribuinte',
  'data entrada atividade': 'Data Entrada Atividade',
  'nome respons_vel': 'Nome Responsável',
  'nome equipe _ltima': 'Nome Equipe Última',
  'assunto comprot': 'Assunto Comprot',
  'cpf respons_vel _ltimo': 'CPF Responsável Último',
  'nome atividade _ltima': 'Nome Atividade Última',
  'cpf respons_vel atual': 'CPF Responsável Atual',
  'indicador dossi_': 'Indicador Dossiê',
  'valor atualizado da inscri__o': 'Valor Atualizado da Inscrição',
  'assuntos_objetos': 'Assuntos Objetos',
  'n_mero do requerimento _sicar_pgfn_': 'Número Requerimento SICAR',
  'nome _ltimo documento confirmado': 'Último Documento',
  'nome unidade _ltima': 'Última Atividade',
  'indicador grande devedor': 'GD',
  'nome contribuinte': 'Contribuinte',
  'n_mero de inscri__o': 'Número Inscrição',
  'situa__o da inscri__o': 'Situação Inscrição',
};

interface AppState {
  situacao: object;
  selecionado: string;
  destinos: string[];
  showInput: boolean;
  paginaAtual: number;
  totalPaginas: number;
  carregando: boolean;
  showGotoPageInput: boolean;
  separador: string;
}

interface AppProps {
  data: object;
  PDFJS: PDFJSStatic;
}

interface CurrentPDF {
  pdf: PDFDocumentProxy | null;
  page: PDFPageProxy | null;
  zoom: number;
  totalPages: number | null;
  pageNumber: number | null;
  canvasHeight: number;
  canvasWidth: number;
  numeroProcesso: string;
}

interface CustomViewPort extends PDFPageViewport {
  transform: number[];
}

const META: string = '__META__';

class App extends React.Component<AppProps, AppState> {

  public eprocessoData: object;
  public colecao: object;
  public input: HTMLInputElement | null;
  public gotoinput: HTMLInputElement | null;  
  public PDF: PDFJSStatic;
  public localStorageKey: string;
  private textarea: HTMLTextAreaElement | null;
  private canvas: HTMLCanvasElement | null;  
  private outerDiv: HTMLDivElement | null;  
  private divPrincipal: HTMLDivElement | null;
  private canvasRenderContext2D: CanvasRenderingContext2D | null; 
  private currentPdf: CurrentPDF;
  private interval: number;

  constructor(props: AppProps) {
    super(props);
    this.state = {
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
    };

    this.localStorageKey = this.props.data[META].codEquipe + this.props.data[META].pasta_download || 'none';
    console.log('localStorageKey: ', this.localStorageKey);
    this.eprocessoData = this.props.data;
    delete this.eprocessoData[META];
    this.atualizaColecao = this.atualizaColecao.bind(this);
    this.handlePress.bind(this);
    this.addSituacao = this.addSituacao.bind(this);
    this.colecao = {};
    this.PDF = this.props.PDFJS;
    this.loadPDF = this.loadPDF.bind(this);    
    console.log(this.props);
    this.currentPdf = {
      pdf: null,
      page: null,
      zoom: 1.5,
      pageNumber: null,
      totalPages: null,
      canvasHeight: window.outerHeight * 0.95,
      canvasWidth: window.outerWidth * 0.95,
      numeroProcesso: '0',
    };
    
  }
  
handlePress = (ev) => {
  console.log('>', ev.nativeEvent.key, ' - ', ev.nativeEvent.keyCode);
  if (this.state.showInput || this.state.showGotoPageInput) { 
    console.log('ignorar...');    
    return;
  }
  switch (ev.nativeEvent.keyCode) {
    case 70: // f
      console.groupCollapsed('handlePress');
      this.setState(
        s => {
          let antigo = s.selecionado;
          let arrT = Object.keys(this.eprocessoData);
          let arr = arrT.filter(
            (procnum) => Object.keys(s.situacao).findIndex(num => num === procnum) === -1
          );
          console.log('arrT', arrT);
          console.log('arr', arr);
          let novo: string;
          if (arr.length > 0) {
            console.log('ainda tem processo sem situacao');
            novo = arr[0];
            if (novo === antigo) {
              if (arr.length === 1) {
                novo = arrT[0];
              } else {
                novo = arr[1];
              }
            }
          } else {
            console.log('não tem processo sem situacao...');
            let indexAntigo = arrT.findIndex(num => num === antigo);
            console.log('indexAntigo', indexAntigo);
            novo = arrT[indexAntigo + 1];
            if (novo === undefined) {
              novo = arrT[0];
            }
          }
          console.log('novo', novo);
          this.loadPDF(novo);
          // this.colecao[arr[novoIndex]].focus();        
          console.groupEnd();
          return { selecionado: novo };
      },
        () => this.focaNaDivPricincipal()
  );

      break;
    case 74: // j
      this.setState(
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
          let save = JSON.stringify(this.state);
          localStorage.setItem(this.localStorageKey, save);
        }
      );
      break;
    case 73: // i      
      this.setState(
        (s) => {
          if (s.selecionado === '0') {
            return null;
          }
          return {...s, showInput: true};
        },
        () => setTimeout(
          () => {
            (this.input as HTMLInputElement).value = '';
            (this.input as HTMLInputElement).focus();
          },
          0)
      );
      break;
    
    case 71: // g
      this.setState(
        (s) => {
          if (s.selecionado === '0') {
            return null;
          }
          return {...s, showGotoPageInput: true};
        },
        () => setTimeout(
          () => {
            (this.gotoinput as HTMLInputElement).value = '';
            (this.gotoinput as HTMLInputElement).focus();
          },
          0)
      );
      break;

    case 109: // - (teclado numerico)
      let stateStr = localStorage.getItem(this.localStorageKey);
      if (stateStr === null) { 
        console.log('Nada salvo no localStorage');
        return; 
      }      
      let stateObj = JSON.parse(stateStr);
      this.setState(stateObj);
      break;
    case 81: // q
      this.pdfDiminuiZoom();
      break;
    case 87: // w
      this.pdfAumentaZoom();
      break;
    case 65: // a
      this.pdfPagAnterior();
      break;
    case 83: // s
      this.pdfPagProxima();
      break;
    default:
      break;
  }

}

atualizaColecao = (key, node) => {
  this.colecao[key] = node;
}

copy = (str: string) => {
  (this.textarea as HTMLTextAreaElement).focus();
  (this.textarea as HTMLTextAreaElement).value = str;
  (this.textarea as HTMLTextAreaElement).select();  
  document.execCommand('copy');  
  (this.textarea as HTMLTextAreaElement).blur();
}

addSituacao = (ev) => {
  console.log('addSitucao', ev);
  if ( !(ev.nativeEvent.keyCode === 13 || ev.nativeEvent.keyCode === 27) ) {
    return ;
  }
  if (ev.nativeEvent.keyCode === 27) {
    this.setState(
      {showInput: false},
      this.focaNaDivPricincipal    
    );
  }
  let novo = (this.input as HTMLInputElement).value.toUpperCase();
  this.setState(
    (s) => {
      let destinosNovos: string[] = s.destinos;
      if (!(s.destinos.find((dst) => dst === novo))) {
        destinosNovos = destinosNovos.concat(novo);
      }
      // this.colecao[s.selecionado].focus();
      return {...s, 
        situacao: 
          {...s.situacao, 
            [s.selecionado]: novo},
        showInput: false,
        destinos: destinosNovos,
          };
    },
    this.focaNaDivPricincipal
  );
}

goToPageInputAction = (ev) => {
  console.log('addSitucao', ev);
  if ( !(ev.nativeEvent.keyCode === 13 || ev.nativeEvent.keyCode === 27) ) {    
    return ;
  }
  if (ev.nativeEvent.keyCode === 27) {
    this.setState(
      {showGotoPageInput: false},
      this.focaNaDivPricincipal    
    );
    return;
  }
  let novo = parseInt((this.gotoinput as HTMLInputElement).value, 10);
  if (novo < 0) {
    novo = this.state.totalPaginas + 1 + novo;
  }
  this.setState(
    {showGotoPageInput: false},
    () => this.pdfGotoPage(novo)
  );
}

loadPDF = async (pdfStr: string) => {
  if (this.interval) {
    window.clearInterval(this.interval);
  }
  this.setState({carregando: true});
  console.log('loadPDF');
  if (this.canvas === null) {
    return;
  }
  this.animaCanvas();
  // let pdfR: PDFDocumentProxy;
  // console.log(this.PDF);
  let pdf: PDFDocumentProxy;
  try {
    this.currentPdf.numeroProcesso = pdfStr;
    pdf = await this.PDF.getDocument(`http://localhost:9090/pdf/${pdfStr}.pdf`);
    if (!(this.currentPdf.numeroProcesso === pdfStr)) {
      console.error(
        `Erro! Promessa do PDF atrasou. 
        PDF atual: ${this.currentPdf.numeroProcesso}. PDF carrgeado: ${pdfStr}`
      );
      throw('Erro de carrgemaento atraso');
    }
    this.currentPdf.pdf = pdf;
    let pageNumber = pdf.numPages;
    this.currentPdf.totalPages = pageNumber;  
    this.pdfGotoPage(pageNumber);
    this.setState({totalPaginas: pageNumber, paginaAtual: pageNumber});
  } catch (error) {
    console.log(`Não existe o pdf ${pdfStr}`);
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    if (!this.canvasRenderContext2D) {
      return;
    }
    this.canvasRenderContext2D.fillStyle = '#eef';
    this.canvasRenderContext2D.fillRect(0, 0, 1000, 1000);
    this.canvasRenderContext2D.fillStyle = '#990000';
    this.canvasRenderContext2D.strokeStyle = '#000';
    this.canvasRenderContext2D.font = '48px Arial';
    this.canvasRenderContext2D.fillText(`${pdfStr} não baixado`, 100, 300);
  } 
  
}

animaCanvas = () => {  
  const qq = Math.floor(Math.random() * 100);
  const ww = Math.floor(Math.random() * 100);
  (this.canvasRenderContext2D as CanvasRenderingContext2D).fillStyle = `rgba(${ww}, ${qq}, ${3 * qq - ww}, 0.5)`;
  this.interval = window.setInterval(() => {    
    const x = Math.floor(Math.random() * 720);
    const y = Math.floor(Math.random() * 720);
    const q = Math.floor(Math.random() * 100);
    const w = Math.floor(Math.random() * 100);
    (this.canvasRenderContext2D as CanvasRenderingContext2D).fillRect(x, y, x + q, y + w);
    (this.canvasRenderContext2D as CanvasRenderingContext2D).fillRect(x, y, x - q, y - w);
    (this.canvasRenderContext2D as CanvasRenderingContext2D).fillRect(y, x, x + q, y + w);
  }, 
                                     150);
}

async pdfGotoPage(pageNumber: number) {
  console.group('pdfGoTOpage');
  if (!this.currentPdf.pdf) {
    console.log('PDF não carregado');    
    return;
  }
  this.currentPdf.pageNumber = pageNumber;
  const page = await this.currentPdf.pdf.getPage(pageNumber);
  this.currentPdf.page = page;
  let viewport: CustomViewPort = page.getViewport(this.currentPdf.zoom) as CustomViewPort;

  let x = 0;
  if (viewport.width > this.currentPdf.canvasWidth) {
    x = -(viewport.width - this.currentPdf.canvasWidth) / 2;
  }
  let y = viewport.height;
  if (viewport.height > this.currentPdf.canvasHeight) {
    y = -(viewport.height - this.currentPdf.canvasHeight) / 2 + viewport.height;
  }

  console.log(x, y);

  viewport.transform[4] = x;
  viewport.transform[5] = y;

  let renderContext = {    
    canvasContext: (this.canvasRenderContext2D as CanvasRenderingContext2D),
    viewport: viewport,    
  };
  console.log('Novo Render Context', renderContext);  
  window.clearInterval(this.interval);
  const renderTask = await page.render(renderContext);
  console.log('renderTask', renderTask);
  console.log('renderContext', renderContext);
  console.log('page', page);  
  console.groupEnd();
  this.setState(
    (s) => pageNumber === s.paginaAtual ? null : ({paginaAtual: pageNumber, carregando: false}),
    () => this.focaNaDivPricincipal()
  );
  
  }

pdfAumentaZoom() {
  let atual = this.currentPdf.zoom;
  let futuro = atual + 0.2;
  this.currentPdf.zoom = futuro;
  this.pdfGotoPage(this.currentPdf.pageNumber as number);

}

pdfDiminuiZoom() {
  let atual = this.currentPdf.zoom;
  let futuro = atual - 0.2;
  this.currentPdf.zoom = futuro;
  this.pdfGotoPage(this.currentPdf.pageNumber as number);

}

pdfPagProxima() {
  if (!this.currentPdf.pageNumber) {
    return;
  }
  if (this.currentPdf.pageNumber === this.currentPdf.totalPages) {
    return;
  }
  this.pdfGotoPage(this.currentPdf.pageNumber + 1);
}

pdfPagAnterior() {
  if (!this.currentPdf.pageNumber) {
    return;
  }
  if (this.currentPdf.pageNumber === 1) {
    return;
  }
  this.pdfGotoPage(this.currentPdf.pageNumber - 1);
}

focaNaDivPricincipal() {
  console.log('focaNaDivPricncipal()', document.activeElement);
  if (!this.divPrincipal) {
    console.log('owxe...');
    return;
  }
  this.divPrincipal.focus();
  console.log(' + focaNaDivPricncipal() >>> ', document.activeElement);  
}

  componentDidMount() {
    if (this.canvas) {      
      this.canvas.height = this.currentPdf.canvasHeight;
      this.canvas.width = this.currentPdf.canvasWidth;      
      this.canvasRenderContext2D = this.canvas.getContext('2d');
      console.log(this.canvasRenderContext2D);
      const stringState = localStorage.getItem(this.localStorageKey);
      let stateSalvo = {situacao: {}};
      if (stringState) {
        stateSalvo = JSON.parse(stringState);
      }
      const newStateSituacao = Object.keys(stateSalvo.situacao).filter(
        (proc) => stateSalvo.situacao[proc] === 'AGUARDA INSCRIÇÃO'
      );
      const newSituacaoObj = {};
      newStateSituacao.map(
        proc => {
          if (this.eprocessoData[proc]) {
            newSituacaoObj[proc] = 'AGUARDA INSCRIÇÃO';
          }
        }
      );
      this.setState({situacao: newSituacaoObj});
    }
  }

render() {

  let aguarda = Object.keys(this.state.situacao)
      .filter(key => this.state.situacao[key] === 'AGUARDA INSCRIÇÃO')
      .filter(key => this.eprocessoData[key] && this.eprocessoData[key]['n_mero de inscri__o'].length > 2);
  console.log(aguarda);

  return (
    <div 
      ref={d => this.divPrincipal = d} 
      className="App" 
      tabIndex={0} 
      onKeyDown={this.handlePress} 
      style={{position: 'relative', maxWidth: '100vw'}}
    >
       
      <div

        style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
      >
    <div ref={node => this.outerDiv = node}>
      <canvas style={{zIndex: 2}} ref={n => this.canvas = n} id="pdfcanvas"/></div>
        {Object.keys(this.eprocessoData)        
        .map(
          (proc, i) => (
            <Linha
              loadPDF={this.loadPDF}
              key={proc}
              index={i}
              atualizaColecao={this.atualizaColecao}
              processo={this.eprocessoData[proc]}
              numero={proc}
              trans={trans}
              selecionado={proc === this.state.selecionado}
              situacao={this.state.situacao[proc]}
            />)
        )
        }

      </div>
      
      <div style={{margin: '1em'}}>
        {this.state.destinos
        .filter(d => d !== 'AGUARDA INSCRIÇÃO')
        .map(
          (dst) => {
            return (<div key={dst}>
              <h2 style={{display: 'inline-block'}}>{dst}</h2>
              <button 
                style={{display: 'inline-block'}}
                onClick={() => this.copy(Object.keys(this.state.situacao).filter(
                  (numProc) => this.state.situacao[numProc] === dst
                  ).join(this.state.separador))}
              > copia
              </button>              
              <div style={{textOverflow: ''}}>{Object.keys(this.state.situacao).filter(
                (numProc) => this.state.situacao[numProc] === dst
              ).map(a => <span style={{display: 'inline-block', margin: 3}} key={'k' + a}>{a}</span>)}</div>
              
            </div>);
          }
        )}
        
        {aguarda.length > 0 && <div key={'r'}>
              <h2 style={{display: 'inline-block'}}>Aguarda Inscritos --> </h2>
              <button 
                style={{display: 'inline-block'}}
                onClick={() => this.copy(aguarda.join(this.state.separador))}
              > copia
              </button>   
            </div>}
            <button onClick={() => this.setState((s) => ({separador: s.separador === ',' ? '\n' : ','}))}>
              Separador: {this.state.separador}
            </button>
            <textarea 
              style={{
                margin: '0px',
                width: '100%',
                height: '5em',
                border: '2px solid rgb(169, 169, 169)',
                backgroundColor: 'rgb(240, 245, 255)',
                padding: '1em',
                boxSizing: 'border-box',
                resize: 'vertical',
                }} 
              ref={node => this.textarea = node}
            />
        </div>
        <div 
          style={{
            position: 'fixed',
            right: 30, 
            top: 100, 
            margin: 'auto', 
            padding: 20,
            backgroundColor: '#003876',
            visibility: this.state.showInput ? 'inherit' : 'hidden',

          }}
        >
        <input 
          ref={node => this.input = node} 
          onKeyDown={this.addSituacao}
          style={{
            fontSize: '3em', 
            padding: 10,
            }}
        />
        </div>

        <div 
          style={{
            position: 'fixed',
            right: 30, 
            bottom: 200, 
            margin: 'auto', 
            padding: 20,
            backgroundColor: '#003876',
            visibility: this.state.showGotoPageInput ? 'inherit' : 'hidden',
          }}
        >
        <input 
          ref={node => this.gotoinput = node} 
          onKeyDown={this.goToPageInputAction}
          style={{
            fontSize: '4em', 
            padding: 10,
            }}
          size={5}
        />
        </div>

        <div 
          style={{
          backgroundColor: '#ccc',
          display: 'flex',
          position: 'fixed',
          top: 0,
          right: 0,          
          padding: 5,
        }}
        >
          {this.state.paginaAtual}
          {' / '}
          {this.state.totalPaginas}
          {' - '}
          {this.state.selecionado}
          {'    |  '}
          {this.state.situacao[this.state.selecionado]}
        </div>
        <div 
          style={{
          backgroundColor: '#ccc',
          display: 'flex',
          position: 'fixed',
          bottom: 0,
          right: 0,          
          padding: 5,
        }}
        > <div>
          {Object.keys(this.state.situacao).length}
          {' / '}
          {Object.keys(this.eprocessoData).length} processos.
          </div>
          <div>
          <span 
            style={{
              padding: 2, 
              color: '#fff', 
              backgroundColor: Object.keys(this.state.situacao).length < Object.keys(this.eprocessoData).length ? 
                '#111' : 'red'
            }}
          >
          {this.state.selecionado && 
           this.eprocessoData[this.state.selecionado] &&
            this.eprocessoData[this.state.selecionado]['nome _ltimo documento confirmado']}
          </span>
            <span style={{padding: 2, color: '#000', backgroundColor: '#eee'}}>{this.state.selecionado && 
           this.eprocessoData[this.state.selecionado] &&
            this.eprocessoData[this.state.selecionado]['nome equipe _ltima']}
            </span>
            <span style={{padding: 2, color: '#fff', backgroundColor: '#122'}}>{this.state.selecionado && 
           this.eprocessoData[this.state.selecionado] &&
            this.eprocessoData[this.state.selecionado]['nome contribuinte']}
            </span>
          </div>
        </div>
    </div>
    
  );
}
}

export default App;
