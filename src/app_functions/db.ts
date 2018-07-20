export class DB {
    private database: IDBDatabase;
    private stringKey: string;
    constructor(public key: string) {
        this.stringKey = key;
    }
    setup() {
        const dbreq = window.indexedDB.open(this.stringKey, 1);
        const prom = new Promise( (r, j) => {
            dbreq.onupgradeneeded = (ev) => {
                console.log('UPGRADE DB');
                this.database = dbreq.result;
                if (!this.database.objectStoreNames.contains('situacoes')) {
                    console.log('não contem a "tabela" situacoes');
                    this.database.createObjectStore('situacoes', {keyPath: 'numero'});                
                } else {
                    console.log('tem a tabela situacoes.', this.database);                
                }
                r(this);
            };
            dbreq.onsuccess = (ev: any) => {
                console.log('SUCESS DB');
                console.log('db sucess', ev);
                this.database = ev.target.result;
                console.log(this.database);
                r(this);
            };
            dbreq.onerror = (ev) => {
                console.log('db ERROR', ev);
                j();
            };            
        } );
        return prom;
    }

    addOrAtualiza = (obj: {numero: string, situacao: string, data: Date}) => {
        console.log('transacao:', obj);
        const trans = this.database.transaction(['situacoes'], 'readwrite'); 
        trans.oncomplete = () => {
            console.log('x transacao completada.');
        };
        trans.onerror = () => {
            console.log('x transacao ERRO.');
        };
        trans.onabort = () => {
            console.log('x transacao ABORTADA.');
        };
        const transacao = trans.objectStore('situacoes');        
        transacao.put(obj);
    }

    deleteRecord = (numero: string) => {
            console.log('transacao DELETE:', numero);
            const trans = this.database.transaction(['situacoes'], 'readwrite'); 
            trans.oncomplete = () => {
                console.log('x transacao completada.', numero, 'deletado.');
            };
            trans.onerror = () => {
                console.log('x transacao ERRO.');
            };
            trans.onabort = () => {
                console.log('x transacao ABORTADA.');
            };
            const transacao = trans.objectStore('situacoes');        
            transacao.delete(numero);
        
    }

    getAll = () => {
        
        const retuno = new Promise( (reso, reje) => {
            console.log('database >', this.database);
            const trans = this.database.transaction(['situacoes']).objectStore('situacoes').openCursor();
            const res: Array<any> = [];
            trans.onsuccess = (e: any) => {
                // console.log('   transacao cursor sucesso...', e, typeof e);
                const curr: IDBCursorWithValue = e.target.result;
                if (curr) {
                    // console.log(curr.value);
                    res.push(curr.value);
                    curr.continue();
                } else {
                    console.log('\n\nFIM\n\n');
                    console.log('resolução ->', res, '');
                    reso(res);
                }
            };
            trans.onerror = () => {
                console.log('cursor    transacao ERRO.');
                reje('miow');
            }; 
        } );        
        return retuno;
    }
    
}