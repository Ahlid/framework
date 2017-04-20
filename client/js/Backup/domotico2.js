/**
 * Representa um objeto que pode ser alteravel.
 * Esta classe possibilita registar eventos de alteração
 * @constructor
 */
function Alteravel() {
    this.changeHandlers = [];
}

/**
 * Adiciona um handler que irá correr ao ser alterado este objeto
 * @param {Function} listener - irá correr ao ser alterado este objeto.
 */
Alteravel.prototype.adicionarChangeListener = function(listener) {
    this.changeHandlers.push(listener);
}

/**
 * Envia um change event para todos os handlers
 * @param {Object} event - evento que irá ser lançado a todos os handlers registados
 */
Alteravel.prototype.enviarEventoAlterado = function(event) {
    this.changeHandlers.forEach(function(handler) {
        handler(event);
    });
}

/**
 * Representa um sistema domotico
 * @constructor
 * @param {String} nome - O nome do sistema domotico
 */
function Domotico(nome) {

    Alteravel.call(this);
    //TODO: O nome não convem ser vazio
    var aux = nome || "Sistema Domótico";
    this.consolas = [];

    Object.defineProperty(this, 'nome', {

        enumerable: true,
        configurable: false,
        get: function() {
            return aux;
        },
        set: function(newValue) {
            if (newValue && /\S/.test(newValue)) {
                aux = newValue;
                this.enviarEventoAlterado();
            }
        }

    });

}
Domotico.prototype = Object.create(Alteravel.prototype);
Domotico.prototype.constructor = Domotico;

/**
 * Verifica se o objeto tem uma consola com esse nome
 * @param {String} nome - nome que irá ser testado
 */
Domotico.prototype.hasConsola = function(nome) {
    return this.consolas.some(consola => consola.nome == nome);
}

/**
 * Cria uma consola e adiciona a este sistema
 * @param {String} nome - nome da consola
 */
Domotico.prototype.criarConsola = function(nome) {

    var hasNomeConsola = this.consolas.some(consola => consola.nome == nome);

    if (!hasNomeConsola) {

        var consola = new Consola(nome, this);

        this.consolas.push(consola);
        this.enviarEventoAlterado();

    }

}

/**
 * Apaga uma consola do sistema
 * @param {String} nome - nome da consola a apagar
 */
Domotico.prototype.apagarConsola = function(nome) {

    this.consolas.forEach(function(consola, index, array) {

        if (consola.nome == nome)
            array.splice(index, 1);

    });

    this.enviarEventoAlterado();

}

/**
 * Representa uma consola do sistema domotico
 * @constructor
 * @param {String} nome - O nome da consola
 * @param {Domotico} domotico - O sistema domotico
 */
function Consola(nome, domotico) {

    if (nome == void 0)
        throw Error('Nome nao pode ser vazio');

    Alteravel.call(this);

    this.domotico = domotico;
    this.compartimentos = []; //Todo: cuidado com os acessos

    Object.defineProperty(this, 'nome', {

        enumerable: true,
        configurable: false,
        get: function() {
            return nome;
        },
        set: function(newValue) {
            if (newValue && /\S/.test(newValue)) {
                if (domotico !== void 0) {
                    nome = this.domotico.hasConsola(newValue) ? nome : newValue;
                    this.enviarEventoAlterado();
                }
                else {
                    nome = newValue;
                    this.enviarEventoAlterado();
                }
            }

        }

    });

}

Consola.prototype = Object.create(Alteravel.prototype);
Consola.prototype.constructor = Consola;

/**
 * Verifica se a consola tem um determinado compartimento
 * @param {String} nome - O nome da compartimento a testar
 * @returns {Boolean}
 */
Consola.prototype.hasCompartimento = function(nome) {
    return this.compartimentos.some(compartimento =>
        compartimento.nome == nome);
}

/**
 * Cria um compartimento na consola
 * @param {String} nome - O nome da compartimento a criar
 */
Consola.prototype.criarCompartimento = function(nome) {

    var hasNomeCompartimento = this.compartimentos.some(compartimento =>
        compartimento.nome == nome);

    if (!hasNomeCompartimento) {

        var compartimento = new Compartimento(nome, this);
        this.compartimentos.push(compartimento);
        this.enviarEventoAlterado();
    }

}

/**
 * Apaga um compartimento da consola
 * @param {String} nome - O nome da compartimento a apagar
 */
