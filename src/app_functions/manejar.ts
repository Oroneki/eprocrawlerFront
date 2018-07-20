import { ManejoState } from '../context';

export const manejar = (self) => (resultado, processo) => {
    console.log('manejar -> ', resultado, processo);    
    self.setState((state) => {    
        const manejoAntigo: ManejoState = self.state.manejo;        
        let newState: ManejoState;
        console.log('manejar ->', resultado, processo, 'antigo', manejoAntigo);
        switch (resultado) {
        case 'deletou':            
            const newDeletados = new Set(manejoAntigo.deletadosOk.values());
            console.log('newDeletados', newDeletados);
            newDeletados.forEach(element => {
                console.log('deletar ', element);
                self.db.deleteRecord(element);
            });
            newDeletados.add(processo);
            newState = {
                ...manejoAntigo,
                deletadosOk: newDeletados,                
                };
            if (manejoAntigo.errosDelete.has(processo)) {
                const newErros = new Set(manejoAntigo.errosDelete.values());
                newErros.delete(processo);
                newState = {
                    ...newState,
                    errosDelete: newErros
                };
            }            
            break;
        case 'falhou':
            const newErros2 = new Set(manejoAntigo.errosDelete.values());            
            newErros2.add(processo);
            newState = {
                ...manejoAntigo,
                errosDelete: newErros2,                
                };
            break;
        case 'copiou':
            const newCopiados = new Set(manejoAntigo.copiados.values());            
            newCopiados.add(processo);
            newState = {
                ...manejoAntigo,
                copiados: newCopiados,                
                };
            break;    
        default:
            return null;            
        }
        return {
            ...state,
            manejo: newState,
        };
    }
    );
};