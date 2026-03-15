const express = require('express');
const router = express.Router();
const { getGeolocation } = require('./controller');

/**
 * Definição das rotas para o módulo de Geolocalização.
 */
router.get('/', getGeolocation);

module.exports = router;
