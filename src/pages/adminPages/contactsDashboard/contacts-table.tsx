import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { useEffect, useState } from "react"


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


interface ContactsTableProps {
  contacts: Contact[]
}

export default function ContactsTable({ contacts }: ContactsTableProps) {
  // Function to get badge variant based on source
  
  const [columnData, setColumnData] = useState<string[]>([])

  console.log(contacts)

  useEffect(() => {

    let uniqueColumns = new Set<string>()

    for (let c in contacts) {
      Object.keys(contacts[c]).forEach((key) => uniqueColumns.add(key))
    }

    let listColumns = Array.from(uniqueColumns)

    setColumnData(listColumns)
  }, [contacts])


  // Function to get badge variant based on type
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "upload":
        return "outline"
      case "api":
        return "secondary"
      case "manual":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            {columnData.map((column) => (
              <TableHead key={column} className="w-[120px]">
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </TableHead>
            ))}            
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No contacts found.
              </TableCell>
            </TableRow>
          ) : (            

            contacts.map((contact) => (

              // Only render the columns that are in columnData
              <TableRow key={contact.id}>
                {columnData.map((column) => (
                    <TableCell key={column} className="font-mono text-xs" style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                    {typeof contact[column as keyof Contact] === "boolean" ? (contact[column as keyof Contact] ? "True" : "False") : String(contact[column as keyof Contact])}
                    </TableCell>
                ))}
              </TableRow>
              
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

