import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import type { GitHubRepo } from '../services/github';

interface ProjectCardProps {
  repo: GitHubRepo;
  index: number;
}

export default function ProjectCard({ repo, index }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="block bg-[#0d1117] rounded-lg p-5 border border-gray-800 hover:border-gray-600 transition-colors group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-sm font-medium">
              {repo.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="text-primary font-medium text-base group-hover:text-primary/80 transition-colors">
            {repo.name}
          </h3>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
        {repo.description || 'No description available'}
      </p>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: getLanguageColor(repo.language),
              }}
            />
            <span>{repo.language}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          <span>{repo.stargazers_count}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5" />
          <span>{repo.forks_count}</span>
        </div>
        
        <span className="ml-auto">Updated {formatDate(repo.updated_at)}</span>
      </div>
    </motion.a>
  );
}

// Language colors mapping
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
  };
  return colors[language] || '#8b949e';
}
