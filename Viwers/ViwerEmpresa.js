import Status from "../Models/Status.js";
import ViewerError from "./ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerEmpresa {

  #ctrl;
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar       = this.obterElemento('divNavegar');
    this.divComandos      = this.obterElemento('divComandos');
    this.divAviso         = this.obterElemento('divAviso');
    this.divDialogo       = this.obterElemento('divDialogo');

    this.btPrimeiro       = this.obterElemento('btPrimeiro');
    this.btAnterior       = this.obterElemento('btAnterior');
    this.btProximo        = this.obterElemento('btProximo');
    this.btUltimo         = this.obterElemento('btUltimo');
 
    this.btIncluir        = this.obterElemento('btIncluir');
    this.btExcluir        = this.obterElemento('btExcluir');
    this.btAlterar        = this.obterElemento('btAlterar');
    this.btSair           = this.obterElemento('btSair');

    this.btOk             = this.obterElemento('btOk');
    this.btCancelar       = this.obterElemento('btCancelar');

    this.tfIdentificador  = this.obterElemento('tfIdentificador');
    this.tfNomeFantasia   = this.obterElemento('tfNomeFantasia');
    this.tfRazaoSocial    = this.obterElemento('tfRazaoSocial');
    this.tfCnpj           = this.obterElemento('tfCnpj');
      
    this.btPrimeiro.onclick = fnBtPrimeiro; 
    this.btProximo.onclick = fnBtProximo; 
    this.btAnterior.onclick = fnBtAnterior; 
    this.btUltimo.onclick = fnBtUltimo; 

    this.btIncluir.onclick = fnBtIncluir; 
    this.btAlterar.onclick = fnBtAlterar; 
    this.btExcluir.onclick = fnBtExcluir; 

    this.btOk.onclick = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

//------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

//------------------------------------------------------------------------//
  
  getCtrl() { 
    return this.#ctrl;
  }

//------------------------------------------------------------------------//
  
  apresentar(pos, qtde, empresa) {
    
    this.configurarNavegacao( pos <= 1 , pos == qtde );   

    if(empresa == null) {
      this.tfIdentificador.value = "";
      this.tfNomeFantasia.value = "";
      this.tfCnpj.value = "";
      this.tfRazaoSocial.value = "";
      this.divAviso.innerHTML = " Número de empresa: 0";
    } else {
      this.tfIdentificador.value = empresa.getIdentificador();
      this.tfNomeFantasia.value = empresa.getNomeFantasia();
      this.tfRazaoSocial.value = empresa.getRazaoSocial();
      this.tfCnpj.value = empresa.getCnpj();
      this.divAviso.innerHTML = "Posição: " + pos + " | Número de Empresas: " + qtde;
    }
  }

//------------------------------------------------------------------------//

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled   = flagFim;
    this.btProximo.disabled  = flagFim;
    this.btAnterior.disabled = flagInicio;
  }
  
//------------------------------------------------------------------------//
  
  statusEdicao(operacao) { 
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false; 
    
    if(operacao != Status.EXCLUINDO) {
      this.tfIdentificador.disabled = false;
      this.tfNomeFantasia.disabled = false;
      this.tfRazaoSocial.disabled = false;
      this.tfCnpj.disabled = false;
      this.divAviso.innerHTML = "";      
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";      
    }
    if(operacao == Status.INCLUINDO) {
      this.tfIdentificador.disabled = false;
      this.tfIdentificador.value = "";
      this.tfRazaoSocial.value = "";
      this.tfCnpj.value = "";
      this.tfNomeFantasia.value = "";
    }
  }

//------------------------------------------------------------------------//
  
  statusApresentacao() { 
    this.tfIdentificador.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarPrimeiro();
  
}

//------------------------------------------------------------------------//

function fnBtProximo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  console.log("teste")
  this.viewer.getCtrl().apresentarProximo();
  
}

//------------------------------------------------------------------------//

function fnBtAnterior() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarAnterior();
  
}

//------------------------------------------------------------------------//

function fnBtUltimo() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().apresentarUltimo();
  
}
//------------------------------------------------------------------------//

function fnBtIncluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  console.log("testando")
  this.viewer.getCtrl().iniciarIncluir();
}

//------------------------------------------------------------------------//

function fnBtAlterar() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarAlterar();
  
}

//------------------------------------------------------------------------//

function fnBtExcluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const identificador = this.viewer.tfIdentificador.value;
  const nomeFantasia = this.viewer.tfNomeFantasia.value;
  const razaoSocial = this.viewer.tfRazaoSocial.value;
  const cnpj = this.viewer.tfCnpj.value;
  
    
  // Como defini que o método "efetivar" é um dos métodos incluir, excluir ou alterar
  // não estou precisando colocar os ninhos de IF abaixo.
  this.viewer.getCtrl().efetivar(identificador, cnpj, razaoSocial, nomeFantasia);

  // if(this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
  //  this.viewer.getCtrl().fnEfetivar(matricula, cpf, nome, email, telefone); 
  //} else if(this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
  //  this.viewer.getCtrl().alterar(matricula, cpf, nome, email, telefone); 
  //} else if(this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
  //  this.viewer.getCtrl().excluir(matricula, cpf, nome, email, telefone); 
  //}
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}

//------------------------------------------------------------------------//





