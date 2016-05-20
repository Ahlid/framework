/**
 * Painel genérico, incluí a user interface que é partilhada por todos os paineis
 * @constructor
 */
var Painel = function() {
    //cria as li  dos ul do objecto
    this.criarLi = function(ul, array, callback) {

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        array.forEach(function(elemento) {
            var consolaSpan = document.createElement('span');

            consolaSpan.textContent = elemento.nome;
           
            consolaSpan.setAttribute('class','clickable');
            consolaSpan.onclick = function(e) {

                if (callback !== void 0)
                    callback(elemento);

            }

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "checkRemove";
            checkbox.value = elemento.nome;

            var li = document.createElement("li");
            li.appendChild(checkbox);
            li.appendChild(consolaSpan)
            ul.appendChild(li);

        });

    }

    //criar o elemento do painel
    this.elemento = document.createElement('div');

    //nome do Sistema
    this.nome = document.createElement('h2');
    this.nome.setAttribute('class', 'title');

    //titulo antes do ul
    this.subNome = document.createElement('h4');
    this.subNome.setAttribute('class', 'subTitle');
    
    //a ul que guarda al li's com os elementos do array do objecto
    this.ul = document.createElement('ul');

    //botao criar
    this.criar = document.createElement("button");
    this.criar.textContent = "Criar";

    //botao de remover
    this.remover = document.createElement("button");
    this.remover.textContent = "Remover";

    //botao de remover
    this.selectAll = document.createElement("button");
    this.selectAll.textContent = "Selecionar tudo";

    this.elemento.appendChild(this.nome);
    this.elemento.appendChild(this.subNome);
    this.elemento.appendChild(this.ul);
    this.elemento.appendChild(document.createElement("br"));
    this.elemento.appendChild(this.criar);
    this.elemento.appendChild(this.remover);
    this.elemento.appendChild(this.selectAll);

}
Painel.prototype.aplicar = function() {
    //obtemos o DOM
    var divSistema = document.getElementById('sistema');
    //retiramos os filhos da bosta
    while (divSistema.firstChild) {
        divSistema.removeChild(divSistema.firstChild);
    }
    //metos o nosso lindo elemento
    divSistema.appendChild(this.elemento);

}


/**
 * Painel que faz a gestão da aplicação domotica
 * @constructor
 * @param {Domotico} domotico - O sistema domótico que irá ser gerido pelo painel
 */
var PainelDomotico = function(domotico) {

    Painel.call(this);

    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', 'painel-domotico');

    //meter o nome do painel
    this.nome.textContent = domotico.nome;

    //titulo antes do ul
    this.subNome.textContent = "Consolas:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');
        input.value=this.nome.textContent;
        parent.replaceChild(input, this.nome);
        input.focus();

        input.onblur = function(e) {

            domotico.nome = input.value;

            parent.replaceChild(this.nome, input);
        }.bind(this);

        input.onkeypress = function(event) {
            var enterKeyCode = 13;
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                input.blur();
                return false;
            }
            return true;
        }.bind(this);


    }.bind(this);

    //vamos agora criar os filhos que sao as consolas
    var consolas = domotico.consolas;
    this.criarLi(this.ul, consolas, function(consola) {
        var painelConsola = new PainelConsola(consola);
        painelConsola.aplicar();


    });

    //botao de criar
    this.criar.onclick = function(e) {
        domotico.criarConsola(prompt("Insira nome da consola"));
    }

    //botao de remover
    this.remover.onclick = function(e) {

        var checkboxes = document.getElementsByName('checkRemove');
        var nomes = [];


        for (var i = 0; i < checkboxes.length; i++) {

            if (checkboxes[i].checked == true)
                nomes.push(checkboxes[i].value);

        }

        nomes.forEach(nome => domotico.apagarConsola(nome));

    }

    //botao de remover
    this.selectAll.onclick = function(e) {

        var checkBoxes = document.getElementsByName('checkRemove');
        var nomes = [];

        for (var i = 0; i < checkBoxes.length; i++)
            checkBoxes[i].checked = true;


    }

    //listener de mudancas
    domotico.adicionarChangeListener(function() {
        this.nome.textContent = domotico.nome;
        var consolas = domotico.consolas;
        this.criarLi(this.ul, consolas, function(consola) {
            var painelConsola = new PainelConsola(consola);
            painelConsola.aplicar();


        });
    }.bind(this));

}

