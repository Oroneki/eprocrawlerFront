// import Linha from './Linha';
import { PDFDocumentProxy, PDFJSStatic, PDFPageProxy, PDFPageViewport as IPDFPageViewport } from "pdfjs-dist";
import * as React from "react";
import { createRef, RefObject } from "react";
import "./App.css";
import { addSituacao } from "./app_functions/addSituacao";
import { DB } from "./app_functions/db";
import { deleteArquivos } from "./app_functions/deleteArquivos";
import { handlePress } from "./app_functions/handlePress";
import { manejar } from "./app_functions/manejar";
import { JanelinhaProcessoInfo } from "./app_functions/WSEventInfo_interfaces";
import { ButtonMutex } from "./components/button_mutex";
import { Downloader } from "./components/downloader";
// import SidaConsulta from "./components/handleSida";
import { JanelinhaEventsLog } from "./components/janelinha_events";
import JSEditor from "./components/jseditor";
import Listagem from "./components/listagem_dummy";
import LoadingComponent from "./components/loading";
import Processo from "./components/processo";
import Context, { AppState, defaultState } from "./context";
import { WorkerComponentHandler } from "./web_workers/web_worker_component";
import { NovoSidaConsulta } from "./components/handleNovoSida";
import { DownloadFinishedListener } from "./components/downloadFinished_events";
import { DeleteDiff } from "./components/DeleteDiff";
import { PDFRenderTask } from 'pdfjs-dist'

interface PDFPageViewport extends IPDFPageViewport {
  transform: number[];
}
interface AppProps {
  data: object;
  PDFJS: PDFJSStatic;
  portServer: string;
}

interface CurrentPDF {
  pdf: PDFDocumentProxy | null;
  page: PDFPageProxy | null;
  zoom: number;
  verticalOffset: number;
  totalPages: number | null;
  pageNumber: number | null;
  canvasHeight: number;
  canvasWidth: number;
  numeroProcesso: string;
}

interface CustomViewPort extends PDFPageViewport {
  transform: number[];
}

const META: string = "__META__";
export const dataSitu = "dataSitu";

class App extends React.Component<AppProps, AppState> {
  public eprocessoData: object;
  public colecao: object;
  public input: HTMLInputElement | null;
  public gotoinput: HTMLInputElement | null;
  public PDF: PDFJSStatic;
  public localStorageKey: string;
  public sortKey: string;
  public handlePress: Function;
  public addSituacao: Function;
  public deleteArquivos: Function;
  public ws: WebSocket;
  public db: DB;
  public dbVersion: number;
  public currentPDFRendertask: PDFRenderTask | undefined;
  private textarea: HTMLTextAreaElement | null;
  private canvas: HTMLCanvasElement | null;
  private outerDiv: HTMLDivElement | null;
  private divPrincipal: RefObject<HTMLDivElement>;
  private canvasRenderContext2D: CanvasRenderingContext2D | null;
  private currentPdf: CurrentPDF;
  private interval: number;

