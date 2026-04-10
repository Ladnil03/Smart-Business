import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageCircle, CreditCard } from 'lucide-react'
import { Customer, Transaction, Bill } from '@/types'
import { LoadingSpinner } from '@/components/ui/Loading'
import { Modal } from '@/components/ui/Modal'
import { CustomerLedgerDrawer } from '@/components/CustomerLedgerDrawer'
import api from '@/lib/api'
import { useTransactionStore } from '@/store/transactionStore'

export const CustomerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { createTransaction } = useTransactionStore()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [payingCustomer, setPayingCustomer] = useState<Customer | null>(null)
  const [ledgerCustomer, setLedgerCustomer] = useState<Customer | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentNote, setPaymentNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [whatsappLoading, setWhatsappLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchCustomerData(id)
    }
  }, [id])

  const fetchCustomerData = async (customerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const [customerRes, billsRes] = await Promise.all([
        api.get(`/customers/${customerId}`),
        api.get(`/bills/customer/${customerId}`).catch(() => ({ data: { data: [] } }))
      ])

      setCustomer(customerRes.data.data.customer)
      setRecentTransactions(customerRes.data.data.recent_transactions || [])
      setBills(billsRes.data.data || [])
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? 'Customer not found. They may have been deleted.'
          : err.response?.data?.detail || 'Failed to load customer data'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSubmit = async () => {
    if (!customer || !payingCustomer || paymentAmount <= 0) return

    setIsSubmitting(true)
    try {
      await createTransaction({
        customer_id: customer.customer_id,
        type: 'payment',
        amount: paymentAmount,
        note: paymentNote,
      })

      // Refresh customer data
      if (id) {
        await fetchCustomerData(id)
      }

      setPayingCustomer(null)
      setPaymentAmount(0)
      setPaymentNote('')
    } catch (err) {
      console.error('Payment failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsappReminder = async () => {
    if (!customer) return

    setWhatsappLoading(true)
    try {
      const response = await api.get(`/customers/${customer.customer_id}/whatsapp-reminder`)
      const url = response.data.data.url
      window.open(url, '_blank')
    } catch (err) {
      console.error('WhatsApp reminder failed:', err)
    } finally {
      setWhatsappLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto text-center py-12">
        <p className="text-red-500">{error || 'Customer not found'}</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 px-4 py-2 bg-neon-teal text-black rounded-lg font-medium hover:bg-neon-teal/90"
        >
          Back to Customers
        </button>
      </div>
    )
  }

  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1">
          {/* Profile Card */}
          <div
            style={{
              background: 'rgba(26, 26, 26, 0.5)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            className="rounded-3xl p-6 mb-6"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-teal to-neon-purple flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">{initials}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{customer.name}</h2>
              <p className="text-on-surface-variant text-sm mb-3">📞 {customer.phone}</p>
              {customer.address && (
                <p className="text-on-surface-variant text-sm mb-2">📍 {customer.address}</p>
              )}
              {customer.created_at && (
                <p className="text-on-surface-variant text-xs">
                  Member since {new Date(customer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                </p>
              )}
            </div>

            <div className="border-t border-white/10 my-6 pt-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-neon-teal mb-1">
                  ₹{customer.total_udhaar.toLocaleString()}
                </p>
                <p className="text-sm text-on-surface-variant">Outstanding Udhaar</p>
              </div>

              {customer.total_udhaar > 0 && (
                <div className="space-y-3">
                  <button
                    onClick={() => setPayingCustomer(customer)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neon-teal/10 text-neon-teal hover:bg-neon-teal/20 transition-colors font-medium"
                  >
                    <CreditCard className="w-4 h-4" />
                    Collect Payment
                  </button>
                  <button
                    onClick={handleWhatsappReminder}
                    disabled={whatsappLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors font-medium disabled:opacity-50"
                  >
                    {whatsappLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                    Send Reminder
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Transactions */}
          <div
            style={{
              background: 'rgba(26, 26, 26, 0.5)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            className="rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
              {recentTransactions.length > 0 && (
                <button
                  onClick={() => setLedgerCustomer(customer)}
                  className="text-neon-purple hover:text-neon-purple/80 transition-colors text-sm font-medium"
                >
                  View All
                </button>
              )}
            </div>

            {recentTransactions.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => {
                  const isCredit = tx.type === 'credit'
                  const date = new Date(tx.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                  return (
                    <div
                      key={tx._id}
                      className={`p-3 rounded-xl border-l-4 ${
                        isCredit
                          ? 'bg-neon-orange/10 border-neon-orange'
                          : 'bg-neon-teal/10 border-neon-teal'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isCredit ? 'text-neon-orange' : 'text-neon-teal'
                            }`}
                          >
                            {isCredit ? 'Credit' : 'Payment'}
                          </p>
                          {tx.note && <p className="text-xs text-on-surface-variant mt-1">{tx.note}</p>}
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${
                              isCredit ? 'text-neon-orange' : 'text-neon-teal'
                            }`}
                          >
                            {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-on-surface-variant">{date}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bills History */}
          <div
            style={{
              background: 'rgba(26, 26, 26, 0.5)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            className="rounded-3xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">Bills History</h3>

            {bills.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No bills yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scroll">
                {bills.map((bill) => {
                  const billDate = new Date(bill.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })
                  return (
                    <div
                      key={bill.bill_id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">
                            Bill #{(bill.bill_id || bill._id || '').toString().slice(-8)}
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">{billDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-neon-teal">
                            ₹{(bill.total ?? bill.total_amount ?? 0).toLocaleString()}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              bill.paid === true
                                ? 'text-neon-teal'
                                : 'text-neon-pink'
                            }`}
                          >
                            {bill.paid ? 'Paid' : 'Unpaid'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collect Payment Modal */}
      <Modal
        isOpen={payingCustomer !== null}
        onClose={() => setPayingCustomer(null)}
        title="Collect Payment"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              Amount
            </label>
            <input
              type="number"
              min={1}
              max={customer?.total_udhaar}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-on-surface-variant focus:outline-none focus:border-neon-teal"
              placeholder="Enter amount"
            />
            <p className="text-xs text-on-surface-variant mt-1">
              Outstanding: ₹{customer?.total_udhaar.toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-2">
              Note (Optional)
            </label>
            <input
              type="text"
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-on-surface-variant focus:outline-none focus:border-neon-teal"
              placeholder="e.g. Cash received"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setPayingCustomer(null)}
              className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={isSubmitting || paymentAmount <= 0}
              className="flex-1 px-4 py-2 rounded-lg bg-neon-teal text-black font-medium hover:bg-neon-teal/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Ledger Drawer */}
      <CustomerLedgerDrawer
        customer={ledgerCustomer}
        onClose={() => setLedgerCustomer(null)}
      />
    </div>
  )
}
