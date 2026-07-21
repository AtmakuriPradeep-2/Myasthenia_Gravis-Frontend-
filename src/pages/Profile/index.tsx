import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import toast from "react-hot-toast";
import dayjs from "dayjs";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { useAuth } from "../../contexts/AuthContext";
import { useUpdateProfile } from "../../hooks/useUser";
import { getUserDisplayName, getUserInitial } from "../../utils/user";

const ROLE_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  Admin: { bg: "rgba(239,68,68,0.12)", text: "#EF4444", border: "rgba(239,68,68,0.3)" },
  Clinician: { bg: "rgba(37,99,235,0.12)", text: "#2563EB", border: "rgba(37,99,235,0.3)" },
  Researcher: { bg: "rgba(139,92,246,0.12)", text: "#8B5CF6", border: "rgba(139,92,246,0.3)" },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();

  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter a valid full name.");
      return;
    }
    try {
      await updateProfileMutation.mutateAsync({
        full_name: fullName.trim(),
        email: email.trim(),
      });
      toast.success("Profile updated successfully!");
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update profile.");
    }
  };

  const roleKey = user?.role ?? "Clinician";
  const roleStyle = ROLE_COLOR[roleKey] ?? ROLE_COLOR.Clinician;
  const todayFormatted = dayjs().format("MMMM D, YYYY");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

      {/* ─── Hero Banner ─── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          position: "relative",
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #1D4ED8 100%)",
          color: "#FFFFFF",
          boxShadow: "0 12px 40px rgba(15,23,42,0.2)",
        }}
      >
        {/* Decorative circle blobs */}
        <Box sx={{
          position: "absolute", top: -60, right: -60, width: 260, height: 260,
          borderRadius: "50%", background: "rgba(37,99,235,0.15)", pointerEvents: "none"
        }} />
        <Box sx={{
          position: "absolute", bottom: -40, left: "40%", width: 180, height: 180,
          borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none"
        }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          sx={{ alignItems: { xs: "flex-start", sm: "center" }, p: { xs: 3, md: 4.5 }, position: "relative", zIndex: 1 }}
        >
          {/* Avatar */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                fontSize: "2.4rem",
                fontWeight: 800,
                bgcolor: "#2563EB",
                boxShadow: "0 0 0 4px rgba(255,255,255,0.15), 0 8px 24px rgba(37,99,235,0.5)",
              }}
            >
              {initial}
            </Avatar>
            <Box
              sx={{
                position: "absolute", bottom: 2, right: 2,
                width: 20, height: 20, borderRadius: "50%",
                bgcolor: "#10B981",
                border: "3px solid #0F172A",
                boxShadow: "0 0 8px rgba(16,185,129,0.6)",
              }}
            />
          </Box>

          {/* Name & Meta */}
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}>
              <Chip
                icon={<ShieldOutlinedIcon sx={{ color: `${roleStyle.text} !important`, fontSize: "13px !important" }} />}
                label={roleKey}
                size="small"
                sx={{
                  bgcolor: roleStyle.bg,
                  color: roleStyle.text,
                  fontWeight: 700,
                  border: `1px solid ${roleStyle.border}`,
                  backdropFilter: "blur(4px)",
                }}
              />
              <Chip
                icon={<VerifiedUserRoundedIcon sx={{ color: "#6EE7B7 !important", fontSize: "13px !important" }} />}
                label="Account Active"
                size="small"
                sx={{
                  bgcolor: "rgba(16,185,129,0.15)",
                  color: "#6EE7B7",
                  fontWeight: 700,
                  border: "1px solid rgba(110,231,183,0.3)",
                }}
              />
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
              @{user?.username} &nbsp;·&nbsp; {roleKey} at MG AI Remote Monitoring
            </Typography>
          </Box>

          {/* Today's date badge */}
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
              {todayFormatted}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", color: "#475569" }}>
              Current session active
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* ─── Quick Stats Row ─── */}
      <Grid container spacing={2}>
        {[
          {
            icon: <AccountCircleRoundedIcon sx={{ color: "#2563EB", fontSize: 22 }} />,
            label: "Display Name",
            value: displayName,
            bg: "rgba(37,99,235,0.06)",
          },
          {
            icon: <BadgeOutlinedIcon sx={{ color: "#8B5CF6", fontSize: 22 }} />,
            label: "Username Handle",
            value: `@${user?.username ?? "—"}`,
            bg: "rgba(139,92,246,0.06)",
          },
          {
            icon: <MedicalServicesRoundedIcon sx={{ color: "#10B981", fontSize: 22 }} />,
            label: "Clinical Role",
            value: roleKey,
            bg: "rgba(16,185,129,0.06)",
          },
          {
            icon: <CalendarTodayRoundedIcon sx={{ color: "#F59E0B", fontSize: 22 }} />,
            label: "Account Status",
            value: "Active & Verified",
            bg: "rgba(245,158,11,0.06)",
          },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(15,23,42,0.07)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40, height: 40, borderRadius: 2.5,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    bgcolor: stat.bg,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A" }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ─── Main Content ─── */}
      <Grid container spacing={3}>

        {/* Personal Information Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(15,23,42,0.03)",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
              <Box
                sx={{
                  width: 38, height: 38, borderRadius: 2.5,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  bgcolor: "rgba(37,99,235,0.1)",
                }}
              >
                <EditRoundedIcon sx={{ color: "#2563EB", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                  Edit Profile Information
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Update your display name and email address
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2.5, borderColor: "#F1F5F9" }} />

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="e.g. Dr. Pradeep Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonRoundedIcon sx={{ color: "#64748B" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="e.g. pradeep@hospital.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRoundedIcon sx={{ color: "#64748B" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563EB" },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  disabled
                  label="Username Handle"
                  value={user?.username ?? ""}
                  helperText="Usernames are fixed and cannot be changed."
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeOutlinedIcon sx={{ color: "#94A3B8" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#F8FAFC" },
                  }}
                />

                <Box sx={{ pt: 0.5 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveRoundedIcon />}
                    disabled={updateProfileMutation.isPending}
                    sx={{
                      height: 48,
                      px: 4,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                      boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
                      textTransform: "none",
                      "&:hover": {
                        boxShadow: "0 6px 20px rgba(37,99,235,0.45)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Profile Changes"}
                  </Button>
                </Box>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Account Summary Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(15,23,42,0.03)",
              height: "100%",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
              <Box
                sx={{
                  width: 38, height: 38, borderRadius: 2.5,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  bgcolor: "rgba(16,185,129,0.1)",
                }}
              >
                <VerifiedUserRoundedIcon sx={{ color: "#10B981", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>
                  Account Details
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Your account information & system role
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2.5, borderColor: "#F1F5F9" }} />

            <Stack spacing={1.5}>
              {[
                { label: "Full Name", value: displayName, icon: <PersonRoundedIcon sx={{ fontSize: 18, color: "#2563EB" }} /> },
                { label: "Email Address", value: user?.email || "Not set", icon: <EmailRoundedIcon sx={{ fontSize: 18, color: "#8B5CF6" }} /> },
                { label: "Username", value: `@${user?.username ?? "—"}`, icon: <BadgeOutlinedIcon sx={{ fontSize: 18, color: "#F59E0B" }} /> },
                { label: "Assigned Role", value: roleKey, icon: <MedicalServicesRoundedIcon sx={{ fontSize: 18, color: "#10B981" }} /> },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>{item.icon}</Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
