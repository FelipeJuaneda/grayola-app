"use client"

import { Check } from "lucide-react"
import { DropdownMenu as MenuPrimitive } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export const DropdownMenu = MenuPrimitive.Root
export const DropdownMenuTrigger = MenuPrimitive.Trigger
export const DropdownMenuGroup = MenuPrimitive.Group
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-[var(--z-dropdown)] min-w-52 overflow-hidden rounded-md border border-rule bg-surface p-1 shadow-overlay",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  )
}

const itemClass =
  "relative flex min-h-10 cursor-default items-center gap-2.5 rounded-sm px-2.5 text-small outline-none select-none data-[highlighted]:bg-subtle data-[disabled]:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0"

export function DropdownMenuItem({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & { variant?: "default" | "danger" }) {
  return (
    <MenuPrimitive.Item
      className={cn(itemClass, variant === "danger" && "text-danger", className)}
      {...props}
    />
  )
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem className={cn(itemClass, "pl-8", className)} {...props}>
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <Check aria-hidden="true" />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cn("kicker px-2.5 pt-2 pb-1", className)} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn("my-1 h-px bg-rule", className)} {...props} />
}
