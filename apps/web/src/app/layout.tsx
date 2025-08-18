import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "ui-kit/src/styles.css";
import { Navbar } from "ui-kit";
import { StockPriceProvider } from "@/context/StockPriceContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";

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
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <StockPriceProvider>
            <Header />
            <Navbar />
            <main className="flex-grow container mx-auto p-4">{children}</main>
          </StockPriceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
