export const translations = {
  en: {
    // Layout
    title: "IP Geolocation Lookup",
    subtitle: "Discover detailed geographic information about any IP address",
    footer: "Made with Love ❤️",
    
    // Components - General
    error: "Error",
    copied: "Copied!",
    linkCopied: "Link copied to clipboard!",
    notAvailable: "N/A",
    navApi: "API Documentation",
    navIntelligence: "Intelligence Tools",
    systemStatus: "System Status",
    msLatency: "ms latency",
    theme: "Theme",
    language: "Language",
    
    // Components - IP Search Form
    searchPlaceholder: "Enter an IP address or domain",
    searchButton: "Search",
    myIpButton: "My IP",
    preciseLocation: "Precise Location",
    searching: "Searching...",
    
    // Components - Search History
    historyTitle: "Recent Searches",
    historyClear: "Clear",
    historyEmpty: "No recent searches",

    // Geolocation Results
    ip: "IP Address",
    country: "Country",
    region: "Region",
    city: "City",
    continent: "Continent",
    timezone: "Timezone",
    localTime: "Local Time",
    coordinates: "Coordinates",
    isp: "ISP",
    asn: "ASN",
    organization: "Organization",
    hostname: "Hostname",
    currency: "Currency",
    callingCode: "Calling Code",
    security: "Security",
    technicalDetails: "Technical Data",
    securityThreat: "Threat level",
    botDetected: "Bot/Crawler",
    torDetected: "TOR Detected",
    spamDetected: "Spam Source",
    connectionSpeed: "Connection Speed",
    ispPing: "ISP Ping",
    
    // Security Status
    vpnDetected: "VPN Detected",
    proxyDetected: "Proxy Detected",
    clean: "Clean",
    
    // Actions
    copy: "Copy",
    exportJson: "Export JSON",
    exportCsv: "Export CSV",
    share: "Share",

    // API Docs
    apiTitle: "API Documentation",
    apiSubtitle: "Integrate our high-performance geolocation data into your own applications.",
    apiEndpoint: "Endpoints",
    apiParams: "Parameters",
    apiResponse: "Response Format",
    apiExamples: "Examples",
    apiGetIp: "Get Geolocation Data",
    apiDescription: "Returns detailed information about an IP address or domain name.",
    apiParamIp: "The IP address or domain to look up. If omitted, uses the requester's IP.",
    apiAuth: "Authentication",
    apiNoAuth: "No API key required for public access (rate limited).",
    apiTableParam: "Parameter",
    apiTableType: "Type",
    apiTableRequired: "Required",
    apiYes: "Yes",
    apiNo: "No",
    apiCurl: "cURL",
    apiJS: "JavaScript (Fetch)",
    apiPingTitle: "Network Latency (Ping)",
    apiPingDescription: "Performs a real-time TCP ping to a target host or IP.",
    apiPingParamHost: "The target host or IP address to ping.",
    apiGithubTitle: "GitHub OSINT Intelligence",
    apiGithubDescription: "Extracts deep intelligence from a GitHub profile, including tech stack and activity.",
    apiGithubParamUsername: "The GitHub username to investigate.",
    
    whitelisted: "Whitelisted",
    safe: "Safe / Clean IP",
    suspicious: "Suspicious Activity",
    highRisk: "High Risk / Malicious",

    // WHOIS Intelligence
    whoisTitle: "WHOIS Intelligence",
    whoisOwner: "Owner / Registrant",
    whoisCreated: "Registration Date",
    whoisAbuse: "Abuse Contact",
    whoisRegistrar: "Registrar / Source",
    whoisRaw: "Show Raw WHOIS",
    whoisRawTitle: "Raw WHOIS Data",
    close: "Close",
    
    // Health API
    apiHealthTitle: "System Integrity (Health)",
    apiHealthDescription: "Monitors the backend operational status, uptime, and versioning.",

    // 404 Page
    nfTitle: "404",
    nfSubtitle: "Lost in Cyberspace?",
    nfDescription: "The coordinate you're looking for doesn't exist or has been relocated to an unknown region.",
    nfReturnHome: "Return to Home",
    nfErrorCode: "Error Code: NOT_FOUND_SIGNAL",
  },
  pt: {
    // Layout
    title: "GeoIP Intelligence Tool",
    subtitle: "Geolocalização de IP e Inteligência de Rede Avançada",
    footer: "Feito com Amor ❤️",
    
    // Components - General
    error: "Erro",
    copied: "Copiado!",
    linkCopied: "Link copiado para a área de transferência!",
    notAvailable: "N/A",
    navApi: "Documentação da API",
    navIntelligence: "Ferramentas de Inteligência",
    systemStatus: "Status do Sistema",
    msLatency: "ms de latência",
    theme: "Tema",
    language: "Idioma",
    
    // Components - IP Search Form
    searchPlaceholder: "Digite um endereço IP ou domínio",
    searchButton: "Consultar",
    myIpButton: "Meu IP",
    preciseLocation: "GPS (Alta Precisão)",
    searching: "Buscando...",
    
    // Components - Search History
    historyTitle: "Buscas Recentes",
    historyClear: "Limpar",
    historyEmpty: "Nenhuma busca recente",

    // Geolocation Results
    ip: "Endereço IP",
    country: "País",
    region: "Região",
    city: "Cidade",
    continent: "Continente",
    timezone: "Fuso Horário",
    localTime: "Hora Local",
    coordinates: "Coordenadas",
    isp: "ISP",
    asn: "ASN",
    organization: "Organização",
    hostname: "Nome do Host",
    currency: "Moeda",
    callingCode: "Cód. Discagem",
    security: "Segurança",
    technicalDetails: "Dados Técnicos",
    securityThreat: "Nível de Ameaça",
    botDetected: "Bot/Crawler",
    torDetected: "TOR Detectado",
    spamDetected: "Fonte de Spam",
    connectionSpeed: "Velocidade de Conexão",
    ispPing: "Ping (Provedor)",
    
    // Security Status
    vpnDetected: "VPN Detectada",
    proxyDetected: "Proxy Detectado",
    clean: "Limpo",
    
    // Actions
    copy: "Copiar",
    exportJson: "Exportar JSON",
    exportCsv: "Exportar CSV",
    share: "Compartilhar",

    // API Docs
    apiTitle: "Documentação da API",
    apiSubtitle: "Integre nossos dados de geolocalização de alta performance em suas próprias aplicações.",
    apiEndpoint: "Endpoints",
    apiParams: "Parâmetros",
    apiResponse: "Formato de Resposta",
    apiExamples: "Exemplos",
    apiGetIp: "Obter Dados de Geolocalização",
    apiDescription: "Retorna informações detalhadas sobre um endereço IP ou nome de domínio.",
    apiParamIp: "O endereço IP ou domínio a ser consultado. Se omitido, utiliza o IP do solicitante.",
    apiAuth: "Autenticação",
    apiNoAuth: "Nenhuma chave de API é necessária para acesso público (limite de taxa aplicado).",
    apiTableParam: "Parâmetro",
    apiTableType: "Tipo",
    apiTableRequired: "Obrigatório",
    apiYes: "Sim",
    apiNo: "Não",
    apiCurl: "cURL",
    apiJS: "JavaScript (Fetch)",
    apiPingTitle: "Latência de Rede (Ping)",
    apiPingDescription: "Realiza um ping TCP em tempo real para um host ou IP de destino.",
    apiPingParamHost: "O host ou endereço IP de destino para o ping.",
    apiGithubTitle: "Inteligência GitHub OSINT",
    apiGithubDescription: "Extrai inteligência profunda de um perfil do GitHub, incluindo stack tecnológica e atividade.",
    apiGithubParamUsername: "O nome de usuário do GitHub a ser investigado.",
    
    whitelisted: "Lista Branca (Whitelist)",
    safe: "IP Seguro / Limpo",
    suspicious: "Atividade Suspeita",
    highRisk: "Alto Risco / Malicioso",

    // WHOIS Intelligence
    whoisTitle: "Inteligência WHOIS",
    whoisOwner: "Proprietário / Registrante",
    whoisCreated: "Data de Registro",
    whoisAbuse: "Contato de Abuso",
    whoisRegistrar: "Registrador / Fonte",
    whoisRaw: "Ver WHOIS Bruto",
    whoisRawTitle: "Dados WHOIS Brutos",
    close: "Fechar",

    // Health API
    apiHealthTitle: "Integridade do Sistema (Health)",
    apiHealthDescription: "Monitora o status operacional do backend, uptime e versão.",

    // 404 Page
    nfTitle: "404",
    nfSubtitle: "Perdido no Ciberespaço?",
    nfDescription: "A coordenada que você está procurando não existe ou foi realocada para uma região desconhecida.",
    nfReturnHome: "Voltar para o Início",
    nfErrorCode: "Código de Erro: SINAL_NAO_ENCONTRADO",
  },
}

export type Language = keyof typeof translations
export type TranslationKeys = keyof typeof translations.en
