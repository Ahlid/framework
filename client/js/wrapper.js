var WrapperEquipamento = (function() {

    return function(equipamento) {
        this.equipamento = equipamento;
        this.elemento = document.createElement('div');
        this.elemento.setAttribute('class', 'wrapper-equipamento');

    }

})();

var WrapperEquipamentoIdentificado = (function() {

    return function(equipamento) {

        WrapperEquipamento.call(this, equipamento);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' equipamento-identificado');
        this.identificacao = document.createElement('h5');
        this.identificacao.textContent = equipamento.nome;
        this.elemento.appendChild(this.identificacao);

    }

})();
WrapperEquipamentoIdentificado.prototype = Object.create(WrapperEquipamento.prototype);
WrapperEquipamentoIdentificado.prototype.constructor = WrapperEquipamentoIdentificado;


var WrapperEquipamentoImpactoLocal = (function() {

    return function(equipamentoImpactoLocal) {

        WrapperEquipamento.call(this, equipamentoImpactoLocal);

        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' impacto-local');
        var nomeEquipamento = equipamentoImpactoLocal.nome;
        var nomeSensor = equipamentoImpactoLocal.sensor != void 0 ?
            equipamentoImpactoLocal.sensor.nome : 'Não definido';

        this.referencia = document.createElement('h5');
        this.elemento.appendChild(this.referencia);
        this.referencia.textContent = nomeEquipamento + '>' + nomeSensor;
        this.equipamento = equipamentoImpactoLocal;

        var that = this;
        this.referencia.onclick = function(e) {

            var parent = that.elemento;
            var listaSensores = document.createElement('select');

            parent.replaceChild(listaSensores, that.referencia);

            var equipamentosOpcoes = {};

            var equipamentos = equipamentoImpactoLocal.compartimento.equipamentos;

            equipamentos.filter(function(equipamento) {

                if (!(equipamento instanceof Sensor))
                    return false;

                return equipamentoImpactoLocal.isSensorValido(equipamento);

            }).forEach(function(equipamento, index) {

                var opcao = document.createElement('option');
                opcao.value = equipamento.nome;

                equipamentosOpcoes[equipamento.nome] = equipamento;

                var texto = document.createTextNode(equipamento.nome);
                opcao.appendChild(texto);
                listaSensores.appendChild(opcao);

                if (that.equipamento.sensor === equipamento) {
                    listaSensores.value = that.equipamento.sensor.nome;
                }

            }, that);

            listaSensores.focus();


            listaSensores.onblur = function(e) {
                equipamentoImpactoLocal.setSensor(equipamentosOpcoes[listaSensores.value]);
                that.referencia.textContent = that.equipamento.nome + '>' + equipamentosOpcoes[listaSensores.value].nome;

                parent.replaceChild(that.referencia, listaSensores);
            }

        }

    }

})();
WrapperEquipamentoImpactoLocal.prototype = Object.create(WrapperEquipamento.prototype);
WrapperEquipamentoImpactoLocal.prototype.constructor = WrapperEquipamentoImpactoLocal;


var WrapperMotorEletrico = (function() {

    var imagens = {
        'botao': 'img/start.png',
    }

    return function(motorEletrico) {

        //throw se não tiver sensor associado?
        WrapperEquipamentoImpactoLocal.call(this, motorEletrico);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' motor-eletrico');
        this.estado = document.createElement('h3');
        var texto = document.createTextNode(POSICOES[motorEletrico.posicao]);
        this.estado.appendChild(texto);

        var imagem = document.createElement("img");
        imagem.setAttribute('src', imagens['botao']);

        this.elemento.appendChild(this.estado);
        this.elemento.appendChild(imagem);
        var that = this;

        motorEletrico.adicionarChangeListener(function(e) {
            that.estado.textContent = POSICOES[motorEletrico.posicao];
        });

        imagem.onclick = function(e) {
            motorEletrico.aplicar();
        };

        this.estado.onclick = function(e) {
            var parent = that.elemento;
            var posicoesSelect = document.createElement('select');

            for (var posicao in POSICOES) {

                var opcao = document.createElement('option');
                opcao.value = posicao;
                var texto = document.createTextNode(POSICOES[posicao]);
                opcao.appendChild(texto);
                posicoesSelect.appendChild(opcao);

            }


            parent.replaceChild(posicoesSelect, that.estado);
            posicoesSelect.focus();


            posicoesSelect.onblur = function(e) {

                motorEletrico.posicao = posicoesSelect.value;
                parent.replaceChild(that.estado, posicoesSelect);

            };

            posicoesSelect.onkeypress = function(event) {
                var enterKeyCode = 13;
                if (event.which == enterKeyCode || event.keyCode == enterKeyCode) {
                    posicoesSelect.blur();
                    return false;
                }
                return true;
            };

        };

    }


})();
WrapperMotorEletrico.prototype = Object.create(WrapperEquipamentoImpactoLocal.prototype);
WrapperMotorEletrico.prototype.constructor = WrapperMotorEletrico;


