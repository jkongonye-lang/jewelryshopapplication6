"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Home } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    console.log("🔍 Login attempt:", { email, password: "***" })

    try {
      const response = await fetch("/api/admin/login-direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("📡 Fetch sent to:", "/api/admin/login-direct")

      const data = await response.json()
      
      console.log("📊 Response status:", response.status)
      console.log("📄 Response data:", data)

      if (!response.ok) {
        console.log("❌ Login failed:", data.error)
        throw new Error(data.error || "Email ou mot de passe incorrect")
      }

      console.log("✅ Login successful:", data)
      console.log("👤 User data:", data.user)

      // Store admin session in localStorage
      localStorage.setItem("admin_authenticated", "true")
      localStorage.setItem("admin_user", JSON.stringify(data.user))
      
      console.log("💾 Session stored:", localStorage.getItem("admin_authenticated"))
      
      // Petite attente avant redirection
      setTimeout(() => {
        console.log("🔄 Redirecting to dashboard...")
        window.location.href = "/admin/dashboard"
      }, 500)
    } catch (err: any) {
      console.log("❌ Login error:", err)
      setError(err.message || "Email ou mot de passe incorrect")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="absolute top-4 left-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Retour au site
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-3xl font-bold text-primary-foreground">KK</span>
          </div>
          <CardTitle className="text-2xl font-bold">Administration</CardTitle>
          <CardDescription>Connectez-vous pour gérer KK Jewelry Shop</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nelly@kkjewelry.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Identifiants par défaut: nelly@kkjewelry.com / admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