Consola.prototype.apagarCompartimento = function(nome) {
    this.compartimentos.forEach(function(compartimento, index, array) {

        if (compartimento.nome == nome) {
            array.splice(index, 1);
            this.enviarEventoAlterado();
        }

    }.bind(this));

}
Consola.prototype.setSistema = function(domotico) {
    if (domotico !== void 0) {
        this.domotico = domotico;
    }
}


/**
 * 
 * 
 * 
 * 
 * 
 * */
function Compartimento(nome, consola) {
    Alteravel.call(this);
    //Todo: Validações
    this.consola = consola;
    this.equipamentos = []; //Todo: cuidado com os 


    Object.defineProperty(this, 'nome', {

        enumerable: true,
        configurable: false,
        get: function() {
            return nome;
        },
        set: function(newValue) {
            if (newValue && /\S/.test(newValue)) {
                if (consola !== void 0) {
                    nome = this.consola.hasCompartimento(newValue) ? nome : newValue;
                    this.enviarEventoAlterado();
                }
                else {
                    nome = newValue;
                    this.enviarEventoAlterado();
                }
            }



        }

    });

}

Compartimento.prototype = Object.create(Alteravel.prototype);
Compartimento.prototype.constructor = Compartimento;

Compartimento.prototype.adicionarEquipamento = function(equipamento) {

    if (equipamento === void 0)
        return;

    if (this.equipamentos.indexOf(equipamento) == -1) {
        this.equipamentos.push(equipamento);
        this.enviarEventoAlterado();
    }


    if (!equipamento.isChildOf(this))
        equipamento.setCompartimento(this);


}

Compartimento.prototype.removerEquipamento = function(nome) {
    
    
var equipamento=this.getEquipamento(nome);
    if (equipamento === void 0)
        return;
    
    if (equipamento.compartimento === this)
        equipamento.removerCompartimento();

    var index = this.equipamentos.indexOf(equipamento);

    if (index != -1) {
        this.equipamentos.splice(index, 1);
        this.enviarEventoAlterado();
    }


}

Compartimento.prototype.getEquipamento=function(nome){
        var eq;
        this.equipamentos.forEach(function(equipamento){
            
            if(equipamento.nome == nome ){
                eq= equipamento;
            }
        });
        
        return eq;
    }
/**
 * 
 * 
 * 
 * 
 * 
 * */
var Equipamento = (function() {

    return function(nome, compartimento) {

        //Todo: Validações
        this.nome = nome;

        this.compartimento = compartimento; //Todo: cuidado com os acessos
        Alteravel.call(this);

    }

})();

Equipamento.prototype = Object.create(Alteravel.prototype);
Equipamento.prototype.constructor = Equipamento;



Equipamento.prototype.setCompartimento = function(compartimento) {


    if (compartimento === void 0)
        return;

    if (this.compartimento && (this.compartimento !== compartimento)) {
        //remoção
        this.compartimento.removerEquipamento(this);
    }

    this.compartimento = compartimento;
    this.enviarEventoAlterado();
    this.compartimento.adicionarEquipamento(this);

}

Equipamento.prototype.isChildOf = function(compartimento) {

    return this.compartimento === compartimento;

}

Equipamento.prototype.removerCompartimento = function() {

    if (this.compartimento !== void 0) {

        var compartimento = this.compartimento;
        this.compartimento = void 0;
        this.enviarEventoAlterado();
        compartimento.removerEquipamento(this);

    }

}



var POSICOES = {

    'ABERTO': 'Aberto',
    'UM_TERCO': 'A um terço',
    'MEIO_ABERTO': 'Meio aberto',
    'A_DOIS_TERCOS': 'A dois terços',
    'FECHADO': 'Fechado'

};



function Sensor(nome, compartimento) {

    Equipamento.call(this, nome, compartimento);

}

Sensor.prototype = Object.create(Equipamento.prototype);
Sensor.prototype.constructor = Sensor;


/**
 * 
 * 
 * 
 * 
 * 
 * */
var Termometro = (function() {

    var ultimoId = 0;
    var sigla = "TM"

    return function(compartimento) {

        var nome = sigla + (++ultimoId);

        Sensor.call(this, nome, compartimento);

        var maxTemperature = 55;
        var minTemperature = -55;
        var temperatura = temperatura || 25;

        Object.defineProperty(this, 'temperatura', {

            enumerable: true,
            configurable: false,
            get: function() {
                return temperatura;
            },
            set: function(newValue) {

                if (minTemperature < newValue && newValue < maxTemperature) {
                    temperatura = newValue;
                    this.enviarEventoAlterado();
                }

            }

        });



    };

})();

