import React, { useEffect, useState } from "react";
import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from "@docusaurus/theme-common";

function useTheme() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return {
    isDark,
    accent: isDark ? "#00FFD1" : "#00A88A",
    accentSoft: isDark ? "rgba(0, 255, 209, 0.10)" : "rgba(0, 168, 138, 0.10)",
    accentBorder: isDark ? "rgba(0, 255, 209, 0.35)" : "rgba(0, 168, 138, 0.35)",
    accentGlow: isDark ? "0 20px 60px rgba(0, 255, 209, 0.14)" : "0 20px 60px rgba(0, 168, 138, 0.14)",
    cardBg: isDark ? "rgba(22, 22, 22, 0.85)" : "rgba(255, 255, 255, 0.95)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    cardShadow: isDark ? "0 18px 40px rgba(0, 0, 0, 0.28)" : "0 18px 40px rgba(15, 23, 42, 0.06)",
    innerBg: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.025)",
    innerBorder: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
    title: isDark ? "#F8FAFC" : "#111827",
    body: isDark ? "#E2E8F0" : "#1F2937",
    muted: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
    subtle: isDark ? "rgba(255, 255, 255, 0.38)" : "rgba(0, 0, 0, 0.42)",
    circleIdleBg: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    circleActiveText: isDark ? "#0A0A0A" : "#FFFFFF",
    videoBg: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.03)",
  };
}

