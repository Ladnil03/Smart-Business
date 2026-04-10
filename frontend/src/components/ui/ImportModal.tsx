import React, { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { ImportUploadArea } from '@/components/ui/ImportUploadArea'
import { useImportStore } from '@/store/importStore'
import { useToastStore } from '@/store/toastStore'
import { useCustomerStore } from '@/store/customerStore'
import { useProductStore } from '@/store/productStore'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'customers' | 'products' | 'bills'
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, type }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload')

  const importStore = useImportStore()
  const showToast = useToastStore((state) => state.showToast)
  const customerStore = useCustomerStore()
  const productStore = useProductStore()

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return

    try {
      importStore.setError(null)
      let previewData: any = null
      
      if (type === 'customers') {
        previewData = await importStore.importCustomersFromFile(files[0])
      } else if (type === 'products') {
        previewData = await importStore.importProductsFromFile(files[0])
      } else if (type === 'bills') {
        previewData = await importStore.importBillsFromFile(files[0])
      }
      
      console.log(`File processed, preview data length: ${previewData?.length || 0}`)
      if (!previewData || previewData.length === 0) {
        importStore.setError('No valid data found in file. Check column headers match expected format.')
        return
      }
      
      setStep('preview')
    } catch (err) {
      console.error('File select error:', err)
      showToast('Failed to parse file. Check browser console for details.', 'error')
    }
  }

  const handleConfirmImport = async () => {
    try {
      if (type === 'customers') {
        await importStore.bulkImportCustomers(importStore.previewData)
        await customerStore.fetchCustomers()
      } else if (type === 'products') {
        await importStore.bulkImportProducts(importStore.previewData)
        await productStore.fetchProducts()
      } else if (type === 'bills') {
        await importStore.bulkImportBills(importStore.previewData)
      }

      showToast(
        `Successfully imported ${importStore.previewData.length} ${type}`,
        'success'
      )
      setStep('complete')
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      showToast(`Failed to import ${type}`, 'error')
    }
  }

  const handleClose = () => {
    setStep('upload')
    importStore.clearPreview()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Import ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
      <div className="space-y-4 min-h-64">
        {step === 'upload' && (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              Upload CSV or Excel file with {type} data
            </p>
            <ImportUploadArea
              onFileSelect={handleFileSelect}
              isLoading={importStore.isLoading}
              multiple={false}
            />
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scroll">
            {importStore.isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-neon-teal/5 border border-neon-teal/30 rounded-lg flex items-center gap-3 justify-center"
              >
                <div className="w-4 h-4 border-2 border-neon-teal border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-neon-teal font-medium">Processing your file...</p>
              </motion.div>
            )}

            {importStore.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-neon-pink flex-shrink-0" />
                <p className="text-sm text-neon-pink">{importStore.error}</p>
              </motion.div>
            )}

            {!importStore.isLoading && importStore.previewData.length === 0 && !importStore.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-neon-orange/5 border border-neon-orange/30 rounded-lg text-center"
              >
                <p className="text-sm text-neon-orange font-medium">No data found or file is still processing...</p>
                <p className="text-xs text-on-surface-variant mt-1">Try uploaded a file with proper headers</p>
              </motion.div>
            )}

            {importStore.previewData.length > 0 && (
              <>
                <div className="flex items-center gap-2 p-3 bg-neon-teal/10 border border-neon-teal/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-neon-teal flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Found <span className="font-bold">{importStore.previewData.length}</span> {type} ready to import
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase">Preview (First 3):</p>
                  {importStore.previewData.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-2 bg-surface-low border border-white/5 rounded text-xs">
                      <pre className="text-on-surface-variant overflow-x-auto whitespace-pre-wrap break-words">
                        {JSON.stringify(item, null, 1).substring(0, 150)}...
                      </pre>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep('upload')}
                    className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    disabled={importStore.isLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-teal to-neon-blue text-dark font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {importStore.isLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Confirm Import
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-64 gap-4"
          >
            <CheckCircle className="w-12 h-12 text-neon-teal" />
            <p className="text-lg font-bold text-white">Import Successful!</p>
            <p className="text-sm text-on-surface-variant">
              {importStore.previewData.length} {type} imported successfully
            </p>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}
