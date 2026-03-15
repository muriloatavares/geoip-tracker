from typing import Dict, List, Any
from collections import Counter
from datetime import datetime

class GitHubAnalyzer:
    @staticmethod
    def analyze_tech_stack(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        languages = [repo.get("language") for repo in repos if repo.get("language")]
        lang_counts = Counter(languages)
        total = sum(lang_counts.values())
        
        stack = {
            "top_languages": lang_counts.most_common(5),
            "language_distribution": {lang: round((count / total) * 100, 2) for lang, count in lang_counts.items()} if total > 0 else {},
            "total_languages": len(lang_counts)
        }
        return stack

    @staticmethod
    def analyze_repos(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        sorted_repos = sorted(repos, key=lambda x: (x.get("stargazers_count", 0), x.get("forks_count", 0)), reverse=True)
        
        top_repos = []
        for repo in sorted_repos[:5]:
            top_repos.append({
                "name": repo.get("name"),
                "stars": repo.get("stargazers_count"),
                "forks": repo.get("forks_count"),
                "language": repo.get("language"),
                "updated_at": repo.get("updated_at")
            })
            
        return {
            "top_repositories": top_repos,
            "total_stars": sum(r.get("stargazers_count", 0) for r in repos),
            "total_forks": sum(r.get("forks_count", 0) for r in repos)
        }

    @staticmethod
    def calculate_activity_indicators(profile: Dict[str, Any], repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        created_at = datetime.strptime(profile.get("created_at"), "%Y-%m-%dT%H:%M:%SZ")
        account_age_days = (datetime.utcnow() - created_at).days
        
        return {
            "account_age_days": account_age_days,
            "years_active": round(account_age_days / 365, 1),
            "repo_density": round(len(repos) / (account_age_days / 365), 2) if account_age_days > 0 else 0
        }
