import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/components/layout-shell";

export const metadata: Metadata = {
  title: "NordicFloor",
  description: "Premium klikk-vinyl for norske hjem"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