  constructor(props: AppProps) {
    super(props);
    this.deleteArquivos = deleteArquivos(
      this,
      `http://localhost:${props.portServer}/deletefiles`
    );
    this.localStorageKey =
      this.props.data[META].codEquipe + this.props.data[META].pasta_download ||
      "none";
    // console.log("localStorageKey: ", this.localStorageKey);
    this.eprocessoData = this.props.data;
    this.atualizaColecao = this.atualizaColecao.bind(this);
    this.deleteArquivos = this.deleteArquivos.bind(this);
    this.handlePress = handlePress(this);
    this.addSituacao = addSituacao(this);
    this.colecao = {};
    this.PDF = this.props.PDFJS;
    this.loadPDF = this.loadPDF.bind(this);
    this.addBaixado = this.addBaixado.bind(this);
    this.focaNaDivPricincipal = this.focaNaDivPricincipal.bind(this);
    // console.log(this.props);
    this.currentPdf = {
      pdf: null,
      page: null,
      zoom: 1.5,
      verticalOffset: 0,
      pageNumber: null,
      totalPages: null,
      canvasHeight: window.outerHeight * 0.95,
      canvasWidth: window.outerWidth * 0.95,
      numeroProcesso: "0"
    };
    this.divPrincipal = createRef();
    this.sortKey = "_s";
    // console.log('%cMETA antes de apagar', 'font-size: 1.6em; background-color: yellow;', this.props.data[META])
    const downloaded: Set<string> = new Set(this.props.data[META].downloaded.split('|').map((s: string) => s.replace('.pdf', '')))
    this.state = {
      ...defaultState,
      processosList: [],
      situacao: {},
      loadPDF: this.loadPDF,
      focaNaDivPrincipal: this.focaNaDivPricincipal,
      setState: this.setState.bind(this),
      manejar: manejar(this),
      downloaded: downloaded,
    };


    delete this.eprocessoData[META];
    this.dbVersion = 3
    this.db = new DB(this.localStorageKey, this.dbVersion);
    // console.log(">>>>>", this.db);

    this.db.setup().then(() => {
      // console.log("foi");
      this.db.getAll().then((obj: any) => {
        if (!(obj instanceof Array)) {
          return;
        }
        let processosList = Object.keys(this.eprocessoData);
        const newSituacao = {};
        const agora = new Date().valueOf();
        for (let i = 0; i < processosList.length; i++) {
          const ProcObj = obj.find(a => a.numero === processosList[i]);
          // console.log("********", processosList[i], ProcObj);
          if (ProcObj) {
            if (agora - ProcObj.data > 1000 * 60 * 60 * 24 * 90) {
              // 90d
              // console.log(
              //   "antigo????",
              //   ProcObj.data,
              //   agora,
              //   agora - ProcObj.data
              // );
              this.db.deleteRecord(ProcObj.numero);
              continue;
            }
            newSituacao[ProcObj.numero] = ProcObj.situacao;
            this.eprocessoData[processosList[i]][dataSitu] = ProcObj.data;
            switch (ProcObj.situacao) {
              case "AGUARDA INSCRIÇÃO":
                this.eprocessoData[processosList[i]][this.sortKey] =
                  "9999999999999999";
                break;
              default:
                this.eprocessoData[processosList[i]][this.sortKey] =
                  "999999" + ProcObj.situacao;
                break;
            }
          } else {
            this.eprocessoData[processosList[i]][this.sortKey] =
              "00000" +
              this.eprocessoData[processosList[i]]["Nome Equipe Última"] ||
              "0";
          }
        }

        // console.log("processosList -> ", processosList);
        // console.log("this.eprocessoData -> ", this.eprocessoData);

        let newProcessosList = processosList.sort((a, b) => {
          if (
            this.eprocessoData[a] &&
            this.eprocessoData[b] &&
            this.eprocessoData[a][this.sortKey] >
            this.eprocessoData[b][this.sortKey]
          ) {
            return 1;
          }
          return -1;
        }).sort((a, b) => {
          if (this.state.downloaded.has(a) && this.state.downloaded.has(b)) {
            return 0
          }
          if (!this.state.downloaded.has(a) && !this.state.downloaded.has(b)) {
            return 0
          }
          if (this.state.downloaded.has(a) && !this.state.downloaded.has(b)) {
            return 1
          }
          if (!this.state.downloaded.has(a) && this.state.downloaded.has(b)) {
            return -1
          }
        });

        this.setState({
          situacao: newSituacao,
          processosList: newProcessosList
        });
      });
    });
  }

  atualizaColecao = (key, node) => {
    this.colecao[key] = node;
  };

  copy = (str: string, dstStr: string = "") => {
    (this.textarea as HTMLTextAreaElement).focus();
    (this.textarea as HTMLTextAreaElement).value = str;
    (this.textarea as HTMLTextAreaElement).select();
    document.execCommand("copy");
    const listaProcessos = str.split(",");
    // console.log("copiar ", str, listaProcessos);
    // console.log("copiar antes do forEach");
    this.setState(s => {
      let newCopiados = new Set(s.manejo.copiados.values());
      listaProcessos.forEach(proc => newCopiados.add(proc));
      return {
        botaoClickAtivo: dstStr,
        copyList: listaProcessos,
        manejo: {
          ...s.manejo,
          copiados: newCopiados
        }
      };
    });
    if (!(dstStr === "")) {
      this.setState(s => ({
        botoesClickClicados: s.botoesClickClicados.some(d => d === dstStr)
          ? s.botoesClickClicados
          : s.botoesClickClicados.concat(dstStr)
      }));
    }
    (this.textarea as HTMLTextAreaElement).blur();
  };

