import React, { useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/Loading'
import { useAuthStore } from '@/store/authStore'
import { useCustomerStore } from '@/store/customerStore'
import { useProductStore } from '@/store/productStore'
import { useAIStore } from '@/store/aiStore'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Package, AlertCircle, DollarSign, Store } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * ✅ DASHBOARD PAGE
 * 
 * No auth checks here - ProtectedLayout handles it
 * Just fetch and display data
 */
export const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const customers = useCustomerStore((state) => state.customers)
  const products = useProductStore((state) => state.products)
  const insights = useAIStore((state) => state.insights)
  const isLoading = useAIStore((state) => state.isLoading)

  useEffect(() => {
    useCustomerStore.getState().fetchCustomers()
    useProductStore.getState().fetchProducts()
    useAIStore.getState().fetchInsights()
  }, [])

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Udhaar',
      value: `₹${(insights?.total_pending_udhaar || 0).toLocaleString('en-IN')}`,
      color: 'text-neon-orange',
      bgClass: 'bg-neon-orange/10',
      shadowClass: 'shadow-neon-orange',
      gradient: 'linear-gradient(135deg, rgba(255,149,0,0.2) 0%, transparent 100%)'
    },
    {
      icon: Users,
      label: 'Total Customers',
      value: customers.length,
      color: 'text-neon-teal',
      bgClass: 'bg-neon-teal/10',
      shadowClass: 'shadow-neon-teal',
      gradient: 'linear-gradient(135deg, rgba(0,255,209,0.2) 0%, transparent 100%)'
    },
    {
      icon: Package,
      label: 'Total Products',
      value: products.length,
      color: 'text-neon-purple',
      bgClass: 'bg-neon-purple/10',
      shadowClass: 'shadow-neon-purple',
      gradient: 'linear-gradient(135deg, rgba(189,95,255,0.2) 0%, transparent 100%)'
    },
    {
      icon: AlertCircle,
      label: 'Low Stock Items',
      value: insights?.low_stock_items?.length || 0,
      color: 'text-neon-pink',
      bgClass: 'bg-neon-pink/10',
      shadowClass: 'shadow-neon-pink',
      gradient: 'linear-gradient(135deg, rgba(255,45,85,0.2) 0%, transparent 100%)'
    },
  ]

  const chartData = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
  ]

  const COLORS = ['#FF9500', '#00FFD1', '#BD5FFF', '#FF2D55']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="relative rounded-3xl p-8 overflow-hidden z-0" style={{
          background: 'rgba(26, 26, 26, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <div className="absolute inset-0 bg-gradient-orange-purple opacity-[0.08]" />
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-neon-purple opacity-20 blur-[80px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-neon-orange opacity-20 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 tracking-tight">
                Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-on-surface-variant text-lg bg-surface-high/50 px-4 py-2 rounded-xl inline-flex items-center gap-2 mt-2 blur-backdrop backdrop-blur-sm border border-white/5">
                <Store className="w-5 h-5 text-neon-teal" /> 
                <span className="font-medium text-white">{user?.shop_name}</span> is thriving today.
              </p>
            </div>
            <div className="hidden md:flex h-24 w-24 rounded-2xl bg-gradient-to-br from-neon-orange/20 to-neon-purple/20 items-center justify-center border border-white/10 shadow-glow-sm transform rotate-3">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <div className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1" style={{
                  background: 'rgba(26, 26, 26, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                    background: stat.gradient
                  }} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-surface ${stat.shadowClass}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${stat.bgClass} ${stat.color}`}>
                        +12%
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-3xl font-display font-bold text-white tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Charts Section */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={containerVariants}>
          {/* Line Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="rounded-3xl p-6 h-96" style={{
              background: 'rgba(26, 26, 26, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-neon-orange"></span>
                Sales & Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#9CA3AF" axisLine={false} tickLine={false} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(26,26,26,0.9)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                    }} 
                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="basis" dataKey="sales" name="Sales" stroke="#FF9500" strokeWidth={4} dot={false} activeDot={{ r: 8, fill: '#FF9500', stroke: '#fff', strokeWidth: 2 }} />
                  <Line type="basis" dataKey="revenue" name="Revenue" stroke="#00FFD1" strokeWidth={4} dot={false} activeDot={{ r: 8, fill: '#00FFD1', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl p-6 h-96 flex flex-col" style={{
              background: 'rgba(26, 26, 26, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <h3 className="text-xl font-heading font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-neon-purple"></span>
                Sales Distribution
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60}
                      outerRadius={90} 
                      fill="#8884d8" 
                      dataKey="sales"
                      paddingAngle={5}
                      stroke="none"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(26,26,26,0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px' 
                      }} 
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Low Stock & Top Customers */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
          {/* Low Stock Items */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl p-6" style={{
              background: 'rgba(26, 26, 26, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-pink/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-neon-pink" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-white">Low Stock Alert</h3>
                    <p className="text-xs text-on-surface-variant">Immediate action required</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-neon-pink hover:text-white transition-colors">
                  View All
                </button>
              </div>

              {isLoading ? (
                <div className="h-48 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-3">
                  {insights?.low_stock_items && insights.low_stock_items.length > 0 ? (
                    insights.low_stock_items.slice(0, 4).map((item: any, idx: number) => (
                      <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-neon-pink/30 hover:bg-surface transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-surface border border-white/5 flex items-center justify-center group-hover:border-neon-pink/30 transition-colors">
                            <Package className="w-5 h-5 text-on-surface-variant group-hover:text-neon-pink" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{item.name}</p>
                            <p className="text-xs text-on-surface-variant font-mono mt-0.5">SKU: {item.sku}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.stock === 0 ? 'bg-neon-pink text-dark shadow-glow-sm shadow-neon-pink' : 'bg-neon-orange/20 text-neon-orange border border-neon-orange/20'
                          }`}>
                            {item.stock} left
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-neon-teal/10 flex items-center justify-center mx-auto mb-3">
                        <Package className="w-8 h-8 text-neon-teal" />
                      </div>
                      <p className="text-on-surface-variant font-medium">All items are well stocked!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Customers */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl p-6" style={{
              background: 'rgba(26, 26, 26, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neon-teal/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-neon-teal" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-white">Top Customers</h3>
                    <p className="text-xs text-on-surface-variant">Highest credit balance</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-neon-teal hover:text-white transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {customers.length > 0 ? (
                  customers.slice(0, 4).map((customer: any, idx: number) => (
                    <div key={idx} className="group flex items-center justify-between p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-neon-teal/30 hover:bg-surface transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-dark shadow-glow-sm" style={{
                          background: idx === 0 
                            ? 'linear-gradient(135deg, #FF9500 0%, #BD5FFF 100%)' 
                            : idx === 1 
                              ? 'linear-gradient(135deg, #00FFD1 0%, #00D9FF 100%)'
                              : 'linear-gradient(135deg, #FF2D55 0%, #BD5FFF 100%)'
                        }}>
                          {customer.name[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{customer.name}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-on-surface-variant mb-0.5">Udhaar</p>
                        <span className="text-base font-bold text-neon-orange tracking-tight">₹{customer.total_udhaar.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-on-surface-variant">No customers found.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}