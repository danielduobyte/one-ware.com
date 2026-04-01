import React from "react";
import Layout from "@theme/Layout";
import { useColorMode } from "@docusaurus/theme-common";
import Translate, { translate } from "@docusaurus/Translate";
import HeroBackground from "../components/HeroBackground";
import OnboardingProjectForm from "../components/OnboardingProjectForm";
import { FEATURED_IN } from "../data/featuredIn";
import { trackEvent } from "../utils/tracking";

const BOOKING_URL = "https://outlook.office.com/book/ONEWARECustomerMeetingRequest@one-ware.com/";

const BENEFITS = [
  "Identify where ONE WARE can help you deliver more projects with the same team",
  "Discover use cases that were previously too complex, time-consuming or not feasible",
  "Learn how to go from project idea to production-ready AI in minutes",
  "Get guided onboarding for your first projects",
];

function BookDemoContent() {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <HeroBackground
      className="min-h-screen"
      style={{
        marginTop: "calc(var(--ifm-navbar-height) * -1)",
        paddingTop: "var(--ifm-navbar-height)",
      }}
    >
      <div className="container mx-auto px-6 py-14 md:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="pt-2">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--ifm-color-primary)]">
                <Translate id="bookdemo.eyebrow">Vision AI Onboarding</Translate>
              </p>
              <h1 className={`text-5xl font-semibold leading-[0.95] md:text-6xl lg:text-7xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                <Translate id="bookdemo.title">Book a Free Onboarding Session</Translate>
              </h1>
              <p className={`mt-6 max-w-2xl text-lg leading-relaxed md:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <Translate id="bookdemo.subtitle">
                  Get to production-ready Vision-AI models faster without weeks of model selection and optimization
                </Translate>
              </p>
            </div>

            <div
              className={`mt-10 rounded-[32px] border p-7 md:p-8 ${
                isDarkMode ? "border-gray-700 bg-gray-900/70" : "border-gray-200 bg-white/80"
              }`}
              style={{ backdropFilter: "blur(18px)" }}
            >
              <h2 className={`text-2xl font-semibold md:text-3xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                <Translate id="bookdemo.benefits.title">What you'll get</Translate>
              </h2>
              <ul className="mt-6 space-y-4">
                {BENEFITS.map((benefit, index) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--ifm-color-primary)]" />
                    <span className={`text-base leading-relaxed md:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      <Translate id={`bookdemo.benefits.item.${index + 1}`}>{benefit}</Translate>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="lg:sticky lg:top-28">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("schedule_meeting", { label: "Book Onboarding Session" })}
              className="button button--primary button--lg mb-6 inline-flex w-full items-center justify-center text-center font-semibold"
            >
              <Translate id="bookdemo.cta">Book an Onboarding Session</Translate>
            </a>

            <OnboardingProjectForm />
          </div>
        </div>
      </div>
    </HeroBackground>
  );
}

export default function BookDemoPage() {
  return (
    <Layout
      title={translate({
        id: "bookdemo.meta.title",
        message: "Book a Free Onboarding Session",
      })}
      description={translate({
        id: "bookdemo.meta.description",
        message: "Get to production-ready Vision-AI models faster without weeks of model selection and optimization.",
      })}
    >
      <BookDemoContent />
    </Layout>
  );
}
