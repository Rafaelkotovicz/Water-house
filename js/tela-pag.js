(function () {
    'use strict';

    /**
     * =============================================================================
     * INTEGRAÇÃO — Tela de anúncios / listagem de imóveis (chamada a partir da outra tela)
     * =============================================================================
     * Quando o cliente selecionar o imóvel e for pagar, na página de ANÚNCIOS execute
     * antes de redirecionar para esta tela de pagamento, por exemplo:
     *
     *   sessionStorage.setItem('waterhouse_pagamento_imovel', JSON.stringify({
     *     titulo: 'Apartamento Beira-Mar',
     *     local: 'São Cristóvão - SE',
     *     totalBrl: 1850.90
     *   }));
     *   window.location.href = 'index.html';   // ajuste o caminho desta página
     *
     * Somente valor (o título/local permanecem os placeholders do HTML):
     *   sessionStorage.setItem('waterhouse_pagamento_total_brl', '1850.90');
     *
     * Opcional — valor na URL para testes: ?total=1850.90
     * =============================================================================
     */

    var STORAGE_IMOVEL = 'waterhouse_pagamento_imovel';
    var STORAGE_TOTAL = 'waterhouse_pagamento_total_brl';

    /** Sem dados da Home: total 0 desativa parcelamento até haver seleção válida. */
    var DEMO_TOTAL_ESCOLAR_BRL = 0;

    var MAX_PARCELAS_SEM_JUROS = 6;
    var MIN_VALOR_POR_PARCELA = 5;

    function formatBRL(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function parseBRLText(text) {
        var normalized = String(text)
            .replace(/\s/g, '')
            .replace('R$', '')
            .replace(/\./g, '')
            .replace(',', '.');
        var n = parseFloat(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    function parseTotalFromQuery() {
        var params = new URLSearchParams(window.location.search);
        var t = params.get('total');
        if (t == null || t === '') return NaN;
        var n = parseFloat(String(t).replace(',', '.'));
        return Number.isFinite(n) && n > 0 ? n : NaN;
    }

    /** Lê imóvel + total da integração; retorna { totalBrl, titulo?, local? } ou null. */
    function readIntegrationPayload() {
        var raw = sessionStorage.getItem(STORAGE_IMOVEL);
        if (raw) {
            try {
                var o = JSON.parse(raw);
                var total =
                    typeof o.totalBrl === 'number' ? o.totalBrl : parseFloat(String(o.totalBrl).replace(',', '.'));
                if (Number.isFinite(total) && total > 0) {
                    return {
                        totalBrl: total,
                        titulo: o.titulo || null,
                        local: o.local || null
                    };
                }
            } catch (e) {
                return null;
            }
        }
        var only = sessionStorage.getItem(STORAGE_TOTAL);
        if (only) {
            var n = parseFloat(String(only).replace(',', '.'));
            if (Number.isFinite(n) && n > 0) return { totalBrl: n, titulo: null, local: null };
        }
        var q = parseTotalFromQuery();
        if (!Number.isNaN(q)) return { totalBrl: q, titulo: null, local: null };
        return null;
    }

    function applyIntegrationToDOM(totalEl, titleEl, locEl) {
        var payload = readIntegrationPayload();
        var total = payload && payload.totalBrl > 0 ? payload.totalBrl : DEMO_TOTAL_ESCOLAR_BRL;

        if (!payload || !(payload.totalBrl > 0)) {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn(
                    'WaterHouse: nenhum valor vindo da tela de anúncios — usando total de demonstração (' +
                        DEMO_TOTAL_ESCOLAR_BRL +
                        '). Defina sessionStorage conforme o bloco INTEGRAÇÃO no topo de script.js.'
                );
            }
        }

        totalEl.textContent = formatBRL(total);
        if (payload && payload.titulo) titleEl.textContent = payload.titulo;
        if (payload && payload.local) locEl.textContent = payload.local;

        return total;
    }

    function luhnValid(digits) {
        var sum = 0;
        var alt = false;
        for (var i = digits.length - 1; i >= 0; i--) {
            var n = parseInt(digits.charAt(i), 10);
            if (Number.isNaN(n)) return false;
            if (alt) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alt = !alt;
        }
        return digits.length >= 13 && sum % 10 === 0;
    }

    function parseExpiry(value) {
        var m = value.replace(/\D/g, '');
        if (m.length !== 4) return null;
        var month = parseInt(m.slice(0, 2), 10);
        var year = parseInt(m.slice(2, 4), 10);
        if (month < 1 || month > 12) return null;
        return { month: month, year: year };
    }

    function expiryNotPast(exp) {
        var now = new Date();
        var cy = now.getFullYear() % 100;
        var cm = now.getMonth() + 1;
        if (exp.year < cy) return false;
        if (exp.year === cy && exp.month < cm) return false;
        return true;
    }

    function isAmexDigits(d) {
        return d.indexOf('34') === 0 || d.indexOf('37') === 0;
    }

    /** Máscara no padrão de portais: Amex 4+6+5; demais bandeiras em grupos de 4. */
    function maskCardNumber(raw) {
        var d = raw.replace(/\D/g, '');
        if (isAmexDigits(d)) {
            d = d.slice(0, 15);
            var a = d.slice(0, 4);
            var b = d.slice(4, 10);
            var c = d.slice(10, 15);
            return [a, b, c].filter(Boolean).join(' ');
        }
        d = d.slice(0, 19);
        return d.replace(/(.{4})/g, '$1 ').trim();
    }

    function maskExpiry(raw) {
        return raw
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .slice(0, 5);
    }

    /** Nome: apenas letras (incl. acentos), espaço, hífen e apóstrofo — comum em checkout BR. */
    function maskCardName(raw) {
        return raw
            .replace(/[^a-zA-ZÀ-ÿ\s'.-]/g, '')
            .replace(/\s+/g, ' ')
            .slice(0, 120);
    }

    function cvvMaxLengthForPan(digits) {
        return isAmexDigits(digits) ? 4 : 3;
    }

    function updatePayButtonLabel(button, totalEl) {
        var totalText = totalEl.textContent.trim();
        button.textContent = totalText ? 'Pagar ' + totalText : 'Pagar';
    }

    function fillInstallments(select, totalValue) {
        select.innerHTML = '';
        if (totalValue <= 0) {
            var opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'Valor indisponível';
            select.appendChild(opt);
            select.disabled = true;
            return;
        }
        select.disabled = false;
        var maxParcelas = Math.min(
            MAX_PARCELAS_SEM_JUROS,
            Math.max(1, Math.floor(totalValue / MIN_VALOR_POR_PARCELA))
        );
        for (var i = 1; i <= maxParcelas; i++) {
            var opt = document.createElement('option');
            opt.value = String(i);
            var each = totalValue / i;
            var eachFmt = formatBRL(each);
            opt.textContent =
                i === 1 ? '1x de ' + eachFmt + ' (sem juros)' : i + 'x de ' + eachFmt + ' (sem juros)';
            select.appendChild(opt);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('payment-form');
        var button = form.querySelector('.btn-pay');
        var totalEl = document.getElementById('total-price');
        var titleEl = document.getElementById('property-title');
        var locEl = document.getElementById('property-location');
        var cardNumber = document.getElementById('card-number');
        var expDate = document.getElementById('exp-date');
        var cvv = document.getElementById('cvv');
        var cardName = document.getElementById('card-name');
        var installments = document.getElementById('installments');

        var totalValue = applyIntegrationToDOM(totalEl, titleEl, locEl);
        fillInstallments(installments, totalValue);
        updatePayButtonLabel(button, totalEl);

        cardName.addEventListener('input', function () {
            this.value = maskCardName(this.value);
        });

        cardName.addEventListener('blur', function () {
            this.value = maskCardName(this.value).replace(/\s+$/, '');
            var parts = this.value.split(/\s+/).filter(Boolean);
            this.value = parts
                .map(function (w) {
                    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                })
                .join(' ');
        });

        cardNumber.addEventListener('input', function () {
            this.value = maskCardNumber(this.value);
            var digits = this.value.replace(/\D/g, '');
            var maxCvv = cvvMaxLengthForPan(digits);
            cvv.maxLength = maxCvv;
            if (cvv.value.replace(/\D/g, '').length > maxCvv) {
                cvv.value = cvv.value.replace(/\D/g, '').slice(0, maxCvv);
            }
        });

        expDate.addEventListener('input', function () {
            this.value = maskExpiry(this.value);
        });

        cvv.addEventListener('input', function () {
            var digitsPan = cardNumber.value.replace(/\D/g, '');
            var maxC = cvvMaxLengthForPan(digitsPan);
            this.value = this.value.replace(/\D/g, '').slice(0, maxC);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var digits = cardNumber.value.replace(/\D/g, '');
            if (digits.length < 13 || digits.length > 19) {
                window.alert(
                    '⚠️ Dados incompletos\n\nO número do cartão informado não está no formato esperado. Verifique e tente novamente.'
                );
                cardNumber.focus();
                return;
            }
            if (!luhnValid(digits)) {
                window.alert(
                    '⚠️ Cartão não validado\n\nO número do cartão não foi reconhecido pela verificação de segurança. Confira os dígitos e tente novamente.'
                );
                cardNumber.focus();
                return;
            }

            var exp = parseExpiry(expDate.value);
            if (!exp || !expiryNotPast(exp)) {
                window.alert(
                    '⚠️ Validade inválida\n\nInforme a validade no formato MM/AA e certifique-se de que o cartão não está vencido.'
                );
                expDate.focus();
                return;
            }

            var needCvv = cvvMaxLengthForPan(digits);
            var cvvDigits = cvv.value.replace(/\D/g, '');
            if (cvvDigits.length !== needCvv) {
                window.alert(
                    '⚠️ CVV incorreto\n\nInforme o código de segurança (' +
                        needCvv +
                        ' dígitos) conforme indicado no cartão.'
                );
                cvv.focus();
                return;
            }

            var name = cardName.value.trim();
            if (!name) {
                window.alert(
                    '⚠️ Nome obrigatório\n\nPreencha o nome exatamente como impresso no cartão.'
                );
                cardName.focus();
                return;
            }

            button.disabled = true;
            button.classList.add('loading');
            button.textContent = 'Processando...';

            window.setTimeout(function () {
                var parcelas = installments.value;
                var totalFmt = totalEl.textContent.trim();
                window.alert(
                    '✅ Pagamento concluído com sucesso\n\n' +
                        'Prezado(a) cliente, o pagamento no valor de ' +
                        totalFmt +
                        ' foi processado.\n' +
                        (parcelas ? 'Parcelamento: ' + parcelas + 'x sem juros.\n' : '') +
                        '\nAgradecemos a preferência. WaterHouse — excelência em locação.'
                );
                form.reset();
                fillInstallments(installments, totalValue);
                button.classList.remove('loading');
                button.disabled = false;
                updatePayButtonLabel(button, totalEl);
                cvv.maxLength = 4;
            }, 2000);
        });
    });
})();
