import * as React from 'react';
// import hljs from 'highlight.js/lib/highlight';
// import javascript from 'highlight.js/lib/languages/javascript';
// hljs.registerLanguage('javascript', javascript);
// import axios from 'axios';
import { postData } from '../app_functions/postData';
import * as Babel from '@babel/standalone';
// import 'babel-plugin-transform-es2015-arrow-functions';
// import * as BabelCore from '@babel/core';
import * as babelPluginBlockScoping from '@babel/plugin-transform-block-scoping';
import * as babelPluginTransformArrowFunctions from '@babel/plugin-transform-arrow-functions';
import * as Prism from 'prismjs';
import { debounce } from '../app_functions/debounce';
import '../../node_modules/prismjs/themes/prism-solarizedlight.css';

// tslint:disable:jsx-alignment

export interface EditorProps {
  endpoints: string[];
  on?: boolean;
}

export interface EditorState {
  transpiledCode: string;
  highlightedCode: string;
  code: string;
  selectedEndPoint: string;
  on: boolean;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
    public debounceBabel: Function;
    public codeBlockDisplayRef: React.RefObject<HTMLPreElement> = React.createRef();

    constructor(props: EditorProps) {
    super(props);
    this.state = {
      transpiledCode: '',
      highlightedCode: '',
      selectedEndPoint: props.endpoints[0],
      code: `console.log('teste')
      const massa = (a) => console.log('>>', a, '<<');
      Object.keys({a: 1, b: 2}).map(k => massa(k)`,
      on: this.props.on || false,
    };

    this.debounceBabel = debounce(this.transformBabel, 700, false);
  }

  public sendCodeToEndpoint = async () => {
    console.log('. endpoint: ', this.state.selectedEndPoint);
    const resp = await postData(this.state.selectedEndPoint, this.state.transpiledCode);
    console.log(resp);
  }

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e);
    if (!e || !e.target || !e.target.value) {
        console.log('algo falta');
        return;
    }
    this.debounceBabel(e.target.value);
  }

  getHtml = () => {
      return {
          __html: this.state.highlightedCode
      };
  }

  toggleEndpoint = () => {
      const index = this.props.endpoints.findIndex(e => this.state.selectedEndPoint === e);
      console.log(`Index ${index} do endpoint ${this.state.selectedEndPoint}`);
      let newIndex: number;
      if ((index + 1) === this.props.endpoints.length) {
          newIndex = 0;
      } else {
          newIndex = index + 1;
      }
      this.setState({selectedEndPoint: this.props.endpoints[newIndex]});
  }

  transformBabel = (c: string) => {
    let code: string;
    try {
        code = Babel.transform(c, { 
            presets: ['es2016'],
            plugins: [
                babelPluginBlockScoping,
                babelPluginTransformArrowFunctions,
                // 'transform-es2015-arrow-functions',
            ]
         }).code.replace(`'use strict'`, '').trim();
        
    } catch (error) {
        console.log('erro babel transform try block');
        return;
    }
    const high = Prism.highlight(code, Prism.languages.javascript, 'javascript' as any);
    this.setState({
        transpiledCode: code,
        highlightedCode: high,
    });
  }

  public render() {

    const offDiv = (
    <div 
      style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      }}
    >
      <button onClick={() => this.setState({on: true})}>EDITOR</button>
    </div>
    );

    return this.state.on ? (
        // tslint:disable-next-line:no-unused-expression
        <div style={{ padding: 2 }}>
            <div style={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                }}>
        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
          <div>
              <span><b>EndPoint:</b> </span>
              <a onClick={this.toggleEndpoint}>{this.state.selectedEndPoint}</a>
              <span>{'  '}</span>
              <a onClick={() => this.setState({on: false})}> (close editor)</a>
  
          </div>
        <textarea
          id="editor"
          rows={20}
          style={{
              width: '100%',
              padding: 10,
              fontFamily: 'monospace',
              fontSize: 17,
              lineHeight: '1.8em',
              backgroundColor: 'rgb(251, 251, 255)',
              border: 0,
              margin: 5,
              flex: 1
            }}
            onChange={this.handleChange}
            >
          {this.state.code}
        </textarea>
        </div>
        <div style={{width: '50%', padding: 4, margin: 5, backgroundColor: '#fcfdfe', flex: 1}}>
          <pre
            ref={this.codeBlockDisplayRef}
            dangerouslySetInnerHTML={this.getHtml()}
            />         
        </div>

        </div>
        <button style={{ width: '100%' }} onClick={this.sendCodeToEndpoint}>
          Mandar Código !
        </button>
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    ) : offDiv;
  }
}
