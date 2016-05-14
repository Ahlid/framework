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
Alteravel.prototype.enviarChangeEvent = function(event) {
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
                this.enviarChangeEvent();
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
        this.enviarChangeEvent();

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

    this.enviarChangeEvent();

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
                    this.enviarChangeEvent();
                }
                else {
                    nome = newValue;
                    this.enviarChangeEvent();
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
        this.enviarChangeEvent();
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
            this.enviarChangeEvent();
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
                    this.enviarChangeEvent();
                }
                else {
                    nome = newValue;
                    this.enviarChangeEvent();
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
        this.enviarChangeEvent();
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
        this.enviarChangeEvent();
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
    this.enviarChangeEvent();
    this.compartimento.adicionarEquipamento(this);

}

Equipamento.prototype.isChildOf = function(compartimento) {

    return this.compartimento === compartimento;

}

Equipamento.prototype.removerCompartimento = function() {

    if (this.compartimento !== void 0) {

        var compartimento = this.compartimento;
        this.compartimento = void 0;
        this.enviarChangeEvent();
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
