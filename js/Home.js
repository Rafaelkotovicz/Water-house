/* =====================================================
   1. FUNÇÕES DE ABRIR E FECHAR MODAIS
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
   2. LÓGICA DE BUSCA (FILTROS)
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
   3. LÓGICA DE CRIAR NOVO ANÚNCIO
===================================================== */
function criarAnuncio() {
  const titulo = document.getElementById("novo-titulo").value;
  const tipo = document.getElementById("novo-tipo").value;
  const local = document.getElementById("novo-local").value;
  const preco = document.getElementById("novo-preco").value;
  let imagem = document.getElementById("novo-img").value;

  if (titulo === "" || local === "" || preco === "") {
    alert("Por favor, preencha Título, Localização e Preço!");
    return;
  }

  if (imagem === "") {
    imagem =
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500";
  }

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
