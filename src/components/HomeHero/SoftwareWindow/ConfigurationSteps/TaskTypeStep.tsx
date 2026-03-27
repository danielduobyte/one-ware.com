import React from 'react';

interface TaskTypeStepProps {
  isVisible: boolean;
  selected: string | null;
}

const TASK_TYPES = [
  {
    id: 'classification',
    label: 'Classification',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    id: 'detection',
    label: 'Detection',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    id: 'segmentation',
    label: 'Segmentation',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12c0-2 1-4 3-5.5S10 4 12 4s4 .5 6 2.5S21 10 21 12" />
        <path d="M21 12c0 2-1 4-3 5.5S14 20 12 20s-4-.5-6-2.5S3 14 3 12" />
        <path d="M12 4l-1 3-2 1-3-1" />
        <path d="M18 6.5l-2 2-1 3" />
        <path d="M15 17l-1-2 1-3" />
        <path d="M6 17.5l2-2 3-1" />
      </svg>
    ),
  },
];

export default function TaskTypeStep({ isVisible, selected }: TaskTypeStepProps) {
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
        TASK TYPE
      </div>
      <div className="flex p-[2px] bg-black/20 rounded-lg border border-white/5 w-full">
        {TASK_TYPES.map(({ id, label, icon }) => (
          <div
            key={id}
            id={`config-task-${id}`}
            className={`
              flex-1 flex items-center justify-center gap-1 py-1 sm:py-1.5 rounded-[6px] transition-all duration-300 ease-out relative overflow-hidden
              cursor-default pointer-events-none
              ${selected === id
                ? 'text-[var(--ifm-color-primary)] font-bold bg-white/5 border border-[var(--ifm-color-primary)]/20 shadow-[inset_0_0_15px_rgba(0,255,209,0.05)]'
                : 'text-white/30 border border-transparent'}
            `}
          >
            <span className="relative z-10 flex-shrink-0 hidden sm:block">{icon}</span>
            <span
              className="relative z-10 tracking-wider"
              style={{ fontSize: 'clamp(0.35rem, 0.9vw, 0.6rem)' }}
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
    </div>
  );
}
