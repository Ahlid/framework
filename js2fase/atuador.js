/**
 * Objeto que representa todos os equipamentos que sao atuadores (que atuam no comparimento)
 * @constructor
 * @extends Equipamento
 * @param {String} nome - O nome do equipamento (a sua identificação)
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 */
function Atuador(nome, compartimento) {

    Equipamento.call(this, nome, compartimento);

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
function EquipamentoImpactoGeral(nome, compartimento) {

    Atuador.call(this, nome, compartimento);

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
function EquipamentoImpactoLocal(nome, sensoresValidos, compartimento, sensor) {

    if(nome ==void 0){
        throw Error("Nome undefined");
    }
    if(sensoresValidos ==void 0){
        throw Error("Deve inserir os sensores validos");
    }

    Atuador.call(this, nome, compartimento);

    this.sensoresValidos = sensoresValidos;
    this.sensor = this.sensoresValidos.some(classeSensor => sensor instanceof classeSensor) ? sensor : void 0; //todo:restriçoes

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

        var isValido = this.sensoresValidos.some(element => sensor instanceof element);

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
    return this.sensoresValidos.some(classeSensor => sensor instanceof classeSensor);
}


/**s
 * Objeto que representa um ar condicionado
 * @constructor
 * @extends EquipamentoImpactoGeral
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @param {Number} temperatura - a temperatura do ar condicionado, por default é 25  caso este parametro for indefenido
 * @property {Number} temperatura - a temperatura actual do ar condicionado
 */
var ArCondicionado = (function() {

    var ultimoId = 0;
    var sigla = 'AC';
    

    return function ArCondicionado(compartimento, temperatura) {

        var nome = sigla + (++ultimoId);
        EquipamentoImpactoGeral.call(this, nome, compartimento);

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
 * Objeto que representa um trinco eletrico
 * @constructor
 * @extends EquipamentoImpactoLocal
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @param {Sensor} sensor - O sensor sobre o qual o trinco esta a atuar
 * @property {Boolean} ligado - boolean que indica se o trinco esta ligado (true) ou nao (false)
 */
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
/**
 * Metodo que vai commutar o estado do trinco, se tiver ligado desliga-o, se nao liga-o
 */ 
TrincoEletrico.prototype.commutar = function() {

    this.ligado = !this.ligado;
    this.enviarEventoAlterado();
    
    if(this.sensor !== void 0)
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
/**
 * Metodo que aplica a posicao do motor ao detetor a que está associado 
 */ 
MotorEletrico.prototype.aplicar = function() {
    
    if(this.compartimento!= void 0 && this.sensor !== void 0){
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