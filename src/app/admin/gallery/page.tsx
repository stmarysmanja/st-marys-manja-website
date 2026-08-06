"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  category: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  displayOrder: number;
  isPublished: boolean;
}

interface GalleryForm {
  title: string;
  description: string;
  category: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  displayOrder: number;
  isPublished: boolean;
}

const emptyForm: GalleryForm = {
  title: "",
  description: "",
  category: "General",
  mediaUrl: "",
  mediaType: "image",
  displayOrder: 0,
  isPublished: true,
};

export default function GalleryManagementPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/gallery-items", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load gallery items.");
      }

      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load gallery items."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    );

    return ["All", ...values];
  }, [items]);

  const visibleItems = useMemo(() => {
    if (filter === "All") {
      return items;
    }

    return items.filter((item) => item.category === filter);
  }, [filter, items]);

  function updateField<K extends keyof GalleryForm>(
    field: K,
    value: GalleryForm[K]
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

  function editItem(item: GalleryItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || "",
      category: item.category,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      displayOrder: item.displayOrder,
      isPublished: item.isPublished,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadMedia(event: ChangeEvent<HTMLInputElement>) {
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

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Media upload failed.");
      }

      setForm((current) => ({
        ...current,
        mediaUrl: data.url,
        mediaType: data.mediaType === "video" ? "video" : "image",
      }));

      setMessage("Media uploaded. Save the gallery item to publish it.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Media upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        editingId ? `/api/gallery-items/${editingId}` : "/api/gallery-items",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save gallery item.");
      }

      setMessage(
        editingId
          ? "Gallery item updated successfully."
          : "Gallery item added successfully."
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save gallery item."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: GalleryItem) {
    const confirmed = window.confirm(
      `Delete "${item.title}" from the gallery?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/gallery-items/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete gallery item.");
      }

      if (editingId === item.id) {
        resetForm();
      }

      setMessage("Gallery item deleted successfully.");
      await loadItems();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete gallery item."
      );
    }
  }

  async function togglePublished(item: GalleryItem) {
    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/gallery-items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          isPublished: !item.isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update visibility.");
      }

      setMessage(
        data.isPublished
          ? "Gallery item is now visible."
          : "Gallery item is now hidden."
      );

      await loadItems();
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
          Gallery Management
        </h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Upload and organize school photographs and videos displayed on the public website.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={saveItem}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-blue-950">
              {editingId ? "Edit Gallery Item" : "Add Gallery Item"}
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
              label="Title"
              value={form.title}
              required
              placeholder="Science fair 2026"
              onChange={(value) => updateField("title", value)}
            />

            <Field
              label="Category"
              value={form.category}
              required
              placeholder="Sports, Academics, Trips..."
              onChange={(value) => updateField("category", value)}
            />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Upload image or video
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                  disabled={uploading}
                  onChange={uploadMedia}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-blue-800"
                />
              </label>

              <p className="mt-2 text-xs text-slate-500">
                Images and short videos are supported.
              </p>

              {uploading && (
                <p className="mt-2 text-sm font-semibold text-blue-700">
                  Uploading media...
                </p>
              )}

              {form.mediaUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-black">
                  {form.mediaType === "video" ? (
                    <video
                      src={form.mediaUrl}
                      controls
                      muted
                      loop
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <img
                      src={form.mediaUrl}
                      alt="Gallery preview"
                      className="h-56 w-full object-cover"
                    />
                  )}
                </div>
              )}
            </div>

            <Field
              label="Media path"
              value={form.mediaUrl}
              required
              placeholder="/uploads/media-file.jpg"
              onChange={(value) => updateField("mediaUrl", value)}
            />

            <TextArea
              label="Description"
              value={form.description}
              rows={4}
              onChange={(value) => updateField("description", value)}
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
                  ? "Update Gallery Item"
                  : "Add Gallery Item"}
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
            <div className="border-b border-slate-200 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-blue-950">
                    Gallery Items
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {items.length} item{items.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setFilter(category)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                        filter === category
                          ? "bg-blue-700 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <p className="p-8 font-semibold text-slate-500">
                Loading gallery items...
              </p>
            ) : visibleItems.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-xl font-extrabold text-blue-950">
                  No gallery items found
                </h3>
                <p className="mt-2 text-slate-600">
                  Upload the first image or video using the form.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 p-6 md:grid-cols-2 2xl:grid-cols-3">
                {visibleItems.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-52 bg-slate-200">
                      {item.mediaType === "video" ? (
                        <video
                          src={item.mediaUrl}
                          controls
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

                      <span
                        className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                          item.isPublished
                            ? "bg-green-600 text-white"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Hidden"}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                        {item.category}
                      </p>
                      <h3 className="mt-2 text-lg font-extrabold text-blue-950">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        Display order: {item.displayOrder}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => editItem(item)}
                          className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => togglePublished(item)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          {item.isPublished ? "Hide" : "Publish"}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
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
        className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 leading-7 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
