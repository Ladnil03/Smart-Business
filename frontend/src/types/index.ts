export interface User {
  user_id: string
  email: string
  full_name: string
  shop_name: string
  phone?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Customer {
  customer_id: string
  owner_id: string
  name: string
  email?: string
  phone: string
  address?: string
  total_udhaar: number
  transactions_count: number
  last_transaction?: string
  created_at: string
  updated_at: string
}

export interface Product {
  product_id: string
  owner_id: string
  name: string
  sku: string
  mrp: number
  cost: number
  stock: number
  low_stock_threshold: number
  category?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  transaction_id: string
  customer_id: string
  owner_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_amount: number
  transaction_type: 'SALE' | 'RETURN' | 'PAYMENT'
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Bill {
  bill_id: string
  customer_id: string
  owner_id: string
  items: BillItem[]
  subtotal: number
  tax?: number
  total_amount: number
  payment_status: 'PENDING' | 'PARTIAL' | 'PAID'
  amount_paid?: number
  udhaar_amount?: number
  bill_date: string
  due_date?: string
  created_at: string
  updated_at: string
}

export interface BillItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
}

export interface AIInsights {
  total_pending_udhaar: number
  low_stock_items: { name: string; sku: string; stock: number }[]
  top_customers: Customer[]
  top_products: Product[]
  monthly_revenue: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
