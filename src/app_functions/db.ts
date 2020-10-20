export type SituObj = { 
    numero: string, 
    situacao: string, 
    data: Date,
    judicial?: string,
}

export class DB {
    private database: IDBDatabase;
    private stringKey: string;
    private dbVersion: number;
    constructor(public key: string, version: number = 3) {
        this.stringKey = key;
        this.dbVersion = version;
    }
    setup() {
        if (typeof this.database !== "undefined") {
            console.log("db already init...")
            return
        }
        const dbreq = window.indexedDB.open(this.stringKey, this.dbVersion);
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
                if (!this.database.objectStoreNames.contains('documentos')) {
                    this.database.createObjectStore('documentos', { keyPath: 'processo' });
                    console.log('updated db')
                } else {
                }
                if (!this.database.objectStoreNames.contains('judiciais')) {
                    // console.log('não contem a "tabela" situacoes');
                    this.database.createObjectStore('judiciais', { keyPath: 'dossie' });
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
                console.log('db ERROR', ev);
                j();
            };
        });
        return prom;
    }

    addOrAtualiza = (obj: SituObj) => {
        if (typeof this.database === "undefined") {
            console.log("database not initialized yet...")
        }
        if (!obj.situacao) {
            console.error("não salva sem situação")
            throw new Error("Não salva sem situação");
            
        }
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
        if (typeof this.database === "undefined") {
            console.log("database not initialized yet...")
        }
        // console.log('transacao SIDA:', obj);
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
        if (typeof this.database === "undefined") {
            console.log("database not initialized yet...")
        }
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
        if (typeof this.database === "undefined") {
            console.log("database not initialized yet...")
        }
        const trans = this.database.transaction(['sida'], 'readonly');
        // @ts-ignore
        trans.oncomplete = (t) => {
            // console.log('x transacao SIDA GET completada.', t);
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
            // console.log('success: ', ev)
            callback(ev)
        }

    }

    getAll: () => Promise<Array<SituObj>> = () =>  {

        const retuno = new Promise((reso, reje) => {
            // console.log('database >', this.database);
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
                    // console.log('\n\nFIM\n\n');
                    // console.log('resolução ->', res, '');
                    return reso(res as SituObj[]);
                }
            };
            trans.onerror = () => {
                // console.log('cursor    transacao ERRO.');
                return reje('miow');
            };
        });
        return retuno as Promise<SituObj[]>;
    }

    getProcessoDocs = (processo: string) => {
        return new Promise(async (resolve, reject) => {
            if (typeof this.database === "undefined") {
                console.log("database not initialized yet...")
                await this.setup();
                console.log("initiualided")
            }
            const trans = this.database.transaction(['documentos'])
            const get = trans.objectStore('documentos').get(processo)
            get.onerror = function (e) {
                reject(e)
            }
            get.onsuccess = function (e) {
                const processo = (e.target as any).result
                // console.log('%c Processo Docs:', 'color: green', processo)
                resolve(processo)
            }
        })
    }

}