/**
 * Objeto que representa todos os equipamentos que sao sensores (que sofrem atuações no comparimento)
 * @constructor
 * @extends Equipamento
 * @param {String} nome - O nome do equipamento (a sua identificação)
 * @param {Compartimento} compartimento - O compartimento onde o sensor se encontra inserido
 */
function Sensor(nome, compartimento) {

    Equipamento.call(this, nome, compartimento);

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
    
    var ultimoId = 0;
    var sigla = "TM"

    return function Termometro(compartimento) {

        var nome = sigla + (++ultimoId);

        Sensor.call(this, nome, compartimento);

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
 * Objeto que representa um detetor de incendio
 * @constructor
 * @extends Sensor
 * @param {Compartimento} compartimento - O compartimento onde o atuador se encontra inserido
 * @property {Boolean} acionado - o estado do detetor 
 */
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