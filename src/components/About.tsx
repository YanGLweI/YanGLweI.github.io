import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle';

const bodyText =
  "Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.";

function AnimatedLetter({ char, index, totalChars, progress }: { char: string; index: number; totalChars: number; progress: any }) {
  const charProgress = index / totalChars;
  const start = charProgress - 0.1;
  const end = charProgress + 0.05;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }}>
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = bodyText.split('');

  const segments = [
    { text: 'I am Marcus Chen,', className: 'font-normal' },
    { text: 'a self-taught director.', className: 'italic font-serif' },
    {
      text: 'I have skills in color grading, visual effects, and narrative design.',
      className: 'font-normal',
    },
  ];

  return (
    <section ref={containerRef} className="bg-black py-20 md:py-32 px-4 md:px-8">
      <div className="bg-[#101010] rounded-2xl md:rounded-3xl max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 text-center">
        {/* Label */}
        <div className="mb-8 md:mb-12">
          <span className="text-primary text-[10px] sm:text-xs uppercase tracking-wider">Visual arts</span>
        </div>

        {/* Heading */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] mb-12 md:mb-16" style={{ color: '#E1E0CC' }}>
          <WordsPullUpMultiStyle segments={segments} />
        </div>

        {/* Body text with scroll-linked opacity */}
        <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#DEDBC8' }}>
          {chars.map((char, i) => (
            <AnimatedLetter
              key={i}
              char={char}
              index={i}
              totalChars={chars.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
