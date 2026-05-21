"use client"

import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [editableName, setEditableName] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const displayName = session?.user?.name ?? "User"
  const email = session?.user?.email ?? "Not available"
  const letter = (displayName[0] ?? "U").toUpperCase()
  const currentName = session?.user?.name?.trim() ?? ""
  const hasNameChanged = editableName.trim() !== currentName
  const canSaveName = hasNameChanged && editableName.trim().length > 0 && !saving

  useEffect(() => {
    setEditableName(session?.user?.name ?? "")
  }, [session?.user?.name])

  async function saveName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editableName.trim()) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editableName }),
      })
      if (!res.ok) {
        setMessage("Unable to update name.")
        return
      }
      setMessage("Name updated. Please re-login to refresh session name.")
    } catch {
      setMessage("Unable to update name.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-xl border bg-card p-6 text-card-foreground">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your basic account information.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full border bg-muted text-lg font-semibold">
          {letter}
        </div>
        <div>
          <p className="text-base font-semibold">{session?.user?.name ?? "User"}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <form onSubmit={saveName} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            value={editableName}
            onChange={(e) => setEditableName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={!canSaveName}>
            {saving ? "Saving..." : "Save name"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setLogoutDialogOpen(true)}
          >
            Logout
          </Button>
        </div>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </form>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Yes, logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
