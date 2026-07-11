type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      style={{
        height: 70,
        background: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
          }}
        >
          {title ?? "Dashboard"}
        </h2>

        <small style={{ color: "#6B7280" }}>
          {subtitle ?? "Vertice Stok Yönetim Paneli"}
        </small>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <button
          style={{
            border: "none",
            background: "#F3F4F6",
            padding: "10px 14px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          🔔
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#2563EB",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            B
          </div>

          <div>
            <div style={{ fontWeight: "bold" }}>Barış</div>
            <small style={{ color: "#6B7280" }}>Yönetici</small>
          </div>
        </div>
      </div>
    </header>
  );
}
