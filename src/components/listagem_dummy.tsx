import * as React from 'react';

interface Props {
    dst: string;
    copy: Function;
    situacao: object;
    separador: string;
    botaoAtivo: boolean;
    clicado: boolean;
}

interface HProps {
    children: string;    
}

const Hx: React.SFC<HProps> = (props) => {
    return (
        <h2 
            style={{
                display: 'inline-block',
                color: '#ecc',
            }}
        >
        {' '}{props.children}{' '}
        </h2>
    );
};

const Listagem: React.SFC<Props> = (props) => {
    const { dst, copy, situacao, separador, botaoAtivo, clicado } = props;
    const arr = Object.keys(situacao).filter(
        (numProc) => situacao[numProc] === dst
    );
    return (
        <div>
            {botaoAtivo && <Hx> * </Hx>}
            {clicado && <Hx> [OK] </Hx>}
            <h2 style={{ display: 'inline-block' }}>{dst}</h2>
            {botaoAtivo && <Hx> * </Hx>}
        <button
                style={{ 
                    display: 'inline-block',
                    backgroundColor: botaoAtivo ? '#cce' : 'unset',
                }}
                onClick={() => copy(arr.join(separador), dst)}
        > copia {dst}
        </button>        
            <div style={{ textOverflow: '' }}>{
                arr.map(a => <span style={{ display: 'inline-block', margin: 3 }} key={'k' + a}>{a}</span>)}</div>
        </div>
    );

};

export default Listagem; 