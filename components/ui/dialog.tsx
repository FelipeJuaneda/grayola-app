"use client"

import { X } from "lucide-react"
import { AlertDialog as AlertPrimitive, Dialog as DialogPrimitive } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./button"

const overlayClass =
  "fixed inset-0 z-[var(--z-overlay)] bg-ink/45 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none"

const contentClass = [
  "fixed top-1/2 left-1/2 z-[var(--z-modal)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2",
  "rounded-lg border border-rule bg-surface p-6 shadow-overlay",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]",
  "duration-200 motion-reduce:animate-none",
]

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClass} />
      <DialogPrimitive.Content className={cn(contentClass, "max-w-lg", className)} {...props}>
        {children}
        <DialogPrimitive.Close
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "absolute top-3 right-3")}
          aria-label="Cerrar"
        >
          <X aria-hidden="true" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mb-5 grid gap-1.5 pr-8", className)} {...props} />
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-h3 font-bold", className)} {...props} />
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-body text-ink-2", className)} {...props} />
}

// Confirmación de acciones destructivas: el foco inicial queda en "Cancelar".
export const AlertDialog = AlertPrimitive.Root
export const AlertDialogTrigger = AlertPrimitive.Trigger

export function AlertDialogContent({ className, ...props }: ComponentProps<typeof AlertPrimitive.Content>) {
  return (
    <AlertPrimitive.Portal>
      <AlertPrimitive.Overlay className={overlayClass} />
      <AlertPrimitive.Content className={cn(contentClass, "max-w-md", className)} {...props} />
    </AlertPrimitive.Portal>
  )
}

export function AlertDialogTitle({ className, ...props }: ComponentProps<typeof AlertPrimitive.Title>) {
  return <AlertPrimitive.Title className={cn("text-h3 font-bold", className)} {...props} />
}

export function AlertDialogDescription({ className, ...props }: ComponentProps<typeof AlertPrimitive.Description>) {
  return <AlertPrimitive.Description className={cn("mt-2 text-body text-ink-2", className)} {...props} />
}

export const AlertDialogCancel = AlertPrimitive.Cancel
export const AlertDialogAction = AlertPrimitive.Action
