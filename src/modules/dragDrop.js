export function alterandoStatus(dragging, listAguardando) {
  const mudarStatus = dragging.querySelector('.status')

  mudarStatus.id = 'expedido'
  mudarStatus.textContent = 'AGUARDANDO'
  mudarStatus.classList.remove('reversa')
  mudarStatus.classList.add('expedicao')
  mudarStatus.style.color = 'var(--background-primary-color)'
  listAguardando.appendChild(dragging)
  dragging.removeAttribute('draggable')
}

export function alterandoHora(dragging, listAguardando, horaReversa){
  const mudarHora = dragging.querySelector('#hora-status')
  const salvandoHoraReversa = dragging.querySelector('#ireversa')
  mudarHora.querySelector('.nome-status').innerHTML = `Reversa`
  mudarHora.querySelector('#hora').textContent = horaReversa
  salvandoHoraReversa.textContent = horaReversa
}
