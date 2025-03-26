
import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { CSVMapper } from "../../components/CSVMapper/CSVMapper"
import { PlusCircle, Upload } from "lucide-react"
import { set } from "react-hook-form";
import { useSelector } from "react-redux";


// Available data types 
// TODO : Use this later to set data types for fields
const dataTypes = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Yes/No" },
]

// const UPLOAD_URL = "https://combined-service.r9tsjnbaapfz8.us-east-1.cs.amazonlightsail.com/"
// const UPLOAD_URL = "http://localhost:3173"
const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com/"


export default function CreateTemplatePage() {
  const [activeTab, setActiveTab] = useState("existing")
  const [selectedSource, setSelectedSource] = useState("")
  const [newSourceName, setNewSourceName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [newTemplateName, setNewTemplateName] = useState("")
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [mappings, setMappings] = useState<Record<string, { fieldId: string; dataType: string; included: boolean }>>({})
  const [isUploaded, setIsUploaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [predefinedFields, setPredefinedFields] = useState<{ id: string; name: string; key: string; description: string; dataType: string }[]>([])
  const [dataSources, setDataSources] = useState<{ id: string; name: string }[]>([])
  const [templates, setTemplates] = useState<{ id: string; name: string; sourceId: string }[]>([])

  const {token} = useSelector((state: { user: { token: string } }) => state.user);

  useEffect(() => {

    async function fetchFields(){
      const response = await fetch(
        `${UPLOAD_URL}/guides/get_fields`,
        {
          method: "GET",
          headers: {            
            Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json()
        const fields = data.data



        const displayFields: { id: string; name: string; key: string; description: string; dataType: string;   }[] = []

        // add id, name, label, dataType to fields
        fields.forEach((field: any, index) => {
          const newField = {
            id: index,
            key: field["key"],
            name: field["name"],
            description: field["description"],
            dataType: "string"
          }          

          displayFields.push(newField)

        }) 
      
        setPredefinedFields(displayFields)

        
        return
      }
      

    }

    
    async function getSourcesTemplates(){

      const response = await fetch(`${UPLOAD_URL}/guides/get_all_sources`,
        {
          method: "GET",
          headers: {            
            Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json()
        const sources = data.data.sources
        const templates = data.data.templates
        
        setDataSources(sources)
        setTemplates(templates)

        return
      }

    }

    fetchFields()
    getSourcesTemplates()
    
  }, [])
  

  // Filter templates based on selected source
  const filteredTemplates = templates.filter((template) => template.sourceId === selectedSource)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (content) {
        const lines = content.split("\n")
        if (lines.length > 0) {
          const headers = lines[0].split(",").map((header) => header.trim())
          setCsvHeaders(headers)

          // Initialize mappings with empty values and included
          const initialMappings: Record<string, { fieldId: string; dataType: string; included: boolean }> = {}
          headers.forEach((header) => {
            initialMappings[header] = { fieldId: "", dataType: "string", included: true }
          })
          setMappings(initialMappings)
          setIsUploaded(true)
        }
      }
    }
    reader.readAsText(file)
  }

  const handleFieldMapping = (header: string, fieldId: string) => {    
    setMappings((prev) => ({
      ...prev,
      [header]: {
        ...prev[header],
        fieldId,
        included: true, // Ensure it's included when mapped
      },
    }))    
  }

  const handleDataTypeChange = (header: string, dataType: string) => {
    setMappings((prev) => ({
      ...prev,
      [header]: { ...prev[header], dataType },
    }))
  }

  const handleIncludeChange = (header: string, included: boolean) => {
    setMappings((prev) => ({
      ...prev,
      [header]: {
        ...prev[header],
        included,
        fieldId: included ? prev[header].fieldId : "", // Clear fieldId if excluded
      },
    }))
  }

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    const templateData = {
      sourceId: activeTab === "existing" ? selectedSource : "new",
      sourceName: activeTab === "existing" ? dataSources.find((s) => s.id === selectedSource)?.name : newSourceName,
      templateId: selectedTemplate || "new",
      templateName: selectedTemplate ? filteredTemplates.find((t) => t.id === selectedTemplate)?.name : newTemplateName,
      mappings: Object.entries(mappings).reduce(
        (acc, [header, mapping]) => {
          if (mapping.included) {
            acc[header] = {
              fieldId: mapping.fieldId || header, // Use header as fieldId if "Include as is"
              dataType: mapping.dataType,
            }
          }
          return acc
        },
        {} as Record<string, { fieldId: string; dataType: string }>,
      ),
    }

    // submit 
    fetch(`${UPLOAD_URL}/guides/create_template`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(templateData),
    })
    
    
    // Reset form or show success message
    alert("Template saved successfully!")
  }

  return (
    <main className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>CSV Field Mapper</CardTitle>
          <CardDescription>
            Upload a CSV file and map its headers to predefined fields to create a template.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-6 w-6" />
                <span>{isUploaded ? "Change File" : "Click to upload CSV"}</span>
              </Button>
            </div>
            {isUploaded && (
              <p className="text-sm text-green-600">File uploaded successfully. {csvHeaders.length} headers found.</p>
            )}
          </div>

          {isUploaded && (
            <>
              {/* Data Source Selection */}
              <div className="space-y-4">
                <Label>Data Source</Label>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Use Existing Source</TabsTrigger>
                    <TabsTrigger value="new">Create New Source</TabsTrigger>
                  </TabsList>
                  <TabsContent value="existing" className="space-y-4 pt-4">
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a data source" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataSources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedSource && (
                      <div className="space-y-2">
                        <Label>Template</Label>
                        <div className="flex gap-2">
                          <Select
                            value={selectedTemplate}
                            onValueChange={setSelectedTemplate}
                            disabled={!selectedSource}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedTemplate("")
                              setNewTemplateName("")
                            }}
                            disabled={!selectedSource}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New
                          </Button>
                        </div>

                        {selectedTemplate === "" && (
                          <div className="pt-2">
                            <Label htmlFor="new-template">New Template Name</Label>
                            <Input
                              id="new-template"
                              value={newTemplateName}
                              onChange={(e) => setNewTemplateName(e.target.value)}
                              placeholder="Enter template name"
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="new" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-source">New Data Source Name</Label>
                      <Input
                        id="new-source"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        placeholder="Enter data source name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-template-name">New Template Name</Label>
                      <Input
                        id="new-template-name"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        placeholder="Enter template name"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Field Mapping Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Map CSV Headers to Fields</Label>
                </div>
                <CSVMapper
                  headers={csvHeaders}
                  predefinedFields={predefinedFields}
                  dataTypes={dataTypes}
                  mappings={mappings}
                  onFieldMapping={handleFieldMapping}
                  onDataTypeChange={handleDataTypeChange}
                  onIncludeChange={handleIncludeChange}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              !isUploaded ||
              (activeTab === "existing" && !selectedSource) ||
              (activeTab === "new" && !newSourceName) ||
              (!selectedTemplate && !newTemplateName)
            }
            className="ml-auto"
          >
            Save Template
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

