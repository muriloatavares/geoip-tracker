/**
 * Controlador para verificação de integridade (Health Check).
 * Fornece informações básicas sobre o status do sistema.
 */

/**
 * Retorna o status atual da API, timestamp e versão.
 */
function getHealth(req, res) {
  res.json({
    status: 'ok',
    message: 'Sistema operacional e respondendo.',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
}

module.exports = { getHealth };
