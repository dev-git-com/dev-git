"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const AppGeneratorForm = () => {
  const [formData, setFormData] = useState({
    dbType: "",
    database: "",
    backendFramework: "NestJS",
    authentication: "",
    ftpEnabled: false,
    loggerEnabled: false,
    cacheEnabled: false,
    searchEngine: "",
    useLocalTime: true,
    dateFormat: "",
    adminJsEnabled: false,
    adminPanelEnabled: false,
    paymentEnabled: false,
    graphqlEnabled: false,
    i18nEnabled: false,
    rateLimitingEnabled: false,
    paginationEnabled: false,
    realTimeEnabled: false,
    entities: [],
  })

  const databases = {
    SQL: ["PostgreSQL", "MySQL"],
    "No-SQL": ["MongoDB"],
  }

  const searchEngines = ["ElasticSearch", "MeiliSearch"]
  const dateFormats = ["YYYY-MM-DD", "MM/DD/YYYY", "DD/MM/YYYY"]
  const authMethods = ["JWT", "OAuth"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "generated-app.zip"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error generating application:", error)
    }
  }

  const handleEntityAdd = () => {
    setFormData({
      ...formData,
      entities: [...formData.entities, { name: "", fields: [] }],
    })
  }

  const handleEntityChange = (index: number, field: string, value: string) => {
    const newEntities = [...formData.entities]
    newEntities[index] = { ...newEntities[index], [field]: value }
    setFormData({ ...formData, entities: newEntities })
  }

  const handleFieldAdd = (entityIndex: number) => {
    const newEntities = [...formData.entities]
    newEntities[entityIndex].fields.push({
      name: "",
      type: "",
      defaultValue: "",
      validations: "",
      length: "",
      isAutoIncrement: false,
      isNullable: false,
      isUnique: false,
    })
    setFormData({ ...formData, entities: newEntities })
  }

  const handleFieldChange = (entityIndex: number, fieldIndex: number, field: string, value: string | boolean) => {
    const newEntities = [...formData.entities]
    newEntities[entityIndex].fields[fieldIndex] = { ...newEntities[entityIndex].fields[fieldIndex], [field]: value }
    setFormData({ ...formData, entities: newEntities })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Backend Application Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Database Selection */}
            <div className="space-y-2">
              <Label>Database Type</Label>
              <Select
                value={formData.dbType}
                onValueChange={(value) => setFormData({ ...formData, dbType: value, database: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SQL">SQL</SelectItem>
                  <SelectItem value="No-SQL">No-SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Database</Label>
              <Select
                value={formData.database}
                onValueChange={(value) => setFormData({ ...formData, database: value })}
                disabled={!formData.dbType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Database" />
                </SelectTrigger>
                <SelectContent>
                  {formData.dbType &&
                    databases[formData.dbType].map((db) => (
                      <SelectItem key={db} value={db}>
                        {db}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Authentication */}
            <div className="space-y-2">
              <Label>Authentication Method</Label>
              <Select
                value={formData.authentication}
                onValueChange={(value) => setFormData({ ...formData, authentication: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Auth Method" />
                </SelectTrigger>
                <SelectContent>
                  {authMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Engine */}
            <div className="space-y-2">
              <Label>Search Engine</Label>
              <Select
                value={formData.searchEngine}
                onValueChange={(value) => setFormData({ ...formData, searchEngine: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Search Engine" />
                </SelectTrigger>
                <SelectContent>
                  {searchEngines.map((engine) => (
                    <SelectItem key={engine} value={engine}>
                      {engine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                value={formData.dateFormat}
                onValueChange={(value) => setFormData({ ...formData, dateFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Date Format" />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "FTP Access", key: "ftpEnabled" },
              { label: "Logger & Error Logger", key: "loggerEnabled" },
              { label: "Redis Cache", key: "cacheEnabled" },
              { label: "AdminJS", key: "adminJsEnabled" },
              { label: "Admin Panel for APIs", key: "adminPanelEnabled" },
              { label: "GraphQL", key: "graphqlEnabled" },
              { label: "i18n/Localization", key: "i18nEnabled" },
              { label: "Rate Limiting", key: "rateLimitingEnabled" },
              { label: "Pagination & Lazy Loading", key: "paginationEnabled" },
              { label: "Real-Time Features", key: "realTimeEnabled" },
            ].map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <Switch
                  id={key}
                  checked={formData[key]}
                  onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                />
              </div>
            ))}
          </div>

          {/* Entity Configuration */}
          <div className="space-y-4">
            <Label>Entities & Relations</Label>
            {formData.entities.map((entity, entityIndex) => (
              <div key={entityIndex} className="border p-4 rounded">
                <Input
                  placeholder="Entity Name"
                  value={entity.name}
                  onChange={(e) => handleEntityChange(entityIndex, "name", e.target.value)}
                />
                {entity.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="mt-2 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Field Name"
                      value={field.name}
                      onChange={(e) => handleFieldChange(entityIndex, fieldIndex, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Field Type"
                      value={field.type}
                      onChange={(e) => handleFieldChange(entityIndex, fieldIndex, "type", e.target.value)}
                    />
                    {/* Add more field properties as needed */}
                  </div>
                ))}
                <Button type="button" onClick={() => handleFieldAdd(entityIndex)} className="mt-2">
                  Add Field
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleEntityAdd}>
              Add Entity
            </Button>
          </div>

          <Button type="submit" className="w-full">
            Generate Application
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AppGeneratorForm

