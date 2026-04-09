import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowUp, ArrowDown } from 'lucide-react'
import { Customer } from '@/types'
import { useTransactionStore } from '@/store/transactionStore'
import { LoadingSpinner } from './ui/Loading'

interface CustomerLedgerDrawerProps {
  customer: Customer | null
  onClose: () => void
}

export const CustomerLedgerDrawer: React.FC<CustomerLedgerDrawerProps> = ({
  customer,
  onClose,
}) => {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore()

  useEffect(() => {
    if (customer) {
      fetchTransactions(customer.customer_id)
    }
  }, [customer, fetchTransactions])

  if (!customer) return null

  // Compute running balance for each transaction
  let runningBalance = customer.total_udhaar
  const transactionsWithBalance = transactions.map((tx) => {
    const balanceAfter = runningBalance
    if (tx.type === 'payment') {
      runningBalance += tx.amount
    } else {
      runningBalance -= tx.amount
    }
    return { ...tx, balanceAfter }
  })

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

        {/* Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 h-full w-full max-w-lg bg-neutral-900 flex flex-col z-50"
          style={{
            background: 'rgba(26, 26, 26, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{customer.name}'s Ledger</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-2">📞 {customer.phone}</p>
            <div className="inline-block px-3 py-1 rounded-full bg-neon-teal/20 border border-neon-teal/40">
              <p className="text-sm text-neon-teal font-medium">
                Outstanding: ₹{customer.total_udhaar.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scroll">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center mx-auto mb-3 border border-neon-purple/20">
                  <ArrowUp className="w-8 h-8 text-neon-purple" />
                </div>
                <p className="text-on-surface-variant font-medium">No transactions yet</p>
                <p className="text-sm text-on-surface-variant/60 mt-1">Transaction history will appear here</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {transactionsWithBalance.map((tx) => {
                  const isCredit = tx.type === 'credit'
                  const isoDate = typeof tx.created_at === 'string' 
                    ? tx.created_at 
                    : (tx.created_at as any)?.toISOString?.() || new Date().toISOString()
                  const date = new Date(isoDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })

                  return (
                    <div
                      key={tx._id}
                      className={`p-4 rounded-2xl border-l-4 ${
                        isCredit
                          ? 'bg-neon-orange/10 border-neon-orange/40'
                          : 'bg-neon-teal/10 border-neon-teal/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isCredit ? (
                            <ArrowUp className={`w-4 h-4 text-neon-orange`} />
                          ) : (
                            <ArrowDown className={`w-4 h-4 text-neon-teal`} />
                          )}
                          <span className={`font-semibold ${isCredit ? 'text-neon-orange' : 'text-neon-teal'}`}>
                            {isCredit ? 'CREDIT' : 'PAYMENT'}
                          </span>
                        </div>
                        <span className={`font-bold ${isCredit ? 'text-neon-orange' : 'text-neon-teal'}`}>
                          ₹{tx.amount.toLocaleString()}
                        </span>
                      </div>
                      {tx.note && (
                        <p className="text-sm text-on-surface-variant mb-1">"{tx.note}"</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span>{date}</span>
                        <span>Balance after: ₹{tx.balanceAfter.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
