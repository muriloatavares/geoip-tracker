/**
 * Configuração principal do Servidor Backend
 * Aqui centralizamos os middlewares, rotas e inicialização do Express.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Importação das rotas modularizadas
const geoRoutes = require('./api/geolocation/routes');
const githubRoutes = require('./api/github/routes');
const pingRoutes = require('./api/ping/routes');
const healthRoutes = require('./api/health/routes');
const rateLimiter = require('./middleware/rate-limiter');

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Middlewares Globais
 * - Helmet: Segurança nos headers HTTP
 * - Compression: Compactação Gzip para respostas mais rápidas
 * - CORS: Permite requisições do frontend
 * - JSON: Parsing automático de corpos de requisição
 */
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Limite de requisições aplicado a todas as rotas da API
app.use('/api', rateLimiter);

/**
 * Definição das Rotas da API
 */
app.use('/api/geolocation', geoRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ping', pingRoutes);
app.use('/api/health', healthRoutes);

/**
 * Redirecionamento de Root Health
 * Facilita monitoramento externo e documentação da API.
 */
app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});
