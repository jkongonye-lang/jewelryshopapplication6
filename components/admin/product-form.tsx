"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import type { Product, Category } from "@/lib/db/types"

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price_xaf: product?.price_xaf || 0,
    category_id: product?.category_id || "",
    stock_quantity: product?.stock_quantity || 0,
    is_active: product?.is_active ?? true,
    material: product?.material || "",
    weight_grams: product?.weight_grams || null,
    dimensions: product?.dimensions || "",
    images: product?.images || [],
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (product) {
        alert("Mode démo: La mise à jour sera fonctionnelle avec Supabase connecté")
      } else {
        alert("Mode démo: La création sera fonctionnelle avec Supabase connecté")
      }
      setIsLoading(false)
      router.push("/admin/produits")
    }, 1500)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du produit *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Ex: Collier en or rose"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez le bijou..."
              rows={4}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1"
                value={formData.price_xaf}
                onChange={(e) => setFormData({ ...formData, price_xaf: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Quantité en stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="material">Matériau</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Ex: Or, Argent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Poids (grammes)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight_grams || ""}
                onChange={(e) =>
                  setFormData({ ...formData, weight_grams: e.target.value ? Number(e.target.value) : null })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="Ex: 50cm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="active">Produit actif</Label>
              <p className="text-sm text-muted-foreground">Afficher ce produit sur le site</p>
            </div>
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Enregistrement..." : product ? "Mettre à jour" : "Créer le produit"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/produits")} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
