"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type NavItem = {
  label: string;
  href: string;
};

interface GlobalSettings {
  badgeUrl: string;
  badgeAlt: string;
  headerLocationLabel: string;

  homeLabel: string;
  aboutLabel: string;
  academicsLabel: string;
  studentLifeLabel: string;
  mediaLabel: string;
  admissionsLabel: string;
  contactLabel: string;

  topAdmissionsText: string;
  topAdmissionsLink: string;

  aboutMenuTitle: string;
  aboutMenuSubtitle: string;
  aboutLinks: NavItem[];

  academicsMenuTitle: string;
  academicsMenuSubtitle: string;
  academicsLinks: NavItem[];

  studentLifeMenuTitle: string;
  studentLifeMenuSubtitle: string;
  studentLifeLinks: NavItem[];

  mediaLinks: NavItem[];

  footerDescription: string;
  footerQuickTitle: string;
  footerQuickLinks: NavItem[];
  footerMediaTitle: string;
  footerMediaLinks: NavItem[];
  footerContactTitle: string;
  footerCopyrightText: string;
}

const emptySettings: GlobalSettings = {
  badgeUrl: "",
  badgeAlt: "",
  headerLocationLabel: "",

  homeLabel: "",
  aboutLabel: "",
  academicsLabel: "",
  studentLifeLabel: "",
  mediaLabel: "",
  admissionsLabel: "",
  contactLabel: "",

  topAdmissionsText: "",
  topAdmissionsLink: "",

  aboutMenuTitle: "",
  aboutMenuSubtitle: "",
  aboutLinks: [],

  academicsMenuTitle: "",
  academicsMenuSubtitle: "",
  academicsLinks: [],

  studentLifeMenuTitle: "",
  studentLifeMenuSubtitle: "",
  studentLifeLinks: [],

  mediaLinks: [],

  footerDescription: "",
  footerQuickTitle: "",
  footerQuickLinks: [],
  footerMediaTitle: "",
  footerMediaLinks: [],
  footerContactTitle: "",
  footerCopyrightText: "",
};

