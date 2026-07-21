import { useState } from "react";
import {
  Box, Paper, Typography, Stack, Button, Chip, Avatar, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Select, FormControl, InputLabel, Divider, Tooltip,
  InputAdornment, CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";

import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "../../hooks/useUser";
import { useAuth } from "../../contexts/AuthContext";
import type { User } from "../../types/auth";
import type { UserCreatePayload, UserUpdatePayload } from "../../services/user.service";

const ROLES = ["Admin", "Clinician", "Researcher"];

const ROLE_STYLE: Record<string, { bg: string; text: string }> = {
  Admin:      { bg: "rgba(239,68,68,0.1)",   text: "#DC2626" },
  Clinician:  { bg: "rgba(37,99,235,0.1)",   text: "#2563EB" },
  Researcher: { bg: "rgba(139,92,246,0.1)",  text: "#7C3AED" },
};

// ─── Add User Dialog ────────────────────────────────────────────
function AddUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createUser = useCreateUser();
  const [form, setForm] = useState<UserCreatePayload>({
    username: "", email: "", password: "", full_name: "", role: "Clinician",
  });

  const handleChange = (field: keyof UserCreatePayload, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password || !form.full_name) {
      toast.error("All fields are required.");
      return;
    }
    try {
      await createUser.mutateAsync(form);
      toast.success(`User "${form.full_name}" created successfully!`);
      setForm({ username: "", email: "", password: "", full_name: "", role: "Clinician" });
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create user.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}>
      <DialogTitle sx={{ fontWeight: 800, color: "#0F172A", pb: 0 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <PersonAddRoundedIcon sx={{ color: "#2563EB" }} />
          <span>Add New User</span>
        </Stack>
      </DialogTitle>
      <Divider sx={{ mx: 3, mt: 2 }} />
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField fullWidth label="Full Name" value={form.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonRoundedIcon sx={{ color: "#64748B" }} /></InputAdornment> } }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />

          <TextField fullWidth label="Email Address" type="email" value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailRoundedIcon sx={{ color: "#64748B" }} /></InputAdornment> } }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />

          <TextField fullWidth label="Username" value={form.username}
            onChange={(e) => handleChange("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
            helperText="Lowercase letters, no spaces. Used for login identification."
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><BadgeRoundedIcon sx={{ color: "#64748B" }} /></InputAdornment> } }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />

          <TextField fullWidth label="Password" type="password" value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: "#64748B" }} /></InputAdornment> } }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />

          <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
            <InputLabel>Clinical Role</InputLabel>
            <Select value={form.role} label="Clinical Role"
              onChange={(e) => handleChange("role", e.target.value)}>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  <Chip label={r} size="small"
                    sx={{ bgcolor: ROLE_STYLE[r]?.bg, color: ROLE_STYLE[r]?.text, fontWeight: 700 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}
          disabled={createUser.isPending}
          sx={{
            borderRadius: 3, textTransform: "none", fontWeight: 700,
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            px: 3,
          }}>
          {createUser.isPending ? "Creating..." : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Edit User Dialog ────────────────────────────────────────────
function EditUserDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const updateUser = useUpdateUser();
  const [form, setForm] = useState<UserUpdatePayload>({
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  });

  const handleSubmit = async () => {
    try {
      await updateUser.mutateAsync({ userId: user.id, data: form });
      toast.success("User updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update user.");
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}>
      <DialogTitle sx={{ fontWeight: 800, color: "#0F172A", pb: 0 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <EditRoundedIcon sx={{ color: "#2563EB" }} />
          <span>Edit User — {user.full_name}</span>
        </Stack>
      </DialogTitle>
      <Divider sx={{ mx: 3, mt: 2 }} />
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField fullWidth label="Full Name" value={form.full_name ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />

          <TextField fullWidth label="Email Address" type="email" value={form.email ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />

          <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
            <InputLabel>Clinical Role</InputLabel>
            <Select value={form.role ?? "Clinician"} label="Clinical Role"
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  <Chip label={r} size="small"
                    sx={{ bgcolor: ROLE_STYLE[r]?.bg, color: ROLE_STYLE[r]?.text, fontWeight: 700 }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
            <InputLabel>Account Status</InputLabel>
            <Select value={form.is_active ? "active" : "inactive"} label="Account Status"
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === "active" }))}>
              <MenuItem value="active">
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <CheckCircleRoundedIcon sx={{ color: "#10B981", fontSize: 18 }} />
                  <span>Active</span>
                </Stack>
              </MenuItem>
              <MenuItem value="inactive">
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <BlockRoundedIcon sx={{ color: "#EF4444", fontSize: 18 }} />
                  <span>Inactive</span>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={updateUser.isPending}
          sx={{
            borderRadius: 3, textTransform: "none", fontWeight: 700,
            background: "linear-gradient(135deg, #2563EB, #1D4ED8)", px: 3,
          }}>
          {updateUser.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────
function DeleteConfirmDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const deleteUser = useDeleteUser();
  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(user.id);
      toast.success(`User "${user.full_name}" deleted.`);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to delete user.");
    }
  };
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4, p: 1 } } }}>
      <DialogTitle sx={{ fontWeight: 800, color: "#0F172A" }}>Delete User</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          Are you sure you want to permanently delete{" "}
          <strong style={{ color: "#0F172A" }}>{user.full_name}</strong> ({user.email})?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleDelete} disabled={deleteUser.isPending}
          sx={{
            borderRadius: 3, textTransform: "none", fontWeight: 700,
            bgcolor: "#EF4444", "&:hover": { bgcolor: "#DC2626" }, px: 3,
          }}>
          {deleteUser.isPending ? "Deleting..." : "Delete User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = users.filter((u) =>
    [u.full_name, u.email, u.username, u.role]
      .join(" ").toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "Admin").length,
    clinicians: users.filter((u) => u.role === "Clinician").length,
    researchers: users.filter((u) => u.role === "Researcher").length,
    active: users.filter((u) => u.is_active).length,
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

      {/* ─── Header ─── */}
      <Paper elevation={0} sx={{
        p: { xs: 3, md: 4 }, borderRadius: 5,
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #1D4ED8 100%)",
        color: "#FFF", position: "relative", overflow: "hidden",
        boxShadow: "0 12px 40px rgba(15,23,42,0.2)",
      }}>
        <Box sx={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", bgcolor: "rgba(37,99,235,0.15)" }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ position: "relative", zIndex: 1, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "rgba(37,99,235,0.3)", width: 56, height: 56, boxShadow: "0 0 0 3px rgba(255,255,255,0.15)" }}>
              <ManageAccountsRoundedIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.25 }}>
                Manage clinician and researcher access to the MG AI Platform
              </Typography>
            </Box>
          </Stack>
          <Button variant="contained" startIcon={<PersonAddRoundedIcon />}
            onClick={() => setShowAddDialog(true)}
            sx={{
              height: 46, px: 3, borderRadius: 3, fontWeight: 700, textTransform: "none",
              bgcolor: "#2563EB", boxShadow: "0 4px 16px rgba(37,99,235,0.5)",
              "&:hover": { bgcolor: "#1D4ED8" },
            }}>
            Add New User
          </Button>
        </Stack>
      </Paper>

      {/* ─── Stats Row ─── */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {[
          { label: "Total Users", value: stats.total, color: "#2563EB" },
          { label: "Admins", value: stats.admins, color: "#EF4444" },
          { label: "Clinicians", value: stats.clinicians, color: "#2563EB" },
          { label: "Researchers", value: stats.researchers, color: "#7C3AED" },
          { label: "Active Accounts", value: stats.active, color: "#10B981" },
        ].map((s) => (
          <Paper key={s.label} elevation={0} sx={{
            flex: 1, p: 2.5, borderRadius: 3.5, border: "1px solid #E2E8F0",
            textAlign: "center", bgcolor: "#FFF",
          }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>{s.label}</Typography>
          </Paper>
        ))}
      </Stack>

      {/* ─── Table ─── */}
      <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#FFF", overflow: "hidden" }}>

        {/* Search bar */}
        <Box sx={{ p: 2.5, borderBottom: "1px solid #F1F5F9" }}>
          <TextField fullWidth placeholder="Search by name, email, username or role…" value={search}
            onChange={(e) => setSearch(e.target.value)} size="small"
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: "#94A3B8" }} /></InputAdornment> } }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F8FAFC" }}>
                  {["User", "Username", "Email", "Role", "Status", "Actions"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #E2E8F0" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#94A3B8" }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    const rs = ROLE_STYLE[u.role] ?? ROLE_STYLE.Clinician;
                    return (
                      <TableRow key={u.id} hover sx={{ "&:last-child td": { borderBottom: "none" } }}>
                        {/* Name + Avatar */}
                        <TableCell>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: rs.bg, color: rs.text, fontWeight: 700, fontSize: 14 }}>
                              {u.full_name?.charAt(0).toUpperCase() || "?"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                                {u.full_name}
                                {isSelf && <Chip label="You" size="small" sx={{ ml: 1, height: 18, fontSize: "0.6rem", bgcolor: "#ECFDF5", color: "#059669", fontWeight: 700 }} />}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#475569", fontFamily: "monospace" }}>
                            @{u.username}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#475569" }}>
                            {u.email}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip label={u.role} size="small"
                            sx={{ bgcolor: rs.bg, color: rs.text, fontWeight: 700, border: `1px solid ${rs.text}33` }} />
                        </TableCell>

                        <TableCell>
                          <Chip
                            icon={u.is_active
                              ? <CheckCircleRoundedIcon sx={{ fontSize: "14px !important", color: "#10B981 !important" }} />
                              : <BlockRoundedIcon sx={{ fontSize: "14px !important", color: "#EF4444 !important" }} />}
                            label={u.is_active ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              bgcolor: u.is_active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                              color: u.is_active ? "#059669" : "#DC2626",
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Edit User">
                              <IconButton size="small" onClick={() => setEditTarget(u)}
                                sx={{ color: "#2563EB", "&:hover": { bgcolor: "rgba(37,99,235,0.1)" } }}>
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={isSelf ? "Cannot delete your own account" : "Delete User"}>
                              <span>
                                <IconButton size="small" onClick={() => setDeleteTarget(u)} disabled={isSelf}
                                  sx={{ color: "#EF4444", "&:hover": { bgcolor: "rgba(239,68,68,0.1)" }, "&.Mui-disabled": { color: "#D1D5DB" } }}>
                                  <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ─── Dialogs ─── */}
      <AddUserDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
      {editTarget && <EditUserDialog user={editTarget} onClose={() => setEditTarget(null)} />}
      {deleteTarget && <DeleteConfirmDialog user={deleteTarget} onClose={() => setDeleteTarget(null)} />}
    </Box>
  );
}
