import React, { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/Loading'
import { useProductStore } from '@/store/productStore'
import { Plus, Search, Edit2, Trash2, Package, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const ProductsPage: React.FC = () => {
  const products = useProductStore((state) => state.products)
  const isLoading = useProductStore((state) => state.isLoading)
  const createProduct = useProductStore((state) => state.createProduct)
  const updateProduct = useProductStore((state) => state.updateProduct)
  const deleteProduct = useProductStore((state) => state.deleteProduct)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    mrp: 0,
    cost: 0,
    stock: 0,
    category: '',
    low_stock_threshold: 5,
  })

  useEffect(() => {
    useProductStore.getState().fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        sku: product.sku || '',
        mrp: product.mrp,
        cost: product.cost || 0,
        stock: product.stock,
        category: product.category || '',
        low_stock_threshold: product.low_stock_threshold,
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: '', sku: '', mrp: 0, cost: 0, stock: 0, category: '', low_stock_threshold: 5 })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      await updateProduct(editingProduct.product_id, formData)
    } else {
      await createProduct(formData)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id)
    }
  }

  return (
    <MainLayout title="Inventory">
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-on-surface-variant group-focus-within:text-neon-purple transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-surface-low border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-neon-purple transition-all duration-300 focus:bg-surface shadow-glow-sm"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            />
            <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: '0 0 15px rgba(189, 95, 255, 0.2)' }}></div>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-orange text-dark font-bold rounded-2xl hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(189,95,255,0.3)] group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-teal to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Plus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Add Product</span>
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
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-neon-purple/10 flex items-center justify-center mx-auto mb-4 border border-neon-purple/20">
                <Package className="w-10 h-10 text-neon-purple" />
              </div>
              <h3 className="text-xl font-display font-medium text-white mb-2">No products found</h3>
              <p className="text-on-surface-variant">Add a product to start building your inventory.</p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-surface-low/50">
                    <th className="p-5 font-semibold text-on-surface-variant text-sm">Product Name</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm">SKU/Code</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-right">Price</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-center">Stock</th>
                    <th className="p-5 font-semibold text-on-surface-variant text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product.product_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface border border-white/5 flex items-center justify-center group-hover:border-neon-purple/30 transition-colors">
                              <Package className="w-5 h-5 text-neon-purple" />
                            </div>
                            <span className="font-bold text-white group-hover:text-neon-purple transition-colors">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="text-sm font-mono text-on-surface-variant bg-surface px-2 py-1 rounded-lg border border-white/5">{product.sku || 'N/A'}</span>
                        </td>
                        <td className="p-5 text-right font-display text-white font-bold">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            product.stock === 0 
                              ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/20' 
                              : product.stock < 10 && product.stock > 0
                                ? 'bg-neon-orange/10 text-neon-orange border border-neon-orange/20'
                                : 'bg-neon-teal/10 text-neon-teal border border-neon-teal/20'
                          }`}>
                            {product.stock === 0 && <AlertCircle className="w-3 h-3" />}
                            {product.stock} Units
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenModal(product)}
                              className="p-2 rounded-lg text-on-surface-variant hover:text-white hover:bg-surface transition-all duration-200"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.product_id)}
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

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">Product Name <span className="text-neon-pink">*</span></label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white focus:border-neon-purple focus:ring-0 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">SKU / Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white font-mono focus:border-neon-purple transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">Stock <span className="text-neon-pink">*</span></label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white font-mono focus:border-neon-teal transition-colors"
                style={{ WebkitAppearance: 'none' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">Cost Price</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-on-surface-variant font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white font-mono focus:border-neon-orange transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant">Selling Price (MRP) <span className="text-neon-pink">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-neon-orange font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white font-mono focus:border-neon-orange transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant">Low Stock Threshold</label>
            <input
              type="number"
              min="0"
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-surface-low border border-white/10 rounded-xl text-white font-mono focus:border-neon-teal transition-colors"
              placeholder="Alert when stock falls below this number"
            />
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
              className="px-6 py-2.5 rounded-xl font-bold text-dark bg-gradient-to-r from-neon-purple to-neon-orange hover:shadow-[0_0_15px_rgba(189,95,255,0.4)] transition-all transform hover:scale-105"
            >
              {editingProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  )
}
