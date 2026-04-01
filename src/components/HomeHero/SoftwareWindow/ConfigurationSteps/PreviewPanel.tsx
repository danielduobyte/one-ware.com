import React, { useRef, useEffect, useState, useCallback } from 'react';

interface PreviewPanelProps {
  resolution: number;
  inputType: string | null;
  taskType: string | null;
  isActive: boolean;
}

const SVG_MAP: Record<string, string> = {
  image: '/img/ai/landing/inspection-image.svg',
  comparison: '/img/ai/landing/inspection-comparison.svg',
  depth: '/img/ai/landing/inspection-depth.svg',
  video: '/img/ai/landing/inspection-video.svg',
};

const BOUNDING_BOXES: Record<string, { x: number; y: number; w: number; h: number; label: string; color: string }[]> = {
  image: [
    { x: 8.5, y: 4, w: 13, h: 16, label: 'Apple', color: '#00ffd1' },
    { x: 59.75, y: 3.5, w: 10.5, h: 13, label: 'Apple', color: '#00ffd1' },
    { x: 38, y: 31.7, w: 13.75, h: 16.7, label: 'Bruised', color: '#ff6b6b' },
    { x: 10.75, y: 46.7, w: 8.5, h: 10.7, label: 'Apple', color: '#00ffd1' },
    { x: 74, y: 42, w: 8, h: 10, label: 'Apple', color: '#00ffd1' },
    { x: 30, y: 68.8, w: 10, h: 12.3, label: 'Apple', color: '#00ffd1' },
    { x: 62, y: 68.8, w: 10, h: 12.3, label: 'Apple', color: '#00ffd1' },
  ],
  depth: [
    { x: 9, y: 18.3, w: 9.5, h: 11.7, label: 'Apple', color: '#00ffd1' },
    { x: 23.5, y: 16.7, w: 8, h: 10, label: 'Apple', color: '#00ffd1' },
    { x: 32, y: 21.5, w: 7, h: 8.7, label: 'Apple', color: '#6b94ff' },
    { x: 56.9, y: 41.3, w: 11.25, h: 14, label: 'Apple', color: '#00ffd1' },
    { x: 71.75, y: 40.3, w: 9, h: 11, label: 'Apple', color: '#00ffd1' },
    { x: 83.75, y: 44.5, w: 7.5, h: 9.3, label: 'Apple', color: '#6b94ff' },
    { x: 17.25, y: 66.7, w: 10.5, h: 13.3, label: 'Apple', color: '#ff6b6b' },
    { x: 64.4, y: 73, w: 8.75, h: 10.7, label: 'Apple', color: '#ff6b6b' },
  ],
  video: [
    { x: 5.25, y: 32.2, w: 9.5, h: 11.7, label: 'Apple', color: '#00ffd1' },
    { x: 27.75, y: 27.5, w: 10.5, h: 13, label: 'Apple', color: '#00ffd1' },
    { x: 55, y: 30.8, w: 10, h: 12.3, label: 'Defect', color: '#ff6b6b' },
    { x: 78.5, y: 29.5, w: 9, h: 11, label: 'Apple', color: '#00ffd1' },
    { x: 17.5, y: 54.5, w: 9, h: 11, label: 'Apple', color: '#00ffd1' },
    { x: 48, y: 52.8, w: 10, h: 12.3, label: 'Apple', color: '#00ffd1' },
  ],
};

