import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AppShell({
  title,
  subtitle,
  children,
}: AppShellProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F1F5F9",
        color: "#0F172A",
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
        <Header title={title} subtitle={subtitle} />

        <main style={{ padding: 30, flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
