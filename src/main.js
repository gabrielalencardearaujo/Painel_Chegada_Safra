// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
import './assets/css/style.css';
import { TecnicoDadosHoje, mostraTecnicoPainelReversa, recebeDadosJSON, criaNovoJSON, alteraStatusReversa, alteraStatusExpedicao, atualizaDadosTecnico, recebeJsonExpedicao, mostraTecnicoPainelExpedicao } from './modules/TecnicosHoje.js';
import * as DTHR from './modules/DTHR.js';
import * as ERROR from './modules/error.js';
import * as DRAGDROP from './modules/dragDrop.js';
import * as Cadastro from './cadastro.js';
import * as ValidadorCPF from './modules/ValidaCPF.js';
// import * as DataBase from './modules/manager_base.js';
const cadastroJSON = require('../Data_Base/cadastro.json');


(function (pageActually) {
  if (pageActually.includes('index')) {
    const btnRegistro = document.querySelector('.btn-registro')
    const inputRegistro = document.querySelector('.input-chegada')
    const listaTecnicos = document.querySelectorAll('.lista-tecnicos')
    const btnStatus = document.querySelectorAll('.status')


    const dataAtual = DTHR.dataAtual()
    criaNovoJSON(dataAtual)
    mostraTecnicoPainelReversa(recebeDadosJSON(dataAtual), listaTecnicos[0], 'reversa');
    mostraTecnicoPainelExpedicao(recebeJsonExpedicao(dataAtual), listaTecnicos[1], 'expedido');
    DTHR.tempoNaBase(dataAtual)

    btnRegistro.onclick = (e) => {
      const tecnicoVerificado = ERROR.verificaCadastro(inputRegistro.value)
      if (tecnicoVerificado) {
        const horaRegistro = DTHR.horaAtual()

        tecnicoVerificado.horaChegada = horaRegistro

        const tecnicoDadosHoje = new TecnicoDadosHoje(
          tecnicoVerificado.codigo,
          tecnicoVerificado.horaChegada,
          tecnicoVerificado.horaExpedido,
          tecnicoVerificado.horaReversa,
          tecnicoVerificado.naBase,
          tecnicoVerificado.nome);

        tecnicoDadosHoje.manager(dataAtual, tecnicoVerificado)
        Cadastro.atualizaDiasT(tecnicoVerificado.codigo)
        Cadastro.salvaHoraChegada(tecnicoVerificado.codigo, horaRegistro)
      } else {
        ERROR.codigoRegistoIncorreto()
      }
      inputRegistro.value = ''
    }

    document.addEventListener('click', (e) => {
      const elemento = e.target
      if (elemento.id === 'reversa') { alteraStatusReversa(elemento, dataAtual) }
      else if (elemento.id === 'expedido') {
        alteraStatusExpedicao(elemento, dataAtual, DTHR.horaAtual())
        const tecnico = elemento.parentElement.parentElement.querySelector('label');
        (tecnico.htmlFor) ? Cadastro.salvarTempoNaBase(tecnico.htmlFor) : '';
      }
    })

    const dragDrop = (listaTecnicos) => {
      const filaEsperando = document.querySelectorAll('.esperando')
      document.addEventListener('dragstart', e => { e.target.classList.add('dragging') })
      document.addEventListener('dragend', e => { e.target.classList.remove('dragging') })

      listaTecnicos.forEach(item => {
        item.addEventListener('dragover', (e) => {
          const dragging = document.querySelector('.dragging')
          const tecnicosJSON = recebeDadosJSON(dataAtual)
          const listAguardando = item.querySelector('.esperando')

          if (listAguardando) {
            DRAGDROP.alterandoStatus(dragging, listAguardando)
            DRAGDROP.alterandoHora(dragging, listAguardando, DTHR.horaAtual())

            for (let tecnico in tecnicosJSON) {
              if (tecnicosJSON[tecnico]) {
                if (tecnicosJSON[tecnico].codigo == dragging.querySelector('.trigger_input').id) {
                  atualizaDadosTecnico(tecnicosJSON[tecnico], DTHR.horaAtual(), dataAtual)
                }
              }
            }
          }
        })
      })
    }
    dragDrop(listaTecnicos)

  } else if (pageActually.includes('cadastro')) {

    const listaTecnicos = document.querySelector('.lista-tecnicos')
    const inputName = document.querySelector('.nome-tecnico')
    const naoEncontrado = document.querySelector('.nao-encontrado')
    const tecnicosAtivos = document.querySelector('#iativos');
    const boxNovoTecnico = document.querySelector('.novo-cadastro')
    const btnNovoTecnico = document.querySelector('.novo-tecnico')
    const btnVoltar = document.querySelector('.btn-voltar-cadastro')

    const CadastroLocalStorage = Cadastro.verificaCadastroJson(cadastroJSON)

    Cadastro.contaAtivos(tecnicosAtivos);
    Cadastro.TecnicosCadastro(listaTecnicos);

    btnVoltar.onclick = e => boxNovoTecnico.style.display = 'none';
    btnNovoTecnico.onclick = (e) => {
      boxNovoTecnico.style.display = 'block';
      const inputNome = boxNovoTecnico.querySelector('.nome-novo-tecnico')
      const inputCPF = boxNovoTecnico.querySelector('.cpf-novo-tecnico')
      const inputRegiao = boxNovoTecnico.querySelector('.regiao-novo-tenico')
      const inputParceiro = boxNovoTecnico.querySelector('.parceiro-novo-tecnico')
      const btnSalvar = boxNovoTecnico.querySelector('.btn-salvar-cadastro')
      let cpfValidado;

      Cadastro.limparInputs(inputNome, inputCPF, inputRegiao, inputParceiro);
      inputCPF.oninput = e => Cadastro.mascara(inputCPF);
      inputCPF.onblur = e => {
        const verificaCPF = ValidadorCPF.validarCPF(inputCPF.value);
        (!verificaCPF) ? inputCPF.style.border = '2px solid tomato' : inputCPF.style.border = '2px solid var(--primary-color)';
        cpfValidado = verificaCPF
      }

      btnSalvar.onclick = (e) => {
        if (!cpfValidado || inputParceiro.value === '' || inputNome.value === '' || inputRegiao.value == '') {
          (!cpfValidado) ? inputCPF.style.border = '2px solid tomato' : inputCPF.style.border = '1px solid #F2F2F2';
          (inputParceiro.value === '') ? inputParceiro.style.border = '2px solid tomato' : inputParceiro.style.border = '1px solid #F2F2F2';
          (inputNome.value === '') ? inputNome.style.border = '2px solid tomato' : inputNome.style.border = '1px solid #F2F2F2';
          (inputRegiao.value === '') ? inputRegiao.style.border = '2px solid tomato' : inputRegiao.style.border = '1px solid #F2F2F2';
        } else {
          Cadastro.cadastrarNovoTecnico(boxNovoTecnico, CadastroLocalStorage, inputNome, inputCPF, inputRegiao, inputParceiro)
        }
      }
    }

    document.addEventListener('click', e => {
      if (e.target.classList.contains('btn-delete') || e.target.classList.contains('fa-trash')) {
        const parentElement = e.target.parentElement
        const dadElement = parentElement.parentElement.parentElement
        const codigoTecnico = dadElement.querySelector('#codigo')

        Cadastro.deleteTecnico(codigoTecnico.textContent)
      }
    });

    inputName.addEventListener('keyup', (e) => Cadastro.pesquisaTecnico(e.keyCode, e.target.value, listaTecnicos, naoEncontrado))
  }

})(window.location.pathname);
