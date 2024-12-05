 // Função para validar CPF
 function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;

    let soma = 0, resto;

    // Verifica o primeiro dígito
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Verifica o segundo dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

// Função para validar CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) return false;

    const multiplicadores1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const multiplicadores2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3];
    let soma = 0, resto;

    // Primeiro dígito
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * multiplicadores1[i];
    }
    resto = soma % 11;
    resto = resto < 2 ? 0 : 11 - resto;
    if (resto !== parseInt(cnpj.charAt(12))) return false;

    // Segundo dígito
    soma = 0;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * multiplicadores2[i];
    }
    resto = soma % 11;
    resto = resto < 2 ? 0 : 11 - resto;
    return resto === parseInt(cnpj.charAt(13));
}

// Função que valida o CPF ou CNPJ
function validarCPFouCNPJ(cpfCnpj) {
    cpfCnpj = cpfCnpj.replace(/\D/g, '');
    return cpfCnpj.length === 11 ? validarCPF(cpfCnpj) : 
           cpfCnpj.length === 14 ? validarCNPJ(cpfCnpj) : 
           false;
}

// Validação no formulário
document.getElementById('registrationForm').addEventListener('submit', function (event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const cpfCnpjInput = document.getElementById('cpf_cnpj');

    // Validação de senhas
    if (password !== confirmPassword) {
        event.preventDefault(); // Impede o envio do formulário
        alert('As senhas não coincidem. Por favor, verifique.');
        return;
    }

    // Complementa automaticamente CPF ou CNPJ
    const cpfCnpj = cpfCnpjInput.value.replace(/\D/g, '');
    if (cpfCnpj.length === 11) {
        cpfCnpjInput.value = cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpfCnpj.length === 14) {
        cpfCnpjInput.value = cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
        event.preventDefault(); // Impede envio
        alert('Por favor, insira um CPF ou CNPJ válido.');
        return;
    }

    // Validação de CPF ou CNPJ
    if (!validarCPFouCNPJ(cpfCnpjInput.value)) {
        event.preventDefault(); // Impede envio
        alert('Por favor, insira um CPF ou CNPJ válido.');
    }
});

const dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('testDB', 1); 

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('usuarios')) {
            db.createObjectStore('usuarios', { keyPath: 'cpf_cnpj' }); 
        }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
});

async function addUserToDB(data) {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('usuarios', 'readwrite'); 
        const store = transaction.objectStore('usuarios');

        const request = store.add(data);
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
}


document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const cpfCnpjInput = document.getElementById('cpf_cnpj');

    if (password !== confirmPassword) {
        alert('As senhas não coincidem. Por favor, verifique.');
        return;
    }

    // Complementa automaticamente CPF ou CNPJ
    const cpfCnpj = cpfCnpjInput.value.replace(/\D/g, '');
    if (cpfCnpj.length === 11) {
        cpfCnpjInput.value = cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cpfCnpj.length === 14) {
        cpfCnpjInput.value = cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
        alert('Por favor, insira um CPF ou CNPJ válido.');
        return;
    }

    if (!validarCPFouCNPJ(cpfCnpjInput.value)) {
        alert('Por favor, insira um CPF ou CNPJ válido.');
        return;
    }

    const userData = {
        name: document.getElementById('name').value,
        cpf_cnpj: cpfCnpjInput.value,
        email: document.getElementById('email').value,
        password: password,
    };

    try {
        // Armazena no IndexedDB
        await addUserToDB(userData);
        alert('Cadastro realizado com sucesso!');
        document.getElementById('registrationForm').reset();
        console.error('Erro ao salvar no banco:', error);
        alert('Ocorreu um erro ao salvar seus dados.');
    }
});