var Painel = function(object, childarray) {
    //cria as li  dos ul do objecto
    this.criarLi = function(ul, array, callback) {

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        array.forEach(function(elemento, index, array) {
            var consolaSpan = document.createElement('span');

            consolaSpan.textContent = elemento.nome;
            consolaSpan.onclick = function(e) {
                
                if(callback !== void 0)
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

    //titulo antes do ul
    this.subNome = document.createElement('h4');

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


var PainelDomotico = function(domotico) {


    Painel.call(this);


    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', ' domotico');

    //meter o nome do painel
    this.nome.textContent = domotico.nome;


    //titulo antes do ul
    this.subNome.textContent = "Consolas:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');

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
        var painelConsola= new PainelConsola(consola);
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
        var painelConsola= new PainelConsola(consola);
        painelConsola.aplicar();
        
        
    });
    }.bind(this));



}
PainelDomotico.prototype = Object.create(Painel.prototype);
PainelDomotico.prototype.constructor = PainelDomotico;


var PainelConsola = function(consola) {
    
    Painel.call(this);


    //meter a classe do elemento para domotico
    this.elemento.setAttribute('class', ' consola');

    //meter o nome do painel
    this.nome.textContent = consola.nome;


    //titulo antes do ul
    this.subNome.textContent = "Compartimentos:"

    //click no nome
    this.nome.onclick = function(e) {

        var parent = this.elemento;
        var input = document.createElement('input');

        parent.replaceChild(input, this.nome);
        input.focus();

        input.onblur = function(e) {
            console.log(input.value);
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
    this.criarLi(this.ul, compartimentos, function() {
        alert("oi");
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
        var compartimentos = consola.compartimentos;
        this.criarLi(this.ul, compartimentos);
    }.bind(this));
    
    //botao de sistema domotico
    this.sistemaDomotico = document.createElement("button");
    this.sistemaDomotico.textContent = "Sistema Domotico";
    
    this.sistemaDomotico.onclick=function(e){
        if(consola.domotico !== void 0){
        var painelDomotico = new PainelDomotico(consola.domotico);
        painelDomotico.aplicar();
        }else{
            alert("Esta consola nao pertence a nenhum sistema domotico");
        }
    }
    
    this.elemento.appendChild(this.sistemaDomotico);


}
PainelConsola.prototype = Object.create(Painel.prototype);
PainelConsola.prototype.constructor = PainelConsola;

var PainelCompartimento = function(compartimento) {

}


//TODO: Poder alterar o compartimento sem ter que criar outro painel
var PainelMonotorizacao = function(compartimento) {

    this.table = document.createElement('table');

    var i = 0;
    var tr;
    compartimento.equipamentos.forEach(function(equipamento) {

        if (i == 0) {
            tr = document.createElement('tr');
            this.table.appendChild(tr);
        }


        var td = document.createElement('td');
        td.appendChild(wrapEquipamento(equipamento).elemento);
        tr.appendChild(td);

        i = (i + 1) % 4;


    }, this);

}