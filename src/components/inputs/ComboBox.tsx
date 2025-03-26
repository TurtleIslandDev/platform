import * as React from "react"
import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../../utils/lib/utils"
import { Button } from "../ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { set } from "react-hook-form"
import { Input } from "@material-tailwind/react"

interface ComboboxItem {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
}

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select an item",
  emptyMessage = "No items found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const [allItems, setAllItems] = useState([{ value: "", label: "Include as is", description: "Keep original header" }, ...items])
  const [filter, setFilter] = useState("")



  useEffect(() => {

    const predefinedFields = [{ value: "", label: "Include as is", description: "Keep original header" }, ...items]

    setAllItems(
      predefinedFields.filter((field) =>
        field?.label?.toLowerCase().includes(filter.toLowerCase())
      )      
    );
  }, [filter]);


  const selectedItem = allItems.find((item) => item.value === value)


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedItem ? selectedItem.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <Input
            className="w-full h-11 bg-white border-b border-gray-200 p-2"
            placeholder="Search..."
            crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          
            onChange={(e) => setFilter(e.target.value)}
          />
          
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {allItems.map((item) => {
                return(
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {    
                    onChange(item.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                  </div>
                </CommandItem>
            )})}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

