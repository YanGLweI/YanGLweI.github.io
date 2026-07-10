import { motion } from 'framer-motion';
import { Users, UserPlus, Calendar, ExternalLink } from 'lucide-react';
import type { GitHubUser } from '../services/github';

interface ProfileHeroProps {
  user: GitHubUser;
}

export default function ProfileHero({ user }: ProfileHeroProps) {
  const joinDate = new Date(user.created_at);
  const joinYear = joinDate.getFullYear();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-4 flex justify-center"
          >
            <div className="relative">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl shadow-primary/10">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black" />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-8 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2" style={{ color: '#E1E0CC' }}>
              {user.name || user.login}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-4">
              @{user.login}
            </p>

            {user.bio && (
              <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed max-w-xl mx-auto md:mx-0">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span><strong className="text-primary">{user.followers}</strong> followers</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <UserPlus className="w-4 h-4" />
                <span><strong className="text-primary">{user.following}</strong> following</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ExternalLink className="w-4 h-4" />
                <span><strong className="text-primary">{user.public_repos}</strong> repos</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinYear}</span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View on GitHub
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
