import * as React from 'react';

interface Props {
    processo: object;
    trans: object;
    numero: string;
    selecionado: boolean;
    index: number;
    atualizaColecao: Function;
    loadPDF: Function;
    situacao: string;    
}

const Linha: React.SFC<Props> = (props) => {
    return (        
        <div
            className="processo"
            id={props.numero}            
            ref={(node) => props.atualizaColecao(props.numero, node)}
            tabIndex={props.index + 1}
            style={{
                margin: 20,
                position: 'relative',
                width: '85%',
                display: 'flex',
                flexDirection: 'row',
                border: '2px solid black',
                flexWrap: 'wrap',
                backgroundColor: props.selecionado ? '#d1d7dc' : '#e1e7ec',
            }}
        >
            <div 
                onClick={() => props.loadPDF(props.numero)} 
                style={{ 
                    fontSize:  props.selecionado ? '1.6em' : '1.3em', 
                    width: '100%', 
                    cursor: 'pointer', 
                }}
            >
                {props.numero}
            </div>
            {props.situacao && 
            <div
                style={{
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    fontSize: '1.2em',
                }}
            >{props.situacao}
            </div>}
            {props.selecionado && <div 
                style={{ 
                    maxWidth: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    color: props.selecionado ? 'inherit' : '#d1d7dc',                    
                }}
            >
            {Object.keys(props.processo).map(
                k => (
                    <div style={{ width: '100%', display: 'block' }} key={props.numero + '-' + k.replace(/\W/g, '')}>
                        <span>
                            {props.trans[k]} -->
              </span>
                        <span>
                            {props.processo[k]}
                        </span>
                    </div>)
            )}
            <button onClick={() => props.loadPDF()}>loadPDF</button>
            </div>}
        </div>
        
    );

};

export default Linha;
