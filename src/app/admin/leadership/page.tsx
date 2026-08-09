"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";


interface LeadershipSettings {
  eyebrow: string;
  title: string;
  description: string;
  emptyText: string;
}
interface LeadershipMember {
  id: number;
  name: string;
  role: string;
  title: string | null;
  photo: string | null;
  theme: string | null;
  message: string;
  displayOrder: number;
  isPublished: boolean;
}

interface LeadershipForm {
  name: string;
  role: string;
  title: string;
  photo: string;
  theme: string;
  message: string;
  displayOrder: number;
  isPublished: boolean;
}

const emptyForm: LeadershipForm = {
  name: "",
  role: "",
  title: "",
  photo: "",
  theme: "",
  message: "",
  displayOrder: 0,
  isPublished: true,
};

export default function LeadershipManagementPage() {
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);
  const [leadershipSettings, setLeadershipSettings] =
    useState<LeadershipSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [form, setForm] = useState<LeadershipForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLeaders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/leadership", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load leadership members.");
      }

      setLeaders(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load leadership members."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaders();
  }, [loadLeaders]);


  const loadLeadershipSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/leadership-settings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load leadership page settings."
        );
      }

      setLeadershipSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load leadership page settings."
      );
    }
  }, []);

  useEffect(() => {
    loadLeadershipSettings();
  }, [loadLeadershipSettings]);

  async function saveLeadershipSettings(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!leadershipSettings) return;

    try {
      setSavingSettings(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/leadership-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadershipSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save leadership page settings."
        );
      }

      setLeadershipSettings(data);
      setMessage("Leadership page settings saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save leadership page settings."
      );
    } finally {
      setSavingSettings(false);
    }
  }
  function updateField<K extends keyof LeadershipForm>(
    field: K,
    value: LeadershipForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  }

  function editLeader(leader: LeadershipMember) {
    setEditingId(leader.id);
    setForm({
      name: leader.name,
      role: leader.role,
      title: leader.title || "",
      photo: leader.photo || "",
      theme: leader.theme || "",
      message: leader.message,
      displayOrder: leader.displayOrder,
      isPublished: leader.isPublished,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Photo upload failed.");
      }

      if (data.mediaType !== "image") {
        throw new Error("Please select an image for a leadership photograph.");
      }

      updateField("photo", data.url);
      setMessage("Photo uploaded. Save the member to publish it.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveLeader(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const url = editingId
        ? `/api/leadership/${editingId}`
        : "/api/leadership";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save leadership member.");
      }

      setMessage(
        editingId
          ? "Leadership member updated successfully."
          : "Leadership member added successfully."
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadLeaders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save leadership member."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteLeader(leader: LeadershipMember) {
    const confirmed = window.confirm(
      `Delete ${leader.name} from the leadership section?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(`/api/leadership/${leader.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete leadership member.");
      }

      if (editingId === leader.id) {
        resetForm();
      }

      setMessage("Leadership member deleted successfully.");
      await loadLeaders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete leadership member."
      );
    }
  }

  async function togglePublished(leader: LeadershipMember) {
    try {
      setError("");
      setMessage("");

      const response = await fetch(`/api/leadership/${leader.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...leader,
          isPublished: !leader.isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update visibility.");
      }

      setMessage(
        data.isPublished
          ? "Leadership member is now visible."
          : "Leadership member is now hidden."
      );

      await loadLeaders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update visibility."
      );
    }
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Leadership Management
        </h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Add, edit, publish and organize the leaders displayed on the school website.
        </p>
      </div>


      {leadershipSettings && (
        <form
          onSubmit={saveLeadershipSettings}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Public Website
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-blue-950">
                Leadership Public Section Content
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Edit the heading and introduction shown above the leadership cards.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="rounded-xl bg-green-600 px-6 py-3 font-extrabold text-white disabled:opacity-60"
            >
              {savingSettings ? "Saving..." : "Save Leadership Section"}
            </button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Field
              label="Small heading"
              value={leadershipSettings.eyebrow}
              onChange={(value) =>
                setLeadershipSettings({
                  ...leadershipSettings,
                  eyebrow: value,
                })
              }
            />

            <Field
              label="Main heading"
              value={leadershipSettings.title}
              onChange={(value) =>
                setLeadershipSettings({
                  ...leadershipSettings,
                  title: value,
                })
              }
            />

            <div className="lg:col-span-2">
              <TextArea
                label="Leadership description"
                value={leadershipSettings.description}
                rows={4}
                onChange={(value) =>
                  setLeadershipSettings({
                    ...leadershipSettings,
                    description: value,
                  })
                }
              />
            </div>

            <div className="lg:col-span-2">
              <TextArea
                label="Message when no leaders are published"
                value={leadershipSettings.emptyText}
                rows={3}
                onChange={(value) =>
                  setLeadershipSettings({
                    ...leadershipSettings,
                    emptyText: value,
                  })
                }
              />
            </div>
          </div>
        </form>
      )}
      <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={saveLeader}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-blue-950">
              {editingId ? "Edit Leader" : "Add Leader"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-bold text-slate-500 hover:text-blue-700"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="mt-5 space-y-5">
            <Field
              label="Official name"
              value={form.name}
              required
              onChange={(value) => updateField("name", value)}
            />

            <Field
              label="Position / role"
              value={form.role}
              required
              placeholder="Head Teacher"
              onChange={(value) => updateField("role", value)}
            />

            <Field
              label="Card heading (optional)"
              value={form.title}
              placeholder="Word From the Head Teacher"
              onChange={(value) => updateField("title", value)}
            />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Upload photograph
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={uploading}
                  onChange={uploadPhoto}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-blue-800"
                />
              </label>

              {uploading && (
                <p className="mt-2 text-sm font-semibold text-blue-700">
                  Uploading photograph...
                </p>
              )}

              {form.photo && (
                <div className="mt-4">
                  <img
                    src={form.photo}
                    alt="Leader preview"
                    className="h-44 w-36 rounded-xl object-cover shadow-md"
                  />
                </div>
              )}
            </div>

            <Field
              label="Photo path"
              value={form.photo}
              placeholder="/uploads/photo.jpg"
              onChange={(value) => updateField("photo", value)}
            />

            <Field
              label="Theme / quotation (optional)"
              value={form.theme}
              onChange={(value) => updateField("theme", value)}
            />

            <TextArea
              label="Message / biography"
              value={form.message}
              required
              rows={7}
              onChange={(value) => updateField("message", value)}
            />

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Display order
              </span>
              <input
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(event) =>
                  updateField("displayOrder", Number(event.target.value))
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  updateField("isPublished", event.target.checked)
                }
                className="h-5 w-5"
              />
              <span className="font-bold text-slate-700">
                Display on the public website
              </span>
            </label>

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full rounded-xl bg-green-600 px-5 py-3.5 font-extrabold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Leader"
                  : "Add Leader"}
            </button>
          </div>
        </form>

        <section>
          {message && (
            <div className="mb-5 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
              {error}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-blue-950">
                  Current Leaders
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {leaders.length} member{leaders.length === 1 ? "" : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={loadLeaders}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="p-8 font-semibold text-slate-500">
                Loading leadership members...
              </p>
            ) : leaders.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-xl font-extrabold text-blue-950">
                  No leaders added yet
                </h3>
                <p className="mt-2 text-slate-600">
                  Use the form to add the first leadership member.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {leaders.map((leader) => (
                  <article
                    key={leader.id}
                    className="flex flex-col gap-5 p-5 transition hover:bg-slate-50 md:flex-row md:items-center"
                  >
                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow">
                      {leader.photo ? (
                        <img
                          src={leader.photo}
                          alt={leader.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
                          No photo
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-extrabold text-blue-950">
                          {leader.name}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            leader.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {leader.isPublished ? "Published" : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-bold uppercase tracking-wide text-blue-600">
                        {leader.role}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {leader.message}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        Display order: {leader.displayOrder}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:w-36 md:flex-col">
                      <button
                        type="button"
                        onClick={() => editLeader(leader)}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePublished(leader)}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        {leader.isPublished ? "Hide" : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteLeader(leader)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

function Field({
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <input
        type="text"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  rows?: number;
  required?: boolean;
  onChange: (value: string) => void;
}

function TextArea({
  label,
  value,
  rows = 5,
  required = false,
  onChange,
}: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <textarea
        rows={rows}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 leading-7 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
