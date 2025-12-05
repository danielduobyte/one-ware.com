import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Translate, { translate } from "@docusaurus/Translate";
import { Event, FormField } from "../../types/eventTypes";
import { useLocalizedEvent, useLocalizedDateFormat } from "../../hooks/useLocalizedEvent";
import { useTracking } from "../../context/TrackingContext";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

interface EventRegistrationFormProps {
  event: Event;
}

interface FormData {
  name: string;
  email: string;
  website: string;
  [key: string]: string;
}

const RECAPTCHA_SITE_KEY = "6Ldzg-orAAAAAIOc5GaUtR6gOpdqcW1EHZL7I9mp";
const API_URL = "https://contact.one-ware.com/send";

export default function EventRegistrationForm({ event }: EventRegistrationFormProps) {
  const localizedEvent = useLocalizedEvent(event);
  const dateLocale = useLocalizedDateFormat();
  const { track } = useTracking();

  const initialFormData: FormData = {
    name: "",
    email: "",
    website: "",
  };

  if (event.formFields) {
    event.formFields.forEach((field) => {
      initialFormData[field.name] = "";
    });
  }

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "development") return;

    if (!document.querySelector("#recaptcha-script")) {
      const script = document.createElement("script");
      script.id = "recaptcha-script";
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onerror = (err) => console.warn("reCAPTCHA load error:", err);
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString(dateLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const buildMessage = (): string => {
    const lines: string[] = [
      `[Event Registration: ${localizedEvent.title}]`,
      "",
      `Event: ${localizedEvent.title}`,
      `Date: ${formatDate(event.date)}`,
      `Time: ${event.time || "TBD"}`,
      "",
    ];

    if (event.formFields && event.formFields.length > 0) {
      lines.push("--- Additional Information ---");
      event.formFields.forEach((field) => {
        const value = formData[field.name] || "-";
        lines.push(`${field.label}: ${value}`);
      });
    }

    return lines.join("\n");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.website.trim()) {
      console.warn("Bot detected — submission ignored.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    let token = "";
    try {
      if (window.grecaptcha) {
        token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "submit" });
      }
    } catch (err) {
      console.warn("reCAPTCHA execution failed:", err);
    }

    try {
      const response = await axios.post(API_URL, {
        name: formData.name,
        email: formData.email,
        message: buildMessage(),
        website: formData.website,
        recaptcha_token: token,
      });

      const { status } = response.data;

      if (status === "success") {
        track("event_registration", {
          eventId: event.id,
          eventName: event.title,
          eventDate: event.date,
          eventType: event.type,
        });
        setSubmitStatus("success");
        setFormData(initialFormData);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocalizedLabel = (field: FormField): string => {
    if (dateLocale === "de-DE" && field.label_de) {
      return field.label_de;
    }
    return field.label;
  };

  const handleTeamsClick = () => {
    if (event.teamsUrl) {
      window.open(event.teamsUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleGoogleClick = () => {
    if (event.googleMeetUrl) {
      window.open(event.googleMeetUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="relative p-8 md:p-12 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(0, 255, 209, 0.1), rgba(0, 255, 209, 0.05))", border: "1px solid rgba(0, 255, 209, 0.2)" }}>
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--ifm-color-primary)]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            <Translate id="seminars.form.success.title">Registration Successful!</Translate>
          </h3>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            <Translate id="seminars.form.success.message">
              Thank you for registering. You will receive a confirmation email shortly.
            </Translate>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 md:p-8 lg:p-10 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(0, 255, 209, 0.1), rgba(0, 255, 209, 0.05))", border: "1px solid rgba(0, 255, 209, 0.2)" }}>

      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          <Translate id="seminars.detail.registration">Registration</Translate>
        </h2>

        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
          <div className="lg:w-[40%] space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[var(--ifm-color-primary)] mb-4">
                {localizedEvent.title}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>{formatDate(localizedEvent.date)}</span>
                </div>

                {localizedEvent.time && (
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>{localizedEvent.time}</span>
                  </div>
                )}

                {localizedEvent.location && (
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span>{localizedEvent.location}</span>
                  </div>
                )}

                {localizedEvent.language && (
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[var(--ifm-color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    </div>
                    <span>{localizedEvent.language}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          <div className="lg:w-[55%]">
            {(event.teamsUrl || event.googleMeetUrl) && (
              <div className="pb-4 mb-4 border-b border-white/20">
                <h3 className="text-xl font-semibold text-[var(--ifm-color-primary)] mb-4">
                  <Translate id="seminars.calendar.addTo">Add to Calendar</Translate>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.teamsUrl && (
                    <button
                      type="button"
                      onClick={handleTeamsClick}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-lg hover:bg-white/20 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3.05-1.83zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73zM9 3.75V6h2l.13.01.12.04v-2.3zM5.98 15.98q.9 0 1.6-.3.7-.32 1.19-.86.48-.55.73-1.28.25-.74.25-1.61 0-.83-.25-1.55-.24-.71-.71-1.24t-1.15-.83q-.68-.3-1.55-.3-.92 0-1.64.3-.71.3-1.2.85-.5.54-.75 1.3-.25.74-.25 1.63 0 .85.26 1.56.26.72.74 1.23.48.52 1.17.81.69.3 1.56.3zM7.5 21h12.39L12 16.08V17q0 .41-.3.7-.29.3-.7.3H7.5zm15-.13v-7.24l-5.9 3.54Z" />
                      </svg>
                      Teams
                    </button>
                  )}
                  {event.googleMeetUrl && (
                    <button
                      type="button"
                      onClick={handleGoogleClick}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 text-white text-sm rounded-lg hover:bg-white/20 transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-15A2.5 2.5 0 0 1 4.5 2H9v2H4.5a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V15h2v4.5a2.5 2.5 0 0 1-2.5 2.5z" />
                        <path d="M8.5 17h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V7h2zm4 8h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V7h2zm4 8h-2v-2h2zm0-4h-2v-2h2z" />
                        <path d="M21 10V4h-6v2h2.59L13 10.59 14.41 12 19 7.41V10z" />
                      </svg>
                      Google Meet
                    </button>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/50 group-focus-within:text-[var(--ifm-color-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={translate({ id: "seminars.form.name", message: "Name" }) + " *"}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/50 outline-none focus:bg-white/[0.05] focus:border-[var(--ifm-color-primary)] focus:shadow-[0_0_0_3px_rgba(0,202,165,0.15)] transition-all duration-200"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/50 group-focus-within:text-[var(--ifm-color-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={translate({ id: "seminars.form.email", message: "E-Mail" }) + " *"}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/50 outline-none focus:bg-white/[0.05] focus:border-[var(--ifm-color-primary)] focus:shadow-[0_0_0_3px_rgba(0,202,165,0.15)] transition-all duration-200"
                />
              </div>

              {event.formFields && event.formFields.map((field) => (
                <div key={field.name} className="relative group">
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      rows={4}
                      placeholder={getLocalizedLabel(field) + (field.required ? " *" : "")}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/50 outline-none focus:bg-white/[0.05] focus:border-[var(--ifm-color-primary)] focus:shadow-[0_0_0_3px_rgba(0,202,165,0.15)] transition-all duration-200 resize-none"
                    />
                  ) : field.type === "select" && field.options ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white outline-none focus:bg-white/[0.05] focus:border-[var(--ifm-color-primary)] focus:shadow-[0_0_0_3px_rgba(0,202,165,0.15)] transition-all duration-200 appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "1.25rem" }}
                    >
                      <option value="">{getLocalizedLabel(field)}{field.required ? " *" : ""}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={getLocalizedLabel(field) + (field.required ? " *" : "")}
                      className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/50 outline-none focus:bg-white/[0.05] focus:border-[var(--ifm-color-primary)] focus:shadow-[0_0_0_3px_rgba(0,202,165,0.15)] transition-all duration-200"
                    />
                  )}
                </div>
              ))}

              {submitStatus === "error" && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Translate id="seminars.form.error">
                    An error occurred. Please try again or contact us at info@one-ware.com.
                  </Translate>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full mt-4 px-6 py-3.5 rounded-xl font-medium text-sm overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "rgba(0, 255, 209, 0.05)",
                  border: "1px solid rgba(0, 255, 209, 0.3)"
                }}
              >
                <span className="relative z-10 text-[var(--ifm-color-primary)] group-hover:text-[var(--ifm-color-primary-lighter)] transition-colors">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <Translate id="seminars.form.submitting">Submitting...</Translate>
                    </span>
                  ) : (
                    <Translate id="seminars.form.submit">Register Now</Translate>
                  )}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(0, 255, 209, 0.08)" }}
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
