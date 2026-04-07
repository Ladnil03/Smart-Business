import React, { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/Loading'
import { useCustomerStore } from '@/store/customerStore'
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const CustomersPage: React.FC = () => {
  const customers = useCustomerStore((state) => state.customers)
  const isLoading = useCustomerStore((state) => state.isLoading)
  const createCustomer = useCustomerStore((state) => state.createCustomer)
  const updateCustomer = useCustomerStore((state) => state.updateCustomer)
  const deleteCustomer = useCustomerStore((state) => state.deleteCustomer)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCustomer, setEditingCustomer] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    total_udhaar: 0,
  })

  useEffect(() => {
    useCustomerStore.getState().fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  )

  const handleOpenModal = (customer: any = null) => {
    if (customer) {
      setEditingCustomer(customer)
      setFormData({
        name: customer.name,
        phone: customer.phone,
        address: customer.address || '',
        total_udhaar: customer.total_udhaar,
      })
    } else {
      setEditingCustomer(null)
      setFormData({ name: '', phone: '', address: '', total_udhaar: 0 })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCustomer) {
      await updateCustomer(editingCustomer.customer_id, formData)
    } else {
      await createCustomer(formData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id)
    }
  }

  return (
    <MainLayout title="Customers">
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-teal transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-surface-low border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-teal transition-all duration-300 focus:bg-surface shadow-glow-sm"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            />
            <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(0, 255, 209, 0.2)' }}></div>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-teal to-neon-blue text-dark font-bold rounded-2xl hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(0,255,209,0.3)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Add Customer</span>
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
          ) : filteredCustomers.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-neon-teal/10 flex items-center justify-center mx-auto mb-4 border border-neon-teal/20">
                <Users className="w-10 h-10 text-neon-teal" />
              </div>
              <h3 className="text-xl font-display font-medium text-white mb-2">No customers found</h3>
              <p className="text-on-surface-variant">Add a customer to track udhaar and details.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-surface-low/50">
                    <th className="p-5 font-semibold text-on-surface-variant text-sm">Customer</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-center">Contact</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-right">Total Udhaar</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredCustomers.map((customer) => (
                      <motion.tr
                        key={customer.customer_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-teal to-neon-purple flex flex-shrink-0 items-center justify-center font-display font-bold text-dark shadow-glow-sm">
                              {customer.name[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-neon-teal transition-colors">{customer.name}</p>
                              {customer.address && <p className="text-xs text-on-surface-variant mt-0.5 max-w-[200px] truncate">{customer.address}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-sm font-mono text-on-surface-variant bg-surface px-3 py-1.5 rounded-lg border border-white/5">{customer.phone}</span>
                        </td>
                        <td className="p-5 text-right">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold font-display ${
                            customer.total_udhaar > 0 
                              ? 'bg-neon-orange/10 text-neon-orange border border-neon-orange/20 shadow-[0_0_10px_rgba(255,149,0,0.1)]' 
                              : 'bg-surface text-on-surface-variant border border-white/5'
                          }`}>
                            ₹{customer.total_udhaar.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenModal(customer)}
                              className="p-2 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface transition-all duration-200"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(customer.customer_id)}
                              className="p-2 rounded-lg text-on-surface-variant hover:text-neon-pink hover:bg-neon-pink/10 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'New Customer'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">Full Name <span className="text-neon-pink">*</span></label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white focus:border-neon-teal focus:ring-0 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">Phone Number <span className="text-neon-pink">*</span></label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white font-mono focus:border-neon-teal transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white focus:border-neon-teal transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">Initial Udhaar (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-neon-orange font-bold">₹</span>
              <input
                type="number"
                min="0"
                value={formData.total_udhaar}
                onChange={(e) => setFormData({ ...formData, total_udhaar: Number(e.target.value) })}
                className="w-full pl-8 pr-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white font-mono focus:border-neon-orange transition-colors"
              />
            </div>
            <p className="text-xs text-on-surface-variant/70 mt-1 pl-1">Set the starting credit balance if applicable.</p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl font-medium text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-dark bg-gradient-to-r from-neon-teal to-neon-blue hover:shadow-[0_0_15px_rgba(0,255,209,0.4)] transition-all transform hover:scale-105"
            >
              {editingCustomer ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}