Termometro.prototype = Object.create(Sensor.prototype);
Termometro.prototype.constructor = Termometro;


/**
 *
 * 
 * 
 * 
 * 
 * */
var DetetorMovimento = (function() {

    var ultimoId = 0;
    var sigla = "DM";

    return function(compartimento) {

        this.acionado = false;
        var nome = sigla + (++ultimoId);
        Sensor.call(this, nome, compartimento);

    };

})();

DetetorMovimento.prototype = Object.create(Sensor.prototype);
DetetorMovimento.prototype.constructor = DetetorMovimento;

DetetorMovimento.prototype.acionar = function() {

    this.acionado = true;
    this.enviarEventoAlterado();

}
DetetorMovimento.prototype.desligar = function() {

    this.acionado = false;
    this.enviarEventoAlterado();

}

/**
 * 
 * 
 * 
 * 
 * 
 * */
var DetetorFecho = (function() {

    var ultimoId = 0;
    var sigla = "DF";

    return function(compartimento) {

        var nome = sigla + (++ultimoId);
        this.ligado = false;
        Sensor.call(this, nome, compartimento);

    };

})();

DetetorFecho.prototype = Object.create(Sensor.prototype);
DetetorFecho.prototype.constructor = DetetorFecho;

DetetorFecho.prototype.setEstado = function(ligado) {

    this.ligado = ligado;
    this.enviarEventoAlterado();

}


/**
 * 
 * 
 * 
 * 
 * 
 * */
var DetetorPosicaoEstore = (function() {

    var ultimoId = 0;
    var sigla = "EE";

    return function(compartimento) {

        var nome = sigla + (++ultimoId);
        var posicao = POSICOES.hasOwnProperty('ABERTO') ? 'ABERTO' : Object.keys(POSICOES)[0];

        Object.defineProperty(this, 'posicao', {

            enumerable: true,
            configurable: false,
            get: function() {
                return posicao;
            },
            set: function(newValue) {

                if (POSICOES.hasOwnProperty(newValue)) {
                    posicao = newValue;
                    this.enviarEventoAlterado();

                }

            }

        });


        Sensor.call(this, nome, compartimento);

    };

})();

DetetorPosicaoEstore.prototype = Object.create(Sensor.prototype);
DetetorPosicaoEstore.prototype.constructor = DetetorPosicaoEstore;




/**
 *
 * 
 * 
 * 
 * 
 * */
var DetetorIncendio = (function() {

    var ultimoId = 0;
    var sigla = "DI";

    return function(compartimento) {

        this.acionado = false;
        var nome = sigla + (++ultimoId);
        Sensor.call(this, nome, compartimento);

    };

})();

DetetorIncendio.prototype = Object.create(Sensor.prototype);
DetetorIncendio.prototype.constructor = DetetorIncendio;

DetetorIncendio.prototype.acionar = function() {

    this.acionado = true;
    this.enviarEventoAlterado();

}
DetetorIncendio.prototype.desligar = function() {

    this.acionado = false;
    this.enviarEventoAlterado();

}

/**
 * 
 * 
 * 
 * 
 * 
 * */
function Atuador(sigla, compartimento) {

    Equipamento.call(this, sigla, compartimento);

}

Atuador.prototype = Object.create(Equipamento.prototype);
Atuador.prototype.constructor = Atuador;

/**
 * 
 * 
 * 
 * 
 * 
 * */
function EquipamentoImpactoGeral(nome, compartimento) {

    Atuador.call(this, nome, compartimento);

}

EquipamentoImpactoGeral.prototype = Object.create(Atuador.prototype);
EquipamentoImpactoGeral.prototype.constructor = EquipamentoImpactoGeral;
/**
 * 
 * 
 * 
 * 
 * 
 * */
function EquipamentoImpactoLocal(sigla, sensoresValidos, compartimento, sensor) {

    //todo: Lançar exceção quando o nome e ou o sensoresValidos são undefined

    Atuador.call(this, sigla, compartimento);

    this.sensoresValidos = sensoresValidos; //todo:restriçoes
    this.sensor = this.sensoresValidos.some(classeSensor => sensor instanceof classeSensor) ? sensor : void 0; //todo:restriçoes

}
EquipamentoImpactoLocal.prototype = Object.create(Atuador.prototype);
EquipamentoImpactoLocal.prototype.constructor = EquipamentoImpactoLocal;

