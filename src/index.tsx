import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
// import { PDFJSStatic } from "pdfjs-dist";
import * as pdfjs from 'pdfjs-dist';
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker';


const pdfjsWorkerBlob = new Blob([pdfWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
// pdfjs.workerSrc = pdfjsWorkerBlobURL;

// const pdf = new pdfjs.PDFJS()
// console.log('pdf', pdf)
const PORT_SERVER: string = (window as any).PORT_SERVER || "9090";

// pdfjs.PDFJS.workerSrc = pdfWorker;
(pdfjs as any).GlobalWorkerOptions.workerSrc = pdfjsWorkerBlobURL;
declare const eprocData: object | null;
console.log("eprocessoData", eprocData);

(async function () {
  console.info("INICIO:", pdfjs, pdfWorker);
  let eprocDataFinal: object = { __META__: {} };
  if (eprocData === null) {
    console.log("vai atrás do api pq o da janela tá null");
    try {
      let response = await fetch(`http://localhost:${PORT_SERVER}/json`);
      if (response.status !== 200) {
        console.log(
          "Problema no Fetch Inicial. Status Code: " + response.status
        );
        return;
      }
      // Examine the text in the response
      let data = await response.json();
      console.log("veio do fetch");
      eprocDataFinal = data;
    } catch (error) {
      console.log("ERRO", error);
      ReactDOM.render(<h1>Erro</h1>, document.getElementById(
        "root"
      ) as HTMLElement);
    }
  } else {
    eprocDataFinal = eprocData;
  }

  ReactDOM.render(
    <App data={eprocDataFinal} PDFJS={pdfjs as any} portServer={PORT_SERVER} />,
    document.getElementById("root") as HTMLElement
  );
})();

registerServiceWorker();
