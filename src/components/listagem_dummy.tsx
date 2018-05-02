import * as React from 'react';

interface Props {
    dst: string;
    copy: Function;
    situacao: object;
    separador: string;
    botaoAtivo: boolean;
    clicado: boolean;
}

// interface HProps {
//     children: string;    
// }

// const Hx: React.SFC<HProps> = (props) => {
//     return (
//         <h2 
//             style={{
//                 display: 'inline-block',
//                 color: '#ecc',
//             }}
//         >
//         {' '}{props.children}{' '}
//         </h2>
//     );
// };

const Listagem: React.SFC<Props> = (props) => {
    const { dst, copy, situacao, separador, botaoAtivo, clicado } = props;
    const arr = Object.keys(situacao).filter(
        (numProc) => situacao[numProc] === dst
    );
    return (
        <div className="listagem-div">
            <button
                style={{
                    display: 'inline-block',
                    backgroundColor: botaoAtivo ? '#a0d6ff' : clicado ? 'rgba(255, 255, 255, 0)' : 'none',
                    color: clicado ? 'rgb(137, 137, 137)' : 'black',
                }}
                onClick={() => copy(arr.join(separador), dst)}
            > COPIAR {dst} ({arr.length})
            </button>
        </div>

    );

};

export default Listagem; 