import type { Metadata } from "next";
import "./globals.css";
import "ui-kit/src/styles.css";
import { Navbar } from "ui-kit";

export const metadata: Metadata = {
  title: "SynapseFI",
  description: "A modern financial dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