EquipamentoImpactoLocal.prototype.setSensor = function(sensor) {

    if (this.compartimento != void 0) {

        var equipamentosCompartimento = this.compartimento.equipamentos;

        var isValido = this.sensoresValidos.some(element => sensor instanceof element);

        if (isValido) {
            if (equipamentosCompartimento.indexOf(sensor) != -1)
                this.sensor = sensor;
        }
    }

}
EquipamentoImpactoLocal.prototype.removerSensor = function() {
    this.sensor = void 0;
}
EquipamentoImpactoLocal.prototype.isSensorValido = function(sensor) {
    return this.sensoresValidos.some(classeSensor => sensor instanceof classeSensor);
}


/*
 * 
 * 
 * 
 * 
 * 
 * */
var ArCondicionado = (function() {

    var ultimoId = 0;
    var sigla = 'AC';

    return function(compartimento, temperatura) {

        var nome = sigla + (++ultimoId);
        EquipamentoImpactoGeral.call(this, nome, compartimento);

        var maxTemperature = 55;
        var minTemperature = -55;
        var temperatura = temperatura || 25;

        Object.defineProperty(this, 'temperatura', {

            enumerable: true,
            configurable: false,
            get: function() {
                return temperatura;
            },
            set: function(newValue) {

                if (minTemperature < newValue && newValue < maxTemperature) {
                    temperatura = newValue;
                    this.enviarEventoAlterado();
                }


            }

        });

    };

}());

ArCondicionado.prototype = Object.create(EquipamentoImpactoGeral.prototype);
ArCondicionado.prototype.constructor = ArCondicionado;
ArCondicionado.prototype.acionar = function() {

    if (this.compartimento != void 0) {

        var equipamentosCompartimento = this.compartimento.equipamentos;

        equipamentosCompartimento.filter(function(equipamento) {
            return equipamento instanceof Termometro;
        }).forEach(function(equipamento) {
            equipamento.temperatura = this.temperatura;
        }, this);

    }
}

/**
 * 
 * 
 * 
 * 
 * 
 * */
var GeradorMovimento = (function() {

    var ultimoId = 0;
    var movimento = false;
    var sigla = 'GM';

    return function(compartimento) {

        this.movimento = movimento;
        var nome = sigla + (++ultimoId);
        EquipamentoImpactoGeral.call(this, nome, compartimento);

    };

})();

GeradorMovimento.prototype = Object.create(EquipamentoImpactoGeral.prototype);
GeradorMovimento.prototype.constructor = GeradorMovimento;
GeradorMovimento.prototype.commutar = function() {

    if (this.movimento)
        this.pararMovimento();
    else
        this.gerarMovimento();

}
GeradorMovimento.prototype.gerarMovimento = function() {

    if (this.movimento)
        return;

    if (this.compartimento != void 0) {

        this.movimento = true; // o gerador fica em moviemento
        this.enviarEventoAlterado();
        var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos do compartimento
        equipamentosCompartimento.filter(function(equipamento) {
            return (equipamento instanceof DetetorMovimento);
        }).forEach(function(equipamento) { //por cada equipamento se for um Detetor de movimento devemos aciona-lo
            equipamento.acionar();
        });


    }
}
GeradorMovimento.prototype.pararMovimento = function() {

        if (!this.movimento)
            return;

        if (this.compartimento != void 0) { //se tiver em algum compartimento

            this.movimento = false; //o gerador deixa de gerar movimento
            this.enviarEventoAlterado();
            var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos
            //todo:verificar o codigo repetido
            //vamos agora verificar se algum gerador ainda está em movimento
            var existeMovimento = equipamentosCompartimento.some(equipamento =>
                (equipamento instanceof GeradorMovimento) && equipamento.movimento);



            equipamentosCompartimento.filter(function(equipamento) {
                return (equipamento instanceof DetetorMovimento);
            }).forEach(function(equipamento) { //por cada equipamento se for um Detetor de movimento devemos aciona-lo

                if (existeMovimento)
                    equipamento.acionar();
                else
                    equipamento.desligar();
            });



        }

    }
    /**
     * 
     * 
     * 
     * 
     * 
     * */
var TrincoEletrico = (function() {

    var sensoresValidos = [DetetorFecho];
    var ultimoId = 0;
    var sigla = 'TE';

    return function(compartimento, sensor) {

        var nome = sigla + (++ultimoId);
        this.ligado = false;

        EquipamentoImpactoLocal.call(this, nome, sensoresValidos, compartimento, sensor);

    };

})();
TrincoEletrico.prototype = Object.create(EquipamentoImpactoLocal.prototype);
TrincoEletrico.prototype.constructor = TrincoEletrico;
TrincoEletrico.prototype.commutar = function() {

    this.ligado = !this.ligado;
    this.enviarEventoAlterado();
    this.sensor.setEstado(this.ligado);

}