export default function GlobalLayoutPage() {
  const [settings, setSettings] =
    useState<GlobalSettings>(emptySettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/global-layout-settings",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load layout settings."
          );
        }

        setSettings(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load layout settings."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function update(
    field: keyof GlobalSettings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function save(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "/api/global-layout-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to save layout settings."
        );
      }

      setSettings(data);
      setMessage(
        "Header, navigation and footer settings saved."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save layout settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 font-semibold text-slate-600">
        Loading Header and Footer settings...
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Public Website
        </p>

        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Header, Navigation & Footer
        </h1>

        <p className="mt-3 max-w-2xl text-slate-200">
          Control the shared navigation and footer
          displayed across every public page.
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
        onSubmit={save}
        className="mt-8 space-y-8"
      >
        <Section title="Branding & Header">
          <Field
            label="Badge URL"
            value={settings.badgeUrl}
            onChange={(value) =>
              update("badgeUrl", value)
            }
          />

          <Field
            label="Badge Alt Text"
            value={settings.badgeAlt}
            onChange={(value) =>
              update("badgeAlt", value)
            }
          />

          <Field
            label="Small Location Label"
            value={settings.headerLocationLabel}
            onChange={(value) =>
              update("headerLocationLabel", value)
            }
          />

          <Field
            label="Top Admissions Button Text"
            value={settings.topAdmissionsText}
            onChange={(value) =>
              update("topAdmissionsText", value)
            }
          />

          <Field
            label="Top Admissions Button Link"
            value={settings.topAdmissionsLink}
            onChange={(value) =>
              update("topAdmissionsLink", value)
            }
          />
        </Section>

        <Section title="Main Navigation Labels">
          {[
            ["Home", "homeLabel"],
            ["About", "aboutLabel"],
            ["Academics", "academicsLabel"],
            ["Student Life", "studentLifeLabel"],
            ["Media", "mediaLabel"],
            ["Admissions", "admissionsLabel"],
            ["Contact", "contactLabel"],
          ].map(([label, field]) => (
            <Field
              key={field}
              label={label}
              value={
                settings[
                  field as keyof GlobalSettings
                ] as string
              }
              onChange={(value) =>
                update(
                  field as keyof GlobalSettings,
                  value
                )
              }
            />
          ))}
        </Section>

        <Section title="About Menu">
          <Field
            label="Menu Title"
            value={settings.aboutMenuTitle}
            onChange={(value) =>
              update("aboutMenuTitle", value)
            }
          />

          <Field
            label="Menu Subtitle"
            value={settings.aboutMenuSubtitle}
            onChange={(value) =>
              update("aboutMenuSubtitle", value)
            }
          />

          <LinksEditor
            title="About Links"
            items={settings.aboutLinks}
            onChange={(items) =>
              setSettings({
                ...settings,
                aboutLinks: items,
              })
            }
          />
        </Section>

        <Section title="Academics Menu">
          <Field
            label="Menu Title"
            value={settings.academicsMenuTitle}
            onChange={(value) =>
              update("academicsMenuTitle", value)
            }
          />

          <Field
            label="Menu Subtitle"
            value={settings.academicsMenuSubtitle}
            onChange={(value) =>
              update("academicsMenuSubtitle", value)
            }
          />

          <LinksEditor
            title="Academics Links"
            items={settings.academicsLinks}
            onChange={(items) =>
              setSettings({
                ...settings,
                academicsLinks: items,
              })
            }
          />
        </Section>

        <Section title="Student Life Menu">
          <Field
            label="Menu Title"
            value={settings.studentLifeMenuTitle}
            onChange={(value) =>
              update(
                "studentLifeMenuTitle",
                value
              )
            }
          />

          <Field
            label="Menu Subtitle"
            value={settings.studentLifeMenuSubtitle}
            onChange={(value) =>
              update(
                "studentLifeMenuSubtitle",
                value
              )
            }
          />

          <LinksEditor
            title="Student Life Links"
            items={settings.studentLifeLinks}
            onChange={(items) =>
              setSettings({
                ...settings,
                studentLifeLinks: items,
              })
            }
          />
        </Section>

        <Section title="Media Menu">
          <LinksEditor
            title="Media Links"
            items={settings.mediaLinks}
            onChange={(items) =>
              setSettings({
                ...settings,
                mediaLinks: items,
              })
            }
          />
        </Section>

        <Section title="Footer">
          <TextArea
            label="Footer Description"
            value={settings.footerDescription}
            onChange={(value) =>
              update("footerDescription", value)
            }
          />

          <Field
            label="Quick Links Column Title"
            value={settings.footerQuickTitle}
            onChange={(value) =>
              update("footerQuickTitle", value)
            }
          />

          <LinksEditor
            title="Footer Quick Links"
            items={settings.footerQuickLinks}
            onChange={(items) =>
              setSettings({
                ...settings,
                footerQuickLinks: items,
              })
            }
          />

          <Field
            label="Media Column Title"
            value={settings.footerMediaTitle}
            onChange={(value) =>
              update("footerMediaTitle", value)
            }
          />

          <LinksEditor
            title="Footer Media Links"
            items={settings.footerMediaLinks}
            onChange={(items) =>
              setSettings({
                ...settings,
                footerMediaLinks: items,
              })
            }
          />

          <Field
            label="Contact Column Title"
            value={settings.footerContactTitle}
            onChange={(value) =>
              update("footerContactTitle", value)
            }
          />

          <Field
            label="Copyright Ending Text"
            value={settings.footerCopyrightText}
            onChange={(value) =>
              update("footerCopyrightText", value)
            }
          />
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl bg-green-600 px-7 py-4 text-lg font-extrabold text-white shadow-lg hover:bg-green-700 disabled:opacity-60"
        >
          {saving
            ? "Saving..."
            : "Save Header & Footer"}
        </button>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="border-b border-slate-200 pb-4 text-xl font-extrabold text-blue-950">
        {title}
      </h2>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {children}
      </div>
    </section>
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
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
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
    <label className="block lg:col-span-2">
      <span className="mb-2 block text-xs font-bold uppercase text-slate-600">
        {label}
      </span>

      <textarea
        rows={4}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
      />
    </label>
  );
}

function LinksEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
}) {
  function updateItem(
    index: number,
    field: keyof NavItem,
    value: string
  ) {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  }

  function addItem() {
    onChange([
      ...items,
      {
        label: "",
        href: "/",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange(
      items.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-extrabold text-blue-950">
          {title}
        </h3>

        <button
          type="button"
          onClick={addItem}
          className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white"
        >
          Add Link
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]"
          >
            <input
              value={item.label}
              placeholder="Link label"
              onChange={(event) =>
                updateItem(
                  index,
                  "label",
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2"
            />

            <input
              value={item.href}
              placeholder="/page"
              onChange={(event) =>
                updateItem(
                  index,
                  "href",
                  event.target.value
                )
              }
              className="rounded-lg border border-slate-300 px-3 py-2"
            />

            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
