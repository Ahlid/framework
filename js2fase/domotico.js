/**
 * Representa um objeto que pode ser alteravel.
 * Esta classe possibilita registar eventos de alteração
 * @constructor
 * 
 * @property {Array} handlers - Array de funções handler que tratam de eventos onchange
 */
var Alteravel = (function() {

    return function Alteravel() {
        this.handlers = [];
    }

})();

/**
 * Adiciona um handler que irá correr ao ser alterado este objeto
 * @param {Function} listener - irá correr ao ser alterado este objeto.
 */
Alteravel.prototype.adicionarChangeListener = function(listener) {
    this.handlers.push(listener);
}

/**
 * Envia um change event para todos os handlers
 * @param {Object} evento - evento que irá ser lançado a todos os handlers registados
 */
Alteravel.prototype.enviarEventoAlterado = function(evento) {
    this.handlers.forEach(function(handler) {
        handler(evento);
    });
}



/**
 * Representa um compartimento
 * @constructor
 * @param {String} nome - O nome do sistema domotico
 * @param {Consola} consola - A consola onde vai ser adicionado
 * @extends Alteravel
 * @property {Array} equipamentos - equipamentos do compartimento
 * @property {String} nome - nome do compartimento
 */
function Compartimento(id,nome) {

    if (nome == void 0 || !(/\S/.test(nome)))
        throw Error('Nome não pode ser vazio');

    Alteravel.call(this);
    this.id=id;
    this.equipamentos = []; //Todo: cuidado com os 


}

Compartimento.prototype = Object.create(Alteravel.prototype);
Compartimento.prototype.constructor = Compartimento;


/**
 * Metodo que recebe o nome de um equipamento e caso ele exista é devovlido
 * @param {String} nome - nome do equipamento a procurar
 */
Compartimento.prototype.getEquipamento = function(id) {

    for (var i = 0; i < this.equipamentos.length; i++) {

        if (this.equipamentos[i].id == id)
            return this.equipamentos[i];

    }

    return void 0;

}



/**
 * Representa um Equipamento
 * @constructor
 * @param {String} nome - O nome do equipamento
 * @param {Compartimento} compartimento - o compartimento onde vai ser posto
 * @extends Alteravel
 * @property {String} nome - nome do equipamento
 * @property {Compartimento} compartimento - compartimento associado
 */
var Equipamento = (function() {

    return function(id,nome, compartimento) {

        if (nome == void 0 || !(/\S/.test(nome)))
            throw Error('Nome não pode ser vazio');

        Alteravel.call(this);
        this.id=id;
        this.nome = nome;
        this.compartimento = compartimento || null;

    }

})();

Equipamento.prototype = Object.create(Alteravel.prototype);
Equipamento.prototype.constructor = Equipamento;


/**
 * Objeto que representa todos os equipamentos que sao sensores (que sofrem atuações no comparimento)
 * @constructor
 * @extends Equipamento
 * @param {String} nome - O nome do equipamento (a sua identificação)
 * @param {Compartimento} compartimento - O compartimento onde o sensor se encontra inserido
 */
function Sensor(id,nome, compartimento) {

    Equipamento.call(this,id, nome, compartimento);

}

Sensor.prototype = Object.create(Equipamento.prototype);
Sensor.prototype.constructor = Sensor;


/**
 * Objeto que representa um termometro
 * @constructor
 * @extends Sensor
 * @param {Compartimento} compartimento - O compartimento onde o sensor se encontra inserido
 * @property {Number} temperatura - a temperatura actual do termometro
 */
