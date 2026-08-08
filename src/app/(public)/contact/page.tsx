"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";

interface ContactSettings {
  location: string;
  phones: string[];
  emails: string[];
  weekdays: string;
  saturday: string;
  sunday: string;
  visitText: string;
  directionsText: string;
  whatsappNumber: string;
  mapUrl: string;
}

const defaultSettings: ContactSettings = {
  location: "Manja, Uganda",
  phones: [],
  emails: [],
  weekdays: "",
  saturday: "",
  sunday: "",
  visitText: "",
  directionsText: "",
  whatsappNumber: "",
  mapUrl: "",
};

export default function ContactPage() {
  const [contactData, setContactData] =
    useState<ContactSettings>(defaultSettings);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/contact-settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load contact details.");
        }

        setContactData(await response.json());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load contact details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setSuccess("");
      setError("");

      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send your message.");
      }

      setSuccess("Your message has been sent successfully.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send your message."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative bg-[#0e1b4d] px-4 pb-40 pt-20 text-center text-white">
        <div className="mb-6 inline-block rounded-full bg-[#facc15] px-5 py-1.5 text-sm font-semibold text-slate-900 shadow-md">
          Get in Touch
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">
          Contact Us
        </h1>

        <p className="mx-auto max-w-xl text-lg font-light text-slate-300">
          We&apos;d love to hear from you. Reach out anytime.
        </p>
      </section>

      <section className="relative z-10 mx-auto -mt-24 max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<MapPin className="h-6 w-6" />}
            title="Location"
            accent="blue"
          >
            <p>{loading ? "Loading..." : contactData.location}</p>
          </InfoCard>

          <InfoCard
            icon={<Phone className="h-6 w-6" />}
            title="Phone"
            accent="cyan"
          >
            <div className="space-y-1">
              {contactData.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="block hover:underline"
                >
                  {phone}
                </a>
              ))}
            </div>
          </InfoCard>

          <InfoCard
            icon={<Mail className="h-6 w-6" />}
            title="Email"
            accent="dark"
          >
            <div className="space-y-1">
              {contactData.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="block hover:underline"
                >
                  {email}
                </a>
              ))}
            </div>
          </InfoCard>

          <InfoCard
            icon={<Clock className="h-6 w-6" />}
            title="Office Hours"
            accent="amber"
          >
            <div className="space-y-1">
              <p>{contactData.weekdays}</p>
              <p>{contactData.saturday}</p>
              <p>{contactData.sunday}</p>
            </div>
          </InfoCard>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <article className="group rounded-3xl border-2 border-slate-100 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:border-blue-600 hover:bg-blue-50/30 md:p-10">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 transition group-hover:text-blue-950 md:text-3xl">
                Visit Our School
              </h2>
              <p className="mb-6 leading-relaxed text-slate-600">
                {contactData.visitText}
              </p>
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a1128] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                Schedule a Visit <ArrowUpRight className="h-4 w-4" />
              </Link>
            </article>

            <article className="group rounded-3xl border-2 border-cyan-200 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:bg-cyan-50/40 md:p-10">
              <h2 className="mb-4 text-2xl font-bold text-slate-900 transition group-hover:text-cyan-950 md:text-3xl">
                Directions
              </h2>
              <p className="leading-relaxed text-slate-600">
                {contactData.directionsText}
              </p>
            </article>
          </div>

          <form
            onSubmit={submitMessage}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <MessageSquare className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-3xl font-extrabold text-blue-950">
              Send Us a Message
            </h2>

            <p className="mt-2 text-slate-600">
              Complete the form and the school office will receive your message.
            </p>

            {success && (
              <div className="mt-5 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">
                {success}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-5">
              <Field
                label="Full name"
                value={form.name}
                required
                onChange={(value) => setForm({ ...form, name: value })}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  required
                  onChange={(value) => setForm({ ...form, email: value })}
                />

                <Field
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(value) => setForm({ ...form, phone: value })}
                />
              </div>

              <Field
                label="Subject"
                value={form.subject}
                required
                onChange={(value) => setForm({ ...form, subject: value })}
              />

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Message
                </span>
                <textarea
                  rows={6}
                  required
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 leading-7 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-700 px-6 py-4 font-extrabold text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {contactData.mapUrl && (
          <div className="mt-10 h-96 overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-xl">
            <iframe
              title="School location map"
              src={contactData.mapUrl}
              loading="lazy"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        )}
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: "blue" | "cyan" | "dark" | "amber";
  children: React.ReactNode;
}) {
  const styles = {
    blue: "bg-white hover:border-blue-600 hover:bg-blue-50/50",
    cyan: "bg-white hover:border-cyan-500 hover:bg-cyan-50/50",
    dark: "bg-[#0e1b4d] text-white hover:border-amber-400 hover:bg-[#08102e]",
    amber: "bg-white hover:border-amber-500 hover:bg-amber-50/50",
  };

  return (
    <article
      className={`group flex flex-col items-center rounded-3xl border-2 border-transparent p-8 text-center shadow-xl transition duration-300 hover:-translate-y-1.5 ${styles[accent]}`}
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-md transition duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3
        className={`mb-3 text-xl font-bold ${
          accent === "dark" ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h3>
      <div
        className={`text-sm leading-relaxed ${
          accent === "dark" ? "text-slate-200" : "text-slate-600"
        }`}
      >
        {children}
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  type = "text",
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
