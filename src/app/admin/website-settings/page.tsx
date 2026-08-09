"use client";

import { FormEvent, useEffect, useState } from "react";


interface AboutSettings {
  id: number;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  welcomeEyebrow: string;
  mottoLabel: string;
  missionLabel: string;
  visionLabel: string;
  valuesEyebrow: string;
  valuesTitle: string;
  valuesDescription: string;
  governanceEyebrow: string;
  governanceTitle: string;
  governanceDescription: string;
  anthemEyebrow: string;
  anthemTitle: string;
  anthemText: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

const emptyAboutSettings: AboutSettings = {
  id: 1,
  heroEyebrow: "",
  heroTitle: "",
  heroDescription: "",
  welcomeEyebrow: "",
  mottoLabel: "",
  missionLabel: "",
  visionLabel: "",
  valuesEyebrow: "",
  valuesTitle: "",
  valuesDescription: "",
  governanceEyebrow: "",
  governanceTitle: "",
  governanceDescription: "",
  anthemEyebrow: "",
  anthemTitle: "",
  anthemText: "",
  ctaTitle: "",
  ctaDescription: "",
  ctaPrimaryText: "",
  ctaPrimaryLink: "",
  ctaSecondaryText: "",
  ctaSecondaryLink: "",
};
interface WebsiteSettings {
  id: number;
  schoolName: string;
  shortName: string;
  tagline: string;
  motto: string;
  vision: string;
  mission: string;
  coreValues: string;
  introductionTitle: string;
  introductionText: string;
  heroTitle: string;
  heroSubtitle: string;
  centreCode: string;
  admissionsText: string;
  admissionsLink: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  location: string;
  mapUrl: string;
  introductionImage: string;
  introductionMediaType: string;
}

const emptySettings: WebsiteSettings = {
  id: 1,
  schoolName: "",
  shortName: "",
  tagline: "",
  motto: "",
  vision: "",
  mission: "",
  coreValues: "",
  introductionTitle: "",
  introductionText: "",
  heroTitle: "",
  heroSubtitle: "",
  centreCode: "",
  admissionsText: "",
  admissionsLink: "",
  whatsappNumber: "",
  phone: "",
  email: "",
  location: "",
  mapUrl: "",
  introductionImage: "",
  introductionMediaType: "image",
};

export default function WebsiteSettingsPage() {
  const [settings, setSettings] =
    useState<WebsiteSettings>(emptySettings);

  const [aboutSettings, setAboutSettings] =
    useState<AboutSettings>(emptyAboutSettings);

  const [savingAbout, setSavingAbout] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const [websiteResponse, aboutResponse] = await Promise.all([
          fetch("/api/website-settings", {
            cache: "no-store",
          }),
          fetch("/api/about-settings", {
            cache: "no-store",
          }),
        ]);

        if (!websiteResponse.ok) {
          throw new Error("Unable to load website settings.");
        }

        if (!aboutResponse.ok) {
          throw new Error("Unable to load About page settings.");
        }

        const [websiteData, aboutData] = await Promise.all([
          websiteResponse.json(),
          aboutResponse.json(),
        ]);

        setSettings(websiteData);
        setAboutSettings(aboutData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load website settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateField(
    field: keyof WebsiteSettings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }



  function updateAboutField(
    field: keyof AboutSettings,
    value: string
  ) {
    setAboutSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }
  async function handleIntroductionMediaUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setSettings((current) => ({
        ...current,
        introductionImage: data.url,
        introductionMediaType: data.mediaType,
      }));

      setMessage(
        "Media uploaded. Click Save All Changes to publish it."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload media."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/website-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save website settings."
        );
      }

      setSettings(data);
      setMessage("Website settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save website settings."
      );
    } finally {
      setSaving(false);
    }
  }


  async function saveAboutSettings() {
    try {
      setSavingAbout(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/about-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save About page settings."
        );
      }

      setAboutSettings(data);
      setMessage("About page settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save About page settings."
      );
    } finally {
      setSavingAbout(false);
    }
  }
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-16">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow">
          <p className="font-semibold text-slate-600">
            Loading website settings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-blue-950 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-extrabold">
              Website Settings
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Update the main content displayed across the school website.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-600 px-7 py-3 font-bold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 border-b border-slate-200 pb-3 text-xl font-extrabold text-blue-950">
              School Identity
            </h2>

            <div className="space-y-5">
              <Field
                label="School Name"
                value={settings.schoolName}
                onChange={(value) =>
                  updateField("schoolName", value)
                }
              />

              <Field
                label="Short Name"
                value={settings.shortName}
                onChange={(value) =>
                  updateField("shortName", value)
                }
              />

              <Field
                label="Tagline"
                value={settings.tagline}
                onChange={(value) =>
                  updateField("tagline", value)
                }
              />

              <Field
                label="School Motto"
                value={settings.motto}
                onChange={(value) =>
                  updateField("motto", value)
                }
              />

              <TextArea
                label="School Vision"
                value={settings.vision}
                onChange={(value) =>
                  updateField("vision", value)
                }
              />

              <TextArea
                label="School Mission"
                value={settings.mission}
                onChange={(value) =>
                  updateField("mission", value)
                }
              />

              <TextArea
                label="Core Values"
                value={settings.coreValues}
                onChange={(value) =>
                  updateField("coreValues", value)
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 border-b border-slate-200 pb-3 text-xl font-extrabold text-blue-950">
              Homepage Hero
            </h2>

            <div className="space-y-5">
              <Field
                label="Hero Title"
                value={settings.heroTitle}
                onChange={(value) =>
                  updateField("heroTitle", value)
                }
              />

              <Field
                label="Hero Subtitle"
                value={settings.heroSubtitle}
                onChange={(value) =>
                  updateField("heroSubtitle", value)
                }
              />

              <Field
                label="UNEB Centre Code"
                value={settings.centreCode}
                onChange={(value) =>
                  updateField("centreCode", value)
                }
              />

              <Field
                label="Admissions Button Text"
                value={settings.admissionsText}
                onChange={(value) =>
                  updateField("admissionsText", value)
                }
              />

              <Field
                label="Admissions Link"
                value={settings.admissionsLink}
                onChange={(value) =>
                  updateField("admissionsLink", value)
                }
              />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                    Upload Introduction Image or Video
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                    onChange={handleIntroductionMediaUpload}
                    disabled={uploading}
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-800 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-5 file:py-2.5 file:font-bold file:text-white hover:file:bg-blue-800 disabled:opacity-60"
                  />
                </label>

                <p className="mt-2 text-xs text-slate-500">
                  Images: maximum 8 MB. Videos: maximum 50 MB.
                </p>

                {uploading && (
                  <p className="mt-3 font-semibold text-blue-700">
                    Uploading media...
                  </p>
                )}

                {settings.introductionImage && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-black">
                    {settings.introductionMediaType === "video" ? (
                      <video
                        src={settings.introductionImage}
                        controls
                        muted
                        loop
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <img
                        src={settings.introductionImage}
                        alt="Introduction preview"
                        className="h-56 w-full object-cover"
                      />
                    )}
                  </div>
                )}
              </div>

              <Field
                label="Introduction Media Path"
                value={settings.introductionImage}
                onChange={(value) =>
                  updateField("introductionImage", value)
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 border-b border-slate-200 pb-3 text-xl font-extrabold text-blue-950">
              Homepage Introduction
            </h2>

            <div className="space-y-5">
              <Field
                label="Introduction Title"
                value={settings.introductionTitle}
                onChange={(value) =>
                  updateField("introductionTitle", value)
                }
              />

              <TextArea
                label="Introduction Text"
                rows={8}
                value={settings.introductionText}
                onChange={(value) =>
                  updateField("introductionText", value)
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 border-b border-slate-200 pb-3 text-xl font-extrabold text-blue-950">
              Contact Information
            </h2>

            <div className="space-y-5">
              <Field
                label="WhatsApp Number"
                value={settings.whatsappNumber}
                onChange={(value) =>
                  updateField("whatsappNumber", value)
                }
              />

              <Field
                label="Phone Number"
                value={settings.phone}
                onChange={(value) =>
                  updateField("phone", value)
                }
              />

              <Field
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(value) =>
                  updateField("email", value)
                }
              />

              <Field
                label="School Location"
                value={settings.location}
                onChange={(value) =>
                  updateField("location", value)
                }
              />

              <TextArea
                label="Google Map Embed URL"
                rows={5}
                value={settings.mapUrl}
                onChange={(value) =>
                  updateField("mapUrl", value)
                }
              />
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}

interface FieldProps {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}

function Field({
  label,
  value,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
}

function TextArea({
  label,
  value,
  rows = 4,
  onChange,
}: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}