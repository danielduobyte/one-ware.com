import React from 'react';
import { useDelayedUnmount } from '../../hooks/useDelayedUnmount';

interface ConfigCursorProps {
  pos: { x: number; y: number };
  visible: boolean;
  isClicking: boolean;
  transition: string;
}

export default function ConfigCursor({ pos, visible, isClicking, transition }: ConfigCursorProps) {
  const shouldRender = useDelayedUnmount(visible, 300);

  if (!shouldRender) return null;

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        opacity: visible ? 1 : 0,
        transform: `translate(-20%, -20%) scale(${isClicking ? 0.85 : 1})`,
        transition: transition === 'none'
          ? 'transform 0.15s ease-out, opacity 0.3s ease'
          : `${transition}, transform 0.15s ease-out, opacity 0.3s ease`,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
      >
        <path
          d="M5.5 3.5L19 10L11.5 12.5L9 20L5.5 3.5Z"
          fill="var(--ifm-color-primary)"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
