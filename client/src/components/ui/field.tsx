import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const Field = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        orientation?: "vertical" | "horizontal" | "responsive"
    }
>(({ className, orientation = "vertical", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "group flex flex-col gap-2",
            orientation === "horizontal" &&
            "flex-row items-center justify-between gap-4",
            orientation === "responsive" &&
            "@container/field flex-col gap-2 @[24rem]/field:flex-row @[24rem]/field:items-center @[24rem]/field:justify-between @[24rem]/field:gap-4",
            className
        )}
        data-orientation={orientation}
        {...props}
    />
))
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "label"
    return (
        <Comp
            ref={ref}
            className={cn(
                "text-sm font-bold uppercase tracking-widest leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[var(--color-text)] opacity-70",
                className
            )}
            {...props}
        />
    )
})
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-[10px] text-muted-foreground opacity-60 font-mono", className)}
        {...props}
    />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-[10px] font-medium text-destructive", className)}
        {...props}
    />
))
FieldError.displayName = "FieldError"

const FieldGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col gap-4", className)}
        {...props}
    />
))
FieldGroup.displayName = "FieldGroup"

const FieldSet = React.forwardRef<
    HTMLFieldSetElement,
    React.HTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
    <fieldset
        ref={ref}
        className={cn("flex flex-col gap-4 p-4 border border-[var(--color-surface)] rounded-sm", className)}
        {...props}
    />
))
FieldSet.displayName = "FieldSet"

const FieldLegend = React.forwardRef<
    HTMLLegendElement,
    React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
    <legend
        ref={ref}
        className={cn("px-2 text-sm font-bold uppercase tracking-widest text-[var(--color-text)]", className)}
        {...props}
    />
))
FieldLegend.displayName = "FieldLegend"

export {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldSet,
    FieldLegend,
}
