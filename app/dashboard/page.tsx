import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F1F5F9",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />

        <main
          style={{
            padding: 30,
          }}
        >
          <h1
            style={{
              marginBottom: 25,
            }}
          >
            📊 Dashboard
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 20,
            }}
          >
            {[
              {
                title: "Toplam Ürün",
                value: "1.248",
                color: "#2563EB",
              },
              {
                title: "Kritik Stok",
                value: "18",
                color: "#DC2626",
              },
              {
                title: "Bugünkü İşlem",
                value: "67",
                color: "#16A34A",
              },
              {
                title: "Kullanıcı",
                value: "5",
                color: "#9333EA",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 24,
                  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                }}
              >
                <div
                  style={{
                    color: "#64748B",
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </div>

                <div
                  style={{
                    fontSize: 34,
                    fontWeight: "bold",
                    color: card.color,
                  }}
                >
                  {card.value}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
