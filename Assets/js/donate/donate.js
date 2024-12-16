document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector("#doacoes form");
  const inputNome = form.querySelector("input[type='text']");
  const inputEmail = form.querySelector("input[type='email']");
  const inputValor = form.querySelector("input[type='number']");
  const btnDoar = form.querySelector(".btn-doar");

  // Elementos do ranking
  const totalRecebidos = document.querySelector(".ranking-dados .dado:nth-child(1) h3");
  const totalBeneficiados = document.querySelector(".ranking-dados .dado:nth-child(2) h3");
  const totalDoadores = document.querySelector(".ranking-dados .dado:nth-child(3) h3");

  // Valores iniciais (mock)
  let valorRecebidos = 5368; // em KG
  let beneficiados = 1000;
  let doadores = 500;

  // Efeito ao enviar o formulário
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const valor = parseFloat(inputValor.value);

    if (!nome || !email || isNaN(valor) || valor <= 0) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Atualiza os valores no ranking
    valorRecebidos += valor; // Simula a doação
    beneficiados += Math.floor(valor / 5); // 1 beneficiado a cada 5 reais
    doadores += 1;

    // Atualiza a interface com animação
    updateRanking();

    // Reseta o formulário com animação
    form.reset();
    btnDoar.innerHTML = '<i class="ph ph-check-circle"></i> Doação Enviada!';
    btnDoar.style.backgroundColor = "#4CAF50";
    setTimeout(() => {
      btnDoar.innerHTML = '<i class="ph ph-check-circle"></i> Fazer Doação';
      btnDoar.style.backgroundColor = "var(--color-link-primary)";
    }, 2000);

    alert(`Obrigado, ${nome}, por sua doação de R$${valor.toFixed(2)}!`);
  });

  // Atualiza os valores do ranking com efeito
  const updateRanking = () => {
    animateNumber(totalRecebidos, valorRecebidos,"KG");
    animateNumber(totalBeneficiados, beneficiados);
    animateNumber(totalDoadores, doadores);
  };

  // Função para animar números (incremento gradual)
  const animateNumber = (element, targetValue, unit = "") => {
    const currentValue = parseFloat(element.textContent.replace(/[^\d.]/g, "")) || 0;
    const increment = (targetValue - currentValue) / 50; 
    let value = currentValue;

    const interval = setInterval(() => {
      value += increment;
      if ((increment > 0 && value >= targetValue) || (increment < 0 && value <= targetValue)) {
        value = targetValue;
        clearInterval(interval);
      }
      element.textContent = `${value.toFixed(0)}${unit}`;
    }, 20); // Atualização a cada 20ms
  };

  // Efeitos de foco nos campos do formulário
  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.style.boxShadow = "0 0 10px var(--color-link-primary)";
    });

    input.addEventListener("blur", () => {
      input.parentElement.style.boxShadow = "none";
    });
  });
});
