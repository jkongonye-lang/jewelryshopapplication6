export interface User {
  id: string
  email: string
  password_hash?: string
  role: "admin" | "customer"
  phone?: string
  full_name?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  target_audience: "homme" | "femme" | "enfant" | "mixte"
  description?: string
  created_at: string
}

export interface Product {
  id: string
  title: string
  description?: string
  price_xaf: number
  category_id?: string
  stock_quantity: number
  images: string[]
  is_active: boolean
  material?: string
  weight_grams?: number
  dimensions?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_address?: string
  total_xaf: number
  status: "pending" | "paid" | "cancelled" | "processing" | "completed"
  payment_status: "pending" | "success" | "failed" | "refunded"
  notes?: string
  created_at: string
  updated_at: string
  cancelled_at?: string
  completed_at?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_title: string
  product_image?: string
  quantity: number
  unit_price_xaf: number
  subtotal_xaf: number
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  payment_method: "orange_money" | "mtn_money" | "cash"
  transaction_id?: string
  amount_xaf: number
  status: "pending" | "success" | "failed" | "cancelled"
  provider_response?: any
  phone_number?: string
  created_at: string
  confirmed_at?: string
}

export interface CartItem {
  product: Product
  quantity: number
}
