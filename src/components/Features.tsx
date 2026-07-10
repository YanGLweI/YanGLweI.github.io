import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle';

const headerSegments = [
  { text: 'Studio-grade workflows for visionary creators.', className: '' },
  { text: 'Built for pure vision. Powered by art.', className: 'text-gray-500' },
];

interface FeatureCardProps {
  index: number;
  children: React.ReactNode;
}

function FeatureCard({ index, children }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
      {children}
    </motion.div>
  );
}

const iconUrls = [
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
];

const cardData = [
  {
    num: '01',
    title: 'Project Storyboard.',
    items: [
      'Organize shots and scenes visually',
      'Drag-and-drop timeline editor',
      'Export to industry-standard formats',
      'Real-time collaboration with your team',
    ],
  },
  {
    num: '02',
    title: 'Smart Critiques.',
    items: [
      'AI-powered analysis of your edits',
      'Creative notes synced to timestamps',
      'Integrations with major editing tools',
    ],
  },
  {
    num: '03',
    title: 'Immersion Capsule.',
    items: [
      'Silence notifications automatically',
      'Ambient soundscapes for deep focus',
      'Schedule sync across your devices',
    ],
  },
];

export default function Features() {
  return (
    <section className="min-h-screen bg-black relative py-20 md:py-32 px-4 md:px-8">
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal mb-12 md:mb-16 text-center" style={{ color: '#E1E0CC' }}>
          <WordsPullUpMultiStyle segments={headerSegments} />
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          {/* Card 1: Video card */}
          <FeatureCard index={0}>
            <div className="relative w-full h-full min-h-[320px] lg:min-h-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-sm md:text-base font-medium" style={{ color: '#E1E0CC' }}>
                  Your creative canvas.
                </p>
              </div>
            </div>
          </FeatureCard>

          {/* Cards 2-4 */}
          {cardData.map((card, i) => (
            <FeatureCard key={card.num} index={i + 1}>
              <div className="bg-[#212121] w-full h-full min-h-[320px] lg:min-h-0 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  {/* Icon */}
                  <img
                    src={iconUrls[i]}
                    alt=""
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover mb-6"
                  />

                  {/* Title with number */}
                  <h3 className="text-primary text-base sm:text-lg font-medium mb-4">
                    {card.title}{' '}
                    <span className="text-gray-500 text-xs sm:text-sm ml-1">({card.num})</span>
                  </h3>

                  {/* Checklist */}
                  <ul className="space-y-2.5">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400 text-xs sm:text-sm leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learn more */}
                <a
                  href="#"
                  className="flex items-center gap-1.5 text-primary text-xs sm:text-sm mt-6 group"
                >
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg] group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}
