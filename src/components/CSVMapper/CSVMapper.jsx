import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table"
import { TableHeader } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Combobox } from "../inputs/ComboBox"
import { Checkbox } from "../ui/checkbox"

import { useState, useEffect } from "react"

export function CSVMapper({
  headers,
  predefinedFields,
  dataTypes,
  mappings,
  onFieldMapping,
  onDataTypeChange,
  onIncludeChange,
}) {
    
  const [filter, setFilter] = useState("");
  const [filtertedFields, setFilteredFields] = useState(predefinedFields);


  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">Include</TableHead>
            <TableHead className="w-1/4">CSV Header</TableHead>
            <TableHead className="w-1/3">Map to Field</TableHead>            
          </TableRow>
        </TableHeader>
        <TableBody>
          {headers.map((header) => (
            <TableRow
              key={header}
              className={!mappings[header]?.included ? "opacity-50" : ""}
            >
              <TableCell>
                <Checkbox
                  checked={mappings[header]?.included}
                  onCheckedChange={(checked) => onIncludeChange(header, !!checked)}
                />
              </TableCell>
              <TableCell className="font-medium">{header}</TableCell>
              <TableCell>
                <Combobox
                  items={filtertedFields.map(
                    (field) => ({
                    value: field.key,
                    label: field.name,
                    description: field.description,
                  }))}
                  value={mappings[header]?.fieldId || ""}
                  onChange={(value) => {     
                    onFieldMapping(header, value)
                  }}
                  placeholder="Search fields..."
                  emptyMessage="No matching fields found"                  
                  disabled={!mappings[header]?.included}
                />
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}