  goToPageInputAction = ev => {
    // console.log("addSitucao", ev);
    if (!(ev.nativeEvent.keyCode === 13 || ev.nativeEvent.keyCode === 27)) {
      return;
    }
    if (ev.nativeEvent.keyCode === 27) {
      this.setState({ showGotoPageInput: false }, this.focaNaDivPricincipal);
      return;
    }
    let novo = parseInt((this.gotoinput as HTMLInputElement).value, 10);
    if (novo < 0) {
      novo = this.state.totalPaginas + 1 + novo;
    }
    this.setState({ showGotoPageInput: false }, () => this.pdfGotoPage(novo));
  };

  loadPDF = async (pdfStr: string) => {
    if (Object.keys(this.eprocessoData).length === 0) {
      console.error('data FAIL', this.eprocessoData)
      return
    }
    if (this.interval) {
      window.clearInterval(this.interval);
    }
    this.setState({ carregando: true, loading: true });
    this.canvas.width = this.canvas.width; // reset canvas
    // console.log("loadPDF");
    if (this.canvas === null) {
      return;
    }
    // this.animaCanvas();
    // let pdfR: PDFDocumentProxy;
    // console.log(this.PDF);

    try {
      this.currentPdf.numeroProcesso = pdfStr;
      const pdf = await (this.PDF as any).getDocument(
        `http://localhost:${this.props.portServer}/pdf/${pdfStr}.pdf`
      );
      // console.log(
      //   "\n\nMUDANÇA DE PAGINA:",
      //   pdf,
      //   typeof pdf,
      //   pdf.numPages,
      //   "\n\n\n"
      // );
      if (!(this.currentPdf.numeroProcesso === pdfStr)) {
        console.error(
          `Erro! Promessa do PDF atrasou. 
        PDF atual: ${this.currentPdf.numeroProcesso}. PDF carrgeado: ${pdfStr}`
        );
        throw "Erro de carregamento - atraso";
      }
      this.currentPdf.pdf = pdf;
      let pageNumber = pdf.numPages;
      this.currentPdf.totalPages = pageNumber;
      this.pdfGotoPage(pageNumber);
      this.setState({
        totalPaginas: pageNumber,
        paginaAtual: pageNumber,
        loading: false
      });
    } catch (error) {
      console.log(`Não existe o pdf ${pdfStr}`);
      if (this.interval) {
        window.clearInterval(this.interval);
      }
      if (!this.canvasRenderContext2D) {
        return;
      }
      this.canvasRenderContext2D.fillStyle = "#eef";
      this.canvasRenderContext2D.fillRect(0, 0, 1000, 1000);
      this.canvasRenderContext2D.fillStyle = "#990000";
      this.canvasRenderContext2D.strokeStyle = "#000";
      this.canvasRenderContext2D.font = "48px Arial";
      this.canvasRenderContext2D.fillText(`${pdfStr} não baixado`, 100, 300);
      this.eprocessoData[pdfStr][this.sortKey] =
        this.eprocessoData[pdfStr][this.sortKey] + 15;
      this.setState(s => {
        let newProcessosList = s.processosList.sort((a, b) => {
          if (
            this.eprocessoData[a][this.sortKey] >
            this.eprocessoData[b][this.sortKey]
          ) {
            return 1;
          }
          return -1;
        });
        return { processosList: newProcessosList };
      });
    }
  };

