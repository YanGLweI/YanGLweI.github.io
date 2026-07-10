import { motion } from 'framer-motion';
import type { ContributionDay } from '../services/github';

interface ContributionGraphProps {
  contributions: ContributionDay[];
}

export default function ContributionGraph({ contributions }: ContributionGraphProps) {
  // Group contributions by week
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  // Get month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthLabels: string[] = [];
  let lastMonth = -1;
  
  weeks.forEach((week) => {
    if (week.length > 0) {
      const date = new Date(week[0].date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push(months[month]);
        lastMonth = month;
      } else {
        monthLabels.push('');
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

  const totalContributions = contributions.reduce((sum, day) => sum + day.contributionCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0d1117] rounded-lg p-4 md:p-6 border border-gray-800"
    >
      <div className="mb-4">
        <h3 className="text-primary text-sm md:text-base font-medium mb-1">
          {totalContributions.toLocaleString()} contributions in the last year
        </h3>
      </div>

      {/* Month labels */}
      <div className="flex mb-2 ml-[30px]">
        {monthLabels.map((month, i) => (
          <div key={i} className="flex-1 text-[10px] text-gray-500 min-w-[12px]">
            {month}
          </div>
        ))}
      </div>

      {/* Contribution grid */}
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {['Mon', 'Wed', 'Fri'].map((day) => (
            <div key={day} className="h-[12px] text-[10px] text-gray-500 leading-[12px]">
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="flex gap-[3px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => {
                const level = getLevel(day.contributionCount);
                const color = getColor(level);
                
                return (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: (weekIndex * 7 + dayIndex) * 0.001,
                      duration: 0.1,
                    }}
                    className="w-[12px] h-[12px] rounded-sm cursor-pointer hover:ring-1 hover:ring-white/50"
                    style={{ backgroundColor: color }}
                    title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-gray-500">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="w-[12px] h-[12px] rounded-sm"
            style={{ backgroundColor: getColor(level) }}
          />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}
