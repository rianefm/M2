import { Database } from "../database";

const db = new Database();
const userID = sessionStorage.getItem('userID');

// Carregar informações do usuário
async function loadUserProfile() {
  const user = await db.getItemByKey("users", parseInt(userID));
  if (user) {
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email || "";
  }
}
// Listar pedidos do usuário
async function loadUserOrders() {
  const orders = await db.getAllItems("orders");
  const userOrders = orders.filter(order => order.userID === parseInt(userID));

  const ordersList = document.getElementById('orders-list');
  userOrders.forEach(async order => {
    const product = await db.getItemByKey("products", order.productID);
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');
    orderDiv.innerHTML = `
      <h3>${product.name}</h3>
      <p><strong>Preço:</strong> R$ ${product.price}</p>
      <p>Quantidade: ${order.quantity}</p>
      <p><strong>Data:</strong> ${new Date(order.date).toLocaleDateString()}</p>
    `;
    ordersList.appendChild(orderDiv);
  });
}
