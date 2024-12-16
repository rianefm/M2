document.addEventListener('DOMContentLoaded', function () {
  // section > time
  const paginationButtons = document.querySelector(".pagination");
  // const timeCardsContainer = document.querySelector(".time-cards");
  const timeCards = document.querySelectorAll(".time-card");
  // const timeContainer = document.querySelector("#time-cards");

  let cardsPerPage = window.innerWidth <= 768 ? 2 : 4;

 function createPagination() {
        paginationButtons.innerHTML = ""; // Limpa os botões de paginação existentes
        const totalPages = Math.ceil(timeCards.length / cardsPerPage); // Calcula o número total de páginas

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.classList.add("pagination-btn");
            btn.textContent = i;
            btn.setAttribute("data-page", i);

            if (i === 1) btn.classList.add("active"); // Define a primeira página como ativa por padrão

            btn.addEventListener("click", () => {
                // Atualiza a página ativa
                document.querySelectorAll(".pagination-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                showPage(i);
            });

            paginationButtons.appendChild(btn);
        }

        // Mostra a primeira página por padrão
        showPage(1);
    }

    function showPage(pageNumber) {
        const start = (pageNumber - 1) * cardsPerPage;
        const end = start + cardsPerPage;

        timeCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = "block"; // Mostra os cards dessa página
            } else {
                card.style.display = "none"; // Oculta os cards das outras páginas
            }
        });
    }

    function updateCardsPerPage() {
        cardsPerPage = window.innerWidth <= 768 ? 2 : 4; // Ajusta o número de cards por página dinamicamente
        createPagination();
    }

    // Cria a paginação inicial
    createPagination();

    // Atualiza a paginação ao redimensionar a janela
  window.addEventListener("resize", updateCardsPerPage);
});
