import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Upload, Search, CheckCircle, AlertCircle, X, Plus, List, FileCheck, Shield, Download } from "lucide-react"
import React from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navigationBar/navbar";
import { autoMapColumns } from "../../utils/columnMapper";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import * as XLSX from "xlsx";

// Predefined column mappings with required fields 
// Received from @Jessie 20/06/2025, could be automated
const BASE_COLUMNS = [
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
  { id: "source_id", label: "Source ID", required: false },
  { id: "security_phrase", label: "Security Phrase", required: false },
  { id: "state", label: "State", required: false },
  { id: "title", label: "Title", required: false },
]

// Extra fields used only for Homebound campaign
const HOMEBOUND_EXTRA_COLUMNS = [
  { id: "mortgage_balance", label: "Mortgage Balance", required: false },
  { id: "ltv", label: "LTV", required: false },
  { id: "credit_grade", label: "Credit Grade", required: false },
  { id: "interest_rate", label: "Interest Rate", required: false },
  { id: "fico_score", label: "Fico Score", required: false },
  { id: "ssn", label: "SSN", required: false },
  // { id: "vendor_lead_cod", label: "Vendor Lead Code", required: false },
  // { id: "rank", label: "Rank", required: false },
  // { id: "owner", label: "Owner", required: false },
  // { id: "call_type", label: "Call Type", required: false },
  // { id: "inbound_group", label: "Inbound Group", required: false },
  // { id: "record_status", label: "Record Status", required: false },
]

// Extra fields used only for Homebound campaign
const HOMEBOUND_EXTRA_COLUMNS = [
  { id: "mortgage_balance", label: "Mortgage Balance", required: false },
  { id: "ltv", label: "LTV", required: false },
  { id: "credit_grade", label: "Credit Grade", required: false },
  { id: "interest_rate", label: "Interest Rate", required: false },
  { id: "fico_score", label: "Fico Score", required: false },
  { id: "ssn", label: "SSN", required: false },
  // { id: "vendor_lead_cod", label: "Vendor Lead Code", required: false },
  // { id: "rank", label: "Rank", required: false },
  // { id: "owner", label: "Owner", required: false },
  // { id: "call_type", label: "Call Type", required: false },
  // { id: "inbound_group", label: "Inbound Group", required: false },
  // { id: "record_status", label: "Record Status", required: false },
]

// 
// const UPLOAD_URL = "https://endpoint.itsbuzzmarketing.com";
const UPLOAD_URL = "https://app.itsbuzzmarketing.com"
// const UPLOAD_URL = "http://127.0.0.1:3173";
// const UPLOAD_URL = "https://combined-service.r9tsjnbaapfz8.us-east-1.cs.amazonlightsail.com/"

const isExcelFile = (filename: string): boolean => {
  return /\.xlsx?$/i.test(filename)
}

