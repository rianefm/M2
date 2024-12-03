import { Database } from "../database";

export class Products {
  constructor() {
    this.db = new Database();
    this.storeName = this.db.storeNames.products;
  }

  async addProduct(name, price, description = "") {
    if (!name || price === undefined || price < 0) {
      throw new Error('Nome e preço são obrigatórios, e o preço deve ser maior ou igual a 0');
    }
    const product = {
      name,
      price,
      description
    } 
  return await this.db.addItem(this.storeName, product)
  }

  async getAllProducts(){
    return await this.db.getAllItems(this.storeName)
  }

  async getProductById(id){
   if(!id){
    throw new Error('Id é obrigatório para buscar um produto.');
   }
   return await this.db.getItemByKey(this.storeName, id)
  }

}


/**
 * Atualiza um produto existente.
 * @param {number} id - ID do produto a ser atualizado.
 * @param {object} updates Dados a serem atualizados ({ name, price, description }).
 * @returns {Promise} Promise com o resultado da operação - ID do produto atualizado
 *
 * async - updateProduct passando id e updates como parametros com validação de if.
 *
 * criando variavel para pegar o produto com id
 * verificação com if se o produto existe
 *
 * criando a variavel para atualizar os campos fornecidos e um return dos dados atualizados - updateItem => method
  */
