import React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Badge } from "../../components/ui/badge"
import { Upload, X, Plus, AlertTriangle, History } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/navigationBar/navbar"

const DEFAULT_EMAILS = [
  "glenfiddich.apayart@itsbuzzmarketing.com", 
  "harold.bondoc@itsbuzzmarketing.com", 
  "jessie.fernando@itsbuzzmarketing.com", 
  "james.chavez@itsbuzzmarketing.com", 
  "kenneth.candor@itsbuzzmarketing.com"
]

const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com";
// const UPLOAD_URL = "http://127.0.0.1:3173";
// const UPLOAD_URL = "https://combined-service.r9tsjnbaapfz8.us-east-1.cs.amazonlightsail.com/"

const LeadFormPage = () => {

  const [campaignName, setCampaignName] = useState("")
  const [leadProviderName, setLeadProviderName] = useState("")
  const [preferredListName, setPreferredListName] = useState("")
  const [forthCRM, setForthCRM] = useState(false)
  const [hasNameColumns, setHasNameColumns] = useState(false)
  const [scrubbing, setScrubbing] = useState("")
  const [sendToEmails, setSendToEmails] = useState([...DEFAULT_EMAILS])

  const [newEmail, setNewEmail] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<string[][]>([])
  const [validationWarning, setValidationWarning] = useState("")
  const [responseMessage, setResponseMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [submitError, setSubmitError] = useState(false);
  const [confirmNameRequired, setConfirmNameRequired] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [note, setNote] = useState("")

  const { token } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const processCsvFile = (file: File) => {
    if (!(file && (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")))) return
    setCsvFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = text
        .split("\n")
        .slice(0, 5)
        .map((row) => row.split(","))
      setCsvPreview(rows)

      // Check for name fields
      const headers = rows[0]?.map((h) => h.toLowerCase().trim()) || []
      const hasFirstName = headers.some((h) => h.includes("first") && h.includes("name"))
      const hasLastName = headers.some((h) => h.includes("last") && h.includes("name"))
      const hasFullName = headers.some((h) => h.includes("full") && h.includes("name"))

      if (!hasFirstName && !hasLastName && !hasFullName) {
        if (campaignName === "TM_Debt") {
          setValidationWarning(
            "Warning: CSV may lack name fields. For TM_Debt campaigns, this file will not be sent unless ForthCRM is checked or name columns are confirmed.",
          )
        } else {
          setValidationWarning("Warning: CSV may lack name fields.")
        }
      } else {
        setValidationWarning("")
      }
    }
    reader.readAsText(file)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processCsvFile(file)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const addEmail = () => {

    if (!validateEmail(newEmail)) {
        alert("Please enter a valid email address")
        return
    }

    if (newEmail && !sendToEmails.includes(newEmail) && validateEmail(newEmail)) {
      setSendToEmails([...sendToEmails, newEmail])
      setNewEmail("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setSendToEmails(sendToEmails.filter((email) => email !== emailToRemove))
  }

  const handleSubmit = async () => {

    // Skip all validation for Data Warehouse campaign - only require CSV file
    if (campaignName === "Data Warehouse") {
      if (!csvFile) {
        alert("Please upload a CSV file before submitting")
        return
      }
      if (sendToEmails.length === 0) {
        alert("Please add at least one email address to send to")
        return
      }
    } else {
      // Original validation logic for other campaigns
      if (!forthCRM && !hasNameColumns && confirmNameRequired) {
        alert(
          "Please confirm that your CSV file contains name columns, or check ForthCRM if the opener will look up client info.",
        )
        return
      }
      
      if (sendToEmails.length === 0) {
        alert("Please add at least one email address to send to")
        return
      }
    }
     
    const formData = new FormData();

    // For Data Warehouse campaigns, provide default values for empty fields
    const fieldsData = {
      campaignName: campaignName,
      leadProviderName: campaignName === "Data Warehouse" ? (leadProviderName || "Data Warehouse") : leadProviderName,
      preferredListName: campaignName === "Data Warehouse" ? (preferredListName || "Data Warehouse") : preferredListName,
      forthCRM: campaignName === "Data Warehouse" ? false : forthCRM,
      hasNameColumns: campaignName === "Data Warehouse" ? false : hasNameColumns,
      scrubbing: campaignName === "Data Warehouse" ? false : (scrubbing === "yes" ? true : false),
      sendToEmails: sendToEmails,
      note: campaignName === "Data Warehouse" ? (note || "Data Warehouse upload") : note,
    };

    formData.append("fields", JSON.stringify(fieldsData))

    if (csvFile) {
      formData.append("file", csvFile)
    } else {
      alert("Please upload a CSV file before submitting")
      return
    }

    setIsUploading(true)

    const response = await fetch(`${UPLOAD_URL}/guides/uploadLeadForm`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
    })


    let responseData: any = null
    if (response.ok) {
      responseData = await response.json()
      if (responseData.status === "success") {
        setSubmitError(false)
        setResponseMessage("Lead file submitted successfully!")
        // window.location.reload()      
      }else{
        setSubmitError(true)
        setResponseMessage("Something went wrong, please try again")
      }
    } else {
        setSubmitError(true)
        setResponseMessage("Something went wrong, please try again")
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
                Lead Upload Form
              </CardTitle>
              <CardDescription>Upload CSV lead files with campaign details and recipient information</CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                navigate("/data-vendor-navigation/lead-uploads")
              }}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              View Upload History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Select
                value={campaignName}
                onValueChange={(value) => {
                  setCampaignName(value)
                  if (value === "TM_Debt") {
                    setConfirmNameRequired(true)
                  } else {
                    setConfirmNameRequired(false)
                  }
                  // Reset validation warnings when switching campaigns
                  if (value !== "TM_Debt") {
                    setValidationWarning("")
                  }

                  if (value === "Data Warehouse") {
                    setSendToEmails(["sathish.kothandam@itsbuzzmarketing.com", ...sendToEmails])
                  } else {
                    setSendToEmails(sendToEmails.filter((email) => email !== "sathish.kothandam@itsbuzzmarketing.com"))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Press1">Press1</SelectItem>
                  <SelectItem value="Press1A">Press1A</SelectItem>
                  <SelectItem value="Press1B">Press1B</SelectItem>
                  <SelectItem value="Press1C">Press1C</SelectItem>
                  <SelectItem value="Press1D">Press1D</SelectItem>
                  <SelectItem value="TM_Debt">TM_Debt</SelectItem>
                  <SelectItem value="Data Warehouse">Data Warehouse</SelectItem>
                </SelectContent>
              </Select>
              {campaignName === "Data Warehouse" && (
                <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                  ℹ️ Data Warehouse campaigns only require a CSV file upload. All other fields are optional.
                </p>
              )}
            </div>

            {/* Lead Provider Name */}
            <div className="space-y-2">
              <Label htmlFor="lead-provider">
                Lead Provider Name {campaignName === "Data Warehouse" ? "" : "*"}
              </Label>
              <Input
                id="lead-provider"
                value={leadProviderName}
                onChange={(e) => setLeadProviderName(e.target.value)}
                placeholder="Enter lead provider name"
                required={campaignName !== "Data Warehouse"}
              />
            </div>

            {/* Preferred List Name */}
            <div className="space-y-2">
              <Label htmlFor="preferred-list">Preferred List Name</Label>
              <Input
                id="preferred-list"
                value={preferredListName}
                onChange={(e) => setPreferredListName(e.target.value)}
                placeholder="Enter preferred list name (optional)"
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

            {/* CSV File Upload */}
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File *</Label>
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
                    processCsvFile(file)
                  }
                }}
              >
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  
                  required
                />
                <label htmlFor="csv-file" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {csvFile ? csvFile.name : "Drag and drop or click to upload CSV file"}
                  </p>
                </label>
              </div>
            </div>

            {/* CSV Preview */}
            {csvPreview.length > 0 && (
              <div className="space-y-2">
                <Label>CSV Preview (First 5 rows)</Label>
                <div className="border rounded-lg p-4 bg-gray-50 overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {csvPreview.map((row, index) => (
                        <tr key={index} className={index === 0 ? "font-semibold" : ""}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border-r pr-2 mr-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Validation Warning */}
            {validationWarning && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">{validationWarning}</AlertDescription>
              </Alert>
            )}

            {/* ForthCRM Checkbox */}
            <div className="flex items-center space-x-2" style={{ display: confirmNameRequired ? "flex" : "none" }}>
              <Checkbox
                id="forth-crm"
                checked={forthCRM}
                onCheckedChange={(checked) => setForthCRM(checked as boolean)}
              />
              <Label htmlFor="forth-crm">ForthCRM</Label>
            </div>

            {/* Name Columns Confirmation - only show when ForthCRM is unchecked */}
            <div className="flex items-center space-x-2" style={{ display: confirmNameRequired ? "flex" : "none" }}>
              <Checkbox
                id="has-name-columns"
                checked={hasNameColumns}
                disabled={forthCRM}
                onCheckedChange={(checked) => setHasNameColumns(checked as boolean)}
                className={forthCRM ? "opacity-50" : ""}
              />
              <Label htmlFor="has-name-columns" className={forthCRM ? "opacity-50 text-gray-400" : ""}>
                Confirm that the CSV file contains first name, last name, or full name columns
              </Label>
            </div>

            {/* Scrubbing Question */}
            {campaignName !== "Data Warehouse" && (
              <div className="space-y-3">
                <Label>Scrubbing Required? *</Label>
                <RadioGroup
                  value={scrubbing}
                  onValueChange={(value) => setScrubbing(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="scrubbing-yes" />
                    <Label htmlFor="scrubbing-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="scrubbing-no" />
                    <Label htmlFor="scrubbing-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Send To Emails */}
            <div className="space-y-4">
              <Label>Send To (Email Recipients)</Label>

              {/* Current Email List */}
              <div className="flex flex-wrap gap-2">
                {sendToEmails.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Add New Email */}
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Add email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
                />
                <Button type="button" onClick={addEmail} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
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
export default LeadFormPage;
