export default function Sidebar() {
  const menu = [
    "🏠 Dashboard",
    "📦 Ürünler",
    "📂 Kategoriler",
    "📥 Stok Giriş",
    "📤 Stok Çıkış",
    "🏷️ QR Kod",
    "📊 Raporlar",
    "👥 Kullanıcılar",
    "⚙️ Ayarlar",
  ];

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        background: "#1E293B",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 24,
          fontSize: 24,
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
      >
        📦 Vertice Stok
      </div>

      <nav style={{ padding: 16 }}>
        {menu.map((item) => (
          <div
            key={item}
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              marginBottom: 8,
              cursor: "pointer",
              transition: ".2s",
            }}
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}