/**
 * 
 * 
 * 
 * 
 * 
 * */



var MotorEletrico = (function() {

    var listaSensores = [DetetorPosicaoEstore];
    var ultimoId = 0;
    var sigla = 'ME';

    return function(compartimento, sensor) {

        var nome = sigla + (++ultimoId);

        var posicao = POSICOES.hasOwnProperty('ABERTO') ? 'ABERTO' : Object.keys(POSICOES)[0];
        EquipamentoImpactoLocal.call(this, nome, listaSensores, compartimento, sensor);

        Object.defineProperty(this, 'posicao', {

            enumerable: true,
            configurable: false,
            get: function() {
                return posicao;
            },
            set: function(newValue) {
                if (POSICOES.hasOwnProperty(newValue)) {
                    posicao = newValue;
                    this.enviarEventoAlterado();

                }

            }

        });


    };

})();

MotorEletrico.prototype = Object.create(EquipamentoImpactoLocal.prototype);
MotorEletrico.prototype.constructor = MotorEletrico;
MotorEletrico.prototype.aplicar = function() {
    if(this.compartimento!= void 0){
    this.sensor.posicao = this.posicao;
    }
}




/**
 * 
 * 
 * 
 * 
 * 
 * */
var GeradorIncendio = (function() {

    var ultimoId = 0;
    var temFogo = false;
    var sigla = 'GI';

    return function(compartimento) {

        this.temFogo = temFogo;
        var nome = sigla + (++ultimoId);
        EquipamentoImpactoGeral.call(this, nome, compartimento);

    };

})();

