import React from 'react';
import { Settings } from 'lucide-react';

interface ExamSettingsProps {
  settings: {
    shuffleQuestions: boolean;
    showResults: boolean;
    allowRetakes: boolean;
  };
  onSettingChange: (setting: string, value: boolean) => void;
}

export const ExamSettings: React.FC<ExamSettingsProps> = ({
  settings,
  onSettingChange
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Settings className="w-5 h-5 text-white/60" />
        <h3 className="font-syne font-medium text-white">Settings</h3>
      </div>
      <div className="space-y-3">
        <label className="flex items-center justify-between">
          <span className="font-geist-mono text-sm text-white/70">Shuffle Questions</span>
          <input
            type="checkbox"
            checked={settings.shuffleQuestions}
            onChange={(e) => onSettingChange('shuffleQuestions', e.target.checked)}
            className="rounded"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="font-geist-mono text-sm text-white/70">Show Results</span>
          <input
            type="checkbox"
            checked={settings.showResults}
            onChange={(e) => onSettingChange('showResults', e.target.checked)}
            className="rounded"
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="font-geist-mono text-sm text-white/70">Allow Retakes</span>
          <input
            type="checkbox"
            checked={settings.allowRetakes}
            onChange={(e) => onSettingChange('allowRetakes', e.target.checked)}
            className="rounded"
          />
        </label>
      </div>
    </div>
  );
}; 