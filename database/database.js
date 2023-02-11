const Sequelize = require('sequelize')
const connection = new Sequelize('guiaPerguntas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
})

module.exports = connection
