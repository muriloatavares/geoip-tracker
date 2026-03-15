/**
 * Middleware de LIMITAÇÃO DE TAXA (Rate Limiter) para Express
 */
const rateLimitStore = new Map();

const LIMIT = 100;
const WINDOW_MS = 60 * 1000;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (record.count >= LIMIT) {
    return res.status(429).json({
      status: 'error',
      message: 'Muitas requisições. Por favor, tente novamente em um minuto.',
      retryAfter: Math.ceil((record.resetAt - now) / 1000)
    });
  }

  record.count++;
  next();
}

module.exports = rateLimiter;