var WrapperTrincoEletrico = (function() {

    var imagens = {
        'true': 'img/fechoAberto.png',
        'false': 'img/fechoFechado.png'
    };

    return function(trincoEletrico) {

        //throw se não tiver sensor associado?
        WrapperEquipamentoImpactoLocal.call(this, trincoEletrico);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' trinco-eletrico');
        var imagem = document.createElement("img");
        imagem.setAttribute('src', imagens[trincoEletrico.ligado]);

        this.elemento.appendChild(imagem);


        imagem.onclick = function(e) {

            trincoEletrico.commutar();

        }

        trincoEletrico.adicionarChangeListener(function() {

            imagem.setAttribute('src', imagens[trincoEletrico.ligado]);

        });

    }


})();
WrapperTrincoEletrico.prototype = Object.create(WrapperEquipamentoImpactoLocal.prototype);
WrapperTrincoEletrico.prototype.constructor = WrapperTrincoEletrico;


var WrapperGeradorMovimento = (function() {

    var imagens = {
        'true': 'img/comMovimento.png',
        'false': 'img/semMovimento.png'
    };


    return function(geradorMovimento) {

        //throw se não tiver sensor associado?
        WrapperEquipamentoIdentificado.call(this, geradorMovimento);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' gerador-movimento');

        var imagem = document.createElement("img");
        imagem.setAttribute('src', imagens[geradorMovimento.movimento]);

        this.elemento.appendChild(imagem);

        imagem.onclick = function(e) {
            geradorMovimento.commutar();
        };

        geradorMovimento.adicionarChangeListener(function(e) {

            imagem.setAttribute('src', imagens[geradorMovimento.movimento]);

        });


    }

})();
WrapperGeradorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperGeradorMovimento.prototype.constructor = WrapperGeradorMovimento;


var WrapperArCondicionado = (function() {

    var imagens = {
        'arcondicionado': 'img/arCondicionado.png'
    }

    return function(arCondicionado) {

        //todo: testar se é arcondicionado

        WrapperEquipamentoIdentificado.call(this, arCondicionado);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' ar-condicionado');

        this.temperatura = document.createElement('h3');
        this.temperatura.textContent = arCondicionado.temperatura + 'ºC';
        this.elemento.appendChild(this.temperatura);


        var imagem = document.createElement("img");
        imagem.setAttribute('src', imagens['arcondicionado']);
        this.elemento.appendChild(imagem);

        imagem.onclick = function(e) {
            arCondicionado.acionar();
        }

        var that = this;
        this.temperatura.onclick = function(e) {

            //todo transformar em input text
            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('value', arCondicionado.temperatura);

            that.elemento.replaceChild(input, that.temperatura);

            input.onblur = function(e) {

                arCondicionado.temperatura = input.value;
                that.elemento.replaceChild(that.temperatura, input);

            };

            input.onkeypress = function(event) {
                var enterKeyCode = 13;
                if (event.which == enterKeyCode || event.keyCode == enterKeyCode) {
                    input.blur();
                    return false;
                }
                return true;
            };


        }

        arCondicionado.adicionarChangeListener(function(e) {
            that.temperatura.textContent = arCondicionado.temperatura + 'ºC';
        });

    }

})();
WrapperArCondicionado.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperArCondicionado.prototype.constructor = WrapperArCondicionado;