  botaSituacaoNoCanvas = () => {
    // setTimeout(
    //   () => {
    // (this.canvasRenderContext2D as CanvasRenderingContext2D).fillStyle = `rgba(255, 10, 10, 0.27)`;
    // (this.canvasRenderContext2D as CanvasRenderingContext2D).font = '95px Arial Black';
    // (this.canvasRenderContext2D as CanvasRenderingContext2D).textAlign = 'center';
    // (this.canvasRenderContext2D as CanvasRenderingContext2D).rotate(-40 * Math.PI / 180);
    // const situacao: string = this.state.situacao[this.state.selecionado] || '';
    // const canvas = this.canvas || {width: 500, height: 500};
    // (this.canvasRenderContext2D as CanvasRenderingContext2D)
    // .fillText(`${situacao}`, -180, (canvas.height / 2) - 130);
    // (this.canvasRenderContext2D as CanvasRenderingContext2D).setTransform(1, 0, 0, 1, 0, 0);
    // },
    //   0);
  };

  animaCanvas = () => {
    const qq = Math.floor(Math.random() * 100);
    const ww = Math.floor(Math.random() * 100);
    (this
      .canvasRenderContext2D as CanvasRenderingContext2D).fillStyle = `rgba(${ww}, ${qq}, ${3 *
      qq -
      ww}, 0.1)`;
    this.interval = window.setInterval(() => {
      (this
        .canvasRenderContext2D as CanvasRenderingContext2D).fillStyle = `rgba(${ww}, ${qq}, ${3 *
        qq -
        ww}, 0.1)`;
      const x = Math.floor(Math.random() * 720);
      const y = Math.floor(Math.random() * 720);
      const q = Math.floor(Math.random() * 100);
      const w = Math.floor(Math.random() * 100);
      (this.canvasRenderContext2D as CanvasRenderingContext2D).fillRect(
        x,
        y,
        x + q,
        y + w
      );
      (this.canvasRenderContext2D as CanvasRenderingContext2D).fillRect(
        x,
        y,
        x - q,
        y - w
      );
      (this.canvasRenderContext2D as CanvasRenderingContext2D).fillRect(
        y,
        x,
        x + q,
        y + w
      );
      (this
        .canvasRenderContext2D as CanvasRenderingContext2D).fillStyle = `rgba(0, 0, 0, 0.5)`;
      (this.canvasRenderContext2D as CanvasRenderingContext2D).font =
        "60px sans-serif";
      (this.canvasRenderContext2D as CanvasRenderingContext2D).fillText(
        `Carregando`,
        250,
        160
      );
    }, 300);
  };

