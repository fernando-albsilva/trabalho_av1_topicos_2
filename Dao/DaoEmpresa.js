"use strict";

import ModelError from "../Models/ModelError.js";
import Empresa from "../Models/Empresa.js";

export default class DaoEmpresa {

    //-----------------------------------------------------------------------------------------//

    static conexao = null;

    constructor() {
        this.arrayEmpresas = [];
        this.obterConexao();
    }

    /*
    *  Devolve uma Promise com a referência para o BD
    */ 
    async obterConexao() {
        if(DaoEmpresa.conexao == null) {
            DaoEmpresa.conexao = new Promise(function(resolve, reject) {
            let requestDB = window.indexedDB.open("EmpresaDB", 1); 

            requestDB.onupgradeneeded = (event) => {
            let db = event.target.result;
            let store = db.createObjectStore("EmpresaST", {
                autoIncrement: true
            });
            store.createIndex("idxIdentificador", "identificador", { unique: true });
            };

            requestDB.onerror = event => {
            reject(new ModelError("Erro: " + event.target.errorCode));
            };

            requestDB.onsuccess = event => {
            if (event.target.result) {
                // event.target.result apontará para IDBDatabase aberto
                resolve(event.target.result);
            }
            else 
                reject(new ModelError("Erro: " + event.target.errorCode));
            };
        });
        }
        return await DaoEmpresa.conexao;
    }

    //-----------------------------------------------------------------------------------------//

    async obterEmpresas() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["EmpresaST"], "readonly");
                store = transacao.objectStore("EmpresaST");
                indice = store.index('idxIdentificador');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }
            let array = [];
            indice.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {        
                const novo = Empresa.assign(cursor.value);
                array.push(novo);
                cursor.continue();
                } else {
                resolve(array);
                }
            };
        });
        this.arrayEmpresas = await promessa;
        return this.arrayEmpresas;
    }

    //-----------------------------------------------------------------------------------------//

    async obterEmpresaPeloIdentificador(identificador) {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["EmpresaST"], "readonly");
                store = transacao.objectStore("EmpresaST");
                indice = store.index('idxIdentificador');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }

            let consulta = indice.get(identificador);
            consulta.onsuccess = function(event) { 
                if(consulta.result != null)
                resolve(Empresa.assign(consulta.result)); 
                else
                resolve(null);
            };
            consulta.onerror = function(event) { reject(null); };
        });
        let empresa = await promessa;
        return empresa;
    }

    //-----------------------------------------------------------------------------------------//

    async obterEmpresasPeloAutoIncrement() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
        let transacao;
        let store;
        try {
            transacao = connection.transaction(["EmpresaST"], "readonly");
            store = transacao.objectStore("EmpresaST");
        } 
        catch (e) {
            reject(new ModelError("Erro: " + e));
        }
        let array = [];
        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {        
            const novo = Empresa.assign(cursor.value);
            array.push(novo);
            cursor.continue();
            } else {
            resolve(array);
            }
        };
        });
        this.arrayEmpresas = await promessa;
        return this.arrayEmpresas;
    }

     //-----------------------------------------------------------------------------------------//

  async incluir(Empresa) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["EmpresaST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o Empresa", event.target.error));
      };
      let store = transacao.objectStore("EmpresaST");
      let requisicao = store.add(Empresa.deassign(Empresa));
      // let requisicao = store.add(Empresa);
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(Empresa) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["EmpresaST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o Empresa", event.target.error));
      };
      let store = transacao.objectStore("EmpresaST");     
      let indice = store.index('idxIdentificador');
      var keyValue = IDBKeyRange.only(Empresa.getIdentificador());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.identificador == Empresa.getIdentificador()) {
            const request = cursor.update(Empresa.deassign(Empresa));
            request.onsuccess = () => {
              console.log("[DaoEmpresa.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Empresa com a identificador " + Empresa.getIdentificador() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(Empresa) {

    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["EmpresaST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o Empresa", event.target.error));
      };
      let store = transacao.objectStore("EmpresaST");
      let indice = store.index('idxIdentificador');
      var keyValue = IDBKeyRange.only(Empresa.getIdentificador());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.identificador == Empresa.getIdentificador()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Empresa com a identificador " + Empresa.getIdentificador() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
