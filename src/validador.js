function exibirResultado() {
    const campoTexto = document.getElementById('numero'); // Obtém o campo de entrada
    const resultado = document.getElementById('resultado'); // Obtém o elemento para exibir o resultado
    const imagemBandeira = document.getElementById('bandeira-imagem'); // Obtém o elemento da imagem
    const numeroCartao = campoTexto.value.trim(); // Obtém o valor digitado no campo

    // Chama a função validarNumero e obtém o resultado
    const validacao = validarNumero(numeroCartao);

    // Exibe a mensagem de validação no elemento HTML
    resultado.textContent = validacao.mensagem;

    // Define a cor do texto com base na validade do número
    resultado.style.color = validacao.valido ? "green" : "red";

    // Exibe a imagem correspondente à bandeira, se identificada
    if (validacao.valido && validacao.bandeira) {
        imagemBandeira.src = `assets/${validacao.bandeira.toLowerCase().replace(/ /g, "_")}.png`;
        imagemBandeira.style.display = "inline";
    } else {
        imagemBandeira.style.display = "none"; // Oculta a imagem se a bandeira não for identificada
    }
}

function validarNumero(numeroCartao) {
    if (!numeroCartao) {
        return { valido: false, mensagem: "Por favor, insira um número de cartão." };
    }

    if (!validarCartaoCredito(numeroCartao)) {
        return { valido: false, mensagem: "O número do cartão é inválido." };
    }

    const bandeira = identificarBandeira(numeroCartao);
    if (bandeira) {
        return { valido: true, mensagem: `O número do cartão é válido. Bandeira: ${bandeira}`, bandeira: bandeira };
    } else {
        return { valido: true, mensagem: "O número do cartão é válido, mas a bandeira não foi identificada.", bandeira: null };
    }
}

function validarCartaoCredito(numeroCartao) {
    let soma = 0;
    let alternar = false;

    for (let i = numeroCartao.length - 1; i >= 0; i--) {
        let digito = parseInt(numeroCartao[i], 10);

        if (alternar) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }

        soma += digito;
        alternar = !alternar;
    }

    return soma % 10 === 0;
}

function identificarBandeira(numeroCartao) {
    const bandeiras = {
        Mastercard: /^5[1-5][0-9]{14}$/,
        Visa: /^4(?:[0-9]{12}|[0-9]{15})$/,
        "American Express": /^3[47][0-9]{13}$/,
        "Diners Club": /^3(?:0[0-5][0-9]{11}|[68][0-9]{12})$/,
        Discover: /^6011[0-9]{12}$/,
        JCB: /^(?:3[0-9]{15}|(2131|1800)[0-9]{11})$/,
        Enroute: /^2(?:014|149)[0-9]{11}$/,
        Hipercard: /^(606282|3841(?:[0|4|6]{1})0)/,
        Aura: /^((?!504175))^((?!5067))(^50[0-9])/,
        Voyager: /^8699\d{9}(\d{0,3})?$/
    };

    for (const [bandeira, regex] of Object.entries(bandeiras)) {
        if (regex.test(numeroCartao)) {
            return bandeira;
        }
    }

    return null;
}