  async pdfGotoPage(pageNumber: number) {
    // if (this.currentPdf.pageNumber === pageNumber) {
    //   return
    // }
    // console.group("pdfGoTOpage");
    if (!this.currentPdf.pdf) {
      // console.log("PDF não carregado");
      // console.groupEnd();
      return;
    }
    this.currentPdf.pageNumber = pageNumber;
    const page = await this.currentPdf.pdf.getPage(pageNumber);
    console.log('%c0', "font-size: 1.5em; color: red;")
    this.currentPdf.page = page;
    let viewport: any = page.getViewport(this.currentPdf.zoom as any);
    console.log('%c1', "font-size: 1.5em; color: red;")
    // let contents = await page.getTextContent();
    // console.log("contents:", contents);

    console.log('%c1', "font-size: 1.5em; color: red;")
    let x = 0;
    if (viewport.width > this.currentPdf.canvasWidth) {
      x = -(viewport.width - this.currentPdf.canvasWidth) / 2;
    }
    let y = viewport.height;
    if (viewport.height > this.currentPdf.canvasHeight) {
      y =
        -(viewport.height - this.currentPdf.canvasHeight) / 2 + viewport.height;
    }

    // console.log(x, y);
    // console.log("viewPort Antes", viewport);
    viewport.transform[4] = x;
    viewport.transform[5] = y + this.currentPdf.verticalOffset;

    // console.log("viewPort Depois", viewport);

    let renderContext = {
      canvasContext: this.canvasRenderContext2D as CanvasRenderingContext2D,
      viewport: viewport
    };
    // console.log("Novo Render Context", renderContext);
    window.clearInterval(this.interval);
    console.log('%c2', "font-size: 1.5em; color: red;")
    if (this.currentPDFRendertask === undefined || !(this.currentPDFRendertask as any)._internalRenderTask.running) {
      // nada
      console.log('%cok %O', "font-size: 1.3em; color: green;", this.currentPDFRendertask)
    } else {
      console.log('%c-- %O', "font-size: 1.3em; color: blue;", this.currentPDFRendertask)
      await this.currentPDFRendertask.cancel()
      console.log('%c-- %O', "font-size: 1.3em; color: blue;", this.currentPDFRendertask)
      console.log(
        '%c > currentRenderTask: %O\nkeys: %O\nisRej  : %s\nisResol: %s \nprom: %O |', "font-size: 1.3em; color: darkred;",
        this.currentPDFRendertask,
        Object.keys(this.currentPDFRendertask.promise),
        this.currentPDFRendertask.promise.isRejected,
        this.currentPDFRendertask.promise.isResolved,
        this.currentPDFRendertask.promise,
      )
    }
    this.currentPDFRendertask = page.render(renderContext)
    console.log('%c3', "font-size: 1.5em; color: red;")
    try {
      await this.currentPDFRendertask.promise;
    } catch (error) {
      console.log('%cer? %o', "font-size: 1.2em; color: pink;", error)
    } finally {
      console.log('%csettled', "font-size: 1.3em; color: pink;")
      // console.log("settled")
    }
    console.log('%c4', "font-size: 1.5em; color: red;")



    // console.log("renderTask", renderTask);
    // console.log("renderContext", renderContext);
    // console.log("page", page);
    // console.groupEnd();
    this.setState(
      s => {

        if (pageNumber === s.paginaAtual) {
          return null
        }

        return { paginaAtual: pageNumber, carregando: false, loading: false }
      },
      () => {
        this.focaNaDivPricincipal();
        this.botaSituacaoNoCanvas();
      }
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

  pdfSobeVisualizacao() {
    this.currentPdf.verticalOffset = this.currentPdf.verticalOffset - 150;
    this.pdfGotoPage(this.currentPdf.pageNumber as number);
  }

  pdfBaixaVisualizacao() {
    this.currentPdf.verticalOffset = this.currentPdf.verticalOffset + 150;
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
    // console.log("focaNaDivPricncipal()", document.activeElement);
    if (!this.divPrincipal.current) {
      // console.log("owxe...");
      return;
    }
    this.divPrincipal.current.focus();
    // console.log(" + focaNaDivPricncipal() >>> ", document.activeElement);
  }

  limpaSituacao = () => {
    this.setState(s => {
      let newSituacao = s.situacao;
      delete newSituacao[s.selecionado];
      return { situacao: newSituacao };
    });
  };

  addBaixado = (processo: string) => {
    if (this.state.downloaded.has(processo)) {
      return
    }
    this.setState((state) => {
      const newSet = state.downloaded;
      newSet.add(processo)
      return { downloaded: newSet }
    })
  }

  componentDidMount() {
    if (this.canvas) {
      this.canvas.height = this.currentPdf.canvasHeight;
      this.canvas.width = this.currentPdf.canvasWidth;
      this.canvasRenderContext2D = this.canvas.getContext("2d");
      // console.log(this.canvasRenderContext2D);
      // console.log('%cprops.data', 'background-color: purple; color: white; font-size: 1.2em', this.props.data)
    }
  }

  render() {

    const posWidth = window.innerWidth / 2;
    const posHeight = window.innerHeight / 2;

    const divCanvas = (
      <div
        className="div-canvas-situacao"
        style={{
          left: posWidth + Math.floor(Math.random() * 10),
          top: posHeight - 500 + Math.floor(Math.random() * 10),
          display: this.state.loading ? 'none' : 'block'
        }}
      >
        {this.state.situacao[this.state.selecionado]}
      </div>
    );

    const todasSitu = Object.keys(this.state.situacao).reduce(
      (acc, atu) => acc.add(this.state.situacao[atu]),
      new Set()
    );

    this.state.destinos.forEach(destino => {
      todasSitu.add(destino);
    });

    // console.log("TODASSITU --> ", todasSitu, this.outerDiv);
    return (
      <Context.Provider value={this.state}>
        {this.state.loading && <LoadingComponent />}
        <div
          ref={this.divPrincipal}
          className="App"
          tabIndex={0}
          onKeyDown={e => this.handlePress(e)}
          style={{ position: "relative", maxWidth: "100vw" }}
        >
          <DocInfo db={this.db} pagAtual={this.state.paginaAtual} processo={this.state.selecionado} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <div id="outer_div" ref={node => (this.outerDiv = node)}>
              {divCanvas}
              <canvas
                style={{ zIndex: 2 }}
                ref={n => (this.canvas = n)}
                id="pdfcanvas"
              />
            </div>

            <div className="div-wrap-flex">
              {this.state.processosList.map(proc => (
                <Processo
                  key={"lis" + proc}
                  processo={proc}
                  procObj={this.eprocessoData[proc]}
                  downloaded={this.state.downloaded.has(proc)}
                />
              ))}
            </div>
          </div>

          <div
            className="div-wrap-flex botoes-copiar-div"
            style={{ margin: "1em" }}
          >
            {Array.from(todasSitu).map((dst: any) => {
              return (
                <Listagem
                  key={"lis_" + dst}
                  dst={dst}
                  copy={this.copy}
                  situacao={this.state.situacao}
                  separador={this.state.separador}
                  botaoAtivo={dst === this.state.botaoClickAtivo}
                  clicado={this.state.botoesClickClicados.some(s => s === dst)}
                />
              );
            })}
          </div>
          <button
            onClick={() =>
              this.setState(s => ({
                separador: s.separador === "," ? "\n" : ","
              }))
            }
          >
            Separador: {this.state.separador}
          </button>
          <button
            onClick={() => this.deleteArquivos(this.state.copyList.join(","))}
          >
            deletar {this.state.botaoClickAtivo}
          </button>
          <textarea
            style={{
              margin: "0px",
              width: "100%",
              height: "5em",
              border: "2px solid rgb(169, 169, 169)",
              backgroundColor: "rgb(240, 245, 255)",
              padding: "1em",
              boxSizing: "border-box",
              resize: "vertical"
            }}
            ref={node => (this.textarea = node)}
          />
          {this.state.showInput && (
            <div
              style={{
                position: "fixed",
                right: 30,
                top: 100,
                margin: "auto",
                padding: 20,
                backgroundColor: "#003876",
                boxShadow: "15px 15px 20px #000",
                zIndex: 4
              }}
            >
              <input
                ref={node => (this.input = node)}
                onKeyDown={e => this.addSituacao(e)}
                style={{
                  fontSize: "3em",
                  padding: 10
                }}
              />
            </div>
          )}

          {this.state.showGotoPageInput && (
            <div
              style={{
                position: "fixed",
                right: 30,
                bottom: 200,
                margin: "auto",
                padding: 20,
                backgroundColor: "#003876",
                boxShadow: "15px 15px 20px #000",
                zIndex: 4
              }}
            >
              <input
                ref={node => (this.gotoinput = node)}
                onKeyDown={this.goToPageInputAction}
                style={{
                  fontSize: "4em",
                  padding: 10
                }}
                size={5}
              />
            </div>
          )}
          <div style={{ margin: "auto" }}>

            <NovoSidaConsulta
              host={`http://localhost:${this.props.portServer}`}
              db={this.db}
              eprocessoData={this.props.data as any}
              situacoes={this.state.situacao as any}
              deleteArquivos={this.deleteArquivos}
              loadPdf={this.loadPDF}

            />
          </div>

          <InfoHeader
            paginaAtual={this.state.paginaAtual}
            selecionado={this.state.selecionado}
            totalPaginas={this.state.totalPaginas}
            situacao={this.state.situacao[this.state.selecionado]}
            loading={this.state.loading}
          />
          <BottomInfo
            processosListLength={this.state.processosList.length}
            situacaolength={Object.keys(this.state.situacao).length}
            processoObj={this.eprocessoData[this.state.selecionado]}

          />



          <JSEditor
            endpoints={[
              `http://localhost:${this.props.portServer}/eval_js`,
              `http://localhost:${this.props.portServer}/eval_sida_window_js`
            ]}
            on={false}
          />
          <br />
          <br />
          <br />
          {/* <JanelinhaEventsLog /> */}
          <ButtonMutex portServer={this.props.portServer} />
          <DeleteDiff deleteFiles={this.deleteArquivos} />
          <br />
          <br />
          <br />
          <WorkerComponentHandler wsPort={this.props.portServer} dbVersion={this.dbVersion} dbName={this.localStorageKey} />
          <Downloader />
          <DownloadFinishedListener addProcesso={this.addBaixado} />

        </div>
      </Context.Provider>
    );
  }
}

const BottomInfo = React.memo((props: {
  situacaolength: number,
  processosListLength: number,
  processoObj: any
}) => {
  return (
    <div
      className="bottom-info"
    >
      <div
        style={{
          backgroundColor:
            props.situacaolength <
              props.processosListLength
              ? "rgba(0, 0, 0, 0.3)"
              : "rgba(255, 100, 100, 0.6)"
        }}
      >
        {props.situacaolength}
        {" / "}
        {props.processosListLength} processos.
            </div>

      <div>
        <span
          style={{

            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.4)"
          }}
        >
          {props.processoObj && props.processoObj[
            "Nome Último Documento Confirmado"
          ]}
        </span>
        <span
          style={{ color: "#000", backgroundColor: "rgba(255, 255, 255, 0.4)" }}
        >
          {props.processoObj && props.processoObj[
            "Nome Equipe Última"
          ]}
        </span>
        <span
          style={{ color: "#fff", backgroundColor: "rgba(100, 100, 100, 0.4)" }}
        >
          {props.processoObj && props.processoObj[
            "Nome Contribuinte"
          ]}
        </span>
      </div>
    </div>
  )
})

const InfoHeader = React.memo(function (props: {
  paginaAtual: number,
  totalPaginas: number,
  selecionado: string,
  situacao: string,
  loading: boolean,
}) {
  if (props.loading) {
    return <div
      className="header-info-loading"
    >
      <h1 className="title is-6">
        CARREGANDO...
      </h1>
    </div>
  }
  return (<div
    className="header-info"
  >
    <h1 className="title is-6">

      {props.paginaAtual}
      {" / "}
      {props.totalPaginas}
      {" - "}
      {props.selecionado}
      {props.situacao && "    |  "}
      {props.situacao}
    </h1>

  </div>)
})

const DocInfo = function (props: { db: any, pagAtual: number, processo: string }) {
  const [doc, setDoc] = React.useState<string>('')
  const [ant, setAnt] = React.useState<string>('')
  const [i, setIni] = React.useState<number>(0)

  // console.log('%c props', 'background-color: black; color: white', props)
  React.useEffect(() => {
    (async () => {
      // console.log('%c ...', 'color: red')
      const obj: JanelinhaProcessoInfo | undefined = await props.db.getProcessoDocs(props.processo)
      if (obj === undefined) {
        setDoc('')
        return
      }
      let indice = obj.infos.length - 1
      if (indice < 1) {
        return
      }
      while (true) {
        if (indice < 0) {
          setDoc('')
          return
        }
        const sub = obj.infos[indice]
        // console.log('sub --> ', sub, indice)
        if (sub.pag_inicio <= props.pagAtual && sub.pag_fim >= props.pagAtual) {
          setDoc(sub.nome_doc)
          setIni(sub.pag_inicio)
          if (indice > 0) {
            setAnt(obj.infos[indice - 1].nome_doc)
          }
          return
        }
        indice--
      }
    })()
  }, [props.pagAtual, props.processo])
  return (
    <div className="doc-info">
      <span className="doc-info-ant">
        {ant}
      </span>
      <span className="doc-info-i">
        {i}
      </span>
      <span className="doc-info-doc">
        {doc}
      </span>
    </div>
  )
}

export default App;
