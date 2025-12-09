import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { FAQ_DATA, FAQ_CATEGORIES } from "../../data/faqData";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

interface QuestionFormData {
  name: string;
  email: string;
  message: string;
  website: string;
  recaptcha_token: string;
}

const RECAPTCHA_SITE_KEY = "6Ldzg-orAAAAAIOc5GaUtR6gOpdqcW1EHZL7I9mp";
const API_URL = "https://contact.one-ware.com/send";

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div
      style={{
        background: isOpen
          ? "linear-gradient(135deg, rgba(0, 255, 209, 0.08), rgba(0, 255, 209, 0.03))"
          : "rgba(0, 0, 0, 0.3)",
        border: isOpen
          ? "1px solid rgba(0, 255, 209, 0.3)"
          : "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        marginBottom: "12px",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isOpen ? "inset 3px 0 0 0 #00FFD1" : "none",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0, 255, 209, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: isOpen ? "#00FFD1" : "#e0e0e0",
            fontSize: "18px",
            paddingRight: "16px",
            transition: "color 0.3s ease",
            lineHeight: 1.4,
          }}
        >
          {question}
        </span>
        <span
          style={{
            color: "#00FFD1",
            fontSize: "1.25rem",
            fontWeight: 400,
            lineHeight: 1,
            flexShrink: 0,
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              padding: "0 20px 20px 20px",
              color: "#e0e0e0",
              fontSize: "18px",
              lineHeight: 1.6,
              margin: 0,
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.3s ease 0.1s",
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuestionForm() {
  const [formData, setFormData] = useState<QuestionFormData>({
    name: "",
    email: "",
    message: "",
    website: "",
    recaptcha_token: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.website.trim()) {
      console.warn("Bot detected — submission ignored.");
      return;
    }

    setIsSubmitting(true);

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
        ...formData,
        recaptcha_token: token,
      });

      const { status } = response.data;

      if (status === "success") {
        alert("Your question has been sent successfully!");
        setFormData({ name: "", email: "", message: "", website: "", recaptcha_token: "" });
      } else {
        alert("Failed to send your question. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while sending your question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "#e0e0e0",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: "8px",
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(0, 255, 209, 0.1), rgba(0, 255, 209, 0.05))",
        border: "1px solid rgba(0, 255, 209, 0.2)",
        borderRadius: "20px",
        padding: "32px",
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(0, 255, 209, 0.5)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>E-Mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(0, 255, 209, 0.5)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Your Question</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={2}
            style={{
              ...inputStyle,
              resize: "none",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(0, 255, 209, 0.5)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px 32px",
            background: "#00FFD1",
            border: "none",
            borderRadius: "8px",
            color: "#000000",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            opacity: isSubmitting ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = "#00e6be";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#00FFD1";
          }}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

function FAQSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    return FAQ_DATA.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredByCategory = useMemo(() => {
    const grouped: Record<string, typeof FAQ_DATA> = {};
    FAQ_CATEGORIES.forEach((category) => {
      const faqs = filteredFAQs.filter((faq) => faq.category === category);
      if (faqs.length > 0) {
        grouped[category] = faqs;
      }
    });
    return grouped;
  }, [filteredFAQs]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px",
            color: "#00FFD1",
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          style={{
            width: "100%",
            paddingLeft: "48px",
            paddingRight: "16px",
            paddingTop: "14px",
            paddingBottom: "14px",
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(0, 255, 209, 0.5)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        />
      </div>

      {searchQuery.trim() && (
        <div style={{ marginTop: "24px" }}>
          {Object.keys(filteredByCategory).length > 0 ? (
            Object.entries(filteredByCategory).map(([category, faqs]) => (
              <div key={category} style={{ marginBottom: "32px" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#00FFD1",
                    marginBottom: "16px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid rgba(0, 255, 209, 0.2)",
                  }}
                >
                  {category}
                </h3>
                {faqs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openItems.has(faq.id)}
                    onToggle={() => toggleItem(faq.id)}
                  />
                ))}
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "32px 24px",
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <p style={{ color: "#e0e0e0", marginBottom: "8px" }}>
                No questions found for "{searchQuery}"
              </p>
              <p style={{ color: "#a0a0a0", fontSize: "0.875rem" }}>
                Try a different search term or submit your question below.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface FAQCategoryProps {
  category: string;
}

function FAQCategory({ category }: FAQCategoryProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const faqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => faq.category === category);
  }, [category]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (faqs.length === 0) return null;

  return (
    <div>
      {faqs.map((faq) => (
        <FAQItem
          key={faq.id}
          question={faq.question}
          answer={faq.answer}
          isOpen={openItems.has(faq.id)}
          onToggle={() => toggleItem(faq.id)}
        />
      ))}
    </div>
  );
}

export default function FAQSection() {
  return <FAQSearch />;
}

export { QuestionForm, FAQCategory, FAQSearch };
