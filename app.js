const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura o motor de views EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Servir arquivos estáticos (CSS, JS do cliente, imagens)
app.use(express.static(path.join(__dirname, 'static')));

// Importa e usa as rotas
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Tratamento de Erro 404
app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Página não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;