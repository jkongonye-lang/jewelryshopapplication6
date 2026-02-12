"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, LogOut } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Déconnexion réussie")
    router.push("/admin/login")
    router.refresh()
  }

  const links = [
    { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/produits", label: "Produits", icon: Package },
    { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  ]

  return (
    <nav className="flex items-center gap-2">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href

        return (
          <Button
            key={link.href}
            asChild
            variant={isActive ? "default" : "ghost"}
            size="sm"
            className={isActive ? "bg-primary text-primary-foreground" : ""}
          >
            <Link href={link.href}>
              <Icon className="mr-2 h-4 w-4" />
              {link.label}
            </Link>
          </Button>
        )
      })}

      <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-auto">
        <LogOut className="mr-2 h-4 w-4" />
        Déconnexion
      </Button>
    </nav>
  )
}
