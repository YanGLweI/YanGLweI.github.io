import { useState, useEffect } from 'react';
import ProfileHero from './components/ProfileHero';
import Contributions from './components/Contributions';
import Projects from './components/Projects';
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
        // Fetch user and repos first (these work without token)
        const [userData, reposData] = await Promise.all([
          getUserProfile(),
          getUserRepos(),
        ]);
        setUser(userData);
        setRepos(reposData);

        // Try to fetch contributions (requires token)
        try {
          const contributionsData = await getContributions();
          setContributions(contributionsData);
        } catch (contribErr) {
          console.warn('Could not fetch contributions (token may be required):', contribErr);
          setContributions([]); // Set empty array if contributions fail
        }

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
      <div className="min-h-screen bg-black relative">
        <div className="loader-wrapper">
          <div className="loader" />
        </div>
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
      {/* Hero Section - 个人资料 */}
      <ProfileHero user={user} />

      {/* Contributions Section - 贡献图 */}
      <div className="py-4 md:py-6">
        <Contributions contributions={contributions} />
      </div>

      {/* Projects Section - 项目展示 */}
      <Projects repos={repos} />

      {/* Footer */}
      <footer className="px-4 md:px-8 py-12 border-t border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>Built with React + Vite + Tailwind CSS</p>
          <p className="mt-2">© {new Date().getFullYear()} {user.name || user.login}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
