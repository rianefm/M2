import { Database } from "../database.js";

export class Login {
    constructor() {
        this.db = new Database();
        this.storeName = this.db.storeNames.users;
    }

    hashPassword(password) {
        return btoa(password); // Simulação de hash (usando Base64)
    }

    async validateLogin(email, password) {
        const users = await this.db.getAllItems(this.storeName);
        const user = users.find(user => user.email === email);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const passwordHash = this.hashPassword(password); // Usa o mesmo método de hash
        if (user.passwordHash !== passwordHash) {
            throw new Error("Senha incorreta.");
        }

        return user; // Retorna o objeto do usuário logado
    }
}

export const login = new Login();
