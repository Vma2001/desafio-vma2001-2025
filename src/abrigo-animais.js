class AbrigoAnimais {
 encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    // catálogo
    const animais = {
      Rex: { especie: 'cão', desejos: ['RATO','BOLA'] },
      Mimi: { especie: 'gato', desejos: ['BOLA','LASER'] },
      Fofo: { especie: 'gato', desejos: ['BOLA','RATO','LASER'] },
      Zero: { especie: 'gato', desejos: ['RATO','BOLA'] },
      Bola: { especie: 'cão', desejos: ['CAIXA','NOVELO'] },
      Bebe: { especie: 'cão', desejos: ['LASER','RATO','BOLA'] },
      Loco: { especie: 'jabuti', desejos: ['SKATE','RATO'] }
    };

    // utilidades
    const parse = s => (s || '').split(',').map(x => x.trim()).filter(Boolean);
    const hasDup = arr => new Set(arr).size !== arr.length;
    const isSubseq = (need, have) => {
      let i = 0, j = 0;
      while (i < need.length && j < have.length) {
        if (need[i] === have[j]) i++;
        j++;
      }
      return i === need.length;
    };

    // parse entradas
    const p1 = parse(brinquedosPessoa1);
    const p2 = parse(brinquedosPessoa2);
    const ordem = parse(ordemAnimais);

    // validar animais
    if (ordem.length === 0 || hasDup(ordem) || !ordem.every(a => a in animais)) {
      return { erro: 'Animal inválido' };
    }

    // validar brinquedos (inválido ou duplicado)
    if (hasDup(p1) || hasDup(p2)) {
      return { erro: 'Brinquedo inválido' };
    }
    // considerar universo permitido como união dos desejos conhecidos
    const universo = new Set(Object.values(animais).flatMap(a => a.desejos));
    if (![...p1, ...p2].every(b => universo.has(b))) {
      return { erro: 'Brinquedo inválido' };
    }

    // estado de adoção
    let c1 = 0, c2 = 0;
    const resultados = [];
    let locoCandidato = null; // 1 ou 2, decidir ao final

    for (const nome of ordem) {
      const info = animais[nome];
      // teste de subsequência (intercala é permitido)
      const p1Ok = isSubseq(info.desejos, p1);
      const p2Ok = isSubseq(info.desejos, p2);

      // regra Loco: não se importa com a ordem -> satisfaz sempre,
      // mas só poderá ficar com alguém se essa pessoa terminar com >= 2 animais
      if (nome === 'Loco') {
        // marcar candidato pela disponibilidade atual (preferência: quem tiver subsequência verdadeira; se ambos ou nenhum, marcar null e decide "abrigo")
        const cand1 = p1Ok && c1 < 3;
        const cand2 = p2Ok && c2 < 3;
        if (cand1 && !cand2) locoCandidato = 1;
        else if (!cand1 && cand2) locoCandidato = 2;
        else locoCandidato = null; // se ambos ou nenhum, cai nas demais regras
        // decisão adiada; por ora, considere abrigo, e no final tentamos mover
        resultados.push({ nome, destino: 'abrigo' });
        continue;
      }

      // aplicar regras gerais
      let destino = 'abrigo';
      if (info.especie === 'gato') {
        // se os dois conseguem, ninguém leva
        if (p1Ok && p2Ok) destino = 'abrigo';
        else if (p1Ok && c1 < 3) destino = 'pessoa 1';
        else if (p2Ok && c2 < 3) destino = 'pessoa 2';
        else destino = 'abrigo';
      } else {
        // cão: se ambos podem, escolha a primeira pessoa ainda abaixo do limite; se ambos podem, tanto faz (regra 4 não se aplica a cães)
        if (p1Ok && c1 < 3 && !(p2Ok && c2 < 3 && c1 >= c2)) destino = 'pessoa 1';
        else if (p2Ok && c2 < 3) destino = 'pessoa 2';
        else destino = 'abrigo';
      }

      if (destino === 'pessoa 1') c1++;
      if (destino === 'pessoa 2') c2++;
      resultados.push({ nome, destino });
    }

    // decidir Loco após contagem final
    if (ordem.includes('Loco')) {
      const idx = resultados.findIndex(x => x.nome === 'Loco');
      if (idx >= 0) {
        let destino = 'abrigo';
        if (locoCandidato === 1 && c1 >= 1 && c1 < 3) {
          destino = 'pessoa 1';
          c1++;
        } else if (locoCandidato === 2 && c2 >= 1 && c2 < 3) {
          destino = 'pessoa 2';
          c2++;
        }
        resultados[idx].destino = destino;
      }
    }

    // montar saída ordenada alfabeticamente pelo nome
    resultados.sort((a, b) => a.nome.localeCompare(b.nome));
    return { lista: resultados.map(r => `${r.nome} - ${r.destino}`) };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
