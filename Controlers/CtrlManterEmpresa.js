"use strict";

import Status from "../Models/Status.js";
import Empresa from "../Models/Empresa.js";
import ViewerEmpresa from "../Viwers/ViwerEmpresa.js";
import DaoEmpresa from "../Dao/DaoEmpresa.js";

export default class CtrlManterEmpresa {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de Departamentos
  #viewer;   // Referência para o gerenciador do viewer
  #posAtual; // Indica a posição do objeto Departamento que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoEmpresa();
    this.#viewer = new ViewerEmpresa(this);
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
    let conjEmpresas = await this.#dao.obterEmpresas();
    
    // Se a lista de departamentos estiver vazia
    if(conjEmpresas.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjEmpresas.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjEmpresas.length, conjEmpresas[this.#posAtual - 1]);
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjEmpresas = await this.#dao.obterEmpresas();
    if(conjEmpresas.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjEmpresas = await this.#dao.obterEmpresas();
    if(this.#posAtual < conjEmpresas.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjEmpresas = await this.#dao.obterEmpresas();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjEmpresas = await this.#dao.obterEmpresas();
    this.#posAtual = conjEmpresas.length;
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
 
  async incluir(identificador, cnpj, razaoSocial, nomeFantasia) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let empresa = new Empresa(identificador, cnpj, razaoSocial, nomeFantasia);
        await this.#dao.incluir(empresa); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(identificador, cnpj, razaoSocial, nomeFantasia) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let empresa = await this.#dao.obterEmpresaPeloIdentificador(identificador);
        if(empresa == null) {
          alert("Empresa com a identificador " + identificador + " não encontrado.");
        } else {
          empresa.setNomeFatasia(nomeFantasia);
          empresa.setCnpj(cnpj);
          empresa.setRazaoSocial(razaoSocial);
          await this.#dao.alterar(empresa); 
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
        let empresa = await this.#dao.obterEmpresaPeloIdentificador(identificador);
        if(empresa == null) {
          alert("Empresa com a identificador " + identificador + " não encontrado.");
        } else {
          await this.#dao.excluir(empresa); 
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