PainelDomotico.prototype = Object.create(Painel.prototype);
PainelDomotico.prototype.constructor = PainelDomotico;


/**
 * Painel que faz a gestão de um consola
 * @constructor
 * @param {Consola} consola - A consola que irá ser gerida pelo painel
 */
var PainelConsola = function(consola) {

    Painel.call(this);

    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', 'painel-consola');

    //meter o nome do painel
    this.nome.textContent = consola.nome || "Sistema Domotico";

    //titulo antes do ul
    this.subNome.textContent = "Compartimentos:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');

        parent.replaceChild(input, this.nome);
        input.focus();
        input.value=this.nome.textContent
        input.onblur = function(e) {
            consola.nome = input.value;

            parent.replaceChild(this.nome, input);
        }.bind(this);

        input.onkeypress = function(event) {
            var enterKeyCode = 13;
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                input.blur();
                return false;
            }
            return true;
        }.bind(this);


    }.bind(this);

    //vamos agora criar os filhos que sao as consolas
    var compartimentos = consola.compartimentos;
    this.criarLi(this.ul, compartimentos, function(compartimento) {
        var painelCompartimento = new PainelCompartimento(compartimento);
        painelCompartimento.aplicar();


    });

    //botao de criar
    this.criar.onclick = function(e) {
        consola.criarCompartimento(prompt("Insira nome da consola"));
    }

    //botao de remover
    this.remover.onclick = function(e) {

        var checkboxes = document.getElementsByName('checkRemove');
        var nomes = [];


        for (var i = 0; i < checkboxes.length; i++) {

            if (checkboxes[i].checked == true)
                nomes.push(checkboxes[i].value);

        }

        nomes.forEach(nome => consola.apagarCompartimento(nome));

    }

    //botao de remover
    this.selectAll.onclick = function(e) {

        var checkBoxes = document.getElementsByName('checkRemove');
        var nomes = [];

        for (var i = 0; i < checkBoxes.length; i++)
            checkBoxes[i].checked = true;


    }

    //listener de mudancas
    consola.adicionarChangeListener(function() {
        this.nome.textContent = consola.nome;
        this.sistemaDomotico.textContent = consola.domotico.nome;

        var compartimentos = consola.compartimentos;
        this.criarLi(this.ul, compartimentos, function(compartimento) {
            var painelCompartimento = new PainelCompartimento(compartimento);
            painelCompartimento.aplicar();


        });
    }.bind(this));

    //botao de sistema domotico
    this.sistemaDomotico = document.createElement("button");
    this.sistemaDomotico.textContent = consola.domotico.nome;

    this.sistemaDomotico.onclick = function(e) {
        if (consola.domotico !== void 0) {
            var painelDomotico = new PainelDomotico(consola.domotico);
            painelDomotico.aplicar();
        }
        else {
            alert("Esta consola nao pertence a nenhum sistema domotico");
        }
    }

    this.elemento.appendChild(this.sistemaDomotico);


}
PainelConsola.prototype = Object.create(Painel.prototype);
PainelConsola.prototype.constructor = PainelConsola;

/**
 * Painel que faz a gestão de um compartimento
 * @constructor
 * @param {Compartimento} compartimento - A compartimento que irá ser gerida pelo painel
 */
