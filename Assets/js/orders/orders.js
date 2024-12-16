import { Database } from "../database.js";

export class Orders {
    constructor() {
        this.db = new Database();
        this.storeName = this.db.storeNames.orders;
    }

    async addOrder(userId, items) {
        if (!userId || !items || items.length === 0) {
            throw new Error("User ID e itens do pedido são obrigatórios.");
        }

        const detailedItems = await Promise.all(
            items.map(async (item) => {
                const product = await this.db.getItemByKey(this.db.storeNames.products, item.productId);
                if (!product) {
                    throw new Error(`Produto com ID ${item.productId} não encontrado.`);
                }
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    name: product.name,
                    price: product.price || 0, // Adicione um valor padrão para price
                };
            })
        );

        const order = {
            userId: parseInt(userId),
            items: detailedItems,
            date: new Date().toISOString(),
        };

        return await this.db.addItem(this.storeName, order);
    }

    async getOrdersByUserId(userId) {
        if (!userId) {
            throw new Error("User ID é obrigatório.");
        }

        const allOrders = await this.db.getAllItems(this.storeName);
        // Converte userId para número antes de comparar
        return allOrders.filter(order => parseInt(order.userId) === parseInt(userId));
    }
}

export const orders = new Orders();
