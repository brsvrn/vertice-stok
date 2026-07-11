import Sidebar from "../../../components/layout/Sidebar";
import Header from "../../../components/layout/Header";

export default function NewProductPage() {
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
          <h1>➕ Yeni Ürün</h1>

          <p>Bu ekran bir sonraki adımda ürün formu ile doldurulacak.</p>
        </main>
      </div>
    </div>
  );
}
