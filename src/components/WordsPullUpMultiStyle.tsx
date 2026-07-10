import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  containerClassName?: string;
}

export default function WordsPullUpMultiStyle({ segments, className = '', containerClassName = '' }: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const wordsWithClass: { word: string; className: string }[] = [];
  segments.forEach((seg) => {
    const words = seg.text.split(' ');
    words.forEach((word) => {
      wordsWithClass.push({ word, className: seg.className || '' });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${containerClassName}`}>
      {wordsWithClass.map((item, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{
            delay: i * 0.08,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block mr-[0.25em] ${item.className} ${className}`}
        >
          {item.word}
        </motion.span>
      ))}
    </div>
  );
}
