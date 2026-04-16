const formCadastro = document.getElementById("formCadastro");
const nome = document.getElementById("nome");
const dataNascimento = document.getElementById("dataNascimento");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");
const mensagemErro = document.getElementById("mensagemErro");
const mensagemSucesso = document.getElementById("mensagemSucesso");

function limparMensagens() {
    mensagemErro.textContent = "";
    mensagemSucesso.textContent = "";
}

function validarEmail(emailValor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailValor);
}

function formatarTelefone(valor) {
    valor = valor.replace(/\D/g, "");

    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }

    if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (valor.length > 0) {
        valor = valor.replace(/^(\d*)/, "($1");
    }

    return valor;
}

telefone.addEventListener("input", function () {
    telefone.value = formatarTelefone(telefone.value);
});

formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();
    limparMensagens();

    const nomeValor = nome.value.trim();
    const dataNascimentoValor = dataNascimento.value;
    const emailValor = email.value.trim();
    const telefoneValor = telefone.value.trim();
    const senhaValor = senha.value.trim();
    const confirmarSenhaValor = confirmarSenha.value.trim();

    if (
        nomeValor === "" ||
        dataNascimentoValor === "" ||
        emailValor === "" ||
        telefoneValor === "" ||
        senhaValor === "" ||
        confirmarSenhaValor === ""
    ) {
        mensagemErro.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    if (nomeValor.length < 3) {
        mensagemErro.textContent = "O nome deve ter pelo menos 3 caracteres.";
        return;
    }

    if (!validarEmail(emailValor)) {
        mensagemErro.textContent = "Digite um e-mail válido.";
        return;
    }

    const telefoneNumeros = telefoneValor.replace(/\D/g, "");
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
        mensagemErro.textContent = "Digite um telefone válido.";
        return;
    }

    if (senhaValor.length < 6) {
        mensagemErro.textContent = "A senha deve ter no mínimo 6 caracteres.";
        return;
    }

    if (senhaValor !== confirmarSenhaValor) {
        mensagemErro.textContent = "As senhas não coincidem.";
        return;
    }

    const usuario = {
        nome: nomeValor,
        dataNascimento: dataNascimentoValor,
        email: emailValor,
        telefone: telefoneValor
    };

    localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));
    localStorage.setItem("usuarioLogado", "true");

    mensagemSucesso.textContent = "Cadastro realizado com sucesso!";

    setTimeout(function () {
        window.location.href = "../html/Home.html";
    }, 1000);
});