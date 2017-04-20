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




/**
 * Painel genérico, inclui a user interface que é partilhada por todos os paineis
 * @constructor
 * @param {Object} titular - objeto que tem uma propriedade 'nome'
 * 
 * @property {HTMLElement} elemento - elemento root
 * @property {HTMLElement} tituloHTML - titulo do painel
 * @property {HTMLElement} subTituloHTML - subtitulo do painel
 * @property {HTMLElement} listaHTML - lista de conteúdo do painel
 * 
 * @property {HTMLElement} botaoCriar - botão de criar conteúdo para o painel
 * @property {HTMLElement} botaoRemover - botão de remover conteúdo para o painel
 * @property {HTMLElement} botaoSelecionarTudo - botão de selecionar todo o conteúdo do painel
 */
var Painel = function(titular) {
    
    var textoBotaoCriar = "Criar";
    var textoBotaoRemover = "Remover";
    var textoBotaoSelecionarTudo = "Selecionar tudo";

    this.elemento = document.createElement('div');

    this.tituloHTML = document.createElement('h2');
    this.tituloHTML.setAttribute('class', 'title');
    
    this.tituloHTML.onclick = function(e) {

        var parent = this.elemento;
        var caixaTextoAlterarNome = document.createElement('input');
        
        parent.replaceChild(caixaTextoAlterarNome, this.tituloHTML);
        
        if(titular)
            caixaTextoAlterarNome.value = titular.nome || 'Sem nome';
        else
            caixaTextoAlterarNome.value = 'Sem nome';
            
        caixaTextoAlterarNome.focus();

        caixaTextoAlterarNome.onblur = function(e) {

            titular.nome = caixaTextoAlterarNome.value;
            parent.replaceChild(this.tituloHTML, caixaTextoAlterarNome);

        }.bind(this);

        caixaTextoAlterarNome.onkeypress = function(event) {
            
            var enterKeyCode = 13;
            
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                caixaTextoAlterarNome.blur();
                return false;
            }
            return true;
            
        }.bind(this);


    }.bind(this);
    
    
    this.subTituloHTML = document.createElement('h4');
    this.subTituloHTML.setAttribute('class', 'subTitle');
    
    this.listaHTML = document.createElement('ul');

    this.botaoCriar = document.createElement("button");
    this.botaoCriar.textContent = textoBotaoCriar;

    this.botaoRemover = document.createElement("button");
    this.botaoRemover.textContent = textoBotaoRemover;

    this.botaoSelecionarTudo = document.createElement("button");
    this.botaoSelecionarTudo.textContent = textoBotaoSelecionarTudo;

    this.elemento.appendChild(this.tituloHTML);
    this.elemento.appendChild(this.subTituloHTML);
    this.elemento.appendChild(this.listaHTML);
    this.elemento.appendChild(this.botaoCriar);
    this.elemento.appendChild(this.botaoRemover);
    this.elemento.appendChild(this.botaoSelecionarTudo);

}

/**
 * Aplica este painel ao elemento recebido, o conteúdo do elemento será totalmente apagado
 * @param {HTMLElement} elemento - elemento a aplicar o painel
 */
Painel.prototype.aplicar = function(elemento) {
    
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
  
    elemento.appendChild(this.elemento);

}

/**
 * Preenche uma lista e ordena-a através de um array de objetos que têm a propriedade 'nome'
 * @param {HTMLElement} listaHTML - lista por exemplo um ul ou uma li
 * @param {Array} arrayObjetosIdentificados - array de objetos que têm a propriedade 'nome'
 * @param {function} callback - função que é chamada com o objeto quando o nome desse objeto é clicado
 * @returns {Array} array de checkboxes
 */
Painel.prototype.preencherListaHTML = function(listaHTML, arrayObjetosIdentificados, callback) {
    
    while (listaHTML.firstChild) {
        listaHTML.removeChild(listaHTML.firstChild);
    }
    
    var arrayCheckboxesHTML = [];
    
    arrayObjetosIdentificados.sort(function(objetoIdentificadoA, objetoIdentificadoB){
        
        return objetoIdentificadoA.nome.localeCompare(objetoIdentificadoB.nome);
        
    }).forEach(function(objetoIdentificado) {
        
        var objetoIdentificadoHTML = document.createElement('span');
        
        objetoIdentificadoHTML.textContent = objetoIdentificado.nome;
        objetoIdentificadoHTML.setAttribute('class','clickable');
        
        objetoIdentificadoHTML.onclick = function(e) {

            if (callback !== void 0)
                callback(objetoIdentificado);

        }

        var checkboxHTML = document.createElement('input');
        checkboxHTML.type = "checkbox";
        checkboxHTML.name = "checkRemove";
        checkboxHTML.value = objetoIdentificado.nome;
        arrayCheckboxesHTML.push(checkboxHTML);

        var itemListaHTML = document.createElement("li");
        itemListaHTML.appendChild(checkboxHTML);
        itemListaHTML.appendChild(objetoIdentificadoHTML);
        listaHTML.appendChild(itemListaHTML);

    });
    
    return arrayCheckboxesHTML;

}