GeradorIncendio.prototype = Object.create(EquipamentoImpactoGeral.prototype);
GeradorIncendio.prototype.constructor = GeradorIncendio;
GeradorIncendio.prototype.commutar = function() {

    if (this.temFogo)
        this.pararFogo();
    else
        this.gerarFogo();

}
GeradorIncendio.prototype.gerarFogo = function() {

    if (this.temFogo)
        return;

    if (this.compartimento != void 0) {

        this.temFogo = true; // o gerador fica em moviemento
        this.enviarEventoAlterado();
        var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos do compartimento
        
        equipamentosCompartimento.filter(function(equipamento) {
            return (equipamento instanceof DetetorIncendio);
        }).forEach(function(equipamento) { //por cada equipamento se for um Detetor de movimento devemos aciona-lo
            equipamento.acionar();
        });


    }
}
GeradorIncendio.prototype.pararFogo = function() {

        if (!this.temFogo)
            return;

        if (this.compartimento != void 0) { //se tiver em algum compartimento

            this.temFogo = false; //o gerador deixa de gerar movimento
            this.enviarEventoAlterado();
            var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos
            //todo:verificar o codigo repetido
            //vamos agora verificar se algum gerador ainda está em movimento
            var existeFogo = equipamentosCompartimento.some(equipamento =>
                (equipamento instanceof GeradorIncendio) && equipamento.temFogo);



            equipamentosCompartimento.filter(function(equipamento) {
                return (equipamento instanceof DetetorIncendio);
            }).forEach(function(equipamento) { //por cada equipamento se for um Detetor de movimento devemos aciona-lo

                if (existeFogo)
                    equipamento.acionar();
                else
                    equipamento.desligar();
            });



        }

    }
    
    var WrapperEquipamento = (function() {
        return function(equipamento) {
            this.equipamento = equipamento;
            this.elemento = document.createElement('div');
            this.elemento.setAttribute('class', 'wrapper-equipamento');
        }
    }

)();
var WrapperEquipamentoIdentificado = (function() {
        return function(equipamento) {
            WrapperEquipamento.call(this, equipamento);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' equipamento-identificado');
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
                        clearInterval(x);  
                    }, 5000);
                }
            });
        }
    }

)();
WrapperDetetorIncendio.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorIncendio.prototype.constructor = WrapperDetetorIncendio;
var WrapperGeradorIncendio = (function() {
        var imagens = {
            'true': 'img/fireOn.jpg',
            'false': 'img/fireOff.jpg'
        };
        return function(geradorIncendio) {
            WrapperEquipamentoIdentificado.call(this, geradorIncendio);
            this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' gerador-incendio');
            var imagem = document.createElement("img");
            imagem.setAttribute('class', 'clickable');
            imagem.setAttribute('src', imagens[geradorIncendio.temFogo]);
            this.elemento.appendChild(imagem);
            imagem.onclick = function(e) {
                geradorIncendio.commutar();
            };
            geradorIncendio.adicionarChangeListener(function(e) {
                imagem.setAttribute('src', imagens[geradorIncendio.temFogo]);
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
/**
 * Painel genérico, incluí a user interface que é partilhada por todos os paineis
 * @constructor
 */
var Painel = function() {
    //cria as li  dos ul do objecto
    this.criarLi = function(ul, array, callback) {

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        array.forEach(function(elemento) {
            var consolaSpan = document.createElement('span');

            consolaSpan.textContent = elemento.nome;
           
            consolaSpan.setAttribute('class','clickable');
            consolaSpan.onclick = function(e) {

                if (callback !== void 0)
                    callback(elemento);

            }

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "checkRemove";
            checkbox.value = elemento.nome;

            var li = document.createElement("li");
            li.appendChild(checkbox);
            li.appendChild(consolaSpan)
            ul.appendChild(li);

        });

    }

    //criar o elemento do painel
    this.elemento = document.createElement('div');

    //nome do Sistema
    this.nome = document.createElement('h2');
    this.nome.setAttribute('class', 'title');

    //titulo antes do ul
    this.subNome = document.createElement('h4');
    this.subNome.setAttribute('class', 'subTitle');
    
    //a ul que guarda al li's com os elementos do array do objecto
    this.ul = document.createElement('ul');

    //botao criar
    this.criar = document.createElement("button");
    this.criar.textContent = "Criar";

    //botao de remover
    this.remover = document.createElement("button");
    this.remover.textContent = "Remover";

    //botao de remover
    this.selectAll = document.createElement("button");
    this.selectAll.textContent = "Selecionar tudo";

    this.elemento.appendChild(this.nome);
    this.elemento.appendChild(this.subNome);
    this.elemento.appendChild(this.ul);
    this.elemento.appendChild(document.createElement("br"));
    this.elemento.appendChild(this.criar);
    this.elemento.appendChild(this.remover);
    this.elemento.appendChild(this.selectAll);

}
Painel.prototype.aplicar = function() {
    //obtemos o DOM
    var divSistema = document.getElementById('sistema');
    //retiramos os filhos da bosta
    while (divSistema.firstChild) {
        divSistema.removeChild(divSistema.firstChild);
    }
    //metos o nosso lindo elemento
    divSistema.appendChild(this.elemento);

}


/**
 * Painel que faz a gestão da aplicação domotica
 * @constructor
 * @param {Domotico} domotico - O sistema domótico que irá ser gerido pelo painel
 */
var PainelDomotico = function(domotico) {

    Painel.call(this);

    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', 'domotico');

    //meter o nome do painel
    this.nome.textContent = domotico.nome;

    //titulo antes do ul
    this.subNome.textContent = "Consolas:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');
        input.value=this.nome.textContent;
        parent.replaceChild(input, this.nome);
        input.focus();

        input.onblur = function(e) {

            domotico.nome = input.value;

            parent.replaceChild(this.nome, input);
        }.bind(this);

        input.onkeypress = function(event) {
            var enterKeyCode = 13;
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                input.blur();
                return false;
            }
            return true;
        }.bind(this);


    }.bind(this);

    //vamos agora criar os filhos que sao as consolas
    var consolas = domotico.consolas;
    this.criarLi(this.ul, consolas, function(consola) {
        var painelConsola = new PainelConsola(consola);
        painelConsola.aplicar();


    });

    //botao de criar
    this.criar.onclick = function(e) {
        domotico.criarConsola(prompt("Insira nome da consola"));
    }

    //botao de remover
    this.remover.onclick = function(e) {

        var checkboxes = document.getElementsByName('checkRemove');
        var nomes = [];


        for (var i = 0; i < checkboxes.length; i++) {

            if (checkboxes[i].checked == true)
                nomes.push(checkboxes[i].value);

        }

        nomes.forEach(nome => domotico.apagarConsola(nome));

    }

    //botao de remover
    this.selectAll.onclick = function(e) {

        var checkBoxes = document.getElementsByName('checkRemove');
        var nomes = [];

        for (var i = 0; i < checkBoxes.length; i++)
            checkBoxes[i].checked = true;


    }

    //listener de mudancas
    domotico.adicionarChangeListener(function() {
        this.nome.textContent = domotico.nome;
        var consolas = domotico.consolas;
        this.criarLi(this.ul, consolas, function(consola) {
            var painelConsola = new PainelConsola(consola);
            painelConsola.aplicar();


        });
    }.bind(this));

}

PainelDomotico.prototype = Object.create(Painel.prototype);
PainelDomotico.prototype.constructor = PainelDomotico;


/**
 * Painel que faz a gestão de um consola
 * @constructor
 * @param {Consola} consola - A consola que irá ser gerida pelo painel
 */
var PainelConsola = function(consola) {

    Painel.call(this);

    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', 'consola');

    //meter o nome do painel
    this.nome.textContent = consola.nome||"Sistema Domotico";

    //titulo antes do ul
    this.subNome.textContent = "Compartimentos:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');

        parent.replaceChild(input, this.nome);
        input.focus();
        input.value=this.nome.textContent
        input.onblur = function(e) {
            consola.nome = input.value;

            parent.replaceChild(this.nome, input);
        }.bind(this);

        input.onkeypress = function(event) {
            var enterKeyCode = 13;
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                input.blur();
                return false;
            }
            return true;
        }.bind(this);


    }.bind(this);

    //vamos agora criar os filhos que sao as consolas
    var compartimentos = consola.compartimentos;
    this.criarLi(this.ul, compartimentos, function(compartimento) {
        var painelCompartimento = new PainelCompartimento(compartimento);
        painelCompartimento.aplicar();


    });

    //botao de criar
    this.criar.onclick = function(e) {
        consola.criarCompartimento(prompt("Insira nome da consola"));
    }

    //botao de remover
    this.remover.onclick = function(e) {

        var checkboxes = document.getElementsByName('checkRemove');
        var nomes = [];


        for (var i = 0; i < checkboxes.length; i++) {

            if (checkboxes[i].checked == true)
                nomes.push(checkboxes[i].value);

        }

        nomes.forEach(nome => consola.apagarCompartimento(nome));

    }

    //botao de remover
    this.selectAll.onclick = function(e) {

        var checkBoxes = document.getElementsByName('checkRemove');
        var nomes = [];

        for (var i = 0; i < checkBoxes.length; i++)
            checkBoxes[i].checked = true;


    }

    //listener de mudancas
    consola.adicionarChangeListener(function() {
        this.nome.textContent = consola.nome;
        this.sistemaDomotico.textContent = consola.domotico.nome;

        var compartimentos = consola.compartimentos;
        this.criarLi(this.ul, compartimentos, function(compartimento) {
            var painelCompartimento = new PainelCompartimento(compartimento);
            painelCompartimento.aplicar();


        });
    }.bind(this));

    //botao de sistema domotico
    this.sistemaDomotico = document.createElement("button");
    this.sistemaDomotico.textContent = consola.domotico.nome;

    this.sistemaDomotico.onclick = function(e) {
        if (consola.domotico !== void 0) {
            var painelDomotico = new PainelDomotico(consola.domotico);
            painelDomotico.aplicar();
        }
        else {
            alert("Esta consola nao pertence a nenhum sistema domotico");
        }
    }

    this.elemento.appendChild(this.sistemaDomotico);


}
PainelConsola.prototype = Object.create(Painel.prototype);
PainelConsola.prototype.constructor = PainelConsola;

