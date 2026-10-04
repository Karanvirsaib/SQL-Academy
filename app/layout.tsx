import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQL Analyst — Learn SQL by Solving Real Problems",
  description: "An interactive SQL learning platform from beginner to advanced data analyst.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}