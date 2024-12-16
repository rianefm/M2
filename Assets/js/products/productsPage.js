// import { Database } from "../database.js";
import { products } from "./products.js";
import { orders } from "../orders/orders.js";

// export class ProductsPage {
//   constructor() {
//     this.db = new Database();
//     this.storeName = this.db.storeNames.users;
//   }

//   async getUserById(userId) {
//     if (!userId) throw new Error("ID do usuário é obrigatório.");
//     return await this.db.getItemByKey(this.storeName, parseInt(userId));
//   }

//   async updateUser(userId, updates) {
//     if (!userId || !updates) throw new Error("ID do usuário e atualizações são obrigatórios.");
//     const user = await this.getUserById(userId);
//     if (!user) throw new Error("Usuário não encontrado.");

//     const updatedUser = { ...user, ...updates };
//     return await this.db.updateItem(this.storeName, updatedUser);
//   }
// }

document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.getElementById("products-container");

  const userId = parseInt(sessionStorage.getItem("userId"));

  // logout button
  const logoutButton = document.getElementById("logout");
  const pages = ["", "/", "index.html", "pages/login.html", "pages/register.html"];
  const currentPage = window.location.pathname.split("/").pop();

  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("userId");
    window.location.href = "/pages/login.html";
  });

  // Redirecionar se o usuário não estiver logado para o login
  if (!userId && !pages.includes(currentPage)) {
    return;
  }

  // Função para renderizar os produtos na página
  const renderProducts = async () => {
    productsContainer.innerHTML = ""; // Limpa o container
    try {
      const allProducts = await products.getAllProducts();

      if (allProducts.length === 0) {
        productsContainer.innerHTML = "<p>Nenhum produto disponível.</p>";
        return;
      }

      allProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
          <h2>${product.name}</h2>
          <p><strong>Preço:</strong> R$ ${product.price.toFixed(2)}</p>
          <p><strong>Descrição:</strong> ${product.description || "Sem descrição"}</p>
          <button class="buy-button" data-id="${product.id}">Comprar</button>
        `;

        productsContainer.appendChild(productCard);
      });

      // Adiciona evento de clique em cada botão "Comprar"
      document.querySelectorAll(".buy-button").forEach(button => {
        button.addEventListener("click", async (event) => {
          const productId = parseInt(event.target.dataset.id);
          const userId = sessionStorage.getItem("userId");

          if (!userId) {
            alert("Você precisa estar logado para fazer uma compra.");
            window.location.href = "login.html";
            return;
          }

          try {
            const product = await products.getProductById(productId);
            const orderItem = { productId, quantity: 1 };

            await orders.addOrder(userId, [orderItem]);
            alert(`Produto "${product.name}" comprado com sucesso!`);
          } catch (error) {
            console.error("Erro ao comprar produto:", error.message);
            alert("Erro ao realizar a compra. Tente novamente.");
          }
        });
      });
    } catch (error) {
      console.error("Erro ao carregar produtos:", error.message);
      productsContainer.innerHTML = "<p>Erro ao carregar produtos.</p>";
    }
  };

  // Renderizar os produtos ao carregar a página
  renderProducts();
});
