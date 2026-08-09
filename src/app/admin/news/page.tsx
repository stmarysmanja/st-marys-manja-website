"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";


interface NewsSettings {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyText: string;
  pinnedLabel: string;
  readMoreText: string;
  backText: string;
}
interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  featuredMediaUrl: string | null;
  featuredMediaType: "image" | "video";
  youtubeUrl: string | null;
  isPublished: boolean;
  isPinned: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface NewsForm {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  featuredMediaUrl: string;
  featuredMediaType: "image" | "video";
  youtubeUrl: string;
  isPublished: boolean;
  isPinned: boolean;
}

const emptyForm: NewsForm = {
  title: "",
  summary: "",
  content: "",
  category: "General",
  author: "School Administration",
  featuredMediaUrl: "",
  featuredMediaType: "image",
  youtubeUrl: "",
  isPublished: true,
  isPinned: false,
};

const defaultCategories = [
  "General",
  "Academics",
  "Sports",
  "Announcements",
  "Events",
  "Examinations",
  "Clubs",
  "Achievements",
];

export default function NewsManagementPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [newsSettings, setNewsSettings] =
    useState<NewsSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/news-articles?admin=1", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load news articles.");
      }

      setArticles(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load news articles."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);


  const loadNewsSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/news-settings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load News page settings."
        );
      }

      setNewsSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load News page settings."
      );
    }
  }, []);

  useEffect(() => {
    loadNewsSettings();
  }, [loadNewsSettings]);

  async function saveNewsSettings(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!newsSettings) return;

    try {
      setSavingSettings(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/news-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save News page settings."
        );
      }

      setNewsSettings(data);
      setMessage("News page settings saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save News page settings."
      );
    } finally {
      setSavingSettings(false);
    }
  }
  const categories = useMemo(() => {
    const used = articles.map((article) => article.category);
    return ["All", ...Array.from(new Set([...defaultCategories, ...used]))];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && article.isPublished) ||
        (statusFilter === "Draft" && !article.isPublished) ||
        (statusFilter === "Pinned" && article.isPinned);

      const matchesCategory =
        categoryFilter === "All" ||
        article.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, search, statusFilter, categoryFilter]);

  const counts = useMemo(
    () => ({
      total: articles.length,
      published: articles.filter((article) => article.isPublished).length,
      drafts: articles.filter((article) => !article.isPublished).length,
      pinned: articles.filter((article) => article.isPinned).length,
    }),
    [articles]
  );

  function updateField<K extends keyof NewsForm>(
    field: K,
    value: NewsForm[K]
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

  function editArticle(article: NewsArticle) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      author: article.author,
      featuredMediaUrl: article.featuredMediaUrl || "",
      featuredMediaType: article.featuredMediaType,
      youtubeUrl: article.youtubeUrl || "",
      isPublished: article.isPublished,
      isPinned: article.isPinned,
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadFeaturedMedia(
    event: ChangeEvent<HTMLInputElement>
  ) {
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
        featuredMediaUrl: data.url,
        featuredMediaType:
          data.mediaType === "video" ? "video" : "image",
      }));

      setMessage("Featured media uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Media upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        editingId
          ? `/api/news-articles/${editingId}`
          : "/api/news-articles",
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
        throw new Error(data.message || "Unable to save article.");
      }

      setMessage(
        editingId
          ? "News article updated successfully."
          : "News article created successfully."
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadArticles();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save article."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(article: NewsArticle) {
    if (!window.confirm(`Delete "${article.title}"?`)) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/news-articles/${article.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete article.");
      }

      if (editingId === article.id) {
        resetForm();
      }

      setMessage("News article deleted successfully.");
      await loadArticles();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete article."
      );
    }
  }

  async function quickUpdate(
    article: NewsArticle,
    changes: Partial<NewsArticle>
  ) {
    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/news-articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...article,
          ...changes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update article.");
      }

      setMessage("Article updated successfully.");
      await loadArticles();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update article."
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
          News Management
        </h1>

        <p className="mt-3 max-w-2xl text-slate-200">
          Create, edit, publish and organize news from one place.
        </p>
      </div>


      {newsSettings && (
        <form
          onSubmit={saveNewsSettings}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Public Website
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-blue-950">
                News Public Page Content
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Edit the public News page headings, labels and messages.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="rounded-xl bg-green-600 px-6 py-3 font-extrabold text-white disabled:opacity-60"
            >
              {savingSettings ? "Saving..." : "Save News Page"}
            </button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Field
              label="Small heading"
              value={newsSettings.eyebrow}
              onChange={(value) =>
                setNewsSettings({
                  ...newsSettings,
                  eyebrow: value,
                })
              }
            />

            <Field
              label="Main heading"
              value={newsSettings.title}
              onChange={(value) =>
                setNewsSettings({
                  ...newsSettings,
                  title: value,
                })
              }
            />

            <div className="lg:col-span-2">
              <TextArea
                label="News page description"
                value={newsSettings.description}
                rows={4}
                onChange={(value) =>
                  setNewsSettings({
                    ...newsSettings,
                    description: value,
                  })
                }
              />
            </div>

            <Field
              label="Empty News title"
              value={newsSettings.emptyTitle}
              onChange={(value) =>
                setNewsSettings({
                  ...newsSettings,
                  emptyTitle: value,
                })
              }
            />

            <div className="lg:col-span-2">
              <TextArea
                label="Empty News message"
                value={newsSettings.emptyText}
                rows={3}
                onChange={(value) =>
                  setNewsSettings({
                    ...newsSettings,
                    emptyText: value,
                  })
                }
              />
            </div>

            <Field
              label="Pinned label"
              value={newsSettings.pinnedLabel}
              onChange={(value) =>
                setNewsSettings({
                  ...newsSettings,
                  pinnedLabel: value,
                })
              }
            />

            <Field
              label="Read more button text"
              value={newsSettings.readMoreText}
              onChange={(value) =>
                setNewsSettings({
                  ...newsSettings,
                  readMoreText: value,
                })
              }
            />

            <Field
              label="Back to News text"
              value={newsSettings.backText}
              onChange={(value) =>
                setNewsSettings({
                  ...newsSettings,
                  backText: value,
                })
              }
            />
          </div>
        </form>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Articles" value={counts.total} />
        <StatCard label="Published" value={counts.published} />
        <StatCard label="Drafts" value={counts.drafts} />
        <StatCard label="Pinned" value={counts.pinned} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[460px_1fr]">
        <form
          onSubmit={saveArticle}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-extrabold text-blue-950">
              {editingId ? "Edit Article" : "Create Article"}
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
              label="Headline"
              value={form.title}
              required
              onChange={(value) => updateField("title", value)}
            />

            <TextArea
              label="Short summary"
              value={form.summary}
              required
              rows={3}
              onChange={(value) => updateField("summary", value)}
            />

            <TextArea
              label="Full article"
              value={form.content}
              required
              rows={12}
              onChange={(value) => updateField("content", value)}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Category"
                value={form.category}
                required
                onChange={(value) => updateField("category", value)}
              />

              <Field
                label="Author"
                value={form.author}
                required
                onChange={(value) => updateField("author", value)}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Upload featured image or video
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/ogg"
                  disabled={uploading}
                  onChange={uploadFeaturedMedia}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:font-bold file:text-white"
                />
              </label>

              {uploading && (
                <p className="mt-2 text-sm font-semibold text-blue-700">
                  Uploading media...
                </p>
              )}

              {form.featuredMediaUrl && (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-black">
                  {form.featuredMediaType === "video" ? (
                    <video
                      src={form.featuredMediaUrl}
                      controls
                      muted
                      className="h-56 w-full object-cover"
                    />
                  ) : (
                    <img
                      src={form.featuredMediaUrl}
                      alt="Featured preview"
                      className="h-56 w-full object-cover"
                    />
                  )}
                </div>
              )}
            </div>

            <Field
              label="Featured media path"
              value={form.featuredMediaUrl}
              onChange={(value) =>
                updateField("featuredMediaUrl", value)
              }
            />

            <Field
              label="YouTube video URL (optional)"
              value={form.youtubeUrl}
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={(value) => updateField("youtubeUrl", value)}
            />

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
                Publish this article
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(event) =>
                  updateField("isPinned", event.target.checked)
                }
                className="h-5 w-5"
              />
              <span className="font-bold text-slate-700">
                Pin to the top
              </span>
            </label>

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full rounded-xl bg-green-600 px-5 py-3.5 font-extrabold text-white shadow-lg transition hover:bg-green-700 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Article"
                  : "Create Article"}
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
            <div className="space-y-4 border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-extrabold text-blue-950">
                  All Articles
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, filter and manage published news and drafts.
                </p>
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                >
                  <option>All</option>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Pinned</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                  className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <p className="p-8 font-semibold text-slate-500">
                Loading news articles...
              </p>
            ) : filteredArticles.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-xl font-extrabold text-blue-950">
                  No articles found
                </h3>
                <p className="mt-2 text-slate-600">
                  Create the first news article using the editor.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col gap-5 p-5 hover:bg-slate-50 md:flex-row"
                  >
                    <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-slate-200 md:w-44">
                      {article.featuredMediaUrl ? (
                        article.featuredMediaType === "video" ? (
                          <video
                            src={article.featuredMediaUrl}
                            muted
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={article.featuredMediaUrl}
                            alt={article.title}
                            className="h-full w-full object-cover"
                          />
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                          No media
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {article.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            article.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {article.isPublished ? "Published" : "Draft"}
                        </span>

                        {article.isPinned && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            Pinned
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-lg font-extrabold text-blue-950">
                        {article.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {article.summary}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        {article.author} Â·{" "}
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:w-36 md:flex-col">
                      <button
                        type="button"
                        onClick={() => editArticle(article)}
                        className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          quickUpdate(article, {
                            isPublished: !article.isPublished,
                          })
                        }
                        className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        {article.isPublished ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          quickUpdate(article, {
                            isPinned: !article.isPinned,
                          })
                        }
                        className="rounded-lg border border-amber-300 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"
                      >
                        {article.isPinned ? "Unpin" : "Pin"}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteArticle(article)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-blue-950">
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
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

function TextArea({
  label,
  value,
  rows,
  required = false,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  required?: boolean;
  onChange: (value: string) => void;
}) {
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
