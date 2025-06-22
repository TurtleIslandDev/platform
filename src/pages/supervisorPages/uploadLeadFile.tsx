import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Upload, Search, CheckCircle, AlertCircle, X, Plus, List } from "lucide-react"
import React from "react";
import { useSelector } from "react-redux";

// Predefined column mappings with required fields 
// Received from @Jessie 20/06/2025, could be automated
const PREDEFINED_COLUMNS = [
  { id: "address1", label: "Address1", required: false },
  { id: "address2", label: "Address2", required: false },
  { id: "address3", label: "Address3", required: false },
  { id: "alt_phone", label: "Alt Phone", required: false },
  { id: "city", label: "City", required: false },
  { id: "comments", label: "Comments", required: false },
  { id: "country_code", label: "Country Code", required: false },
  { id: "date_of_birth", label: "Date of Birth", required: false },
  { id: "email", label: "Email", required: false },
  { id: "first_name", label: "First Name", required: false },
  { id: "gender", label: "Gender", required: false },
  { id: "gmt_offset_now", label: "GMT Offset Now", required: false },
  { id: "last_name", label: "Last Name", required: false },
  { id: "middle_initial", label: "Middle Initial", required: false },
  { id: "phone_number", label: "Phone Number", required: true },
  { id: "phone_code", label: "Phone Code", required: false },
  { id: "postal_code", label: "Postal Code", required: false },
  { id: "province", label: "Province", required: false },
  { id: "security_phrase", label: "Security Phrase", required: false },
  { id: "source_id", label: "Source ID", required: false },
  { id: "state", label: "State", required: false },
  { id: "title", label: "Title", required: false },
  { id: "vendor_lead_cod", label: "Vendor Lead Code", required: false },
  // { id: "rank", label: "Rank", required: false },
  // { id: "owner", label: "Owner", required: false },
  // { id: "call_type", label: "Call Type", required: false },
  // { id: "inbound_group", label: "Inbound Group", required: false },
  // { id: "record_status", label: "Record Status", required: false },
]


const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com";
// const UPLOAD_URL = "http://127.0.0.1:3173";
// const UPLOAD_URL = "https://combined-service.r9tsjnbaapfz8.us-east-1.cs.amazonlightsail.com/"

