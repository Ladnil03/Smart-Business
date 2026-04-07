import React, { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { LoadingSpinner } from '@/components/ui/Loading'
import { useCustomerStore } from '@/store/customerStore'
import { useProductStore } from '@/store/productStore'
import { Modal } from '@/components/ui/Modal'
import { Plus, Search, FileText, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'

export const BillsPage: React.FC = () => {
  const customers = useCustomerStore((state) => state.customers)
  const products = useProductStore((state) => state.products)
  
  const [bills, setBills] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // New Bill State
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [billItems, setBillItems] = useState([{ product_id: '', quantity: 1, price: 0 }])
  const [amountPaid, setAmountPaid] = useState(0)

  useEffect(() => {
    useCustomerStore.getState().fetchCustomers()
    useProductStore.getState().fetchProducts()
    fetchBills()
  }, [])

  const fetchBills = async () => {
    try {
      const response = await api.get('/bills/')
      setBills(response.data)
    } catch (error) {
      console.error('Failed to fetch bills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = () => {
    setBillItems([...billItems, { product_id: '', quantity: 1, price: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = billItems.filter((_, i) => i !== index)
    setBillItems(newItems)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...billItems]
    if (field === 'product_id') {
      const product = products.find((p) => p.product_id === value)
      newItems[index] = { ...newItems[index], product_id: value, price: product ? product.mrp : 0 }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    setBillItems(newItems)
  }

  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out incomplete items
    const validItems = billItems.filter(item => item.product_id && item.quantity > 0)
    if (validItems.length === 0) return

    try {
      await api.post('/bills/', {
        customer_id: selectedCustomerId || null,
        items: validItems,
        total_amount: calculateTotal(),
        amount_paid: amountPaid,
        status: amountPaid >= calculateTotal() ? 'paid' : amountPaid > 0 ? 'partial' : 'unpaid'
      })
      
      setIsModalOpen(false)
      fetchBills()
      
      if (selectedCustomerId) {
        fetchCustomers() // Refresh customer balances
      }
      fetchProducts() // Refresh inventory
      
      // Reset form
      setSelectedCustomerId('')
      setBillItems([{ product_id: '', quantity: 1, price: 0 }])
      setAmountPaid(0)
    } catch (error) {
      console.error('Failed to generate bill:', error)
      alert("Error generating bill")
    }
  }

  const filteredBills = bills.filter(
    (b) =>
      b._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <MainLayout title="Billing & Invoices">
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-blue transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by Bill ID or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-surface-low border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-blue transition-all duration-300 focus:bg-surface shadow-glow-sm"
            />
            <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)' }}></div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-dark font-bold rounded-2xl hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(0,217,255,0.3)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-teal to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Create Bill</span>
          </button>
        </div>

        {/* Data Container */}
        <div className="rounded-3xl overflow-hidden relative" style={{
          background: 'rgba(26, 26, 26, 0.5)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          {isLoading ? (
            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
          ) : filteredBills.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-4 border border-neon-blue/20">
                <FileText className="w-10 h-10 text-neon-blue" />
              </div>
              <h3 className="text-xl font-display font-medium text-white mb-2">No bills found</h3>
              <p className="text-on-surface-variant">Create a new bill to record a transaction.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-surface-low/50">
                    <th className="p-5 font-semibold text-on-surface-variant text-sm">Bill ID / Date</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm">Customer</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-center">Status</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredBills.map((bill) => (
                      <motion.tr
                        key={bill._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-surface border border-white/5 flex items-center justify-center group-hover:border-neon-blue/30 transition-colors">
                              <FileText className="w-5 h-5 text-neon-blue" />
                            </div>
                            <div>
                              <p className="font-mono text-sm text-white group-hover:text-neon-blue transition-colors">#{bill._id.slice(-8).toUpperCase()}</p>
                              <p className="text-xs text-on-surface-variant mt-0.5">{new Date(bill.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="font-bold text-white">{bill.customer_name || 'Walk-in Customer'}</span>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            bill.status === 'paid'
                              ? 'bg-neon-teal/10 text-neon-teal border border-neon-teal/20'
                              : bill.status === 'partial'
                              ? 'bg-neon-orange/10 text-neon-orange border border-neon-orange/20'
                              : 'bg-neon-pink/10 text-neon-pink border border-neon-pink/20'
                          }`}>
                            {bill.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-5 text-right font-display text-white font-bold">
                          ₹{bill.total_amount.toLocaleString('en-IN')}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* New Bill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Invoice"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-on-surface-variant">Select Customer (Optional)</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white focus:border-neon-blue focus:ring-0 transition-colors"
            >
              <option value="">Walk-in Customer (No Udhaar track)</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>{c.name} - {c.phone}</option>
              ))}
            </select>
            {selectedCustomerId && (
              <p className="text-xs text-neon-orange p-2 bg-neon-orange/10 rounded-lg inline-block border border-neon-orange/20">
                Any unpaid balance will be added to this customer's Udhaar.
              </p>
            )}
          </div>

          <div className="space-y-4 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white">Items List</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-neon-blue hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-white/5 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Row
              </button>
            </div>

            {billItems.map((item, index) => (
              <div key={index} className="flex gap-3 items-start relative group">
                <div className="flex-1 space-y-2">
                  <select
                    value={item.product_id}
                    required
                    onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-high border border-white/5 rounded-lg text-white focus:border-neon-teal"
                  >
                    <option value="">Select Product...</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.name} (₹{p.mrp}) - {p.stock} in stock
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24 space-y-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-surface-high border border-white/5 rounded-lg text-white text-center focus:border-neon-teal"
                    placeholder="Qty"
                  />
                </div>
                <div className="w-32 py-2 text-right font-display font-medium text-white">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                {billItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-on-surface-variant hover:text-neon-pink mt-0.5 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-5 space-y-4 bg-surface-low -mx-6 px-6 -mb-6 pb-6 rounded-b-3xl">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-on-surface-variant">Grand Total</span>
              <span className="font-display font-bold text-white text-2xl">₹{calculateTotal().toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Amount Paid (₹)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={calculateTotal()}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-white font-mono focus:border-neon-green text-lg font-bold"
                  />
                </div>
              </div>

              {selectedCustomerId && calculateTotal() - amountPaid > 0 && (
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-neon-orange mb-2">Adding to Udhaar</label>
                  <div className="w-full px-4 py-3 bg-neon-orange/10 border border-neon-orange/20 rounded-xl text-neon-orange font-mono font-bold text-lg">
                    ₹{(calculateTotal() - amountPaid).toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-3 rounded-xl font-medium text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={billItems.length === 0 || (billItems.length === 1 && !billItems[0].product_id)}
                className="px-8 py-3 rounded-xl font-bold text-dark bg-gradient-to-r from-neon-blue to-neon-purple hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}
