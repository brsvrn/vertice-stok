"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
  description: string | null;
};

type CategoryManagerProps = {
  initialCategories: Category[];
};

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasCategories = categories.length > 0;

  const handleAddCategory = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Kategori adı zorunlu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, description: trimmedDescription || "Açıklama eklenmedi" }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Kategori eklenemedi.");
      setIsSubmitting(false);
      return;
    }

    setCategories((current) => [
      ...current,
      {
        id: result.id,
        name: result.name,
        description: result.description || "Açıklama eklenmedi",
      },
    ]);
    setName("");
    setDescription("");
    setSuccess("Kategori başarıyla eklendi.");
    setIsSubmitting(false);
    router.refresh();
  };

  const summary = useMemo(() => `${categories.length} kategori mevcut`, [categories.length]);

  return (
    <>
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "minmax(280px, 360px) 1fr",
        }}
      >
        <section
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Yeni kategori</h2>

          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Kategori adı</div>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn. Ana Yemek"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #CBD5E1",
                borderRadius: 8,
              }}
            />
          </label>

          <label style={{ display: "block", marginBottom: 18 }}>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Açıklama</div>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Kategori açıklaması"
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #CBD5E1",
                borderRadius: 8,
                resize: "vertical",
              }}
            />
          </label>

          {error ? <div style={{ marginBottom: 12, color: "#B91C1C" }}>{error}</div> : null}
          {success ? <div style={{ marginBottom: 12, color: "#166534" }}>{success}</div> : null}

          <button
            type="button"
            onClick={handleAddCategory}
            disabled={isSubmitting}
            style={{
              width: "100%",
              background: isSubmitting ? "#64748B" : "#16A34A",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: 8,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {isSubmitting ? "Ekleniyor..." : "Kategori ekle"}
          </button>
        </section>

        <section
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Kayıtlı kategoriler</h2>

          {hasCategories ? (
            <div style={{ display: "grid", gap: 12 }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{category.name}</div>
                  <div style={{ color: "#64748B" }}>{category.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#64748B" }}>Henüz kategori eklenmedi.</div>
          )}
        </section>
      </div>

      <div style={{ marginTop: 12, color: "#64748B" }}>{summary}</div>
    </>
  );
}
