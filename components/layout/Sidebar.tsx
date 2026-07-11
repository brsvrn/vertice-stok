import Link from "next/link";

const menu = [
  {
    title: "Dashboard",
    icon: "🏠",
    href: "/dashboard",
  },
  {
    title: "Ürünler",
    icon: "📦",
    href: "/products",
  },
  {
  title: "Kategoriler",
  icon: "📂",
  href: "/categories",
},
  {
    title: "Stok Girişi",
    icon: "📥",
    href: "/stock/in",
  },
  {
    title: "Transfer",
    icon: "🔄",
    href: "/transfer",
  },
  {
    title: "Sayım",
    icon: "📋",
    href: "/inventory",
  },
  {
    title: "Raporlar",
    icon: "📊",
    href: "/reports",
  },
  {
    title: "Ayarlar",
    icon: "⚙️",
    href: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 250,
        background: "#1E293B",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: 24,
          fontSize: 22,
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
      >
        📦 Vertice Stok
      </div>

      <nav style={{ padding: 15 }}>
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "block",
              color: "#fff",
              textDecoration: "none",
              padding: "12px",
              borderRadius: 8,
              marginBottom: 6,
              background: "transparent",
            }}
          >
            {item.icon} {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
