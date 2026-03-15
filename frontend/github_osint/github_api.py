import requests
import time
import logging
from typing import Optional, Dict, Any, List

class GitHubAPI:
    BASE_URL = "https://api.github.com"
    
    def __init__(self, token: Optional[str] = None):
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "GitHub-OSINT-Tool/1.0"
        })
        if token:
            self.session.headers.update({"Authorization": f"token {token}"})
        
        self.logger = logging.getLogger(__name__)

    def _request(self, endpoint: str, params: Optional[Dict] = None) -> Optional[Dict]:
        url = f"{self.BASE_URL}{endpoint}"
        retries = 3
        backoff = 2
        
        for i in range(retries):
            try:
                response = self.session.get(url, params=params, timeout=10)
                
                if response.status_code == 200:
                    return response.json()
                
                if response.status_code == 403:
                    reset_time = int(response.headers.get("X-RateLimit-Reset", time.time() + 60))
                    sleep_duration = max(reset_time - time.time(), 0) + 1
                    self.logger.warning(f"Rate limited. Sleeping for {sleep_duration:.2f}s")
                    time.sleep(min(sleep_duration, 60)) # Cap sleep at 60s for sanity
                    continue
                
                if response.status_code == 404:
                    self.logger.error(f"Resource not found: {url}")
                    return None
                
                response.raise_for_status()
                
            except requests.exceptions.RequestException as e:
                self.logger.error(f"Request error (attempt {i+1}/{retries}): {e}")
                if i < retries - 1:
                    time.sleep(backoff ** i)
                else:
                    return None
        return None

    def get_user_profile(self, username: str) -> Optional[Dict[str, Any]]:
        self.logger.info(f"Fetching profile for: {username}")
        return self._request(f"/users/{username}")

    def get_user_repos(self, username: str) -> List[Dict[str, Any]]:
        self.logger.info(f"Fetching repositories for: {username}")
        repos = []
        page = 1
        while True:
            data = self._request(f"/users/{username}/repos", params={"per_page": 100, "page": page})
            if not data:
                break
            repos.extend(data)
            if len(data) < 100:
                break
            page += 1
        return repos
