"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Github, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { FileUpload } from "./file-upload";
import { ConfigurationPanel } from "./configuration-panel";
import { OutputPanel } from "./output-panel";
import { GenerationConfig } from "../utils/types";
import { useToast } from "@/hooks/use-toast";

export function GeneratorInterface() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<GenerationConfig>({
    database_type: 1, // PostgreSQL default
    with_entities: true,
    with_crud: true,
    full_validations: true,
    date_fields: false,
    with_ftp: false,
    with_swagger: true,
    with_google_auth: false,
    with_jwt_auth: false,
  });
  const [outputState, setOutputState] = useState<
    "initial" | "processing" | "success" | "error"
  >("initial");
  const [error, setError] = useState<string>("");
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [schema, setSchema] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setOutputState("initial");
    setError("");
    setSchema(null);

    // Parse file immediately for preview
    if (file) {
      parseFile(file);
    }
  };

  const parseFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse file");
      }

      const result = await response.json();
      setSchema(result.schema);

      toast({
        title: "File parsed successfully",
        description: `Found ${result.schema.tableCount} tables in your SQL schema`,
      });
    } catch (err) {
      console.error("Parse error:", err);
      toast({
        title: "Parse error",
        description:
          err instanceof Error ? err.message : "Failed to parse SQL file",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a SQL file first",
        variant: "destructive",
      });
      return;
    }

    setOutputState("processing");
    setError("");

    try {
      setProcessingStatus("Parsing SQL schema...");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("config", JSON.stringify(config));

      setProcessingStatus("Generating TypeORM entities...");

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      setProcessingStatus("Creating project files...");

      // Get the zip file
      const blob = await response.blob();

      setProcessingStatus("Finalizing download...");

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedFile.name.replace(".sql", "")}-nestjs-app.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setOutputState("success");
      toast({
        title: "Generation complete!",
        description: "Your NestJS application has been downloaded",
      });
    } catch (err) {
      console.error("Generation error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setOutputState("error");
      toast({
        title: "Generation failed",
        description:
          err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    // Re-download the file
    handleGenerate();
  };

  const handleShare = () => {
    toast({
      title: "Link copied!",
      description: "Share this generator with other developers",
    });
  };

  return (
    <div className="min-h-screen text-slate-200">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl">
            <span className="text-blue-700">{"dev"}</span>
            <span className="text-white">{" > "}</span>
            <span className="text-amber-600">{"git"}</span>
            <sup className="text-slate-600">
              <em>{" alpha "}</em>
            </sup>
          </h2>
          <h2 className="text-4xl font-bold text-white mb-4">
            One Click - Generate Complete Backend Applications
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Transform your SQL schemas into production-ready backends with
            authentication, CRUD operations, and comprehensive features!
          </p>
          <p className="text-xl text-red-400 max-w-2xl mx-auto">
            Alpha: SQL to NestJS
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Generator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* File Upload */}
            <div className="space-y-4">
              <div className="w-full">
                <h3 className="text-lg font-semibold text-white">
                  1. Upload SQL Schema
                </h3>
                <p className="text-white flex flex-wrap items-center">
                  Use
                  <a
                    className="text-blue-400 px-1 underline hover:text-blue-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://onecompiler.com/"
                  >
                    OneCompiler.com
                  </a>
                  or
                  <a
                    className="text-blue-400 px-1 underline hover:text-blue-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://dbdiagram.io/"
                  >
                    dbdiagram.io
                  </a>
                </p>
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                2. Configure Features
              </h3>
              <ConfigurationPanel config={config} onConfigChange={setConfig} />
            </div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleGenerate}
                disabled={!selectedFile || outputState === "processing"}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg"
                size="lg"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                {outputState === "processing"
                  ? "Generating..."
                  : "Generate Application"}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <OutputPanel
              state={outputState}
              error={error}
              onDownload={handleDownload}
              onShare={handleShare}
              processingStatus={processingStatus}
              schema={schema}
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="border-t border-slate-800 mt-16"
      >
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-slate-400">
            A tool for the modern developer. Built with ❤️ for the Backend
            community.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
