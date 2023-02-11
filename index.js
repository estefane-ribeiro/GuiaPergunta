const express = require('express')
const app = express()
// usando o body parser que é o responsável por dar acesso ao dados quando usa método post
const bodyParser = require('body-parser')
const connection = require('./database/database') // conexao com o banco de dados
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

connection
  .authenticate()
  .then(() => console.log('Conexão feita com sucesso!'))
  .catch(e => console.log(e))

/* estou dizendo que vou usar o motor de busca ejs para renderizar o html,  
o express vai usar o ejs como view engine. */
app.set('view engine', 'ejs')

/** Estou dizendo que vou usar arquivos estáticos no projeto como css, js, imgs ... */
app.use(express.static('public'))
// decodifica os dados enviados pelo formulario
app.use(bodyParser.urlencoded({ extended: false }))
// Permite que seja lido dados de formulários enviados via json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  Pergunta.findAll({
    raw: true,
    order: [
      ['id', 'DESC'] // ASC = crescente || DESC = descrecente
    ]
  }).then(pergunta => {
    res.render('index', { perguntas: pergunta })
  })
})

app.get('/perguntar', (req, res) => {
  res.render('perguntar')
})

app.post('/salvarPergunta', (req, res) => {
  let titulo = req.body.titulo
  let descricao = req.body.descricao
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => res.redirect('/'))
})

app.get('/pergunta/:id', (req, res) => {
  let id = req.params.id
  Pergunta.findOne({
    where: { id: id }
  }).then(pergunta => {
    if (pergunta != undefined) {
      // pergunta encontrada
      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [['id', 'DESC']]
      }).then(respostas => {
        res.render('pergunta', { pergunta, respostas })
      })
    } else {
      //pergunta não encontrada
      res.redirect('/')
    }
  })
})

app.post('/responder', (req, res) => {
  let resposta = req.body.resposta
  let perguntaId = req.body.pergunta

  Resposta.create({
    corpo: resposta,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect('/pergunta/' + perguntaId)
  })
})

app.listen(3000, () => console.log('Rodando'))
