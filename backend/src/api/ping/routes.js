const express = require('express');
const router = express.Router();
const { pingHost } = require('./controller');

/**
 * Definição das rotas para o módulo de monitoramento de Latência (Ping).
 */
router.get('/', pingHost);

module.exports = router;
