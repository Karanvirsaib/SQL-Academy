import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Engineering Academy — Learn, Practice, Build",
  description: "24 guided data engineering topics, 32 SQL lessons, browser SQL practice, and portfolio labs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
