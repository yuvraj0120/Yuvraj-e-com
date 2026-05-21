"use client"

import { useEffect, useMemo, useState } from "react"
import { Pencil, Trash2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

type UserRow = {
  id: string
  name: string | null
  email: string
  role: "ADMIN" | "CUSTOMER"
  createdAt: string
}

function displayNameNorm(name: string | null | undefined) {
  const t = (name ?? "").trim()
  return t.length ? t : null
}

function roleLabel(role: UserRow["role"]) {
  return role === "ADMIN" ? "Admin" : "User"
}

function isValidEmail(value: string) {
  const t = value.trim()
  if (!t) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

export function UsersTable() {
  const [rows, setRows] = useState<UserRow[]>([])
  const [editOpen, setEditOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [editName, setEditName] = useState("")
  const [editRole, setEditRole] = useState<UserRow["role"]>("CUSTOMER")
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editPassword, setEditPassword] = useState("")
  const [editPasswordConfirm, setEditPasswordConfirm] = useState("")

  const [createOpen, setCreateOpen] = useState(false)
  const [createEmail, setCreateEmail] = useState("")
  const [createName, setCreateName] = useState("")
  const [createPassword, setCreatePassword] = useState("")
  const [createPasswordConfirm, setCreatePasswordConfirm] = useState("")
  const [createRole, setCreateRole] = useState<UserRow["role"]>("CUSTOMER")
  const [createSaving, setCreateSaving] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [roleFilter, setRoleFilter] = useState<"all" | UserRow["role"]>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return rows.filter((row) => {
      if (roleFilter !== "all" && row.role !== roleFilter) return false
      if (!q) return true
      const name = (row.name ?? "").toLowerCase()
      const email = row.email.toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }, [rows, roleFilter, searchQuery])

  async function loadUsers() {
    const res = await fetch("/api/admin/users", { cache: "no-store" })
    if (!res.ok) return
    setRows((await res.json()) as UserRow[])
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const editHasChanges = useMemo(() => {
    if (!editUser) return false
    const nameDirty =
      displayNameNorm(editName) !== displayNameNorm(editUser.name)
    const roleDirty = editRole !== editUser.role
    const passwordDirty =
      editPassword.trim().length > 0 || editPasswordConfirm.trim().length > 0
    return nameDirty || roleDirty || passwordDirty
  }, [editUser, editName, editRole, editPassword, editPasswordConfirm])

  const createFormComplete = useMemo(() => {
    if (!createName.trim()) return false
    if (!isValidEmail(createEmail)) return false
    if (!createPassword || createPassword.length < 8) return false
    if (createPassword !== createPasswordConfirm) return false
    return true
  }, [createName, createEmail, createPassword, createPasswordConfirm])

  function openEdit(user: UserRow) {
    setEditUser(user)
    setEditName(user.name ?? "")
    setEditRole(user.role)
    setEditPassword("")
    setEditPasswordConfirm("")
    setEditError(null)
    setEditOpen(true)
  }

  async function saveEdit() {
    if (!editUser) return
    if (editPassword || editPasswordConfirm) {
      if (editPassword !== editPasswordConfirm) {
        setEditError("New password and confirmation do not match.")
        return
      }
      if (editPassword.length < 8) {
        setEditError("Password must be at least 8 characters.")
        return
      }
    }
    setEditSaving(true)
    setEditError(null)
    const payload: {
      name: string | null
      role: UserRow["role"]
      password?: string
    } = {
      name: editName.trim() || null,
      role: editRole,
    }
    if (editPassword.trim()) {
      payload.password = editPassword.trim()
    }
    const res = await fetch(`/api/admin/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const json = (await res.json()) as { error?: string } & Partial<UserRow>
    setEditSaving(false)
    if (!res.ok) {
      setEditError(json.error ?? "Update failed.")
      return
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === editUser.id
          ? {
              ...r,
              name: json.name ?? null,
              role: (json.role ?? r.role) as UserRow["role"],
            }
          : r
      )
    )
    setEditOpen(false)
    setEditUser(null)
    setEditPassword("")
    setEditPasswordConfirm("")
  }

  function openCreate() {
    setCreateEmail("")
    setCreateName("")
    setCreatePassword("")
    setCreatePasswordConfirm("")
    setCreateRole("CUSTOMER")
    setCreateError(null)
    setCreateOpen(true)
  }

  async function saveCreate() {
    if (createPassword !== createPasswordConfirm) {
      setCreateError("Password and confirmation do not match.")
      return
    }
    if (createPassword.length < 8) {
      setCreateError("Password must be at least 8 characters.")
      return
    }
    setCreateSaving(true)
    setCreateError(null)
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: createEmail.trim().toLowerCase(),
        name: createName.trim(),
        password: createPassword,
        role: createRole,
      }),
    })
    const json = (await res.json()) as { error?: string } & Partial<UserRow>
    setCreateSaving(false)
    if (!res.ok) {
      setCreateError(json.error ?? "Could not create user.")
      return
    }
    setCreateOpen(false)
    await loadUsers()
  }

  function openDelete(user: UserRow) {
    setDeleteTarget(user)
    setDeleteError(null)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError(null)
    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
      method: "DELETE",
    })
    const json = (await res.json()) as { error?: string }
    setDeleteLoading(false)
    if (!res.ok) {
      setDeleteError(json.error ?? "Delete failed.")
      return
    }
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    setDeleteOpen(false)
    setDeleteTarget(null)
  }

  return (
    <>
      <section className="rounded-xl border bg-card text-card-foreground">
        <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Users</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Admins can add users, assign user or admin role, and reset passwords.
            </p>
          </div>
          <Button
            type="button"
            className="cursor-pointer shrink-0"
            onClick={() => openCreate()}
          >
            <UserPlus className="mr-2 size-4" aria-hidden />
            Create user
          </Button>
        </div>
        <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[12rem] flex-1 space-y-1.5">
            <Label htmlFor="users-search" className="text-xs text-muted-foreground">
              Search
            </Label>
            <Input
              id="users-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name or email…"
              className="h-9"
            />
          </div>
          <div className="w-full min-w-[10rem] space-y-1.5 sm:w-44">
            <Label htmlFor="users-role-filter" className="text-xs text-muted-foreground">
              Role
            </Label>
            <NativeSelect
              id="users-role-filter"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as "all" | UserRow["role"])
              }
              className="h-9 w-full"
            >
              <NativeSelectOption value="all">All roles</NativeSelectOption>
              <NativeSelectOption value="CUSTOMER">User</NativeSelectOption>
              <NativeSelectOption value="ADMIN">Admin</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>
        <p className="px-4 py-2 text-xs text-muted-foreground">
          Showing {filteredRows.length} of {rows.length} users
        </p>
        <div className="overflow-x-auto p-1">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Joined</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    {rows.length === 0
                      ? "No users yet. Create one to get started."
                      : "No users match your filters."}
                  </td>
                </tr>
              ) : null}
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/80 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-3 py-2.5 font-medium">{row.name ?? "—"}</td>
                  <td className="px-3 py-2.5">{row.email}</td>
                  <td className="px-3 py-2.5">
                    <span className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium">
                      {roleLabel(row.role)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {new Date(row.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Edit ${row.email}`}
                        onClick={() => openEdit(row)}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="cursor-pointer text-destructive hover:text-destructive"
                        aria-label={`Delete ${row.email}`}
                        onClick={() => openDelete(row)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>
              Update name, role, or set a new password. Leave password blank to keep
              the current one. Email cannot be changed here.
            </DialogDescription>
          </DialogHeader>
          {editUser ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{editUser.email}</p>
              <div className="space-y-2">
                <Label htmlFor="edit-user-name">Name</Label>
                <Input
                  id="edit-user-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-role">Role</Label>
                <NativeSelect
                  id="edit-user-role"
                  value={editRole}
                  onChange={(e) =>
                    setEditRole(e.target.value as UserRow["role"])
                  }
                  className="w-full"
                >
                  <NativeSelectOption value="CUSTOMER">User</NativeSelectOption>
                  <NativeSelectOption value="ADMIN">Admin</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-password">New password (optional)</Label>
                <Input
                  id="edit-user-password"
                  type="password"
                  autoComplete="new-password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-password-confirm">
                  Confirm new password
                </Label>
                <Input
                  id="edit-user-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={editPasswordConfirm}
                  onChange={(e) => setEditPasswordConfirm(e.target.value)}
                  placeholder="Repeat if changing password"
                />
              </div>
              {editError ? (
                <p className="text-sm text-destructive">{editError}</p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={editSaving || !editHasChanges}
                  onClick={() => void saveEdit()}
                >
                  {editSaving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>
              Add a sign-in account. They can log in with email and password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-user-email">Email</Label>
              <Input
                id="create-user-email"
                type="email"
                autoComplete="off"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-user-name">Name</Label>
              <Input
                id="create-user-name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Display name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-user-role">Role</Label>
              <NativeSelect
                id="create-user-role"
                value={createRole}
                onChange={(e) =>
                  setCreateRole(e.target.value as UserRow["role"])
                }
                className="w-full"
              >
                <NativeSelectOption value="CUSTOMER">User</NativeSelectOption>
                <NativeSelectOption value="ADMIN">Admin</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-user-password">Password</Label>
              <Input
                id="create-user-password"
                type="password"
                autoComplete="new-password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-user-password-confirm">Confirm password</Label>
              <Input
                id="create-user-password-confirm"
                type="password"
                autoComplete="new-password"
                value={createPasswordConfirm}
                onChange={(e) => setCreatePasswordConfirm(e.target.value)}
              />
            </div>
            {createError ? (
              <p className="text-sm text-destructive">{createError}</p>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={createSaving || !createFormComplete}
                onClick={() => void saveCreate()}
              >
                {createSaving ? "Creating…" : "Create user"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.email}
              </span>{" "}
              and their saved addresses. Orders stay in the system with no linked
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p className="text-center text-sm text-destructive">{deleteError}</p>
          ) : null}
          <AlertDialogFooter className="sm:justify-end">
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteLoading}
              onClick={() => void confirmDelete()}
            >
              {deleteLoading ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
