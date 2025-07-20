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
import { Upload, X, Plus, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { useSelector } from "react-redux"

const DEFAULT_EMAILS = ["glenfiddich.apayart@itsbuzzmarketing.com", "harold.bondoc@itsbuzzmarketing.com", "jessie.fernando@itsbuzzmarketing.com"]

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

  const { token } = useSelector((state: any) => state.user);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)

      // Preview CSV content
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
          if (campaignName === "TM_Debt" && forthCRM) {
            setValidationWarning(
              "Warning: CSV may lack name fields. For TM_Debt campaigns, this file will not be sent unless ForthCRM is checked.",
            )
          } else if (forthCRM) {
            setValidationWarning("Warning: CSV may lack name fields. File may not be processed correctly.")
          }
        } else {
          setValidationWarning("")
        }
      }
      reader.readAsText(file)
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

    if (!forthCRM && !hasNameColumns) {
      alert(
        "Please confirm that your CSV file contains name columns, or check ForthCRM if the opener will look up client info.",
      )
      return
    }

    if (sendToEmails.length === 0) {
      alert("Please add at least one email address to send to")
      return
    }
     
    const formData = new FormData();

    formData.append("fields", JSON.stringify({
      campaignName: campaignName,
      leadProviderName: leadProviderName,
      preferredListName: preferredListName,
      forthCRM: forthCRM,
      hasNameColumns: hasNameColumns,
      scrubbing: scrubbing === "yes" ? true : false,
      sendToEmails: sendToEmails,
    }))

    if (csvFile) {
      formData.append("file", csvFile)
    } else {
      alert("Please upload a CSV file before submitting")
      return
    }


    const response = await fetch(`${UPLOAD_URL}/guides/uploadLeadForm`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
    })

    setIsUploading(true)

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Lead Upload Form
          </CardTitle>
          <CardDescription>Upload CSV lead files with campaign details and recipient information</CardDescription>
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
                  <SelectItem value="Press1">Press1</SelectItem>
                  <SelectItem value="Press1A">Press1A</SelectItem>
                  <SelectItem value="TM_Debt">TM_Debt</SelectItem>
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

            {/* CSV File Upload */}
            <div className="space-y-2">
              <Label htmlFor="csv-file">CSV File *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                    {csvFile ? csvFile.name : "Click to upload CSV file"}
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="forth-crm"
                checked={forthCRM}
                onCheckedChange={(checked) => setForthCRM(checked as boolean)}
              />
              <Label htmlFor="forth-crm">ForthCRM</Label>
            </div>

            {/* Name Columns Confirmation - only show when ForthCRM is unchecked */}
            <div className="flex items-center space-x-2">
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
