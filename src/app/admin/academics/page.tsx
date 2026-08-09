"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  heroMediaUrl: string;
  heroMediaType: string;
  oLevelTitle: string;
  oLevelDescription: string;
  oLevelItems: string;
  aLevelTitle: string;
  aLevelDescription: string;
  aLevelSciences: string;
  aLevelArts: string;
  aLevelSubsidiaries: string;
  departmentsText: string;
  subjectsText: string;
  performanceText: string;
  calendarText: string;
  heroEyebrow: string;
  oLevelButtonText: string;
  oLevelButtonLink: string;
  aLevelButtonText: string;
  aLevelButtonLink: string;
  academicLifeEyebrow: string;
  academicLifeTitle: string;
  academicLifeDescription: string;
  departmentsTitle: string;
  subjectsTitle: string;
  performanceTitle: string;
  calendarTitle: string;
}

interface LifeItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  mediaUrl: string;
  mediaType: string;
  displayOrder: number;
  isPublished: boolean;
}

const emptyItem = {
  title: "",
  description: "",
  icon: "Book",
  mediaUrl: "",
  mediaType: "image",
  displayOrder: 0,
  isPublished: true,
};

export default function AcademicsAdminPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [items, setItems] = useState<LifeItem[]>([]);
  const [form, setForm] = useState(emptyItem);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [settingsResponse, itemsResponse] = await Promise.all([
        fetch("/api/academic-settings", { cache: "no-store" }),
        fetch("/api/academic-life?admin=1", { cache: "no-store" }),
      ]);

      const settingsData = await settingsResponse.json();
      const itemsData = await itemsResponse.json();

      if (!settingsResponse.ok) throw new Error(settingsData.message);
      if (!itemsResponse.ok) throw new Error(itemsData.message);

      setSettings(settingsData);
      setItems(itemsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load academics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function uploadFile(
    event: ChangeEvent<HTMLInputElement>,
    target: "hero" | "item"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Upload failed.");

      if (target === "hero" && settings) {
        setSettings({
          ...settings,
          heroMediaUrl: data.url,
          heroMediaType: data.mediaType === "video" ? "video" : "image",
        });
      } else {
        setForm({
          ...form,
          mediaUrl: data.url,
          mediaType: data.mediaType === "video" ? "video" : "image",
        });
      }

      setMessage("Media uploaded successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/academic-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSettings(data);
      setMessage("Academic settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        editingId ? `/api/academic-life/${editingId}` : "/api/academic-life",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setForm(emptyItem);
      setEditingId(null);
      setMessage(editingId ? "Academic item updated." : "Academic item added.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save item.");
    } finally {
      setSaving(false);
    }
  }

  function editItem(item: LifeItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      icon: item.icon,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      displayOrder: item.displayOrder,
      isPublished: item.isPublished,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function quickUpdate(item: LifeItem, changes: Partial<LifeItem>) {
    const response = await fetch(`/api/academic-life/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, ...changes }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Update failed.");
      return;
    }

    setMessage("Academic item updated.");
    await loadData();
  }

  async function deleteItem(item: LifeItem) {
    if (!confirm(`Delete "${item.title}"?`)) return;

    const response = await fetch(`/api/academic-life/${item.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Delete failed.");
      return;
    }

    setMessage("Academic item deleted.");
    await loadData();
  }

  if (loading || !settings) {
    return <div className="p-10 text-slate-500">Loading academics manager...</div>;
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <header className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Academics Management
        </h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Manage the academic hero, programmes and Academic Life photographs.
        </p>
      </header>

      {message && <Notice type="success" text={message} />}
      {error && <Notice type="error" text={error} />}

      <form
        onSubmit={saveSettings}
        className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950">
              Academic Page Content
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the hero, O-Level, A-Level and information panels.
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-600 px-6 py-3 font-extrabold text-white"
          >
            {saving ? "Saving..." : "Save Academic Page"}
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Field
            label="Hero title"
            value={settings.heroTitle}
            onChange={(value) => setSettings({ ...settings, heroTitle: value })}
          />
          <Field
            label="Hero subtitle"
            value={settings.heroSubtitle}
            onChange={(value) => setSettings({ ...settings, heroSubtitle: value })}
          />

          <div className="rounded-xl border bg-slate-50 p-4 lg:col-span-2">
            <p className="text-xs font-bold uppercase text-slate-600">
              Hero image or video
            </p>
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/ogg"
              onChange={(event) => uploadFile(event, "hero")}
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-2 text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-5 file:py-2.5 file:font-bold file:text-white hover:file:bg-blue-800"
            />
            {settings.heroMediaUrl && (
              <div className="mt-4 overflow-hidden rounded-xl bg-black">
                {settings.heroMediaType === "video" ? (
                  <video
                    src={settings.heroMediaUrl}
                    controls
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <img
                    src={settings.heroMediaUrl}
                    alt="Academic hero"
                    className="h-64 w-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>


          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>


          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
 
          <div className="lg:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 className="text-lg font-extrabold text-blue-950">
              Additional Academic Page Controls
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Edit section labels, buttons and information panel titles.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              <Field
                label="Hero small heading"
                value={settings.heroEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, heroEyebrow: value })
                }
              />

              <Field
                label="O-Level button text"
                value={settings.oLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonText: value })
                }
              />

              <Field
                label="O-Level button link"
                value={settings.oLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, oLevelButtonLink: value })
                }
              />

              <Field
                label="A-Level button text"
                value={settings.aLevelButtonText || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonText: value })
                }
              />

              <Field
                label="A-Level button link"
                value={settings.aLevelButtonLink || ""}
                onChange={(value) =>
                  setSettings({ ...settings, aLevelButtonLink: value })
                }
              />

              <Field
                label="Academic Life small heading"
                value={settings.academicLifeEyebrow || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeEyebrow: value })
                }
              />

              <Field
                label="Academic Life title"
                value={settings.academicLifeTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, academicLifeTitle: value })
                }
              />

              <TextArea
                label="Academic Life description"
                value={settings.academicLifeDescription || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    academicLifeDescription: value
                  })
                }
              />

              <Field
                label="Departments panel title"
                value={settings.departmentsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, departmentsTitle: value })
                }
              />

              <Field
                label="Subjects panel title"
                value={settings.subjectsTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, subjectsTitle: value })
                }
              />

              <Field
                label="Performance panel title"
                value={settings.performanceTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, performanceTitle: value })
                }
              />

              <Field
                label="Calendar panel title"
                value={settings.calendarTitle || ""}
                onChange={(value) =>
                  setSettings({ ...settings, calendarTitle: value })
                }
              />

            </div>
          </div>
