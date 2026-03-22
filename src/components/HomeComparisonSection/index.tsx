import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from "@docusaurus/theme-common";

function AutoFitText({
  children,
  className = "",
  minSize = 10,
  maxSize = 15,
}: {
  children: React.ReactNode;
  className?: string;
  minSize?: number;
  maxSize?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(maxSize);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const fit = () => {
      let nextSize = maxSize;
      content.style.fontSize = `${nextSize}px`;

      while (
        nextSize > minSize &&
        (content.scrollWidth > container.clientWidth || content.scrollHeight > container.clientHeight)
      ) {
        nextSize -= 0.5;
        content.style.fontSize = `${nextSize}px`;
      }

      setFontSize(nextSize);
    };

    fit();

    const observer = new ResizeObserver(() => fit());
    observer.observe(container);

    return () => observer.disconnect();
  }, [children, maxSize, minSize]);

  return (
    <div
      ref={containerRef}
      className={className}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div
          ref={contentRef}
          className="block w-full text-center font-semibold leading-tight whitespace-normal"
          style={{ fontSize: `${fontSize}px` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <div
      className="h-full p-6 md:p-8"
      style={{
        background: isDarkMode ? "#161616" : "#f3f4f6",
        boxShadow: isDarkMode
          ? "0 18px 40px rgba(0,0,0,0.18)"
          : "0 18px 40px rgba(15,23,42,0.06)",
      }}
    >
      <h2
        className="text-2xl md:text-3xl font-semibold mb-6 text-center"
        style={{ color: isDarkMode ? "#F8FAFC" : "#111827" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function VideoPanel({
  src,
  poster,
  title,
  className = "",
  crop = false,
  objectPosition = "center",
}: {
  src: string;
  poster: string;
  title: string;
  className?: string;
  crop?: boolean;
  objectPosition?: string;
}) {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: isDarkMode ? "#1f1f1f" : "#ffffff",
      }}
    >
      <video
        className={`block w-full aspect-video ${crop ? "object-cover" : "object-contain"}`}
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

function StepBlock({
  children,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "default" | "accent";
  className?: string;
}) {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const accent = tone === "accent";

  return (
    <div
      className={`flex items-center justify-center text-center px-2 py-2 ${className}`}
      style={{
        minHeight: "4.25rem",
        background: accent
          ? isDarkMode
            ? "#10322b"
            : "#e6f7f3"
          : isDarkMode
            ? "#1f1f1f"
            : "#ffffff",
      }}
    >
      <AutoFitText
        className="block h-full w-full overflow-hidden"
        minSize={7}
        maxSize={15}
      >
        {children}
      </AutoFitText>
    </div>
  );
}

function ArrowGlyph({
  direction,
  className = "",
  tone = "accent",
}: {
  direction: "right" | "down";
  className?: string;
  tone?: "default" | "accent";
}) {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const stroke =
    tone === "accent"
      ? isDarkMode
        ? "#00FFD1"
        : "#00A88A"
      : isDarkMode
        ? "#5b5b5b"
        : "#9ca3af";

  if (direction === "right") {
    return (
      <svg className={className} viewBox="0 0 72 28" fill="none" aria-hidden="true">
        <path
          d="M6 14H54M54 14L36 2M54 14L36 26"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 28 52" fill="none" aria-hidden="true">
      <path
        d="M14 4V38M14 38L4 26M14 38L24 26"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoopBackArrow({
  className = "",
  tone = "accent",
}: {
  className?: string;
  tone?: "default" | "accent";
}) {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const stroke =
    tone === "accent"
      ? isDarkMode
        ? "#00FFD1"
        : "#00A88A"
      : isDarkMode
        ? "#5b5b5b"
        : "#9ca3af";

  return (
    <svg className={className} viewBox="0 0 64 392" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M16 348C42 348 54 334 54 308V84C54 58 42 44 16 44H14"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 44L30 28M14 44L30 60"
        stroke={stroke}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ComparisonArrow() {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const fill = isDarkMode ? "#00FFD1" : "#00A88A";

  return (
    <div className="flex items-center justify-center self-center h-full">
      <div className="hidden xl:block pt-16">
        <svg className="w-[40px] h-[80px]" viewBox="0 0 40 80" fill="none" aria-hidden="true">
          <path d="M6 6L34 40L6 74V6Z" fill={fill} />
        </svg>
      </div>
      <div className="xl:hidden">
        <svg className="w-[40px] h-[80px] rotate-90" viewBox="0 0 40 80" fill="none" aria-hidden="true">
          <path d="M6 6L34 40L6 74V6Z" fill={fill} />
        </svg>
      </div>
    </div>
  );
}

function TodayFlow() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % 3);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[24rem] min-h-[22rem] flex items-center justify-center">
      <div className="grid grid-cols-[minmax(0,1fr)_60px] grid-rows-[88px_72px_88px_72px_88px] gap-x-2 items-center w-full max-w-[24rem]">
        <StepBlock tone={activeStep === 0 ? "accent" : "default"} className="col-start-1 row-start-1 h-full w-full max-w-[15rem] justify-self-center">
          <Translate id="homepage.comparison.today.step1">Select Generic Model</Translate>
        </StepBlock>

        <ArrowGlyph tone={activeStep === 1 ? "accent" : "default"} direction="down" className="col-start-1 row-start-2 self-center justify-self-center w-[28px] h-[52px]" />

        <StepBlock tone={activeStep === 1 ? "accent" : "default"} className="col-start-1 row-start-3 h-full w-full max-w-[15rem] justify-self-center">
          <Translate id="homepage.comparison.today.step2">Try Different Optimizations</Translate>
        </StepBlock>

        <ArrowGlyph tone={activeStep === 2 ? "accent" : "default"} direction="down" className="col-start-1 row-start-4 self-center justify-self-center w-[28px] h-[52px]" />

        <StepBlock tone={activeStep === 2 ? "accent" : "default"} className="col-start-1 row-start-5 h-full w-full max-w-[15rem] justify-self-center">
          <Translate id="homepage.comparison.today.step3">Deploy and Testing</Translate>
        </StepBlock>

        <LoopBackArrow tone={activeStep === 0 ? "accent" : "default"} className="col-start-2 row-start-1 row-span-5 justify-self-start -translate-x-1 h-full w-[60px]" />
      </div>
    </div>
  );
}

function OneWareFlow() {
  return (
    <div className="mx-auto w-full max-w-[12rem] min-h-[22rem] flex items-center justify-center">
      <div className="grid grid-cols-1 grid-rows-[auto_72px_auto] items-center w-full">
        <StepBlock className="row-start-1 w-full !px-2">
          <Translate id="homepage.comparison.oneware.step1">Let ONE AI Build Your Custom AI Model</Translate>
        </StepBlock>

        <ArrowGlyph direction="down" className="row-start-2 self-center justify-self-center w-[28px] h-[52px]" />

        <StepBlock tone="accent" className="row-start-3 w-full !px-2">
          <Translate id="homepage.comparison.oneware.step2">Working Product</Translate>
        </StepBlock>
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
      <div className="mx-auto w-full max-w-[96rem] px-3 md:px-4 lg:px-3 xl:px-6">
        <div className="w-full grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] gap-2 xl:gap-4 items-stretch">
          <SectionCard title={<Translate id="homepage.comparison.today.title">AI Development Today</Translate>}>
            <div className="xl:hidden flex flex-col items-center gap-4 min-h-[22rem]">
              <div className="flex items-center justify-center h-full w-full">
                <TodayFlow />
              </div>
            </div>
            <div className="hidden xl:grid xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:gap-4 items-center min-h-[22rem]">
              <div className="flex items-center justify-center h-full">
                <TodayFlow />
              </div>
              <div className="flex items-center justify-center h-full">
                <VideoPanel className="w-full max-w-[24rem]" src={yoloVideo} poster={yoloPoster} title="YOLO comparison video" crop />
              </div>
            </div>
          </SectionCard>

          <ComparisonArrow />

          <SectionCard title={<Translate id="homepage.comparison.oneware.title">AI Development with ONE AI</Translate>}>
            <div className="xl:hidden flex flex-col items-center gap-4 min-h-[22rem]">
              <div className="flex items-center justify-center h-full w-full">
                <OneWareFlow />
              </div>
            </div>
            <div className="hidden xl:grid xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:gap-4 items-center min-h-[22rem] xl:pt-5">
              <div className="flex items-center justify-center h-full">
                <OneWareFlow />
              </div>
              <div className="flex items-center justify-center h-full">
                <VideoPanel className="w-full max-w-[24rem]" src={oneAiVideo} poster={oneAiPoster} title="ONE AI workflow video" crop objectPosition="center 62%" />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
