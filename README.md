# 🛰️ GeoIP Tracker

Este projeto  uma ferramenta premium de Geolocalizao IP, organizada em uma estrutura monorepo separando Frontend e Backend.

## 📁 Estrutura do Projeto

```
geoip-tracker/
├── frontend/          # Aplicao Next.js 16 (Interface do Usurio)
│   ├── components/    # Componentes React reutilizveis
│   ├── hooks/         # Custom Hooks
│   ├── lib/           # Utilitrios e funes auxiliares
│   ├── public/        # Ativos estticos
│   └── styles/        # Estilos CSS
├── backend/           # Lgica do Servidor (API e servios)
│   ├── src/           # Cdigo fonte do backend
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
├── .gitignore         # Configuraes de ignorar arquivos Git
└── README.md          # Este arquivo
```

## 🚀 Como Iniciar

### Frontend
Para rodar a interface:
```bash
cd frontend
npm install
npm run dev
```

### Backend
Para rodar o servidor:
```bash
cd backend
npm install
npm run dev
```

## ✨ Tecnologias
- **Frontend**: Next.js 16, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js (Estrutura sugerida para expanso).

---
Desenvolvido por **Murilo Tavares**.
