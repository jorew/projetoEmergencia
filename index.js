const express = require('express');
const router = express.Router();

/* Rota Principal Única */
router.get('/', (req, res) => {
  res.render('index', { title: 'Jogo de Decisões' });
});

module.exports = router;