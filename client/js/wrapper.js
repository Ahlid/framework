var WrapperEquipamento = (function() {
        return function(equipamento) {
            this.equipamento = equipamento;
            this.elemento = document.createElement('div');
            this.elemento.setAttribute('class', 'wrapper-equipamento');
        }
    }

)();

var WrapperEquipamentoIdentificado = (function() {
        
    var svgNS = 'http://www.w3.org/2000/svg';
    
    return function(equipamento, tipoEquipamento, svgIconData) {
        
        WrapperEquipamento.call(this, equipamento);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' equipamento-identificado');
        
        var icon = document.createElementNS(svgNS ,'svg');
        this.icon = icon;
        icon.setAttributeNS(null, 'class','wrapper-icon-svg');
        icon.setAttributeNS(null, 'preserveAspectRatio','xMidYMid');
        icon.setAttributeNS(null, 'width','100px');
        icon.setAttributeNS(null, 'height','100px');
        icon.setAttributeNS(null, 'viewBox','0 0 60 60');
        
        var path = document.createElementNS(svgNS ,'path');
        this.path = path;
        this.path.setAttributeNS(null,'class','wrapper-icon-svg-path-idle');
        this.path.setAttributeNS(null,'d',svgIconData);
        icon.appendChild(this.path);
        this.elemento.appendChild(icon);
        
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
    
        return function(equipamentoImpactoLocal,tipoEquipamento,svgIconData) {
            
            WrapperEquipamentoIdentificado.call(this,equipamentoImpactoLocal,tipoEquipamento,svgIconData);
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
WrapperEquipamentoImpactoLocal.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperEquipamentoImpactoLocal.prototype.constructor = WrapperEquipamentoImpactoLocal;


var WrapperMotorEletrico = (function() {
    var pathClasses = {
        'idle': 'wrapper-icon-svg-path-idle',
        'hover': 'wrapper-icon-svg-path-hover'
    };
    
    var svgIconData = "M8.000,29.000 L8.000,19.000 C8.000,17.343 9.343,16.000 11.000,16.000 L17.000,16.000 L16.857,47.000 L11.000,47.000 C9.343,47.000 8.000,45.657 8.000,44.000 L8.000,34.000 L2.000,34.000 L2.000,29.000 L8.000,29.000 ZM49.286,47.000 L53.000,47.000 C54.657,47.000 56.000,45.657 56.000,44.000 L56.000,19.000 C56.000,17.343 54.657,16.000 53.000,16.000 L49.143,16.000 L49.286,47.000 ZM47.143,47.000 L19.000,47.000 L19.000,16.000 L47.286,16.000 L47.143,47.000 ZM30.000,22.000 L27.000,34.000 L32.000,34.000 L31.000,41.000 L39.000,29.000 L33.000,29.000 L36.000,22.000 L30.000,22.000 Z";
    
    return function(motorEletrico) {
        //throw se não tiver sensor associado?
        WrapperEquipamentoImpactoLocal.call(this, motorEletrico, 'Motor-Eletrico', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' motor-eletrico');
        
        var texto = document.createTextNode(POSICOES[motorEletrico.posicao]);
        this.estado = document.createElement('h3');
        this.estado.appendChild(texto);
        
        this.elemento.appendChild(this.estado);
        
        var path = this.path;
        this.icon.addEventListener('mouseover',function(e){
            if(!motorEletrico.ligado)
                path.setAttributeNS(null,'class', pathClasses['hover']);
        });
        
        this.icon.addEventListener('mouseout',function(e){
            path.setAttributeNS(null,'class', pathClasses['idle']);
        });

        var that = this;
        motorEletrico.adicionarChangeListener(function(e) {
            that.estado.textContent = POSICOES[motorEletrico.posicao];
        });
        
        this.icon.onclick = function(e) {
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
    var pathClasses = {
        'true': 'wrapper-icon-svg-path-working',
        'false': 'wrapper-icon-svg-path-idle',
        'hover': 'wrapper-icon-svg-path-hover'
    };

    var svgIconData = "M22.000,40.000 L31.000,40.000 C31.000,40.000 29.583,29.167 41.000,31.000 C41.000,31.000 44.583,33.667 40.000,36.000 C40.000,36.000 36.167,35.917 36.000,38.000 L36.000,40.000 L39.000,40.000 C39.000,40.000 39.561,47.007 36.000,47.000 C36.000,47.000 36.417,52.917 34.000,53.000 L27.000,53.000 C27.000,53.000 24.000,53.917 25.000,47.000 C25.000,47.000 22.167,47.083 22.000,44.000 L22.000,40.000 ZM30.000,37.000 L24.000,37.000 C24.000,37.000 23.167,34.083 20.000,33.000 C20.000,33.000 16.167,30.583 21.000,29.000 L35.000,24.000 C35.000,24.000 40.500,21.083 42.000,24.000 C42.000,24.000 41.667,26.250 36.000,28.000 C36.000,28.000 26.833,30.417 27.000,32.000 C27.000,32.000 31.583,35.167 30.000,37.000 ZM23.000,25.000 L39.000,19.000 C39.000,19.000 42.417,17.333 41.000,15.000 C41.000,15.000 40.750,12.417 36.000,14.000 L21.000,20.000 C21.000,20.000 16.500,21.250 19.000,24.000 C19.000,24.000 19.917,25.667 23.000,25.000 ZM20.000,11.000 L31.000,7.000 C31.000,7.000 34.083,5.333 35.000,8.000 C35.000,8.000 35.833,9.750 33.000,11.000 L23.000,15.000 C23.000,15.000 19.750,16.000 19.000,14.000 C19.000,14.000 18.000,12.083 20.000,11.000 Z";
    
    return function(trincoEletrico) {
        //throw se não tiver sensor associado?
        WrapperEquipamentoImpactoLocal.call(this, trincoEletrico, 'Trinco-Eletrico', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' trinco-eletrico');
        
        var path = this.path;
        
        this.icon.addEventListener('mouseover',function(e){
            if(!trincoEletrico.ligado)
                path.setAttributeNS(null,'class', pathClasses['hover']);
        });
        
        this.icon.addEventListener('mouseout',function(e){
            path.setAttributeNS(null,'class', pathClasses[trincoEletrico.ligado]);
        });
        
        this.icon.onclick = function(e) {
            trincoEletrico.commutar();
        }
        
        trincoEletrico.adicionarChangeListener(function(e) {
            path.setAttributeNS(null,'class', pathClasses[trincoEletrico.ligado]);
        });
    }
})();
WrapperTrincoEletrico.prototype = Object.create(WrapperEquipamentoImpactoLocal.prototype);
WrapperTrincoEletrico.prototype.constructor = WrapperTrincoEletrico;

var WrapperGeradorMovimento = (function() {
    
    var pathClasses = {
        'true': 'wrapper-icon-svg-path-working',
        'false': 'wrapper-icon-svg-path-idle',
        'hover': 'wrapper-icon-svg-path-hover'
    };
    
    var svgIconData = "M56.000,37.000 C55.571,38.571 54.000,38.000 54.000,38.000 C52.429,37.429 54.000,36.000 54.000,36.000 C60.143,23.429 52.000,16.000 52.000,16.000 L52.000,15.000 C53.286,13.857 54.000,15.000 54.000,15.000 C63.857,25.857 56.000,37.000 56.000,37.000 ZM50.000,34.000 C49.571,35.571 48.000,35.000 48.000,35.000 C46.429,34.429 48.000,33.000 48.000,33.000 C53.000,25.429 47.000,20.000 47.000,20.000 L47.000,19.000 C48.286,17.857 49.000,19.000 49.000,19.000 C56.143,26.000 50.000,34.000 50.000,34.000 ZM42.000,33.000 L37.000,33.000 L35.000,30.000 L31.000,36.000 L37.000,47.000 C37.849,48.528 36.690,49.804 36.000,50.000 C34.981,50.290 34.000,49.000 34.000,49.000 L28.000,38.000 L26.000,42.000 C25.286,45.286 21.000,45.000 21.000,45.000 L18.000,45.000 C14.571,45.000 15.000,43.000 15.000,43.000 C14.714,40.714 18.000,41.000 18.000,41.000 L21.000,41.000 C24.286,37.571 25.000,34.000 25.000,34.000 L29.000,28.000 L24.000,28.000 L22.000,31.000 C20.286,32.714 19.000,31.000 19.000,31.000 C18.429,29.429 20.000,28.000 20.000,28.000 L23.000,24.000 L31.000,24.000 L32.000,23.000 C30.286,21.429 32.000,19.000 32.000,19.000 C34.714,16.286 37.000,19.000 37.000,19.000 C39.429,22.429 36.000,24.000 36.000,24.000 L35.000,25.000 L39.000,30.000 L42.000,30.000 C44.714,30.000 44.000,32.000 44.000,32.000 C43.714,33.429 42.000,33.000 42.000,33.000 ZM11.995,33.819 C11.995,33.819 13.574,35.272 11.995,35.853 C11.995,35.853 10.415,36.434 9.984,34.836 C9.984,34.836 3.809,26.698 10.990,19.577 C10.990,19.577 11.708,18.415 13.000,19.577 L13.000,20.595 C13.000,20.595 6.969,26.117 11.995,33.819 ZM5.963,36.870 C5.963,36.870 7.543,38.323 5.963,38.905 C5.963,38.905 4.384,39.486 3.953,37.887 C3.953,37.887 -3.945,26.553 5.963,15.509 C5.963,15.509 6.681,14.346 7.974,15.509 L7.974,16.526 C7.974,16.526 -0.212,24.082 5.963,36.870 Z";
    
    return function(geradorMovimento) {
        //throw se não tiver sensor associado?
        WrapperEquipamentoIdentificado.call(this, geradorMovimento, 'Gerador-Movimento', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' gerador-movimento');
       
        var path = this.path;
        
        this.icon.addEventListener('mouseover',function(e){
            if(!geradorMovimento.movimento)
                path.setAttributeNS(null,'class', pathClasses['hover']);
        });
        
        this.icon.addEventListener('mouseout',function(e){
            path.setAttributeNS(null,'class', pathClasses[geradorMovimento.movimento]);
        });
        
        this.icon.onclick = function(e) {
            geradorMovimento.commutar();
        }
        
        geradorMovimento.adicionarChangeListener(function(e) {
            path.setAttributeNS(null,'class', pathClasses[geradorMovimento.movimento]);
        });

    }
})();
WrapperGeradorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperGeradorMovimento.prototype.constructor = WrapperGeradorMovimento;


var WrapperArCondicionado = (function() {
    
    var pathClasses = {
        'idle': 'wrapper-icon-svg-path-idle',
        'hover': 'wrapper-icon-svg-path-hover'
    };
    
    var svgIconData = "M28.000,30.000 C13.143,17.571 8.000,31.000 8.000,31.000 L5.000,29.000 C14.429,12.000 30.000,28.000 30.000,28.000 C43.971,38.960 54.000,27.000 54.000,27.000 L56.000,29.000 C43.097,44.706 28.000,30.000 28.000,30.000 ZM28.000,18.000 C13.143,5.571 8.000,19.000 8.000,19.000 L5.000,17.000 C14.429,-0.000 30.000,16.000 30.000,16.000 C43.971,26.960 54.000,15.000 54.000,15.000 L56.000,17.000 C43.097,32.706 28.000,18.000 28.000,18.000 ZM30.000,40.000 C43.971,50.960 54.000,39.000 54.000,39.000 L56.000,41.000 C43.097,56.706 28.000,42.000 28.000,42.000 C13.143,29.571 8.000,43.000 8.000,43.000 L5.000,41.000 C14.429,24.000 30.000,40.000 30.000,40.000 Z";
    
    return function(arCondicionado) {
        //todo: testar se é arcondicionado
        WrapperEquipamentoIdentificado.call(this, arCondicionado, 'Ar-Condicionado', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' ar-condicionado');
        
        var path = this.path;
        this.icon.addEventListener('mouseover',function(e){
            if(!arCondicionado.movimento)
                path.setAttributeNS(null,'class', pathClasses['hover']);
        });
        
        this.icon.addEventListener('mouseout',function(e){
            path.setAttributeNS(null,'class', pathClasses['idle']);
        });
        
        this.temperatura = document.createElement('h3');
        this.temperatura.textContent = arCondicionado.temperatura + 'ºC';
        this.elemento.appendChild(this.temperatura);

        
        this.icon.onclick = function(e) {
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
        
        var svgIconData = "M40.000,49.000 C39.637,56.111 33.971,58.286 30.000,58.000 C25.042,57.643 21.000,53.971 21.000,49.000 C21.000,43.426 24.413,41.943 24.413,41.943 C24.413,41.943 24.000,11.314 24.000,8.000 C24.000,4.686 26.686,2.000 30.000,2.000 C33.314,2.000 36.000,4.686 36.000,8.000 C36.000,11.314 36.000,42.000 36.000,42.000 C36.000,42.000 40.280,43.514 40.000,49.000 ZM33.000,9.000 C33.000,9.000 32.857,6.000 30.000,6.000 C30.000,6.000 26.857,5.857 27.000,9.000 L27.000,13.000 L30.000,13.000 L30.000,14.000 L27.000,14.000 L27.000,20.000 L30.000,20.000 L30.000,22.000 L27.000,22.000 L27.000,28.000 L30.000,28.000 L30.000,29.000 L27.000,29.000 L27.000,32.000 L33.000,32.000 L33.000,9.000 Z";
        return function(termometro) {
            //todo: testar se é arcondicionado
            WrapperEquipamentoIdentificado.call(this, termometro, 'Termometro', svgIconData);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' termometro');
            
            this.temperatura = document.createElement('h3');
            this.temperatura.textContent = termometro.temperatura + 'ºC';
            this.elemento.appendChild(this.temperatura);
            
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
    
        var pathClasses = {
            'true': 'wrapper-icon-svg-path-working',
            'false': 'wrapper-icon-svg-path-idle'
        };
        
        var svgIconData = "M31.000,57.000 L14.000,48.000 L14.000,6.000 C14.000,6.000 13.750,4.250 17.000,4.000 L43.000,4.000 C43.000,4.000 46.000,3.250 46.000,7.000 L46.000,44.000 C46.000,44.000 46.250,47.250 43.000,48.000 L35.000,48.000 L35.000,44.000 L42.000,44.000 L42.000,7.000 L20.000,7.000 L31.000,13.000 L31.000,57.000 ZM27.000,29.000 L27.000,33.000 L29.000,35.000 L29.000,31.000 L27.000,29.000 Z";
        
        return function(detetorFecho) {
            //todo: testar se é arcondicionado
            WrapperEquipamentoIdentificado.call(this, detetorFecho, 'Detetor-Fecho', svgIconData);
            
            var path = this.path;
            detetorFecho.adicionarChangeListener(function(e) {
                path.setAttributeNS(null,'class', pathClasses[detetorFecho.ligado]);
            });
        }
    }

)();
WrapperDetetorFecho.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorFecho.prototype.constructor = WrapperDetetorFecho;


var WrapperDetetorMovimento = (function() {
        
        var pathClasses = {
            'true': 'wrapper-icon-svg-path-working',
            'false': 'wrapper-icon-svg-path-idle'
        };
        
        var svgIconData = "M22.000,40.000 L31.000,40.000 C31.000,40.000 29.583,29.167 41.000,31.000 C41.000,31.000 44.583,33.667 40.000,36.000 C40.000,36.000 36.167,35.917 36.000,38.000 L36.000,40.000 L39.000,40.000 C39.000,40.000 39.561,47.007 36.000,47.000 C36.000,47.000 36.417,52.917 34.000,53.000 L27.000,53.000 C27.000,53.000 24.000,53.917 25.000,47.000 C25.000,47.000 22.167,47.083 22.000,44.000 L22.000,40.000 ZM30.000,37.000 L24.000,37.000 C24.000,37.000 23.167,34.083 20.000,33.000 C20.000,33.000 16.167,30.583 21.000,29.000 L35.000,24.000 C35.000,24.000 40.500,21.083 42.000,24.000 C42.000,24.000 41.667,26.250 36.000,28.000 C36.000,28.000 26.833,30.417 27.000,32.000 C27.000,32.000 31.583,35.167 30.000,37.000 ZM23.000,25.000 L39.000,19.000 C39.000,19.000 42.417,17.333 41.000,15.000 C41.000,15.000 40.750,12.417 36.000,14.000 L21.000,20.000 C21.000,20.000 16.500,21.250 19.000,24.000 C19.000,24.000 19.917,25.667 23.000,25.000 ZM20.000,11.000 L31.000,7.000 C31.000,7.000 34.083,5.333 35.000,8.000 C35.000,8.000 35.833,9.750 33.000,11.000 L23.000,15.000 C23.000,15.000 19.750,16.000 19.000,14.000 C19.000,14.000 18.000,12.083 20.000,11.000 Z";
        
        return function(detetorMovimento) {
            
            WrapperEquipamentoIdentificado.call(this, detetorMovimento, 'Detetor-Movimento',svgIconData);
            
            var path = this.path;
            detetorMovimento.adicionarChangeListener(function(e) {
                path.setAttributeNS(null,'class', pathClasses[detetorMovimento.acionado]);
            });
        }
    }

)();
WrapperDetetorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorMovimento.prototype.constructor = WrapperDetetorMovimento;


var WrapperDetetorPosicaoEstore = (function() {
        var svgIconData = {
            'ABERTO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM54.000,16.000 L54.000,17.000 L7.000,17.000 L7.000,16.000 L54.000,16.000 ZM56.000,20.000 C56.000,21.105 55.105,22.000 54.000,22.000 L7.000,22.000 C5.895,22.000 5.000,21.105 5.000,20.000 L5.000,18.000 L56.000,18.000 L56.000,20.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
            'UM_TERCO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM54.000,16.000 L54.000,25.000 L7.000,25.000 L7.000,16.000 L54.000,16.000 ZM56.000,28.000 C56.000,29.105 55.105,30.000 54.000,30.000 L7.000,30.000 C5.895,30.000 5.000,29.105 5.000,28.000 L5.000,26.000 L56.000,26.000 L56.000,28.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
            'MEIO_ABERTO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM54.000,16.000 L54.000,35.000 L7.000,35.000 L7.000,16.000 L54.000,16.000 ZM56.000,38.000 C56.000,39.105 55.105,40.000 54.000,40.000 L7.000,40.000 C5.895,40.000 5.000,39.105 5.000,38.000 L5.000,36.000 L56.000,36.000 L56.000,38.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
            'A_DOIS_TERCOS': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM54.000,16.000 L54.000,45.000 L7.000,45.000 L7.000,16.000 L54.000,16.000 ZM56.000,48.000 C56.000,49.105 55.105,50.000 54.000,50.000 L7.000,50.000 C5.895,50.000 5.000,49.105 5.000,48.000 L5.000,46.000 L56.000,46.000 L56.000,48.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
            'FECHADO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM54.000,16.000 L54.000,50.000 L7.000,50.000 L7.000,16.000 L54.000,16.000 ZM56.000,53.000 C56.000,54.105 55.105,55.000 54.000,55.000 L7.000,55.000 C5.895,55.000 5.000,54.105 5.000,53.000 L5.000,51.000 L56.000,51.000 L56.000,53.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z"
        }
        
        
        return function(detetorPosicaoEstore) {
            WrapperEquipamentoIdentificado.call(this, detetorPosicaoEstore, 'Detetor-Estore', svgIconData['ABERTO']);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-posicao-estore');
            
            var path = this.path;
            detetorPosicaoEstore.adicionarChangeListener(function(e) {
                path.setAttributeNS(null,'d', svgIconData[detetorPosicaoEstore.posicao]);
            });
        }
    }

)();
WrapperDetetorPosicaoEstore.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorPosicaoEstore.prototype.constructor = WrapperDetetorPosicaoEstore;



var WrapperDetetorIncendio = (function() {
        var pathClasses = {
            'true': 'wrapper-icon-svg-path-working',
            'false': 'wrapper-icon-svg-path-idle',
            'hover': 'wrapper-icon-svg-path-hover'
        };

        var svgIconData = "M49.585,50.011 L40.607,40.607 C40.607,40.607 44.940,37.427 45.000,30.000 C45.057,22.897 40.961,19.760 40.961,19.760 L50.225,10.636 C55.041,15.665 57.920,22.487 58.000,30.000 C58.143,43.412 49.585,50.011 49.585,50.011 ZM30.000,37.000 C26.134,37.000 23.000,33.866 23.000,30.000 C23.000,26.134 26.134,23.000 30.000,23.000 C33.866,23.000 37.000,26.134 37.000,30.000 C37.000,33.866 33.866,37.000 30.000,37.000 ZM10.779,50.360 C5.373,45.256 2.090,39.593 2.000,30.000 C1.881,17.231 10.273,10.129 10.273,10.129 L19.393,19.393 C19.393,19.393 14.739,22.435 15.000,30.000 C15.257,37.468 19.755,40.956 19.755,40.956 L10.779,50.360 Z";
        
        function beep() {
            var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
            snd.play();
        }
        return function(detetorIncendio) {
            WrapperEquipamentoIdentificado.call(this, detetorIncendio, 'Detetor-Incendio', svgIconData);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-incendio');
            
            var path = this.path;
            
            detetorIncendio.adicionarChangeListener(function(e) {
                
                path.setAttributeNS(null,'class', pathClasses[detetorIncendio.acionado]);
                
                if (detetorIncendio.acionado) {
                    
                    var intervalId = setInterval(function() {
                        
                        if (detetorIncendio.acionado) {
                            beep();
                            beep();
                        } else
                            clearInterval(intervalId);  

                    }, 300);
                    setTimeout(function() {
                        clearInterval(intervalId);
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

        var svgIconData = "M23.000,54.000 C23.000,54.000 9.333,45.500 19.000,29.000 C19.000,29.000 30.417,13.333 24.000,6.000 C24.000,6.000 52.440,17.094 43.000,45.000 C42.308,47.046 38.000,52.000 38.000,52.000 C38.000,52.000 38.917,44.250 34.000,41.000 C34.000,41.000 36.250,43.583 33.000,45.000 C33.000,45.000 29.333,44.167 32.000,41.000 C32.000,41.000 35.917,36.167 30.000,25.000 C30.000,25.000 30.833,31.917 22.000,42.000 C22.000,42.000 18.333,46.250 23.000,54.000 Z";
        
        return function(geradorIncendio) {
            
            WrapperEquipamentoIdentificado.call(this, geradorIncendio, 'Gerador-Incendio', svgIconData);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' gerador-incendio');
           
            var path = this.path;
            this.icon.addEventListener('mouseover',function(e){
                if(!geradorIncendio.temFogo)
                    path.setAttributeNS(null,'class', pathClasses['hover']);
            });
            
            this.icon.addEventListener('mouseout',function(e){
                path.setAttributeNS(null,'class', pathClasses[geradorIncendio.temFogo]);
            });
            
            this.icon.addEventListener('click',function(e){
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
