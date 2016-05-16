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
                    this.enviarChangeEvent();
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
        this.enviarChangeEvent();
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
        this.enviarChangeEvent();
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
    this.enviarChangeEvent();
    
    if(this.sensor !== void 0)
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
                    this.enviarChangeEvent();

                }

            }

        });


    };

})();

MotorEletrico.prototype = Object.create(EquipamentoImpactoLocal.prototype);
MotorEletrico.prototype.constructor = MotorEletrico;
MotorEletrico.prototype.aplicar = function() {
    
    if(this.compartimento!= void 0 && this.sensor !== void 0){
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
        this.enviarChangeEvent();
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
            this.enviarChangeEvent();
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