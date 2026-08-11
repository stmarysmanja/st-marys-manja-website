"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

interface BoardGovernor {
  id: number;
  name: string;
  position: string;
  photoUrl: string | null;
  description: string | null;
  displayOrder: number;
  isPublished: boolean;
}

interface FormState {
  name: string;
  position: string;
  photoUrl: string;
  description: string;
  displayOrder: number;
  isPublished: boolean;
}

const emptyForm: FormState = {
  name: "",
  position: "",
  photoUrl: "",
  description: "",
  displayOrder: 0,
  isPublished: true,
};

export default function BoardGovernorsAdminPage() {
  const [members, setMembers] = useState<BoardGovernor[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/board-governors?admin=1",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load Board of Governors members."
        );
      }

      setMembers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Board of Governors members."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  function startEdit(member: BoardGovernor) {
    setEditingId(member.id);

    setForm({
      name: member.name,
      position: member.position,
      photoUrl: member.photoUrl || "",
      description: member.description || "",
      displayOrder: member.displayOrder,
      isPublished: member.isPublished,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function uploadPhoto(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to upload photo."
        );
      }

      setForm((current) => ({
        ...current,
        photoUrl: data.url,
      }));

      setMessage("Photo uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload photo."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveMember(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name.trim() || !form.position.trim()) {
      setError("Name and position are required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        editingId
          ? `/api/board-governors/${editingId}`
          : "/api/board-governors",
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
        throw new Error(
          data.message ||
            "Unable to save Board of Governors member."
        );
      }

      setMessage(
        editingId
          ? "Board member updated successfully."
          : "Board member added successfully."
      );

      setEditingId(null);
      setForm(emptyForm);

      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save Board of Governors member."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(member: BoardGovernor) {
    const confirmed = window.confirm(
      `Delete ${member.name}?`
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `/api/board-governors/${member.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete Board member."
        );
      }

      setMessage("Board member deleted.");
      await loadMembers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete Board member."
      );
    }
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          About Our School
        </p>

        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Board of Governors
        </h1>

        <p className="mt-3 max-w-3xl text-slate-200">
          Add and manage the Chairperson, Deputy Chairperson
          and other members of the Board of Governors.
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
        onSubmit={saveMember}
        className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              {editingId ? "Editing Member" : "New Member"}
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-blue-950">
              {editingId
                ? "Update Board Member"
                : "Add Board Member"}
            </h2>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Field
            label="Member Name"
            value={form.name}
            placeholder="e.g. Mr. John Doe"
            onChange={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />

          <Field
            label="Position"
            value={form.position}
            placeholder="e.g. Chairperson, Board of Governors"
            onChange={(value) =>
              setForm({
                ...form,
                position: value,
              })
            }
          />

          <div className="lg:col-span-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
                Member Photo
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={uploadPhoto}
                disabled={uploading}
                className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
              />

              <p className="mt-2 text-xs text-slate-500">
                {uploading
                  ? "Uploading photo..."
                  : "Recommended: clear portrait photograph."}
              </p>
            </label>
          </div>

          {form.photoUrl && (
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                <img
                  src={form.photoUrl}
                  alt="Board member preview"
                  className="h-40 w-32 rounded-2xl object-cover shadow"
                />

                <div>
                  <p className="font-bold text-blue-950">
                    Photo Preview
                  </p>

                  <p className="mt-2 break-all text-xs text-slate-500">
                    {form.photoUrl}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        photoUrl: "",
                      })
                    }
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="lg:col-span-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
                Short Profile / Description
              </span>

              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    description: event.target.value,
                  })
                }
                placeholder="Optional short information about this Board member."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
              Display Order
            </span>

            <input
              type="number"
              min="0"
              value={form.displayOrder}
              onChange={(event) =>
                setForm({
                  ...form,
                  displayOrder:
                    Number(event.target.value) || 0,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <p className="mt-2 text-xs text-slate-500">
              Use 1 for Chairperson, 2 for Deputy, 3 onward
              for other members.
            </p>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                setForm({
                  ...form,
                  isPublished: event.target.checked,
                })
              }
              className="h-5 w-5"
            />

            <div>
              <p className="font-bold text-blue-950">
                Published
              </p>

              <p className="text-xs text-slate-500">
                Show this member on the public About page.
              </p>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="mt-8 rounded-xl bg-green-600 px-7 py-3.5 font-extrabold text-white shadow hover:bg-green-700 disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : editingId
              ? "Update Board Member"
              : "Add Board Member"}
        </button>
      </form>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Current Members
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-blue-950">
            Board Members
          </h2>
        </div>

        {loading ? (
          <p className="mt-6 text-slate-500">
            Loading Board members...
          </p>
        ) : members.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center text-slate-500">
            No Board members have been added yet.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-64 bg-slate-100">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-blue-950 text-3xl font-black text-white">
                      SM
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-blue-950">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-blue-600">
                        {member.position}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        member.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {member.isPublished
                        ? "Published"
                        : "Hidden"}
                    </span>
                  </div>

                  {member.description && (
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {member.description}
                    </p>
                  )}

                  <p className="mt-4 text-xs font-semibold text-slate-400">
                    Display order: {member.displayOrder}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(member)}
                      className="flex-1 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteMember(member)}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white"
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
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
      />
    </label>
  );
}
