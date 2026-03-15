import json
import os
from datetime import datetime
from typing import Dict, Any

class ReportGenerator:
    def __init__(self, output_dir: str = "reports"):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

    def generate_json(self, data: Dict[str, Any], username: str) -> str:
        filepath = os.path.join(self.output_dir, f"report_{username}.json")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        return filepath

    def generate_txt(self, data: Dict[str, Any], username: str) -> str:
        filepath = os.path.join(self.output_dir, f"report_{username}.txt")
        profile = data['profile']
        stats = data['stats']
        stack = data['stack']
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("="*60 + "\n")
            f.write(f" GitHub Intelligence Report: {username}\n")
            f.write(f" Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("="*60 + "\n\n")
            
            f.write("[ Profile Information ]\n")
            f.write(f" Name:     {profile.get('name') or 'N/A'}\n")
            f.write(f" Bio:      {profile.get('bio') or 'N/A'}\n")
            f.write(f" Company:  {profile.get('company') or 'N/A'}\n")
            f.write(f" Location: {profile.get('location') or 'N/A'}\n")
            f.write(f" Blog:     {profile.get('blog') or 'N/A'}\n")
            f.write(f" Twitter:  {profile.get('twitter_username') or 'N/A'}\n\n")
            
            f.write("[ Account Metadata ]\n")
            f.write(f" Followers: {profile.get('followers')}\n")
            f.write(f" Following: {profile.get('following')}\n")
            f.write(f" Public Repos: {profile.get('public_repos')}\n")
            f.write(f" Created:   {profile.get('created_at')}\n")
            f.write(f" Years Active: {data['activity']['years_active']}\n\n")
            
            f.write("[ Technology Stack ]\n")
            for lang, count in stack['top_languages']:
                percentage = stack['language_distribution'].get(lang, 0)
                f.write(f" - {lang}: {count} repos ({percentage}%)\n")
            f.write("\n")
            
            f.write("[ Top Repositories ]\n")
            for repo in stats['top_repositories']:
                f.write(f" - {repo['name']} ({repo['language'] or 'N/A'})\n")
                f.write(f"   Stars: {repo['stars']} | Forks: {repo['forks']}\n")
            
            f.write("\n" + "="*60 + "\n")
            
        return filepath

    def generate_html(self, data: Dict[str, Any], username: str) -> str:
        # Simplified HTML generator
        filepath = os.path.join(self.output_dir, f"report_{username}.html")
        profile = data['profile']
        
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>OSINT Report - {username}</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0d1117; color: #c9d1d9; padding: 40px; }}
                .container {{ max-width: 800px; margin: 0 auto; background: #161b22; padding: 30px; border-radius: 8px; border: 1px solid #30363d; }}
                h1, h2 {{ color: #58a6ff; }}
                .header {{ display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }}
                .avatar {{ width: 100px; height: 100px; border-radius: 50%; border: 2px solid #58a6ff; }}
                .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }}
                .section {{ margin-bottom: 30px; border-bottom: 1px solid #30363d; padding-bottom: 20px; }}
                .repo {{ margin-bottom: 15px; padding: 10px; background: #0d1117; border-radius: 4px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="{profile.get('avatar_url')}" class="avatar">
                    <div>
                        <h1>GitHub Intelligence Report: {username}</h1>
                        <p>{profile.get('name') or ''} • {profile.get('location') or 'Global'}</p>
                    </div>
                </div>
                
                <div class="section grid">
                    <div>
                        <h2>Profile</h2>
                        <p><strong>Bio:</strong> {profile.get('bio') or 'N/A'}</p>
                        <p><strong>Company:</strong> {profile.get('company') or 'N/A'}</p>
                        <p><strong>Blog:</strong> <a href="{profile.get('blog')}" style="color: #58a6ff;">{profile.get('blog') or 'N/A'}</a></p>
                    </div>
                    <div>
                        <h2>Stats</h2>
                        <p><strong>Followers:</strong> {profile.get('followers')}</p>
                        <p><strong>Public Repos:</strong> {profile.get('public_repos')}</p>
                        <p><strong>Years Active:</strong> {data['activity']['years_active']}</p>
                    </div>
                </div>

                <div class="section">
                    <h2>Technology Stack</h2>
                    <ul>
                        {" ".join([f"<li>{lang}: {count} repos</li>" for lang, count in data['stack']['top_languages']])}
                    </ul>
                </div>

                <div class="section">
                    <h2>Top Repositories</h2>
                    {" ".join([f'<div class="repo"><strong>{r["name"]}</strong> ({r["language"] or "N/A"})<br>⭐ {r["stars"]} | 🍴 {r["forks"]}</div>' for r in data["stats"]["top_repositories"]])}
                </div>
            </div>
        </body>
        </html>
        """
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_content)
        return filepath
