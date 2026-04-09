import React, { useEffect, useState, useRef } from 'react'
import { LoadingSpinner } from '@/components/ui/Loading'
import { useAuthStore } from '@/store/authStore'
import { useAIStore } from '@/store/aiStore'
import { Send, Sparkles, AlertCircle, TrendingUp, Users, Bot } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ✅ AI PAGE
 * 
 * No auth checks here - ProtectedLayout handles it
 * Just render AI chat and handle interactions
 */
export const AIPage: React.FC = () => {
  const insights = useAIStore((state) => state.insights)
  const isLoading = useAIStore((state) => state.isLoading)
  const askQuestion = useAIStore((state) => state.askQuestion)
  const user = useAuthStore((state) => state.user)
  const [question, setQuestion] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "Hello! I'm your AI Business Assistant. Ask me anything about your sales, inventory, or customers." }
  ])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    useAIStore.getState().fetchInsights()
  }, [])

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isAsking])

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    const currentQuestion = question.trim()
    setQuestion('')
    setIsAsking(true)
    setChatHistory((prev) => [...prev, { role: 'user', content: currentQuestion }])

    try {
      const response = await askQuestion(currentQuestion)
      setChatHistory((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Failed to ask question:', error)
      setChatHistory((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsAsking(false)
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-64px)]">
      {/* Left Column - Insights (Hidden on small screens when typing, or displayed as cards) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="relative p-6 rounded-3xl overflow-hidden" style={{
            background: 'rgba(26, 26, 26, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-neon-purple opacity-20 blur-[100px] rounded-full" />
            <div className="relative z-10 flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-glow-sm" style={{ background: 'linear-gradient(135deg, #BD5FFF 0%, #00FFD1 100%)' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">Store Insights</h2>
                <p className="text-xs text-on-surface-variant">Live AI Analysis</p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-8 flex justify-center"><LoadingSpinner /></div>
            ) : (
              <div className="space-y-4 mt-6">
                <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-neon-orange/20 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-4 h-4 text-neon-orange" />
                    <p className="text-sm font-medium text-on-surface-variant">Pending Udhaar</p>
                  </div>
                  <p className="text-2xl font-bold text-white font-display">₹{(insights?.total_pending_udhaar || 0).toLocaleString('en-IN')}</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-neon-pink/20 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-4 h-4 text-neon-pink" />
                    <p className="text-sm font-medium text-on-surface-variant">Low Stock Alert</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-white font-display">{insights?.low_stock_items?.length || 0}</p>
                    {insights?.low_stock_items && insights.low_stock_items.length > 0 && (
                      <span className="text-xs bg-neon-pink/20 text-neon-pink px-2 py-1 rounded-full">{insights.low_stock_items[0].name} is low</span>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-neon-teal/20 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-4 h-4 text-neon-teal" />
                    <p className="text-sm font-medium text-on-surface-variant">Top Customer</p>
                  </div>
                  {insights?.top_3_customers && insights.top_3_customers.length > 0 ? (
                    <div>
                      <p className="text-lg font-bold text-white">{insights.top_3_customers[0].name}</p>
                      <p className="text-sm text-neon-teal">₹{insights.top_3_customers[0].total_udhaar.toLocaleString('en-IN')}</p>
                    </div>
                  ) : (
                    <p className="text-on-surface-variant">No data yet</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="p-6 rounded-3xl" style={{
            background: 'rgba(26, 26, 26, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}>
            <h3 className="font-bold text-white mb-4">Suggested Questions</h3>
            <div className="space-y-2">
              {[
                'Which items need restocking?',
                'Who owes the most udhaar?',
                'Summarize my inventory status.',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="w-full p-3 text-left text-sm bg-surface-low hover:bg-surface rounded-xl transition-colors border border-white/5 hover:border-neon-purple/50 text-on-surface-variant hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

      {/* Right Column - Chat Window */}
      <div className="flex-1 flex flex-col h-full rounded-3xl overflow-hidden relative" style={{
          background: 'rgba(19, 19, 19, 0.7)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Chat Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-neon-purple" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-teal rounded-full border-2 border-dark" />
              </div>
              <div>
                <h3 className="font-bold text-white">VyaparSeth AI</h3>
                <p className="text-xs text-neon-teal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-teal animate-pulse" />
                  Online
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            <AnimatePresence initial={false}>
              {chatHistory.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <Bot className="w-4 h-4 text-neon-purple" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[75%] px-5 py-3.5 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-neon-orange to-neon-purple text-dark font-medium shadow-glow-sm rounded-tr-sm'
                        : 'bg-surface-high border border-white/5 text-on-surface rounded-tl-sm'
                    }`}
                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center ml-3 mt-1 flex-shrink-0 text-white font-bold text-xs">
                      {user?.full_name[0] || 'U'}
                    </div>
                  )}
                </motion.div>
              ))}

              {isAsking && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start w-full">
                  <div className="w-8 h-8 rounded-full bg-surface-high flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <Bot className="w-4 h-4 text-neon-purple" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-surface-high border border-white/5">
                    <div className="flex gap-2 items-center h-2">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-neon-purple" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-neon-teal" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-neon-orange" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-surface/80 backdrop-blur-md border-t border-white/5">
            <form onSubmit={handleAskQuestion} className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Message VyaparSeth AI..."
                disabled={isAsking}
                className="w-full bg-surface-high border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-white focus:outline-none focus:border-neon-purple focus:ring-0 transition-colors disabled:opacity-50"
                style={{ boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)' }}
              />
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="absolute right-2 p-2.5 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white transition-colors disabled:opacity-50 disabled:bg-surface-high"
              >
                <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
              </button>
            </form>
            <p className="text-[10px] text-center text-on-surface-variant mt-3">
              VyaparSeth AI can make mistakes. Verify important financial decisions.
            </p>
          </div>

        </div>

      </div>
  )
}