/**
 * Painel que faz a gestão de um compartimento
 * @constructor
 * @param {Compartimento} compartimento - A compartimento que irá ser gerida pelo painel
 */
var PainelCompartimento = function(compartimento) {
    Painel.call(this);

    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', 'compartimento');

    //meter o nome do painel
    this.nome.textContent = compartimento.nome;

    //titulo antes do ul
    this.subNome.textContent = "Equipamentos:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');
        input.value=this.nome.textContent;
        parent.replaceChild(input, this.nome);
        input.focus();

        input.onblur = function(e) {

            compartimento.nome = input.value;

            parent.replaceChild(this.nome, input);

        }.bind(this);

        input.onkeypress = function(event) {
            var enterKeyCode = 13;
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                input.blur();
                return false;
            }
            return true;
        }.bind(this);


    }.bind(this);

    //vamos agora criar os filhos que sao as consolas
    var equipamentos = compartimento.equipamentos;
    this.criarLi(this.ul, equipamentos, function() {
        alert("oi");
    });

    //botao de criar
    this.criar.onclick = function(e) {
        var stringAMostrar = "";

        var mapIter = equipamentoMap.keys();
        for (var aux of mapIter) {
            stringAMostrar += aux + "|"
        }

        var tipo = prompt("Indique o nome do equipamento a criar: ", stringAMostrar);




       
     
        if(tipo!== void 0){
            
             tipo = tipo.split("|");
        for (var i = 0; i < tipo.length; i++) {
            if (equipamentoMap.get(tipo[i])) {
                var eq = getEquipamento(tipo[i]);

                compartimento.adicionarEquipamento(eq);

            }

        }
        }

    }

    //botao de remover
    this.remover.onclick = function(e) {

        var checkboxes = document.getElementsByName('checkRemove');
        var nomes = [];


        for (var i = 0; i < checkboxes.length; i++) {

            if (checkboxes[i].checked)
                nomes.push(checkboxes[i].value);

        }
        nomes.forEach(nome => compartimento.removerEquipamento(nome));

    }

    //botao de remover
    this.selectAll.onclick = function(e) {

        var checkBoxes = document.getElementsByName('checkRemove');
        var nomes = [];

        for (var i = 0; i < checkBoxes.length; i++)
            checkBoxes[i].checked = true;

    }


    //listener de mudancas
    compartimento.adicionarChangeListener(function() {
        this.nome.textContent = compartimento.nome;
        this.consola.textContent = compartimento.consola.nome||"Consola";
        var equipamentos = compartimento.equipamentos;
        this.criarLi(this.ul, equipamentos, function() {
        });
    }.bind(this));
    //botao de monitorizar
    this.botaoMonitorizar = document.createElement("button");
    this.botaoMonitorizar.textContent = "Monitorizar";

    this.botaoMonitorizar.onclick = function(e) {
        var painelMonitorizacao = new PainelMonotorizacao(compartimento);
        painelMonitorizacao.aplicar();
    }
    this.elemento.appendChild(this.botaoMonitorizar);

    //botao de sistema domotico
    this.consola = document.createElement("button");
    this.consola.textContent = compartimento.consola.nome||"Consola";

    this.consola.onclick = function(e) {
        if (compartimento.consola !== void 0) {
            var painelConsola = new PainelConsola(compartimento.consola);
            painelConsola.aplicar();
        }
        else {
            alert("Esta consola nao pertence a nenhum sistema domotico");
        }
    }

    this.elemento.appendChild(this.consola);

}
PainelCompartimento.prototype = Object.create(Painel.prototype);
PainelCompartimento.prototype.constructor = PainelCompartimento;


