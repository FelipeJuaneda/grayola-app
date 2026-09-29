import { Wordmark } from "@/components/brand/wordmark"
import type { CurrentUser } from "@/lib/auth/session"
import { ROLE_LABEL } from "@/lib/roles"

import { UserMenu } from "./user-menu"

export function AppHeader({ user }: { user: CurrentUser }) {
  const name = user.fullName ?? user.email

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-rule bg-paper/92 backdrop-blur-[2px] supports-[backdrop-filter]:bg-paper/85">
      <div className="container-swiss flex h-16 items-center justify-between gap-4">
        <Wordmark />
        <div className="flex items-center gap-2">
          <span className="hidden rounded-sm border border-rule px-2 py-1 text-caption font-semibold text-ink-2 md:inline">
            Demo · datos ficticios
          </span>
          <UserMenu name={name} email={user.email} roleLabel={ROLE_LABEL[user.role]} />
        </div>
      </div>
    </header>
  )
}
