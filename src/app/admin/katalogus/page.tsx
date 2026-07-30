"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type AdminProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  slug?: string;
  description?: string;
  category?: string;
  badge?: string;
  costPrice?: number;
  purchasePrice?: number;
  specs?: Record<string, string | number>;
};

const emptyForm = {
  name: "",
  price: "",
  slug: "",
  category: "UHP / UHE",
  description: "",
  badge: "",
  costPrice: "",
  imageUrl: "/projector-lamp-module.jpg",
};

export default function AdminCatalogPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/admin/products", { credentials: "include" });
    if (!res.ok) {
      setError("Katalógus betöltése sikertelen.");
      return;
    }
    const data = (await res.json()) as { products: AdminProduct[] };
    setProducts(data.products);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(p: AdminProduct) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      slug: p.slug ?? "",
      category: p.category ?? "",
      description: p.description ?? "",
      badge: p.badge ?? "",
      costPrice:
        typeof p.costPrice === "number"
          ? String(p.costPrice)
          : typeof p.purchasePrice === "number"
            ? String(p.purchasePrice)
            : "",
      imageUrl: p.imageUrl ?? "/projector-lamp-module.jpg",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = {
        id: editingId ?? undefined,
        name: form.name.trim(),
        price: Number(form.price),
        slug: form.slug.trim() || undefined,
        category: form.category.trim() || undefined,
        description: form.description.trim() || undefined,
        badge: form.badge.trim() || undefined,
        imageUrl: form.imageUrl.trim() || "/projector-lamp-module.jpg",
        costPrice: form.costPrice === "" ? undefined : Number(form.costPrice),
      };

      const res = await fetch("/api/admin/products", {
        method: editingId != null ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId != null ? { ...payload, id: editingId } : payload,
        ),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Mentés sikertelen.");
        return;
      }
      resetForm();
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm(`Törlöd a #${id} terméket?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setError("Törlés sikertelen.");
        return;
      }
      if (editingId === id) resetForm();
      await load();
    } finally {
      setBusy(false);
    }
  }

  const fmt = new Intl.NumberFormat("hu-HU");

  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
        1. modul
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Termékkatalógus kezelő</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Private source (`PRODUCTS_DB_PATH`). A <code>costPrice</code> csak admin API-n él; a
        publikus <code>toPublicProduct</code> kiszűri.
      </p>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-3 rounded-lg border border-border bg-card p-5 md:grid-cols-2"
      >
        <h2 className="md:col-span-2 text-sm font-semibold">
          {editingId != null ? `Szerkesztés #${editingId}` : "Új lámpamodul / izzó"}
        </h2>
        <Field label="Név" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field
          label="Publikus nettó ár (Ft)"
          value={form.price}
          onChange={(v) => setForm({ ...form, price: v })}
          required
          type="number"
        />
        <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
        <Field
          label="Kategória"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
        />
        <Field
          label="Beszerzési nettó (Ft) — belső"
          value={form.costPrice}
          onChange={(v) => setForm({ ...form, costPrice: v })}
          type="number"
        />
        <Field label="Badge" value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} />
        <label className="md:col-span-2 flex flex-col gap-1 text-sm">
          <span className="font-medium">Leírás</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {editingId != null ? "Mentés" : "Rögzítés"}
          </button>
          {editingId != null ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md border border-border px-4 py-2 text-sm"
            >
              Mégse
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-10 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Név</th>
              <th className="px-3 py-2">Nettó</th>
              <th className="px-3 py-2">Költség</th>
              <th className="px-3 py-2">Kategória</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">{p.id}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2">{fmt.format(p.price)} Ft</td>
                <td className="px-3 py-2 text-muted-foreground">
                  {typeof p.costPrice === "number"
                    ? `${fmt.format(p.costPrice)} Ft`
                    : typeof p.purchasePrice === "number"
                      ? `${fmt.format(p.purchasePrice)} Ft`
                      : "—"}
                </td>
                <td className="px-3 py-2">{p.category ?? "—"}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="mr-2 text-primary hover:underline"
                    onClick={() => startEdit(p)}
                  >
                    Szerkeszt
                  </button>
                  <button
                    type="button"
                    className="text-destructive hover:underline"
                    onClick={() => void onDelete(p.id)}
                  >
                    Töröl
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      />
    </label>
  );
}
