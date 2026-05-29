/*
Alunos envolvidos: Rafael Moreira Rosa - Lucas Gabriel Pinheiro dos Santos
*/

#include <string> /*Permite o tipo string*/
#include <iostream> /*Entrada e saida de dados*/
using namespace std;

/*Criando a struct pessoa*/
/*--toda pessoa tem nome, idade e endereço--*/

struct Pessoa
{
    string nome;
    int idade;
    string endereco;
};

/*Criando vetor de pessoas*/
/*--Cabem ate 100 pessoas, mas so é usado o total, no caso o numero de pessoas que realmente existe--*/

Pessoa pessoas[100];
int total = 0;

/*Inserindo uma pessoa*/

void inserir()
{
    cout << "Nome: ";
    cin.ignore(1000, '\n');
    getline(cin, pessoas[total].nome);

    cout << "Idade: ";
    cin >> pessoas[total].idade;

    cout << "Endereco: ";
    cin.ignore(1000, '\n');
    getline(cin, pessoas[total].endereco);

    total++;

    cout << "Pessoa cadastra    da com sucesso!\n";
}

/*Listando pessoas*/

void listar()
{
    for (int i = 0; i < total; i++)
    {
        cout << "\nIndice: " << i << endl;
        cout << "Nome: " << pessoas[i].nome << endl;
        cout << "Idade: " << pessoas[i].idade << endl;
        cout << "Endereco: " << pessoas[i].endereco << endl;
    }
}

/*Editando uma pessoa*/

void editar()
{
    int i;
    cout << "Indice: ";
    cin >> i;

    if (i >= 0 && i < total)
    {
        cout << "Editando.. ";

        cout << "Nome: ";
        cin.ignore(1000, '\n');
        getline(cin, pessoas[i].nome);

        cout << "Idade: ";
        cin >> pessoas[i].idade;

        cout << "Edereco: ";
        cin.ignore(1000, '\n');
        getline(cin, pessoas[i].endereco);

        cout << "Editado com sucesso!";
    }
}

/*Removendo pessoa*/

void remover()
{

    cout << "Digite o indice da pessoa ser removida ";
    int i;
    cin >> i;

    if (i >= 0 && i < total)
    {
        for (int j = i; j < total - 1; j++)
        {
            pessoas[j] = pessoas[j + 1];  
        }
        total--;
    }
}

/*Menu*/

int main()
{
    int op;

    do
    {
        cout << "\n===== MENU =====\n";
        cout << "1 - Inserir\n";
        cout << "2 - Listar\n";
        cout << "3 - Editar\n";
        cout << "4 - Remover\n";
        cout << "0 - Sair\n";
        cout << "Escolha: ";

        cin >> op;

        switch (op)
        {
        case 1:
            inserir();
            break;
        case 2:
            listar();
            break;
        case 3:
            editar();
            break;
        case 4:
            remover();
            break;
        case 0:
            cout << "Saindo...\n";
            break;
        default:
            cout << "Opcao invalida\n";
        }

    } while (op != 0);

    return 0;
}