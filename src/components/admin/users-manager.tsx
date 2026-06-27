"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Search, ShieldBan, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MembershipBadge } from "@/components/membership-badge";
import type { PublicUser } from "@/lib/serialize";
import type { MembershipStatus } from "@/lib/membership";
import { formatDate } from "@/lib/utils";

/** ISO string -> value for <input type="datetime-local"> (local time). */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function localInputToISO(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const STATUSES: MembershipStatus[] = [
  "pending",
  "active",
  "expired",
  "blocked",
];

interface EditState {
  membershipStatus: MembershipStatus;
  packageName: "basic" | "pro" | "none";
  role: "user" | "admin";
  membershipStart: string;
  membershipEnd: string;
}

export function UsersManager({
  initialUsers,
}: {
  initialUsers: PublicUser[];
}) {
  const [users, setUsers] = useState<PublicUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<PublicUser | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchTerm =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.whatsapp.toLowerCase().includes(term);
      const matchStatus =
        statusFilter === "all" || u.membershipStatus === statusFilter;
      return matchTerm && matchStatus;
    });
  }, [users, search, statusFilter]);

  function openEdit(user: PublicUser) {
    setEditing(user);
    setEdit({
      membershipStatus: user.membershipStatus,
      packageName: user.packageName ?? "none",
      role: user.role,
      membershipStart: toLocalInput(user.membershipStart),
      membershipEnd: toLocalInput(user.membershipEnd),
    });
  }

  async function patchUser(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Gagal memperbarui user");
    }
    return data.data.user as PublicUser;
  }

  function applyUpdate(updated: PublicUser) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }

  async function saveEdit() {
    if (!editing || !edit) return;
    setSaving(true);
    try {
      const updated = await patchUser(editing.id, {
        membershipStatus: edit.membershipStatus,
        packageName: edit.packageName === "none" ? null : edit.packageName,
        role: edit.role,
        membershipStart: localInputToISO(edit.membershipStart),
        membershipEnd: localInputToISO(edit.membershipEnd),
      });
      applyUpdate(updated);
      toast.success("User diperbarui");
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memperbarui user");
    } finally {
      setSaving(false);
    }
  }

  async function quickActivate(user: PublicUser) {
    try {
      const now = new Date();
      const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const updated = await patchUser(user.id, {
        membershipStatus: "active",
        membershipStart: now.toISOString(),
        membershipEnd: end.toISOString(),
        packageName: user.packageName ?? "basic",
      });
      applyUpdate(updated);
      toast.success(`${user.name} diaktifkan 30 hari`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengaktifkan");
    }
  }

  async function blockUser(user: PublicUser) {
    try {
      const updated = await patchUser(user.id, {
        membershipStatus: "blocked",
      });
      applyUpdate(updated);
      toast.success(`${user.name} diblokir`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memblokir");
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama, email, atau WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama / Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Berakhir</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Tidak ada user.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.email}
                      {u.role === "admin" && (
                        <span className="ml-2 rounded bg-primary/15 px-1.5 py-0.5 text-gold-400">
                          admin
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{u.whatsapp}</TableCell>
                  <TableCell className="text-sm capitalize">
                    {u.packageName ?? "-"}
                  </TableCell>
                  <TableCell>
                    <MembershipBadge status={u.membershipStatus} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(u.membershipEnd)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Aktifkan 30 hari"
                        onClick={() => quickActivate(u)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Blokir"
                        onClick={() => blockUser(u)}
                      >
                        <ShieldBan className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Edit"
                        onClick={() => openEdit(u)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              {editing?.name} — {editing?.email}
            </DialogDescription>
          </DialogHeader>

          {edit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={edit.membershipStatus}
                    onValueChange={(v) =>
                      setEdit({ ...edit, membershipStatus: v as MembershipStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Paket</Label>
                  <Select
                    value={edit.packageName}
                    onValueChange={(v) =>
                      setEdit({
                        ...edit,
                        packageName: v as EditState["packageName"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={edit.role}
                  onValueChange={(v) =>
                    setEdit({ ...edit, role: v as "user" | "admin" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Mulai</Label>
                  <Input
                    type="datetime-local"
                    value={edit.membershipStart}
                    onChange={(e) =>
                      setEdit({ ...edit, membershipStart: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Berakhir</Label>
                  <Input
                    type="datetime-local"
                    value={edit.membershipEnd}
                    onChange={(e) =>
                      setEdit({ ...edit, membershipEnd: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Batal
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
