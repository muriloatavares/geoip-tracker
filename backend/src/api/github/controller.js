const axios = require('axios');

/**
 * Inteligência GitHub OSINT
 * Analisa o perfil de um usuário para extrair estatísticas de Linguagem e Atividade.
 */
async function getGithubProfile(req, res) {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'O nome de usuário é obrigatório' });
  }

  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-OSINT-App',
    };

    // 1. Busca os dados básicos do perfil
    const profileRes = await axios.get(`https://api.github.com/users/${username}`, { headers, timeout: 5000 });
    const profile = profileRes.data;

    // 2. Busca os repositórios para análise de stack tecnológica (limitado a 100)
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers, timeout: 5000 });
    const repos = reposRes.data;

    // 3. Processamento de dados e estatísticas
    // Identifica as linguagens mais usadas nos repositórios públicos
    const languages = repos
      .map((repo) => repo.language)
      .filter((lang) => lang !== null);

    const langCounts = languages.reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});

    const topLanguages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const totalLangs = languages.length;
    const langDistribution = Object.entries(langCounts).reduce((acc, [lang, count]) => {
      acc[lang] = Number(((count / (totalLangs || 1)) * 100).toFixed(2));
      return acc;
    }, {});

    // Identifica os repositórios com maior engajamento (estrelas + forks)
    const topRepos = repos
      .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        description: repo.description,
        url: repo.html_url,
      }));

    // Cálculo de maturidade da conta
    const accountCreated = new Date(profile.created_at);
    const yearsActive = Number(((new Date().getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));

    // Montagem do objeto final de análise
    const analysis = {
      profile: {
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        company: profile.company,
        blog: profile.blog,
        location: profile.location,
        followers: profile.followers,
        following: profile.following,
        public_repos: profile.public_repos,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        twitter: profile.twitter_username,
      },
      stack: {
        top_languages: topLanguages,
        distribution: langDistribution,
      },
      top_repos: topRepos,
      activity: {
        years_active: yearsActive,
        repo_density: Number((profile.public_repos / (yearsActive || 1)).toFixed(2)),
      }
    };

    return res.json(analysis);

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Usuário não encontrado no GitHub' });
    }
    console.error('Erro na API do GitHub:', error.message);
    return res.status(500).json({ error: 'Erro interno ao processar dados do GitHub' });
  }
}

module.exports = { getGithubProfile };
