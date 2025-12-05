import React from "react";
import { TrackingProvider } from "../../context/TrackingContext";
import CookieConsent from "../../components/CookieConsent";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <TrackingProvider>
      {children}
      <CookieConsent />
    </TrackingProvider>
  );
}
