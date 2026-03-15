const express = require('express');
const router = express.Router();
const { getGithubProfile } = require('./controller');

/**
 * Definição das rotas para o módulo de GitHub Intelligence (OSINT).
 */
router.get('/', getGithubProfile);

module.exports = router;
