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
                    this.enviarChangeEvent();
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
    this.enviarChangeEvent();

}
DetetorMovimento.prototype.desligar = function() {

    this.acionado = false;
    this.enviarChangeEvent();

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
    this.enviarChangeEvent();

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
                    this.enviarChangeEvent();

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
    this.enviarChangeEvent();

}
DetetorIncendio.prototype.desligar = function() {

    this.acionado = false;
    this.enviarChangeEvent();

}