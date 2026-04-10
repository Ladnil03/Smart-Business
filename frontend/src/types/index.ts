export interface User {
  user_id: string
  email: string
  full_name: string
  shop_name: string
  phone?: string
  photo?: string
  created_at?: string
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
  _id: string
  customer_id: string
  owner_id: string
  type: 'credit' | 'payment'
  amount: number
  note?: string
  created_at: string
}

export interface CreateTransactionPayload {
  customer_id: string
  type: 'credit' | 'payment'
  amount: number
  note?: string
}

export interface MonthlyStats {
  collected_this_month: number
  new_udhaar_this_month: number
  net_position: number
  month: string
}

export interface Bill {
  _id?: string
  bill_id: string
  customer_id: string
  owner_id: string
  items: BillItem[]
  subtotal: number
  tax?: number
  total?: number
  total_amount: number
  payment_status?: 'PENDING' | 'PARTIAL' | 'PAID'
  paid?: boolean
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
  top_customers: { name: string; phone: string; total_udhaar: number }[]
  top_products: Product[]
  monthly_revenue: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
