import { useState, useEffect } from 'react';
import ProfileHero from './components/ProfileHero';
import ContributionGraph from './components/ContributionGraph';
import ProjectCard from './components/ProjectCard';
import { getUserProfile, getUserRepos, getContributions } from './services/github';
import type { GitHubUser, GitHubRepo, ContributionDay } from './services/github';

export default function App() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [userData, reposData, contributionsData] = await Promise.all([
          getUserProfile(),
          getUserRepos(),
          getContributions(),
        ]);
        setUser(userData);
        setRepos(reposData);
        setContributions(contributionsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch GitHub data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-primary text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">
            Make sure you have configured VITE_GITHUB_USERNAME in .env file
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="bg-black min-h-screen">
      {/* Hero Section */}
      <ProfileHero user={user} />

      {/* Contributions Section */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#E1E0CC' }}>
            Activity Overview
          </h2>
          <ContributionGraph contributions={contributions} />
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#E1E0CC' }}>
              Featured Projects
            </h2>
            <a
              href={`https://github.com/${user.login}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:text-primary/70 transition-colors"
            >
              View all →
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {repos.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-8 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>Built with React + Vite + Tailwind CSS</p>
          <p className="mt-2">© {new Date().getFullYear()} {user.name || user.login}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
