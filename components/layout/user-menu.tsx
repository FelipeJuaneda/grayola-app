"use client"

import { ChevronDown, LogOut, Monitor, Moon, Sun, UserRound } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useTransition } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/misc"
import { signOut } from "@/features/auth/actions"

export function UserMenu({ name, email, roleLabel }: { name: string; email: string; roleLabel: string }) {
  const { theme, setTheme } = useTheme()
  const [pending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex min-h-11 items-center gap-2.5 rounded-sm px-2 hover:bg-subtle data-[state=open]:bg-subtle"
        // El nombre accesible empieza con el texto visible (WCAG 2.5.3).
        aria-label={`${name} ${roleLabel}, menú de cuenta`}
      >
        <Avatar name={name} />
        <span className="hidden text-left leading-tight sm:grid">
          <span className="text-small font-semibold">{name}</span>
          <span className="text-caption text-ink-2">{roleLabel}</span>
        </span>
        <ChevronDown aria-hidden="true" className="size-4 text-ink-2" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2.5 py-2">
          <p className="truncate text-small font-semibold">{name}</p>
          <p className="truncate text-caption text-ink-2">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <UserRound aria-hidden="true" />
            Tu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun aria-hidden="true" />
            Claro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon aria-hidden="true" />
            Oscuro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor aria-hidden="true" />
            Según el sistema
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          onSelect={(event) => {
            event.preventDefault()
            startTransition(() => signOut())
          }}
        >
          <LogOut aria-hidden="true" />
          {pending ? "Cerrando sesión…" : "Cerrar sesión"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
