(function () {
    'use strict';

    var STORAGE_IMOVEL = 'waterhouse_pagamento_imovel';
    var PAGAMENTO_HREF = 'tela-pag.html';

    function parsePreco(card) {
        var raw = card.getAttribute('data-total') || '';
        var n = parseFloat(String(raw).replace(',', '.'));
        return Number.isFinite(n) && n > 0 ? n : 0;
    }

    function irParaPagamento(card) {
        var titulo = (card.getAttribute('data-titulo') || '').trim() || 'Imóvel selecionado';
        var local = (card.getAttribute('data-local') || '').trim() || '—';
        var totalBrl = parsePreco(card);
        if (totalBrl <= 0) {
            window.alert('Não foi possível obter o valor deste imóvel. Tente outro card ou atualize a página.');
            return;
        }
        try {
            sessionStorage.setItem(
                STORAGE_IMOVEL,
                JSON.stringify({
                    titulo: titulo,
                    local: local,
                    totalBrl: totalBrl
                })
            );
        } catch (e) {
            window.alert('Não foi possível salvar a seleção. Verifique se os cookies/armazenamento estão habilitados.');
            return;
        }
        window.location.href = PAGAMENTO_HREF;
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.divCards .card').forEach(function (card) {
            var btn = card.querySelector('.btn-pagamento');
            if (!btn) return;
            btn.addEventListener('click', function () {
                irParaPagamento(card);
            });
        });
    });
})();
