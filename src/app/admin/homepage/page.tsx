"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

interface WebsiteSettings {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  centreCode: string;
  admissionsText: string;
  admissionsLink: string;
  whatsappNumber: string;
  motto: string;
  vision: string;
  mission: string;
  coreValues: string;
  introductionTitle: string;
  introductionText: string;
  introductionImage: string;
  introductionMediaType: string;
}

interface HeroSlide {
  id: number;
  imageUrl: string;
  altText: string | null;
  mediaType: string;
  displayOrder: number;
  isPublished: boolean;
}

export default function HomepageManagementPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [settingsResponse, slidesResponse] = await Promise.all([
        fetch("/api/website-settings", { cache: "no-store" }),
        fetch("/api/hero-slides", { cache: "no-store" }),
      ]);

      const settingsData = await settingsResponse.json();
      const slidesData = await slidesResponse.json();

      if (!settingsResponse.ok) {
        throw new Error(settingsData.message || "Unable to load settings.");
      }

      if (!slidesResponse.ok) {
        throw new Error(slidesData.message || "Unable to load hero media.");
      }

      setSettings(settingsData);
      setSlides(slidesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load homepage.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings) {
      return;
    }

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
        throw new Error(data.message || "Unable to save homepage settings.");
      }

      setSettings(data);
      setMessage("Homepage settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save homepage settings."
      );
    } finally {
      setSaving(false);
    }
  }

  async function uploadHeroMedia(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || "Upload failed.");
      }

      const response = await fetch("/api/hero-slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          mediaType: uploadData.mediaType,
          altText: "St. Mary's School hero media",
          displayOrder: slides.length,
          isPublished: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save hero media.");
      }

      setMessage("Hero media uploaded successfully.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function updateSlide(
    slide: HeroSlide,
    changes: Partial<HeroSlide>
  ) {
    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/hero-slides/${slide.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...slide,
          ...changes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update hero media.");
      }

      setMessage("Hero media updated.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update hero media."
      );
    }
  }

  async function deleteSlide(slide: HeroSlide) {
    if (!window.confirm("Delete this hero media item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/hero-slides/${slide.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete hero media.");
      }

      setMessage("Hero media deleted.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete hero media."
      );
    }
  }

  if (loading || !settings) {
    return (
      <div className="p-10 font-semibold text-slate-500">
        Loading homepage editor...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Homepage Management
        </h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Edit the hero, mission, vision, motto and introduction shown on the homepage.
        </p>
      </div>

      {message && (
        <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
          {error}
        </div>
      )}

      <form
        onSubmit={saveSettings}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950">
              Homepage Text
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              These fields update the public homepage.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-600 px-6 py-3 font-extrabold text-white shadow hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Homepage"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {[
            ["heroTitle", "Hero title"],
            ["heroSubtitle", "Hero subtitle"],
            ["centreCode", "UNEB centre code"],
            ["admissionsText", "Admissions button text"],
            ["admissionsLink", "Admissions button link"],
            ["whatsappNumber", "WhatsApp number"],
            ["motto", "School motto"],
            ["introductionTitle", "Introduction title"],
          ].map(([field, label]) => (
            <Field
              key={field}
              label={label}
              value={String(settings[field as keyof WebsiteSettings] || "")}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  [field]: value,
                })
              }
            />
          ))}

          <TextArea
            label="Mission"
            value={settings.mission}
            onChange={(value) =>
              setSettings({ ...settings, mission: value })
            }
          />

          <TextArea
            label="Vision"
            value={settings.vision}
            onChange={(value) =>
              setSettings({ ...settings, vision: value })
            }
          />

          <TextArea
            label="Core values (separate with commas)"
            value={settings.coreValues}
            onChange={(value) =>
              setSettings({ ...settings, coreValues: value })
            }
          />

          <TextArea
            label="Introduction text"
            value={settings.introductionText}
            onChange={(value) =>
              setSettings({ ...settings, introductionText: value })
            }
          />
        </div>
      </form>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950">
              Hero Images and Videos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload slideshow images or short background videos.
            </p>
          </div>

          <label className="cursor-pointer rounded-xl bg-blue-700 px-6 py-3 font-extrabold text-white shadow hover:bg-blue-800">
            {uploading ? "Uploading..." : "Upload Media"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
              disabled={uploading}
              onChange={uploadHeroMedia}
              className="hidden"
            />
          </label>
        </div>

        {slides.length === 0 ? (
          <p className="py-10 text-center text-slate-500">
            No hero media uploaded yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {slides.map((slide) => (
              <article
                key={slide.id}
                className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="h-52 bg-slate-200">
                  {slide.mediaType === "video" ? (
                    <video
                      src={slide.imageUrl}
                      controls
                      muted
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={slide.imageUrl}
                      alt={slide.altText || "Hero media"}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="space-y-4 p-5">
                  <Field
                    label="Display order"
                    value={String(slide.displayOrder)}
                    onChange={(value) =>
                      updateSlide(slide, {
                        displayOrder: Number(value),
                      })
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateSlide(slide, {
                        isPublished: !slide.isPublished,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    {slide.isPublished ? "Hide" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSlide(slide)}
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <textarea
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 leading-7 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
