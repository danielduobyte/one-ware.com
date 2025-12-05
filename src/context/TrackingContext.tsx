import React, { createContext, useContext, useEffect, useState } from "react";
import { loadAllScripts, trackConversion } from "../utils/tracking";

type ConsentStatus = "pending" | "all" | "necessary";

interface TrackingContextValue {
  consentStatus: ConsentStatus;
  isLoaded: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  resetConsent: () => void;
  track: typeof trackConversion;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent") as ConsentStatus | null;
    if (stored) {
      setConsentStatus(stored);
      if (stored === "all") {
        loadAllScripts();
      }
    }
    setIsLoaded(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setConsentStatus("all");
    loadAllScripts();
  };

  const acceptNecessary = () => {
    localStorage.setItem("cookie-consent", "necessary");
    setConsentStatus("necessary");
  };

  const resetConsent = () => {
    localStorage.removeItem("cookie-consent");
    setConsentStatus("pending");
  };

  return (
    <TrackingContext.Provider
      value={{
        consentStatus,
        isLoaded,
        acceptAll,
        acceptNecessary,
        resetConsent,
        track: trackConversion,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

const noopTrack = () => {};

const defaultValue: TrackingContextValue = {
  consentStatus: "pending",
  isLoaded: false,
  acceptAll: () => {},
  acceptNecessary: () => {},
  resetConsent: () => {},
  track: noopTrack as typeof trackConversion,
};

export function useTracking() {
  const context = useContext(TrackingContext);
  return context ?? defaultValue;
}