var Termometro = (function() {


    var sigla = "TM"

    return function Termometro(id,compartimento,temperatura) {

        var nome = sigla;

        Sensor.call(this,id, nome, compartimento);

        var temperatura = temperatura || 25;

        Object.defineProperty(this, 'temperatura', {

            enumerable: true,
            configurable: false,
            get: function() {
                return temperatura;
            },
            set: function(newValue) {

                if (Termometro.minTemperatura <= newValue && newValue <= Termometro.maxTemperatura) {
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
 * A maxima temperatura que o ar termometro pode medir
 */
Termometro.maxTemperatura = 50;
/**
 * A minima temperatura que o ar termometro pode medir
 */
Termometro.minTemperatura = -50;

/**
 * Objeto que representa um detetor de movimento, que deteta movimento num compartimento
 * @constructor
 * @extends Sensor
 * @param {Compartimento} compartimento - O compartimento onde o sensor se encontra inserido
 * @property {Boolean} acionado - se o detetor esta acionado(true) ou nao (false)
 */
var DetetorMovimento = (function() {

    var sigla = "DM";

    return function(id,compartimento) {

        this.acionado = false;
        var nome = sigla;
        Sensor.call(this,id, nome, compartimento);

    };

})();

DetetorMovimento.prototype = Object.create(Sensor.prototype);
DetetorMovimento.prototype.constructor = DetetorMovimento;
/**
 * Metodo que aciona movimento do detetor
 * 
 */
DetetorMovimento.prototype.acionar = function() {

        this.acionado = true;
        this.enviarEventoAlterado();

    }
    /**
     * Metodo que desliga o movimento do detetor
     *
     */
DetetorMovimento.prototype.desligar = function() {

    this.acionado = false;
    this.enviarEventoAlterado();

}

/**
 * Objeto que representa um detetor de fecho
 * @constructor
 * @extends Sensor
 * @param {Compartimento} compartimento - O compartimento onde o sensor se encontra inserido
 * @property {Boolean} ligado - se o detetor esta ligado (true) ou nao (false)
 */
var DetetorFecho = (function() {

    
    var sigla = "DF";

    return function(id,compartimento) {

        var nome = sigla ;
        this.ligado = false;
        Sensor.call(this,id, nome, compartimento);

    };

})();

DetetorFecho.prototype = Object.create(Sensor.prototype);
DetetorFecho.prototype.constructor = DetetorFecho;
/**
 * Metodo que altera o estado do detetor
 * se o detetor esta ligado (true) ou nao (false)
 * @param {Boolean} ligado - se ligado (true) ou nao (false)
 */
DetetorFecho.prototype.setEstado = function(ligado) {

    this.ligado = ligado;
    this.enviarEventoAlterado();

}


/**
 * Objeto que representa um detetor posicao estore
 * @constructor
 * @extends Sensor
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @property {String} posicao - a posicao do detetor posicao estore
 */
var DetetorPosicaoEstore = (function() {

    /**
     * Representa as posicoes que o estore pode ter
     */
    var POSICOES = {

        'ABERTO': 'Aberto',
        'UM_TERCO': 'A um terço',
        'MEIO_ABERTO': 'Meio aberto',
        'A_DOIS_TERCOS': 'A dois terços',
        'FECHADO': 'Fechado'

    };


    var sigla = "EE";

    return function(id,posicao,compartimento) {

        var nome = sigla;
        var posicao = POSICOES[Object.keys(POSICOES)[posicao]]|| POSICOES['ABERTO'];

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


        Sensor.call(this,id, nome, compartimento);

    };

})();

DetetorPosicaoEstore.prototype = Object.create(Sensor.prototype);
DetetorPosicaoEstore.prototype.constructor = DetetorPosicaoEstore;




/**
 * Objeto que representa um detetor de incendio
 * @constructor
 * @extends Sensor
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @property {Boolean} acionado - o estado do detetor 
 */
var DetetorIncendio = (function() {

    
    var sigla = "DI";

    return function(id,compartimento) {

        this.acionado = false;
        var nome = sigla ;
        Sensor.call(this,id, nome, compartimento);

    };

})();

DetetorIncendio.prototype = Object.create(Sensor.prototype);
DetetorIncendio.prototype.constructor = DetetorIncendio;


/**
 * Metodo que aciona o detetor de incendio
 * 
 */
DetetorIncendio.prototype.acionar = function() {

        this.acionado = true;
        this.enviarEventoAlterado();

    }
    /**
     * Metodo que desliga o detedor de incendio
     * 
     */
DetetorIncendio.prototype.desligar = function() {

    this.acionado = false;
    this.enviarEventoAlterado();

}

/**
 * Objeto que representa todos os equipamentos que sao atuadores (que atuam no comparimento)
 * @constructor
 * @extends Equipamento
 * @param {String} nome - O nome do equipamento (a sua identificação)
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 */
function Atuador(id,nome, compartimento) {

    Equipamento.call(this,id, nome, compartimento);

}

Atuador.prototype = Object.create(Equipamento.prototype);
Atuador.prototype.constructor = Atuador;

/**
 * Objeto que representa todos os equipamentos que sao atuadores (que atuam no comparimento) e que tem impacto geral sobre o compartimento
 * @constructor
 * @extends Atuador
 * @param {String} nome - O nome do equipamento (a sua identificação)
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 */
function EquipamentoImpactoGeral(id,nome, compartimento) {

    Atuador.call(this,id, nome, compartimento);

}

EquipamentoImpactoGeral.prototype = Object.create(Atuador.prototype);
EquipamentoImpactoGeral.prototype.constructor = EquipamentoImpactoGeral;


/**
 * Objeto que representa todos os equipamentos que sao atuadores (que atuam no comparimento) e que tem impacto local (sobre apenas um sensor)
 * @constructor
 * @extends Atuador
 * @param {String} nome - O nome do equipamento (a sua identificação)
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @param {Array} sensoresValidos - Um array com todos os tipos de sensores validos para este atuador de impacto local, ou seja todos os sensores onde ele pode atuar
 * @param {Sensor} sensor - O sensor onde este atuador locar esta a atuar
 */
function EquipamentoImpactoLocal(id,nome, sensoresValidos, compartimento, sensor) {

    if (nome == void 0) {
        throw Error("Nome undefined");
    }
    if (sensoresValidos == void 0) {
        throw Error("Deve inserir os sensores validos");
    }

    Atuador.call(this,id, nome, compartimento);

    this.sensoresValidos = sensoresValidos;
    this.sensor = this.sensoresValidos.some(function(classeSensor) {
        return sensor instanceof classeSensor;
    }) ? sensor : void 0;

}
EquipamentoImpactoLocal.prototype = Object.create(Atuador.prototype);
EquipamentoImpactoLocal.prototype.constructor = EquipamentoImpactoLocal;
/**
 * Metodo que mete um nosso sensor associado a este atuador de impacto local, ou seja o novo sensor onde ele vai atuar 
 * o sensor tem de pertencer aos sensores validos e nao ser undifined
 * @param {Sensor} sensor - o novo sensor
 */
EquipamentoImpactoLocal.prototype.setSensor = function(sensor) {

        if (this.compartimento != void 0) {

            var equipamentosCompartimento = this.compartimento.equipamentos;

            var isValido = this.sensoresValidos.some(function(element) {
                return sensor instanceof element;
            });

            if (isValido) {
                if (equipamentosCompartimento.indexOf(sensor) != -1)
                    this.sensor = sensor;
            }
        }

    }
    /**
     * Metodo que remove o sensor onde este atuador está a atuar 
     *
     */
EquipamentoImpactoLocal.prototype.removerSensor = function() {
        this.sensor = void 0;
    }
    /**
     * Metodo que recebe um sensor e verifica se o mesmo se encontra na lista de sensores validos
     * @param {Sensor} sensor - o sensor a ser verificado
     */
EquipamentoImpactoLocal.prototype.isSensorValido = function(sensor) {
    return this.sensoresValidos.some(function(classeSensor) {
        return sensor instanceof classeSensor;
    });
}


/**
 * Objeto que representa um ar condicionado
 * @constructor
 * @extends EquipamentoImpactoGeral
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @param {Number} temperatura - a temperatura do ar condicionado, por default é 25  caso este parametro for indefenido
 * @property {Number} temperatura - a temperatura actual do ar condicionado
 */
var ArCondicionado = (function() {

    var sigla = 'AC';


    return function ArCondicionado(id,compartimento, temperatura) {

        var nome = sigla ;
        EquipamentoImpactoGeral.call(this,id, nome, compartimento);

        var temperatura = temperatura || 25;

        Object.defineProperty(this, 'temperatura', {

            enumerable: true,
            configurable: false,
            get: function() {
                return temperatura;
            },
            set: function(newValue) {

                if ((newValue === void 0) || !(/\S/g.test(newValue)) || (Number(newValue) % 1 !== 0)) {
                    return;
                }

                if (ArCondicionado.minTemperatura <= newValue && newValue <= ArCondicionado.maxTemperatura) {
                    temperatura = newValue;
                    this.enviarEventoAlterado();
                }

            }

        });

    };



}());


ArCondicionado.prototype = Object.create(EquipamentoImpactoGeral.prototype);
ArCondicionado.prototype.constructor = ArCondicionado;
/**
 * A maxima temperatura que o ar condicionado pode apresentar
 */
ArCondicionado.maxTemperatura = 50;
/**
 * A minima temperatura que o ar condicionado pode apresentar
 */
ArCondicionado.minTemperatura = -50;
/**
 * Metodo que aciona o arcondicionado fazendo com que mude a temperatura de todos os termometros do compartimento onde ele se encontra, se encontrar-se em algum compartimento
 * 
 */
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
 * Objeto que representa um gerador de movimento
 * @constructor
 * @extends EquipamentoImpactoGeral
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @property {Boolean} movimento - boolean que indica se o gerador de movimento esta em movimento (true) ou nao (false)
 */
var GeradorMovimento = (function() {

    var movimento = false;
    var sigla = 'GM';

    return function(id,compartimento) {

        this.movimento = movimento;
        var nome = sigla;
        EquipamentoImpactoGeral.call(this,id, nome, compartimento);

    };

})();

GeradorMovimento.prototype = Object.create(EquipamentoImpactoGeral.prototype);
GeradorMovimento.prototype.constructor = GeradorMovimento;

/**
 * Metodo que vai commutar o movimento do gerador, se tiver em movimento para-o, se nao mete-o em movimento
 */
GeradorMovimento.prototype.commutar = function() {

        if (this.movimento)
            this.pararMovimento();
        else
            this.gerarMovimento();

    }
    /**
     * Metodo que para o movimento do gerador
     *
     */
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
    /**
     * Metodo que inicia o movimento do gerador
     *
     */
GeradorMovimento.prototype.pararMovimento = function() {

    if (!this.movimento)
        return;

    if (this.compartimento != void 0) { //se tiver em algum compartimento

        this.movimento = false; //o gerador deixa de gerar movimento
        this.enviarEventoAlterado();
        var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos
        //todo:verificar o codigo repetido
        //vamos agora verificar se algum gerador ainda está em movimento
        var existeMovimento = equipamentosCompartimento.some(function(equipamento) {
            return (equipamento instanceof GeradorMovimento) && equipamento.movimento;
        });

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
 * Objeto que representa um trinco eletrico
 * @constructor
 * @extends EquipamentoImpactoLocal
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @param {Sensor} sensor - O sensor sobre o qual o trinco esta a atuar
 * @property {Boolean} ligado - boolean que indica se o trinco esta ligado (true) ou nao (false)
 */
var TrincoEletrico = (function() {

    var sensoresValidos = [DetetorFecho];
    var sigla = 'TE';

    return function(id,compartimento, sensor) {

        var nome = sigla;
        this.ligado = false;

        EquipamentoImpactoLocal.call(this,id, nome, sensoresValidos, compartimento, sensor);

    };

})();
TrincoEletrico.prototype = Object.create(EquipamentoImpactoLocal.prototype);
TrincoEletrico.prototype.constructor = TrincoEletrico;
/**
 * Metodo que vai commutar o estado do trinco, se tiver ligado desliga-o, se nao liga-o
 */
TrincoEletrico.prototype.commutar = function() {

    this.ligado = !this.ligado;
    this.enviarEventoAlterado();

    if (this.sensor !== void 0)
        this.sensor.setEstado(this.ligado);

}



/**
 * Objeto que representa um motor eletrico
 * @constructor
 * @extends EquipamentoImpactoLocal
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @param {Sensor} sensor - O sensor sobre o qual o motor eletrico esta a atuar
 * @property {String} posicao - a posicao do motor eletrico
 */
var MotorEletrico = (function() {

    /**
     * Representa as posicoes que o estore pode ter
     */
    var POSICOES = {

        'ABERTO': 'Aberto',
        'UM_TERCO': 'A um terço',
        'MEIO_ABERTO': 'Meio aberto',
        'A_DOIS_TERCOS': 'A dois terços',
        'FECHADO': 'Fechado'

    };


    var listaSensores = [DetetorPosicaoEstore];
    var ultimoId = 0;
    var sigla = 'ME';

    return function(id,posicao,compartimento, sensor) {

        var nome = sigla;

        var posicao = POSICOES[Object.keys(POSICOES)[posicao]]|| POSICOES['ABERTO'];
        EquipamentoImpactoLocal.call(this,id, nome, listaSensores, compartimento, sensor);

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
/**
 * Metodo que aplica a posicao do motor ao detetor a que está associado 
 */
MotorEletrico.prototype.aplicar = function() {

    if (this.compartimento != void 0 && this.sensor !== void 0) {
        this.sensor.posicao = this.posicao;
    }

}





/**
 * Objeto que representa um gerador de incendio (simulador)
 * @constructor
 * @extends EquipamentoImpactoGeral
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @property {Boolean} temFogo - boolean que indica se o gerador  esta em simulacao de fogo (true) ou nao (false)
 */
var GeradorIncendio = (function() {

    var temFogo = false;
    var sigla = 'GI';

    return function(id,compartimento) {

        this.temFogo = temFogo;
        var nome = sigla;
        EquipamentoImpactoGeral.call(this,id, nome, compartimento);

    };

})();

GeradorIncendio.prototype = Object.create(EquipamentoImpactoGeral.prototype);
GeradorIncendio.prototype.constructor = GeradorIncendio;

/**
 * Metodo que vai commutar o estado do gerador, se tiver em simulacao(tem fogo) para-o, se nao mete-o em simulacao (com fogo)
 */
GeradorIncendio.prototype.commutar = function() {

        if (this.temFogo)
            this.pararFogo();
        else
            this.gerarFogo();

    }
    /**
     * Metodo que gera fogo (inicia a simulacao)
     */
GeradorIncendio.prototype.gerarFogo = function() {

        if (this.temFogo)
            return;

        if (this.compartimento != void 0) {

            this.temFogo = true;
            this.enviarEventoAlterado();
            var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos do compartimento

            equipamentosCompartimento.filter(function(equipamento) {
                return (equipamento instanceof DetetorIncendio);
            }).forEach(function(equipamento) { //por cada equipamento se for um Detetor de movimento devemos aciona-lo
                equipamento.acionar();
            });


        }
    }
    /**
     * Metodo que para o fogo (para a simulacao)
     */
GeradorIncendio.prototype.pararFogo = function() {

    if (!this.temFogo)
        return;

    if (this.compartimento != void 0) { //se tiver em algum compartimento

        this.temFogo = false;
        this.enviarEventoAlterado();
        var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos
        //todo:verificar o codigo repetido
        //vamos agora verificar se algum gerador ainda está em ligado
        var existeFogo = equipamentosCompartimento.some(function(equipamento) {
            return (equipamento instanceof GeradorIncendio) && equipamento.temFogo;
        });


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


/**
 * Wrapper que apresenta a interface grafica a um utilizador sobre o equipamento em questão
 * @constructor
 * @param {Equipamento} equipamento - o equipamento a representar
 * @property {HTMLElement} elemento - elemento root
 * @property {Equipamento} equipamento - o equipamento a representar

 */
var WrapperEquipamento = (function() {

    return function(equipamento) {

        if (!(equipamento instanceof Equipamento))
            throw Error('O objeto recebido não é uma instancia da classe Equipamento');

        this.equipamento = equipamento;
        this.elemento = document.createElement('div');
        this.elemento.setAttribute('class', 'wrapper-equipamento');
    }

})();


/**
 * Wrapper que apresenta a interface grafica a um utilizador sobre um equipamento com identificação
 * @constructor
 * @param {Equipamento} equipamento - o equipamento a representar
 * @param {String} tipoEquipamento - string a dizer o tipo de equipamento recebido
 * @param {String} svgIconData - string com o svg a ser desenhado
 * @extends WrapperEquipamento
 * @property {HTMLElement} icon - o icon do equipamento
 * @property {Equipamento} path - a pasta para o svg icon
 * @property {Equipamento} tipoEquipamento - o nome do tipo de equipamento
 * @property {Equipamento} identificacao - o nome do equipamento
 */
var WrapperEquipamentoIdentificado = (function() {

    var svgNS = 'http://www.w3.org/2000/svg';

    return function(equipamento, tipoEquipamento, svgIconData) {

        if (!(equipamento instanceof Equipamento))
            throw Error('O objeto recebido não é uma instancia da classe Equipamento');

        WrapperEquipamento.call(this, equipamento);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' equipamento-identificado');

        var icon = document.createElementNS(svgNS, 'svg');
        this.icon = icon;
        icon.setAttributeNS(null, 'class', 'wrapper-icon-svg');
        icon.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid');
        icon.setAttributeNS(null, 'width', '100px');
        icon.setAttributeNS(null, 'height', '100px');
        icon.setAttributeNS(null, 'viewBox', '0 0 60 60');

        this.path = document.createElementNS(svgNS, 'path');
        this.path.setAttributeNS(null, 'class', 'wrapper-icon-svg-path-idle');
        this.path.setAttributeNS(null, 'd', svgIconData);
        icon.appendChild(this.path);
        this.elemento.appendChild(icon);

        if (tipoEquipamento !== void 0) {
            this.tipoEquipamento = document.createElement('h5');
            this.tipoEquipamento.setAttribute('class', 'tipo-equipamento');
            this.tipoEquipamento.textContent = tipoEquipamento;
            this.elemento.appendChild(this.tipoEquipamento);
        }

        this.identificacao = document.createElement('h5');
        this.identificacao.setAttribute('class', 'identificacao');
        this.identificacao.textContent = equipamento.id+""+equipamento.nome;
        this.elemento.appendChild(this.identificacao);

    }
})();

WrapperEquipamentoIdentificado.prototype = Object.create(WrapperEquipamento.prototype);
WrapperEquipamentoIdentificado.prototype.constructor = WrapperEquipamentoIdentificado;


/**
 * Wrapper que apresenta a interface grafica a um utilizador sobre um equipamento de impacto local
 * @constructor
 * @param {Equipamento} equipamento - o equipamento a representar
 * @param {String} tipoEquipamento - string a dizer o tipo de equipamento recebido
 * @param {String} svgIconData - string com o svg a ser desenhado
 * @extends WrapperEquipamentoIdentificado
 * @property {HTMLElement} referencia - a referencia para o sensor
 */
var WrapperEquipamentoImpactoLocal = (function() {

    return function(equipamentoImpactoLocal, tipoEquipamento, svgIconData) {

        if (!(equipamentoImpactoLocal instanceof EquipamentoImpactoLocal))
            throw Error('O objeto recebido não é uma instancia da classe EquipamentoImpactoLocal');

        WrapperEquipamentoIdentificado.call(this, equipamentoImpactoLocal, tipoEquipamento, svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' impacto-local');
        var nomeEquipamento = equipamentoImpactoLocal.nome;
        var nomeSensor = equipamentoImpactoLocal.sensor != void 0 ? equipamentoImpactoLocal.sensor.nome : 'Não definido';

        this.referencia = document.createElement('h5');
        this.referencia.setAttribute('class', 'referencia');
        this.referencia.textContent = nomeEquipamento + '>' + nomeSensor;
        this.elemento.appendChild(this.referencia);

        var that = this;

        this.referencia.onclick = function(e) {
            var parent = that.elemento;
            var listaSensores = document.createElement('select');

            parent.replaceChild(listaSensores, that.referencia);

            var equipamentosOpcoes = {};
            var equipamentos = equipamentoImpactoLocal.compartimento.equipamentos;


            function criarOpcao(equipamento) {

                var opcao = document.createElement('option');

                opcao.value = equipamento !== void 0 ? equipamento.id : 'undefined';
                equipamentosOpcoes[opcao.value] = equipamento !== void 0 ? equipamento : 'Não definido';

                var texto = document.createTextNode(equipamento !== void 0 ? equipamento.id+""+equipamento.nome : 'Não definido');
                opcao.appendChild(texto);
                listaSensores.appendChild(opcao);

                if (equipamento !== void 0 && that.equipamento.sensor === equipamento) {
                    listaSensores.value = that.equipamento.sensor.nome;
                }

            };

            equipamentos.filter(function(equipamento) {
                if (!(equipamento instanceof Sensor)) return false;
                return equipamentoImpactoLocal.isSensorValido(equipamento);
            }).forEach(function(equipamento, index) {

                criarOpcao(equipamento);

            }, that);

            criarOpcao();

            listaSensores.focus();

            //Abre imediatamente a combobox
            if (document.createEvent) {
                var event = document.createEvent("MouseEvents");
                event.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                listaSensores.dispatchEvent(event);
            }
            else if (listaSensores.fireEvent) {
                listaSensores.fireEvent("onmousedown");
            }

            listaSensores.onclick = function(e) {
                listaSensores.blur();
            }

            listaSensores.onblur = function(e) {

                if (listaSensores.value != 'undefined') {
                    equipamentoImpactoLocal.setSensor(equipamentosOpcoes[listaSensores.value]);
                    that.referencia.textContent = that.equipamento.id+""+that.equipamento.nome + '>' + equipamentosOpcoes[listaSensores.value].nome;
                }
                else {
                    equipamentoImpactoLocal.removerSensor();
                    that.referencia.textContent = that.equipamento.id+""+that.equipamento.nome + '>' + equipamentosOpcoes[listaSensores.value];
                }

                parent.replaceChild(that.referencia, listaSensores);
            }
        }
    }
})();

WrapperEquipamentoImpactoLocal.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperEquipamentoImpactoLocal.prototype.constructor = WrapperEquipamentoImpactoLocal;

/**
 * Wrapper que apresenta a interface grafica de um motor eletrico
 * @constructor
 * @param {MotorEletrico} motorEletrico - o motor eletrico a representar
 * @extends WrapperEquipamentoImpactoLocal
 * @property {HTMLElement} estado - o estado do motor eletrico (a posicao)
 */
var WrapperMotorEletrico = (function() {

    /**
     * Representa as posicoes que o estore pode ter
     */
    var POSICOES = {

        'ABERTO': 'Aberto',
        'UM_TERCO': 'A um terço',
        'MEIO_ABERTO': 'Meio aberto',
        'A_DOIS_TERCOS': 'A dois terços',
        'FECHADO': 'Fechado'

    };


    var pathClasses = {
        'idle': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = "M8.000,29.000 L8.000,19.000 C8.000,17.343 9.343,16.000 11.000,16.000 L17.000,16.000 L16.857,47.000 L11.000,47.000 C9.343,47.000 8.000,45.657 8.000,44.000 L8.000,34.000 L2.000,34.000 L2.000,29.000 L8.000,29.000 ZM49.286,47.000 L53.000,47.000 C54.657,47.000 56.000,45.657 56.000,44.000 L56.000,19.000 C56.000,17.343 54.657,16.000 53.000,16.000 L49.143,16.000 L49.286,47.000 ZM47.143,47.000 L19.000,47.000 L19.000,16.000 L47.286,16.000 L47.143,47.000 ZM30.000,22.000 L27.000,34.000 L32.000,34.000 L31.000,41.000 L39.000,29.000 L33.000,29.000 L36.000,22.000 L30.000,22.000 Z";

    return function(motorEletrico) {

        if (!(motorEletrico instanceof MotorEletrico))
            throw Error('O objeto recebido não é uma instancia da classe MotorEletrico');

        WrapperEquipamentoImpactoLocal.call(this, motorEletrico, 'Motor-Eletrico', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' motor-eletrico');

        var texto = document.createTextNode(POSICOES[motorEletrico.posicao]);
        this.estado = document.createElement('h3');
        this.estado.appendChild(texto);

        this.elemento.appendChild(this.estado);

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses['idle']);

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

                if (motorEletrico.posicao === opcao.value)
                    opcao.setAttribute('selected', 'selected');

                var texto = document.createTextNode(POSICOES[posicao]);
                opcao.appendChild(texto);
                posicoesSelect.appendChild(opcao);

            }

            parent.replaceChild(posicoesSelect, that.estado);
            posicoesSelect.focus();

            //Abre imediatamente a combobox
            if (document.createEvent) {
                var event = document.createEvent("MouseEvents");
                event.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                posicoesSelect.dispatchEvent(event);
            }
            else if (posicoesSelect.fireEvent) {
                posicoesSelect.fireEvent("onmousedown");
            }

            posicoesSelect.onclick = function(e) {
                posicoesSelect.blur();
            }

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

/**
 * Wrapper que apresenta a interface grafica de um trinco eletrico
 * @constructor
 * @param {TrincoEletrico} trincoEletrico - o trinco eletrico a representar
 * @extends WrapperEquipamentoImpactoLocal
 */
var WrapperTrincoEletrico = (function() {
    var pathClasses = {
        'true': 'wrapper-icon-svg-path-idle',
        'false': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = {
        'false': "M45.000,43.000 L18.000,43.000 C11.373,43.000 6.000,37.627 6.000,31.000 C6.000,24.373 11.373,19.000 18.000,19.000 L45.000,19.000 C51.627,19.000 57.000,24.373 57.000,31.000 C57.000,37.627 51.627,43.000 45.000,43.000 ZM19.000,21.000 C13.477,21.000 9.000,25.477 9.000,31.000 C9.000,36.523 13.477,41.000 19.000,41.000 C24.523,41.000 29.000,36.523 29.000,31.000 C29.000,25.477 24.523,21.000 19.000,21.000 Z",
        'true': "M45.000,43.000 L18.000,43.000 C11.373,43.000 6.000,37.627 6.000,31.000 C6.000,24.373 11.373,19.000 18.000,19.000 L45.000,19.000 C51.627,19.000 57.000,24.373 57.000,31.000 C57.000,37.627 51.627,43.000 45.000,43.000 ZM45.000,21.000 C39.477,21.000 35.000,25.477 35.000,31.000 C35.000,36.523 39.477,41.000 45.000,41.000 C50.523,41.000 55.000,36.523 55.000,31.000 C55.000,25.477 50.523,21.000 45.000,21.000 Z"
    }

    return function(trincoEletrico) {

        if (!(trincoEletrico instanceof TrincoEletrico))
            throw Error('O objeto recebido não é uma instancia da classe TrincoEletrico');

        WrapperEquipamentoImpactoLocal.call(this, trincoEletrico, 'Trinco-Eletrico', svgIconData[trincoEletrico.ligado]);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' trinco-eletrico');

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses[trincoEletrico.ligado]);

        this.icon.onclick = function(e) {
            trincoEletrico.commutar();
        }

        trincoEletrico.adicionarChangeListener(function(e) {
            path.setAttributeNS(null, 'class', pathClasses[trincoEletrico.ligado]);
            path.setAttributeNS(null, 'd', svgIconData[trincoEletrico.ligado]);
        });
    }
})();

WrapperTrincoEletrico.prototype = Object.create(WrapperEquipamentoImpactoLocal.prototype);
WrapperTrincoEletrico.prototype.constructor = WrapperTrincoEletrico;


/**
 * Wrapper que apresenta a interface grafica um gerador de movimento
 * @constructor
 * @param {GeradorMovimento} geradorMovimento - o gerador de movimento a representar
 * @extends WrapperEquipamentoIdentificado
 */
var WrapperGeradorMovimento = (function() {

    var pathClasses = {
        'true': 'wrapper-icon-svg-path-idle',
        'false': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = {
        'false': "M29.000,28.000 L25.000,34.000 C25.000,34.000 24.286,37.571 21.000,41.000 L18.000,41.000 C18.000,41.000 14.714,40.714 15.000,43.000 C15.000,43.000 14.571,45.000 18.000,45.000 L21.000,45.000 C21.000,45.000 25.286,45.286 26.000,42.000 L28.000,38.000 L34.000,49.000 C34.000,49.000 34.981,50.290 36.000,50.000 C36.690,49.804 37.849,48.528 37.000,47.000 L31.000,36.000 L35.000,30.000 L37.000,33.000 L42.000,33.000 C42.000,33.000 43.714,33.429 44.000,32.000 C44.000,32.000 44.714,30.000 42.000,30.000 L39.000,30.000 L35.000,25.000 L36.000,24.000 C36.000,24.000 39.429,22.429 37.000,19.000 C37.000,19.000 34.714,16.286 32.000,19.000 C32.000,19.000 30.286,21.429 32.000,23.000 L31.000,24.000 L23.000,24.000 L20.000,28.000 C20.000,28.000 18.429,29.429 19.000,31.000 C19.000,31.000 20.286,32.714 22.000,31.000 L24.000,28.000 L29.000,28.000 Z",
        'true': "M56.000,37.000 C55.571,38.571 54.000,38.000 54.000,38.000 C52.429,37.429 54.000,36.000 54.000,36.000 C60.143,23.429 52.000,16.000 52.000,16.000 L52.000,15.000 C53.286,13.857 54.000,15.000 54.000,15.000 C63.857,25.857 56.000,37.000 56.000,37.000 ZM50.000,34.000 C49.571,35.571 48.000,35.000 48.000,35.000 C46.429,34.429 48.000,33.000 48.000,33.000 C53.000,25.429 47.000,20.000 47.000,20.000 L47.000,19.000 C48.286,17.857 49.000,19.000 49.000,19.000 C56.143,26.000 50.000,34.000 50.000,34.000 ZM42.000,33.000 L37.000,33.000 L35.000,30.000 L31.000,36.000 L37.000,47.000 C37.849,48.528 36.690,49.804 36.000,50.000 C34.981,50.290 34.000,49.000 34.000,49.000 L28.000,38.000 L26.000,42.000 C25.286,45.286 21.000,45.000 21.000,45.000 L18.000,45.000 C14.571,45.000 15.000,43.000 15.000,43.000 C14.714,40.714 18.000,41.000 18.000,41.000 L21.000,41.000 C24.286,37.571 25.000,34.000 25.000,34.000 L29.000,28.000 L24.000,28.000 L22.000,31.000 C20.286,32.714 19.000,31.000 19.000,31.000 C18.429,29.429 20.000,28.000 20.000,28.000 L23.000,24.000 L31.000,24.000 L32.000,23.000 C30.286,21.429 32.000,19.000 32.000,19.000 C34.714,16.286 37.000,19.000 37.000,19.000 C39.429,22.429 36.000,24.000 36.000,24.000 L35.000,25.000 L39.000,30.000 L42.000,30.000 C44.714,30.000 44.000,32.000 44.000,32.000 C43.714,33.429 42.000,33.000 42.000,33.000 ZM11.995,33.819 C11.995,33.819 13.574,35.272 11.995,35.853 C11.995,35.853 10.415,36.434 9.984,34.836 C9.984,34.836 3.809,26.698 10.990,19.577 C10.990,19.577 11.708,18.415 13.000,19.577 L13.000,20.595 C13.000,20.595 6.969,26.117 11.995,33.819 ZM5.963,36.870 C5.963,36.870 7.543,38.323 5.963,38.905 C5.963,38.905 4.384,39.486 3.953,37.887 C3.953,37.887 -3.945,26.553 5.963,15.509 C5.963,15.509 6.681,14.346 7.974,15.509 L7.974,16.526 C7.974,16.526 -0.212,24.082 5.963,36.870 Z"
    }

    return function(geradorMovimento) {

        if (!(geradorMovimento instanceof GeradorMovimento))
            throw Error('O objeto recebido não é uma instancia da classe GeradorMovimento');

        WrapperEquipamentoIdentificado.call(this, geradorMovimento, 'Gerador-Movimento', svgIconData[geradorMovimento.movimento]);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' gerador-movimento');

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses[geradorMovimento.movimento]);


        this.icon.onclick = function(e) {
            geradorMovimento.commutar();
        }

        geradorMovimento.adicionarChangeListener(function(e) {
            path.setAttributeNS(null, 'class', pathClasses[geradorMovimento.movimento]);
            path.setAttributeNS(null, 'd', svgIconData[geradorMovimento.movimento]);
        });

    }
})();

WrapperGeradorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperGeradorMovimento.prototype.constructor = WrapperGeradorMovimento;

/**
 * Wrapper que apresenta a interface grafica de um ar condicionado
 * @constructor
 * @param {ArCondicionado} arCondicionado - ar condicionado a representar
 * @extends WrapperEquipamentoIdentificado
 * @property {Number} temperatura - a temperatuda do ar condicionado 
 */
var WrapperArCondicionado = (function() {

    var pathClasses = {
        'idle': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = "M28.000,30.000 C13.143,17.571 8.000,31.000 8.000,31.000 L5.000,29.000 C14.429,12.000 30.000,28.000 30.000,28.000 C43.971,38.960 54.000,27.000 54.000,27.000 L56.000,29.000 C43.097,44.706 28.000,30.000 28.000,30.000 ZM28.000,18.000 C13.143,5.571 8.000,19.000 8.000,19.000 L5.000,17.000 C14.429,-0.000 30.000,16.000 30.000,16.000 C43.971,26.960 54.000,15.000 54.000,15.000 L56.000,17.000 C43.097,32.706 28.000,18.000 28.000,18.000 ZM30.000,40.000 C43.971,50.960 54.000,39.000 54.000,39.000 L56.000,41.000 C43.097,56.706 28.000,42.000 28.000,42.000 C13.143,29.571 8.000,43.000 8.000,43.000 L5.000,41.000 C14.429,24.000 30.000,40.000 30.000,40.000 Z";

    return function(arCondicionado) {

        if (!(arCondicionado instanceof ArCondicionado))
            throw Error('O objeto recebido não é uma instancia da classe ArCondicionado');

        WrapperEquipamentoIdentificado.call(this, arCondicionado, 'Ar-Condicionado', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' ar-condicionado');

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses['idle']);


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

            input.select();

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


/**
 * Wrapper que apresenta a interface grafica de um termometro
 * @constructor
 * @param {Termometro} termometro - o termometro a representar
 * @extends WrapperEquipamentoIdentificado
 * @property {Number} temperatura - a temperatuda do termometro
 */
var WrapperTermometro = (function() {

    var pathClasses = {
        'idle': 'wrapper-icon-svg-path-idle'
    }

    return function(termometro) {

        if (!(termometro instanceof Termometro))
            throw Error('O objeto recebido não é uma instancia da classe Termometro');

        WrapperEquipamentoIdentificado.call(this, termometro, 'Termometro', WrapperTermometro.svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' termometro');

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses['idle']);

        var delayDeDetecao = 100; //ms

        this.temperatura = document.createElement('h3');
        this.temperatura.textContent = termometro.temperatura + 'ºC';
        this.elemento.appendChild(this.temperatura);

        var temperaturaVisual = termometro.temperatura;

        var that = this;

        var intervaloId;
        var atualizarTemperatura = (function() {

            if (temperaturaVisual == this.temperatura) {
                clearInterval(intervaloId);
                return;
            }

            temperaturaVisual = Number(temperaturaVisual);
            temperaturaVisual += temperaturaVisual < this.temperatura ? 1 : -1;
            that.temperatura.textContent = temperaturaVisual + 'ºC';

            that.atualizarSvgIcon(Termometro.minTemperatura, Termometro.maxTemperatura, temperaturaVisual);

        }).bind(termometro);

        termometro.adicionarChangeListener(function(e) {

            clearInterval(intervaloId);
            intervaloId = setInterval(atualizarTemperatura, delayDeDetecao);

        });

        that.atualizarSvgIcon(Termometro.minTemperatura, Termometro.maxTemperatura, temperaturaVisual);

    }

})();

WrapperTermometro.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperTermometro.prototype.constructor = WrapperTermometro;

/**
 * O svg icon por default do termometro
 */
WrapperTermometro.svgIconData = "M40.000,49.000 C39.637,56.111 33.971,58.286 30.000,58.000 C25.042,57.643 21.000,53.971 21.000,49.000 C21.000,43.426 24.413,41.943 24.413,41.943 C24.413,41.943 24.000,11.314 24.000,8.000 C24.000,4.686 26.686,2.000 30.000,2.000 C33.314,2.000 36.000,4.686 36.000,8.000 C36.000,11.314 36.000,42.000 36.000,42.000 C36.000,42.000 40.280,43.514 40.000,49.000 ZM33.000,9.000 C33.000,9.000 32.857,6.000 30.000,6.000 C30.000,6.000 26.857,5.857 27.000,9.000 L27.000,13.000 L30.000,13.000 L30.000,14.000 L27.000,14.000 L27.000,20.000 L30.000,20.000 L30.000,22.000 L27.000,22.000 L27.000,28.000 L30.000,28.000 L30.000,29.000 L27.000,29.000 L27.000,32.000 L33.000,32.000 L33.000,9.000 Z";

/**
 * Aplica o novo icon conforme a temperatura, o seu valor maximo e o seu valor minimo
 * @param {Number} minValor - o valor mínimo que a temperatura pode apresentar
 * @param {Number} maxValor - o valor máximo que a temperatura pode apresentar
 * @param {Number} valor - o valor actual da temperatura 
 */
WrapperTermometro.prototype.atualizarSvgIcon = function(minValor, maxValor, valor) {

    var dominioSVG = 30;
    var svgMin = 10;
    var dominio = maxValor - minValor;

    var termometroPosicaoSvg = ((dominio - (valor - minValor)) * dominioSVG) / dominio + svgMin;

    this.path.setAttributeNS(null, 'd', WrapperTermometro.svgIconData.substring(0, WrapperTermometro.svgIconData.length - 37) + termometroPosicaoSvg +
        WrapperTermometro.svgIconData.substring(WrapperTermometro.svgIconData.length - 31, WrapperTermometro.svgIconData.length - 22) + termometroPosicaoSvg +
        WrapperTermometro.svgIconData.substring(WrapperTermometro.svgIconData.length - 16));

}

/**
 * Wrapper que apresenta a interface grafica de um termometro
 * @constructor
 * @param {Termometro} termometro - o termometro a representar
 * @extends WrapperEquipamentoIdentificado
 * @property {Number} temperatura - a temperatuda do termometro
 */
var WrapperDetetorFecho = (function() {

    var pathClasses = {
        'true': 'wrapper-icon-svg-path-idle',
        'false': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = {
        'false': "M45.000,48.000 L15.000,48.000 C13.895,48.000 13.000,47.105 13.000,46.000 L13.000,5.000 C13.000,3.895 13.895,3.000 15.000,3.000 L45.000,3.000 C46.105,3.000 47.000,3.895 47.000,5.000 L47.000,46.000 C47.000,47.105 46.105,48.000 45.000,48.000 ZM40.000,24.000 L38.000,24.000 L38.000,29.000 L40.000,29.000 L40.000,24.000 Z",
        'true': "M13.000,46.000 L13.000,5.000 C13.000,3.895 13.895,3.000 15.000,3.000 L45.000,3.000 C46.105,3.000 47.000,3.895 47.000,5.000 L47.000,46.000 C47.000,47.105 46.105,48.000 45.000,48.000 L36.000,48.000 L36.000,44.000 L43.000,44.000 L43.000,6.000 L19.000,6.000 L31.000,13.000 L31.000,57.000 L13.000,46.000 ZM27.000,29.000 L27.000,33.000 L29.000,35.000 L29.000,31.000 L27.000,29.000 Z"
    }

    return function(detetorFecho) {

        if (!(detetorFecho instanceof DetetorFecho))
            throw Error('O objeto recebido não é uma instancia da classe DetetorFecho');

        WrapperEquipamentoIdentificado.call(this, detetorFecho, 'Detetor-Fecho', svgIconData[detetorFecho.ligado]);

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses[detetorFecho.ligado]);

        detetorFecho.adicionarChangeListener(function(e) {
            path.setAttributeNS(null, 'class', pathClasses[detetorFecho.ligado]);
            path.setAttributeNS(null, 'd', svgIconData[detetorFecho.ligado]);
        });
    }
})();

WrapperDetetorFecho.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorFecho.prototype.constructor = WrapperDetetorFecho;


/**
 * Wrapper que apresenta a interface grafica de um detetor de movimento
 * @constructor
 * @param {DetetorMovimento} detetorMoviemnto - o detetor de movimento a representar
 * @extends WrapperEquipamentoIdentificado
 */
var WrapperDetetorMovimento = (function() {

    var pathClasses = {
        'true': 'wrapper-icon-svg-path-idle',
        'false': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = {
        'false': "M22.000,40.000 L31.000,40.000 C31.000,40.000 29.583,29.167 41.000,31.000 C41.000,31.000 44.583,33.667 40.000,36.000 C40.000,36.000 36.167,35.917 36.000,38.000 L36.000,40.000 L39.000,40.000 C39.000,40.000 39.561,47.007 36.000,47.000 C36.000,47.000 36.417,52.917 34.000,53.000 L27.000,53.000 C27.000,53.000 24.000,53.917 25.000,47.000 C25.000,47.000 22.167,47.083 22.000,44.000 L22.000,40.000 ZM30.000,37.000 L24.000,37.000 C24.000,37.000 23.167,34.083 20.000,33.000 C20.000,33.000 16.167,30.583 21.000,29.000 L35.000,24.000 C35.000,24.000 40.500,21.083 42.000,24.000 C42.000,24.000 41.667,26.250 36.000,28.000 C36.000,28.000 26.833,30.417 27.000,32.000 C27.000,32.000 31.583,35.167 30.000,37.000 ZM23.000,25.000 L39.000,19.000 C39.000,19.000 42.417,17.333 41.000,15.000 C41.000,15.000 40.750,12.417 36.000,14.000 L21.000,20.000 C21.000,20.000 16.500,21.250 19.000,24.000 C19.000,24.000 19.917,25.667 23.000,25.000 ZM20.000,11.000 L31.000,7.000 C31.000,7.000 34.083,5.333 35.000,8.000 C35.000,8.000 35.833,9.750 33.000,11.000 L23.000,15.000 C23.000,15.000 19.750,16.000 19.000,14.000 C19.000,14.000 18.000,12.083 20.000,11.000 Z",
        'true': "M57.500,26.800 L47.524,26.800 C46.695,26.800 46.024,26.128 46.024,25.300 L46.024,25.268 C46.024,24.440 46.695,23.768 47.524,23.768 L57.500,23.768 C58.328,23.768 59.000,24.440 59.000,25.268 L59.000,25.300 C59.000,26.128 58.328,26.800 57.500,26.800 ZM44.946,11.863 C44.230,12.282 43.314,12.033 42.900,11.308 C42.487,10.583 42.732,9.656 43.448,9.238 L52.093,4.185 C52.809,3.767 53.725,4.015 54.138,4.740 C54.552,5.465 54.306,6.392 53.590,6.811 L44.946,11.863 ZM44.331,38.106 L53.255,43.178 C53.994,43.599 54.247,44.529 53.820,45.257 C53.393,45.985 52.448,46.234 51.709,45.814 L42.786,40.742 C42.047,40.322 41.793,39.391 42.220,38.663 C42.647,37.935 43.592,37.686 44.331,38.106 ZM40.000,36.000 C40.000,36.000 36.167,35.917 36.000,38.000 L36.000,40.000 L39.000,40.000 C39.000,40.000 39.561,47.007 36.000,47.000 C36.000,47.000 36.417,52.917 34.000,53.000 L27.000,53.000 C27.000,53.000 24.000,53.917 25.000,47.000 C25.000,47.000 22.167,47.083 22.000,44.000 L22.000,40.000 L31.000,40.000 C31.000,40.000 29.583,29.167 41.000,31.000 C41.000,31.000 44.583,33.667 40.000,36.000 ZM36.000,28.000 C36.000,28.000 26.833,30.417 27.000,32.000 C27.000,32.000 31.583,35.167 30.000,37.000 L24.000,37.000 C24.000,37.000 23.167,34.083 20.000,33.000 C20.000,33.000 16.167,30.583 21.000,29.000 L35.000,24.000 C35.000,24.000 40.500,21.083 42.000,24.000 C42.000,24.000 41.667,26.250 36.000,28.000 ZM39.000,19.000 L23.000,25.000 C19.917,25.667 19.000,24.000 19.000,24.000 C16.500,21.250 21.000,20.000 21.000,20.000 L36.000,14.000 C40.750,12.417 41.000,15.000 41.000,15.000 C42.417,17.333 39.000,19.000 39.000,19.000 ZM33.000,11.000 L23.000,15.000 C23.000,15.000 19.750,16.000 19.000,14.000 C19.000,14.000 18.000,12.083 20.000,11.000 L31.000,7.000 C31.000,7.000 34.083,5.333 35.000,8.000 C35.000,8.000 35.833,9.750 33.000,11.000 ZM17.244,40.797 L8.304,45.816 C7.564,46.232 6.617,45.985 6.189,45.265 C5.762,44.545 6.015,43.624 6.756,43.208 L15.696,38.188 C16.436,37.772 17.383,38.019 17.811,38.739 C18.238,39.460 17.985,40.381 17.244,40.797 ZM15.080,12.219 L6.420,7.219 C5.702,6.805 5.457,5.887 5.871,5.170 C6.285,4.452 7.202,4.206 7.920,4.621 L16.580,9.621 C17.298,10.035 17.543,10.952 17.129,11.670 C16.715,12.387 15.798,12.633 15.080,12.219 ZM14.000,25.500 C14.000,26.328 13.328,27.000 12.500,27.000 L2.500,27.000 C1.672,27.000 1.000,26.328 1.000,25.500 C1.000,24.672 1.672,24.000 2.500,24.000 L12.500,24.000 C13.328,24.000 14.000,24.672 14.000,25.500 Z"
    }
    return function(detetorMovimento) {

        if (!(detetorMovimento instanceof DetetorMovimento))
            throw Error('O objeto recebido não é uma instancia da classe DetetorMovimento');

        WrapperEquipamentoIdentificado.call(this, detetorMovimento, 'Detetor-Movimento', svgIconData[detetorMovimento.acionado]);

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses[detetorMovimento.acionado]);

        detetorMovimento.adicionarChangeListener(function(e) {
            path.setAttributeNS(null, 'class', pathClasses[detetorMovimento.acionado]);
            path.setAttributeNS(null, 'd', svgIconData[detetorMovimento.acionado]);
        });
    }
})();

WrapperDetetorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorMovimento.prototype.constructor = WrapperDetetorMovimento;

/**
 * Wrapper que apresenta a interface grafica de um detetor de posicao de estore
 * @constructor
 * @param {DetetorPosicaoEstore} detetorPosicaoEstore - o detetor de posicao de estore a representar
 * @extends WrapperEquipamentoIdentificado
 */
var WrapperDetetorPosicaoEstore = (function() {


    var pathClasses = {
        'idle': 'wrapper-icon-svg-path-idle'
    };

    /**
     * Representa as posicoes que o estore pode ter
     */
    var POSICOES = {

        'ABERTO': 'Aberto',
        'UM_TERCO': 'A um terço',
        'MEIO_ABERTO': 'Meio aberto',
        'A_DOIS_TERCOS': 'A dois terços',
        'FECHADO': 'Fechado'

    };

    var svgIconData = {
        'ABERTO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM56.000,16.000 L56.000,34.000 L55.500,34.000 L55.000,34.000 L55.000,21.723 C54.865,21.801 54.720,21.863 54.566,21.909 C54.544,21.916 54.522,21.923 54.499,21.930 C54.338,21.971 54.173,22.000 54.000,22.000 L7.000,22.000 C5.895,22.000 5.000,21.105 5.000,20.000 L55.000,20.000 L55.000,16.000 L56.000,16.000 ZM56.000,34.500 L56.000,37.500 C56.000,37.776 55.776,38.000 55.500,38.000 C55.224,38.000 55.000,37.776 55.000,37.500 L55.000,34.500 C55.000,34.224 55.224,34.000 55.500,34.000 C55.776,34.000 56.000,34.224 56.000,34.500 ZM7.000,19.000 L7.000,16.000 L54.000,16.000 L54.000,19.000 L7.000,19.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
        'UM_TERCO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM56.000,16.000 L56.000,34.000 L55.500,34.000 L55.000,34.000 L55.000,29.723 C54.865,29.801 54.720,29.863 54.566,29.909 C54.544,29.916 54.522,29.923 54.499,29.930 C54.338,29.971 54.173,30.000 54.000,30.000 L7.000,30.000 C5.895,30.000 5.000,29.105 5.000,28.000 L55.000,28.000 L55.000,16.000 L56.000,16.000 ZM56.000,34.500 L56.000,37.500 C56.000,37.776 55.776,38.000 55.500,38.000 C55.224,38.000 55.000,37.776 55.000,37.500 L55.000,34.500 C55.000,34.224 55.224,34.000 55.500,34.000 C55.776,34.000 56.000,34.224 56.000,34.500 ZM7.000,16.000 L54.000,16.000 L54.000,19.000 L7.000,19.000 L7.000,16.000 ZM54.000,27.000 L7.000,27.000 L7.000,24.000 L54.000,24.000 L54.000,27.000 ZM7.000,20.000 L54.000,20.000 L54.000,23.000 L7.000,23.000 L7.000,20.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
        'MEIO_ABERTO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM55.000,16.000 L56.000,16.000 L56.000,34.000 L55.500,34.000 L55.000,34.000 L55.000,16.000 ZM56.000,34.500 L56.000,37.500 C56.000,37.776 55.776,38.000 55.500,38.000 C55.295,38.000 55.120,37.876 55.043,37.699 C55.043,37.699 55.043,37.699 55.043,37.699 C54.905,37.784 54.755,37.849 54.598,37.899 C54.569,37.908 54.541,37.918 54.512,37.926 C54.348,37.969 54.178,38.000 54.000,38.000 L7.000,38.000 C5.895,38.000 5.000,37.105 5.000,36.000 L55.000,36.000 L55.000,34.500 C55.000,34.224 55.224,34.000 55.500,34.000 C55.776,34.000 56.000,34.224 56.000,34.500 ZM7.000,16.000 L54.000,16.000 L54.000,19.000 L7.000,19.000 L7.000,16.000 ZM7.000,20.000 L54.000,20.000 L54.000,23.000 L7.000,23.000 L7.000,20.000 ZM7.000,24.000 L54.000,24.000 L54.000,27.000 L7.000,27.000 L7.000,24.000 ZM54.000,35.000 L54.000,35.000 L7.000,35.000 L7.000,35.000 L7.000,32.000 L54.000,32.000 L54.000,35.000 ZM7.000,28.000 L54.000,28.000 L54.000,31.000 L7.000,31.000 L7.000,28.000 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
        'A_DOIS_TERCOS': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM56.000,34.000 L55.500,34.000 L55.000,34.000 L55.000,16.000 L56.000,16.000 L56.000,34.000 ZM56.000,34.500 L56.000,37.500 C56.000,37.776 55.776,38.000 55.500,38.000 C55.224,38.000 55.000,37.776 55.000,37.500 L55.000,34.500 C55.000,34.224 55.224,34.000 55.500,34.000 C55.776,34.000 56.000,34.224 56.000,34.500 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM54.000,43.000 L54.000,43.000 L7.000,43.000 L7.000,43.000 L7.000,40.000 L54.000,40.000 L54.000,43.000 ZM54.000,39.000 L54.000,39.000 L7.000,39.000 L7.000,39.000 L7.000,36.000 L54.000,36.000 L54.000,39.000 ZM54.000,35.000 L54.000,35.000 L7.000,35.000 L7.000,35.000 L7.000,32.000 L54.000,32.000 L54.000,35.000 ZM54.000,31.000 L7.000,31.000 L7.000,28.000 L54.000,28.000 L54.000,31.000 ZM54.000,27.000 L7.000,27.000 L7.000,24.000 L54.000,24.000 L54.000,27.000 ZM7.000,16.000 L54.000,16.000 L54.000,19.000 L7.000,19.000 L7.000,16.000 ZM54.000,23.000 L7.000,23.000 L7.000,20.000 L54.000,20.000 L54.000,23.000 ZM54.000,46.000 L7.000,46.000 C5.895,46.000 5.000,45.105 5.000,44.000 L56.000,44.000 C56.000,45.105 55.105,46.000 54.000,46.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z",
        'FECHADO': "M57.500,15.000 L56.000,15.000 L56.000,9.000 L57.500,9.000 C58.328,9.000 59.000,9.672 59.000,10.500 L59.000,13.500 C59.000,14.328 58.328,15.000 57.500,15.000 ZM56.000,34.000 L55.500,34.000 L55.000,34.000 L55.000,16.000 L56.000,16.000 L56.000,34.000 ZM56.000,34.500 L56.000,37.500 C56.000,37.776 55.776,38.000 55.500,38.000 C55.224,38.000 55.000,37.776 55.000,37.500 L55.000,34.500 C55.000,34.224 55.224,34.000 55.500,34.000 C55.776,34.000 56.000,34.224 56.000,34.500 ZM6.000,8.000 L55.000,8.000 L55.000,15.000 L6.000,15.000 L6.000,8.000 ZM54.000,51.000 L7.000,51.000 L7.000,48.000 L54.000,48.000 L54.000,51.000 ZM54.000,47.000 L7.000,47.000 L7.000,44.000 L54.000,44.000 L54.000,47.000 ZM54.000,43.000 L54.000,43.000 L7.000,43.000 L7.000,43.000 L7.000,40.000 L54.000,40.000 L54.000,43.000 ZM54.000,39.000 L54.000,39.000 L7.000,39.000 L7.000,39.000 L7.000,36.000 L54.000,36.000 L54.000,39.000 ZM54.000,35.000 L54.000,35.000 L7.000,35.000 L7.000,35.000 L7.000,32.000 L54.000,32.000 L54.000,35.000 ZM54.000,31.000 L7.000,31.000 L7.000,28.000 L54.000,28.000 L54.000,31.000 ZM54.000,27.000 L7.000,27.000 L7.000,24.000 L54.000,24.000 L54.000,27.000 ZM7.000,16.000 L54.000,16.000 L54.000,19.000 L7.000,19.000 L7.000,16.000 ZM54.000,23.000 L7.000,23.000 L7.000,20.000 L54.000,20.000 L54.000,23.000 ZM56.000,52.000 C56.000,53.105 55.105,54.000 54.000,54.000 L7.000,54.000 C5.895,54.000 5.000,53.105 5.000,52.000 L5.000,52.000 L56.000,52.000 L56.000,52.000 ZM2.000,13.500 L2.000,10.500 C2.000,9.672 2.672,9.000 3.500,9.000 L5.000,9.000 L5.000,15.000 L3.500,15.000 C2.672,15.000 2.000,14.328 2.000,13.500 Z"
    }

    return function(detetorPosicaoEstore) {

        if (!(detetorPosicaoEstore instanceof DetetorPosicaoEstore))
            throw Error('O objeto recebido não é uma instancia da classe DetetorPosicaoEstore');

        WrapperEquipamentoIdentificado.call(this, detetorPosicaoEstore, 'Detetor-Estore', svgIconData[detetorPosicaoEstore.posicao]);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-posicao-estore');

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses['idle']);

        detetorPosicaoEstore.adicionarChangeListener(function(e) {
            path.setAttributeNS(null, 'd', svgIconData[detetorPosicaoEstore.posicao]);
        });
    }

})();

WrapperDetetorPosicaoEstore.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorPosicaoEstore.prototype.constructor = WrapperDetetorPosicaoEstore;

/**
 * Wrapper que apresenta a interface grafica de um detetor de incendio
 * @constructor
 * @param {DetetorIncendio} detetorIncendio - o detetor de icendio a representar
 * @extends WrapperEquipamentoIdentificado
 */
var WrapperDetetorIncendio = (function() {

    var pathClasses = {
        'true': 'wrapper-icon-svg-path-working',
        'false': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = "M49.585,50.011 L40.607,40.607 C40.607,40.607 44.940,37.427 45.000,30.000 C45.057,22.897 40.961,19.760 40.961,19.760 L50.225,10.636 C55.041,15.665 57.920,22.487 58.000,30.000 C58.143,43.412 49.585,50.011 49.585,50.011 ZM30.000,37.000 C26.134,37.000 23.000,33.866 23.000,30.000 C23.000,26.134 26.134,23.000 30.000,23.000 C33.866,23.000 37.000,26.134 37.000,30.000 C37.000,33.866 33.866,37.000 30.000,37.000 ZM10.779,50.360 C5.373,45.256 2.090,39.593 2.000,30.000 C1.881,17.231 10.273,10.129 10.273,10.129 L19.393,19.393 C19.393,19.393 14.739,22.435 15.000,30.000 C15.257,37.468 19.755,40.956 19.755,40.956 L10.779,50.360 Z";
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    var beepIntervalo = 300;
    var beepTempo = 5000;

    function beep() {
        snd.play();
    }

    return function(detetorIncendio) {

        if (!(detetorIncendio instanceof DetetorIncendio))
            throw Error('O objeto recebido não é uma instancia da classe DetetorIncendio');

        WrapperEquipamentoIdentificado.call(this, detetorIncendio, 'Detetor-Incendio', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' detetor-incendio');

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses[detetorIncendio.acionado]);

        detetorIncendio.adicionarChangeListener(function(e) {

            path.setAttributeNS(null, 'class', pathClasses[detetorIncendio.acionado]);

            if (detetorIncendio.acionado) {

                var intervalId = setInterval(function() {

                        if (detetorIncendio.acionado) {
                            beep();
                        }
                        else
                            clearInterval(intervalId);
                    },
                    beepIntervalo);

                setTimeout(function() {
                    clearInterval(intervalId);
                }, beepTempo);

            }
        });
    }
})();

WrapperDetetorIncendio.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperDetetorIncendio.prototype.constructor = WrapperDetetorIncendio;

/**
 * Wrapper que apresenta a interface grafica de um simulador de incendio
 * @constructor
 * @param {GeradorIncendio} geradorIncendio - o simulador de icendio a representar
 * @extends WrapperEquipamentoIdentificado
 */
var WrapperGeradorIncendio = (function() {

    var pathClasses = {
        'true': 'wrapper-icon-svg-path-working',
        'false': 'wrapper-icon-svg-path-idle'
    };

    var svgIconData = "M23.000,54.000 C23.000,54.000 5.960,46.415 14.000,29.000 C14.000,29.000 24.054,15.889 25.000,5.000 C25.000,5.000 41.021,17.166 45.000,30.000 C50.676,48.307 35.000,54.000 35.000,54.000 C35.000,54.000 49.705,38.025 31.000,22.000 C31.000,22.000 32.744,32.733 28.000,38.000 C28.000,38.000 26.347,32.451 23.000,31.000 C23.000,31.000 24.081,34.490 20.000,39.000 C20.000,39.000 15.638,45.386 23.000,54.000 Z";

    return function(geradorIncendio) {

        if (!(geradorIncendio instanceof GeradorIncendio))
            throw Error('O objeto recebido não é uma instancia da classe GeradorIncendio');

        WrapperEquipamentoIdentificado.call(this, geradorIncendio, 'Gerador-Incendio', svgIconData);
        this.elemento.setAttribute('class', this.elemento.getAttribute('class') + ' gerador-incendio');

        var path = this.path;
        path.setAttributeNS(null, 'class', pathClasses[geradorIncendio.temFogo]);

        this.icon.addEventListener('click', function(e) {
            geradorIncendio.commutar();
        });

        geradorIncendio.adicionarChangeListener(function(e) {
            path.setAttributeNS(null, 'class', pathClasses[geradorIncendio.temFogo]);
        });

    }
})();

WrapperGeradorMovimento.prototype = Object.create(WrapperEquipamentoIdentificado.prototype);
WrapperGeradorMovimento.prototype.constructor = WrapperGeradorMovimento;

/**
 * O map para guardar as associações entre equipamento e wrapper 
 */
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

/**
 * funcao que permite associar objeto a wrapper
 */
function wrapEquipamento(equipamento) {

    for (var chave of wrapMap.keys()) {
        if (equipamento instanceof chave)
            return new(wrapMap.get(chave))(equipamento);
    }

}

var equipamentoMap = new Map();
equipamentoMap.set("MotorEletrico", MotorEletrico);
equipamentoMap.set("TrincoEletrico", TrincoEletrico);
equipamentoMap.set("GeradorMovimento", GeradorMovimento);
equipamentoMap.set("ArCondicionado", ArCondicionado);
equipamentoMap.set("GeradorIncendio", GeradorIncendio);
equipamentoMap.set("DetetorPosicaoEstore", DetetorPosicaoEstore);
equipamentoMap.set("DetetorFecho", DetetorFecho);
equipamentoMap.set("DetetorMovimento", DetetorMovimento);
equipamentoMap.set("Termometro", Termometro);
equipamentoMap.set("DetetorIncendio", DetetorIncendio);


function getEquipamento(equipamento) {

    for (var chave of equipamentoMap.keys()) {
        if (equipamento == chave)
            return new(equipamentoMap.get(chave))();
    }

}




/**
 * Painel genérico, inclui a user interface que é partilhada por todos os paineis
 * @constructor
 * @param {Object} titular - objeto que tem uma propriedade 'nome'
 * 
 * @property {HTMLElement} elemento - elemento root
 * @property {HTMLElement} tituloHTML - titulo do painel
 * @property {HTMLElement} subTituloHTML - subtitulo do painel
 * @property {HTMLElement} listaHTML - lista de conteúdo do painel
 * 
 * @property {HTMLElement} botaoCriar - botão de criar conteúdo para o painel
 * @property {HTMLElement} botaoRemover - botão de remover conteúdo para o painel
 * @property {HTMLElement} botaoSelecionarTudo - botão de selecionar todo o conteúdo do painel
 */
var Painel = function(titular) {

    var textoBotaoCriar = "Criar";
    var textoBotaoRemover = "Remover";
    var textoBotaoSelecionarTudo = "Selecionar tudo";

    this.elemento = document.createElement('div');

    this.tituloHTML = document.createElement('h2');
    this.tituloHTML.setAttribute('class', 'title');

    this.tituloHTML.onclick = function(e) {

        var parent = this.elemento;
        var caixaTextoAlterarNome = document.createElement('input');

        parent.replaceChild(caixaTextoAlterarNome, this.tituloHTML);

        if (titular)
            caixaTextoAlterarNome.value = titular.nome || 'Sem nome';
        else
            caixaTextoAlterarNome.value = 'Sem nome';

        caixaTextoAlterarNome.focus();

        caixaTextoAlterarNome.onblur = function(e) {

            titular.nome = caixaTextoAlterarNome.value;
            parent.replaceChild(this.tituloHTML, caixaTextoAlterarNome);

        }.bind(this);

        caixaTextoAlterarNome.onkeypress = function(event) {

            var enterKeyCode = 13;

            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                caixaTextoAlterarNome.blur();
                return false;
            }
            return true;

        }.bind(this);


    }.bind(this);


    this.subTituloHTML = document.createElement('h4');
    this.subTituloHTML.setAttribute('class', 'subTitle');

    this.listaHTML = document.createElement('ul');

    this.botaoCriar = document.createElement("button");
    this.botaoCriar.textContent = textoBotaoCriar;

    this.botaoRemover = document.createElement("button");
    this.botaoRemover.textContent = textoBotaoRemover;

    this.botaoSelecionarTudo = document.createElement("button");
    this.botaoSelecionarTudo.textContent = textoBotaoSelecionarTudo;

    this.elemento.appendChild(this.tituloHTML);
    this.elemento.appendChild(this.subTituloHTML);
    this.elemento.appendChild(this.listaHTML);
    this.elemento.appendChild(this.botaoCriar);
    this.elemento.appendChild(this.botaoRemover);
    this.elemento.appendChild(this.botaoSelecionarTudo);

}

/**
 * Aplica este painel ao elemento recebido, o conteúdo do elemento será totalmente apagado
 * @param {HTMLElement} elemento - elemento a aplicar o painel
 */
Painel.prototype.aplicar = function(elemento) {

    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }

    elemento.appendChild(this.elemento);

}


/**
 * Painel que faz a gestão dos equipamentos de um compartimento
 * @constructor
 * @extends Painel
 * @param {Compartimento} compartimento - A compartimento que irá ser gerida pelo painel
 * @property {HTMLElement} tabelaEquipamentos - tabela de equipamentos
 */
var PainelMonitorizacao = function(compartimento) {

    this.elemento = document.createElement("div");
    this.elemento.setAttribute('class', 'painel-monitorizacao');
    this.tabelaEquipamentos = document.createElement('table');
    this.tabelaEquipamentos.setAttribute('class', 'tabela-equipamentos');
    this.botaoVoltar = document.createElement("button");
    this.botaoVoltar.textContent = "Voltar";

    var that = this;
    this.botaoVoltar.onclick = function(e) {
        //todo:aqui meter o ajax
        
        window.location.href="/Painel.aspx?com_id="+compartimento.id;
        
    }

    var linhaHTML;
    var equipamentosPorLinha = 4;
    var maxEquipamentosPorLinha = 6;
    var minEquipamentosPorLinha = 4;

    for (var j = maxEquipamentosPorLinha; j > minEquipamentosPorLinha; j--) {

        if (compartimento.equipamentos.length % j === 0) {
            equipamentosPorLinha = j;
            break;
        }
    }

    for (var i = 0, j = 0; i < compartimento.equipamentos.length; i++) {

        if (j == 0) {
            linhaHTML = document.createElement('tr');
            this.tabelaEquipamentos.appendChild(linhaHTML);
        }

        var dadosHTML = document.createElement('td');
        var equipamento = compartimento.equipamentos[i];
        var wrapperEquipamento = wrapEquipamento(equipamento);

        dadosHTML.appendChild(wrapperEquipamento.elemento);
        linhaHTML.appendChild(dadosHTML);

        j = (j + 1) % equipamentosPorLinha;

    }

    this.elemento.appendChild(this.tabelaEquipamentos);
    this.elemento.appendChild(this.botaoVoltar);

}

PainelMonitorizacao.prototype = Object.create(Painel.prototype);
PainelMonitorizacao.prototype.constructor = PainelMonitorizacao;
