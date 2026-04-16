/* =====================================================
   1. VERIFICAÇÃO DE LOGIN E PERFIL 
===================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const estaLogado = localStorage.getItem("logado") === "true";
  const areaUsuario = document.getElementById("area-usuario");

  if (estaLogado) {
    areaUsuario.innerHTML = `
            <div class="perfil-logado">
                <i class="fa-solid fa-circle-user" style="font-size: 30px; color: var(--primary-color);"></i>
                <a href="#" onclick="fazerLogout()" class="link-sair">Sair</a>
            </div>
        `;
  }
});

function fazerLogout() {
  localStorage.removeItem("logado");
  window.location.reload();
}

/* =====================================================
   2. FUNÇÕES DE ABRIR E FECHAR MODAIS
===================================================== */
function abrirModal(titulo, localizacao, preco, imagem) {
  document.getElementById("modal-titulo").innerText = titulo;
  document.getElementById("modal-localizacao").innerText = localizacao;
  document.getElementById("modal-preco").innerText = preco;
  document.getElementById("modal-img").src = imagem;

  document.getElementById("modal-imovel").style.display = "flex";
}

function abrirModalAnuncio(evento) {
  evento.preventDefault();

  const estaLogado = localStorage.getItem("logado") === "true";
  if (!estaLogado) {
    alert("Você precisa estar logado para anunciar um imóvel!");
    window.location.href = "Login.html";
    return;
  }

  document.getElementById("modal-cadastro").style.display = "flex";
}

function fecharModal(idModal) {
  document.getElementById(idModal).style.display = "none";
}

window.onclick = function (evento) {
  const modalImovel = document.getElementById("modal-imovel");
  const modalCadastro = document.getElementById("modal-cadastro");

  if (evento.target == modalImovel) {
    fecharModal("modal-imovel");
  }
  if (evento.target == modalCadastro) {
    fecharModal("modal-cadastro");
  }
};

/* =====================================================
   3. LÓGICA DE BUSCA (FILTROS)
===================================================== */
function buscarImoveis() {
  const termoLocal = document.getElementById("busca-local").value.toLowerCase();
  const valorMinimo =
    parseFloat(document.getElementById("busca-min").value) || 0;
  const valorMaximo =
    parseFloat(document.getElementById("busca-max").value) || Infinity;

  const cards = document.querySelectorAll(".card-imovel");

  cards.forEach((card) => {
    const localCard = card.getAttribute("data-local").toLowerCase();
    const precoCard = parseFloat(card.getAttribute("data-preco"));

    const bateLocal = localCard.includes(termoLocal);
    const batePreco = precoCard >= valorMinimo && precoCard <= valorMaximo;

    if (bateLocal && batePreco) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

/* =====================================================
   4. LÓGICA DE CRIAR NOVO ANÚNCIO 
===================================================== */
function criarAnuncio() {
  const titulo = document.getElementById("novo-titulo").value;
  const tipo = document.getElementById("novo-tipo").value;
  const local = document.getElementById("novo-local").value;
  const preco = document.getElementById("novo-preco").value;
  const inputImg = document.getElementById("novo-img");

  if (titulo === "" || local === "" || preco === "") {
    alert("Por favor, preencha Título, Localização e Preço!");
    return;
  }

  if (inputImg.files && inputImg.files[0]) {
    const leitor = new FileReader();
    leitor.onload = function (e) {
      const imagemBase64 = e.target.result;
      renderizarNovoCard(titulo, tipo, local, preco, imagemBase64);
    };
    leitor.readAsDataURL(inputImg.files[0]);
  } else {
    const imagemPadrao =
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500";
    renderizarNovoCard(titulo, tipo, local, preco, imagemPadrao);
  }
}

function renderizarNovoCard(titulo, tipo, local, preco, imagem) {
  const precoFormatado = "R$ " + parseFloat(preco).toLocaleString("pt-BR");

  const novoCardHTML = `
        <div class="card-imovel" data-preco="${preco}" data-local="${local.toLowerCase()}">
            <img src="${imagem}" alt="${titulo}" class="img-imovel" />
            <div class="info-imovel">
                <span class="tag-tipo">${tipo}</span>
                <h3>${titulo}</h3>
                <p class="localizacao">${local}</p>
                <p class="preco">${precoFormatado} <span class="diaria">/ mês</span></p>
                <button class="btn-detalhes" onclick="abrirModal('${titulo}', '${local}', '${precoFormatado}', '${imagem}')">Ver Detalhes</button>
            </div>
        </div>
    `;

  const gridImoveis = document.getElementById("grid-imoveis");
  gridImoveis.insertAdjacentHTML("beforeend", novoCardHTML);

  document.getElementById("novo-titulo").value = "";
  document.getElementById("novo-local").value = "";
  document.getElementById("novo-preco").value = "";
  document.getElementById("novo-img").value = "";

  fecharModal("modal-cadastro");
  alert("Anúncio criado com sucesso!");
}

/* =====================================================
   5. REDIRECIONAMENTO PARA PAGAMENTO (NOVO)
===================================================== */
function irParaPagamento() {
  const titulo = document.getElementById("modal-titulo").innerText;
  const local = document.getElementById("modal-localizacao").innerText;
  const precoString = document.getElementById("modal-preco").innerText;

  // Converte a string (Ex: "R$ 8.500") para um número legível (Ex: 8500)
  const precoLimpo = precoString
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  const totalBrl = parseFloat(precoLimpo);

  const imovelSelecionado = {
    titulo: titulo,
    local: local,
    totalBrl: isNaN(totalBrl) ? 0 : totalBrl,
  };

  // Salva os dados no sessionStorage para o arquivo Pagamento.js resgatar
  sessionStorage.setItem(
    "waterhouse_pagamento_imovel",
    JSON.stringify(imovelSelecionado),
  );

  // Redireciona para a tela de pagamento
  window.location.href = "Pagamento.html";
}