const SEGMENTATION_GROUPS: Record<string, { d: string; color: string; stroke: string; label: string }[]> = {
  image: [
    { d: 'M8.5,12 A6.5,8 0 1,0 21.5,12 A6.5,8 0 1,0 8.5,12 Z M59.75,10 A5.25,6.5 0 1,0 70.25,10 A5.25,6.5 0 1,0 59.75,10 Z M10.75,52 A4.25,5.33 0 1,0 19.25,52 A4.25,5.33 0 1,0 10.75,52 Z M74,47 A4,5 0 1,0 82,47 A4,5 0 1,0 74,47 Z', color: 'rgba(0,255,209,0.2)', stroke: '#00ffd1', label: 'Good' },
    { d: 'M38.1,40 A6.9,8.33 0 1,0 51.9,40 A6.9,8.33 0 1,0 38.1,40 Z', color: 'rgba(255,107,107,0.2)', stroke: '#ff6b6b', label: 'Bruise' },
    { d: 'M30,75 A5,6.17 0 1,0 40,75 A5,6.17 0 1,0 30,75 Z M62,75 A5,6.17 0 1,0 72,75 A5,6.17 0 1,0 62,75 Z', color: 'rgba(107,148,255,0.2)', stroke: '#6b94ff', label: 'Good' },
  ],
  depth: [
    { d: 'M9,24.2 A4.75,5.83 0 1,0 18.5,24.2 A4.75,5.83 0 1,0 9,24.2 Z M23.5,21.7 A4,5 0 1,0 31.5,21.7 A4,5 0 1,0 23.5,21.7 Z M32.1,25.8 A3.5,4.33 0 1,0 39.1,25.8 A3.5,4.33 0 1,0 32.1,25.8 Z', color: 'rgba(0,255,209,0.2)', stroke: '#00ffd1', label: 'Good' },
    { d: 'M56.9,48.3 A5.63,7 0 1,0 68.1,48.3 A5.63,7 0 1,0 56.9,48.3 Z M71.75,45.8 A4.5,5.5 0 1,0 80.75,45.8 A4.5,5.5 0 1,0 71.75,45.8 Z M83.75,49.2 A3.75,4.67 0 1,0 91.25,49.2 A3.75,4.67 0 1,0 83.75,49.2 Z', color: 'rgba(107,148,255,0.2)', stroke: '#6b94ff', label: 'Good' },
    { d: 'M17.25,73.3 A5.25,6.67 0 1,0 27.75,73.3 A5.25,6.67 0 1,0 17.25,73.3 Z M64.4,78.3 A4.38,5.33 0 1,0 73.1,78.3 A4.38,5.33 0 1,0 64.4,78.3 Z', color: 'rgba(255,107,107,0.2)', stroke: '#ff6b6b', label: 'Rotten' },
  ],
  video: [
    { d: 'M5.25,38 A4.75,5.83 0 1,0 14.75,38 A4.75,5.83 0 1,0 5.25,38 Z M27.75,34 A5.25,6.5 0 1,0 38.25,34 A5.25,6.5 0 1,0 27.75,34 Z M78.5,35 A4.5,5.5 0 1,0 87.5,35 A4.5,5.5 0 1,0 78.5,35 Z M17.5,60 A4.5,5.5 0 1,0 26.5,60 A4.5,5.5 0 1,0 17.5,60 Z M48,59 A5,6.17 0 1,0 58,59 A5,6.17 0 1,0 48,59 Z', color: 'rgba(0,255,209,0.2)', stroke: '#00ffd1', label: 'Good' },
    { d: 'M55,37 A5,6.17 0 1,0 65,37 A5,6.17 0 1,0 55,37 Z', color: 'rgba(255,107,107,0.2)', stroke: '#ff6b6b', label: 'Defect' },
  ],
};

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

