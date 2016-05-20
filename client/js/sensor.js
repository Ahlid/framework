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
Termometro.maxTemperatura = 55;
Termometro.minTemperatura = -55;

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