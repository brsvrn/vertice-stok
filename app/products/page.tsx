import Link from "next/link";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function ProductsPage() {
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
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            <div>
              <h1 style={{ margin: 0 }}>📦 Ürünler</h1>

              <p
                style={{
                  color: "#64748B",
                  marginTop: 6,
                }}
              >
                Sistemde kayıtlı tüm ürünler
              </p>
            </div>

            <Link
              href="/products/new"
              style={{
                background: "#2563EB",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              + Yeni Ürün
            </Link>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead
                style={{
                  background: "#F8FAFC",
                }}
              >
                <tr>
                  <th style={{ padding: 15, textAlign: "left" }}>Ürün</th>
                  <th style={{ padding: 15 }}>Kategori</th>
                  <th style={{ padding: 15 }}>Marka</th>
                  <th style={{ padding: 15 }}>Kritik</th>
                  <th style={{ padding: 15 }}>Durum</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={{ padding: 20 }}>
                    Henüz ürün eklenmedi.
                  </td>

                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
                }