export default function PreviewPanel({ resolution, inputType, taskType, isActive }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [renderSize, setRenderSize] = useState({ width: 1, height: 1 });

  useEffect(() => {
    Object.entries(SVG_MAP).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesRef.current[key] = img;
        setLoadedImages(prev => new Set(prev).add(key));
      };
    });
  }, []);

  const drawPixelated = useCallback((img: HTMLImageElement, scale: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const displayW = canvas.width;
    const displayH = canvas.height;
    const imageAspect = img.width / img.height;
    const canvasAspect = displayW / displayH;

    let srcX = 0;
    let srcY = 0;
    let srcW = img.width;
    let srcH = img.height;

    // Match CSS object-fit: cover by cropping the source image instead of stretching it.
    if (imageAspect > canvasAspect) {
      srcW = img.height * canvasAspect;
      srcX = (img.width - srcW) / 2;
    } else {
      srcH = img.width / canvasAspect;
      srcY = (img.height - srcH) / 2;
    }

    if (scale >= 0.95) {
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, displayW, displayH);
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, displayW, displayH);
      return;
    }

    const smallW = Math.max(4, Math.floor(displayW * scale));
    const smallH = Math.max(4, Math.floor(displayH * scale));

    const offscreen = document.createElement('canvas');
    offscreen.width = smallW;
    offscreen.height = smallH;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, smallW, smallH);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, displayW, displayH);
    ctx.drawImage(offscreen, 0, 0, smallW, smallH, 0, 0, displayW, displayH);
  }, []);

  const resolutionScale = Math.max(0.03, resolution / 100);
  const currentKey = inputType || 'image';
  const currentImg = imagesRef.current[currentKey];

  useEffect(() => {
    if (!currentImg) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = Math.floor(rect.width * (window.devicePixelRatio || 1));
      canvas.height = Math.floor(rect.height * (window.devicePixelRatio || 1));
      setRenderSize({ width: rect.width, height: rect.height });
    }

    drawPixelated(currentImg, resolutionScale);
  }, [currentImg, resolutionScale, drawPixelated, loadedImages]);

  useEffect(() => {
    if (!currentImg) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = Math.floor(rect.width * (window.devicePixelRatio || 1));
        canvas.height = Math.floor(rect.height * (window.devicePixelRatio || 1));
        setRenderSize({ width: rect.width, height: rect.height });
      }
      drawPixelated(currentImg, resolutionScale);
    });

    if (canvas.parentElement) observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, [currentImg, resolutionScale, drawPixelated]);

  const isComparison = inputType === 'comparison';
  const isDepth = inputType === 'depth';
  const isVideo = inputType === 'video';

  const boxes = BOUNDING_BOXES[currentKey] || BOUNDING_BOXES.image;
  const segGroups = SEGMENTATION_GROUPS[currentKey] || SEGMENTATION_GROUPS.image;

  const overlayViewBox = (() => {
    if (!currentImg || renderSize.width <= 0 || renderSize.height <= 0) {
      return '0 0 100 100';
    }

    const imageAspect = currentImg.width / currentImg.height;
    const canvasAspect = renderSize.width / renderSize.height;

    if (imageAspect > canvasAspect) {
      const visibleWidth = (canvasAspect / imageAspect) * 100;
      const offsetX = (100 - visibleWidth) / 2;
      return `${offsetX} 0 ${visibleWidth} 100`;
    }

    const visibleHeight = (imageAspect / canvasAspect) * 100;
    const offsetY = (100 - visibleHeight) / 2;
    return `0 ${offsetY} 100 ${visibleHeight}`;
  })();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4px, 1vw, 12px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 'clamp(6px, 1vw, 12px)',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: resolutionScale < 0.95 ? 'pixelated' : 'auto',
          }}
        />


        {isDepth && (
          <div style={{ position: 'absolute', inset: 0, animation: 'fadeIn 0.4s ease-out forwards' }}>
            <div style={{
              position: 'absolute', top: 'clamp(4px, 0.8vw, 10px)', left: 'clamp(4px, 0.8vw, 10px)',
              padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.1)', fontSize: 'clamp(0.35rem, 0.7vw, 0.55rem)',
              color: 'var(--ifm-color-primary)', fontWeight: 600, letterSpacing: '0.05em',
            }}>3D DEPTH</div>
            <div style={{
              position: 'absolute', bottom: 'clamp(6px, 1vw, 12px)', right: 'clamp(6px, 1vw, 12px)',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <span style={{ fontSize: 'clamp(0.25rem, 0.5vw, 0.4rem)', color: 'white', opacity: 0.4 }}>0mm</span>
              <div style={{ width: 'clamp(30px, 6vw, 60px)', height: '5px', borderRadius: '3px',
                background: 'linear-gradient(90deg, rgba(0,80,255,0.8), rgba(0,200,150,0.8), rgba(255,150,0,0.8), rgba(255,80,50,0.8))',
              }} />
              <span style={{ fontSize: 'clamp(0.25rem, 0.5vw, 0.4rem)', color: 'white', opacity: 0.4 }}>8mm</span>
            </div>
          </div>
        )}

        {isVideo && (
          <div
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              animation: 'fadeIn 0.4s ease-out forwards',
            }}
          >
            <div style={{
              width: 'clamp(32px, 6vw, 56px)', height: 'clamp(32px, 6vw, 56px)', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)',
            }}>
              <svg width="40%" height="40%" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21" /></svg>
            </div>
            <div style={{
              position: 'absolute', bottom: 'clamp(6px, 1.5vw, 16px)',
              left: 'clamp(8px, 2vw, 20px)', right: 'clamp(8px, 2vw, 20px)',
              height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px',
            }}>
              <div style={{
                width: '35%', height: '100%', background: 'var(--ifm-color-primary)',
                borderRadius: '2px', boxShadow: '0 0 8px var(--ifm-color-primary)',
              }} />
            </div>
          </div>
        )}

        {taskType && <TaskOverlay taskType={taskType} boxes={boxes} segGroups={segGroups} inputType={inputType} viewBox={overlayViewBox} />}

      </div>
    </div>
  );
}

interface TaskOverlayProps {
  taskType: string;
  boxes: typeof BOUNDING_BOXES.image;
  segGroups: typeof SEGMENTATION_GROUPS.image;
  inputType: string | null;
  viewBox: string;
}

function TaskOverlay({ taskType, boxes, segGroups, inputType, viewBox }: TaskOverlayProps) {
  if (taskType === 'classification') {
    return null;
  }

  if (taskType === 'detection') {
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox={viewBox} preserveAspectRatio="none">
        {boxes.map((box, i) => (
          <g key={i}>
            <rect x={box.x} y={box.y} width={box.w} height={box.h}
              fill="none" stroke={box.color} strokeWidth="0.8" strokeDasharray="3 1.5"
              style={{ opacity: 0, animation: `fadeIn 0.3s ease-out ${i * 100}ms forwards` }} />
          </g>
        ))}
      </svg>
    );
  }

  if (taskType === 'segmentation') {
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox={viewBox} preserveAspectRatio="none">
        {segGroups.map((group, i) => (
          <g key={i} style={{ opacity: 0, animation: `fadeIn 0.4s ease-out ${i * 150}ms forwards` }}>
            <path d={group.d}
              fill={group.color} stroke="none" fillRule="nonzero" />
            <path d={group.d}
              fill="none" stroke={group.stroke} strokeWidth="0.6" strokeLinejoin="round" fillRule="nonzero" />
          </g>
        ))}
      </svg>
    );
  }

  return null;
}
