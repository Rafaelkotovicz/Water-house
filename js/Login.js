// Mostrar/esconder senha
const inputSenha = document.querySelector('input[type="password"]');

const botaoOlho = document.createElement('button');
botaoOlho.type = 'button';
botaoOlho.innerHTML = '<i class="fa-solid fa-eye"></i>';
botaoOlho.classList.add('botao-olho');

inputSenha.parentNode.appendChild(botaoOlho);

botaoOlho.addEventListener('click', function () {
    if (inputSenha.type === 'password') {
        inputSenha.type = 'text';
        botaoOlho.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        inputSenha.type = 'password';
        botaoOlho.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
});


// Validação e envio do formulário
const botaoEntrar = document.querySelector('.BotaoEntrar');
const inputEmail = document.querySelector('input[type="email"]');

botaoEntrar.addEventListener('click', function () {
    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    // Remove mensagens de erro anteriores
    document.querySelectorAll('.mensagem-erro').forEach(e => e.remove());

    let temErro = false;

    // Campos vazios
    if (email === '') {
        mostrarErro(inputEmail, 'O campo de email é obrigatório.');
        temErro = true;
    } else if (!validarEmail(email)) {
        // Validar formato do email
        mostrarErro(inputEmail, 'Digite um email válido.');
        temErro = true;
    }

    if (senha === '') {
        mostrarErro(inputSenha, 'O campo de senha é obrigatório.');
        temErro = true;
    } else if (senha.length < 6) {
        // Validar tamanho mínimo da senha
        mostrarErro(inputSenha, 'A senha deve ter pelo menos 6 caracteres.');
        temErro = true;
    }

    // Redirecionar se não tiver erros
    if (!temErro) {
        window.location.href = '#';
    }
});


// Função para mostrar mensagem de erro abaixo do input
function mostrarErro(input, mensagem) {
    const erro = document.createElement('span');
    erro.classList.add('mensagem-erro');
    erro.textContent = mensagem;
    input.parentNode.insertBefore(erro, input.nextSibling);
}


// Função para validar formato do email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}