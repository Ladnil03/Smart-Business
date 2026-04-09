import React, { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface ImportUploadAreaProps {
  onFileSelect: (files: File[]) => void
  acceptedFormats?: string[]
  multiple?: boolean
  isLoading?: boolean
}

export const ImportUploadArea: React.FC<ImportUploadAreaProps> = ({
  onFileSelect,
  acceptedFormats = ['.csv', '.xlsx', '.xls', '.pdf', '.jpg', '.jpeg', '.png'],
  multiple = false,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase()
      return acceptedFormats.some(fmt => fmt === ext)
    })

    if (multiple) {
      setSelectedFiles([...selectedFiles, ...validFiles])
      onFileSelect([...selectedFiles, ...validFiles])
    } else {
      setSelectedFiles(validFiles.slice(0, 1))
      onFileSelect(validFiles.slice(0, 1))
    }
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFileSelect(newFiles)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full space-y-4">
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={{
          backgroundColor: isDragActive ? 'rgba(0, 255, 209, 0.05)' : 'rgba(26, 26, 26, 0.3)',
          borderColor: isDragActive ? '#00FFD1' : 'rgba(255, 255, 255, 0.1)',
        }}
        className="relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-neon-teal hover:bg-neon-teal/5"
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleChange}
          accept={acceptedFormats.join(',')}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            className="mb-4"
          >
            <Upload className="w-12 h-12 text-neon-teal" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">Drag & Drop files here</h3>
          <p className="text-sm text-on-surface-variant mb-3">or click to select files</p>
          <p className="text-xs text-on-surface-variant">
            Supported: CSV, Excel, PDF, Images (JPG, PNG)
          </p>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <div className="w-8 h-8 border-3 border-neon-teal border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>

      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <p className="text-sm font-semibold text-white">Selected Files:</p>
          {selectedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-surface-low border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-1.5 bg-neon-teal/10 rounded text-neon-teal">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 text-on-surface-variant hover:text-neon-pink hover:bg-neon-pink/10 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
