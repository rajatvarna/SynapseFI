"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          SynapseFI
        </Link>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-24 h-8 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <>
              <Link href="/watchlist" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Watchlist
              </Link>
              <Link href="/portfolio" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Portfolio
              </Link>
              <Link href="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Welcome, {user.name}
              </Link>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
