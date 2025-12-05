import React from 'react';
import { ProcessingOptions } from '../types';

interface ProcessingControlsProps {
  options: ProcessingOptions;
  onChange: (options: ProcessingOptions) => void;
  disabled?: boolean;
}

export const ProcessingControls: React.FC<ProcessingControlsProps> = ({ options, onChange, disabled }) => {
  const handleAggressivenessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...options,
      aggressiveness: parseInt(e.target.value, 10),
    });
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-white">Removal Settings</h3>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <label htmlFor="aggressiveness" className="text-sm font-medium text-slate-300">
            AI Aggressiveness
          </label>
          <span className="text-sm text-primary-400 font-mono">{options.aggressiveness}%</span>
        </div>
        <input
          type="range"
          id="aggressiveness"
          min="0"
          max="100"
          step="10"
          value={options.aggressiveness}
          onChange={handleAggressivenessChange}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Gentle</span>
          <span>Balanced</span>
          <span>Aggressive</span>
        </div>
      </div>

      <div className="text-xs text-slate-500 italic mt-2">
        * Higher values may alter the background more significantly to ensure watermark removal.
      </div>
    </div>
  );
};