var PainelCompartimento = function(compartimento) {
    Painel.call(this);

    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', 'painel-compartimento');

    //meter o nome do painel
    this.nome.textContent = compartimento.nome;

    //titulo antes do ul
    this.subNome.textContent = "Equipamentos:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');
        input.value=this.nome.textContent;
        parent.replaceChild(input, this.nome);
        input.focus();

        input.onblur = function(e) {

            compartimento.nome = input.value;

            parent.replaceChild(this.nome, input);

        }.bind(this);

        input.onkeypress = function(event) {
            var enterKeyCode = 13;
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                input.blur();
                return false;
            }
            return true;
        }.bind(this);


    }.bind(this);

    //vamos agora criar os filhos que sao as consolas
    var equipamentos = compartimento.equipamentos;
    this.criarLi(this.ul, equipamentos);

    //botao de criar
    this.criar.onclick = function(e) {
        var stringAMostrar = "";

        var mapIter = equipamentoMap.keys();
        for (var aux of mapIter) {
            stringAMostrar += aux + "|"
        }

        var tipo = prompt("Indique o nome do equipamento a criar: ", stringAMostrar);

        if(tipo!== void 0){
            
             tipo = tipo.split("|");
            for (var i = 0; i < tipo.length; i++) {
                if (equipamentoMap.get(tipo[i])) {
                    var eq = getEquipamento(tipo[i]);
    
                    compartimento.adicionarEquipamento(eq);
    
                }
    
            }
        }

    }

    //botao de remover
    this.remover.onclick = function(e) {

        var checkboxes = document.getElementsByName('checkRemove');
        var nomes = [];


        for (var i = 0; i < checkboxes.length; i++) {

            if (checkboxes[i].checked)
                nomes.push(checkboxes[i].value);

        }
        nomes.forEach(nome => compartimento.removerEquipamento(nome));

    }

    //botao de remover
    this.selectAll.onclick = function(e) {

        var checkBoxes = document.getElementsByName('checkRemove');
        var nomes = [];

        for (var i = 0; i < checkBoxes.length; i++)
            checkBoxes[i].checked = true;

    }


    //listener de mudancas
    compartimento.adicionarChangeListener(function() {
        this.nome.textContent = compartimento.nome;
        this.consola.textContent = compartimento.consola.nome||"Consola";
        var equipamentos = compartimento.equipamentos;
        this.criarLi(this.ul, equipamentos, function() {
        });
    }.bind(this));
    //botao de monitorizar
    this.botaoMonitorizar = document.createElement("button");
    this.botaoMonitorizar.textContent = "Monitorizar";

    this.botaoMonitorizar.onclick = function(e) {
        var painelMonitorizacao = new PainelMonitorizacao(compartimento);
        painelMonitorizacao.aplicar();
    }
    this.elemento.appendChild(this.botaoMonitorizar);

    //botao de sistema domotico
    this.consola = document.createElement("button");
    this.consola.textContent = compartimento.consola.nome || "Consola";

    this.consola.onclick = function(e) {
        if (compartimento.consola !== void 0) {
            var painelConsola = new PainelConsola(compartimento.consola);
            painelConsola.aplicar();
        }
        else {
            alert("Esta consola nao pertence a nenhum sistema domotico");
        }
    }

    this.elemento.appendChild(this.consola);

}
PainelCompartimento.prototype = Object.create(Painel.prototype);
PainelCompartimento.prototype.constructor = PainelCompartimento;


//TODO: Poder alterar o compartimento sem ter que criar outro painel

/**
 * Painel que faz a gestão dos equipamentos de um compartimento
 * @constructor
 * @param {Compartimento} compartimento - A compartimento que irá ser gerida pelo painel
 */
var PainelMonitorizacao = function(compartimento) {

    this.elemento = document.createElement("div");
    this.elemento.setAttribute('class', 'painel-monitorizacao');
    this.table = document.createElement('table');
    //botao compartimento
    this.botaoVoltar = document.createElement("button");
    this.botaoVoltar.textContent = "Voltar";

    this.botaoVoltar.onclick = function(e) {
        var painelCompartimento = new PainelCompartimento(compartimento);
        painelCompartimento.aplicar();
    }
    
    var i = 0;
    var tr;
    var equipamentosPorLinha = 4;
    
    for(var j = 6; j > 4 ; j--){
            
        if (compartimento.equipamentos.length % j  === 0){
            equipamentosPorLinha = j;
            break;
        }
    }
    
    compartimento.equipamentos.forEach(function(equipamento) {
        
        if (i == 0) {
            tr = document.createElement('tr');
            this.table.appendChild(tr);
        }

        var td = document.createElement('td');
        td.appendChild(wrapEquipamento(equipamento).elemento);
        tr.appendChild(td);
        
        
        i = (i + 1) % equipamentosPorLinha;
              
        

    }, this);


    this.elemento.appendChild(this.table);
    this.elemento.appendChild(this.botaoVoltar);

}
PainelMonitorizacao.prototype = Object.create(Painel.prototype);
PainelMonitorizacao.prototype.constructor = PainelMonitorizacao;

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

    for (var [key, value] of equipamentoMap) {
        if (equipamento == key) {
            return new value();
        }
    }

}