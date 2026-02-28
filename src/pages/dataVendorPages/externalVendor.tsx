import React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Upload, AlertTriangle, History } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/navigationBar/navbar"
import { fetchWithAuth } from "../../utils/fetchWithAuth"
import * as XLSX from "xlsx"
import { isExcelFile } from "../supervisorPages/uploadLeadFile"


const DEFAULT_EMAILS = [
  "glenfiddich.apayart@itsbuzzmarketing.com", 
  "harold.bondoc@itsbuzzmarketing.com", 
  "jessie.fernando@itsbuzzmarketing.com", 
  "james.chavez@itsbuzzmarketing.com", 
  "kenneth.candor@itsbuzzmarketing.com",
  "queen.mercado@itsbuzzmarketing.com",
  "mark.villareal@itsbuzzmarketing.com"
]

const UPLOAD_URL = "https://app.itsbuzzmarketing.com";

// const UPLOAD_URL = "http://127.0.0.1:3173";
// const UPLOAD_URL = "https://combined-service.r9tsjnbaapfz8.us-east-1.cs.amazonlightsail.com/"

const ExternalVendorForm = () => {

  const [campaignName, setCampaignName] = useState("TM Debt")
  const [leadProviderName, setLeadProviderName] = useState("")
  const [affiliateId, setAffiliateId] = useState("")
  const [clickId, setClickId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [submitError, setSubmitError] = useState(false);
  const [isDragging, setIsDragging] = useState(false)
  const [note, setNote] = useState("")

  const { token } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const processFile = (file: File) => {
    const isXlsx = isExcelFile(file.name)
    
    if (isXlsx) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          // File is valid XLSX, proceed with setting it
          setFile(file)
        } catch (error) {
          console.error("Error parsing XLSX file:", error)
          alert("Failed to parse file. Please ensure it's a valid Excel/CSV file.")
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      // CSV or other files don't need special processing
      setFile(file)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!leadProviderName.trim()) {
      alert("Please enter a lead provider name")
      return
    }
    
    if (!file) {
      alert("Please upload a file before submitting")
      return
    }

    const formData = new FormData();

    const fieldsData = {
      campaignName: campaignName,
      leadProviderName: leadProviderName,
      affiliateId: affiliateId,
      clickId: clickId,
      note: note || "",
      sendToEmails: DEFAULT_EMAILS,
      file_name: file.name,
    };

    formData.append("fields", JSON.stringify(fieldsData))
    formData.append("file", file)

    setIsUploading(true)

    const response = await fetchWithAuth(`${UPLOAD_URL}/guides/vendorLeadForm`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    let responseData: any = null
    if (response.ok) {
      responseData = await response.json()
      if (responseData.status === "success") {
        setSubmitError(false)
        setResponseMessage("Lead file submitted successfully!")
      } else {
        setSubmitError(true)
        setResponseMessage("Something went wrong, please try again")
      }
    } else {
      setSubmitError(true)

      try{
        responseData = await response.json()
        const error = responseData.message
        setResponseMessage(error)
      }catch(error){
        setResponseMessage("Something went wrong, please try again")
      }
    }

    setIsUploading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <Navbar />
      <Card className="mt-16">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                External Vendor Lead Upload
              </CardTitle>
              <CardDescription>Upload lead files for external vendors</CardDescription>
            </div>
            {/* <Button 
              variant="outline" 
              onClick={() => {
                navigate("/data-vendor-navigation/lead-uploads")
              }}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              View Upload History
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Select
                value={campaignName}
                onValueChange={(value) => setCampaignName(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TM Debt">TM Debt</SelectItem>
                  <SelectItem value="Homebound">Homebound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lead Provider Name */}
            <div className="space-y-2">
              <Label htmlFor="lead-provider">Lead Provider Name *</Label>
              <Input
                id="lead-provider"
                value={leadProviderName}
                onChange={(e) => setLeadProviderName(e.target.value)}
                placeholder="Enter lead provider name"
                required
              />
            </div>

            {/* Affiliate ID */}
            <div className="space-y-2">
              <Label htmlFor="affiliate-id">Affiliate ID</Label>
              <Input
                id="affiliate-id"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
                placeholder="Enter affiliate ID (optional)"
              />
            </div>

            {/* Click ID */}
            <div className="space-y-2">
              <Label htmlFor="click-id">Click ID</Label>
              <Input
                id="click-id"
                value={clickId}
                onChange={(e) => setClickId(e.target.value)}
                placeholder="Enter click ID (optional)"
              />
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter an optional note"
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">File *</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    processFile(file)
                  }
                }}
              >
                <input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls,.txt,.zip"
                  onChange={handleFileUpload}
                  className="hidden"
                  required
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : "Drag and drop or click to upload file"}
                  </p>
                </label>
              </div>
            </div>

            {/* Response Message */}
            {responseMessage && (
              <Alert className={`border-${submitError ? "red" : "green"}-200 bg-${submitError ? "red" : "green"}-50`}>
                <AlertTriangle className={`h-4 w-4 ${submitError ? "text-red-600" : "text-green-600"}`} />
                <AlertDescription className={`text-${submitError ? "red" : "green"}-800`}>{responseMessage}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                className="px-8"
                onClick={handleSubmit}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Submit Lead File"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default ExternalVendorForm;
