import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import { useAuth } from "../../contexts/AuthContext";

const ROLES = ["Clinician", "Researcher", "Admin"];

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tabIndex, setTabIndex] = useState(0); // 0: Login, 1: Register
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("Clinician");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const cleanIdentifier = loginIdentifier.trim();

    if (!cleanIdentifier || !loginPassword) {
      toast.error("Please enter both username/email and password");
      return;
    }

    setLoading(true);
    try {
      await login(cleanIdentifier, loginPassword);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      let message = "Invalid credentials. Please check your username/email and password.";
      const detail = err?.response?.data?.detail;
      if (typeof detail === "string") {
        message = detail;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regUsername.trim() || !regPassword) {
      toast.error("Please fill in all required registration fields");
      return;
    }

    if (!regEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        username: regUsername.trim().toLowerCase(),
        password: regPassword,
        role: regRole,
      });
      toast.success(`Account registered successfully as ${regRole}!`);
      navigate("/");
    } catch (err: any) {
      let message = "Registration failed. Username or email may already be in use.";
      const detail = err?.response?.data?.detail;
      if (typeof detail === "string") {
        message = detail;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 30%, #1E3A8A 0%, #0F172A 70%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          p: { xs: 3.5, sm: 4.5 },
          borderRadius: 5,
          bgcolor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Brand Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "#2563EB",
              mx: "auto",
              mb: 1.5,
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
            }}
          >
            <LocalHospitalRoundedIcon sx={{ fontSize: 30, color: "#FFFFFF" }} />
          </Avatar>

          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}
          >
            MG AI Platform
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5, fontWeight: 500 }}
          >
            Remote Monitoring & AI Exacerbation Intelligence
          </Typography>
        </Box>

        {/* Tab Switcher */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={(_, val) => setTabIndex(val)}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "0.95rem",
                textTransform: "none",
                borderRadius: 2,
              },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Register Account" />
          </Tabs>
        </Box>

        {/* ─── TAB 0: SIGN IN ─── */}
        {tabIndex === 0 && (
          <form onSubmit={handleLogin}>
            <Stack spacing={2.5}>
              <TextField
                label="Username or Email Address"
                placeholder="e.g. admin or clinician@hospital.org"
                fullWidth
                variant="outlined"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon sx={{ color: "#64748B" }} />
                          ) : (
                            <VisibilityOutlinedIcon sx={{ color: "#64748B" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  height: 48,
                  borderRadius: 3,
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                }}
              >
                {loading ? "Authenticating..." : "Sign In to Platform"}
              </Button>
            </Stack>
          </form>
        )}


        {/* ─── TAB 1: REGISTER ─── */}
        {tabIndex === 1 && (
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                placeholder="e.g. Dr. Sarah Jenkins"
                fullWidth
                variant="outlined"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Email Address"
                type="email"
                placeholder="e.g. sarah@hospital.org"
                fullWidth
                variant="outlined"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Username Handle"
                placeholder="e.g. sarahj"
                fullWidth
                variant="outlined"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Select Role (RBAC Permission level)</InputLabel>
                <Select
                  value={regRole}
                  label="Select Role (RBAC Permission level)"
                  onChange={(e) => setRegRole(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <ShieldOutlinedIcon sx={{ color: "#64748B", ml: 1 }} />
                    </InputAdornment>
                  }
                >
                  {ROLES.map((r) => (
                    <MenuItem key={r} value={r}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                        <Chip
                          label={r}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: r === "Admin" ? "rgba(239,68,68,0.1)" : r === "Researcher" ? "rgba(139,92,246,0.1)" : "rgba(37,99,235,0.1)",
                            color: r === "Admin" ? "#DC2626" : r === "Researcher" ? "#7C3AED" : "#2563EB",
                          }}
                        />
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                          {r === "Admin"
                            ? "Full system management & user admin"
                            : r === "Clinician"
                            ? "Clinical patient care, predictions & alerts"
                            : "Read-only analytics & patient data"}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  height: 48,
                  borderRadius: 3,
                  fontSize: "1rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
                  mt: 1,
                }}
              >
                {loading ? "Registering..." : `Register as ${regRole}`}
              </Button>
            </Stack>
          </form>
        )}

        <Box sx={{ mt: 3.5, p: 2, bgcolor: "#F8FAFC", borderRadius: 3, border: "1px solid #E2E8F0", textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block" }}>
            Role-Based Access Control (RBAC) Enabled
          </Typography>
          <Chip
            label="HIPAA & GDPR Compliant Medical Portal"
            size="small"
            sx={{ mt: 1, fontSize: "0.65rem", fontWeight: 700, bgcolor: "#ECFDF5", color: "#059669" }}
          />
        </Box>
      </Paper>
    </Box>
  );
}