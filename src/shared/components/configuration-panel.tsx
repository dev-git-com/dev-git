"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { DATABASE_CONFIGS, FEATURES } from "../utils/constants";
import { GenerationConfig } from "../utils/types";

interface ConfigurationPanelProps {
  config: GenerationConfig;
  onConfigChange: (config: GenerationConfig) => void;
  className?: string;
}

export function ConfigurationPanel({
  config,
  onConfigChange,
  className,
}: ConfigurationPanelProps) {
  const updateConfig = (key: keyof GenerationConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>⚙️</span>
          <span>Configuration</span>
        </CardTitle>
        {/* <CardDescription>
          Customize your generated NestJS application
        </CardDescription> */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Database Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Output Database Type
          </label>
          <Select
            value={config.database_type.toString()}
            onValueChange={(value) =>
              updateConfig("database_type", parseInt(value))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select database type" />
            </SelectTrigger>
            <SelectContent>
              {DATABASE_CONFIGS.map((db) =>
                db.soon ? (
                  <div
                    key={db.id}
                    className={`flex items-center space-x-2 relative w-full cursor-default select-none rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${
                      db.soon ? "bg-slate-50" : ""
                    }`}
                  >
                    <span>{db.icon}</span>
                    <span>{db.label}</span>
                    <span className="text-amber-500 font-bold">
                      {db.soon && "Soon!"}
                    </span>
                  </div>
                ) : (
                  <SelectItem key={db.id} value={db.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <span>{db.icon}</span>
                      <span>{db.label}</span>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <div className="w-full h-10 bg-slate-100 border border-slate-500 border-dashed rounded-lg items-center flex justify-center">
            <label className="flex gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Select ORM Type
              <p className="text-amber-500 font-bold">Soon!</p>
            </label>
          </div>
          <div className="w-full h-10 bg-slate-100 border border-slate-500 border-dashed rounded-lg items-center flex justify-center">
            <label className="flex gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Select Backend Framework
              <p className="text-amber-500 font-bold">Soon!</p>
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose the target database for your generated application
          </p>
        </div>

        {/* Feature Toggles */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Features
          </h4>
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-lg">{feature.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 inline-flex items-center gap-2">
                    {feature.label}
                    <span className="text-amber-500 font-bold">
                      {feature.status}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {feature.desc}
                  </p>
                </div>
              </div>
              <Switch
                checked={config[feature.key]}
                onCheckedChange={(checked) =>
                  updateConfig(feature.key, checked)
                }
                className="shrink-0"
              />
            </motion.div>
          ))}
        </div>

        {/* Configuration Summary */}
        <div className="mt-6 p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
          <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
            Configuration Summary
          </h5>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p>
              • Database:{" "}
              {
                DATABASE_CONFIGS.find((db) => db.id === config.database_type)
                  ?.label
              }
            </p>
            <p>
              • Features: {FEATURES.filter((f) => config[f.key]).length} enabled
            </p>
            <p>• Authentication: JWT + Role-based access control</p>
            <p>• Documentation: README + TypeScript definitions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
