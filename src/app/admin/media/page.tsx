"use client";

import { DragEvent, useEffect, useMemo, useRef, useState } from "react";

interface MediaAsset {
  id: number;
  name: string;
  url: string;
  kind: "image" | "video" | "document";
  size: number;
  category: string;
}

const categories = [
  "General", "Homepage", "Hero", "Leadership",
  "News", "Gallery", "Admissions", "Documents",
];

export default function MediaLibraryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("All");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAssets() {
    try {
      setLoading(true);
      const response = await fetch("/api/media", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load media.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  const shown = useMemo(() => {
    const query = search.toLowerCase().trim();
    return assets.filter((asset) =>
      (!query ||
        asset.name.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query)) &&
      (kind === "All" || asset.kind === kind)
    );
  }, [assets, search, kind]);

  const stats = useMemo(() => ({
    images: assets.filter((a) => a.kind === "image").length,
    videos: assets.filter((a) => a.kind === "video").length,
    documents: assets.filter((a) => a.kind === "document").length,
    size: assets.reduce((sum, a) => sum + a.size, 0),
  }), [assets]);

  function acceptFiles(list: FileList | null) {
    setFiles(Array.from(list || []).slice(0, 20));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    acceptFiles(event.dataTransfer.files);
  }

  async function upload() {
    if (!files.length) return setError("Select at least one file.");

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const form = new FormData();
      form.append("category", category);
      files.forEach((file) => form.append("files", file));

      const response = await fetch("/api/media", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFiles([]);
      setMessage(`${data.length} file(s) uploaded.`);
      await loadAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function saveSelected() {
    if (!selected) return;

    const response = await fetch(`/api/media/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected),
    });

    const data = await response.json();

    if (!response.ok) return setError(data.message || "Update failed.");

    setSelected(data);
    setMessage("Media details updated.");
    await loadAssets();
  }

  async function remove(asset: MediaAsset) {
    if (!confirm(`Delete "${asset.name}"? Do not delete media currently used on the website.`)) {
      return;
    }

    const response = await fetch(`/api/media/${asset.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) return setError(data.message || "Delete failed.");

    if (selected?.id === asset.id) setSelected(null);
    setMessage("Media deleted.");
    await loadAssets();
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("Media URL copied.");
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <header className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Media Library
        </h1>
        <p className="mt-3 text-slate-200">
          Upload and organize website images, videos and documents.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Images" value={stats.images} />
        <Stat label="Videos" value={stats.videos} />
        <Stat label="Documents" value={stats.documents} />
        <Stat label="Storage" value={formatBytes(stats.size)} />
      </div>

      {message && <Notice type="success" text={message} />}
      {error && <Notice type="error" text={error} />}

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-blue-950">Upload Media</h2>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_240px]">
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-blue-500"
          >
            <div className="text-4xl">⬆</div>
            <p className="mt-3 font-extrabold text-blue-950">
              Drop files here or click to browse
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Maximum 20 files, 10 MB each
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm,video/ogg,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={(event) => acceptFiles(event.target.files)}
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            >
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                Selected files
              </p>
              <p className="mt-2 text-3xl font-extrabold text-blue-950">
                {files.length}
              </p>
            </div>

            <button
              type="button"
              onClick={upload}
              disabled={uploading || !files.length}
              className="w-full rounded-xl bg-green-600 px-5 py-3 font-extrabold text-white disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="grid gap-3 border-b p-6 lg:grid-cols-[1fr_180px]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search media..."
            className="rounded-xl border px-4 py-3"
          />
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            className="rounded-xl border px-4 py-3"
          >
            <option>All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
        </div>

        {loading ? (
          <p className="p-8 text-slate-500">Loading media...</p>
        ) : shown.length === 0 ? (
          <p className="p-12 text-center text-slate-500">No media found.</p>
        ) : (
          <div className="grid gap-6 p-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {shown.map((asset) => (
              <article key={asset.id} className="overflow-hidden rounded-2xl border shadow-sm">
                <button
                  type="button"
                  onClick={() => setSelected(asset)}
                  className="h-48 w-full bg-slate-100"
                >
                  {asset.kind === "image" ? (
                    <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                  ) : asset.kind === "video" ? (
                    <video src={asset.url} muted className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">📄</div>
                  )}
                </button>

                <div className="p-4">
                  <p className="truncate font-extrabold text-blue-950">{asset.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {asset.category} · {formatBytes(asset.size)}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button onClick={() => setSelected(asset)} className="rounded-lg bg-blue-700 py-2 text-xs font-bold text-white">View</button>
                    <button onClick={() => copyUrl(asset.url)} className="rounded-lg border py-2 text-xs font-bold">Copy URL</button>
                    <button onClick={() => remove(asset)} className="rounded-lg bg-red-600 py-2 text-xs font-bold text-white">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
            <div className="flex justify-between gap-4">
              <h2 className="text-xl font-extrabold text-blue-950">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="rounded-lg bg-slate-100 px-4 py-2 font-bold">Close</button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl bg-slate-100">
              {selected.kind === "image" ? (
                <img src={selected.url} alt={selected.name} className="max-h-96 w-full object-contain" />
              ) : selected.kind === "video" ? (
                <video src={selected.url} controls className="max-h-96 w-full" />
              ) : (
                <a href={selected.url} target="_blank" className="flex min-h-52 items-center justify-center text-lg font-bold text-blue-700">
                  Open Document
                </a>
              )}
            </div>

            <input
              value={selected.name}
              onChange={(event) => setSelected({ ...selected, name: event.target.value })}
              className="mt-5 w-full rounded-xl border px-4 py-3"
            />

            <select
              value={selected.category}
              onChange={(event) => setSelected({ ...selected, category: event.target.value })}
              className="mt-4 w-full rounded-xl border px-4 py-3"
            >
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button onClick={saveSelected} className="rounded-xl bg-green-600 px-4 py-3 font-bold text-white">Save</button>
              <button onClick={() => copyUrl(selected.url)} className="rounded-xl bg-blue-700 px-4 py-3 font-bold text-white">Copy URL</button>
              <button onClick={() => remove(selected)} className="rounded-xl bg-red-600 px-4 py-3 font-bold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-blue-950">{value}</p>
    </div>
  );
}

function Notice({ type, text }: { type: "success" | "error"; text: string }) {
  return (
    <div className={`mt-6 rounded-xl border p-4 font-semibold ${
      type === "success"
        ? "border-green-300 bg-green-50 text-green-800"
        : "border-red-300 bg-red-50 text-red-800"
    }`}>
      {text}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}
