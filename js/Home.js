// FUNÇÃO PARA ABRIR O MODAL
// Ela recebe 4 informações do HTML quando o botão 'Ver Detalhes' é clicado
function abrirModal(titulo, localizacao, preco, imagem) {
  // 1. Encontra os elementos escondidos lá no Modal do HTML usando seus IDs
  const modal = document.getElementById("modal-imovel");
  const tituloModal = document.getElementById("modal-titulo");
  const localModal = document.getElementById("modal-localizacao");
  const precoModal = document.getElementById("modal-preco");
  const imgModal = document.getElementById("modal-img");

  // 2. Substitui o texto vazio do modal pelas informações que vieram do botão clicado
  tituloModal.innerText = titulo;
  localModal.innerText = localizacao;
  precoModal.innerText = preco;
  imgModal.src = imagem; // Troca o caminho da imagem

  // 3. Muda a configuração CSS de "display: none" para "display: flex"
  // Isso é o que faz o modal aparecer na tela!
  modal.style.display = "flex";
}

// FUNÇÃO PARA FECHAR O MODAL
function fecharModal() {
  // 1. Pega o modal inteiro
  const modal = document.getElementById("modal-imovel");

  // 2. Devolve para "display: none", fazendo ele sumir da tela
  modal.style.display = "none";
}

// BÔNUS DE UX: Fechar o modal clicando fora dele (na parte preta transparente)
window.onclick = function (evento) {
  const modal = document.getElementById("modal-imovel");

  // Se o lugar que o usuário clicou for exatamente o fundo preto (modal-overlay)
  if (evento.target == modal) {
    // Executa a função de fechar
    fecharModal();
  }
};
