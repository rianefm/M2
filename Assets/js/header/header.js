
import { profile } from "../profile/profile.js";

document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  const hamburgerIcon = hamburger.querySelector('.menu-icon, i');
  const menuItems = document.querySelectorAll('.menu li a');
  const headerContainer = document.querySelector(".header");

  // ======================= Section Header =======================

  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      headerContainer.style.padding = "5px"; // Padding reduzido ao rolar
      headerContainer.style.transition = "padding 0.3s ease"; // Transição suave
    } else {
      headerContainer.style.padding = "20px 15px"; // Padding padrão no topo
    }
  });

  // Função para alternar o menu
  function toggleMenu() {
    menu.classList.toggle('active');
    if (menu.classList.contains('active')) {
      hamburgerIcon.classList.remove('ph-list');
      hamburgerIcon.classList.add('ph-x');
    } else {
      hamburgerIcon.classList.remove('ph-x');
      hamburgerIcon.classList.add('ph-list');
    }
  }

  // Evento de clique no botão hambúrguer
  hamburger.addEventListener('click', toggleMenu);

  // Fecha o menu ao clicar em qualquer item
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (menu.classList.contains('active')) {
        menu.classList.remove('active'); // Remove a classe 'active' do menu
        hamburgerIcon.classList.remove('ph-x');
        hamburgerIcon.classList.add('ph-list'); // Redefine o ícone para 'ph-list'
      }
    });
  });

  const userId = sessionStorage.getItem("userId");
  const loginLink = document.querySelector('.login-link');

  if (userId) {
    (async () => {
      await updateUserHeader(userId, loginLink);
    })();
  }

  async function updateUserHeader(userId, loginLink) {
    try {
        const user = await profile.getUserById(parseInt(userId));
        if (user) {
            loginLink.innerHTML = `
                <a href="./pages/profile.html">
                    <i class="ph ph-user-circle" style="padding-right: 3px"></i> Olá, ${user.name || "Usuário"}
                </a>
            `;
            addLogoutButton(loginLink);
        }
    } catch (error) {
        console.error("Erro ao carregar dados do usuário logado:", error.message);
    }
  }

  function addLogoutButton(loginLink) {
      const logoutButton = document.createElement('a');
      logoutButton.href = "#";
      logoutButton.classList.add('logout-link');
      logoutButton.innerHTML = `<i class="ph ph-sign-out"></i> Sair`;
      loginLink.parentNode.appendChild(logoutButton);

      logoutButton.addEventListener('click', () => {
          sessionStorage.removeItem("userId");
          alert("Você foi desconectado.");
          window.location.href = "index.html";
      });
  }

});
