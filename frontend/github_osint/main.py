import argparse
import os
import sys
import logging
import json
import time
from typing import List, Dict, Any

from github_api import GitHubAPI
from analyzer import GitHubAnalyzer
from report_generator import ReportGenerator

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("github_osint.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("GitHubOSINT")

class GitHubOSINTTool:
    def __init__(self, cache_dir: str = "cache"):
        self.api = GitHubAPI()
        self.analyzer = GitHubAnalyzer()
        self.reporter = ReportGenerator(output_dir="reports")
        self.cache_dir = cache_dir
        if not os.path.exists(cache_dir):
            os.makedirs(cache_dir)

    def _get_cache(self, username: str) -> Optional[Dict[str, Any]]:
        cache_path = os.path.join(self.cache_dir, f"{username}.json")
        if os.path.exists(cache_path):
            # Cache for 24 hours
            if time.time() - os.path.getmtime(cache_path) < 86400:
                with open(cache_path, "r", encoding="utf-8") as f:
                    return json.load(f)
        return None

    def _save_cache(self, username: str, data: Dict[str, Any]):
        cache_path = os.path.join(self.cache_dir, f"{username}.json")
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(data, f)

    def process_user(self, username: str):
        logger.info(f"Processing user: {username}")
        
        cached_data = self._get_cache(username)
        if cached_data:
            logger.info(f"Using cached data for {username}")
            data = cached_data
        else:
            profile = self.api.get_user_profile(username)
            if not profile:
                logger.error(f"Could not find or access profile for {username}")
                return

            repos = self.api.get_user_repos(username)
            
            data = {
                "profile": profile,
                "repos_raw": repos, # Stored in cache, but stripped in reports
                "stack": self.analyzer.analyze_tech_stack(repos),
                "stats": self.analyzer.analyze_repos(repos),
                "activity": self.analyzer.calculate_activity_indicators(profile, repos)
            }
            self._save_cache(username, data)

        # Generate Reports
        txt_path = self.reporter.generate_txt(data, username)
        json_path = self.reporter.generate_json(data, username)
        html_path = self.reporter.generate_html(data, username)
        
        logger.info(f"Reports generated for {username}:")
        logger.info(f" - TXT: {txt_path}")
        logger.info(f" - JSON: {json_path}")
        logger.info(f" - HTML: {html_path}")

def main():
    parser = argparse.ArgumentParser(description="Professional GitHub OSINT Intelligence Tool")
    parser.add_argument("username", nargs="?", help="Target GitHub username")
    parser.add_argument("--batch", help="Path to file containing usernames (one per line)")
    
    args = parser.parse_args()
    
    tool = GitHubOSINTTool()
    
    if args.batch:
        if not os.path.exists(args.batch):
            logger.error(f"Batch file not found: {args.batch}")
            sys.exit(1)
        with open(args.batch, "r") as f:
            users = [line.strip() for line in f if line.strip()]
        for user in users:
            tool.process_user(user)
    elif args.username:
        tool.process_user(args.username)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
