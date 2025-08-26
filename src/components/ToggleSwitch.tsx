'use client';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  enabledLabel?: string;
  disabledLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ToggleSwitch({
  enabled,
  onToggle,
  disabled = false,
  enabledLabel = 'Public',
  disabledLabel = 'Private',
  size = 'md'
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: {
      container: 'h-6 w-12',
      switch: 'h-4 w-4',
      translate: enabled ? 'translate-x-6' : 'translate-x-1',
      text: 'text-xs'
    },
    md: {
      container: 'h-7 w-14',
      switch: 'h-5 w-5',
      translate: enabled ? 'translate-x-7' : 'translate-x-1',
      text: 'text-sm'
    },
    lg: {
      container: 'h-8 w-16',
      switch: 'h-6 w-6',
      translate: enabled ? 'translate-x-8' : 'translate-x-1',
      text: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      <span className={`${classes.text} text-gray-400 ${!enabled ? 'text-white font-medium' : ''}`}>
        {disabledLabel}
      </span>
      
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative inline-flex ${classes.container} items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
          ${enabled 
            ? 'bg-blue-600 hover:bg-blue-500' 
            : 'bg-gray-600 hover:bg-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-pressed={enabled}
        aria-label={`Toggle visibility: currently ${enabled ? enabledLabel.toLowerCase() : disabledLabel.toLowerCase()}`}
      >
        <span
          className={`
            ${classes.switch} inline-block transform rounded-full bg-white transition duration-200 ease-in-out shadow-lg
            ${classes.translate}
          `}
        />
      </button>
      
      <span className={`${classes.text} text-gray-400 ${enabled ? 'text-white font-medium' : ''}`}>
        {enabledLabel}
      </span>
    </div>
  );
}