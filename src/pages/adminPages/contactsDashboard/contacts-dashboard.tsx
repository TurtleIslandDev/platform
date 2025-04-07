"use client"

import { useState, useEffect } from "react"
import { Download, ListFilter, Search, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import ContactsTable from "./contacts-table"
import React from "react"
import { useSelector } from "react-redux"

// Define the Contact type
interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  source: string
  type: string
  [key: string]: string
}

// const BACKEND_URL = "http://0.0.0.0:3173"
const BACKEND_URL = "https://endpoint.itsbuzzmarketing.com"


// fetch fields from the server
const fetchFields = async ( token: string ) => {
  // localhost:3000/guides/get_fields

  const headers = new Headers()
  headers.append("Authorization", `Bearer ${token}`)

  const response = await fetch(`${BACKEND_URL}/guides/get_fields`, {
    method: "GET",
    headers: headers,          
  })
  if (!response.ok) {
    throw new Error("Failed to fetch fields")
  }
  const data = await response.json()  
  let fieldList: { value: string; label: string }[] = []

  for (const field of data.data) {
    let fieldDict : { value : string, label: string } = {
      "value" : field.key,
      "label" : field.name? field.name : field.key
    }
    fieldList.push(fieldDict)
  }

  return fieldList
  
}

const fetchContacts = async ( fields : string[], filters : {}, token: string  ) => {

  const headers = new Headers()
  headers.append("Authorization", `Bearer ${token}`)

  const body = JSON.stringify({
    fields: fields,
    filters: filters,
    "limit": 100,
    "offset": 0
  })

  headers.append("Content-Type", "application/json")

  const response = await fetch(`${BACKEND_URL}/guides/get_contacts`, {
    method: "POST",
    headers: headers,
    body: body
  })
  if (!response.ok) {
    throw new Error("Failed to fetch contacts")
  }
  const data = await response.json()
  return data.data
}


export default function ContactsDashboard() {
  // Generate 500 dummy contacts
  
  // const [contacts, setContacts] = useState( generateDummyContacts(500)) // Start with 500 dummy contacts)
  
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]) // Start with empty array
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFields, setSelectedFields] = useState<string[]>([]) // Start with no fields
  const [searchTerm, setSearchTerm] = useState("")
  const [isFetchingContacts, setIsFetchingContacts] = useState(false) // Loading state for fetching contacts
  const [isExportingCSV, setIsExportingCSV] = useState(false) // Loading state for exporting CSV
  const {token} = useSelector((state: { user: { token: string } }) => state.user);

  const contactsPerPage = 100
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage)

  
  const [availableFields, setAvailableFields] = useState<{ value: string; label: string }[]>([])

  // Fetch fields from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFields(token)
        // Update available fields with fetched data
        const fields = data.map((field: { value: string; label: string }) => ({
          value: field.value as string,
          label: field.label,
        }))
        setAvailableFields(fields)
      } catch (error) {
        console.error("Error fetching fields:", error)
      }
    }
    fetchData()
  }, [])



  // Filter fields based on search term
  const filteredFields = availableFields.filter(
    (field) =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.value.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Apply field filtering when selectedFields change
  useEffect(() => {

    if (selectedFields.length === 0) {
      // If no fields selected, show no contacts
      setFilteredContacts([])
      return
    } 

    // Fetch contacts from server
    const fetchContactsData = async () => {
      setIsFetchingContacts(true) // Start loading
      try {
        const data = await fetchContacts(selectedFields, {}, token)
        setFilteredContacts(data)    
      } catch (error) {
        console.error("Error fetching contacts:", error)
      } finally {
        setIsFetchingContacts(false) // Stop loading
      }
    }
    fetchContactsData()

    setCurrentPage(1) // Reset to first page when fields change
  }, [selectedFields])

  // Get current page of contacts
  const getCurrentContacts = () => {
    const startIndex = (currentPage - 1) * contactsPerPage
    const endIndex = startIndex + contactsPerPage
    return filteredContacts.slice(startIndex, endIndex)
  }

  // Add a field
  const addField = (field: string) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field])
    }
    setSearchTerm("") // Clear search after adding
  }

  // Remove a field
  const removeField = (field: string) => {
    setSelectedFields(selectedFields.filter((f) => f !== field))
  }

  // Export to CSV
  const exportToCSV = () => {
    const fetchCSV = async () => {
      setIsExportingCSV(true) // Start loading
      try {
        const headers = new Headers()
        headers.append("Authorization", `Bearer ${token}`)
        headers.append("Content-Type", "application/json")

        const body = JSON.stringify({
          fields: selectedFields.length > 0 ? selectedFields : ["id", "first_name", "last_name", "email", "source", "type"],
          filters: {},
        })

        const response = await fetch(`${BACKEND_URL}/guides/get_contact_csv`, {
          method: "POST",
          headers: headers,
          body: body,
        })

        if (!response.ok) {
          throw new Error("Failed to fetch CSV")
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `contacts_export_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        console.error("Error exporting CSV:", error)
      } finally {
        setIsExportingCSV(false) // Stop loading
      }
    }

    fetchCSV()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage and export your contacts database</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <ListFilter className="h-4 w-4" />
                Fields
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Select Fields</SheetTitle>
                <SheetDescription>Search and select fields to include in your view</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search fields..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1.5 h-7 w-7 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear</span>
                    </Button>
                  )}
                </div>

                <div className="mt-2 max-h-[300px] overflow-y-auto space-y-1">
                  {filteredFields.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2 text-center">No fields found</p>
                  ) : (
                    filteredFields.map((field) => {
                      const isSelected = selectedFields.includes(field.value)                      
                      return (
                        <div
                          key={field.value}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                            isSelected ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                          onClick={() => (isSelected ? removeField(field.value) : addField(field.value))}
                        >
                          <span className="text-sm">{field.label}</span>
                          {isSelected ? (
                            <Badge variant="secondary" className="ml-auto">
                              Selected
                            </Badge>
                          ) : (
                            <Button variant="ghost" size="sm" className="ml-auto h-7">
                              Add
                            </Button>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>

                {selectedFields.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected Fields ({selectedFields.length}):</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFields.map((field) => (
                        <Badge key={field} variant="secondary" className="flex items-center gap-1">
                          {availableFields.find((f) => f.value === field)?.label || field}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeField(field)
                            }}
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => setSelectedFields([])}>
                      Clear All Fields
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="default"
            size="sm"
            className="h-9 gap-1"
            onClick={exportToCSV}
            disabled={filteredContacts.length === 0 || isExportingCSV}
          >
            {isExportingCSV ? (
              <span>Exporting...</span>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export CSV
              </>
            )}
          </Button>
        </div>
      </div>

      {selectedFields.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Fields:</span>
          {selectedFields.map((field) => (
            <Badge key={field} variant="outline">
              {availableFields.find((f) => f.value === field)?.label || field}
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedFields([])}>
            Clear all
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            {isFetchingContacts ? (
              <span>Loading contacts...</span>
            ) : filteredContacts.length === 0 ? (
              <span>No contacts - select fields to view data</span>
            ) : (
              <span>
                Showing <strong>{filteredContacts.length}</strong> contacts
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || filteredContacts.length === 0 || isFetchingContacts}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {filteredContacts.length === 0 ? 0 : currentPage} of {totalPages || 0}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || filteredContacts.length === 0 || isFetchingContacts}
            >
              Next
            </Button>
          </div>
        </div>
        <Separator />
        <ContactsTable contacts={getCurrentContacts()} />
      </div>
    </div>
  )
}