/**
 * Painel que faz a gestão da aplicação domotica
 * @constructor
 * @extends Painel
 * @param {Domotico} domotico - O sistema domótico que irá ser gerido pelo painel
 */
var PainelDomotico = function(domotico) {

    Painel.call(this, domotico);

    this.elemento.setAttribute('class', 'painel-domotico');
    this.tituloHTML.textContent = domotico.nome;
    this.subTituloHTML.textContent = "Consolas:";


    var that = this;
    var arrayCheckboxesHTML = this.preencherListaHTML(this.listaHTML, domotico.consolas, function(consola) {
        
        var painelConsola = new PainelConsola(consola);
        painelConsola.aplicar(that.elemento.parentNode);

    });

    //botao de criar
    this.botaoCriar.onclick = function(e) {
        
        try {
            domotico.criarConsola(prompt("Insira nome da consola"));
        } catch(e){
            alert(e.message);
        }
        
    }

    
    this.botaoRemover.onclick = function(e) {

        arrayCheckboxesHTML.filter(function(checkBox){
            return checkBox.checked;
        }).forEach(function(checkBox) {
            domotico.apagarConsola(checkBox.value);
        });
        
    }

    this.botaoSelecionarTudo.onclick = function(e) {
        
        arrayCheckboxesHTML.forEach(function(checkBox) {
            checkBox.checked = true;
        })

    }

    domotico.adicionarChangeListener(function() {
        
        this.tituloHTML.textContent = domotico.nome;
        
        arrayCheckboxesHTML = this.preencherListaHTML(this.listaHTML, domotico.consolas, function(consola) {
            
            var painelConsola = new PainelConsola(consola);
            painelConsola.aplicar(that.elemento.parentNode);

        });
        
    }.bind(this));

}

PainelDomotico.prototype = Object.create(Painel.prototype);
PainelDomotico.prototype.constructor = PainelDomotico;


/**
 * Painel que faz a gestão de um consola
 * @constructor
 * @extends Painel
 * @param {Consola} consola - A consola que irá ser gerida pelo painel
 * @property {HTMLElement} botaoVoltarSistemaDomotico - botão para voltar ao painel do sistema domótico
 */
var PainelConsola = function(consola) {

    Painel.call(this, consola);
    
    this.elemento.setAttribute('class', 'painel-consola');
    this.tituloHTML.textContent = consola.nome || "Sistema Domotico";
    this.subTituloHTML.textContent = "Compartimentos:"

    var that = this;
    
    var arrayCheckboxesHTML = this.preencherListaHTML(this.listaHTML, consola.compartimentos, function(compartimento) {
        
        var painelCompartimento = new PainelCompartimento(compartimento);
        painelCompartimento.aplicar(that.elemento.parentNode);

    });


    this.botaoCriar.onclick = function(e) {
        
        try {
            consola.criarCompartimento(prompt("Insira nome do compartimento"));
        } catch(e){
            alert(e.message);
        }

    }


    this.botaoRemover.onclick = function(e) {

        arrayCheckboxesHTML.filter(function(checkBox){
            return checkBox.checked;
        }).forEach(function(checkBox) {
            consola.apagarCompartimento(checkBox.value);
        });
        
    }


    this.botaoSelecionarTudo.onclick = function(e) {
        
        arrayCheckboxesHTML.forEach(function(checkBox) {
            checkBox.checked = true;
        })

    }

    consola.adicionarChangeListener(function() {
        
        this.tituloHTML.textContent = consola.nome;
        this.subTituloHTML.textContent = consola.domotico.nome;

        arrayCheckboxesHTML = this.preencherListaHTML(this.listaHTML, consola.compartimentos, function(compartimento) {
            
            var painelCompartimento = new PainelCompartimento(compartimento);
            painelCompartimento.aplicar(that.elemento.parentNode);

        });
        
    }.bind(this));


    this.botaoVoltarSistemaDomotico = document.createElement("button");
    this.botaoVoltarSistemaDomotico.textContent = consola.domotico.nome;
    
    var that = this;
    
    this.botaoVoltarSistemaDomotico.onclick = function(e) {
        
        if (consola.domotico !== void 0) {
            var painelDomotico = new PainelDomotico(consola.domotico);
            painelDomotico.aplicar(that.elemento.parentNode);
        } else {
            alert("Esta consola nao pertence a nenhum sistema domotico");
        }
    }

    this.elemento.appendChild(this.botaoVoltarSistemaDomotico);


}
PainelConsola.prototype = Object.create(Painel.prototype);
PainelConsola.prototype.constructor = PainelConsola;

/**
 * Painel que faz a gestão de um compartimento
 * @constructor
 * @extends Painel
 * @param {Compartimento} compartimento - A compartimento que irá ser gerida pelo painel
 * @property {HTMLElement} botaoMonitorizar - botão para ira para o painel monitorizar
 * @property {HTMLElement} botaoVoltarConsola - botão para voltar ao painel consola
 */
