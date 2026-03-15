const express = require('express');
const router = express.Router();
const { getHealth } = require('./controller');

/**
 * Rota para Health Check.
 * Utilizada para monitoramento e verificação de uptime.
 */
router.get('/', getHealth);

module.exports = router;
