import { TRACKING_CONFIG } from "./config";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    rdt: (...args: unknown[]) => void;
    twq: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export type ConversionType = "event_registration";

interface EventRegistrationData {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventType: string;
}

type ConversionData = {
  event_registration: EventRegistrationData;
};

export function trackConversion<T extends ConversionType>(
  type: T,
  data: ConversionData[T]
): void {
  if (!hasTrackingConsent()) return;

  switch (type) {
    case "event_registration":
      trackEventRegistration(data as EventRegistrationData);
      break;
  }
}

function trackEventRegistration(data: EventRegistrationData): void {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", "conversion", {
      send_to: TRACKING_CONFIG.googleAds.conversions.eventRegistration,
      event_name: data.eventName,
      event_date: data.eventDate,
    });
  }

  if (window.fbq) {
    window.fbq("track", "Lead", {
      content_name: data.eventName,
      content_category: data.eventType,
    });
  }

  if (window.rdt) {
    window.rdt("track", "Lead", {
      customEventName: data.eventName,
    });
  }

  if (window.twq) {
    window.twq("event", "tw-xxxxx-xxxxx", {
      content_name: data.eventName,
    });
  }
}

function hasTrackingConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookie-consent") === "all";
}
