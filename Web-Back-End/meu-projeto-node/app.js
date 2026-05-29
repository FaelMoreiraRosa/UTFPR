const calc = require('./operacoes');
const _ = require('lodash');

console.log(calc.adicao(8, 4)); 
console.log(calc.subtracao(15, 7));
console.log(calc.multiplicacao(6, 3));
console.log(calc.divisao(20, 5));
console.log(calc.divisao(10, 0));
console.log(_.random(1, 30)); 
