import React from 'react';
import { ExamStats } from './ExamStats';
import { ExamSettings } from './ExamSettings';

interface ExamOverviewSidebarProps {
  totalQuestions: number;
  totalPoints: number;
  timeLimit: number;
  sectionsCount: number;
  settings: { shuffleQuestions: boolean; showResults: boolean; allowRetakes: boolean; };
  onSettingChange: (setting: string, value: boolean) => void;
}

export const ExamOverviewSidebar: React.FC<ExamOverviewSidebarProps> = ({
  totalQuestions,
  totalPoints,
  timeLimit,
  sectionsCount,
  settings,
  onSettingChange
}) => {
  return (
    <div className="sticky top-8 space-y-6">
      <ExamStats
        stats={{
          totalQuestions,
          totalPoints,
          timeLimit,
          sectionsCount
        }}
      />

      <ExamSettings
        settings={settings}
        onSettingChange={onSettingChange}
      />
    </div>
  );
}; 