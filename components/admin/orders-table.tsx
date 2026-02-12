"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice, formatDate } from "@/lib/utils/format"
import type { Order } from "@/lib/db/types"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    setTimeout(() => {
      alert("Mode démo: La mise à jour de statut sera fonctionnelle avec Supabase connecté")
      setUpdatingOrderId(null)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      paid: "default",
      processing: "outline",
      completed: "default",
      cancelled: "destructive",
    }

    const labels: Record<string, string> = {
      pending: "En attente",
      paid: "Payé",
      processing: "En cours",
      completed: "Terminé",
      cancelled: "Annulé",
    }

    return <Badge variant={variants[status] || "secondary"}>{labels[status] || status}</Badge>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <p className="text-lg font-medium text-muted-foreground">Aucune commande</p>
          <p className="mt-2 text-sm text-muted-foreground">Les commandes apparaîtront ici</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.customer_phone}</TableCell>
                  <TableCell>{formatPrice(order.total_xaf)}</TableCell>
                  <TableCell>
                    {updatingOrderId === order.id ? (
                      <Badge variant="secondary">Mise à jour...</Badge>
                    ) : (
                      <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="paid">Payé</SelectItem>
                          <SelectItem value="processing">En cours</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir détails</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
            <DialogDescription>Commande {selectedOrder?.order_number}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                {selectedOrder.customer_email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.customer_email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Montant total</p>
                  <p className="text-lg font-bold text-primary">{formatPrice(selectedOrder.total_xaf)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date de commande</p>
                  <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
