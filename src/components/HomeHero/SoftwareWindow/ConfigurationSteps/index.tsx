import React, { useState, useRef, useEffect, useCallback } from 'react';
import ConfigCursor from './ConfigCursor';
import ResolutionStep from './ResolutionStep';
import InputTypeStep from './InputTypeStep';
import TaskTypeStep from './TaskTypeStep';
import PreviewPanel from './PreviewPanel';

interface ConfigurationStepsProps {
  isActive: boolean;
  onComplete: () => void;
  isCompact: boolean;
  isSmallScreen: boolean;
}

const STEP_PAUSE = 500;

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ConfigurationSteps({
  isActive,
  onComplete,
  isCompact,
  isSmallScreen,
}: ConfigurationStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [resolutionValue, setResolutionValue] = useState(10);
  const [selectedInputType, setSelectedInputType] = useState<string | null>('image');
  const [selectedTaskType, setSelectedTaskType] = useState<string | null>('classification');

  const [cursorPos, setCursorPos] = useState({ x: 95, y: 90 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorTransition, setCursorTransition] = useState('all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)');

  const [showPreview, setShowPreview] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceRunning = useRef(false);
  const abortRef = useRef(false);
  const sliderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getTargetPos = useCallback((id: string, anchor: 'center' | 'left' = 'center') => {
    if (!containerRef.current) return { x: 50, y: 50, width: 0, contWidth: 1 };
    const el = document.getElementById(id);
    if (!el) return { x: 50, y: 50, width: 0, contWidth: 1 };

    const rect = el.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();

    let targetX = rect.left;
    if (anchor === 'center') targetX += rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    const xPercent = ((targetX - contRect.left) / contRect.width) * 100;
    const yPercent = ((targetY - contRect.top) / contRect.height) * 100;

    return { x: xPercent, y: yPercent, width: rect.width, contWidth: contRect.width };
  }, []);

  const clickButton = useCallback(async (id: string, setter: (val: string) => void, val: string) => {
    if (abortRef.current) return;
    const target = getTargetPos(id);
    setCursorPos(target);

    await delay(500);
    if (abortRef.current) return;

    setIsClicking(true);
    await delay(200);
    setter(val);
    await delay(200);
    setIsClicking(false);
  }, [getTargetPos]);

  useEffect(() => {
    if (!isActive || sequenceRunning.current) return;
    sequenceRunning.current = true;
    abortRef.current = false;

    const sequence = async () => {
      await delay(300);
      if (abortRef.current) return;

      setCurrentStep(1);
      setShowPreview(true);

      await delay(300);
      if (abortRef.current) return;
      setCurrentStep(2);

      await delay(300);
      if (abortRef.current) return;
      setCurrentStep(3);

      await delay(500);
      if (abortRef.current) return;

      setCursorTransition('all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)');
      setCursorVisible(true);
      setCursorPos({ x: 95, y: 90 });

      await delay(100);
      if (abortRef.current) return;

      const sliderInfo = getTargetPos('config-res-slider', 'left');
      const sliderWidthPercent = (sliderInfo.width / sliderInfo.contWidth) * 100;
      const startPosX = sliderInfo.x + (10 / 100) * sliderWidthPercent;
      setCursorPos({ x: startPosX, y: sliderInfo.y });

      await delay(500);
      if (abortRef.current) return;

      setIsClicking(true);
      setCursorTransition('left 0s linear, top 0s linear');
      await delay(50);

      const dragDuration = 800;
      const startValue = 10;
      const targetValue = 100;
      const startTime = Date.now();

      await new Promise<void>((resolve) => {
        sliderIntervalRef.current = setInterval(() => {
          if (abortRef.current) {
            if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
            resolve();
            return;
          }
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / dragDuration, 1);
          const val = Math.round(startValue + (targetValue - startValue) * progress);
          const cursorX = sliderInfo.x + (val / 100) * sliderWidthPercent;

          setResolutionValue(val);
          setCursorPos({ x: cursorX, y: sliderInfo.y });

          if (progress >= 1) {
            if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
            sliderIntervalRef.current = null;
            resolve();
          }
        }, 32);
      });

      if (abortRef.current) return;
      setIsClicking(false);
      setCursorTransition('all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)');

      await delay(STEP_PAUSE);
      if (abortRef.current) return;

      await clickButton('config-input-comparison', (v) => setSelectedInputType(v), 'comparison');
      await delay(STEP_PAUSE);
      if (abortRef.current) return;

      await clickButton('config-input-image', (v) => setSelectedInputType(v), 'image');
      await delay(STEP_PAUSE);
      if (abortRef.current) return;

      await clickButton('config-task-detection', (v) => setSelectedTaskType(v), 'detection');
      setCursorVisible(false);

      await delay(3000);
      if (abortRef.current) return;

      setIsFadingOut(true);
      await delay(500);

      if (!abortRef.current) {
        onComplete();
      }
    };

    sequence();

    return () => {
      abortRef.current = true;
      if (sliderIntervalRef.current) {
        clearInterval(sliderIntervalRef.current);
        sliderIntervalRef.current = null;
      }
    };
  }, [isActive, onComplete, getTargetPos, clickButton]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        gap: 'clamp(8px, 1.5vw, 16px)',
        padding: 'clamp(8px, 1.5vw, 16px)',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      <ConfigCursor
        pos={cursorPos}
        visible={cursorVisible}
        isClicking={isClicking}
        transition={cursorTransition}
      />

      <div
        style={{
          flex: isSmallScreen ? '0 0 auto' : '0 0 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          gap: 'clamp(8px, 1.5vw, 16px)',
        }}
      >
        <ResolutionStep isVisible={currentStep >= 1} value={resolutionValue} />
        <InputTypeStep isVisible={currentStep >= 2} selected={selectedInputType} />
        <TaskTypeStep isVisible={currentStep >= 3} selected={selectedTaskType} />
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
        }}
      >
        <PreviewPanel
          resolution={resolutionValue}
          inputType={selectedInputType}
          taskType={selectedTaskType}
          isActive={showPreview}
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
