import * as TecnicosHoje from './modules/TecnicosHoje.js';
import * as DTHR from './modules/DTHR.js';

const cadastro = JSON.parse(localStorage.getItem('Cadastro'));

export function contaAtivos(tecnicosAtivos) {
  let ativos = 0;
  for (let i in cadastro) {
    if (cadastro[i].status === 'ATIVO') {
      ativos++
    }
  }
  tecnicosAtivos.textContent = ativos
}

export const TecnicosCadastro = (listaTecnicos) => {
  listaTecnicos.innerHTML = '';

  cadastro.sort((a, b) => {
    if (a.nome < b.nome) return -1;
    if (a.nome > b.nome) return 1;
    return 0;
  });

  for (let objTecnico of cadastro) {
    const elementoTecnico = document.createElement('div')
    elementoTecnico.setAttribute('class', 'tecnico')
    elementoTecnico.innerHTML = divTecnico(objTecnico)
    listaTecnicos.appendChild(elementoTecnico)
  }
}

export const pesquisaTecnico = (keycode, value, listaTecnicos, naoEncontrado) => {
  listaTecnicos.innerHTML = '';
  const semAcentos = removerAcentos(value)
  value = semAcentos.toUpperCase();
  let naoEncontrados = 0;
  if ((keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122) || (keycode == 8)) {
    for (let objTecnico of cadastro) {
      let nomeTecnico = objTecnico.nome
      nomeTecnico = removerAcentos(nomeTecnico)

      if (nomeTecnico.includes(value)) {
        const elementoTecnico = document.createElement('div')
        elementoTecnico.setAttribute('class', 'tecnico')
        elementoTecnico.innerHTML = divTecnico(objTecnico)
        listaTecnicos.appendChild(elementoTecnico)
      }
    }
  }
}

export const divTecnico = (objTecnico) => {
  let status;
  let Parceiro;

  (objTecnico.status === 'ATIVO') ? status = 'ativo' : status = 'inativo';

  if (objTecnico.parceiro === 'FENIX') { Parceiro = 'fenix' }
  else if (objTecnico.parceiro === 'TC-EXPRESS') { Parceiro = 'tcexpress' }
  else if (objTecnico.parceiro === 'DTI') { Parceiro = 'dti' }

  return `
  <div class="dtlh detalhes-iniciais">
    <div class="nome" id="inome">${objTecnico.nome}</div>
    <div class="rg">CPF:&nbsp<span id="rg">${objTecnico.cpf}</span></div>
    <div class="situacao"">Status:&nbsp <span id="status-${status}">${objTecnico.status}</span></div>
  </div>
  <div class="delete"><button class="btn-delete" type="button"><i class="fa-solid fa-trash"></i></button></div>
  <hr>
  <div class=" dtlh detalhes-completos">
    <div class="dias-trabalho">Dias Trabalhados:&nbsp <span id="diasTrabalho">${objTecnico.diasTrabalhados}&nbspdias</span></div>
    <div class="media-na-base">T. medio na Base:&nbsp <span id="mediaNaBase">${objTecnico.tempoBase}</span></div>
    <div class="media-chegada">H. media Chegada:&nbsp <span id="mChegada">${objTecnico.horaMediaChegada}</span></div>
    <div class="cep">Regiao:&nbsp <span id="cep">${objTecnico.cep}</span></div>
    <div class="parceiro">Parceiro:&nbsp <span class="${Parceiro}" id="parceiro">${objTecnico.parceiro}</span></div>
    <div class="codigo">Codigo:&nbsp<span id="codigo">${objTecnico.codigo}</span></div>
  </div>
  `
}

function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const limparInputs = (nome, cpf, regiao, inputParceiro) => {
  nome.value = ''
  cpf.value = ''
  regiao.value = ''
  inputParceiro.value = ''
  cpf.style.border = '1px solid #F2F2F2'
  inputParceiro.style.border = '1px solid #F2F2F2'
}

export const mascara = (i) => {
  let v = i.value;
  if (isNaN(v[v.length - 1])) { // impede entrar outro caractere que não seja número
    i.value = v.substring(0, v.length - 1);
    return;
  }
  i.setAttribute("maxlength", "14");
  if (v.length == 3 || v.length == 7) i.value += ".";
  if (v.length == 11) i.value += "-";
}

export const cadastrarNovoTecnico = (boxNovoTecnico, CadastroLocalStorage, inputNome, inputCPF, inputRegiao, inputParceiro) => {
  boxNovoTecnico.style.display = 'none'
  const codigo = constroiCodigoTecnico(CadastroLocalStorage, inputNome.value, inputCPF.value)
  const NovoTecnico = novoCadastro(inputNome.value, inputCPF.value, inputRegiao.value, inputParceiro.value, codigo)

  let jsonCadastro = JSON.parse(localStorage.getItem('Cadastro'))
  jsonCadastro.push(NovoTecnico)
  jsonCadastro = JSON.stringify(jsonCadastro)
  localStorage.setItem('Cadastro', jsonCadastro)

  alert(`
    Novo Técnico Cadastrado!
    Seu código é: ${codigo}
  `)
  window.location.reload()
}

