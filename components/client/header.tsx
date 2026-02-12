"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/client/cart-button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-primary-foreground">KK</span>
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-lg font-bold leading-none text-foreground">KK Jewelry</span>
            <span className="text-xs text-muted-foreground">Bijoux Modernes</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/bijoux" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Catalogue
          </Link>
          <Link
            href="/bijoux?audience=femme"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Femme
          </Link>
          <Link
            href="/bijoux?audience=homme"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Homme
          </Link>
          <Link
            href="/bijoux?audience=enfant"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Enfant
          </Link>
        </nav>

        {/* Cart, Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CartButton />

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/bijoux"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catalogue
            </Link>
            <Link
              href="/bijoux?audience=femme"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Femme
            </Link>
            <Link
              href="/bijoux?audience=homme"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Homme
            </Link>
            <Link
              href="/bijoux?audience=enfant"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Enfant
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
