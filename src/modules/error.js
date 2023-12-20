const cadastro = JSON.parse(localStorage.getItem('Cadastro'));

export const codigoRegistoIncorreto = () => {
  console.log('CODIGO DE REGISTRO INCORRETO')
}

export const verificaCadastro = (codigo) => {
  const codigoUp = codigo.toUpperCase()
  const cadastroTecnicoAtual =  cadastro.find(objCadastro => {
    return objCadastro.codigo === codigoUp
  })

  return {
    nome: cadastroTecnicoAtual.nome,
    codigo: cadastroTecnicoAtual.codigo,
    horaChegada: '',
    horaReversa: '',
    horaExpedido: '',
    tempoNaBase: '00h00',
    status: 'AGUARDANDO',
    parceiro: cadastroTecnicoAtual.parceiro,
    regiao: cadastroTecnicoAtual.cep,
  }
}
