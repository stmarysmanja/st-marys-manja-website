"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "New" | "Read" | "Handled";
  createdAt: string;
}

const emptySettings: ContactSettings = {
  location: "",
  phones: [""],
  emails: [""],
  weekdays: "",
  saturday: "",
  sunday: "",
  visitText: "",
  directionsText: "",
  whatsappNumber: "",
  mapUrl: "",
};

export default function ContactManagementPage() {
  const [settings, setSettings] = useState<ContactSettings>(emptySettings);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [settingsResponse, messagesResponse] = await Promise.all([
        fetch("/api/contact-settings", { cache: "no-store" }),
        fetch("/api/contact-messages", { cache: "no-store" }),
      ]);

      const settingsData = await settingsResponse.json();
      const messagesData = await messagesResponse.json();

      if (!settingsResponse.ok) {
        throw new Error(settingsData.message || "Unable to load settings.");
      }

      if (!messagesResponse.ok) {
        throw new Error(messagesData.message || "Unable to load messages.");
      }

      setSettings(settingsData);
      setMessages(messagesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const counts = useMemo(
    () => ({
      total: messages.length,
      New: messages.filter((item) => item.status === "New").length,
      Read: messages.filter((item) => item.status === "Read").length,
      Handled: messages.filter((item) => item.status === "Handled").length,
    }),
    [messages]
  );

  async function saveSettings() {
    try {
      setSaving(true);
      setNotice("");
      setError("");

      const response = await fetch("/api/contact-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          phones: settings.phones.filter((item) => item.trim()),
          emails: settings.emails.filter((item) => item.trim()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save contact settings.");
      }

      setSettings(data);
      setNotice("Contact settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    item: ContactMessage,
    status: ContactMessage["status"]
  ) {
    try {
      setNotice("");
      setError("");

      const response = await fetch(`/api/contact-messages/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update message.");
      }

      setSelected(data);
      setNotice(`Message marked as ${status}.`);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update message."
      );
    }
  }

  async function deleteMessage(item: ContactMessage) {
    if (!window.confirm(`Delete message from ${item.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/contact-messages/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete message.");
      }

      if (selected?.id === item.id) {
        setSelected(null);
      }

      setNotice("Message deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete message."
      );
    }
  }

  function updateList(
    field: "phones" | "emails",
    index: number,
    value: string
  ) {
    setSettings((current) => {
      const updated = [...current[field]];
      updated[index] = value;
      return { ...current, [field]: updated };
    });
  }

  function addListItem(field: "phones" | "emails") {
    setSettings((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  }

  function removeListItem(field: "phones" | "emails", index: number) {
    setSettings((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Contact Management
        </h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Update public contact information and manage website enquiries.
        </p>
      </div>

      {notice && (
        <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-8 font-semibold text-slate-500">Loading contact data...</p>
      ) : (
        <>
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-blue-950">
                  Contact Settings
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  These details appear on the public Contact Us page.
                </p>
              </div>

              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="rounded-xl bg-green-600 px-6 py-3 font-extrabold text-white shadow hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Field
                label="School location"
                value={settings.location}
                onChange={(value) =>
                  setSettings({ ...settings, location: value })
                }
              />

              <Field
                label="WhatsApp number"
                value={settings.whatsappNumber}
                onChange={(value) =>
                  setSettings({ ...settings, whatsappNumber: value })
                }
              />

              <ListEditor
                label="Phone numbers"
                values={settings.phones}
                onChange={(index, value) => updateList("phones", index, value)}
                onAdd={() => addListItem("phones")}
                onRemove={(index) => removeListItem("phones", index)}
              />

              <ListEditor
                label="Email addresses"
                values={settings.emails}
                onChange={(index, value) => updateList("emails", index, value)}
                onAdd={() => addListItem("emails")}
                onRemove={(index) => removeListItem("emails", index)}
              />

              <Field
                label="Weekday office hours"
                value={settings.weekdays}
                onChange={(value) =>
                  setSettings({ ...settings, weekdays: value })
                }
              />

              <Field
                label="Saturday office hours"
                value={settings.saturday}
                onChange={(value) =>
                  setSettings({ ...settings, saturday: value })
                }
              />

              <Field
                label="Sunday office hours"
                value={settings.sunday}
                onChange={(value) =>
                  setSettings({ ...settings, sunday: value })
                }
              />

              <TextArea
                label="Visit our school text"
                value={settings.visitText}
                onChange={(value) =>
                  setSettings({ ...settings, visitText: value })
                }
              />

              <TextArea
                label="Directions text"
                value={settings.directionsText}
                onChange={(value) =>
                  setSettings({ ...settings, directionsText: value })
                }
              />

              <TextArea
                label="Google Maps embed URL"
                value={settings.mapUrl}
                onChange={(value) =>
                  setSettings({ ...settings, mapUrl: value })
                }
              />
            </div>
          </section>

          <section className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Total messages" value={counts.total} />
              <Stat label="New" value={counts.New} />
              <Stat label="Read" value={counts.Read} />
              <Stat label="Handled" value={counts.Handled} />
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h2 className="text-xl font-extrabold text-blue-950">
                  Contact Messages
                </h2>
              </div>

              {messages.length === 0 ? (
                <div className="p-10 text-center">
                  <h3 className="text-xl font-extrabold text-blue-950">
                    No contact messages
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Messages submitted from the public website will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {messages.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 p-5 hover:bg-slate-50 md:flex-row md:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-blue-950">
                            {item.subject}
                          </h3>
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {item.name} · {item.email}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {item.message}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMessage(item)}
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
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Contact message
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-blue-950">
                  {selected.subject}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
                <Info label="Name" value={selected.name} />
                <Info label="Email" value={selected.email} />
                <Info label="Phone" value={selected.phone || "Not provided"} />
                <Info
                  label="Received"
                  value={new Date(selected.createdAt).toLocaleString()}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Message
                </p>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
                  {selected.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["New", "Read", "Handled"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(selected, status)}
                    className={`rounded-xl px-4 py-3 text-sm font-bold ${
                      selected.status === status
                        ? "bg-blue-700 text-white"
                        : "border border-slate-300 text-slate-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(
                  selected.subject
                )}`}
                className="inline-flex rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
              >
                Reply by Email
              </a>
            </div>
          </div>
        </div>
      )}
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

function ListEditor({
  label,
  values,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  values: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
          {label}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs font-bold text-blue-700"
        >
          + Add
        </button>
      </div>

      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={value}
              onChange={(event) => onChange(index, event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="rounded-xl bg-red-100 px-4 font-bold text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-blue-950">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}
