
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, CheckCircle, AlertTriangle, Clock, Code, Database, Shield, Book } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface OutputPanelProps {
  state: 'initial' | 'processing' | 'success' | 'error';
  error?: string;
  onDownload?: () => void;
  onShare?: () => void;
  processingStatus?: string;
  schema?: {
    tableCount: number;
    tables: Array<{ name: string; columnCount: number; hasRelationships: boolean }>;
    dialect: string;
  };
  className?: string;
}

export function OutputPanel({ 
  state, 
  error, 
  onDownload, 
  onShare, 
  processingStatus, 
  schema,
  className 
}: OutputPanelProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NestJS Schema Generator',
        text: 'Generate complete NestJS applications from SQL schemas',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Could show a toast here
      });
    }
    onShare?.();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📦</span>
          <span>Output</span>
        </CardTitle>
        {/* <CardDescription>
          Your generated NestJS application will appear here
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {state === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="text-center py-8">
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Code className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  How It Works
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Upload your SQL schema and get a complete backend application
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Database,
                    title: 'Parse SQL Schema',
                    description: 'Extract tables, relationships, and constraints'
                  },
                  {
                    icon: Shield,
                    title: 'Generate Security',
                    description: 'JWT authentication with role-based access'
                  },
                  {
                    icon: Code,
                    title: 'Create Code',
                    description: 'TypeORM entities, controllers, and services'
                  },
                  {
                    icon: Book,
                    title: 'Add Documentation',
                    description: 'README, Swagger docs, and type definitions'
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <step.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Generating Your Application
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {processingStatus || 'Processing your SQL schema...'}
              </p>
              
              {schema && (
                <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Schema Analysis
                  </h4>
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p>• Found {schema.tableCount} tables</p>
                    <p>• Detected {schema.dialect} syntax</p>
                    <p>• Relationships: {schema.tables.filter(t => t.hasRelationships).length}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {state === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                Application Ready!
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400 mb-6">
                Your NestJS application has been generated successfully
              </p>

              <div className="space-y-3">
                <Button 
                  onClick={onDownload} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Application
                </Button>
                
                <Button 
                  onClick={handleShare} 
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Generator
                </Button>
              </div>

              {schema && (
                <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                    Generated Features
                  </h4>
                  <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                    <p>• {schema.tableCount} Entity classes with TypeORM</p>
                    <p>• Complete CRUD API endpoints</p>
                    <p>• JWT Authentication & Authorization</p>
                    <p>• Input validation & error handling</p>
                    <p>• Production-ready configuration</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {state === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
                Generation Failed
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error || 'An unexpected error occurred'}
              </p>
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 text-left">
                <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                  Common Issues
                </h4>
                <ul className="space-y-1 text-xs text-red-700 dark:text-red-300">
                  <li>• Ensure SQL file contains CREATE TABLE statements</li>
                  <li>• Check for syntax errors in your SQL</li>
                  <li>• File size should be under 10MB</li>
                  <li>• Supported formats: PostgreSQL, MySQL, SQL Server, Oracle</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