var PainelCompartimento = function(compartimento) {
    
    Painel.call(this, compartimento);

    this.elemento.setAttribute('class', 'painel-compartimento');
    this.tituloHTML.textContent = compartimento.nome;
    this.subTituloHTML.textContent = "Equipamentos:";

    var arrayCheckboxesHTML = this.preencherListaHTML(this.listaHTML, compartimento.equipamentos, function() {});

    this.botaoCriar.onclick = function(e) {
        
        var valorPorDefeito = "";
        var iterador = equipamentoMap.keys();
        
        for (var tipoEquipamento of iterador) {
            valorPorDefeito += tipoEquipamento + "|";
        }

        var tipos = prompt("Indique um ou mais equipamentos separados pelo caracter '|': ", valorPorDefeito);

        if(tipos !== void 0 && tipos !== null){
            
            var arrayTipos = tipos.split("|");
            
            for (var i = 0; i < arrayTipos.length; i++) {
                
                var equipamento = getEquipamento(arrayTipos[i]);
            
                if (equipamento) 
                    compartimento.adicionarEquipamento(equipamento);

            }
        }
    }

   this.botaoRemover.onclick = function(e) {

        arrayCheckboxesHTML.filter(function(checkBox){
            return checkBox.checked;
        }).forEach(function(checkBox) {
            compartimento.removerEquipamento(checkBox.value);
        });
        
    }

    this.botaoSelecionarTudo.onclick = function(e) {
        
        arrayCheckboxesHTML.forEach(function(checkBox) {
            checkBox.checked = true;
        })

    }
    
    compartimento.adicionarChangeListener(function() {
        
        this.tituloHTML.textContent = compartimento.nome;
        this.subTituloHTML.textContent = compartimento.consola.nome || "Consola";
        arrayCheckboxesHTML = this.preencherListaHTML(this.listaHTML, compartimento.equipamentos, function() {});
        
    }.bind(this));
    
    this.botaoMonitorizar = document.createElement("button");
    this.botaoMonitorizar.textContent = "Monitorizar";
    
    this.elemento.appendChild(this.botaoMonitorizar);
    
    var that = this;
    
    this.botaoMonitorizar.onclick = function(e) {
        
        var painelMonitorizacao = new PainelMonitorizacao(compartimento);
        painelMonitorizacao.aplicar(that.elemento.parentNode);
        
    }

    this.botaoVoltarConsola = document.createElement("button");
    this.botaoVoltarConsola.textContent = compartimento.consola.nome || "Consola";

    this.botaoVoltarConsola.onclick = function(e) {
        
        if (compartimento.consola !== void 0) {
            var painelConsola = new PainelConsola(compartimento.consola);
            painelConsola.aplicar(that.elemento.parentNode);
        } else {
            alert("Esta consola nao pertence a nenhum sistema domotico");
        }
        
    }

    this.elemento.appendChild(this.botaoVoltarConsola);

}
PainelCompartimento.prototype = Object.create(Painel.prototype);
PainelCompartimento.prototype.constructor = PainelCompartimento;


/**
 * Painel que faz a gestão dos equipamentos de um compartimento
 * @constructor
 * @extends Painel
 * @param {Compartimento} compartimento - A compartimento que irá ser gerida pelo painel
 * @property {HTMLElement} tabelaEquipamentos - tabela de equipamentos
 */
var PainelMonitorizacao = function(compartimento) {

    this.elemento = document.createElement("div");
    this.elemento.setAttribute('class', 'painel-monitorizacao');
    this.tabelaEquipamentos = document.createElement('table');
    this.tabelaEquipamentos.setAttribute('class', 'tabela-equipamentos');
    this.botaoVoltar = document.createElement("button");
    this.botaoVoltar.textContent = "Voltar";
    
    var that = this;
    this.botaoVoltar.onclick = function(e) {
        var painelCompartimento = new PainelCompartimento(compartimento);
        painelCompartimento.aplicar(that.elemento.parentNode);
    }
    
    var linhaHTML;
    var equipamentosPorLinha = 4;
    var maxEquipamentosPorLinha = 6;
    var minEquipamentosPorLinha = 4;
    
    for(var j = maxEquipamentosPorLinha; j > minEquipamentosPorLinha ; j--){
            
        if (compartimento.equipamentos.length % j  === 0){
            equipamentosPorLinha = j;
            break;
        }
    }

    for (var i = 0, j = 0; i < compartimento.equipamentos.length; i++) {
        
        if (j == 0) {
            linhaHTML = document.createElement('tr');
            this.tabelaEquipamentos.appendChild(linhaHTML);
        }

        var dadosHTML = document.createElement('td');
        var equipamento = compartimento.equipamentos[i];
        var wrapperEquipamento = wrapEquipamento(equipamento);
        
        dadosHTML.appendChild(wrapperEquipamento.elemento);
        linhaHTML.appendChild(dadosHTML);
        
        j = (j + 1) % equipamentosPorLinha;
            
    }

    this.elemento.appendChild(this.tabelaEquipamentos);
    this.elemento.appendChild(this.botaoVoltar);

}

PainelMonitorizacao.prototype = Object.create(Painel.prototype);
PainelMonitorizacao.prototype.constructor = PainelMonitorizacao;

