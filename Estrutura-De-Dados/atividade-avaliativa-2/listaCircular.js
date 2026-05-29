// === ESTRUTURA DE DADOS ===
class Nodo {
    constructor(valor) {
        this.valor = valor;
        this.proximo = null;
    }
}

class ListaCircular {
    constructor() {
        this.head = null;
        this.tail = null;
        this.tamanho = 0;
    }

    inserir(valor) {
        const novoNodo = new Nodo(valor);
        if (!this.head) {
            this.head = novoNodo;
            this.tail = novoNodo;
            novoNodo.proximo = this.head;
        } else {
            this.tail.proximo = novoNodo;
            this.tail = novoNodo;
            this.tail.proximo = this.head;
        }
        this.tamanho++;
        console.log(`[Inserção] '${valor}' adicionado!`);
    }

    percorrer() {
        if (!this.head) {
            console.log("[Aviso] A lista está vazia atualmente.");
            return;
        }
        let atual = this.head;
        let resultado = "";
        do {
            resultado += `[ ${atual.valor} ] -> `;
            atual = atual.proximo;
        } while (atual !== this.head);
        
        console.log("=== FLUXO DA LISTA CIRCULAR ===");
        console.log(resultado + "(Volta para o início: " + this.head.valor + ")");
    }

    buscar(valor) {
        if (!this.head) return null;
        let atual = this.head;
        do {
            if (atual.valor === valor) return atual;
            atual = atual.proximo;
        } while (atual !== this.head);
        return null;
    }

    editar(valorAntigo, novoValor) {
        const nodoEncontrado = this.buscar(valorAntigo);
        if (nodoEncontrado) {
            nodoEncontrado.valor = novoValor;
            console.log(`[Edição] '${valorAntigo}' mudou para '${novoValor}'!`);
            return true;
        }
        console.log(`[Erro] '${valorAntigo}' não foi encontrado.`);
        return false;
    }

    excluir(valor) {
        if (!this.head) return false;
        let atual = this.head;
        let anterior = null;
        do {
            if (atual.valor === valor) {
                if (this.tamanho === 1) {
                    this.head = null;
                    this.tail = null;
                } else if (atual === this.head) {
                    this.head = this.head.proximo;
                    this.tail.proximo = this.head;
                } else if (atual === this.tail) {
                    anterior.proximo = this.head;
                    this.tail = anterior;
                } else {
                    anterior.proximo = atual.proximo;
                }
                this.tamanho--;
                console.log(`[Exclusão] '${valor}' foi removido com sucesso.`);
                return true;
            }
            anterior = atual;
            atual = atual.proximo;
        } while (atual !== this.head);
        console.log(`[Erro] '${valor}' não encontrado para exclusão.`);
        return false;
    }
}

// === INSTÂNCIA GLOBAL DA LISTA ===
const minhaLista = new ListaCircular();

function dispararInserir() {
    const input = document.getElementById("inputInserir");
    const valor = input.value.trim();
    
    if (valor === "") {
        alert("Por favor, digite algo para inserir!");
        return;
    }
    
    minhaLista.inserir(valor);
    input.value = "";
}

function dispararPercorrer() {
    minhaLista.percorrer();
}

function dispararEditar() {
    const inputAntigo = document.getElementById("inputAntigo");
    const inputNovo = document.getElementById("inputNovo");
    
    const antigo = inputAntigo.value.trim();
    const novo = inputNovo.value.trim();

    if (antigo === "" || novo === "") {
        alert("Preencha ambos os campos para editar!");
        return;
    }

    minhaLista.editar(antigo, novo);
    inputAntigo.value = "";
    inputNovo.value = "";
}

function dispararExcluir() {
    const input = document.getElementById("inputExcluir");
    const valor = input.value.trim();

    if (valor === "") {
        alert("Digite o valor que deseja excluir!");
        return;
    }

    minhaLista.excluir(valor);
    input.value = "";
}   