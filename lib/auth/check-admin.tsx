"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = () => {
      const session = localStorage.getItem("admin_session")

      if (!session) {
        router.push("/admin/login")
        return
      }

      try {
        const user = JSON.parse(session)
        if (user.role === "admin" && user.email === "nelly@kkjewelry.com") {
          setIsAdmin(true)
        } else {
          localStorage.removeItem("admin_session")
          router.push("/admin/login")
        }
      } catch {
        localStorage.removeItem("admin_session")
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  const logout = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  return { isAdmin, isLoading, logout }
}
