import React from 'react';

interface InputTypeStepProps {
  isVisible: boolean;
  selected: string | null;
}

const INPUT_TYPES = [
  { id: 'image', label: 'Image' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'video', label: 'Video' },
  { id: 'depth', label: 'Depth' },
];

export default function InputTypeStep({ isVisible, selected }: InputTypeStepProps) {
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
        INPUT TYPE
      </div>
      <div className="flex items-center gap-1">
        <div className="flex p-[2px] bg-black/20 rounded-lg border border-white/5 flex-1 min-w-0">
          {INPUT_TYPES.map(({ id, label }) => (
            <div
              key={id}
              id={`config-input-${id}`}
              className={`
                flex-1 flex items-center justify-center py-1 sm:py-1.5 rounded-[6px] transition-all duration-300 ease-out relative overflow-hidden
                cursor-default pointer-events-none
                ${selected === id
                  ? 'text-[var(--ifm-color-primary)] font-bold bg-white/5 border border-[var(--ifm-color-primary)]/20 shadow-[inset_0_0_15px_rgba(0,255,209,0.05)]'
                  : 'text-white/30 border border-transparent'}
              `}
            >
              <span
                className="relative z-10 tracking-wider"
                style={{ fontSize: 'clamp(0.35rem, 0.85vw, 0.55rem)' }}
              >
                {label}
              </span>
              <div
                className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-[var(--ifm-color-primary)] shadow-[0_0_8px_var(--ifm-color-primary)] transition-opacity duration-300"
                style={{ opacity: selected === id ? 1 : 0 }}
              />
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 text-white/20" style={{ fontSize: 'clamp(10px, 1.5vw, 16px)' }}>
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
