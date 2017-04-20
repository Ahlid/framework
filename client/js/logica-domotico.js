/**
 * Representa um objeto que pode ser alteravel.
 * Esta classe possibilita registar eventos de alteração
 * @constructor
 * 
 * @property {Array} handlers - Array de funções handler que tratam de eventos onchange
 */
var Alteravel = (function() {

    return function Alteravel() {
        this.handlers = []; //cuidado com os acessos
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
 * Representa um sistema domotico
 * @constructor
 * @param {String} nome - O nome do sistema domotico
 * @property {String} nome - nome do sistema domotico
 * @property {Array} consolas - array de consolas do sistema domotico
 */
function Domotico(nome) {

    Alteravel.call(this);
    
    nome = (nome && /\S/.test(nome)) ? nome : "Sistema Domótico";
    this.consolas = [];

    Object.defineProperty(this, 'nome', {

        enumerable: true,
        configurable: false,
        get: function() {
            return nome;
        },
        set: function(newValue) {
            if (newValue && /\S/.test(newValue)) {
                nome = newValue;
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
 * @returns {Boolean} true se já existe uma consola com esse nome no sistema false se não
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

    this.consolas.forEach(function(consola, indice, consolas) {

        if (consola.nome == nome)
            consolas.splice(indice, 1);

    });

    this.enviarEventoAlterado();

}

/**
 * Representa uma consola do sistema domotico
 * @constructor
 * @param {String} nome - O nome da consola
 * @param {Domotico} domotico - O sistema domotico
 * @property {String} nome - nome da consola
 * @property {Array} compartimentos - compartimentos da consola
 * 
 */
function Consola(nome, domotico) {

    if (nome == void 0 || !(/\S/.test(nome))) 
        throw Error('Nome não pode ser vazio');

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
                } else {
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
 * @returns {Boolean} true se existe um departamento com o nome recebido na consola, false se não
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
/**
 * Associa a consola a um sistema domotico se o mesmo for valido e ja nao contiver uma consola com o mesmo nome
 * @param {Domotico} domotico - O sistema domotico
 */
Consola.prototype.setSistema = function(domotico) {
    if (domotico !== void 0 && !domotico.hasConsola(this.nome)) {
        this.domotico = domotico;
    }
}


/**
 * Representa um compartimento
 * @constructor
 * @param {String} nome - O nome do sistema domotico
 * @param {Consola} consola - A consola onde vai ser adicionado
 * @property {Array} equipamentos - equipamentos do compartimento
 * @property {String} nome - nome do compartimento
 */
function Compartimento(nome, consola) {
    
    if (nome == void 0 || !(/\S/.test(nome))) 
        throw Error('Nome não pode ser vazio');
    
    Alteravel.call(this);
    
    this.consola = consola !== void 0 && consola.hasCompartimento(nome) ? null : consola;
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


/**
 * Metodo que adiciona um equipamento ao compartimento desde que este seja valido
 * e mete o compartimento associado no equipamento
 * @param {Equipamento} equipamento - O equipamento a adicionar
 */
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



/**
 * Metodo que remove um equipamento ao compartimento desde que este seja valido
 * e o compartimento deixa de ficar associado no equipamento
 * @param {String} nome - nome do equipamento a remover
 */
Compartimento.prototype.removerEquipamento = function(nome) {

    var equipamento = this.getEquipamento(nome);
    
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
    
/**
 * Metodo que remove um equipamento ao compartimento desde que este seja valido
 * e o compartimento deixa de ficar associado no equipamento
 * @param {String} nome - nome do equipamento a remover
 */
Compartimento.prototype.removerEquipamentos = function(equipamentos) {
  
 if (equipamentos === void 0)
        return;

    for (var i = 0; i < equipamentos.length; i++) {
        
        var equipamento = this.getEquipamento(equipamentos[i]);
        
        if (equipamento === void 0)
            return;

        if (equipamento.compartimento === this)
            equipamento.removerCompartimento();

        var index = this.equipamentos.indexOf(equipamento);

        if (index != -1) {
            this.equipamentos.splice(index, 1);
           
        }


    }

    this.enviarEventoAlterado();

}    

/**
 * Metodo que recebe o nome de um equipamento e caso ele exista é devovlido
 * @param {String} nome - nome do equipamento a procurar
 */
Compartimento.prototype.getEquipamento = function(nome) {
    
    for (var i = 0; i < this.equipamentos.length; i++) {
    
        if(this.equipamentos[i].nome === nome)
            return this.equipamentos[i];
        
    }
    
    return void 0;
    
}



/**
 * Representa um Equipamento
 * @constructor
 * @param {String} nome - O nome do equipamento
 * @param {Compartimento} compartimento - o compartimento onde vai ser posto
 * @property {String} nome - nome do equipamento
 * @property {Compartimento} compartimento - compartimento associado
 */
var Equipamento = (function() {

    return function(nome, compartimento) {
        
        if (nome == void 0 || !(/\S/.test(nome))) 
            throw Error('Nome não pode ser vazio');
        
        Alteravel.call(this);
        
        this.nome = nome;
        this.compartimento = compartimento || null;

    }

})();

Equipamento.prototype = Object.create(Alteravel.prototype);
Equipamento.prototype.constructor = Equipamento;


/**
 * Metodo que associa um compartimento ao equipamento, se o mesmo for valido
 * @param {Compartimento} compartimento - o compartimento onde vai ser posto
 */
Equipamento.prototype.setCompartimento = function(compartimento) {

    if (compartimento === void 0)
        return;

    if (this.compartimento && (this.compartimento !== compartimento)) {
        this.compartimento.removerEquipamento(this);
    }

    this.compartimento = compartimento;
    this.enviarEventoAlterado();
    this.compartimento.adicionarEquipamento(this);

}


/**
 * Metodo que Verifica se o equipamento esta associado a um compartimento
 * @param {Compartimento} compartimento - o compartimento que vai verificar se é onde está
 */
Equipamento.prototype.isChildOf = function(compartimento) {
    return this.compartimento === compartimento;
}

/**
 * Metodo que Retira o equipamento do compartimento atual caso esteja associado a um
 */
Equipamento.prototype.removerCompartimento = function() {

    if (this.compartimento !== void 0) {

        var compartimento = this.compartimento;
        this.compartimento = void 0;
        this.enviarEventoAlterado();
        compartimento.removerEquipamento(this);

    }

}
