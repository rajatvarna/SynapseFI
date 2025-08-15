import type { Metadata } from "next";
import "./globals.css";
import "ui-kit/src/styles.css";
import { Navbar } from "ui-kit";

export const metadata: Metadata = {
  title: "SynapseFI",
  description: "A modern financial dashboard.",
};

import { StockPriceProvider } from "@/context/StockPriceContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className="antialiased bg-gray-50 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
=======
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <StockPriceProvider>
            <Header />
            <main className="flex-grow">{children}</main>
          </StockPriceProvider>
        </AuthProvider>
>>>>>>> origin/feat/integrate-shadcn-ui
      </body>
    </html>
  );
}
