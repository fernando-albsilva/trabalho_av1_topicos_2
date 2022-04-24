"use strict";

import ModelError from "../Models/ModelError.js";
import Embarcacao from "../Models/Embarcacao.js";

export default class DaoEmbarcacao {

    //-----------------------------------------------------------------------------------------//

    static conexao = null;

    constructor() {
        this.arrayEmbarcacoes = [];
        this.obterConexao();
    }

    /*
    *  Devolve uma Promise com a referência para o BD
    */ 
    async obterConexao() {
        if(DaoEmbarcacao.conexao == null) {
            DaoEmbarcacao.conexao = new Promise(function(resolve, reject) {
            let requestDB = window.indexedDB.open("EmbarcacaoDB", 1);

            requestDB.onupgradeneeded = (event) => {
            let db = event.target.result;
            let store = db.createObjectStore("EmbarcacaoST", {
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
        return await DaoEmbarcacao.conexao;
    }

    //-----------------------------------------------------------------------------------------//

    async obterEmbarcacoes() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["EmbarcacaoST"], "readonly");
                store = transacao.objectStore("EmbarcacaoST");
                indice = store.index('idxIdentificador');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }
            let array = [];
            indice.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {        
                const novo = Embarcacao.assign(cursor.value);
                array.push(novo);
                cursor.continue();
                } else {
                resolve(array);
                }
            };
        });
        this.arrayEmbarcacoes = await promessa;
        return this.arrayEmbarcacoes;
    }

    //-----------------------------------------------------------------------------------------//

    async obterEmbarcacaoPeloIdentificador(identificador) {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
            let transacao;
            let store;
            let indice;
            try {
                transacao = connection.transaction(["EmbarcacaoST"], "readonly");
                store = transacao.objectStore("EmbarcacaoST");
                indice = store.index('idxIdentificador');
            } 
            catch (e) {
                reject(new ModelError("Erro: " + e));
            }

            let consulta = indice.get(identificador);
            consulta.onsuccess = function(event) { 
                if(consulta.result != null)
                resolve(Embarcacao.assign(consulta.result));
                else
                resolve(null);
            };
            consulta.onerror = function(event) { reject(null); };
        });
        let embarcacao = await promessa;
        return embarcacao;
    }

    //-----------------------------------------------------------------------------------------//

    async obterEmbarcacoesPeloAutoIncrement() {
        let connection = await this.obterConexao();      
        let promessa = new Promise(function(resolve, reject) {
        let transacao;
        let store;
        try {
            transacao = connection.transaction(["EmbarcacaoST"], "readonly");
            store = transacao.objectStore("EmbarcacaoST");
        } 
        catch (e) {
            reject(new ModelError("Erro: " + e));
        }
        let array = [];
        store.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {        
            const novo = Embarcacao.assign(cursor.value);
            array.push(novo);
            cursor.continue();
            } else {
            resolve(array);
            }
        };
        });
        this.arrayEmbarcacoes = await promessa;
        return this.arrayEmbarcacoes;
    }

     //-----------------------------------------------------------------------------------------//

  async incluir(Embarcacao) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["EmbarcacaoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o Embarcacao", event.target.error));
      };
      let store = transacao.objectStore("EmbarcacaoST");
      let requisicao = store.add(Embarcacao.deassign(Embarcacao));
      // let requisicao = store.add(Embarcacao);
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(Embarcacao) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["EmbarcacaoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o Embarcacao", event.target.error));
      };
      let store = transacao.objectStore("EmbarcacaoST");
      let indice = store.index('idxIdentificador');
      var keyValue = IDBKeyRange.only(Embarcacao.getIdentificador());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.identificador == Embarcacao.getIdentificador()) {
            const request = cursor.update(Embarcacao.deassign(Embarcacao));
            request.onsuccess = () => {
              console.log("[DaoEmbarcacao.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Embarcacao com a identificador " + Embarcacao.getIdentificador() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(Embarcacao) {

    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["EmbarcacaoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o Embarcacao", event.target.error));
      };
      let store = transacao.objectStore("EmbarcacaoST");
      let indice = store.index('idxIdentificador');
      var keyValue = IDBKeyRange.only(Embarcacao.getIdentificador());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.identificador == Embarcacao.getIdentificador()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Embarcacao com a identificador " + Embarcacao.getIdentificador() + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
