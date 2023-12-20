import * as Cadastro from '../cadastro.js';

export function horaAtual() {
  let hora = new Date().getHours()
  let minutos = new Date().getMinutes()
  let segundos = new Date().getSeconds();

  (hora < 10) ? hora = `0${hora}` : '';
  (minutos < 10) ? minutos = `0${minutos}` : '';
  (segundos < 10) ? segundos = `0${segundos}` : '';

  return `${hora}:${minutos}:${segundos}`
}

export function dataAtual() {
  let dia = new Date().getDate()
  let mes = new Date().getMonth()
  let ano = new Date().getFullYear()

  return [dia, mes, ano]
}

export function tempoNaBase(dataAtual) {
  setInterval(() => {
    const dadosReversa = recebeReversa(dataAtual)
    const dadosExpedicao = recebeExpedicao(dataAtual)

    if (dadosReversa) {
      dadosReversa.forEach(obj => {
        if (obj) {
          const contadorAlterado = contadorTempo(obj.tempoNaBase)
          obj.tempoNaBase = contadorAlterado
          mostrarTempoDOM(obj.codigo, contadorAlterado)
        }
      })
    }
    if (dadosExpedicao) {
      for (const obj of dadosExpedicao) {
        if (obj) {
          if(obj.status === 'EXPEDIDO') { continue; }
          const contadorAlterado = contadorTempo(obj.tempoNaBase);
          obj.tempoNaBase = contadorAlterado;
          mostrarTempoDOM(obj.codigo, contadorAlterado);
        }
      }      
    }
    salvarTempo(dadosReversa, dadosExpedicao, dataAtual)
  }, 60000)
}

function contadorTempo(tempo) {
  let minutos = Number(tempo.slice(3, 5))
  let horas = Number(tempo.slice(0, 2))

  minutos++

  if (minutos >= 59) {
    minutos = 0
    horas++;
  }
  const displayHoras = horas.toString().padStart(2, '0');
  const displayMinutos = minutos.toString().padStart(2, '0');

  return `${displayHoras}:${displayMinutos}` 
}

function salvarTempo(reversa, expedicao, dataAtual){
  if(reversa) {
    localStorage.setItem(`Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, JSON.stringify(reversa))
  }
  
  if(expedicao){
    localStorage.setItem(`Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, JSON.stringify(expedicao))
  }
}

function recebeReversa(dataAtual) {
  const dadosJsonReversa = localStorage.getItem(`Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`)

  return JSON.parse(dadosJsonReversa)
}

function recebeExpedicao(dataAtual) {
  const dadosJsonExpedicao = localStorage.getItem(`Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`)

  return JSON.parse(dadosJsonExpedicao)
}

function mostrarTempoDOM(codigo, tempo){
  const procuraElementoTecnico = document.querySelectorAll(`#${codigo}`)
  const elementoEncontrado = procuraElementoTecnico[1].parentElement.parentElement.parentElement.parentElement

  const tempoBaseHTML = elementoEncontrado.querySelector('#inabase')
  tempoBaseHTML.textContent = tempo
}