export const verificaCadastroJson = (cadastroJSON) => {
  const jsonCadastro = localStorage.getItem('Cadastro');
  let json;
  if (!jsonCadastro) {
    json = JSON.stringify(cadastroJSON)
    localStorage.setItem('Cadastro', json)
    json = JSON.parse(localStorage.getItem('Cadastro'))
  } else {
    json = JSON.parse(localStorage.getItem('Cadastro'))
  }

  return json
}

function constroiCodigoTecnico(CadastroLocalStorage, nome, cpf) {
  let codigo = nome.slice(0, 1).toUpperCase() + cpf.slice(0, 3)
  const exiteCodigo = CadastroLocalStorage.find(value => value.codigo === codigo);
  (exiteCodigo) ? codigo = nome.slice(0, 1).toUpperCase() + cpf.slice(4, 7) : '';
  return codigo
}

function novoCadastro(nome, cpf, regiao, parceiro, codigo) {
  return {
    codigo: codigo,
    nome: nome.toUpperCase(),
    cpf: cpf,
    parceiro: parceiro,
    base: "PA_SAO",
    cep: regiao,
    status: "ATIVO",
    tempoBase: "00h00",
    horaMediaChegada: "00h00",
    diasTrabalhados: 0
  }
}

export const deleteTecnico = (codigo) => {
  const cadastroAtualizado = cadastro.filter(el => el.codigo !== codigo)
  localStorage.setItem('Cadastro', JSON.stringify(cadastroAtualizado))

  alert('Técnico excluído!')
  window.location.reload();
}

export const atualizaDiasT = (codigoRegistrado) => {
  cadastro.forEach(value => {
    (value.codigo === codigoRegistrado) ? value.diasTrabalhados += 1 : '';
  })
  localStorage.setItem('Cadastro', JSON.stringify(cadastro))
}

export const salvaHoraChegada = (codigo, horaChegada) => {
  const searchTechnician = cadastro.find(tecnico => {
    if (tecnico.codigo === codigo) {
      const horaChegadaEmMinutos = converteHora(horaChegada.slice(0, 5))
      const horaMediaTecnicoSalva = converteHora(tecnico.horaMediaChegada.slice(0, 5))
      const horaCalculada = calcularMediaPonderada(horaMediaTecnicoSalva, horaChegadaEmMinutos, tecnico.diasTrabalhados)
      const horaDesconvertida = converterMinutosParaHoras(horaCalculada)
      tecnico.horaMediaChegada = `${horaDesconvertida}`
    }
  })

  localStorage.setItem('Cadastro', JSON.stringify(cadastro))
}

function converteHora(horaChegada) {
  if (horaChegada) {
    const [horas, minutos] = horaChegada.split(':');
    const minutosTotais = (parseInt(horas) * 60) + parseInt(minutos);

    return minutosTotais;
  }
}

function calcularMediaPonderada(horaMediaChegada, horaChegadaHoje, diasT) {
  if (horaMediaChegada > 0) {
    const mediaPonderada = ((horaMediaChegada * diasT) + horaChegadaHoje) / (diasT + 1);
    return mediaPonderada;
  } else {
    return horaChegadaHoje
  }
}

function converterMinutosParaHoras(minutos) {
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = Math.floor(minutos % 60);

  const horasFormatadas = horas.toString().padStart(2, '0');
  const minutosFormatados = minutosRestantes.toString().padStart(2, '0');

  return horasFormatadas + ':' + minutosFormatados;
}

export function salvarTempoNaBase(codigoTec) {
  cadastro.forEach(value => {
    if (value.codigo === codigoTec) {
      calculaMediaTempoBase(value, TecnicosHoje.recebeJsonExpedicao(DTHR.dataAtual()))
    }
  })
}

function calculaMediaTempoBase(cadastroTec, jsonExpedicao) {
  jsonExpedicao.forEach(value => {
    if(cadastroTec.codigo === value.codigo){
      const tempoBaseHoje = converteHora(value.tempoNaBase)
      const tempoMediaNaBase = converteHora(cadastroTec.tempoBase)
      const mediaPonderada = calcularMediaPonderada(tempoMediaNaBase, tempoBaseHoje, cadastroTec.diasTrabalhados)
      const horaDesconvertida = converterMinutosParaHoras(mediaPonderada)
    
      salvaMediaCadastro(horaDesconvertida, value.codigo)
    }
  })
 
}

function salvaMediaCadastro(media, codigoTecnico) {
  cadastro.forEach(value => {
    if (value.codigo === codigoTecnico) {
      value.tempoBase = media
    }
  })
  localStorage.setItem('Cadastro', JSON.stringify(cadastro))
}