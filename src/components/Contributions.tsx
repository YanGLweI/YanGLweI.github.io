import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ContributionDay } from '../services/github';

interface ContributionsProps {
  contributions: ContributionDay[];
}

const MIN_CELL_STEP = 15;
const LABEL_WIDTH = 26; // day-of-week label column width (including margin)

export default function Contributions({ contributions }: ContributionsProps) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    count: number;
    date: string;
  }>({ visible: false, x: 0, y: 0, count: 0, date: '' });

  const gridRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [cellStep, setCellStep] = useState(MIN_CELL_STEP);

  // Group contributions by week
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  // Dynamically compute cell size based on card width
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const compute = () => {
      const style = getComputedStyle(card);
      const px = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const contentWidth = card.clientWidth - px;
      const available = contentWidth - LABEL_WIDTH;
      const step = Math.max(MIN_CELL_STEP, Math.floor(available / weeks.length));
      setCellStep(step);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(card);
    return () => ro.disconnect();
  }, [weeks.length]);

  const cellSize = cellStep - 3;
  const cellGap = cellStep - cellSize;

  // Build month labels aligned to week columns
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  interface MonthLabel {
    name: string;
    width: number; // Width in pixels (number of weeks * CELL_STEP)
  }
  const monthLabels: MonthLabel[] = [];
  let lastMonth = -1;
  let currentMonthWeeks = 0;

  weeks.forEach((week, index) => {
    if (week.length > 0) {
      const date = new Date(week[0].date);
      const month = date.getMonth();
      
      if (month !== lastMonth) {
        // Push previous month if exists
        if (lastMonth !== -1) {
          monthLabels.push({
            name: monthNames[lastMonth],
            width: currentMonthWeeks * cellStep,
          });
        }
        // Start new month
        lastMonth = month;
        currentMonthWeeks = 1;
      } else {
        currentMonthWeeks++;
      }
      
      // Handle last month
      if (index === weeks.length - 1) {
        monthLabels.push({
          name: monthNames[lastMonth],
          width: currentMonthWeeks * cellStep,
        });
      }
    }
  });

  // Calculate contribution level (0-4)
  const getLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 8) return 3;
    return 4;
  };

  // Color mapping based on GitHub's contribution colors
  const getColor = (level: number): string => {
    const colors = [
      '#161b22', // Level 0 - dark
      '#0e4429', // Level 1
      '#006d32', // Level 2
      '#26a641', // Level 3
      '#39d353', // Level 4 - bright green
    ];
    return colors[level];
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = d.getDate();
    const month = monthShort[d.getMonth()];
    const year = d.getFullYear();
    // GitHub format: "3 contributions on Jul 10, 2026"
    return `${month} ${day}, ${year}`;
  };

  const handleMouseEnter = useCallback((e: React.MouseEvent, day: ContributionDay) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect) return;

    setTooltip({
      visible: true,
      x: rect.left - gridRect.left + rect.width / 2,
      y: rect.top - gridRect.top,
      count: day.contributionCount,
      date: formatDate(day.date),
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  // Adjust tooltip position to stay within bounds
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (tooltip.visible && tooltipRef.current && gridRef.current) {
      const tt = tooltipRef.current.getBoundingClientRect();
      const grid = gridRef.current.getBoundingClientRect();
      let left = tooltip.x - tt.width / 2;
      // Clamp within grid bounds
      if (left < 0) left = 0;
      if (left + tt.width > grid.width) left = grid.width - tt.width;
      setTooltipStyle({
        left: `${left}px`,
        top: `${tooltip.y - tt.height - 8}px`,
      });
    }
  }, [tooltip]);

  const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0);

  return (
    <section className="bg-black py-20 md:py-32 px-4 md:px-8">
      <div className="bg-[#101010] rounded-2xl md:rounded-3xl max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-primary text-[10px] sm:text-xs uppercase tracking-wider block mb-4">
            Activity Overview
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] sm:leading-[0.9]"
            style={{ color: '#E1E0CC' }}
          >
            {totalContributions.toLocaleString()} contributions
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-4">
            in the last year
          </p>
        </motion.div>

        {/* Contribution Graph Card */}
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-[#0d1117] rounded-xl p-4 md:p-6 border border-gray-800"
        >
          <div ref={gridRef} className="relative">
              {/* Month labels */}
              <div className="flex mb-2" style={{ paddingLeft: LABEL_WIDTH }}>
                {monthLabels.map((month, i) => (
                  <div
                    key={i}
                    className="text-[10px] text-gray-500"
                    style={{ width: month.width, flexShrink: 0 }}
                  >
                    {month.name}
                  </div>
                ))}
              </div>

              {/* Contribution grid */}
              <div className="flex" style={{ gap: cellGap }}>
                {/* Day labels */}
                <div className="flex flex-col flex-shrink-0" style={{ gap: cellGap, marginRight: 4, width: LABEL_WIDTH }}>
                  {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                    <div key={i} className="text-[10px] text-gray-500 leading-none text-right pr-1" style={{ height: cellSize }}>
                      {day}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                <div className="flex" style={{ gap: cellGap }}>
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col" style={{ gap: cellGap }}>
                      {week.map((day, dayIndex) => {
                        const level = getLevel(day.contributionCount);
                        const color = getColor(level);

                        return (
                          <motion.div
                            key={`${weekIndex}-${dayIndex}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: Math.min((weekIndex * 7 + dayIndex) * 0.0005, 1),
                              duration: 0.1,
                            }}
                            className="rounded-sm cursor-pointer hover:ring-1 hover:ring-white/50 transition-all"
                            style={{ width: cellSize, height: cellSize, backgroundColor: color }}
                            onMouseEnter={(e) => handleMouseEnter(e, day)}
                            onMouseLeave={handleMouseLeave}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub-style Tooltip */}
              {tooltip.visible && (
                <div
                  ref={tooltipRef}
                  className="absolute z-50 pointer-events-none"
                  style={tooltipStyle}
                >
                  <div className="bg-[#1b1f23] text-white text-[11px] px-3 py-2 rounded-md whitespace-nowrap border border-[#30363d] shadow-lg">
                    <strong className="font-semibold">
                      {tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}
                    </strong>
                    {' on '}
                    {tooltip.date}
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center -mt-[1px]">
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#1b1f23]" />
                  </div>
                </div>
              )}
            </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-4 text-[10px] text-gray-500">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="rounded-sm"
                style={{ width: cellSize, height: cellSize, backgroundColor: getColor(level) }}
              />
            ))}
            <span>More</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
