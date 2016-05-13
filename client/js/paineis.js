
var PainelDomotico = function(domotico) {
    
    var that = this;
    
    //cria as li das consolas para o domotico
    function criarLiConsola(ul, array) {

        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        array.forEach(function(consola, index, array) {
            var consolaSpan = document.createElement('span');

            consolaSpan.textContent = consola.nome;
            consolaSpan.onclick = function(e) {
                alert('abrir');
            }
            
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "checkRemove";
            checkbox.value = consola.nome;

            var li = document.createElement("li");
            li.appendChild(checkbox);
            li.appendChild(consolaSpan)
            that.ulConsolas.appendChild(li);

        });

    }


    //o elemento main
    this.elemento = document.createElement('div');
    this.elemento.setAttribute('class', ' domotico');

    //nome do Sistema
    this.nome = document.createElement('h2');
    this.nome.textContent = domotico.nome;
    this.nome.onclick = function(e) {
        
        var parent = that.elemento;
        var input = document.createElement('input');

        parent.replaceChild(input, that.nome);
        input.focus();

        input.onblur = function(e) {

            domotico.nome = input.value;

            parent.replaceChild(that.nome, input);
        }

        input.onkeypress = function(event) {
            var enterKeyCode = 13;
            if (event.which === enterKeyCode || event.keyCode === enterKeyCode) {
                input.blur();
                return false;
            }
            return true;
        };


    }

    //titulo antes do ul
    this.textConsolas = document.createElement('h4');
    this.textConsolas.textContent = "Consolas:"

    //a ul que guarda as consolas

    this.ulConsolas = document.createElement('ul');
    //vamos agora criar os filhos que sao as consolas
    var consolas = domotico.consolas;
    criarLiConsola(this.ulConsolas, consolas);

    //botao de criar
    this.criar = document.createElement("button");
    this.criar.textContent = "Criar";

    this.criar.onclick = function(e) {
        domotico.criarConsola(prompt("Insira nome da consola"));
    }

    //botao de remover
    this.remover = document.createElement("button");
    this.remover.textContent = "Remover";

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
    this.selectAll = document.createElement("button");
    this.selectAll.textContent = "Selecionar tudo";

    this.selectAll.onclick = function(e) {
        
        var checkBoxes = document.getElementsByName('checkRemove');
        var nomes = [];
        
        for (var i = 0; i < checkBoxes.length; i++) 
            checkBoxes[i].checked = true;
        
        
    }

    
    this.elemento.appendChild(this.nome);
    this.elemento.appendChild(this.textConsolas);
    this.elemento.appendChild(this.ulConsolas);
    this.elemento.appendChild(this.criar);
    this.elemento.appendChild(this.remover);
    this.elemento.appendChild(this.selectAll);

    //listener de mudancas
    domotico.adicionarChangeListener(function() {
        that.nome.textContent = domotico.nome;
        var consolas = domotico.consolas;
        criarLiConsola(that.ulConsolas, consolas);
    });



}

PainelDomotico.prototype.aplicar = function() {
    //obtemos o DOM
    var divSistema = document.getElementById('sistema');
    //retiramos os filhos da bosta
    while (divSistema.firstChild) {
        divSistema.removeChild(divSistema.firstChild);
    }
    //metos o nosso lindo elemento
    divSistema.appendChild(this.elemento);

}


var PainelConsola = function(consola){
    
}


var PainelCompartimento = function(compartimento){
    
}


//TODO: Poder alterar o compartimento sem ter que criar outro painel
var PainelMonotorizacao = function(compartimento){
    
    this.table = document.createElement('table');
    
    var i = 0;
    var tr;
    compartimento.equipamentos.forEach(function(equipamento){

        if(i == 0){
            tr = document.createElement('tr');
            this.table.appendChild(tr);
        }
            
        
        var td = document.createElement('td');
        td.appendChild(wrapEquipamento(equipamento).elemento);
        tr.appendChild(td);
        
        i = (i + 1) % 4;
  
        
    },this);
    
}