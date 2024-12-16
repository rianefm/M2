document.addEventListener('DOMContentLoaded', function () {
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  const projetosItens = document.querySelector('.projetos-itens');
  const projetoItens = document.querySelectorAll('.projeto-item');
  const projetoCards = document.querySelectorAll('.projeto-card');

  // ======================= Section Projetos =======================

  // Define o índice inicial
  let currentIndex = 0;

  // Função para centralizar o card
  const centralizeCard = (index) => {
    const cardWidth = projetoItens[index].offsetWidth; // Largura do card
    const containerWidth = projetosItens.offsetWidth; // Largura do contêiner visível
    const scrollPosition = projetoItens[index].offsetLeft - (containerWidth / 2) + (cardWidth / 2);
    projetosItens.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  };

  // Evento ao clicar no botão anterior
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--; // Move para o card anterior
      centralizeCard(currentIndex);
    }
  });

  // Evento ao clicar no botão próximo
  nextButton.addEventListener('click', () => {
    if (currentIndex < projetoItens.length - 1) {
      currentIndex++; // Move para o próximo card
      centralizeCard(currentIndex);
    }
  });

  // Adiciona o evento de flip ao clicar no card
  projetoCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // Função para aplicar o embaçamento nos outros cards
  projetoItens.forEach((item) => {
    item.addEventListener('mouseover', () => {
      projetoItens.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.style.filter = 'blur(3px) brightness(0.7)'; // Embaça os outros cards
        }
      });
    });

    item.addEventListener('mouseout', () => {
      projetoItens.forEach((otherItem) => {
        otherItem.style.filter = 'none'; // Remove o embaçamento
      });
    });
  });

  // Ajusta automaticamente o índice inicial com base na posição atual
  const initializeIndex = () => {
    const scrollLeft = projetosItens.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Infinity;
    projetoItens.forEach((item, index) => {
      const itemLeft = item.offsetLeft - scrollLeft;
      if (Math.abs(itemLeft) < closestDistance) {
        closestDistance = Math.abs(itemLeft);
        closestIndex = index;
      }
    });
    currentIndex = closestIndex;
  };

  // Atualiza o índice ao terminar o scroll manual
  projetosItens.addEventListener('scroll', initializeIndex);

});
