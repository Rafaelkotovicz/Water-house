const btn = document.getElementById('btn-recuperar');
const input = document.getElementById('email-recuperacao');

// Se os elementos existirem na tela, adiciona o evento
if (btn && input) {
    btn.addEventListener('click', (event) => {
        // Impede que o botão recarregue a página caso esteja dentro de uma tag <form>
        event.preventDefault(); 

        const email = input.value.trim();
        
        // Limpa mensagens anteriores (tanto de erro quanto de sucesso) para não acumularem na tela
        document.querySelectorAll('.mensagem-erro, .mensagem-sucesso').forEach(el => el.remove());

        if (email === "" || !email.includes('@')) {
            // Cria a mensagem de erro (Vermelha)
            const span = document.createElement('span');
            span.classList.add('mensagem-erro');
            span.innerText = "Introduza um e-mail válido";
            input.parentNode.insertBefore(span, input.nextSibling);
        } else {
            // Cria a mensagem de sucesso (Verde)
            const mensagemSucesso = document.createElement('div');
            mensagemSucesso.classList.add('mensagem-sucesso');
            mensagemSucesso.innerHTML = `<i class="fa-solid fa-circle-check"></i> Um link de recuperação foi enviado para <b>${email}</b>!`;
            
            // Insere a mensagem verde logo abaixo do botão
            btn.parentNode.insertBefore(mensagemSucesso, btn.nextSibling);

            // Limpa o campo de e-mail para dar a sensação de que foi enviado
            input.value = '';

            /* OPCIONAL: Se você quiser que o usuário leia a mensagem e 
               depois a página volte sozinha para o login, descomente as 3 linhas abaixo:
            */
            // setTimeout(() => {
            //     window.location.href = 'index.html';
            // }, 3500); // 3500 milissegundos = 3.5 segundos de espera
        }
    });
}