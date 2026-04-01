import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useColorMode } from "@docusaurus/theme-common";
import Translate from "@docusaurus/Translate";
import { trackEvent } from "../../utils/tracking";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

interface FormData {
  name: string;
  email: string;
  message: string;
  website: string;
  recaptcha_token: string;
}

const RECAPTCHA_SITE_KEY = "6Ldzg-orAAAAAIOc5GaUtR6gOpdqcW1EHZL7I9mp";
const API_URL = "https://backend.one-ware.com/api/contact";

export default function OnboardingProjectForm() {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    website: "",
    recaptcha_token: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "development") {
      return;
    }

    if (!document.querySelector("#recaptcha-script")) {
      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onerror = (error) => console.warn("reCAPTCHA load error:", error);
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (formStatus !== "idle") {
      setFormStatus("idle");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (formData.website.trim()) {
      console.warn("Bot detected, submission ignored.");
      return;
    }

    let token = "";
    try {
      if (window.grecaptcha) {
        token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "submit" });
      }
    } catch (error) {
      console.warn("reCAPTCHA execution failed:", error);
    }

    try {
      const response = await axios.post(API_URL, {
        ...formData,
        recaptcha_token: token,
      });

      if (response.data?.success === true) {
        setFormStatus("success");
        setFormData({
          name: "",
          email: "",
          message: "",
          website: "",
          recaptcha_token: "",
        });
        trackEvent("contact_form_submit", { label: "Onboarding Project Form" });
        return;
      }

      setFormStatus("error");
    } catch (error) {
      console.error("Error submitting onboarding form:", error);
      setFormStatus("error");
    }
  };

  return (
    <div
      className={`rounded-[28px] border p-6 md:p-8 shadow-xl ${
        isDarkMode ? "border-gray-700 bg-gray-900/80" : "border-gray-200 bg-white/90"
      }`}
      style={{ backdropFilter: "blur(18px)" }}
    >
      <div className="mb-6">
        <h2 className={`text-2xl md:text-3xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          <Translate id="bookdemo.form.title">Tell Us About Your Project</Translate>
        </h2>
      </div>

      {formStatus === "success" ? (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Translate id="bookdemo.form.success.title">Message sent successfully!</Translate>
          </h3>
          <p className={`mt-2 text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <Translate id="bookdemo.form.success.description">
              We will get back to you as soon as possible.
            </Translate>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {formStatus === "error" && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">
                <Translate id="bookdemo.form.error">An error occurred while sending your message.</Translate>
              </p>
            </div>
          )}

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Translate id="bookdemo.form.name">Name</Translate>
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full rounded-2xl border px-4 py-3 transition-colors focus:border-[var(--ifm-color-primary)] focus:outline-none ${
                isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Translate id="bookdemo.form.email">E-Mail</Translate>
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full rounded-2xl border px-4 py-3 transition-colors focus:border-[var(--ifm-color-primary)] focus:outline-none ${
                isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </label>

          <label className="block">
            <span className={`mb-2 block text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <Translate id="bookdemo.form.message">What are you working on?</Translate>
            </span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className={`min-h-[160px] w-full resize-y rounded-2xl border px-4 py-3 transition-colors focus:border-[var(--ifm-color-primary)] focus:outline-none ${
                isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </label>

          <button
            type="submit"
            className={`button button--primary button--lg w-full font-semibold transition-transform hover:scale-[1.01] ${
              isDarkMode ? "text-black" : "text-white"
            }`}
          >
            <Translate id="bookdemo.form.submit">Send</Translate>
          </button>
        </form>
      )}
    </div>
  );
}