function SectionCard({
  title,
  eyebrow,
  highlight = false,
  children,
}: {
  title: React.ReactNode;
  eyebrow: React.ReactNode;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  const t = useTheme();

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden transition-all duration-300"
      style={{
        background: t.cardBg,
        border: `1px solid ${highlight ? t.accentBorder : t.cardBorder}`,
        borderRadius: 24,
        boxShadow: highlight ? t.accentGlow : t.cardShadow,
      }}
    >
      {highlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${t.accent} 40%, ${t.accent} 60%, transparent 100%)`,
            opacity: 0.9,
          }}
        />
      )}
      <div className="flex h-full flex-col p-6 md:p-8 lg:p-10">
        <div
          className="mb-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
          style={{ color: highlight ? t.accent : t.subtle }}
        >
          {eyebrow}
        </div>
        <h3
          className="mb-7 md:mb-9 text-center text-[1.35rem] md:text-[1.55rem] lg:text-[1.7rem] font-semibold leading-tight"
          style={{ color: t.title, letterSpacing: "-0.015em" }}
        >
          {title}
        </h3>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function StepPill({
  index,
  children,
  active = false,
  completed = false,
  pulse = false,
}: {
  index: number;
  children: React.ReactNode;
  active?: boolean;
  completed?: boolean;
  pulse?: boolean;
}) {
  const t = useTheme();
  const highlighted = active || completed;

  return (
    <div
      className="flex items-center gap-3 md:gap-4 px-4 py-3 md:px-5 md:py-3.5"
      style={{
        background: highlighted ? t.accentSoft : t.innerBg,
        border: `1px solid ${highlighted ? t.accentBorder : t.innerBorder}`,
        borderRadius: 14,
        transition: "background 300ms ease, border-color 300ms ease, transform 300ms ease",
        transform: active ? "translateX(3px)" : "translateX(0)",
      }}
    >
      <div
        className="relative flex flex-shrink-0 items-center justify-center text-xs font-semibold"
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background: highlighted ? t.accent : t.circleIdleBg,
          color: highlighted ? t.circleActiveText : t.muted,
          transition: "background 300ms ease, color 300ms ease",
        }}
      >
        {pulse && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background: t.accent,
              animation: "hcs-pulse 2.4s ease-in-out infinite",
            }}
          />
        )}
        <span className="relative z-10 flex items-center justify-center">
          {completed ? (
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            index
          )}
        </span>
      </div>
      <div
        className="text-sm md:text-[0.95rem] font-medium leading-snug"
        style={{ color: t.body }}
      >
        {children}
      </div>
    </div>
  );
}

function Connector({ active = false }: { active?: boolean }) {
  const t = useTheme();
  return (
    <div className="flex items-center justify-center py-1">
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true">
        <path
          d="M7 2V13M7 13L2 9M7 13L12 9"
          stroke={active ? t.accent : t.muted}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 300ms ease, opacity 300ms ease" }}
          opacity={active ? 1 : 0.55}
        />
      </svg>
    </div>
  );
}

function LoopBack({ active = false }: { active?: boolean }) {
  const t = useTheme();
  const stroke = t.accent;

  return (
    <div
      className="pointer-events-none absolute inset-y-2 right-0 w-[28px] md:w-[36px]"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 36 280"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M4 254 C 20 254 30 244 30 224 V 56 C 30 36 20 26 4 26"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          fill="none"
          pathLength={1}
          strokeDasharray="1.05 1.05"
          strokeDashoffset={active ? 0 : 1.05}
          style={{
            opacity: active ? 1 : 0,
            transition: active
              ? "stroke-dashoffset 750ms cubic-bezier(0.4, 0, 0.2, 1), opacity 140ms ease-out"
              : "opacity 180ms ease-in",
          }}
        />
      </svg>
      <svg
        width="11"
        height="14"
        viewBox="0 0 11 14"
        fill="none"
        className="absolute"
        style={{
          top: "calc(9.29% - 7px)",
          left: "calc(11.11% - 2.5px)",
        }}
      >
        <path
          d="M9 1.5 L 2.5 7 L 9 12.5"
          stroke={stroke}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateX(0)" : "translateX(4px)",
            transition: active
              ? "opacity 220ms ease-out 580ms, transform 260ms ease-out 580ms"
              : "opacity 180ms ease-in, transform 180ms ease-in",
          }}
        />
      </svg>
    </div>
  );
}

function TodayFlow() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % 3);
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[24rem] pr-8 md:pr-10">
      <div className="flex flex-col gap-2">
        <StepPill index={1} active={step === 0}>
          <Translate id="homepage.comparison.today.step1">Select Generic Model</Translate>
        </StepPill>
        <Connector active={step === 1} />
        <StepPill index={2} active={step === 1}>
          <Translate id="homepage.comparison.today.step2">Try Different Optimizations</Translate>
        </StepPill>
        <Connector active={step === 2} />
        <StepPill index={3} active={step === 2}>
          <Translate id="homepage.comparison.today.step3">Deploy and Testing</Translate>
        </StepPill>
      </div>
      <LoopBack active={step === 0} />
    </div>
  );
}

function OneWareFlow() {
  return (
    <div className="mx-auto flex w-full max-w-[24rem] flex-col gap-2">
      <StepPill index={1} active pulse>
        <Translate id="homepage.comparison.oneware.step1">Let ONE AI Build Your Custom AI Model</Translate>
      </StepPill>
      <Connector active />
      <StepPill index={2} completed>
        <Translate id="homepage.comparison.oneware.step2">Working Product</Translate>
      </StepPill>
    </div>
  );
}

function VideoFrame({
  src,
  poster,
  title,
  objectPosition = "center",
}: {
  src: string;
  poster: string;
  title: string;
  objectPosition?: string;
}) {
  const t = useTheme();
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: t.videoBg,
        border: `1px solid ${t.innerBorder}`,
        borderRadius: 16,
      }}
    >
      <video
        className="block aspect-video w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-label={title}
        style={{ objectPosition }}
      >
        <source src={src} type="video/webm" />
      </video>
    </div>
  );
}

function VsBadge() {
  const t = useTheme();

  const label = (
    <span
      className="select-none font-semibold"
      style={{
        fontSize: "0.72rem",
        letterSpacing: "0.28em",
        color: t.subtle,
      }}
    >
      VS
    </span>
  );

  const hLine = (
    <div
      aria-hidden="true"
      className="h-px w-12"
      style={{
        background: `linear-gradient(to right, transparent, ${t.innerBorder} 50%, transparent)`,
      }}
    />
  );

  const vLine = (
    <div
      aria-hidden="true"
      className="h-12 w-px"
      style={{
        background: `linear-gradient(to bottom, transparent, ${t.innerBorder} 50%, transparent)`,
      }}
    />
  );

  return (
    <div className="relative z-10 flex items-center justify-center self-center">
      <div className="flex items-center gap-3 xl:hidden">
        {hLine}
        {label}
        {hLine}
      </div>
      <div className="hidden flex-col items-center gap-3 xl:flex">
        {vLine}
        {label}
        {vLine}
      </div>
    </div>
  );
}

function FlowAndVideo({
  flow,
  video,
  flowFirstOnDesktop = true,
}: {
  flow: React.ReactNode;
  video: React.ReactNode;
  flowFirstOnDesktop?: boolean;
}) {
  return (
    <div className="flex h-full flex-col items-center gap-6 xl:grid xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:gap-8">
      <div className={`flex w-full items-center justify-center order-2 xl:order-none ${flowFirstOnDesktop ? "xl:col-start-1" : "xl:col-start-2"}`}>
        {flow}
      </div>
      <div className={`flex w-full items-center justify-center order-1 xl:order-none ${flowFirstOnDesktop ? "xl:col-start-2" : "xl:col-start-1"}`}>
        {video}
      </div>
    </div>
  );
}

export default function HomeComparisonSection() {
  const yoloVideo = useBaseUrl("/img/demos/compare_fast.webm");
  const yoloPoster = useBaseUrl("/img/demos/screenshot_scratch_comp.png");
  const oneAiVideo = useBaseUrl("/img/demos/scratches_demo_fast.webm");
  const oneAiPoster = useBaseUrl("/img/demos/screenshot_scratch.png");

  return (
    <section className="pt-12 pb-4 md:pt-16 md:pb-6 lg:pt-20 lg:pb-8">
      <style>{`
        @keyframes hcs-pulse {
          0%, 100% { transform: scale(1); opacity: 0; }
          50% { transform: scale(1.9); opacity: 0.35; }
        }
      `}</style>
      <div className="mx-auto w-full max-w-[88rem] px-3 md:px-4 lg:px-6">
        <div className="grid w-full grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-6">
          <SectionCard
            eyebrow="Traditional"
            title={
              <Translate id="homepage.comparison.today.title">AI Development Today</Translate>
            }
          >
            <FlowAndVideo
              flow={<TodayFlow />}
              video={
                <VideoFrame
                  src={yoloVideo}
                  poster={yoloPoster}
                  title="YOLO comparison video"
                />
              }
            />
          </SectionCard>

          <VsBadge />

          <SectionCard
            highlight
            eyebrow="ONE AI"
            title={
              <Translate id="homepage.comparison.oneware.title">
                AI Development with ONE AI
              </Translate>
            }
          >
            <FlowAndVideo
              flow={<OneWareFlow />}
              video={
                <VideoFrame
                  src={oneAiVideo}
                  poster={oneAiPoster}
                  title="ONE AI workflow video"
                  objectPosition="center 62%"
                />
              }
            />
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
