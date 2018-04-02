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

// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
declare const eprocData: object;

ReactDOM.render(
  <App data={eprocData} PDFJS={pdfjsLib}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
