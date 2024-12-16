// Array para armazenar os produtos no carrinho
const cart = [];

// Seleciona os elementos
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const cartCount = document.getElementById("cart-count");

// Função para atualizar o modal do carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = ""; // Limpa o conteúdo anterior
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.innerHTML = `
        <p>${item.name} - R$ ${item.price.toFixed(2)}</p>
        <button class="btn remove-btn" data-index="${index}">Remover</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    // Adiciona evento de remover produto
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const indexToRemove = e.target.dataset.index;
        cart.splice(indexToRemove, 1); // Remove do array
        updateCartModal(); // Atualiza o modal
        updateCartCount(); // Atualiza o contador
      });
    });
  }
}

// Função para atualizar o contador do carrinho
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Adiciona evento para os botões "Adicionar ao Carrinho"
addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.name;
    const productPrice = parseFloat(button.dataset.price);

    // Adiciona o produto ao carrinho
    cart.push({ name: productName, price: productPrice });
    alert(`${productName} foi adicionado ao carrinho!`);
    updateCartCount(); // Atualiza o contador
  });
});

// Eventos para abrir e fechar o modal
openCartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "block";
});

closeCartBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Fecha o modal ao clicar fora dele
window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});
