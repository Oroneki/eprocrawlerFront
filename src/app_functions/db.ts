export class DB {
    private database: IDBDatabase;
    private stringKey: string;
    constructor(public key: string) {
        this.stringKey = key;
    }
    setup() {
        const dbreq = window.indexedDB.open(this.stringKey, 2.1);
        const prom = new Promise((r, j) => {
            dbreq.onupgradeneeded = (ev) => {
                // console.log('UPGRADE DB');
                this.database = dbreq.result;
                if (!this.database.objectStoreNames.contains('situacoes')) {
                    // console.log('não contem a "tabela" situacoes');
                    this.database.createObjectStore('situacoes', { keyPath: 'numero' });
                } else {
                    // console.log('tem a tabela situacoes.', this.database);                
                }
                if (!this.database.objectStoreNames.contains('sida')) {
                    // console.log('não contem a "tabela" situacoes');
                    this.database.createObjectStore('sida', { keyPath: 'processo' });
                } else {
                    // console.log('tem a tabela situacoes.', this.database);                
                }
                r(this);
            };
            dbreq.onsuccess = (ev: any) => {
                // console.log('SUCESS DB');
                // console.log('db sucess', ev);
                this.database = ev.target.result;
                // console.log(this.database);
                r(this);
            };
            dbreq.onerror = (ev) => {
                // console.log('db ERROR', ev);
                j();
            };
        });
        return prom;
    }

    addOrAtualiza = (obj: { numero: string, situacao: string, data: Date }) => {
        // console.log('transacao:', obj);
        const trans = this.database.transaction(['situacoes'], 'readwrite');
        trans.oncomplete = () => {
            // console.log('x transacao completada.');
        };
        trans.onerror = () => {
            // console.log('x transacao ERRO.');
        };
        trans.onabort = () => {
            // console.log('x transacao ABORTADA.');
        };
        const transacao = trans.objectStore('situacoes');
        transacao.put(obj);
    }

    addOrAtualizaSida = (obj: any) => {
        console.log('transacao SIDA:', obj);
        const trans = this.database.transaction(['sida'], 'readwrite');
        trans.oncomplete = () => {
            // console.log('x transacao completada.');
        };
        trans.onerror = () => {
            // console.log('x transacao ERRO.');
        };
        trans.onabort = () => {
            // console.log('x transacao ABORTADA.');
        };
        const transacao = trans.objectStore('sida');
        transacao.put(obj);
    }

    deleteRecord = (numero: string) => {
        // console.log('transacao DELETE:', numero);
        const trans = this.database.transaction(['situacoes'], 'readwrite');
        trans.oncomplete = () => {
            // console.log('x transacao completada.', numero, 'deletado.');
        };
        trans.onerror = () => {
            // console.log('x transacao ERRO.');
        };
        trans.onabort = () => {
            // console.log('x transacao ABORTADA.');
        };
        const transacao = trans.objectStore('situacoes');
        transacao.delete(numero);

    }

    getSidaRecord = (processo: string, callback: (e: Event) => void) => {
        const trans = this.database.transaction(['sida'], 'readonly');
        // @ts-ignore
        trans.oncomplete = (t) => {
            console.log('x transacao SIDA GET completada.', t);
        };
        trans.onerror = () => {
            // console.log('x transacao ERRO.');
        };
        trans.onabort = () => {
            // console.log('x transacao ABORTADA.');
        };
        const store = trans.objectStore('sida');
        const req = store.get(processo)
        req.onsuccess = (ev) => {
            console.log('success: ', ev)
            callback(ev)
        }

    }

    getAll = () => {

        const retuno = new Promise((reso, reje) => {
            // console.log('database >', this.database);
            const trans = this.database.transaction(['situacoes']).objectStore('situacoes').openCursor();
            const res: Array<any> = [];
            trans.onsuccess = (e: any) => {
                console.log('   transacao cursor sucesso...', e, typeof e);
                const curr: IDBCursorWithValue = e.target.result;
                if (curr) {
                    console.log(curr.value);
                    res.push(curr.value);
                    curr.continue();
                } else {
                    // console.log('\n\nFIM\n\n');
                    // console.log('resolução ->', res, '');
                    reso(res);
                }
            };
            trans.onerror = () => {
                // console.log('cursor    transacao ERRO.');
                reje('miow');
            };
        });
        return retuno;
    }

}