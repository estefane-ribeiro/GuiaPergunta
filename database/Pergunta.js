const Sequelize = require('sequelize')
const connection = require('./database')

// Criando uma tabela chamada pergunta com as colunas titulo e descrição
const Pergunta = connection.define('perguntas', {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

/*
sincronizando com o banco de dados
force: caso a tabela já exista no db ele não vai forçar a criação novamente. 
Isso garante que a tabela só seja criada uma vez 
*/
Pergunta.sync({ force: false }).then(() => console.log('Tabela criada'))

module.exports = Pergunta
