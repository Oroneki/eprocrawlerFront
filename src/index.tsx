import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
// import * as pdfjs from 'pdfjs-dist/build/pdf';
// import * as pdfWorker from 'pdfjs-dist/build/pdf.worker';
const pdfjsLib = require('pdfjs-dist');
// console.log(pdfjs, typeof pdfjs);
// console.log(pdfWorker);
const pdfjsWorker = 'pdfjs-dist/build/pdf.worker.min.js';
const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdfjsLib.workerSrc = pdfjsWorkerBlobURL;

const PORT_SERVER: string = (window as any).PORT_SERVER || '9090';

// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
declare const eprocData: object | null;
console.log(eprocData);

(async function () {
  console.log('bootstrap');
  let eprocDataFinal: object = { '__META__': {} };
  if (eprocData === null) {
    console.log('vai atrás do api pq o da janela tá null');
    try {
      let response = await fetch(`http://localhost:${PORT_SERVER}/json`);
      if (response.status !== 200) {
        console.log('Problema no Fetch Inicial. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      let data = await response.json();
      console.log(data);
      console.log('veio do fetch');
      eprocDataFinal = data;
    } catch (error) {
      console.log('ERRO', error);
      ReactDOM.render(
        <h1>Erro</h1>,
        document.getElementById('root') as HTMLElement
      );
    }

  } else {
    eprocDataFinal = eprocData;
  }

  ReactDOM.render(
    <App data={eprocDataFinal} PDFJS={pdfjsLib} portServer={PORT_SERVER}/>,
    document.getElementById('root') as HTMLElement
  );
}());

registerServiceWorker();
