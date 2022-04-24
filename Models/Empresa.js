import ModelError from "./ModelError.js";

export default class Empresa {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #identificador;
  #cnpj;
  #razaoSocial;
  #nomeFantasia;

  //-----------------------------------------------------------------------------------------//

  constructor(identificador, cnpj, razaoSocial, nomeFantasia) {
    this.setIdentificador(identificador);
    this.setCnpj(cnpj);
    this.setRazaoSocial(razaoSocial);
    this.setNomeFatasia(nomeFantasia);
  }
  
  //-----------------------------------------------------------------------------------------//

  getIdentificador() {
    return this.#identificador;
  }
  
  //-----------------------------------------------------------------------------------------//

  setIdentificador(identificador) {
    if(!Empresa.validarNumeroInteiro(identificador))
      throw new ModelError(`identificador : '${identificador}' precisa ser um numero inteiro.`);
    this.#identificador = identificador;
  }
  
  //-----------------------------------------------------------------------------------------//

  getCnpj() {
    return this.#cnpj;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCnpj(cnpj) {
    if(!Empresa.validarNumeroInteiro(cnpj))
      throw new ModelError(`cnpj : '${cnpj}' precisa ser um numero inteiro.`);
    this.#cnpj = cnpj;
  }
  
  //-----------------------------------------------------------------------------------------//

  getRazaoSocial() {
    return this.#razaoSocial;
  }
  
  //-----------------------------------------------------------------------------------------//

  setRazaoSocial(razaoSocial) {
    if(!Empresa.validarTexto(razaoSocial))
      throw new ModelError(`Razao Social : '${razaoSocial}' precisa ter somente letras de a-z.`);
    this.#razaoSocial = razaoSocial;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNomeFantasia() {
    return this.#nomeFantasia;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNomeFatasia(nomeFantasia) {
    if(!Empresa.validarTexto(nomeFantasia))
      throw new ModelError(`Nome Fantasia : '${nomeFantasia}' precisa ter somente letras de a-z.`);
    this.#nomeFantasia = nomeFantasia;
  }
  
  //-----------------------------------------------------------------------------------------//


  toJSON() {
    return '{' +
               '"identificador" : "'+ this.#identificador + '",' +
               '"cnpj" :  "'     + this.#cnpj       + '",' +
               '"razaoSocial" : "'     + this.#razaoSocial      + '",' +
               '"nomeFantasia" : "'    + this.#nomeFantasia     + '",' +
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//
  static assign(obj) {
    return new Empresa(obj.identificador, obj.cnpj, obj.razaoSocial, obj.nomeFantasia);
  }

  //-----------------------------------------------------------------------------------------//
  
  deassign(obj) {
    // return JSON.parse(obj.toJSON());
    return  {
      identificador: obj.getIdentificador(),
      razaoSocial: obj.getRazaoSocial(),
      nomeFantasia: obj.getNomeFantasia(),
      cnpj: obj.getCnpj(),
    }
  }

  //-----------------------------------------------------------------------------------------//

  static validarNumeroInteiro(valor) {
    if(valor == null || valor == "" || valor == undefined)
      return false;
    const padrao = /^[0-9]+$/;
    return valor.match(padrao);
  }

  //-----------------------------------------------------------------------------------------//

  static validarTexto(text) {
    if(text == null || text == "" || text == undefined)
      return false;
    if (text.length > 40)
      return false;

    const pattern = /^[A-Za-z\s]+$/;
    return text.match(pattern);

  }

  //-----------------------------------------------------------------------------------------//

   
  mostrar() {
    let texto = "Identificador: " + this.getIdentificador() + "\n";
    texto += "Nome Fantasia: " + this.getNomeFantasia() + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}