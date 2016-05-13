
var POSICOES = {

    'ABERTO': 'Aberto',
    'UM_TERCO': 'A um terço',
    'MEIO_ABERTO': 'Meio aberto',
    'A_DOIS_TERCOS': 'A dois terços',
    'FECHADO': 'Fechado'

};


function Consola() {

    this.compartimentos = []; //Todo: cuidado com os acessos

}

Consola.prototype.criarCompartimento = function(nome) {
    
    var hasNomeCompartimento = this.compartimentos.filter(function(compartimento){
        return compartimento.nome == nome;
    }).length > 0;
    
    
    if(!hasNomeCompartimento){
        var compartimento = new Compartimento(nome);
        this.compartimentos.push(compartimento);
    }
    

}

Consola.prototype.apagarCompartimento = function(nome) {

    this.compartimentos.foreach(function(index, compartimento, array) {

        if (compartimento.nome == nome) {
            array.splice(index, 1);
        }

    });

}

/**
 * 
 * 
 * 
 * 
 * 
 * */




function Compartimento(nome) {

    //Todo: Validações

    this.nome = nome;
    this.equipamentos = []; //Todo: cuidado com os acessos

}

Compartimento.prototype.adicionarEquipamento = function(equipamento) {

    if (equipamento === void 0)
        return;

    if (this.equipamentos.indexOf(equipamento) == -1)
        this.equipamentos.push(equipamento);

    if (!equipamento.isChildOf(this))
        equipamento.setCompartimento(this);

}

Compartimento.prototype.removerEquipamento = function(equipamento) {

    if (equipamento === void 0)
        return;

    if (equipamento.compartimento === this)
        equipamento.removerCompartimento();

    var index = this.equipamentos.indexOf(equipamento);

    if (index != -1)
        this.equipamentos.splice(index, 1);
        
}

function Equipamento(nome, compartimento) {

    //Todo: Validações

    this.nome = nome;
    this.compartimento = compartimento; //Todo: cuidado com os acessos

}



/**
 * 
 * 
 * 
 * 
 * 
 * */
Equipamento.prototype.setCompartimento = function(compartimento) {
    
    
    if (compartimento === void 0)
        return;

    if (this.compartimento && (this.compartimento !== compartimento)) {
        //remoção
        this.compartimento.removerEquipamento(this);
    }

    this.compartimento = compartimento;
    this.compartimento.adicionarEquipamento(this);

}

Equipamento.prototype.isChildOf = function(compartimento) {

    return this.compartimento === compartimento;

}

Equipamento.prototype.removerCompartimento = function() {

    if (this.compartimento !== void 0) {

        var compartimento = this.compartimento;
        this.compartimento = void 0;
        compartimento.removerEquipamento(this);

    }

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
function ImpactoGeral(nome, compartimento) {
    Atuador.call(this, nome, compartimento);
}

ImpactoGeral.prototype = Object.create(Atuador.prototype);
ImpactoGeral.prototype.constructor = ImpactoGeral;
/**
 * 
 * 
 * 
 * 
 * 
 * */
function ImpactoLocal(sigla, sensoresValidos, compartimento, sensor) {
    
    //todo: Lançar exceção quando o nome e ou o sensoresValidos são undefined
    
    
    Atuador.call(this, sigla, compartimento);
    
    console.log(sensoresValidos);
    
    var hasSensorValido = sensoresValidos.filter(function(classeSensor){
        return sensor instanceof classeSensor;
    }).length > 0;
    
    this.sensor = hasSensorValido ? sensor : void 0;
        
    this.sensoresValidos = sensoresValidos; //todo:restriçoes
}
ImpactoLocal.prototype = Object.create(Atuador.prototype);
ImpactoLocal.prototype.constructor = ImpactoLocal;

ImpactoLocal.prototype.setSensor = function(sensor) {
    if (this.compartimento != void 0) {
        var equipamentosCompartimento = this.compartimento.equipamentos;

        var isValido = this.sensoresValidos.filter(function(element){
            
            return sensor instanceof element;
            
        }).length;
        
        if(isValido){
            if (equipamentosCompartimento.indexOf(sensor) != -1)
                this.sensor = sensor;
        }
    }

}
ImpactoLocal.prototype.removerSensor = function() {
    this.sensor = void 0;
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
        ImpactoGeral.call(this, nome, compartimento);

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

                if (minTemperature < newValue && newValue < maxTemperature)
                    temperatura = newValue;

            }

        });

    };

}());

ArCondicionado.prototype = Object.create(ImpactoGeral.prototype);
ArCondicionado.prototype.constructor = ArCondicionado;

