import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });
  test('Pessoa não pode levar mais de três animais', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA,CAIXA,NOVELO,LASER', 
    'RATO,BOLA,NOVELO,CAIXA', 
    'Rex,Bola,Bebe,Fofo');
  // A pessoa 1 deveria adotar Rex, Bola e Bebe, e Fofo vai para abrigo (pois pessoa 1 já tem 3 animais)
  expect(resultado.lista).toContain('Fofo - abrigo');
  expect(resultado.lista.filter(x => x.includes('pessoa 1')).length).toBeLessThanOrEqual(3);
  expect(resultado.erro).toBeFalsy();
});
});
