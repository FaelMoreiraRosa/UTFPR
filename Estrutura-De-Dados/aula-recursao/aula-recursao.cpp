#include <stdio.h>
#include <iostream>
using namespace std;

void somarNumeros(int n1, int n2){
    int resultado = n1 + n2;
    cout << "A soma de" << n1 << " e " << n2 << " é: " << resultado << endl;
}

int main (){
    cout << "estrutura de uma função" << endl;
    somarNumeros(5,10);

    printf("\n\n\n");
}