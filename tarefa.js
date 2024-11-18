class Tarefas {
    constructor(ano, mes, dia, disciplina, descricao, valor) {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.disciplina = disciplina
    this.descricao = descricao
    this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
              return false
            }
        }
        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoid = localStorage.getItem('id')
        return parseInt(proximoid) + 1
    }
    gravar(d) {
       let id = this.getProximoId()
       localStorage.setItem(id, JSON.stringify(d))
       localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {
        let tarefas = Array()
        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {
            let tarefa = JSON.parse(localStorage.getItem(i))
            if(tarefa === null) {
                   continue
            }
            tarefa.id = i
            tarefas.push(tarefa)
        }
        return tarefas
    }
    pesquisar(tarefa) {
        let tarefasfiltradas = Array()
        tarefasfiltradas = this.recuperarTodosRegistros()
        console.log(tarefasfiltradas);
        console.log(tarefa)

        if(tarefa.ano != '') {
            console.log("filtro de ano");
            tarefasfiltradas = tarefasfiltradas.filter(d => d.ano == tarefa.ano)
        }
        if(tarefa.mes != '') {
            console.log("filtro de mes");
            tarefasfiltradas = tarefasfiltradas.filter(d => d.mes == tarefa.mes)
        }
        if(tarefa.dia != '') {
            console.log("filtro de dia");
            tarefasfiltradas = tarefasfiltradas.filter(d => d.dia == tarefa.dia)
        }
        if(tarefa.disciplina != '') {
            console.log("filtro de disciplina");
            tarefasfiltradas = tarefasfiltradas.filter(d => d.disciplina == tarefa.disciplina)
        }
        if(tarefa.descricao != '') {
            console.log("filtro de descricao");
            tarefasfiltradas = tarefasfiltradas.filter(d => d.descricao == tarefa.descricao)
        }

        if(tarefa.valor != '') {
            console.log("filtro de ano");
            tarefasfiltradas = tarefasfiltradas.filter(d => d.valor == tarefa.valor)
        }

        return tarefasfiltradas
    }
    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarTarefa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let disciplina = document.getElementById('disciplina')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let tarefa = new Tarefas(
        ano.value,
        mes.value,
        dia.value,
        disciplina.value,
        descricao.value,
        valor.value
    )
    if(tarefa.validarDados()) {
        bd.gravar(tarefa)

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Tarefa registrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        $('#modalRegistraTarefa').modal('show')
       
        ano.value = ''
        mes.value = ''
        dia.value = ''
        disciplina.value = ''
        descricao.value = ''
        valor.value = ''
    }else {

        document.getElementById('modal_titulo').innerHTML = 'Erro ao registrar'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Verificar se os campos foram preenchidos'
        document.getElementById('modal_btn').innerHTML = 'Corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        $('#modalRegistraTarefa').modal('show')
    }
}

function carregarListaTarefas(tarefas = Array(), filtro = false) {

    if(tarefas.length == 0 && filtro == false) {
        tarefas = bd.recuperarTodosRegistros()
    }
    let listaTarefas = document.getElementById("listaTarefas")
    listaTarefas.innerHTML = ''
    tarefas.forEach(function(d){

        //criando a linha tr
        var linha = listaTarefas.insertRow();
        
        //criando as colunas th
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar de acordo com a disciplina
        switch(d.disciplina) {
            case '1': d.disciplina = 'Programação Mobile'
            break
            case '2': d.disciplina = 'Programação Frontend'
            break
            case '3': d.disciplina = 'Analise de Projetos'
            break
            case '4': d.disciplina = 'Banco de Dados'
            break
            case '5': d.disciplina = 'Ciências da Computação'
            break
        }
        linha.insertCell(1).innerHTML = d.disciplina
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão de excluir
        let btn = document.createElement('button')
        btn.className = 'btn btn-darger'
        btn.innerHTML = '<i class="fa fa-times" ></i>'
        btn.id = `id_tarefa_${d.id}`
        btn.onclick = function() {
            let id = this.id.replace('id_tarefa_','')
                  bd.remover(id)
                  window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)
    })
}

function pesquisarTarefas() {
    let ano = document.getElementById("ano").value
    let mes = document.getElementById("mes").value
    let dia = document.getElementById("dia").value
    let disciplina = document.getElementById("disciplina").value
    let descricao = document.getElementById("descricao").value
    let valor = document.getElementById("valor").value

    let tarefa = new Tarefa(ano, mes, dia, disciplina, descricao, valor)
    let tarefas = bd.pesquisar(tarefa)

    this.carregarListaTarefas(tarefas, true)
}