document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-anunciar');
    const inputFoto = document.getElementById('foto-upload');
    const dropZone = document.getElementById('drop-zone');
    const previewContainer = document.getElementById('preview-container');
    const erroFoto = document.getElementById('erro-foto');
    const inputPreco = document.getElementById('preco');
    const btnSubmit = document.getElementById('btn-submit');
    
    let fotosSelecionadas = [];

    // Máscara simples de moeda
    inputPreco.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = (valor / 100).toFixed(2) + "";
        valor = valor.replace(".", ",");
        valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        e.target.value = valor ? `R$ ${valor}` : "";
    });

    // Abrir seletor de arquivos ao clicar na área
    dropZone.addEventListener('click', () => {
        inputFoto.click();
    });

    // Gerar miniatura das imagens
    inputFoto.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            fotosSelecionadas.push(file);
            const reader = new FileReader();
            
            reader.onload = (evento) => {
                const img = document.createElement('img');
                img.src = evento.target.result;
                img.className = 'preview-item';
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });

        if (fotosSelecionadas.length > 0) {
            erroFoto.style.display = 'none';
        }
    });

    // Remover erro assim que o usuário digita
    const camposObrigatorios = form.querySelectorAll('[required]');
    camposObrigatorios.forEach(campo => {
        campo.addEventListener('input', () => {
            if (campo.value.trim() !== "") {
                campo.closest('.grupo-input').classList.remove('erro');
            }
        });
    });

    // Validação e envio
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let formularioValido = true;

        // Verifica campos de texto obrigatórios
        camposObrigatorios.forEach(campo => {
            if (!campo.value.trim()) {
                formularioValido = false;
                campo.closest('.grupo-input').classList.add('erro');
            }
        });

        // Verifica fotos
        if (fotosSelecionadas.length === 0) {
            formularioValido = false;
            erroFoto.style.display = 'block';
        }

        // Foco no primeiro erro
        if (!formularioValido) {
            alert("⚠️ Atenção: Preencha todos os campos obrigatórios destacados em vermelho.");
            const primeiroErro = form.querySelector('.erro') || dropZone;
            primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Salvar dados
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Publicando...";

        try {
            const amenities = Array.from(form.querySelectorAll('input[name="amenities"]:checked')).map(c => c.value);
            
            const imovelData = {
                id: Date.now(),
                titulo: document.getElementById('titulo').value,
                tipo: document.getElementById('tipo').value,
                preco: document.getElementById('preco').value,
                localizacao: document.getElementById('localizacao').value,
                descricao: document.getElementById('descricao').value,
                amenities: amenities,
                // Em um cenário real, enviaríamos as fotos para um servidor aqui
                fotosQtd: fotosSelecionadas.length, 
                dataPostagem: new Date().toLocaleDateString('pt-BR')
            };

            const imoveisExistentes = JSON.parse(localStorage.getItem('imoveis')) || [];
            imoveisExistentes.push(imovelData);
            localStorage.setItem('imoveis', JSON.stringify(imoveisExistentes));

            alert('✅ Anúncio publicado com sucesso na WaterHouse!');
            window.location.href = 'Home.html';
        } catch (error) {
            alert("Erro ao salvar os dados. Limite de armazenamento atingido.");
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Publicar Anúncio Agora";
        }
    });
});