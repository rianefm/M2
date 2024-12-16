import { Database } from "../database.js";

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
        };
        return await this.db.addItem(this.storeName, product);
    }

    async getAllProducts() {
        return await this.db.getAllItems(this.storeName);
    }

    async getProductById(id) {
        if (!id) {
            throw new Error('Id é obrigatório para buscar um produto.');
        }
        return await this.db.getItemByKey(this.storeName, id);
    }

    async updateProduct(id, updates) {
        if (!id || !updates) {
            throw new Error('Id e os dados para atualização são obrigatórios');
        }
        const product = await this.getProductById(id);
        if (!product) {
            throw new Error(`Produto com ID ${id} não encontrado`);
        }

        const updatedProduct = { ...product, ...updates };
        return await this.db.updateItem(this.storeName, updatedProduct);
    }

    async deleteProduct(id) {
        if (!id) {
            throw new Error('Id é obrigatório para excluir um produto.');
        }
        const product = await this.getProductById(id);
        if (!product) {
            throw new Error(`Produto com ID ${id} não encontrado`);
        }
        return await this.db.deleteItem(this.storeName, id);
    }
}

// Exporta uma instância da classe Products
export const products = new Products();