var WrapperTermometro = (function() {

    var imagens = {
        'termometro': 'img/termometro.png'
    }

    return function(termometro) {

        //todo: testar se é arcondicionado

        WrapperEquipamentoIdentificado.call(this, termometro);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' termometro');

        this.temperatura = document.createElement('h3');
        this.temperatura.textContent = termometro.temperatura + 'ºC';
        this.elemento.appendChild(this.temperatura);

        var imagem = document.createElement("img");
        imagem.setAttribute('src', imagens['termometro']);
        this.elemento.appendChild(imagem);

        var that = this;

        termometro.adicionarChangeListener(function(e) {

            that.temperatura.textContent = termometro.temperatura + 'ºC';

        });

    }

})();
WrapperTermometro.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperTermometro.prototype.constructor = WrapperTermometro;


var WrapperDetetorFecho = (function() {

    var imagens = {
        'true': 'img/portaAberta.png',
        'false': 'img/portaFechada.png'
    }

    return function(detetorFecho) {

        //todo: testar se é arcondicionado

        WrapperEquipamentoIdentificado.call(this, detetorFecho);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-fecho');
        var imagem = document.createElement("img");
        imagem.setAttribute('src', imagens[detetorFecho.ligado]);
        this.elemento.appendChild(imagem);

        detetorFecho.adicionarChangeListener(function(e) {
            imagem.setAttribute('src', imagens[detetorFecho.ligado]);
        });


    }

})();
WrapperDetetorFecho.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorFecho.prototype.constructor = WrapperDetetorFecho;


var WrapperDetetorMovimento = (function() {

    var imagens = {
        'true': 'img/movimentoOn.png',
        'false': 'img/movimentoOff.png'
    }

    return function(detetorMovimento) {

        WrapperEquipamentoIdentificado.call(this, detetorMovimento);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-movimento');
        var imagem = document.createElement("img");
        imagem.setAttribute('src', imagens[detetorMovimento.acionado]);
        this.elemento.appendChild(imagem);

        detetorMovimento.adicionarChangeListener(function(e) {
            imagem.setAttribute('src', imagens[detetorMovimento.acionado]);
        });


    }

})();
WrapperDetetorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorMovimento.prototype.constructor = WrapperDetetorMovimento;


var WrapperDetetorPosicaoEstore = (function() {

    var imagens = {
        'ABERTO': 'img/aberto.png',
        'UM_TERCO': 'img/umTerco.png',
        'MEIO_ABERTO': 'img/meioAberto.png',
        'A_DOIS_TERCOS': 'img/doisTercos.png',
        'FECHADO': 'img/fechado.png'
    }

    return function(detetorPosicaoEstore) {

        WrapperEquipamentoIdentificado.call(this, detetorPosicaoEstore);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-posicao-estor');
        var imagem = document.createElement("img");

        imagem.setAttribute('src', imagens[detetorPosicaoEstore.posicao]);
        this.elemento.appendChild(imagem);

        detetorPosicaoEstore.adicionarChangeListener(function(e) {
            imagem.setAttribute('src', imagens[detetorPosicaoEstore.posicao]);
        });

    }

})();
WrapperDetetorPosicaoEstore.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorPosicaoEstore.prototype.constructor = WrapperDetetorPosicaoEstore;



var wrapMap = new Map();
wrapMap.set(MotorEletrico, WrapperMotorEletrico);
wrapMap.set(TrincoEletrico, WrapperTrincoEletrico);
wrapMap.set(GeradorMovimento, WrapperGeradorMovimento);
wrapMap.set(ArCondicionado, WrapperArCondicionado);
wrapMap.set(Termometro, WrapperTermometro);
wrapMap.set(DetetorFecho, WrapperDetetorFecho);
wrapMap.set(DetetorMovimento, WrapperDetetorMovimento);
wrapMap.set(DetetorPosicaoEstore, WrapperDetetorPosicaoEstore);

function wrapEquipamento(equipamento) {

    for (var [key, value] of wrapMap) {
        if (equipamento instanceof key) {
            return new value(equipamento);
        }
    }

}

