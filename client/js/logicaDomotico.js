function Alteravel() {

    this.changeHandlers = [];
}

Alteravel.prototype.adicionarChangeListener = function(listener) {

    this.changeHandlers.push(listener);

}

Alteravel.prototype.enviarChangeEvent = function(event) {
    this.changeHandlers.forEach(function(handler) {
        handler(event);
    });
}



function Domotico(nome) {
    Alteravel.call(this);
    var aux = nome || "Sistema Domótico"
    Object.defineProperty(this, 'nome', {

        enumerable: true,
        configurable: false,
        get: function() {
            return aux;
        },
        set: function(newValue) {


            aux = newValue;
            this.enviarChangeEvent();



        }

    });


    this.consolas = [];

}
Domotico.prototype = Object.create(Alteravel.prototype);
Domotico.prototype.constructor = Domotico;
Domotico.prototype.hasConsola = function(nome) {
    return this.consolas.some(consola => consola.nome == nome);
}
Domotico.prototype.criarConsola = function(nome) {

    var hasNomeConsola = this.consolas.some(consola => consola.nome == nome);

    if (!hasNomeConsola) {

        var consola = new Consola(nome, this);

        this.consolas.push(consola);
        this.enviarChangeEvent();
    }

}
Domotico.prototype.apagarConsola = function(nome) {

    this.consolas.forEach(function(consola, index, array) {

        if (consola.nome == nome) {

            array.splice(index, 1);

        }

    });
    this.enviarChangeEvent();

}



function Consola(nome, domotico) {
    if (nome == void 0) {
        throw Error('Nome nao pode ser vazio');
    }
    Alteravel.call(this);
    this.domotico = domotico;
    Object.defineProperty(this, 'nome', {

        enumerable: true,
        configurable: false,
        get: function() {
            return nome;
        },
        set: function(newValue) {

            if (domotico !== void 0) {
                nome = this.domotico.hasConsola(newValue) ? nome : newValue;
                this.enviarChangeEvent();
            }
            else {
                nome = newValue;
                this.enviarChangeEvent();
            }



        }

    });


    this.compartimentos = []; //Todo: cuidado com os acessos

}
Consola.prototype = Object.create(Alteravel.prototype);
Consola.prototype.constructor = Consola;
Consola.prototype.hasCompartimento=function(nome){
  return   this.compartimentos.some(compartimento =>
        compartimento.nome == nome);
}
Consola.prototype.criarCompartimento = function(nome) {

    var hasNomeCompartimento = this.compartimentos.some(compartimento =>
        compartimento.nome == nome);


    if (!hasNomeCompartimento) {

        var compartimento = new Compartimento(nome,this);
        this.compartimentos.push(compartimento);
        this.enviarChangeEvent();
    }


}
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
function Compartimento(nome,consola) {
  Alteravel.call(this);
    //Todo: Validações
    this.consola=consola;
    this.equipamentos = []; //Todo: cuidado com os 
  
    
    Object.defineProperty(this, 'nome', {

        enumerable: true,
        configurable: false,
        get: function() {
            return nome;
        },
        set: function(newValue) {

            if (consola !== void 0) {
                nome = this.consola.hasCompartimento(newValue) ? nome : newValue;
                this.enviarChangeEvent();
            }
            else {
                nome = newValue;
                this.enviarChangeEvent();
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

Compartimento.prototype.removerEquipamento = function(equipamento) {

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
