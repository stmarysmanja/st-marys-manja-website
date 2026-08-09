"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface AdmissionApplication {
  id: number;
  applicationNumber: string;
  studentName: string;
  gender: string;
  dob: string | null;
  applyingClass: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  previousSchool: string;
  pleResults: string | null;
  status: "New" | "Reviewed" | "Accepted" | "Rejected";
  createdAt: string;
}


interface AdmissionSettings {
  heroTitle: string;
  heroSubtitle: string;
  vacanciesTitle: string;
  vacanciesText: string;
  step1Title: string;
  step1Text: string;
  step2Title: string;
  step2Text: string;
  step3Title: string;
  step3Text: string;
  formTitle: string;
  formSubtitle: string;
  submitButtonText: string;
  successTitle: string;
  successText: string;
  documentsTitle: string;
  documentsItems: string;
  checklistTitle: string;
  checklistDescription: string;
  checklistButtonText: string;
  checklistUrl: string;
  classOptions: string;
}
const statuses = ["All", "New", "Reviewed", "Accepted", "Rejected"] as const;

export default function AdmissionsManagementPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [pageSettings, setPageSettings] = useState<AdmissionSettings | null>(null);
  const [savingPageSettings, setSavingPageSettings] = useState(false);
  const [selected, setSelected] = useState<AdmissionApplication | null>(null);
  const [filter, setFilter] = useState<(typeof statuses)[number]>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admissions", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load applications.");
      }

      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);


  const loadAdmissionPageSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/admission-settings", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load admission page settings.");
      }

      setPageSettings(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load admission page settings."
      );
    }
  }, []);

  useEffect(() => {
    loadAdmissionPageSettings();
  }, [loadAdmissionPageSettings]);

  async function saveAdmissionPageSettings(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!pageSettings) return;

    try {
      setSavingPageSettings(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/admission-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pageSettings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save admission page settings.");
      }

      setPageSettings(data);
      setMessage("Admissions page settings saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save admission page settings."
      );
    } finally {
      setSavingPageSettings(false);
    }
  }
  const counts = useMemo(() => {
    return {
      total: applications.length,
      New: applications.filter((item) => item.status === "New").length,
      Reviewed: applications.filter((item) => item.status === "Reviewed").length,
      Accepted: applications.filter((item) => item.status === "Accepted").length,
      Rejected: applications.filter((item) => item.status === "Rejected").length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        filter === "All" || application.status === filter;

      const matchesSearch =
        !normalizedSearch ||
        application.applicationNumber.toLowerCase().includes(normalizedSearch) ||
        application.studentName.toLowerCase().includes(normalizedSearch) ||
        application.parentName.toLowerCase().includes(normalizedSearch) ||
        application.parentPhone.toLowerCase().includes(normalizedSearch) ||
        application.applyingClass.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [applications, filter, search]);

  async function updateStatus(
    application: AdmissionApplication,
    status: AdmissionApplication["status"]
  ) {
    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/admissions/${application.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update status.");
      }

      setMessage(`Application marked as ${status}.`);
      setSelected(data);
      await loadApplications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update status."
      );
    }
  }

  async function deleteApplication(application: AdmissionApplication) {
    const confirmed = window.confirm(
      `Delete application ${application.applicationNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/admissions/${application.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete application.");
      }

      if (selected?.id === application.id) {
        setSelected(null);
      }

      setMessage("Application deleted successfully.");
      await loadApplications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete application."
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
          Admissions Management
        </h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Review online applications, update their status and contact parents or guardians.
        </p>
      </div>


      {pageSettings && (
        <form
          onSubmit={saveAdmissionPageSettings}
          className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Public Website
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-blue-950">
                Admissions Public Page Content
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Edit the content visitors see on the Admissions page.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingPageSettings}
              className="rounded-xl bg-green-600 px-6 py-3 font-extrabold text-white disabled:opacity-60"
            >
              {savingPageSettings ? "Saving..." : "Save Admissions Page"}
            </button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">

            {[
              ["Hero Title", "heroTitle"],
              ["Hero Subtitle", "heroSubtitle"],
              ["Vacancies Title", "vacanciesTitle"],
              ["Vacancies Text", "vacanciesText"],
              ["Step 1 Title", "step1Title"],
              ["Step 2 Title", "step2Title"],
              ["Step 3 Title", "step3Title"],
              ["Form Title", "formTitle"],
              ["Submit Button Text", "submitButtonText"],
              ["Success Title", "successTitle"],
              ["Documents Title", "documentsTitle"],
              ["Checklist Title", "checklistTitle"],
              ["Checklist Button Text", "checklistButtonText"],
              ["Checklist URL", "checklistUrl"],
            ].map(([label, key]) => (
              <label key={key} className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
                  {label}
                </span>

                <input
                  value={(pageSettings as any)[key] || ""}
                  onChange={(event) =>
                    setPageSettings({
                      ...pageSettings,
                      [key]: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                />
              </label>
            ))}

            {[
              ["Step 1 Description", "step1Text"],
              ["Step 2 Description", "step2Text"],
              ["Step 3 Description", "step3Text"],
              ["Form Subtitle", "formSubtitle"],
              ["Success Message", "successText"],
              ["Documents - one item per line", "documentsItems"],
              ["Checklist Description", "checklistDescription"],
              ["Classes - one class per line", "classOptions"],
            ].map(([label, key]) => (
              <label key={key} className="block lg:col-span-2">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
                  {label}
                </span>

                <textarea
                  rows={4}
                  value={(pageSettings as any)[key] || ""}
                  onChange={(event) =>
                    setPageSettings({
                      ...pageSettings,
                      [key]: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                />
              </label>
            ))}

          </div>
        </form>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total" value={counts.total} />
        <StatCard label="New" value={counts.New} />
        <StatCard label="Reviewed" value={counts.Reviewed} />
        <StatCard label="Accepted" value={counts.Accepted} />
        <StatCard label="Rejected" value={counts.Rejected} />
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

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-4 border-b border-slate-200 p-5 lg:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by student, parent, phone, class or reference..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  filter === status
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="p-8 font-semibold text-slate-500">
            Loading applications...
          </p>
        ) : filteredApplications.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-extrabold text-blue-950">
              No applications found
            </h2>
            <p className="mt-2 text-slate-600">
              New online applications will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Reference",
                    "Student",
                    "Class",
                    "Parent / Guardian",
                    "Submitted",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-extrabold text-blue-700">
                      {application.applicationNumber}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">
                        {application.studentName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {application.gender}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {application.applyingClass}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {application.parentName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {application.parentPhone}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(application)}
                          className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white hover:bg-blue-800"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteApplication(application)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  {selected.applicationNumber}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-blue-950">
                  {selected.studentName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="space-y-7 p-6">
              <DetailSection
                title="Student Details"
                details={[
                  ["Full name", selected.studentName],
                  ["Gender", selected.gender],
                  ["Date of birth", selected.dob || "Not provided"],
                  ["Class applying for", selected.applyingClass],
                ]}
              />

              <DetailSection
                title="Academic History"
                details={[
                  ["Previous school", selected.previousSchool],
                  ["PLE / UCE results", selected.pleResults || "Not provided"],
                ]}
              />

              <DetailSection
                title="Parent / Guardian"
                details={[
                  ["Name", selected.parentName],
                  ["Phone", selected.parentPhone],
                  ["Email", selected.parentEmail || "Not provided"],
                ]}
              />

              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                  Update Status
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["New", "Reviewed", "Accepted", "Rejected"] as const).map(
                    (status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateStatus(selected, status)}
                        className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                          selected.status === status
                            ? "bg-blue-700 text-white"
                            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-black"
              >
                Print Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-blue-950">{value}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: AdmissionApplication["status"];
}) {
  const styles = {
    New: "bg-blue-100 text-blue-700",
    Reviewed: "bg-amber-100 text-amber-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

function DetailSection({
  title,
  details,
}: {
  title: string;
  details: [string, string][];
}) {
  return (
    <section>
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="mt-3 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {label}
            </p>
            <p className="mt-1 font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