const UploadLeadFile = () => {
  const navigate = useNavigate();
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [csvData, setCsvData] = useState<string[][]>([])
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [listId, setListId] = useState("")
  const [sourceId, setSourceId] = useState("")
  const [campaignName, setCampaignName] = useState("")
  const [vendorLeadCode, setVendorLeadCode] = useState("")
  const [skipScrubbing, setSkipScrubbing] = useState(true)
  const [skipDncCheck, setSkipDncCheck] = useState(false)
  const [downloadFile, setDownloadFile] = useState(true)
  const [showTestMode, setShowTestMode] = useState(false)
  
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const { token } = useSelector((state: any) => state.user);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [stepStatus, setStepStatus] = useState<{
    step1: 'pending' | 'loading' | 'success' | 'error'
    step2: 'pending' | 'loading' | 'success' | 'error'
    step3: 'pending' | 'loading' | 'success' | 'error'
    step4: 'pending' | 'loading' | 'success' | 'error'
  }>({
    step1: 'pending',
    step2: 'pending',
    step3: 'pending',
    step4: 'pending'
  })
  const [modalError, setModalError] = useState<string>("")
  const [downloadBlob, setDownloadBlob] = useState<Blob | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string>("")
  const [duplicateBlob, setDuplicateBlob] = useState<Blob | null>(null)
  const [duplicateFilename, setDuplicateFilename] = useState<string>("")
  const [uploadFileName, setUploadFileName] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [enableDuplicateCheck, setEnableDuplicateCheck] = useState(false)
  const [duplicateCheckScope, setDuplicateCheckScope] = useState<'system' | 'list'>('system')
  const [hasNoHeaders, setHasNoHeaders] = useState(false)
  const [firstRowData, setFirstRowData] = useState<string[]>([])
  
  // Get active columns based on selected campaign
  const getCurrentColumns = () => {
    if (campaignName === "Homebound") {
      return [...BASE_COLUMNS, ...HOMEBOUND_EXTRA_COLUMNS]
    }
    return BASE_COLUMNS
  }

  // Campaign confirmation modal state
  const [showCampaignConfirm, setShowCampaignConfirm] = useState(false)
  const [campaignConfirmText, setCampaignConfirmText] = useState("")
  const [campaignConfirmError, setCampaignConfirmError] = useState("")

  // Filter predefined columns based on search term
  const filteredColumns = getCurrentColumns().filter(
    (col) =>
      col.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle CSV file upload and parsing
  const parseCsvFile = useCallback((file: File, hasNoHeaders: boolean) => {
    if (!file) return
    setCsvFile(file)
    const reader = new FileReader()
    setUploadFileName(file.name)

    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length > 0) {
        let headers: string[]
        let data: string[][]
        let firstRowValues: string[] = []

        if (hasNoHeaders) {
          // First row is data, generate column names
          firstRowValues = lines[0].split(",").map((cell) => cell.trim().replace(/"/g, ""))
          headers = firstRowValues.map((_, idx) => `column${idx + 1}`)
          data = lines.map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))
        } else {
          // First row is headers
          headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

          // for missing headers, add idx 
          headers.forEach((header, idx) => {
            if (!header) {
              headers[idx] = `column${idx + 1}`
            }
          })

          data = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim().replace(/"/g, "")))
        }

        setCsvHeaders(headers)
        setCsvData(data)
        setFirstRowData(firstRowValues)
        
          if (!hasNoHeaders) {
            const autoMappings = autoMapColumns(headers, getCurrentColumns())
            setFieldMappings(autoMappings) 
          } else {
            setFieldMappings({}) 
          }
        
        setErrors([])
      }
    }

    reader.readAsText(file)
  }, [])

  // Handle XLSX file upload and parsing
  const parseXlsxFile = useCallback((file: File, hasNoHeaders: boolean) => {
    if (!file) return
    setCsvFile(file)
    setUploadFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Convert to JSON array
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as string[][]
        
        if (jsonData.length > 0) {
          let headers: string[]
          let data: string[][]
          let firstRowValues: string[] = []

          if (hasNoHeaders) {
            // First row is data, generate column names
            firstRowValues = jsonData[0].map((cell) => String(cell || '').trim())
            headers = firstRowValues.map((_, idx) => `column${idx + 1}`)
            data = jsonData.map((row) => row.map((cell) => String(cell || '').trim()))
          } else {
            // First row is headers
            headers = jsonData[0].map((h) => String(h || '').trim())

            // for missing headers, add idx 
            headers.forEach((header, idx) => {
              if (!header) {
                headers[idx] = `column${idx + 1}`
              }
            })

            data = jsonData.slice(1).map((row) => row.map((cell) => String(cell || '').trim()))
          }

          setCsvHeaders(headers)
          setCsvData(data)
          setFirstRowData(firstRowValues)
          
          // Auto-map columns only if headers exist
          if (!hasNoHeaders) {
            const autoMappings = autoMapColumns(headers, getCurrentColumns())
            setFieldMappings(autoMappings) // Pre-fill with suggestions
          } else {
            setFieldMappings({}) // Clear mappings for no-headers mode
          }
          
          setErrors([])
        }
      } catch (error) {
        console.error("Error parsing XLSX file:", error)
        setErrors(["Failed to parse XLSX file. Please ensure it's a valid Excel file."])
      }
    }

    reader.readAsArrayBuffer(file)
  }, [])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (isExcelFile(file.name)) {
      parseXlsxFile(file, hasNoHeaders)
    } else {
      parseCsvFile(file, hasNoHeaders)
    }
  }, [parseCsvFile, parseXlsxFile, hasNoHeaders])

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
    const requiredFields = getCurrentColumns().filter((col) => col.required)
    const mappedFields = Object.values(fieldMappings)
    const missingRequired = requiredFields.filter((field) => !mappedFields.includes(field.id))

    const newErrors: string[] = []
    if (missingRequired.length > 0) {
      newErrors.push(`Missing required fields: ${missingRequired.map((f) => f.label).join(", ")}`)
    }

    if (!listId && !downloadFile) newErrors.push("Please select a List ID")
    
    if (!csvFile) newErrors.push("Please upload a file")

    // Validate campaign name is required when duplicate check is enabled
    if (enableDuplicateCheck && !campaignName) {
      newErrors.push("Campaign name is required when duplicate check is enabled")
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }


  const checkFileValidity = async() => {
    if (!validateMappings()) return
    
    try {

      const payload = {
        file: csvFile,
        mappings: fieldMappings,
        list: listId? listId : 8000,
        source_id: sourceId,
        skip_scrubbing: skipScrubbing,
        headers: csvHeaders,
        data: csvData,
        download_file: downloadFile,
      }
      

      // Use FormData to send file + payload
      const formData = new FormData();
      if (csvFile) {
        formData.append("file", csvFile);
      }
      formData.append("mappings", JSON.stringify(fieldMappings));
      formData.append("list", listId || "");
      formData.append("source_id", sourceId || "");
      formData.append("campaign_name", campaignName || "");
      formData.append("vendor_lead_code", vendorLeadCode || "");

      if (skipScrubbing) {
        formData.append("skip_scrubbing", JSON.stringify(skipScrubbing));
      }

      if (skipDncCheck) {
        formData.append("skip_system_dnc", JSON.stringify(skipDncCheck));
      }

      if (downloadFile) {
        formData.append("download_file", JSON.stringify(downloadFile));
      }

      const response = await fetchWithAuth(`${UPLOAD_URL}/guides/check-file-validity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Check file validity failed:", error);
    }
  }

  // Modal step functions
  const handleStep1 = async () => {
    setStepStatus(prev => ({ ...prev, step1: 'loading' }))
    setModalError("")
    
    try {
      if (!validateMappings()) {
        setStepStatus(prev => ({ ...prev, step1: 'error' }))
        setModalError("Please fix validation errors before proceeding")
        return
      }

      const formData = new FormData();
      if (csvFile) {
        formData.append("file", csvFile);
      }
      formData.append("mappings", JSON.stringify(fieldMappings));
      formData.append("list", listId || "");
      formData.append("source_id", sourceId || "");
      formData.append("campaign_name", campaignName || "");
      formData.append("vendor_lead_code", vendorLeadCode || "");
      if (skipScrubbing) {
        formData.append("skip_scrubbing", JSON.stringify(skipScrubbing));
      }
      if (skipDncCheck) {
        formData.append("skip_system_dnc", JSON.stringify(skipDncCheck));
      }
      if (downloadFile) {
        formData.append("download_file", JSON.stringify(downloadFile));
      }

      const response = await fetchWithAuth(`${UPLOAD_URL}/guides/check-file-validity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setStepStatus(prev => ({ ...prev, step1: 'success' }))
        setCurrentStep(2)
        // Automatically proceed to step 2
        setTimeout(() => handleStep2(), 1000)
      } else {
        const errorData = await response.json()
        setStepStatus(prev => ({ ...prev, step1: 'error' }))
        setModalError(errorData.message || "File validation failed")
      }
    } catch (error) {
      console.error("Step 1 failed:", error)
      setStepStatus(prev => ({ ...prev, step1: 'error' }))
      setModalError("Error while checking file validity")
    }
  }

  const handleStep2 = async () => {
    setStepStatus(prev => ({ ...prev, step2: 'loading' }))
    setModalError("")
    
    try {
      // Step 2: Check for duplicates (if enabled)
      if (enableDuplicateCheck) {
        const duplicateFormData = new FormData();
        if (csvFile) {
          duplicateFormData.append("file", csvFile);
        }
        duplicateFormData.append("mappings", JSON.stringify(fieldMappings));
        duplicateFormData.append("list", listId || "");
        duplicateFormData.append("source_id", sourceId || "");
        duplicateFormData.append("campaign_name", campaignName || "");
        duplicateFormData.append("vendor_lead_code", vendorLeadCode || "");
        duplicateFormData.append("dup_check_scope", duplicateCheckScope);

        
        const duplicateResponse = await fetchWithAuth(`${UPLOAD_URL}/guides/check-duplicates`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: duplicateFormData,
        });

        if (!duplicateResponse.ok) {
          try {
            const errorData = await duplicateResponse.json()
            setModalError(errorData.message || "Error while checking for duplicates")
          } catch (error) {
            console.error("Error while checking for duplicates:", error)
            setModalError("Error while checking for duplicates")
          }
          setStepStatus(prev => ({ ...prev, step2: 'error' }))
          return
        }

        const duplicateData = await duplicateResponse.blob()
        
        // Get filename from response headers or use default
        const contentDisposition = duplicateResponse.headers.get('content-disposition')
        let duplicateFilename = `duplicates_${new Date().toISOString().split("T")[0]}.csv`
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch && filenameMatch[1]) {
            duplicateFilename = filenameMatch[1].replace(/['"]/g, '')
          }
        }

        setDuplicateBlob(duplicateData)
        setDuplicateFilename(duplicateFilename)
      }

      setStepStatus(prev => ({ ...prev, step2: 'success' }))
      setCurrentStep(3)
      // Automatically proceed to step 3
      if (enableDuplicateCheck) {
        // wait until duplicate file is generated        
        
        setTimeout(() => handleStep3(), 3000)
      }
      else {
        setTimeout(() => handleStep3(), 1000)
      }
    } catch (error) {
      console.error("Step 2 failed:", error)
      setStepStatus(prev => ({ ...prev, step2: 'error' }))
      setModalError("Error during duplicate checking")
    }
  }

  const handleStep3 = async () => {
    setStepStatus(prev => ({ ...prev, step3: 'loading' }))
    setModalError("")
    
    try {
      // Step 3: Process and upload file
      const formData = new FormData();
      if (csvFile) {
        formData.append("file", csvFile);
      }
      formData.append("mappings", JSON.stringify(fieldMappings));
      formData.append("list", listId || "");
      formData.append("source_id", sourceId || "");
      formData.append("campaign_name", campaignName || "");
      formData.append("vendor_lead_code", vendorLeadCode || "");
      formData.append("upload_file_name", uploadFileName || "csv_file.csv");

      // added duplicate check scope incase blob is not available and re-dedup check is needed
      formData.append("duplicate_check_scope", duplicateCheckScope || "");
      formData.append("enabled_duplicate_check", JSON.stringify(enableDuplicateCheck));
      
      // add duplicate file if available
      // Ensure duplicateBlob is a Blob and duplicateFilename is set before appending
      if (duplicateBlob && duplicateFilename) {
        try {
          // Defensive: If duplicateBlob is not a Blob, try to convert
          const blobToUse = duplicateBlob instanceof Blob ? duplicateBlob : new Blob([duplicateBlob], { type: 'text/csv' });
          const duplicateFile = new File([blobToUse], duplicateFilename, { type: 'text/csv' });
          formData.append("duplicate_file", duplicateFile);
          console.log("added duplicate file", duplicateFile)
        } catch (e) {
          console.error("Failed to add duplicate file to formData", e);
        }
      } else {
        console.warn("Duplicate file not added: missing blob or filename");
      }

      if (skipScrubbing) {
        formData.append("skip_scrubbing", JSON.stringify(skipScrubbing));
      }

      if (skipDncCheck) {
        formData.append("skip_system_dnc", JSON.stringify(skipDncCheck));
      }

      formData.append("download_file", JSON.stringify(true));

      function fetchWrapper(url, options, timeout) {
        return new Promise((resolve, reject) => {
          fetchWithAuth(url, options).then(resolve, reject);
    
          if (timeout) {
            const e = new Error("Connection timed out");
            setTimeout(reject, timeout, e);
          }
        });
      }

      const response = await fetchWrapper(`${UPLOAD_URL}/guides/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },        
        body: formData,
      }, 300000) as Response; // 5 minutes timeout           

      if (response.status === 200) {
        const responseData = await response.blob()
        
        // Get filename from response headers or use default
        const contentDisposition = response.headers.get('content-disposition')
        let filename = `leads_${new Date().toISOString().split("T")[0]}`
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '')
          }
        }
        
        // Determine file extension based on content type
        const contentType = response.headers.get('content-type')
        if (contentType === 'application/zip') {
          filename = filename.endsWith('.zip') ? filename : `${filename}.zip`
        } else if (contentType === 'text/csv') {
          filename = filename.endsWith('.csv') ? filename : `${filename}.csv`
        }

        setDownloadBlob(responseData)
        setDownloadFilename(filename)
        setStepStatus(prev => ({ ...prev, step3: 'success' }))
        setCurrentStep(4)
        // Automatically proceed to step 4
        setTimeout(() => handleStep4(), 1000)
      } else {
        const errorData = await response.json()
        setModalError(errorData.message || "Error while processing file")
        setStepStatus(prev => ({ ...prev, step3: 'error' }))
      }
    } catch (error) {
      console.error("Step 3 failed:", error)
      setStepStatus(prev => ({ ...prev, step3: 'error' }))
      setModalError("Error during file processing")
    }
  }

  const downloadProcessedFile = () => {
    if (downloadBlob) {
      const url = window.URL.createObjectURL(downloadBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = downloadFilename
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const downloadDuplicatesFile = () => {
    if (duplicateBlob) {
      const url = window.URL.createObjectURL(duplicateBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = duplicateFilename
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  const handleStep4 = () => {
    setStepStatus(prev => ({ ...prev, step4: 'success' }))    
  }


  const resetModal = () => {
    setCurrentStep(1)
    setStepStatus({
      step1: 'pending',
      step2: 'pending',
      step3: 'pending',
      step4: 'pending'
    })
    setModalError("")
    setDownloadBlob(null)
    setDownloadFilename("")
    setDuplicateBlob(null)
    setDuplicateFilename("")
  }

  // Check if campaign confirmation is needed
  const needsCampaignConfirmation = () => {
    return skipScrubbing && campaignName && campaignName.toLowerCase() !== 'data warehouse'
  }

  const openModal = () => {
    if (needsCampaignConfirmation()) {
      setShowCampaignConfirm(true)
      setCampaignConfirmText("")
      setCampaignConfirmError("")
    } else {
      setIsModalOpen(true)
      resetModal()
      // Automatically start the process when modal opens
      setTimeout(() => handleStep1(), 500)
    }
  }

  // Handle campaign confirmation
  const handleCampaignConfirm = () => {
    if (campaignConfirmText.trim().toLowerCase() === campaignName.toLowerCase()) {
      setShowCampaignConfirm(false)
      setIsModalOpen(true)
      resetModal()
      // Automatically start the process when modal opens
      setTimeout(() => handleStep1(), 500)
    } else {
      setCampaignConfirmError("Campaign name does not match. Please retype exactly as shown.")
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateMappings()) return
    
    if (needsCampaignConfirmation()) {
      setShowCampaignConfirm(true)
      setCampaignConfirmText("")
      setCampaignConfirmError("")
      return
    }

    setIsUploading(true)

    try {
      // Prepare the data to send to server
      const payload = {
        file: csvFile,
        mappings: fieldMappings,
        list: listId? listId : 8000,
        source_id: sourceId,
        skip_scrubbing: skipScrubbing,
        skip_system_dnc: skipDncCheck,
        headers: csvHeaders,
        data: csvData,
        download_file: downloadFile,
      }
      

      // Use FormData to send file + payload
      const formData = new FormData();
      if (csvFile) {
        formData.append("file", csvFile);
      }
      formData.append("mappings", JSON.stringify(fieldMappings));
      formData.append("list", listId || "");
      formData.append("source_id", sourceId || "");
      formData.append("campaign_name", campaignName || "");
      formData.append("vendor_lead_code", vendorLeadCode || "");

      if (enableDuplicateCheck) {        
        formData.append("duplicate_check_scope", duplicateCheckScope);
        formData.append("enabled_duplicate_check", JSON.stringify(enableDuplicateCheck));
      }

      if (skipScrubbing) {
        formData.append("skip_scrubbing", JSON.stringify(skipScrubbing));

        if (skipDncCheck) {
          formData.append("skip_system_dnc", JSON.stringify(skipDncCheck));
        }
      }
      if (downloadFile) {
        formData.append("download_file", JSON.stringify(downloadFile));
      }

      if (duplicateBlob) {
        const duplicateFile = new File([duplicateBlob], duplicateFilename, { type: 'text/csv' });
        formData.append("duplicate_file", duplicateFile);
      }

      const response = await fetchWithAuth(`${UPLOAD_URL}/guides/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type header for FormData, browser will set it including boundary
        },
        body: formData,
      });

      let responseData: any = null

      if (response.ok) {
        if (!downloadFile) {
          responseData = await response.json()

          if (responseData.status === "success") {
            const { success_count, original_count, blacklist_count } = responseData.data
            alert(`Upload completed successfully!\n\nSuccessfully uploaded: ${success_count} leads\nOriginal count: ${original_count} leads\nBlacklisted: ${blacklist_count} leads`)
          } else {
            throw new Error(responseData.message || "Upload failed")
          }
        } else {
           responseData = await response.blob()
           
           // Get filename from response headers or use default
           const contentDisposition = response.headers.get('content-disposition')
           let filename = `leads_${new Date().toISOString().split("T")[0]}`
           
           if (contentDisposition) {
             const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
             if (filenameMatch && filenameMatch[1]) {
               filename = filenameMatch[1].replace(/['"]/g, '')
             }
           }
           
           // Determine file extension based on content type
           const contentType = response.headers.get('content-type')
           if (contentType === 'application/zip') {
             filename = filename.endsWith('.zip') ? filename : `${filename}.zip`
           } else if (contentType === 'text/csv') {
             filename = filename.endsWith('.csv') ? filename : `${filename}.csv`
           }

           const url = window.URL.createObjectURL(responseData)
           const a = document.createElement("a")
           a.href = url
           a.download = filename
           a.click()
           window.URL.revokeObjectURL(url)
           
           alert("File downloaded successfully!")
         }
      } else {
        throw new Error(response.statusText || "Upload failed")
      }      
      

      // Reset form
      // setCsvFile(null)      
      // setCsvHeaders([])
      // setCsvData([])
      // setFieldMappings({})
      // setListId("")
      // setSourceId("")
      // setSkipScrubbing(false)
      // setErrors([])     
      
      // window.location.reload()      

    } catch (error) {
      console.error("Upload failed:", error)
      setErrors(["Upload failed. Please try again."])
    } finally {
      setIsUploading(false)

      // refresh the page
      // window.location.reload()      

    }
  }

  // Step component
  const StepIcon = ({ step, status }: { step: number, status: 'pending' | 'loading' | 'success' | 'error' }) => {
    const getIcon = () => {
      switch (step) {
        case 1:
          return <FileCheck className="h-8 w-8" />
        case 2:
          return <Search className="h-8 w-8" />
        case 3:
          return <Shield className="h-8 w-8" />
        case 4:
          return <Download className="h-8 w-8" />
        default:
          return null
      }
    }

    const getStatusColor = () => {
      switch (status) {
        case 'pending':
          return 'text-gray-400'
        case 'loading':
          return 'text-blue-500 animate-spin'
        case 'success':
          return 'text-green-500'
        case 'error':
          return 'text-red-500'
        default:
          return 'text-gray-400'
      }
    }

    return (
      <div className={`flex items-center justify-center w-16 h-16 rounded-full border-2 ${
        status === 'success' ? 'border-green-500 bg-green-50' :
        status === 'error' ? 'border-red-500 bg-red-50' :
        status === 'loading' ? 'border-blue-500 bg-blue-50' :
        'border-gray-300 bg-gray-50'
      }`}>
        <div className={getStatusColor()}>
          {getIcon()}
        </div>
      </div>
    )
  } 

  return (
    <div className="max-w-[95%] mx-auto p-6 pt-16 space-y-6">
      <Navbar />
      <div className="mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Automated Lead Upload</h1>            
          </div>
          <Button 
            onClick={() => navigate("/qc-and-supervisor-navigation/show-uploads")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            View Uploads
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 transition-all duration-500 ease-in-out ${
        csvHeaders.length > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-1 max-w-3xl mx-auto'
      }`}>
        {/* Left Column - Upload and Configuration */}
        <div className={`space-y-6 transition-all duration-500 ${csvHeaders.length > 0 ? 'opacity-100' : 'opacity-100'}`}>
          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload File
              </CardTitle>
              <CardDescription>Select your file to begin the mapping process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file" className="mb-2 block">File</Label>
                  <div
                    className={`border-2 border-dashed rounded-md p-4 transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                    onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                      const file = e.dataTransfer.files?.[0]
                      if (file) {
                        if (isExcelFile(file.name)) {
                          parseXlsxFile(file, hasNoHeaders)
                        } else {
                          parseCsvFile(file, hasNoHeaders)
                        }
                      }
                    }}
                  >
                    <Input id="csv-file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="pt-0 hidden" />
                    <label htmlFor="csv-file" className="cursor-pointer text-sm text-gray-600">
                      {csvFile ? `Selected: ${csvFile.name}` : "Click or drag & drop file here"}
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="no-headers"
                    checked={hasNoHeaders}
                    onCheckedChange={(checked) => {
                      setHasNoHeaders(checked as boolean)
                      // Re-parse file if already loaded
                      if (csvFile) {
                        if (isExcelFile(csvFile.name)) {
                          parseXlsxFile(csvFile, checked as boolean)
                        } else {
                          parseCsvFile(csvFile, checked as boolean)
                        }
                      }
                    }}
                  />
                  <Label htmlFor="no-headers" className="text-sm font-normal cursor-pointer">
                    File has no column headers
                  </Label>
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
              <CardDescription>Set the list ID and source ID for this upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="list-id" className="mb-2 block">List ID *</Label>
                <Input
                  id="list-id"
                  placeholder="Enter list ID..."
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="source-id" className="mb-2 block">Source ID</Label>
                <Input
                  id="source-id"
                  placeholder="Enter source ID..."
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="campaign-name" className="mb-2 block flex items-center gap-1">
                  Campaign Name
                  {enableDuplicateCheck && <span className="text-red-500">*</span>}
                </Label>
                <Select
                  value={campaignName}
                  onValueChange={(value) => {
                    setCampaignName(value)
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
                    <SelectItem value="Homebound">Homebound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vendor-lead-code" className="mb-2 block">Vendor Lead Code</Label>
                <Input
                  id="vendor-lead-code"
                  placeholder="Enter vendor lead code..."
                  value={vendorLeadCode}
                  onChange={(e) => setVendorLeadCode(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skip-scrubbing"
                  checked={skipScrubbing}

                  onCheckedChange={(checked) => setSkipScrubbing(checked as boolean)}
                />
                <Label htmlFor="skip-scrubbing">Skip Scrubbing</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skip-dnc-check"
                  checked={skipDncCheck}
                  onCheckedChange={(checked) => setSkipDncCheck(checked as boolean)}
                />
                <Label htmlFor="skip-dnc-check">Skip DNC Check</Label>
              </div>

              <div className="flex items-center space-x-2" >
                <Checkbox
                  id="download-file"
                  checked={downloadFile}
                  disabled={true}
                  onCheckedChange={(checked) => setDownloadFile(checked as boolean)}
                />
                <Label htmlFor="download-file">Download File</Label>
              </div>

              {/* Duplicate Check Options */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enable-duplicate-check"
                    checked={enableDuplicateCheck}
                    onCheckedChange={(checked) => setEnableDuplicateCheck(checked as boolean)}
                  />
                  <Label htmlFor="enable-duplicate-check">Enable Duplicate Check</Label>
                </div>
                
                {enableDuplicateCheck && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-sm font-medium">Check Scope:</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="duplicate-system"
                          name="duplicate-scope"
                          checked={duplicateCheckScope === 'system'}
                          onChange={() => setDuplicateCheckScope('system')}
                        />
                        <Label htmlFor="duplicate-system" className="text-sm">Entire System</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="duplicate-list"
                          name="duplicate-scope"
                          checked={duplicateCheckScope === 'list'}
                          onChange={() => setDuplicateCheckScope('list')}
                        />
                        <Label htmlFor="duplicate-list" className="text-sm">Current List ID ({listId || 'Not set'})</Label>
                      </div>
                    </div>
                  </div>
                )}
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
          {downloadFile ? (
            <Button onClick={openModal} disabled={isUploading || csvHeaders.length === 0} className="w-full bg-blue-500 text-white" size="lg">
              Process & Download File
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isUploading || csvHeaders.length === 0} className="w-full bg-blue-500 text-white" size="lg">
              {isUploading ? "Uploading..." : "Upload & Process"}
            </Button>
          )}

          {/* Mapping Summary */}
          {csvHeaders.length > 0 && !hasNoHeaders && (
            <Card>
              <CardHeader>
                <CardTitle>Mapping Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getCurrentColumns().map((predefinedField) => {
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
          )}
        </div>

        {/* Right Column - Field Mapping */}
        {csvHeaders.length > 0 && (
          <div className="space-y-6">
            {/* Search - Only show when headers exist */}
            {!hasNoHeaders && (
              <Card className="animate-in fade-in slide-in-from-right-4 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search Columns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="search-csv" className="mb-2 block">Search Columns</Label>
                    <Input
                      id="search-csv"
                      placeholder="Search columns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

              {/* Field Mapping */}
              <Card className="animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
                <CardHeader>
                  <CardTitle>Field Mapping</CardTitle>
                  <CardDescription>
                    {hasNoHeaders 
                      ? "Map each column to a VICI field. Required fields are marked with *"
                      : "Map VICI fields to your file columns. Required fields are marked with *"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasNoHeaders ? (
                    // Column-based mapping UI (no headers)
                    <div className="space-y-4">
                      {csvHeaders.map((header, idx) => {
                        const mappedPredefinedField = fieldMappings[header]
                        const exampleValue = firstRowData[idx] || ""

                        return (
                          <div key={header} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium">{header}</Label>
                                {exampleValue && (
                                  <span className="text-sm text-muted-foreground">
                                    (Example: {exampleValue.length > 30 ? `${exampleValue.substring(0, 30)}...` : exampleValue})
                                  </span>
                                )}
                              </div>
                              {mappedPredefinedField && (
                                <Button variant="ghost" size="sm" onClick={() => removeFieldMapping(header)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            {mappedPredefinedField ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  {getCurrentColumns().find(col => col.id === mappedPredefinedField)?.label || mappedPredefinedField}
                                  {getCurrentColumns().find(col => col.id === mappedPredefinedField)?.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </Badge>
                              </div>
                            ) : (
                              <Select
                                value={mappedPredefinedField || ""}
                                onValueChange={(value) => handleFieldMapping(header, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select predefined field..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {getCurrentColumns()
                                    .filter(
                                      (predefinedField) =>
                                        // Show if not mapped, or if it's currently mapped to this column
                                        !Object.values(fieldMappings).includes(predefinedField.id) ||
                                        fieldMappings[header] === predefinedField.id,
                                    )
                                    .map((predefinedField) => (
                                      <SelectItem key={predefinedField.id} value={predefinedField.id}>
                                        {predefinedField.label}{predefinedField.required ? " *" : ""}
                                      </SelectItem>
                                    ))
                                  }
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    // Original predefined field-based mapping UI (with headers)
                    <div className="space-y-4">
                      {getCurrentColumns().map((predefinedField) => {
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
                                  <SelectValue placeholder="Select column..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {filteredCsvHeaders
                                    .filter(
                                      (header) =>
                                        // Show if not mapped, or if it's currently mapped to this predefined field
                                        !Object.keys(fieldMappings).includes(header) ||
                                        fieldMappings[header] === predefinedField.id,
                                    )
                                    .map((header, idx) => {
                                      const mappedHeader = header;
                                      return (
                                        <SelectItem key={mappedHeader} value={mappedHeader}>
                                          {mappedHeader}
                                        </SelectItem>
                                      );
                                    })
                                  }
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
          </div>
        )}
      </div>

      {/* Process Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Processing File</DialogTitle>
            <DialogDescription>
              Please wait while we process your file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Step 1 */}
            <div className="flex items-center space-x-4">
              <StepIcon step={1} status={stepStatus.step1} />
              <div className="flex-1">
                <h4 className="font-medium">Checking File Validity</h4>
                <p className="text-sm text-muted-foreground">Validating file format and required fields</p>
              </div>
            </div>

            {/* Step 2 - Duplicate Check */}
            {enableDuplicateCheck && (
              <div className="flex items-center space-x-4">
                <StepIcon step={2} status={stepStatus.step2} />
                <div className="flex-1">
                  <h4 className="font-medium">Checking for Duplicates</h4>
                  <p className="text-sm text-muted-foreground">
                    Checking against {duplicateCheckScope === 'system' ? 'entire system' : `list ${listId}`}
                  </p>
                </div>
              </div>
            )}

            {/* Step 3 - Process File */}
            <div className="flex items-center space-x-4">
              <StepIcon step={3} status={stepStatus.step3} />
              <div className="flex-1">
                <h4 className="font-medium">
                  {skipScrubbing ? "Processing File" : "Processing & Cleaning File"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {skipScrubbing ? "Processing your file" : "Processing file and cleaning through BlackList"}
                </p>
              </div>
            </div>

            {/* Step 4 - Download Files */}
            <div className="flex items-center space-x-4">
              <StepIcon step={4} status={stepStatus.step4} />
              <div className="flex-1">
                <h4 className="font-medium">Download Files</h4>
                <p className="text-sm text-muted-foreground">
                  {enableDuplicateCheck 
                    ? "Download the processed file and duplicates file separately" 
                    : "Download the processed file"
                  }
                </p>
                {currentStep === 4 && stepStatus.step3 === 'success' && (
                  <div className="flex gap-2 mt-2">
                    <Button onClick={downloadProcessedFile} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Processed File
                    </Button>
                    {enableDuplicateCheck && duplicateBlob && (
                      <Button onClick={downloadDuplicatesFile} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Duplicates File
                      </Button>
                    )}                    
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {modalError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{modalError}</AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign Confirmation Modal */}
      <Dialog open={showCampaignConfirm} onOpenChange={setShowCampaignConfirm}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Campaign Selection</DialogTitle>
            <DialogDescription>
              You have selected "Skip Scrubbing" for campaign: <strong>{campaignName}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Skipping scrubbing means your leads will not be cleaned through the BlackList. 
                    Please confirm you want to proceed with this campaign.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-confirm" className="text-sm font-medium">
                Please retype the campaign name to confirm: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="campaign-confirm"
                placeholder={`Type: ${campaignName}`}
                value={campaignConfirmText}
                onChange={(e) => {
                  setCampaignConfirmText(e.target.value)
                  setCampaignConfirmError("")
                }}
                className={campaignConfirmError ? "border-red-500" : ""}
              />
              {campaignConfirmError && (
                <p className="text-sm text-red-600">{campaignConfirmError}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={() => setShowCampaignConfirm(false)} 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCampaignConfirm}
                className="flex-1 bg-blue-500 text-white"
                disabled={!campaignConfirmText.trim()}
              >
                Confirm & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UploadLeadFile;