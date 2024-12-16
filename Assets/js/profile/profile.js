import { Database } from "../database.js";
import { orders } from "../orders/orders.js";

export class Profile {
  constructor() {
    this.db = new Database();
    this.storeName = this.db.storeNames.users;
  }

  async getUserById(userId) {
    if (!userId) throw new Error("ID do usuário é obrigatório.");
    return await this.db.getItemByKey(this.storeName, parseInt(userId));
  }

  async updateUser(userId, updates) {
    if (!userId || !updates) throw new Error("ID do usuário e atualizações são obrigatórios.");
    const user = await this.getUserById(userId);
    if (!user) throw new Error("Usuário não encontrado.");

    const updatedUser = { ...user, ...updates };
    return await this.db.updateItem(this.storeName, updatedUser);
  }
}

export const profile = new Profile();

document.addEventListener("DOMContentLoaded", async () => {
  const userId = parseInt(sessionStorage.getItem("userId"));

  // Páginas públicas que não precisam de verificação de login
  const publicPages = ["","/", "index.html", "login.html", "register.html"];
  const currentPage = window.location.pathname.split("/").pop(); // Obtém o nome da página atual

  // Ignorar execução do script se estiver em uma página pública
  if (publicPages.includes(currentPage)) {
    return;
  }

  // Redirecionar se o usuário não estiver logado
  if (!userId) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  // Lógica específica para a página de perfil
  if (currentPage === "profile.html") {
    try {
      const displayName = document.getElementById("userName");
      const emailField = document.getElementById("email");
      const nameField = document.getElementById("name");
      const passwordField = document.getElementById("password");
      const ordersList = document.getElementById("orders-list");

      if (!displayName || !emailField || !nameField || !ordersList) {
        console.error("Elementos do DOM não encontrados na página de perfil.");
        return;
      }

      // Carrega informações do usuário
      const user = await profile.getUserById(userId);
      if (user) {
        displayName.textContent = user.name || "Usuário";
        emailField.value = user.email;
        nameField.value = user.name || "";
      }

      // Carrega e exibe os pedidos do usuário
      const userOrders = await orders.getOrdersByUserId(userId);
      if (userOrders.length > 0) {
        ordersList.innerHTML = ""; // Limpa a lista de pedidos
        userOrders.forEach(order => {
          const orderElement = document.createElement("div");
          orderElement.className = "order";

          const itemsHtml = order.items
            .map(item => {
              const price = item.price !== undefined ? `R$${item.price.toFixed(2)}` : "Preço não disponível";
              return `<li>${item.name || "Produto desconhecido"} - Quantidade: ${item.quantity}, Preço: ${price}</li>`;
            })
            .join("");

          orderElement.innerHTML = `
            <h3>Pedido #${order.id}</h3>
            <p>Data: ${new Date(order.date).toLocaleString()}</p>
            <ul>${itemsHtml}</ul>
          `;
          ordersList.appendChild(orderElement);
        });
      } else {
        ordersList.innerHTML = "<p>Você ainda não fez nenhum pedido.</p>";
      }

      // Atualização do perfil
      const updateButton = document.getElementById("update-profile");
      if (updateButton) {
        updateButton.addEventListener("click", async () => {
          const name = nameField.value.trim();
          const password = passwordField.value.trim();

          if (!name) {
            alert("O nome não pode estar vazio.");
            return;
          }

          try {
            const updates = { name };
            if (password) {
              updates.passwordHash = btoa(password); // Atualiza o hash da senha
            }

            await profile.updateUser(userId, updates);
            alert("Perfil atualizado com sucesso!");
          } catch (error) {
            console.error("Erro ao atualizar perfil:", error.message);
            alert("Não foi possível atualizar o perfil. Tente novamente.");
          }
        });
      }

      // Logout
      const logoutButton = document.getElementById("logout");
      if (logoutButton) {
        logoutButton.addEventListener("click", () => {
          sessionStorage.removeItem("userId");
          alert("Você foi desconectado.");
          window.location.href = "login.html";
        });
      }
    } catch (error) {
      console.error("Erro ao carregar informações do perfil:", error.message);
    }
  }
});
