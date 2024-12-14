import { Products } from "./products.js";

const products = new Products();

// Referências aos elementos da interface
const productsContainer = document.querySelector("#products .container");
const searchBar = document.querySelector("#filters .search-bar input");
const addProductForm = document.querySelector("#add-product-form");
const openModalBtn = document.getElementById("open-modal-btn");
const addProductModal = document.getElementById("add-product-modal");
const closeModalBtn = document.querySelector(".close-btn");

// Função para renderizar os produtos na UI
async function renderProducts() {
    try {
        const allProducts = await products.getAllProducts();
        productsContainer.innerHTML = ""; // Limpa os produtos existentes

        if (allProducts.length === 0) {
            productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        allProducts.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <div class="product-image">Imagem do Produto</div>
                <div class="product-info">
                  <h3>${product.name}</h3>
                  <p>R$${product.price.toFixed(2)}</p>
                  <p>${product.description || "Sem descrição"}</p>
                  <button class="delete-btn" data-id="${product.id}">Excluir</button>
                </div>
            `;

            productsContainer.appendChild(productCard);
        });

        attachDeleteEvents(); // Conecta os botões de excluir
    } catch (error) {
        console.error("Erro ao renderizar produtos:", error);
    }
}

// Função para adicionar um produto
async function addProduct(event) {
    event.preventDefault();

    const formData = new FormData(addProductForm);
    const name = formData.get("name");
    const price = parseFloat(formData.get("price"));
    const description = formData.get("description");

    try {
        await products.addProduct(name, price, description);
        addProductForm.reset(); // Limpa o formulário
        addProductModal.style.display = "none"; // Fecha o modal
        renderProducts(); // Atualiza a UI
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
    }
}

// Função para excluir um produto
async function deleteProduct(id) {
    try {
        await products.deleteProduct(id);
        renderProducts(); // Atualiza a UI
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
    }
}

// Conecta eventos aos botões de excluir
function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const id = parseInt(event.target.dataset.id);
            deleteProduct(id);
        });
    });
}

// Função de busca
async function searchProducts(event) {
    const query = event.target.value.toLowerCase();

    try {
        const allProducts = await products.getAllProducts();
        const filteredProducts = allProducts.filter((product) =>
            product.name.toLowerCase().includes(query)
        );

        productsContainer.innerHTML = ""; // Limpa os produtos existentes

        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        filteredProducts.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <div class="product-image">Imagem do Produto</div>
                <div class="product-info">
                  <h3>${product.name}</h3>
                  <p>R$${product.price.toFixed(2)}</p>
                  <p>${product.description || "Sem descrição"}</p>
                  <button class="delete-btn" data-id="${product.id}">Excluir</button>
                </div>
            `;

            productsContainer.appendChild(productCard);
        });

        attachDeleteEvents(); // Conecta os botões de excluir
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

// Eventos para o modal
// openModalBtn.addEventListener("click", () => {
//     addProductModal.style.display = "block";
// });

openModalBtn.addEventListener("click", () => {
    console.log("Abrindo o modal...");
    addProductModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
    addProductModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === addProductModal) {
        addProductModal.style.display = "none";
    }
});

// Eventos
searchBar.addEventListener("input", searchProducts);
addProductForm.addEventListener("submit", addProduct);

// Inicialização
renderProducts();
