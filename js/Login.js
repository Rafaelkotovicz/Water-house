// ==========================================
// 1. SELEÇÃO DE ELEMENTOS E DADOS
// ==========================================
const inputSenha = document.getElementById("senha");
const inputEmail = document.getElementById("email");
const botaoEntrar = document.querySelector(".BotaoEntrar");

const usuarioMockado = {
  email: "trabalho@hotmail.com",
  senha: "123456789",
};

// Preenche os campos iniciais
if (inputEmail && inputSenha) {
  inputEmail.value = usuarioMockado.email;
  inputSenha.value = usuarioMockado.senha;
}

// ==========================================
// 2. LÓGICA DO OLHO (MOSTRAR/ESCONDER SENHA)
// ==========================================
const passwordWrapper = document.createElement("div");
passwordWrapper.classList.add("password-input-wrapper");

if (inputSenha) {
  inputSenha.parentNode.insertBefore(passwordWrapper, inputSenha);
  passwordWrapper.appendChild(inputSenha);

  const botaoOlho = document.createElement("button");
  botaoOlho.type = "button";
  botaoOlho.innerHTML = '<i class="fa-solid fa-eye"></i>';
  botaoOlho.classList.add("botao-olho-interno");
  passwordWrapper.appendChild(botaoOlho);

  botaoOlho.addEventListener("click", function () {
    if (inputSenha.type === "password") {
      inputSenha.type = "text";
      botaoOlho.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      inputSenha.type = "password";
      botaoOlho.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
  });
}

// ==========================================
// 3. VALIDAÇÃO E ALERTAS DE LOGIN
// ==========================================
if (botaoEntrar) {
  botaoEntrar.addEventListener("click", function (event) {
    event.preventDefault();

    const email = inputEmail.value.trim();
    const senha = inputSenha.value.trim();

    // Limpa mensagens de erro anteriores
    document.querySelectorAll(".mensagem-erro").forEach((e) => e.remove());

    let temErro = false;

    // Validação do E-mail (Presença de @)
    if (email === "") {
      mostrarErro(inputEmail, "O campo de e-mail é obrigatório.");
      temErro = true;
    } else if (!email.includes("@")) {
      mostrarErro(inputEmail, 'E-mail inválido: falta o símbolo "@".');
      temErro = true;
    }

    // Validação da Senha (Vazia)
    if (senha === "") {
      mostrarErro(passwordWrapper, "O campo de senha é obrigatório.");
      temErro = true;
    }

    // SE O FORMATO ESTIVER OK, VALIDA AS CREDENCIAIS
    if (!temErro) {
      if (email === usuarioMockado.email && senha === usuarioMockado.senha) {
        // SUCESSO! Registramos no navegador que ele está logado.
        localStorage.setItem("logado", "true");
        window.location.href = "home.html";
      } else {
        // ALERTA DE CREDENCIAIS INVÁLIDAS
        mostrarErro(
          botaoEntrar,
          "E-mail ou senha incorretos. Tente novamente.",
        );

        // Feedback visual: bordas vermelhas temporárias
        inputEmail.style.borderColor = "#e11d48";
        inputSenha.style.borderColor = "#e11d48";

        // Remove a borda vermelha após 2 segundos
        setTimeout(() => {
          inputEmail.style.borderColor = "";
          inputSenha.style.borderColor = "";
        }, 2000);
      }
    }
  });
}

// ==========================================
// 4. FUNÇÕES AUXILIARES
// ==========================================
function mostrarErro(elementoAlvo, mensagem) {
  const erro = document.createElement("span");
  erro.classList.add("mensagem-erro");
  erro.textContent = mensagem;
  elementoAlvo.parentNode.insertBefore(erro, elementoAlvo.nextSibling);
}
