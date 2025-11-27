import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { CheckCircle2, XCircle, Loader2, Download, RefreshCw, ChevronDown, ChevronUp, List, FileCheck, Upload } from "lucide-react"
import { Button } from "../../components/ui/button"
import { getHeaders } from "../../helpers/config"
import Navbar from "../../components/navigationBar/navbar"

// Backend URL configuration - matches uploadLeadFile.tsx
// const BACKEND_URL = "https://endpoint.itsbuzzmarketing.com";
const BACKEND_URL = "https://app.itsbuzzmarketing.com"
// const BACKEND_URL = "http://127.0.0.1:3173";  // Local backend for testing

interface JobUpdate {
  status: "success" | "error"
  progress: string
  timestamp?: string
  error?: string | object
  step_id?: string | null
}

interface StepStatus {
  id: string
  name: string
  always: boolean
  conditional: boolean
  enabled: boolean
  completed: boolean
  current: boolean
}

export default function JobProgressPage() {
  const params = useParams()
  const navigate = useNavigate()
  const jobId = params.jobId as string
  const { token } = useSelector((state: { user: { token: string } }) => state.user)
  const [updates, setUpdates] = useState<JobUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const [hasFinalFailure, setHasFinalFailure] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set())
  const [isPolling, setIsPolling] = useState(true)
  const [steps, setSteps] = useState<StepStatus[]>([])
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)

  // Poll for job updates every 5 seconds
  useEffect(() => {
    if (!isPolling) return

    const pollJobStatus = async () => {
      try {
        const headers = await getHeaders(token)
        const response = await fetch(`${BACKEND_URL}/guides/job/${jobId}/status`, {
          headers
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch job status: ${response.statusText}`)
        }

        const data = await response.json()
        
        // Store filename if available
        if (data.upload_file_name) {
          setFilename(data.upload_file_name)
        }
        
        // Update state with new updates
        // Preserve original timestamps - match updates by content to preserve timestamps across polls
        if (data.updates && data.updates.length > 0) {
          setUpdates((prevUpdates) => {
            // Create a map of existing updates by their content (progress + step_id) to preserve timestamps
            const existingTimestamps = new Map<string, string>()
            prevUpdates.forEach((prev) => {
              const key = `${prev.progress}-${prev.step_id || ''}`
              if (prev.timestamp) {
                existingTimestamps.set(key, prev.timestamp)
              }
            })
            
            return data.updates.map((update: any) => {
              const key = `${update.progress}-${update.step_id || ''}`
              return {
                ...update,
                // Preserve existing timestamp if available, otherwise use update's timestamp or generate new one
                timestamp: existingTimestamps.get(key) || update.timestamp || new Date().toISOString()
              }
            })
          })
        }

        // Update step statuses
        if (data.steps && Array.isArray(data.steps)) {
          setSteps(data.steps)
        }
        
        if (data.current_step) {
          setCurrentStep(data.current_step)
        }

        // Check for completion
        if (data.completed && data.download_url) {
          setDownloadUrl(data.download_url)
          setIsPolling(false) // Stop polling when completed
        }

        if (data.has_error) {
          setHasError(true)
        }

        // Check if any update has final_failure flag (automatic retries exhausted)
        if (data.updates && data.updates.length > 0) {
          const hasFinalFailureFlag = data.updates.some((update: any) => update.final_failure === true)
          setHasFinalFailure(hasFinalFailureFlag)
        } else {
          setHasFinalFailure(false)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error polling job status:", error)
        setIsLoading(false)
        // Continue polling even on error (might be temporary network issue)
    }
    }

    // Poll immediately, then every 5 seconds
    pollJobStatus()
    const intervalId = setInterval(pollJobStatus, 5000)

    return () => {
      clearInterval(intervalId)
    }
  }, [jobId, isPolling])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      const headers = await getHeaders(token)
      const response = await fetch(`${BACKEND_URL}/guides/job/${jobId}/retry-step`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      })

      if (response.ok) {
        setHasError(false)
        setHasFinalFailure(false)
        setUpdates([])
        setDownloadUrl(null)
        setIsPolling(true) // Restart polling
      }
    } catch (error) {
      console.error("Failed to retry job:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "success") {
      return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
    } else if (status === "error") {
      return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
    }
    return <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
  }

  const formatMessage = (message: string) => {
    return message.replace(/url to file: https?:\/\/[^\s]+/, "File ready for download")
  }

  const toggleErrorDetails = (index: number) => {
    setExpandedErrors((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const formatError = (error: string | object) => {
    if (typeof error === "string") {
      return error
    }
    return JSON.stringify(error, null, 2)
  }

  // Filter updates to show those for steps that exist in config
  const filteredUpdates = updates.filter((update) => {
    // If no step_id, show it (might be general updates)
    if (!update.step_id) {
      return true
    }
    
    // Show if step exists in config
    return steps.some((s) => s.id === update.step_id)
  })

  return (
    <div className="max-w-[95%] mx-auto p-6 pt-16 space-y-6">
      <Navbar />
      <div className="mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Job Progress</h1>
            <p className="text-muted-foreground mt-2">
              Track the processing status of your upload job
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/qc-and-supervisor-navigation/show-jobs")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileCheck className="h-4 w-4" />
              View Jobs
            </Button>
            <Button 
              onClick={() => navigate("/qc-and-supervisor-navigation/show-uploads")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              View Uploads
            </Button>
            <Button 
              onClick={() => navigate("/qc-and-supervisor-navigation/upload-lead-file")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload CSV
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Job Progress</CardTitle>
              <CardDescription className="mt-1">
                Job ID: {jobId}
                {filename && (
                  <>
                    <br />
                    Filename: {filename}
                  </>
                )}
              </CardDescription>
            </div>
            <Badge variant={isPolling ? "default" : "secondary"}>
              {isPolling ? "Polling" : "Completed"}
            </Badge>
          </div>
        </CardHeader>
          <CardContent>
            {hasError && hasFinalFailure && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">Job Failed</p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Automatic retries have been exhausted. You can manually retry the job from the last checkpoint.
                    </p>
                  </div>
                  <Button onClick={handleRetry} disabled={isRetrying} variant="destructive" className="ml-4">
                    {isRetrying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry Job
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {hasError && !hasFinalFailure && (
              <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">Retrying Automatically</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      An error occurred. The system is automatically retrying with exponential backoff.
                    </p>
                  </div>
                  <Loader2 className="h-5 w-5 animate-spin text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            )}

            {isLoading && filteredUpdates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading job status...</p>
              </div>
            ) : filteredUpdates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Waiting for job updates...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUpdates.map((update, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 rounded-lg border p-4 transition-all ${
                      update.status === "success"
                        ? "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20"
                        : update.status === "error"
                          ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
                          : "border-border bg-card"
                    }`}
                  >
                    <div className="mt-0.5">{getStatusIcon(update.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={update.status === "success" ? "default" : "destructive"} className="text-xs">
                          {update.status}
                        </Badge>
                        {update.timestamp && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{formatMessage(update.progress)}</p>

                      {update.error && (
                        <div className="mt-3">
                          <button
                            onClick={() => toggleErrorDetails(index)}
                            className="flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-800 dark:text-red-300 dark:hover:text-red-200"
                          >
                            {expandedErrors.has(index) ? (
                              <>
                                <ChevronUp className="h-3 w-3" />
                                Hide Error Details
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3" />
                                Show Error Details
                              </>
                            )}
                          </button>
                          {expandedErrors.has(index) && (
                            <pre className="mt-2 overflow-x-auto rounded border border-red-300 bg-red-100 p-3 text-xs text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100">
                              {formatError(update.error)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {downloadUrl && (
              <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">File Ready</p>
                    <p className="text-sm text-muted-foreground">Your processed file is ready to download</p>
                  </div>
                  <Button asChild>
                    <a href={downloadUrl} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}

