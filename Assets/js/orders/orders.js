import { Database } from "../database";

export class Orders {
  constructor() {
    this.db = new Database();
    this.storeName = this.db.storeNames.orders;
  }

  async addOrder(userId, items) {
    if (!userId || !items || !items.length === 0) {
      throw new Error('Id e items são obrigatórios!')
    }
    const order = {
      userId,
      items,
      date: new Date().toISOString(),
    };
    return await this.db.addItem(this.storeName, order);
  }

}


/**
    * Adiciona um novo pedido ao banco de dados.
    * @param {number} userID ID do usuário que realizou o pedido
    * @param {Array} items Array de objetos contendo { productID, quantity }
    * @returns {Promise<number>} Retorna o ID do pedido adicionado
    */
