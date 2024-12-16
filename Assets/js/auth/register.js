import { Database } from "../database.js";

export class Register {
    constructor() {
        this.db = new Database();
        this.storeName = this.db.storeNames.users;
    }

    validateInput(email, password, name) {
        if (!email || !password || !name) {
            throw new Error("Email, senha e nome são obrigatórios.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Formato de email inválido.");
        }
        if (password.length < 6) {
            throw new Error("A senha deve ter pelo menos 6 caracteres.");
        }
        return true;
    }

    hashPassword(password) {
        return btoa(password); // Simulação de hash
    }

    async registerUser(email, password, name) {
        this.validateInput(email, password, name); // Validação de email e senha

        const existingUsers = await this.db.getAllItems(this.storeName);
        const emailExists = existingUsers.some(user => user.email === email);
        if (emailExists) {
            throw new Error("Este email já está registrado.");
        }

        const passwordHash = this.hashPassword(password);

        const user = {
            email,
            passwordHash,
            name
        };

        const userId = await this.db.addItem(this.storeName, user);
        console.log("Usuário registrado com sucesso! ID:", userId);
        return userId;
    }
}

export const register = new Register();
