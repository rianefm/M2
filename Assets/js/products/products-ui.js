import { Products } from "./products.js";

const products = new Products();
const cart = [];


const productsContainer = document.querySelector("#products .container");
const searchBar = document.querySelector("#filters .search-bar input");
const addProductForm = document.querySelector("#add-product-form");
const openModalBtn = document.getElementById("open-modal-btn");
const addProductModal = document.getElementById("add-product-modal");
const closeModalBtn = document.querySelector(".close-btn");
const openCartBtn = document.getElementById("open-cart");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const finalizeOrderBtn = document.getElementById("finalize-order");
const cartCount = document.getElementById("cart-count");


function updateCartCount() {
    cartCount.textContent = cart.length;
}


function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>O carrinho está vazio.</p>";
        return;
    }

    cart.forEach((product, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <p>${product.name} - R$${product.price.toFixed(2)}</p>
            <button class="remove-cart-btn" data-index="${index}">Remover</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    attachRemoveCartEvents();
}

function attachRemoveCartEvents() {
    const removeButtons = document.querySelectorAll(".remove-cart-btn");
    removeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            renderCart();
            updateCartCount();
        });
    });
}


function addToCart(product) {
    cart.push(product);
    updateCartCount();
    renderCart(); 
}


async function renderProducts() {
    try {
        const allProducts = await products.getAllProducts();
        productsContainer.innerHTML = "";

        if (allProducts.length === 0) {
            productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
            return;
        }

        allProducts.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <div class="product-image">Imagem</div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>R$${product.price.toFixed(2)}</p>
                    <p>${product.description || "Sem descrição"}</p>
                    <button class="add-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                    <button class="delete-btn" data-id="${product.id}">Excluir</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });

        attachAddToCartEvents();
        attachDeleteEvents();
    } catch (error) {
        console.error("Erro ao renderizar produtos:", error);
    }
}


function attachAddToCartEvents() {
    const addButtons = document.querySelectorAll(".add-cart-btn");
    addButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const id = parseInt(e.target.dataset.id);
            const product = await products.getProductById(id);
            if (product) {
                addToCart(product);
            } else {
                console.error("Produto não encontrado!");
            }
        });
    });
}


function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", async (e) => {
            const id = parseInt(e.target.dataset.id);
            await products.deleteProduct(id);
            renderProducts();
        });
    });
}

searchBar.addEventListener("input", async () => {
    const query = searchBar.value.toLowerCase();
    const allProducts = await products.getAllProducts();

    const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
    );

    productsContainer.innerHTML = "";

    if (filtered.length === 0) {
        productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
    } else {
        filtered.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <div class="product-image">Imagem</div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>R$${product.price.toFixed(2)}</p>
                    <p>${product.description || "Sem descrição"}</p>
                    <button class="add-cart-btn" data-id="${product.id}">Adicionar ao Carrinho</button>
                    <button class="delete-btn" data-id="${product.id}">Excluir</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
        attachAddToCartEvents();
        attachDeleteEvents();
    }
});


addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const price = parseFloat(e.target.price.value);
    const description = e.target.description.value.trim();

    if (!name || isNaN(price) || price <= 0) {
        alert("Preencha os campos corretamente!");
        return;
    }

    await products.addProduct(name, price, description);
    addProductModal.style.display = "none";
    renderProducts();
    addProductForm.reset();
});


openCartBtn.addEventListener("click", () => {
    cartModal.style.display = "block";
    renderCart();
});

closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});

openModalBtn.addEventListener("click", () => {
    addProductModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
    addProductModal.style.display = "none";
});

finalizeOrderBtn.addEventListener("click", () => {
    alert("Pedido finalizado!");
    cart.length = 0;
    renderCart();
    updateCartCount();
});

renderProducts();