ArCondicionado.prototype.setTemperatura = function(temperatura) {

    if (temperatura)
        this.temperatura = temperatura;

}
ArCondicionado.prototype.ligar = function() {
    if (this.compartimento != void 0) {
        var equipamentosCompartimento = this.compartimento.equipamentos;

        equipamentosCompartimento.foreach(function(element, index, array) {
            if (element instanceof Termometro) {
                element.temperatura = this.temperatura;
            }
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
var GeradorMovimento = (function() {

    var ultimoId = 0;
    var movimento = false;
    var sigla = 'GM';
    
    return function(compartimento) {
        
        this.movimento = movimento;
        var nome = sigla + (++ultimoId);
        ImpactoGeral.call(this, nome, compartimento);

    };

})();

GeradorMovimento.prototype = Object.create(ImpactoGeral.prototype);
GeradorMovimento.prototype.constructor = GeradorMovimento;

GeradorMovimento.prototype.gerarMovimento = function() {
    if (this.compartimento != void 0) {

        this.movimento = true; // o gerador fica em moviemento
        var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos do compartimento

        equipamentosCompartimento.foreach(function(element, index, array) { //por cada equipamento se for um Detetor de movimento devemos aciona-lo
            if (element instanceof DetetorMovimento)
                element.acionar();

        });

    }
}
GeradorMovimento.prototype.pararMovimento = function() {
    if (this.compartimento != void 0) { //se tiver em algum compartimento
        this.movimento = false; //o gerador deixa de gerar movimento

        var equipamentosCompartimento = this.compartimento.equipamentos; //vamos obter os equipamentos
        //todo:verificar o codigo repetido
        //vamos agora verificar se algum gerador ainda está em movimento
        equipamentosCompartimento.foreach(function(element, index, array) {
            if (element instanceof GeradorMovimento) {
                if (element.movimento) {

                    array.foreach(function(element, index, array) { //por cada equipamento se for um Detetor de movimento devemos aciona-lo
                        if (element instanceof DetetorMovimento) {
                            element.acionar();
                        }
                    });

                    return;
                }
            }
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
var Termometro = (function() {

    var ultimoId = 0;
    var sigla = "TM"
    return function(compartimento) {

        var nome = sigla + (++ultimoId);

        Sensor.call(this,nome, compartimento);

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

                }

            }

        });



    };

})();

Termometro.prototype = Object.create(Sensor.prototype);
Termometro.prototype.constructor = Termometro;

Termometro.prototype.setTemperatura=function(temperatura){
    if(temperatura != void 0){
        this.temperatura=temperatura;
    }
}

/**
 *
 * 
 * 
 * 
 * 
 * */
var DetetorMovimento = (function() {

    var ultimoId = 0;
    var temMovimento = false;
    var sigla = "DM"; 
    return function(compartimento) {
        this.temMovimento=temMovimento;
        var nome = sigla + (++ultimoId);
        Sensor.call(this,nome, compartimento);

    };

})();

DetetorMovimento.prototype = Object.create(Sensor.prototype);
DetetorMovimento.prototype.constructor = DetetorMovimento;

DetetorMovimento.prototype.acionar = function() {
    this.temMovimento = true;
}
DetetorMovimento.prototype.desligar = function() {
    this.temMovimento = false;
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
    var sigla = "DE";
    return function(compartimento) {
        var nome =  sigla  + (++ultimoId);
        this.ligado = false;
        Sensor.call(this, nome, compartimento);
    };

})();

DetetorFecho.prototype = Object.create(Sensor.prototype);
DetetorFecho.prototype.constructor = DetetorFecho;
DetetorFecho.prototype.setEstado = function(ligado) {
    this.ligado = ligado;
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
    var sigla="EE";
    return function(compartimento) {

        var nome = sigla+ (++ultimoId);
        this.posicao = POSICOES.hasOwnProperty('ABERTO') ? 'ABERTO' : Object.keys(POSICOES)[0];
        Sensor.call(this, nome, compartimento);

    };

})();

DetetorPosicaoEstore.prototype = Object.create(Sensor.prototype);
DetetorPosicaoEstore.prototype.constructor = DetetorPosicaoEstore;

DetetorPosicaoEstore.prototype.setPosicao = function(posicao) {
    
    if (POSICOES.hasOwnProperty(posicao))
        this.posicao = posicao;

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
        var ligado = false;
       

        ImpactoLocal.call(this, nome, sensoresValidos, compartimento, sensor);

    };

})();
TrincoEletrico.prototype = Object.create(ImpactoLocal.prototype);
TrincoEletrico.prototype.constructor = TrincoEletrico;
TrincoEletrico.prototype.commutar = function() {

    this.ligado = !this.ligado;
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
    var listaSensores=[DetetorPosicaoEstore];
    var ultimoId = 0;
    var sigla = 'ME';
    return function(compartimento, sensor) {

        var nome= sigla + (++ultimoId);
        
        this.posicao = POSICOES.ABERTO;
        ImpactoLocal.call(this, nome, compartimento,sensor,listaSensores);

    };

})();

MotorEletrico.prototype = Object.create(ImpactoLocal.prototype);
MotorEletrico.prototype.constructor = MotorEletrico;


MotorEletrico.prototype.aplicar = function() {

    this.sensor.setPosicao(this.posicao);

}
MotorEletrico.prototype.setPosicao=function(posicao){
    if(POSICOES.hasOwnProperty(posicao)){
        this.posicao=posicao;
    }
}




