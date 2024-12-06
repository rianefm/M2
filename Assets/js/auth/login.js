import { Database } from "../database";

export class Login {
    constructor() {
        this.db = new Database();
        this.storeName = this.db.storeNames.users;
    }

    async validateLogin(email, password){
        const users = await this.db.getAllItems(this.storeName)
        const user = users.find(user=>user.email===email)

        if(!user){
            throw new Error("Usuário não encontrado.")
        }

        const passwordHash = btoa(password)

        if(!user.passwordHash!==passwordHash){
            throw new Error("Senha incorreta.")
        }
        return user
    }
}

export const login = new Login()


// const loginForm = document.querySelector('.login-form');
// const emailInput = document.getElementById('email');
// const passwordInput = document.getElementById('password');
// const loginButton = document.getElementById('login-button');

// // Função para validar email
// function validateEmail(email) {
//     const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     return regex.test(email);
// }

// // Função para validar senha
// function validatePassword(password) {
//     return password.length >= 6; 
// }

// // Evento submeter o formulário
// loginForm.addEventListener('submit', (event) => {
//     event.preventDefault(); 

//     const email = emailInput.value;
//     const password = passwordInput.value;

//     // Validação de email
//     if (!validateEmail(email)) {
//         alert('Por favor, insira um email válido.');
//         return;
//     }

//     // Validação de senha
//     if (!validatePassword(password)) {
//         alert('A senha deve ter no mínimo 6 caracteres.');
//         return;
//     }

//     // Se tudo estiver correto, prosseguir com o login
//     console.log('Email:', email);
//     console.log('Senha:', password);

//     alert('Login realizado com sucesso!');
// });