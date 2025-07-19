
'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  className?: string;
}

export function FileUpload({ onFileSelect, selectedFile, className }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/sql': ['.sql'],
      'text/plain': ['.sql']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false)
  });

  const removeFile = () => {
    onFileSelect(null as any);
  };

  return (
    <div className={cn("w-full", className)}>
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                isDragActive && !isDragReject
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                isDragReject && "border-red-500 bg-red-50 dark:bg-red-950/20"
              )}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ scale: isDragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                  <UploadCloud 
                    className={cn(
                      "h-8 w-8",
                      isDragActive && !isDragReject
                        ? "text-indigo-500"
                        : "text-slate-500"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    {isDragActive 
                      ? (isDragReject ? "Invalid file type" : "Drop your SQL file here")
                      : "Drop your SQL file here"
                    }
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    or click to browse files
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Supports PostgreSQL, MySQL, SQL Server, Oracle
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <File className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
