import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react';
import type { GitHubRepo } from '../services/github';

interface ProjectsProps {
  repos: GitHubRepo[];
}

interface ProjectCardProps {
  repo: GitHubRepo;
  index: number;
}

function ProjectCard({ repo, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Language colors mapping
  const getLanguageColor = (language: string): string => {
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
  };

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
      transition={{
        delay: index * 0.15,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="rounded-2xl overflow-hidden"
    >
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#212121] w-full h-full min-h-[320px] p-5 md:p-6 flex flex-col justify-between hover:bg-[#2a2a2a] transition-colors group"
      >
        <div>
          {/* Header with icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
          </div>

          {/* Title */}
          <h3 className="text-primary text-base sm:text-lg font-medium mb-2">
            {repo.name}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
            {repo.description || 'No description available'}
          </p>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span>{repo.stargazers_count} stars</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
              <GitFork className="w-3.5 h-3.5 text-primary" />
              <span>{repo.forks_count} forks</span>
            </div>
            
            {repo.language && (
              <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span>{repo.language}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-[10px] sm:text-xs">
              Updated {formatDate(repo.updated_at)}
            </span>
            <span className="text-primary text-xs sm:text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              View repo
              <ExternalLink className="w-3 h-3 rotate-[-45deg]" />
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default function Projects({ repos }: ProjectsProps) {
  return (
    <section className="min-h-screen bg-black relative py-20 md:py-32 px-4 md:px-8">
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-primary text-[10px] sm:text-xs uppercase tracking-wider block mb-4">
            Featured Work
          </span>
          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-2"
            style={{ color: '#E1E0CC' }}
          >
            Top Repositories
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Built for pure vision. Powered by code.
          </p>
        </motion.div>

        {/* Projects Grid - 使用原来的 4 列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2 md:gap-1">
          {repos.map((repo, index) => (
            <ProjectCard key={repo.id} repo={repo} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href={`https://github.com/${repos[0]?.full_name?.split('/')[0] || 'YanGLweI'}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary text-sm md:text-base hover:gap-3 transition-all group"
          >
            View all repositories
            <ExternalLink className="w-4 h-4 rotate-[-45deg] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
