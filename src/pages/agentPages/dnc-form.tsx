import React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { useToast } from "../../components/hooks/use-toast"
import { Toaster } from "../../components/ui/toaster"
import { PhoneOff, CheckCircle2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import Navbar from "../../components/navigationBar/navbar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchWithAuth } from "../../utils/fetchWithAuth"

const UPLOAD_URL = "https://app.itsbuzzmarketing.com";
// const UPLOAD_URL = "http://127.0.0.1:3173";
// const UPLOAD_URL = "https://combined-service.r9tsjnbaapfz8.us-east-1.cs.amazonlightsail.com/"

const DNCForm = () => {
  const { token } = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [cleanedNumber, setCleanedNumber] = useState("")
  const { toast } = useToast()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }

  const cleanPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    let cleaned = value.replace(/\D/g, "")

    // Remove leading 1 if present
    if (cleaned.startsWith("1")) {
      cleaned = cleaned.slice(1)
    }

    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleaned = cleanPhoneNumber(phoneNumber)

    if (cleaned.length === 0) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return
    }

    if (cleaned.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return
    }

    setCleanedNumber(cleaned)
    setShowConfirmation(true)
  }

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false)
    setIsSubmitting(true)

    try {
      const response = await fetchWithAuth(`${UPLOAD_URL}/guides/dnc-registry-insert?phone_number=${cleanedNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Number added to DNC list",
          description: `${cleanedNumber} will not be called by agents.`,
        })
        setPhoneNumber("")
      } else {
        throw new Error("Failed to add number")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add number to DNC list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!token || token == null) {
    // navigate("/")
    window.location.href = "https://platform.itsbuzzmarketing.com"
  }

  return (
    <div className="w-full p-6 h-full space-y-12">
    
      <Navbar />
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PhoneOff className="h-8 w-8" />
          Do Not Call Registry
        </h1>        
      </div>

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <PhoneOff className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-balance">DNC Form</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Enter a phone number to add it to the Do Not Call registry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="555-123-4567 or (555) 123-4567 or 15551234567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="text-base h-11"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter phone number in any format. Non-numeric characters and leading 1 will be removed.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-medium bg-black hover:bg-black/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Adding to DNC List...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Add to DNC List
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <DialogTitle className="text-center text-xl">Confirm DNC Addition</DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed">
              Are you sure you want to add this number to the Do Not Call list?
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted rounded-lg p-4 my-4">
            <p className="text-sm text-muted-foreground text-center mb-2">Cleaned Number:</p>
            <p className="text-2xl font-semibold text-center tracking-wider font-mono">{cleanedNumber}</p>
          </div>


          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmedSubmit} className="w-full sm:w-auto bg-black text-white">
              <CheckCircle2 className="w-4 h-4 mr-2 " />
              Confirm & Add to DNC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
export default DNCForm;
