<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/globe-2.svg" width="80" alt="GeoIP Tracker Logo"/>
  <h1>🌍 GeoIP Intelligence Tracker</h1>

  <p><strong>Plataforma avançada de geolocalização IP com inteligência de WHOIS e OSINT.</strong></p>
<<<<<<< Updated upstream
  
=======

  <p>
    <a href="#-recursos">Recursos</a> •
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-instalação-e-uso">Instalação</a> •
    <a href="#-arquitetura-monorepo">Arquitetura</a>
  </p>

>>>>>>> Stashed changes
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Node.js-22-green?style=flat-square&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/Redis-Cache-red?style=flat-square&logo=redis" alt="Redis" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  </p>
</div>

---

O **GeoIP Intelligence Tracker** é uma ferramenta de nível premium (Enterprise) projetada para análises rápidas e avançadas de endereços de rede. O sistema rastreia localizações de IP, verifica latência de servidores e puxa relatórios de WHOIS direto dos cartórios de registro da internet (como ARIN, RIPE, etc).

## ✨ Recursos Principais

- **📍 Geolocalização Exata:** Descubra país, bandeira, cidade, região de qualquer IPv4 ou IPv6.
- **🛡️ Inteligência WHOIS (OSINT):** Extração detalhada do proprietário da rede (ASN), empresa holding, contatos oficiais e datas de registro.
- **⚡ Cache de Alta Performance:** Backend equipado com **Redis** e mecanismo de Fallback automático em memória, garantindo resposta em latência quase zero.
- **🌐 Bilingual UI:** Suporte robusto para Português (BR) e Inglês integrado de forma nativa.
- **💅 Premium UX:** Interface Cyberpunk/Glassmorphism com animações baseadas no país da busca atual. Sem recarregamentos bruscos (`flicker-free`).
- **🛡️ Rate Limiting:** Proteção nativa da API contra ataques de DDoS.

## 🛠️ Tecnologias Utilizadas

Este ecossistema foi projetado como um **Monorepo**, dividindo responsabilidades entre dois serviços autônomos para escalabilidade futura de microserviços.

### Frontend
- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) 
- [Framer Motion](https://www.framer.com/motion/) (Animações físicas 60fps)
- [Lucide React](https://lucide.dev) (Ícones SVG Otimizados)

### Backend
- [Node.js](https://nodejs.org/) (Express)
- [Redis](https://redis.io/) (Motor de Cache)
- [Axios](https://axios-http.com/) (Requisições HTTP seguras)
- Express Rate Limit / Helmet / Compression

---

## 🚀 Instalação e Uso

Pré-requisitos mínimos: **Node.js (v20+)** e **Redis Server** (opcional, o sistema possui failover em memória).

### 1. Clonando o Repositório

```bash
git clone https://github.com/muriloatavares/geoip-tracker.git
cd geoip-tracker
```

### 2. Configurando Variáveis de Ambiente

Na pasta `/backend`, crie um arquivo `.env` com a seguinte estrutura:

```env
PORT=3001
NODE_ENV=development
# Opcional (se não preencher, o motor irá rodar pelo MemoryCache)
REDIS_URL=redis://localhost:6379 
```

### 3. Rodando o Ambiente Local (Monorepo)

O projeto possui comandos na raiz para inicializar tudo simultaneamente:

```bash
# 1. Instalar dependências da raiz, do frontend e do backend de uma vez:
npm run install:all

# 2. Subir os dois servidores nativamente juntos:
npm run dev
```

O Frontend estará disponível em `http://localhost:3000` e a interface da API em `http://localhost:3001`.

---

## 📁 Arquitetura Monorepo

```text
geoip-tracker/
├── frontend/               # Aplicação Next.js + Frontend UI
│   ├── app/                # Rotas da Aplicação
│   ├── components/         # Blocos visuais reutilizáveis
│   └── lib/                # Configurações de i18n e utilitários
│
├── backend/                # Motor Node.js de Tráfego de Rede
│   ├── src/api/            # Controladores independentes (Health, IP, Github)
│   ├── src/utils/          # Ferramentas independentes (WHOIS parser, Cache Manager)
│   └── .env                # Segredos do container
│
└── package.json            # Scripts Raiz (Workspace Manager)
```
<<<<<<< Updated upstream
=======

<div align="center">
  <br />
  <p>Desenvolvido com curiosidade e arquitetura limpa por <strong><a href="https://github.com/muriloatavares">Murilo Tavares</a></strong>.</p>
</div>
>>>>>>> Stashed changes