//TODO: Poder alterar o compartimento sem ter que criar outro painel

/**
 * Painel que faz a gestão dos equipamentos de um compartimento
 * @constructor
 * @param {Compartimento} compartimento - A compartimento que irá ser gerida pelo painel
 */
var PainelMonotorizacao = function(compartimento) {

    this.elemento = document.createElement("div");
    this.elemento.setAttribute('class', 'painel-motorizacao');
    this.table = document.createElement('table');
    //botao compartimento
    this.botaoVoltar = document.createElement("button");
    this.botaoVoltar.textContent = "voltar";

    this.botaoVoltar.onclick = function(e) {
        var painelCompartimento = new PainelCompartimento(compartimento);
        painelCompartimento.aplicar();
    }

    var i = 0;
    var tr;
    
   
    compartimento.equipamentos.forEach(function(equipamento) {

        if (i == 0) {
            tr = document.createElement('tr');
            this.table.appendChild(tr);
        }


        var td = document.createElement('td');
        td.appendChild(wrapEquipamento(equipamento).elemento);
        tr.appendChild(td);

        i = (i + 1) % Math.ceil(Math.sqrt(compartimento.equipamentos.length));


    }, this);


    this.elemento.appendChild(this.table);
    this.elemento.appendChild(this.botaoVoltar);

}
PainelMonotorizacao.prototype = Object.create(Painel.prototype);
PainelMonotorizacao.prototype.constructor = PainelMonotorizacao;

var equipamentoMap = new Map();
equipamentoMap.set("MotorEletrico", MotorEletrico);
equipamentoMap.set("TrincoEletrico", TrincoEletrico);
equipamentoMap.set("GeradorMovimento", GeradorMovimento);
equipamentoMap.set("ArCondicionado", ArCondicionado);
equipamentoMap.set("Termometro", Termometro);
equipamentoMap.set("DetetorFecho", DetetorFecho);
equipamentoMap.set("DetetorMovimento", DetetorMovimento);
equipamentoMap.set("DetetorPosicaoEstore", DetetorPosicaoEstore);
equipamentoMap.set("DetetorIncendio", DetetorIncendio);
equipamentoMap.set("GeradorIncendio", GeradorIncendio);

function getEquipamento(equipamento) {

    for (var [key, value] of equipamentoMap) {
        if (equipamento == key) {
            return new value();
        }
    }

}