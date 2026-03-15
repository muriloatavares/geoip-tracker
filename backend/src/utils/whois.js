const whois = require('whois');
const { promisify } = require('util');

const lookup = promisify(whois.lookup);

/**
 * Utilitário para realizar consultas WHOIS e extrair TODOS os dados disponíveis.
 * Parseia cada linha "chave: valor" do texto bruto em um objeto estruturado.
 */
async function getWhoisData(ip) {
  try {
    // Realiza a consulta bruta
    const rawData = await lookup(ip, { follow: 5 });
    
    if (!rawData) return null;

    // Parseia TODOS os campos chave:valor do texto bruto
    const allFields = parseAllFields(rawData);

    return {
      // Campos destacados (para exibição principal)
      owner: extractField(rawData, [/registrant-organization:\s*(.*)/i, /OrgName:\s*(.*)/i, /owner:\s*(.*)/i, /netname:\s*(.*)/i, /Registrant:\s*(.*)/i]),
      creationDate: extractField(rawData, [/Creation Date:\s*(.*)/i, /created:\s*(.*)/i, /regdate:\s*(.*)/i, /Date-Created:\s*(.*)/i]),
      abuseEmail: extractField(rawData, [/Abuse Contact Email:\s*(.*)/i, /OrgAbuseEmail:\s*(.*)/i, /abuse-mailbox:\s*(.*)/i, /e-mail:\s*(.*)/i]),
      registrar: extractField(rawData, [/Registrar:\s*(.*)/i, /source:\s*(.*)/i]),
      // Todos os campos parseados
      fields: allFields,
      // Texto bruto completo
      raw: rawData
    };
  } catch (err) {
    console.error(`Erro no WHOIS para ${ip}:`, err.message);
    return null;
  }
}

/**
 * Parseia TODAS as linhas "chave: valor" do texto WHOIS bruto.
 * Agrupa campos repetidos e ignora comentários/linhas vazias.
 */
function parseAllFields(text) {
  const fields = {};
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Ignora linhas vazias, comentários (# ou %) e delimitadores
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('%') || trimmed.startsWith('>>>') || trimmed.startsWith('---')) {
      continue;
    }

    // Tenta parsear no formato "chave: valor"
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0 && colonIndex < trimmed.length - 1) {
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      // Ignora chaves vazias ou valores vazios
      if (!key || !value) continue;
      // Ignora linhas que parecem URLs ou dados binários
      if (key.length > 50) continue;

      // Se o campo já existe, transforma em array ou adiciona ao array
      if (fields[key]) {
        if (Array.isArray(fields[key])) {
          // Evita duplicatas
          if (!fields[key].includes(value)) {
            fields[key].push(value);
          }
        } else {
          if (fields[key] !== value) {
            fields[key] = [fields[key], value];
          }
        }
      } else {
        fields[key] = value;
      }
    }
  }

  return fields;
}

/**
 * Tenta extrair um campo usando múltiplos padrões de Regex
 */
function extractField(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = match[1].trim();
      if (value && value.length > 2 && !value.startsWith('http')) {
        return value;
      }
    }
  }
  return "Informação não disponível";
}

module.exports = { getWhoisData };