const UploadLeadFile = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvData, setCsvData] = useState<string[][]>([])
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [listId, setListId] = useState("")
  const [sourceId, setSourceId] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const { token } = useSelector((state: any) => state.user);



  // data to be fetched from the backend
  const [sourceOptions, setSourceOptions] = useState<{ id: string; name: string }[]>([])

  // fetch source options from the backend
  useEffect(() => {
    const fetchSourceOptions = async () => {
      const response = await fetch(`${UPLOAD_URL}/guides/fetch_sources`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      setSourceOptions(data.data)
    }

    fetchSourceOptions()
  }, [])

  
  
  // New state for source selection/creation
  const [sourceMode, setSourceMode] = useState<"select" | "create">("select")
  const [newSourceName, setNewSourceName] = useState("")
  const [newSourceDescription, setNewSourceDescription] = useState("")

  // Filter predefined columns based on search term
  const filteredColumns = PREDEFINED_COLUMNS.filter(
    (col) =>
      col.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle CSV file upload and parsing
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length > 0) {
        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
        const data = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))

        setCsvHeaders(headers)
        setCsvData(data)
        setFieldMappings({}) // Reset mappings when new file is uploaded
        setErrors([])
      }
    }

    reader.readAsText(file)
  }, [])

  // Handle field mapping with one-to-one constraint
  const handleFieldMapping = (csvField: string, predefinedField: string) => {
    setFieldMappings((prev) => {
      const newMappings = { ...prev }

      // Remove any existing mapping for this CSV field
      delete newMappings[csvField]

      // Remove any existing mapping that uses this predefined field
      Object.keys(newMappings).forEach((key) => {
        if (newMappings[key] === predefinedField) {
          delete newMappings[key]
        }
      })

      // Add the new mapping
      newMappings[csvField] = predefinedField

      return newMappings
    })
  }

  // Remove field mapping
  const removeFieldMapping = (csvField: string) => {
    setFieldMappings((prev) => {
      const newMappings = { ...prev }
      delete newMappings[csvField]
      return newMappings
    })
  }

  // Validate required fields
  const validateMappings = () => {
    const requiredFields = PREDEFINED_COLUMNS.filter((col) => col.required)
    const mappedFields = Object.values(fieldMappings)
    const missingRequired = requiredFields.filter((field) => !mappedFields.includes(field.id))

    const newErrors: string[] = []
    if (missingRequired.length > 0) {
      newErrors.push(`Missing required fields: ${missingRequired.map((f) => f.label).join(", ")}`)
    }

    if (!listId) newErrors.push("Please select a List ID")
    
    // Validate source based on mode
    if (sourceMode === "select") {
      if (!sourceId) newErrors.push("Please select a Source ID")
    } else {
      if (!newSourceName.trim()) newErrors.push("Please enter a new source name")
    }
    
    if (!csvFile) newErrors.push("Please upload a CSV file")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  // Handle new source creation
  const handleCreateNewSource = async (name: string, description: string) => {
    try {
      const newSource = {
        sourceName: name,
        description: description
      }
      

      const response = await fetch(`${UPLOAD_URL}/guides/create_source`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSource),
      })
      
      const data = await response.json()
      
      if (data.status == "success") {
        return newSource
      } else {
        throw new Error(data.message)
      }

    } catch (error) {
      console.error("Failed to create source:", error)
      throw error
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateMappings()) return

    setIsUploading(true)

    try {
      let finalSourceName = sourceId
      
      // If creating a new source, create it first
      if (sourceMode === "create") {
        const newSource = await handleCreateNewSource(newSourceName, newSourceDescription)

        finalSourceName = newSource.sourceName
      }

      // Prepare the data to send to server
      const payload = {
        file: csvFile,
        mappings: fieldMappings,
        list: listId,
        source: finalSourceName,
        headers: csvHeaders,
        data: csvData,
      }

      // Simulate API call
      console.log("Sending to server:", payload)


      const response = await fetch(`${UPLOAD_URL}/guides/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      
      if (responseData.status === "success") {
        const { success_count, original_count } = responseData.data
        alert(`Upload completed successfully!\n\nSuccessfully uploaded: ${success_count} leads\nOriginal count: ${original_count} leads`)
      } else {
        throw new Error(responseData.message || "Upload failed")
      }

      // Reset form
      setCsvFile(null)
      setCsvHeaders([])
      setCsvData([])
      setFieldMappings({})
      setListId("")
      setSourceId("")
      setErrors([])
      setSourceMode("select")
      setNewSourceName("")
      setNewSourceDescription("")

    } catch (error) {
      console.error("Upload failed:", error)
      setErrors(["Upload failed. Please try again."])
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Automated Lead Upload</h1>
        <p className="text-muted-foreground mt-2">Upload leads to VICI from a CSV file</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Upload and Configuration */}
        <div className="space-y-6">
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>Select your CSV file to begin the mapping process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">CSV File</Label>
                  <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} className="pt-0" />
                </div>

                {csvFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {csvFile.name} ({csvHeaders.length} columns, {csvData.length} rows)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Set the list ID, source ID, and template name for this upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="list-id">List ID *</Label>
                <Input
                  id="list-id"
                  placeholder="Enter list ID..."
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="source-id">Source ID *</Label>
                <Tabs value={sourceMode} onValueChange={(value) => setSourceMode(value as "select" | "create")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="select" className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Select Existing
                    </TabsTrigger>
                    <TabsTrigger value="create" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create New
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="select" className="mt-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Choose from existing sources in your system</p>
                      <Select value={sourceId} onValueChange={setSourceId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="create" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">Create a new source for this upload</p>
                    <div>
                      <Label htmlFor="new-source-name">Source Name *</Label>
                      <Input
                        id="new-source-name"
                        placeholder="Enter source name..."
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-source-description">Description (Optional)</Label>
                      <Input
                        id="new-source-description"
                        placeholder="Enter source description..."
                        value={newSourceDescription}
                        onChange={(e) => setNewSourceDescription(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={isUploading || csvHeaders.length === 0} className="w-full bg-blue-500 text-white" size="lg">
            {isUploading ? "Uploading..." : "Upload & Process CSV"}
          </Button>
        </div>

        {/* Right Column - Field Mapping */}
        <div className="space-y-6">
          {csvHeaders.length > 0 && (
            <>
              {/* Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search CSV Columns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search CSV columns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Field Mapping */}
              <Card>
                <CardHeader>
                  <CardTitle>Field Mapping</CardTitle>
                  <CardDescription>
                    Map VICI fields to your CSV columns. Required fields are marked with *
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {PREDEFINED_COLUMNS.map((predefinedField) => {
                      // Find which CSV field is mapped to this predefined field
                      const mappedCsvField = Object.keys(fieldMappings).find(
                        (csvField) => fieldMappings[csvField] === predefinedField.id,
                      )

                      // Filter CSV headers based on search term
                      const filteredCsvHeaders = csvHeaders.filter((header) =>
                        header.toLowerCase().includes(searchTerm.toLowerCase()),
                      )

                      return (
                        <div key={predefinedField.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium flex items-center gap-2">
                              {predefinedField.label}
                              {predefinedField.required && <span className="text-red-500">*</span>}
                            </Label>
                            {mappedCsvField && (
                              <Button variant="ghost" size="sm" onClick={() => removeFieldMapping(mappedCsvField)}>
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {mappedCsvField ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                {mappedCsvField}
                              </Badge>
                            </div>
                          ) : (
                            <Select
                              value={mappedCsvField || ""}
                              onValueChange={(value) => handleFieldMapping(value, predefinedField.id)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select CSV column..." />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredCsvHeaders
                                  .filter(
                                    (header) =>
                                      // Show if not mapped, or if it's currently mapped to this predefined field
                                      !Object.keys(fieldMappings).includes(header) ||
                                      fieldMappings[header] === predefinedField.id,
                                  )
                                  .map((header) => (
                                    <SelectItem key={header} value={header}>
                                      {header}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Mapping Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Mapping Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {PREDEFINED_COLUMNS.map((predefinedField) => {
                      const mappedCsvField = Object.keys(fieldMappings).find(
                        (csvField) => fieldMappings[csvField] === predefinedField.id,
                      )

                      if (!mappedCsvField) return null

                      return (
                        <div key={predefinedField.id} className="flex items-center justify-between text-sm">
                          <Badge variant={predefinedField.required ? "default" : "secondary"}>
                            {predefinedField.label}
                            {predefinedField.required && <span className="ml-1">*</span>}
                          </Badge>
                          <span className="text-muted-foreground">←</span>
                          <span className="font-medium">{mappedCsvField}</span>
                        </div>
                      )
                    })}

                    {Object.keys(fieldMappings).length === 0 && (
                      <p className="text-muted-foreground text-sm">No mappings configured yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadLeadFile;