const axios = require('axios');
const { globalCache } = require('../../utils/cache');
const { enrichCountryData } = require('../../utils/country-data');
const { getWhoisData } = require('../../utils/whois');

/**
 * Controlador principal de Geolocalização
 * Este endpoint tenta identificar a localização de um IP ou domínio usando vários provedores.
 */
async function getGeolocation(req, res) {
  try {
    let ip = req.query.ip || "";

    // Primeiro, checamos se temos esse IP no cache para poupar requisições externas
    if (ip !== "me" && ip !== "") {
      const cached = await globalCache.get(`geo:${ip}`);
      if (cached) {
        return res.json({ ...cached, _cached: true });
      }
    }

    let data = null;
    let hostname = "Hostname não disponível";

    // 1. Caso o usuário queira descobrir o próprio IP ('me' ou vazio)
    if (ip === "me" || ip === "") {
      try {
        const response = await axios.get("https://ipwho.is/", {
          headers: { "Accept": "application/json", "User-Agent": "GeoIP-App" },
          timeout: 5000
        });
        const ipData = response.data;
        if (ipData.success) {
          data = mapIpWhoToResponse(ipData, hostname);
          ip = ipData.ip;
        }
      } catch (e) {
        console.error("Erro ao buscar IP próprio:", e.message);
      }

      // Fallback: tentar pegar o IP direto dos headers da requisição
      if (!data && (ip === "me" || ip === "")) {
        ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
        if (ip.includes(',')) ip = ip.split(',')[0].trim();
      }
    }

    if (!data) {
      // Se cair em localhost, usamos o DNS do Google como padrão para testes
      if (!ip || ip === "::1" || ip === "127.0.0.1") {
         ip = "8.8.8.8"; 
      }

      // 2. Validação básica: é um IP ou um domínio?
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}$/;
      const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) || ip.includes(':');

      // Se for domínio, resolvemos o IP via Google DNS antes de prosseguir
      if (!isIp && domainRegex.test(ip)) {
        try {
          const dnsRes = await axios.get("https://dns.google/resolve?name=" + encodeURIComponent(ip) + "&type=A");
          if (dnsRes.data?.Answer?.[0]?.data) ip = dnsRes.data.Answer[0].data;
          else return res.status(400).json({ status: "error", message: "Não foi possível resolver o domínio", input: ip });
        } catch {
          return res.status(400).json({ status: "error", message: "Falha na resolução de DNS", input: ip });
        }
      }
    }

    // 3. Busca Multi-Provedor (Failover)
    // Tentamos o ip-api como primário e ipwho.is como secundário
    if (!data) {
      try {
        const resIp = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,continent,country,countryCode,region,regionName,city,zip,lat,lon,timezone,offset,currency,isp,org,as,mobile,proxy,hosting,query`, { timeout: 5000 });
        const ipData = resIp.data;
        if (ipData.status === "success") {
          data = mapIpApiToResponse(ipData, hostname);
        } else {
          throw new Error(ipData.message || "Provedor primário falhou");
        }
      } catch (err) {
        console.warn("Provedor primário falhou, tentando fallback...");
        try {
          const resWho = await axios.get(`https://ipwho.is/${ip}`, { timeout: 5000 });
          const ipData = resWho.data;
          if (ipData.success) {
            data = mapIpWhoToResponse(ipData, hostname);
          } else {
            throw new Error("Provedor secundário também falhou");
          }
        } catch (fbErr) {
          console.error("Todos os provedores de GeoIP falharam:", fbErr.message);
        }
      }
    }

    // 4. Enriquecimento dos Dados (Moeda, DDI, etc)
    if (data && data.countryCode) {
      const extra = enrichCountryData(data.countryCode);
      if (extra) {
        if (!data.currency) data.currency = extra.currency;
        if (!data.currencySymbol) data.currencySymbol = extra.currencySymbol;
        if (!data.callingCode) data.callingCode = extra.callingCode;
      }
    }

    // 5. Integração com WHOIS Intelligence (Proprietário do IP)
    if (data && data.query) {
      const whoisData = await getWhoisData(data.query);
      if (whoisData) {
        data.whois = whoisData;
      }
    }


    if (data) {
      // Salva no cache por 5 minutos (300s) se for uma busca válida
      if (ip !== "me" && ip !== "") {
        await globalCache.set(`geo:${ip}`, data, 300);
      }
      return res.json(data);
    } else {
      return res.status(503).json({ status: "error", message: "Serviço de geolocalização temporariamente indisponível." });
    }

  } catch (error) {
    console.error("Erro Global na API:", error);
    return res.status(500).json({ status: "error", message: "Erro interno no servidor" });
  }
}

/**
 * Converte o formato do ipwho.is para o nosso padrão interno
 */
function mapIpWhoToResponse(data, hostname) {
  return {
    status: "success",
    query: data.ip,
    country: data.country,
    countryCode: data.country_code,
    regionName: data.region,
    city: data.city,
    lat: data.latitude,
    lon: data.longitude,
    timezone: data.timezone?.id || data.timezone,
    isp: data.connection?.isp || "Desconhecido",
    continent: data.continent,
    as: data.connection?.asn ? "AS" + data.connection.asn : "Desconhecido",
    org: data.connection?.org || "Desconhecido",
    hostname: hostname || "Não disponível",
    isVpn: data.security?.vpn || false,
    isProxy: data.security?.proxy || false,
    flag: data.flag?.emoji || "",
    currency: data.currency?.name || "",
    currencySymbol: data.currency?.symbol || "",
    callingCode: data.calling_code || "",
    localTime: data.timezone?.current_time || "",
    securityData: {
      isCrawler: data.security?.is_crawler || false,
      isSpam: data.security?.is_spam || false,
      isTor: data.security?.is_tor || false,
      isBot: data.security?.is_bot || false,
      threatLevel: data.security?.threat_level || "low"
    }
  };
}

/**
 * Converte o formato do ip-api para o nosso padrão interno
 */
function mapIpApiToResponse(data, hostname) {
  return {
    status: "success",
    query: data.query,
    country: data.country,
    countryCode: data.countryCode || "", 
    regionName: data.regionName,
    city: data.city,
    lat: data.lat,
    lon: data.lon,
    timezone: data.timezone,
    isp: data.isp,
    continent: data.continent,
    as: data.as,
    org: data.org,
    hostname: hostname || "Não disponível",
    isVpn: false,
    isProxy: false,
    flag: "",
    currency: "",
    currencySymbol: "",
    callingCode: "",
    localTime: new Date().toLocaleTimeString()
  };
}

/**
 * Mapeamento simples de códigos climáticos da Open-Meteo
 */
function mapWeatherCode(code) {
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "clouds";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "thunderstorm";
  return "clear";
}

module.exports = { getGeolocation };
