var WrapperEquipamento = (function() {
        return function(equipamento) {
            this.equipamento = equipamento;
            this.elemento = document.createElement('div');
            this.elemento.setAttribute('class', 'wrapper-equipamento');
        }
    }

)();
var WrapperEquipamentoIdentificado = (function() {
    
        return function(equipamento,tipoEquipamento) {
            
            WrapperEquipamento.call(this, equipamento);
            
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' equipamento-identificado');
            
            if(tipoEquipamento !== void 0) {
                this.tipoEquipamento = document.createElement('h5');
                this.tipoEquipamento.textContent = tipoEquipamento;
                this.elemento.appendChild(this.tipoEquipamento);
            }
            
            this.identificacao = document.createElement('h5');
            this.identificacao.textContent = equipamento.nome;
            this.elemento.appendChild(this.identificacao);
        }
    }

)();
WrapperEquipamentoIdentificado.prototype = Object.create(WrapperEquipamento.prototype);
WrapperEquipamentoIdentificado.prototype.constructor = WrapperEquipamentoIdentificado;
var WrapperEquipamentoImpactoLocal = (function() {
        return function(equipamentoImpactoLocal) {
            WrapperEquipamento.call(this, equipamentoImpactoLocal);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' impacto-local');
            var nomeEquipamento = equipamentoImpactoLocal.nome;
            var nomeSensor = equipamentoImpactoLocal.sensor != void 0 ? equipamentoImpactoLocal.sensor.nome : 'Não definido';
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
                    if (!(equipamento instanceof Sensor)) return false;
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
    }

)();
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
            imagem.setAttribute('class', 'clickable');
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
    }

)();
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
            imagem.setAttribute('class', 'clickable');
            imagem.setAttribute('src', imagens[trincoEletrico.ligado]);
            this.elemento.appendChild(imagem);
            imagem.onclick = function(e) {
                trincoEletrico.commutar();
            }
            trincoEletrico.adicionarChangeListener(function() {
                imagem.setAttribute('src', imagens[trincoEletrico.ligado]);
            });
        }
    }

)();
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
            imagem.setAttribute('class', 'clickable');
            imagem.setAttribute('src', imagens[geradorMovimento.movimento]);
            this.elemento.appendChild(imagem);
            imagem.onclick = function(e) {
                geradorMovimento.commutar();
            };
            geradorMovimento.adicionarChangeListener(function(e) {
                imagem.setAttribute('src', imagens[geradorMovimento.movimento]);
            });
        }
    }

)();
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
            imagem.setAttribute('class', 'clickable');
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
    }

)();
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
    }

)();
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
    }

)();
WrapperDetetorFecho.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorFecho.prototype.constructor = WrapperDetetorFecho;
var WrapperDetetorMovimento = (function() {
        
        var pathClasses = {
            'true': 'wrapper-icon-svg-path-working',
            'false': 'wrapper-icon-svg-path-idle',
            'hover': 'wrapper-icon-svg-path-hover'
        };
        
        var svgNS = 'http://www.w3.org/2000/svg';
        var svgIconData = "M22.000,40.000 L31.000,40.000 C31.000,40.000 29.583,29.167 41.000,31.000 C41.000,31.000 44.583,33.667 40.000,36.000 C40.000,36.000 36.167,35.917 36.000,38.000 L36.000,40.000 L39.000,40.000 C39.000,40.000 39.561,47.007 36.000,47.000 C36.000,47.000 36.417,52.917 34.000,53.000 L27.000,53.000 C27.000,53.000 24.000,53.917 25.000,47.000 C25.000,47.000 22.167,47.083 22.000,44.000 L22.000,40.000 ZM30.000,37.000 L24.000,37.000 C24.000,37.000 23.167,34.083 20.000,33.000 C20.000,33.000 16.167,30.583 21.000,29.000 L35.000,24.000 C35.000,24.000 40.500,21.083 42.000,24.000 C42.000,24.000 41.667,26.250 36.000,28.000 C36.000,28.000 26.833,30.417 27.000,32.000 C27.000,32.000 31.583,35.167 30.000,37.000 ZM23.000,25.000 L39.000,19.000 C39.000,19.000 42.417,17.333 41.000,15.000 C41.000,15.000 40.750,12.417 36.000,14.000 L21.000,20.000 C21.000,20.000 16.500,21.250 19.000,24.000 C19.000,24.000 19.917,25.667 23.000,25.000 ZM20.000,11.000 L31.000,7.000 C31.000,7.000 34.083,5.333 35.000,8.000 C35.000,8.000 35.833,9.750 33.000,11.000 L23.000,15.000 C23.000,15.000 19.750,16.000 19.000,14.000 C19.000,14.000 18.000,12.083 20.000,11.000 Z";
        return function(detetorMovimento) {
            
            WrapperEquipamentoIdentificado.call(this, detetorMovimento, 'Detetor-Movimento');
            
            var icon = document.createElementNS(svgNS ,'svg');
            icon.setAttributeNS(null,'class','wrapper-icon-svg');
            icon.setAttributeNS(null, 'preserveAspectRatio','xMidYMid');
            icon.setAttributeNS(null, 'width','100px');
            icon.setAttributeNS(null, 'height','100px');
            icon.setAttributeNS(null, 'viewBox','0 0 60 60');
            
            var path = document.createElementNS(svgNS ,'path');
            this.path = path;
            this.path.setAttributeNS(null,'class','wrapper-icon-svg-path-idle');
            this.path.setAttributeNS(null,'d',svgIconData);
            icon.appendChild(this.path);
            
            this.elemento.insertBefore(icon, this.elemento.firstChild);
            
            detetorMovimento.adicionarChangeListener(function(e) {
                path.setAttributeNS(null,'class', pathClasses[detetorMovimento.acionado]);
            });
        }
    }

)();
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
    }

)();
WrapperDetetorPosicaoEstore.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorPosicaoEstore.prototype.constructor = WrapperDetetorPosicaoEstore;
var WrapperDetetorIncendio = (function() {
        var imagens = {
            'true': 'img/alarmeFogoOn.jpg',
            'false': 'img/alarmeFogoOff.jpg'
        }

        function beep() {
            var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
            snd.play();
        }
        return function(detetorIncendio) {
            WrapperEquipamentoIdentificado.call(this, detetorIncendio);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-incendio');
            var imagem = document.createElement("img");
            imagem.setAttribute('src', imagens[detetorIncendio.acionado]);
            this.elemento.appendChild(imagem);
            detetorIncendio.adicionarChangeListener(function(e) {
                imagem.setAttribute('src', imagens[detetorIncendio.acionado]);
                if (detetorIncendio.acionado) {
                    var x = setInterval(function() {
                        if (detetorIncendio.acionado) {
                            beep();
                            beep();
                        }else{
                            clearInterval(x);  
                        }

                    }, 300);
                    setTimeout(function() {
                        clearInterval(x)
                    }, 5000);
                }
            });
        }
    }

)();
WrapperDetetorIncendio.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorIncendio.prototype.constructor = WrapperDetetorIncendio;
var WrapperGeradorIncendio = (function() {
        
        var pathClasses = {
            'true': 'wrapper-icon-svg-path-working',
            'false': 'wrapper-icon-svg-path-idle',
            'hover': 'wrapper-icon-svg-path-hover'
        };
        
        var svgNS = 'http://www.w3.org/2000/svg';
        var svgIconData = "M23.000,54.000 C23.000,54.000 9.333,45.500 19.000,29.000 C19.000,29.000 30.417,13.333 24.000,6.000 C24.000,6.000 52.440,17.094 43.000,45.000 C42.308,47.046 38.000,52.000 38.000,52.000 C38.000,52.000 38.917,44.250 34.000,41.000 C34.000,41.000 36.250,43.583 33.000,45.000 C33.000,45.000 29.333,44.167 32.000,41.000 C32.000,41.000 35.917,36.167 30.000,25.000 C30.000,25.000 30.833,31.917 22.000,42.000 C22.000,42.000 18.333,46.250 23.000,54.000 Z";
        
        return function(geradorIncendio) {
            
            WrapperEquipamentoIdentificado.call(this, geradorIncendio, 'Gerador-Incendio');
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' gerador-incendio');
            
            var icon = document.createElementNS(svgNS ,'svg');
            icon.setAttributeNS(null,'class','wrapper-icon-svg');
            icon.setAttributeNS(null, 'preserveAspectRatio','xMidYMid');
            icon.setAttributeNS(null, 'width','100px');
            icon.setAttributeNS(null, 'height','100px');
            icon.setAttributeNS(null, 'viewBox','0 0 60 60');
            
            var path = document.createElementNS(svgNS ,'path');
            this.path = path;
            this.path.setAttributeNS(null,'class','wrapper-icon-svg-path-idle');
            this.path.setAttributeNS(null,'d',svgIconData);
            icon.appendChild(this.path);
            
            this.elemento.insertBefore(icon, this.elemento.firstChild);
            
            this.elemento.addEventListener('mouseover',function(e){
                if(!geradorIncendio.temFogo)
                    path.setAttributeNS(null,'class', pathClasses['hover']);
            });
            
            this.elemento.addEventListener('mouseout',function(e){
                path.setAttributeNS(null,'class', pathClasses[geradorIncendio.temFogo]);
            });
            
            this.elemento.addEventListener('click',function(e){
                geradorIncendio.commutar();
            });
            
            geradorIncendio.adicionarChangeListener(function(e) {
                path.setAttributeNS(null,'class', pathClasses[geradorIncendio.temFogo]);
            });
        }
    }

)();
WrapperGeradorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperGeradorMovimento.prototype.constructor = WrapperGeradorMovimento;
var wrapMap = new Map();
wrapMap.set(MotorEletrico, WrapperMotorEletrico);
wrapMap.set(TrincoEletrico, WrapperTrincoEletrico);
wrapMap.set(GeradorMovimento, WrapperGeradorMovimento);
wrapMap.set(ArCondicionado, WrapperArCondicionado);
wrapMap.set(Termometro, WrapperTermometro);
wrapMap.set(DetetorFecho, WrapperDetetorFecho);
wrapMap.set(DetetorMovimento, WrapperDetetorMovimento);
wrapMap.set(DetetorPosicaoEstore, WrapperDetetorPosicaoEstore);
wrapMap.set(DetetorIncendio, WrapperDetetorIncendio);
wrapMap.set(GeradorIncendio, WrapperGeradorIncendio);

function wrapEquipamento(equipamento) {
    for (var [key, value] of wrapMap) {
        if (equipamento instanceof key) {
            return new value(equipamento);
        }
    }
}
