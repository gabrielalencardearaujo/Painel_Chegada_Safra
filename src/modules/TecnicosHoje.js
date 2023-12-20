export class TecnicoDadosHoje {
  constructor(codigoTecnico, horaChegada, horaExpedido, horaReversa, naBase, nome) {
    this.codigo = codigoTecnico
    this.horaChegada = horaChegada
    this.horaExpedido = horaExpedido
    this.horaReversa = horaReversa
    this.naBase = naBase
    this.nome = nome.split(' ').slice(0, 2).join(' ')
    this.listaTecnicosReversa = document.querySelector('#tecnicos-reversa')
    this.listaTecnicosExpedicao = document.querySelector('#tecnicos-expedicao')
    this.status = 'AGUARDANDO'
  }

  manager(dataAtual, objTecnico) {
    const recebeJSON = recebeDadosJSON(dataAtual)
    saveJsonReversa(objTecnico, recebeJSON, dataAtual)
    mostraTecnicoPainelReversa(recebeJSON, this.listaTecnicosReversa, 'reversa')
  }
}

export const saveJsonReversa = (objTecnico, recebeJSON, dataAtual) => {
  const tecnicoJaRegistrado = recebeJSON.find(value => {
    if (value) {
      return value.codigo === objTecnico.codigo
    }
  })

  if (!tecnicoJaRegistrado) {
    recebeJSON.push(objTecnico)
    const newJSONReversa = JSON.stringify(recebeJSON)
    localStorage.setItem(`Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, newJSONReversa)
  }
}

export const criaNovoJSON = (dataAtual) => {
  const dadosJSONReversa = localStorage.getItem(`Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`)
  const dadosJSONExpedicao = localStorage.getItem(`Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`)
  if (!dadosJSONReversa || !dadosJSONExpedicao) {
    const painelReversa = []
    const painelExpedicao = []
    const jsonAtualReversa = JSON.stringify(painelReversa)
    const jsonAtualExpedicao = JSON.stringify(painelExpedicao)

    localStorage.setItem(`Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, jsonAtualReversa)
    localStorage.setItem(`Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, jsonAtualExpedicao)
  }

  const keysLocalStorage = Object.keys(localStorage)

  keysLocalStorage.forEach( key => {
    ((key !== `Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`) && (key !== `Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`) && (key !== `Cadastro`)) ? localStorage.removeItem(key) : '';
  })
}

export const recebeDadosJSON = (dataAtual) => {
  const dadosJsonReversa = localStorage.getItem(`Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`)
  const parseJsonReversa = JSON.parse(dadosJsonReversa)

  return parseJsonReversa
}

export const recebeJsonExpedicao = (dataAtual) => {
  const dadosJsonExpedicao = localStorage.getItem(`Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`)
  const parseJsonExpedicao = JSON.parse(dadosJsonExpedicao)

  return parseJsonExpedicao
}

export const mostraTecnicoPainelReversa = (recebeJSON, listaTecnicos, status) => {
  listaTecnicos.innerHTML = '';
  for (let index in recebeJSON) {
    if (recebeJSON[index]) {
      const newTecnico = document.createElement('div')
      newTecnico.setAttribute('draggable', 'true')
      newTecnico.innerHTML = htmlTecnicoReversa(recebeJSON, index, status)
      listaTecnicos.appendChild(newTecnico)
    }
  }
}

export const mostraTecnicoPainelExpedicao = (recebeJSON, listaTecnicos, status) => {
  const divEsperandoExpedicao = document.querySelector('#esperando')
  divEsperandoExpedicao.innerHTML = ''

  for (let index in recebeJSON) {
    divEsperandoExpedicao.innerHTML += htmlTecnicoExpedicao(recebeJSON, index, status)
    listaTecnicos.appendChild(divEsperandoExpedicao)
  }
}

export const alteraStatusReversa = (elemento, dataAtual) => {
  if (elemento.classList.contains('reversa')) {
    elemento.style.color = 'var(--background-primary-color)'
    elemento.textContent = 'AGUARDANDO'
    elemento.classList.remove('reversa')
  } else {
    elemento.classList.add('reversa')
    elemento.textContent = 'REVERSA'
    elemento.style.color = 'var(--color-reversa)'
  }
}

export const alteraStatusExpedicao = (elemento, dataAtual, horaRegistro) => {
  if (elemento.classList.contains('expedido')) {
    elemento.classList.remove('expedido')
    elemento.textContent = 'AGUARDANDO'
    elemento.style.color = 'var(--background-primary-color)'
  } else if (!elemento.classList.contains('expedido')) {
    elemento.classList.add('expedido')
    elemento.textContent = 'EXPEDIDO'
    elemento.style.color = 'var(--primary-color)'
    tecnicoExpedido(elemento, dataAtual, horaRegistro)
  }
}

function tecnicoExpedido(elemento, dataAtual, horaRegistro) {
  elemento = elemento.parentElement.parentElement
  const codigoTecnicoExpedido = elemento.querySelector(`label`)
  const horaExpedido = elemento.querySelector('#iexpedicao')
  const mostraNomeStatus = elemento.querySelector('.nome-status')
  const mostraHoraExpedido = elemento.querySelector('#hora')
  const jsonExpedicao = recebeJsonExpedicao(dataAtual)

  for (let tecnico of jsonExpedicao) {
    if (tecnico.codigo === codigoTecnicoExpedido.htmlFor) {
      tecnico.horaExpedido = horaRegistro
      tecnico.status = 'EXPEDIDO'

      horaExpedido.textContent = `${tecnico.horaExpedido}`
      mostraNomeStatus.textContent = `Expedido`
      mostraHoraExpedido.innerHTML = `${tecnico.horaExpedido}`
    }
  }

  const jsonTecnicoAtualizado = JSON.stringify(jsonExpedicao)
  localStorage.setItem(`Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, jsonTecnicoAtualizado)
}

export const atualizaDadosTecnico = (objJSON, horaAtual, dataAtual) => {
  const jsonExpedicao = recebeJsonExpedicao(dataAtual)
  const jsonReversa = recebeDadosJSON(dataAtual)

  if (objJSON) {
    const verificarTecnico = jsonExpedicao.find(value => {
      return value.codigo === objJSON.codigo
    })

    if (!verificarTecnico) {
      objJSON.horaReversa = horaAtual
      jsonExpedicao.push(objJSON)
      const jsonTecnico = JSON.stringify(jsonExpedicao)
      localStorage.setItem(`Expedicao: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, jsonTecnico)
    }
  }

  for (let i = 0; i < jsonReversa.length; i++) {
    if (jsonReversa[i] && objJSON) {
      if (jsonReversa[i].codigo === objJSON.codigo) {
        jsonReversa[i] = null
        i++;
      }
    }
  }

  const jsonTecnicoAtualizado = JSON.stringify(jsonReversa)
  localStorage.setItem(`Reversa: ${dataAtual[0]}/${dataAtual[1]}/${dataAtual[2]}`, jsonTecnicoAtualizado)
}

function htmlTecnicoReversa(recebeJSON, index, status) {
  return `
  <input class="trigger_input" type="checkbox" id="${recebeJSON[index].codigo}">
  <div class="trigger-wrapper">
    <div class="elemento">
      <label for="${recebeJSON[index].codigo}">
        <div class="nome-hora">
          <span class="nomeTecnico" id="${recebeJSON[index].codigo}">${recebeJSON[index].nome.split(' ').slice(0, 2).join(' ')}</span>
          <hr>
          <div class="hora-chegada" id="hora-status"><span class="nome-status">Chegada</span>:&nbsp
            <span id="hora">${recebeJSON[index].horaChegada}</span>
          </div>
          <hr>
        </div>
      </label>
      <div class="status" id="${status}">${recebeJSON[index].status}</div>
    </div>
    <div class="dropdown">
      <hr id="hr-detalhes">
      <div class="div-detalhes">
        <div class="detalhes hora">Chegada: <span id="ichegada">${recebeJSON[index].horaChegada}</span></div>
        <div class="detalhes hora">Reversa: <span id="ireversa">${recebeJSON[index].horaReversa}</span></div>
        <div class="detalhes hora">Expedido: <span id="iexpedicao">${recebeJSON[index].horaExpedido}</span></div>
      </div>
      <div class="div-detalhes part2">
        <div class="detalhes hora">Tempo na Base: <span id="inabase">${recebeJSON[index].tempoNaBase}</span></div>
        <div class="detalhes regiao">Regiao:&nbsp<span id="iregiao">${recebeJSON[index].regiao}</span></div>
        <div class="detalhes parceiro">Parceiro: <span id="iparceiro">${recebeJSON[index].parceiro}</span></div>
      </div>
    </div>
  </div>
  `
}

function htmlTecnicoExpedicao(recebeJSON, index, status) {
  if(recebeJSON[index].horaExpedido !== ''){
    return `
  <input class="trigger_input" type="checkbox" id="${recebeJSON[index].codigo}">
  <div class="trigger-wrapper">
    <div class="elemento">
      <label for="${recebeJSON[index].codigo}">
        <div class="nome-hora">
          <span class="nomeTecnico" id="${recebeJSON[index].codigo}">${recebeJSON[index].nome.split(' ').slice(0, 2).join(' ')}</span>
          <hr>
          <div class="hora-chegada" id="hora-status"><span class="nome-status">Expedido</span>:&nbsp
            <span id="hora">${recebeJSON[index].horaExpedido}</span>
          </div>
          <hr>
        </div>
      </label>
      <div class="status ${status}" id="${status}">${recebeJSON[index].status}</div>
    </div>
    <div class="dropdown">
      <hr id="hr-detalhes">
      <div class="div-detalhes">
        <div class="detalhes hora">Chegada: <span id="ichegada">${recebeJSON[index].horaChegada}</span></div>
        <div class="detalhes hora">Reversa: <span id="ireversa">${recebeJSON[index].horaReversa}</span></div>
        <div class="detalhes hora">Expedido: <span id="iexpedicao">${recebeJSON[index].horaExpedido}</span></div>
      </div>
      <div class="div-detalhes part2">
        <div class="detalhes hora">Tempo na Base: <span id="inabase">${recebeJSON[index].tempoNaBase}</span></div>
        <div class="detalhes regiao">Regiao:&nbsp<span id="iregiao">${recebeJSON[index].regiao}</span></div>
        <div class="detalhes parceiro">Parceiro: <span id="iparceiro">${recebeJSON[index].parceiro}</span></div>
      </div>
    </div>
  </div>
  `
  } else {
    return `
    <input class="trigger_input" type="checkbox" id="${recebeJSON[index].codigo}">
    <div class="trigger-wrapper">
      <div class="elemento">
        <label for="${recebeJSON[index].codigo}">
          <div class="nome-hora">
            <span class="nomeTecnico" id="${recebeJSON[index].codigo}">${recebeJSON[index].nome.split(' ').slice(0, 2).join(' ')}</span>
            <hr>
            <div class="hora-chegada" id="hora-status"><span class="nome-status">Reversa</span>:&nbsp
              <span id="hora">${recebeJSON[index].horaReversa}</span>
            </div>
            <hr>
          </div>
        </label>
        <div class="status" id="${status}">${recebeJSON[index].status}</div>
      </div>
      <div class="dropdown">
        <hr id="hr-detalhes">
        <div class="div-detalhes">
          <div class="detalhes hora">Chegada: <span id="ichegada">${recebeJSON[index].horaChegada}</span></div>
          <div class="detalhes hora">Reversa: <span id="ireversa">${recebeJSON[index].horaReversa}</span></div>
          <div class="detalhes hora">Expedido: <span id="iexpedicao">${recebeJSON[index].horaExpedido}</span></div>
        </div>
        <div class="div-detalhes part2">
          <div class="detalhes hora">Tempo na Base: <span id="inabase">${recebeJSON[index].tempoNaBase}</span></div>
          <div class="detalhes regiao">Regiao:&nbsp<span id="iregiao">${recebeJSON[index].regiao}</span></div>
          <div class="detalhes parceiro">Parceiro: <span id="iparceiro">${recebeJSON[index].parceiro}</span></div>
        </div>
      </div>
    </div>
    `
  }
}