<Field
            label="O-Level title"
            value={settings.oLevelTitle}
            onChange={(value) => setSettings({ ...settings, oLevelTitle: value })}
          />
          <Field
            label="A-Level title"
            value={settings.aLevelTitle}
            onChange={(value) => setSettings({ ...settings, aLevelTitle: value })}
          />

          <TextArea
            label="O-Level description"
            value={settings.oLevelDescription}
            onChange={(value) =>
              setSettings({ ...settings, oLevelDescription: value })
            }
          />
          <TextArea
            label="A-Level description"
            value={settings.aLevelDescription}
            onChange={(value) =>
              setSettings({ ...settings, aLevelDescription: value })
            }
          />

          <TextArea
            label="O-Level subjects (one per line)"
            value={settings.oLevelItems}
            onChange={(value) => setSettings({ ...settings, oLevelItems: value })}
          />

          <div className="space-y-5">
            <Field
              label="A-Level sciences"
              value={settings.aLevelSciences}
              onChange={(value) =>
                setSettings({ ...settings, aLevelSciences: value })
              }
            />
            <Field
              label="A-Level arts"
              value={settings.aLevelArts}
              onChange={(value) =>
                setSettings({ ...settings, aLevelArts: value })
              }
            />
            <Field
              label="A-Level subsidiaries"
              value={settings.aLevelSubsidiaries}
              onChange={(value) =>
                setSettings({ ...settings, aLevelSubsidiaries: value })
              }
            />
          </div>

          <TextArea
            label="Departments text"
            value={settings.departmentsText}
            onChange={(value) =>
              setSettings({ ...settings, departmentsText: value })
            }
          />
          <TextArea
            label="Subjects text"
            value={settings.subjectsText}
            onChange={(value) =>
              setSettings({ ...settings, subjectsText: value })
            }
          />
          <TextArea
            label="Performance text"
            value={settings.performanceText}
            onChange={(value) =>
              setSettings({ ...settings, performanceText: value })
            }
          />
          <TextArea
            label="Calendar text"
            value={settings.calendarText}
            onChange={(value) =>
              setSettings({ ...settings, calendarText: value })
            }
          />
        </div>
      </form>

      <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={saveItem}
          className="h-fit rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-extrabold text-blue-950">
            {editingId ? "Edit Academic Life Item" : "Add Academic Life Item"}
          </h2>

          <div className="mt-5 space-y-5">
            <Field
              label="Title"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
            />
            <TextArea
              label="Description"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
            />
            <Field
              label="Icon or emoji"
              value={form.icon}
              onChange={(value) => setForm({ ...form, icon: value })}
            />

            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-600">
                Image or video
              </p>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/ogg"
                onChange={(event) => uploadFile(event, "item")}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-2 text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-5 file:py-2.5 file:font-bold file:text-white hover:file:bg-blue-800"
              />
              {form.mediaUrl && (
                <div className="mt-4 overflow-hidden rounded-xl bg-black">
                  {form.mediaType === "video" ? (
                    <video
                      src={form.mediaUrl}
                      controls
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <img
                      src={form.mediaUrl}
                      alt="Preview"
                      className="h-52 w-full object-cover"
                    />
                  )}
                </div>
              )}
            </div>

            <Field
              label="Display order"
              value={String(form.displayOrder)}
              onChange={(value) =>
                setForm({ ...form, displayOrder: Number(value) })
              }
            />

            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  setForm({ ...form, isPublished: event.target.checked })
                }
              />
              Display publicly
            </label>

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full rounded-xl bg-green-600 px-5 py-3 font-extrabold text-white"
            >
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-extrabold text-blue-950">
              Academic Life Items
            </h2>
          </div>

          {items.length === 0 ? (
            <p className="p-10 text-center text-slate-500">
              No academic life items yet.
            </p>
          ) : (
            <div className="grid gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border shadow-sm"
                >
                  <div className="h-48 bg-slate-100">
                    {item.mediaType === "video" ? (
                      <video
                        src={item.mediaUrl}
                        muted
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="font-extrabold text-blue-950">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <button
                        onClick={() => editItem(item)}
                        className="rounded-lg bg-blue-700 py-2 text-xs font-bold text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          quickUpdate(item, {
                            isPublished: !item.isPublished,
                          })
                        }
                        className="rounded-lg border py-2 text-xs font-bold"
                      >
                        {item.isPublished ? "Hide" : "Show"}
                      </button>
                      <button
                        onClick={() => deleteItem(item)}
                        className="rounded-lg bg-red-600 py-2 text-xs font-bold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
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
      <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
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
      <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
        {label}
      </span>
      <textarea
        rows={5}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function Notice({
  type,
  text,
}: {
  type: "success" | "error";
  text: string;
}) {
  return (
    <div
      className={`mt-6 rounded-xl border p-4 font-semibold ${
        type === "success"
          ? "border-green-300 bg-green-50 text-green-800"
          : "border-red-300 bg-red-50 text-red-800"
      }`}
    >
      {text}
    </div>
  );
}
