import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"

export function DatePicker({
    date,
    setDate,
    className
}: {
    date: Date | undefined
    setDate: (date: Date | undefined) => void,
    className?: string
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal bg-white border-[var(--color-surface)] hover:bg-[var(--color-surface)]",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {date ? format(date, "PPP") : <span className="opacity-50">Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-xl" align="start">
                <div className="border border-[var(--color-surface)] rounded-md bg-white overflow-hidden">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
