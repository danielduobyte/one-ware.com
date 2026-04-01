import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { useColorMode } from "@docusaurus/theme-common";
import { trackEvent } from "../../utils/tracking";

const BOOKING_URL = "https://outlook.office.com/book/ONEWARECustomerMeetingRequest@one-ware.com/";

interface DocsBookingCtaProps {
  className?: string;
}

export default function DocsBookingCta({ className = "" }: DocsBookingCtaProps) {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return (
    <div
      className={`mb-8 overflow-hidden rounded-[28px] border ${className} ${
        isDarkMode ? "border-gray-700 bg-[#161616]" : "border-gray-200 bg-white"
      }`}
      style={{
        boxShadow: isDarkMode ? "0 18px 50px rgba(0, 0, 0, 0.28)" : "0 18px 50px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        className="px-6 py-7 md:px-8 md:py-8"
        style={{
          background: isDarkMode
            ? "radial-gradient(circle at top right, rgba(0,255,209,0.14), transparent 42%)"
            : "radial-gradient(circle at top right, rgba(0,168,138,0.12), transparent 42%)",
        }}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ifm-color-primary)]">
          <Translate id="docsbooking.eyebrow">Onboarding With Our Experts</Translate>
        </p>
        <h2 className={`m-0 text-2xl font-semibold md:text-3xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          <Translate id="docsbooking.title">Book a Free Onboarding Session</Translate>
        </h2>
        <p className={`mt-3 max-w-3xl text-base leading-relaxed md:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <Translate id="docsbooking.subtitle">
            Get guided support for your first Vision-AI project and reach a production-ready setup faster.
          </Translate>
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("schedule_meeting", { label: "Docs Booking CTA" })}
            className="button button--primary button--lg"
          >
            <Translate id="docsbooking.cta.book">Book an Onboarding Session</Translate>
          </a>
          <Link className="button button--primary button--outline button--lg" to="/book-demo">
            <Translate id="docsbooking.cta.project">Tell Us About Your Project</Translate>
          </Link>
        </div>
      </div>
    </div>
  );
}
