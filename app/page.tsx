export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>
          📦 Vertice Stok
        </h1>

        <p style={{ fontSize: "1rem", color: "#555", marginBottom: "24px" }}>
          QR Destekli Stok ve Envanter Yönetim Sistemi
        </p>

        <button
          style={{
            padding: "12px 24px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
          }}
        >
          Sistemi Başlat
        </button>
      </div>
    </main>
  );
}
