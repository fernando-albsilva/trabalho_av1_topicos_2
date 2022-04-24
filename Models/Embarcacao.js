import ModelError from "./ModelError.js";

export default class Embarcacao {
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #identificador;
  #registro;
  #nome;
  #tamanho;

  //-----------------------------------------------------------------------------------------//

  constructor(identificador, registro, nome, tamanho) {
    this.setIdentificador(identificador);
    this.setRegistro(registro);
    this.setNome(nome);
    this.setTamanho(tamanho);
  }
  
  //-----------------------------------------------------------------------------------------//

  getIdentificador() {
    return this.#identificador;
  }
  
  //-----------------------------------------------------------------------------------------//

  setIdentificador(identificador) {
    if(!Embarcacao.validarNumeroInteiro(identificador))
      throw new ModelError(`Identificador : '${identificador}' precisa ser um numero inteiro.`);
    this.#identificador = identificador;
  }
  
  //-----------------------------------------------------------------------------------------//

  getRegistro() {
    return this.#registro;
  }
  
  //-----------------------------------------------------------------------------------------//

  setRegistro(registro) {
    if(!Embarcacao.validarNumeroInteiro(registro))
      throw new ModelError(`Registro : '${registro}' precisa ser um numero inteiro.`);
    this.#registro = registro;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.#nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Embarcacao.validarTexto(nome))
      throw new ModelError(`Nome : '${identificador}' precisa ter somente letras de a-z.`);
    this.#nome = nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTamanho() {
    return this.#tamanho;
  }
  
  //-----------------------------------------------------------------------------------------//

  setTamanho(tamanho) {
    // if(!Aluno.validarEmail(nome))
    //   throw new ModelError("Email inválido: " + nome);
    this.#tamanho = tamanho;
  }
  
  //-----------------------------------------------------------------------------------------//


  toJSON() {
    return '{' +
               '"identificador" : "'+ this.#identificador + '",' +
               '"registro" :  "'     + this.#registro       + '",' +
               '"nome" : "'     + this.#nome      + '",' +
               '"tamanho" : "'    + this.#tamanho     + '",' +
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//
  static assign(obj) {
    return new Embarcacao(obj.identificador, obj.registro, obj.nome, obj.tamanho);
  }

  //-----------------------------------------------------------------------------------------//
  
  deassign(obj) {
    // return JSON.parse(obj.toJSON());
    return  {
      identificador: obj.getIdentificador(),
      registro: obj.getRegistro(),
      nome: obj.getNome(),
      tamanho: obj.getTamanho(),
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