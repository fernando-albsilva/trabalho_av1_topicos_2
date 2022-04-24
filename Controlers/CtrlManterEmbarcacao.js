"use strict";

import Status from "../Models/Status.js";
import Embarcacao from "../Models/Embarcacao.js";
import ViewerEmbarcacao from "../Viwers/ViwerEmbarcacao.js";
import DaoEmbarcacao from "../Dao/DaoEmbarcacao.js";

export default class CtrlManterEmbarcacao {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de Embarcacaos
  #viewer;   // Referência para o gerenciador do viewer
  #posAtual; // Indica a posição do objeto Embarcacao que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoEmbarcacao();
    this.#viewer = new ViewerEmbarcacao(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os departamentos presentes na base
    let conjEmbarcacao = await this.#dao.obterEmbarcacoes();
    
    // Se a lista de departamentos estiver vazia
    if(conjEmbarcacao.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjEmbarcacao.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjEmbarcacao.length, conjEmbarcacao[this.#posAtual - 1]);
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjEmbarcacao = await this.#dao.obterEmbarcacoes();
    if(conjEmbarcacao.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjEmbarcacao = await this.#dao.obterEmbarcacoes();
    if(this.#posAtual < conjEmbarcacao.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjEmbarcacao = await this.#dao.obterEmbarcacoes();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjEmbarcacao = await this.#dao.obterEmbarcacoes();
    this.#posAtual = conjEmbarcacao.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(identificador, registro, nome, tamanho) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let embarcacao = new Embarcacao(identificador, registro, nome, tamanho);
        await this.#dao.incluir(embarcacao);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(identificador, registro, tamanho, nome) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let embarcacao = await this.#dao.obterEmbarcacaoPeloIdentificador(identificador);
        if(embarcacao == null) {
          alert("Embarcacao com a identificador " + identificador + " não encontrado.");
        } else {
          embarcacao.setNome(nome);
          embarcacao.setRegistro(registro);
          embarcacao.setTamanho(tamanho);
          await this.#dao.alterar(embarcacao);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async excluir(identificador) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let embarcacao = await this.#dao.obterEmbarcacaoPeloIdentificador(identificador);
        if(embarcacao == null) {
          alert("Embarcacao com a identificador " + identificador + " não encontrado.");
        } else {
          await this.#dao.excluir(embarcacao);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//
