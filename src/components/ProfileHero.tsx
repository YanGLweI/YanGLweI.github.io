import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Calendar, ExternalLink } from 'lucide-react';
import WordsPullUp from './WordsPullUp';
import type { GitHubUser } from '../services/github';

interface ProfileHeroProps {
  user: GitHubUser;
}

const navItems = [
  { label: 'Profile', target: 'profile' },
  { label: 'Repositories', target: 'repositories' },
  { label: 'Contributions', target: 'contributions' },
  { label: 'Activity', target: 'activity' },
  { label: 'Contact', target: 'contact' },
];

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
  e.preventDefault();
  const el = document.getElementById(target);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // 如果找不到目标元素，滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export default function ProfileHero({ user }: ProfileHeroProps) {
  const [isSticky, setIsSticky] = useState(false);
  const joinDate = new Date(user.created_at);
  const joinYear = joinDate.getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('profile');
      if (section) {
        const threshold = section.offsetTop + parseInt(getComputedStyle(section).paddingTop);
        setIsSticky(window.scrollY >= threshold);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="profile" className="h-screen pt-4 px-4 md:pt-6 md:px-6 relative">
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-bg.mp4"
        />

        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        {/* Navbar */}
        <div className={`${isSticky ? 'fixed top-0' : 'absolute top-0'} left-1/2 -translate-x-1/2 z-50`}>
          <nav className="bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={`#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target)}
                className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap transition-colors"
                style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12 z-10">
          <div className="grid grid-cols-12 gap-4 md:gap-8 items-end">
            {/* Left: Name & Info */}
            <div className="col-span-12 md:col-span-8">
              <div className="flex items-end gap-4 md:gap-6">
                {/* Avatar */}
                <motion.img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-[150px] h-[150px] rounded-full border-2 border-white/20 flex-shrink-0 object-cover"
                />
                <WordsPullUp
                  text={`${(user.name || user.login).charAt(0).toUpperCase() + (user.name || user.login).slice(1)}*`}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                  style={{ color: '#E1E0CC' }}
                  showAsterisk
                  delay={0.2}
                />
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-4 flex flex-wrap gap-3 md:gap-6"
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Users className="w-4 h-4" />
                  <span><strong className="text-primary">{user.followers}</strong> followers</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <UserPlus className="w-4 h-4" />
                  <span><strong className="text-primary">{user.following}</strong> following</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <ExternalLink className="w-4 h-4" />
                  <span><strong className="text-primary">{user.public_repos}</strong> repos</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {joinYear}</span>
                </div>
              </motion.div>

              {user.bio && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="mt-3 text-sm md:text-base text-gray-300/80 max-w-lg"
                >
                  {user.bio}
                </motion.p>
              )}
            </div>

            {/* Right: CTA */}
            <div className="col-span-12 md:col-span-4 flex flex-col items-center md:items-end justify-end">
              <motion.a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: '#E1E0CC',
                  color: '#000',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
