const axios = require('axios');
const dns = require('dns').promises;

/**
 * Utilitário para evitar ataques de SSRF (Server Side Request Forgery)
 * Bloqueia range de IPs privados e locais.
 */
function isPrivateIP(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  return (
    parts[0] === 10 || 
    (parts[0] === 172 && (parts[1] >= 16 && parts[1] <= 31)) || 
    (parts[0] === 192 && parts[1] === 168) || 
    (parts[0] === 169 && parts[1] === 254) || 
    parts[0] === 127 || 
    parts[0] === 0 || 
    parts[0] >= 224
  );
}

/**
 * Verificação de Latência (Ping)
 * Tenta realizar uma requisição HEAD para medir o tempo de resposta do host.
 */
async function pingHost(req, res) {
  const host = req.query.host || '1.1.1.1';
  const TIMEOUT_MS = 3000;
  const VERSION = "1.2.1";

  // Resposta padrão caso o host esteja offline ou inacessível
  const defaultResponse = (status = 'degraded') => ({
    status,
    alive: false,
    latency: null,
    uptime: Math.floor(process.uptime()),
    version: VERSION,
    timestamp: Date.now()
  });

  try {
    // Validação básica de formato de domínio
    const hostRegex = /^(?=.{1,255}$)[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!hostRegex.test(host)) return res.json(defaultResponse('offline'));

    let resolvedIp;
    try {
      // Resolvemos o domínio para IP antes de tentar o contato direto
      const addresses = await dns.resolve4(host);
      resolvedIp = addresses[0];
    } catch {
      if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host)) resolvedIp = host;
      else return res.json(defaultResponse('offline'));
    }

    // Segurança: Não permitimos pingar nossa própria rede interna
    if (isPrivateIP(resolvedIp)) return res.json(defaultResponse('offline'));

    const start = Date.now();

    try {
      // Usamos um HEAD simples para minimizar o tráfego
      await axios.head(`http://${resolvedIp}`, {
        headers: { 'Host': host },
        timeout: TIMEOUT_MS
      });

      const end = Date.now();
      
      return res.json({
        status: 'ok',
        alive: true,
        latency: Math.max(1, Math.round(end - start)),
        uptime: Math.floor(process.uptime()),
        version: VERSION,
        timestamp: Date.now()
      });
    } catch {
      return res.json(defaultResponse('degraded'));
    }
  } catch {
    return res.json(defaultResponse('offline'));
  }
}

module.exports = { pingHost };
