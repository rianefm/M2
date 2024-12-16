import { register } from "./auth/register.js";
import { login } from "./auth/login.js";
import { products } from "./products/products.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("App iniciado!");
    await initializeApp();
});

async function initializeApp() {

    await initializeMockProducts();
    setupEventListeners();
}

async function initializeMockProducts() {
    try {
        const existingProducts = await products.getAllProducts();
        if (existingProducts.length === 0) {
            await products.addProduct("Arroz 10Kg", 40, "Assado Atacadista");
            await products.addProduct("Cesta básica", 65, "Mercadinho do Jonh");
            await products.addProduct("Filezinho Frango Empanado", 20, "Restaurante do Zé");
            console.log("Produtos mockados adicionados.");
        } else {
            console.log("Produtos já existentes no banco de dados, mockados não adicionados.");
        }
    } catch (error) {
        console.error("Erro ao adicionar produtos mockados:", error.message);
    }
}

function setupEventListeners() {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegisterFormSubmit);
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginFormSubmit);
    }
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const name = document.getElementById("register-name").value;

    try {
        const userId = await register.registerUser(email, password, name);
        alert(`Usuário registrado com sucesso! ID: ${userId}`);
        sessionStorage.setItem("userId", userId);
        window.location.href = "profile.html";
    } catch (error) {
        alert(`Erro ao registrar usuário: ${error.message}`);
    }
}

async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const user = await login.validateLogin(email, password);
        alert(`Login bem-sucedido! Bem-vindo, ${user.name || "Usuário"}`);
        sessionStorage.setItem("userId", user.id);
        window.location.href = "profile.html";
    } catch (error) {
        alert(`Erro no login: ${error.message}`);
    }
}
