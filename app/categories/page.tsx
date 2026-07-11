import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function CategoriesPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F1F5F9",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />

        <main style={{ padding: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <h1>📂 Kategoriler</h1>

            <button
              style={{
                background: "#2563EB",
                color: "#fff",
                border: "none",
                padding: "12px 18px",
                borderRadius: 8,
              }}
            >
              + Yeni Kategori
            </button>
          </div>

          <div
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 12,
            }}
          >
            Henüz kategori eklenmedi.
          </div>
        </main>
      </div>
    </div>
  );
}
