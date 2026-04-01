import React from 'react';

const RESOLUTION_STOPS = [
  { value: 0, label: '120p' },
  { value: 15, label: '240p' },
  { value: 30, label: '480p' },
  { value: 50, label: '720p' },
  { value: 70, label: '1080p' },
  { value: 85, label: '1440p' },
  { value: 100, label: '4K' },
];

function getResolutionLabel(value: number): string {
  for (let i = RESOLUTION_STOPS.length - 1; i >= 0; i--) {
    if (value >= RESOLUTION_STOPS[i].value) return RESOLUTION_STOPS[i].label;
  }
  return RESOLUTION_STOPS[0].label;
}

interface ResolutionStepProps {
  isVisible: boolean;
  value: number;
}

export default function ResolutionStep({ isVisible, value }: ResolutionStepProps) {
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        pointerEvents: 'none',
      }}
    >
      <div
        className="oneware-section-header"
        style={{ margin: 0, padding: 0, fontSize: 'clamp(0.5rem, 1.2vw, 0.7rem)', marginBottom: 'clamp(4px, 0.8vw, 8px)' }}
      >
        RESOLUTION
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-end gap-1 min-w-[35%]">
          <span
            className="font-light tracking-tight drop-shadow-lg transition-all duration-300 text-[var(--ifm-color-primary)]"
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', lineHeight: 1 }}
          >
            {getResolutionLabel(value)}
          </span>
        </div>
        <div
          id="config-res-slider"
          className="relative h-[16px] flex-1 flex items-center touch-none"
        >
          <div className="absolute left-0 right-0 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--ifm-color-primary)] shadow-[0_0_10px_var(--ifm-color-primary)]"
              style={{ width: `${value}%`, transition: 'width 0s linear' }}
            />
          </div>
          <div
            className="absolute h-[12px] w-[4px] bg-[var(--ifm-color-primary)] rounded-[1px] shadow-[0_0_10px_var(--ifm-color-primary)] z-10 top-1/2 -translate-y-1/2"
            style={{ left: `${value}%`, transform: 'translate(-50%, -50%)', transition: 'left 0s linear' }}
          />
        </div>
      </div>
    </div>
  );
}
