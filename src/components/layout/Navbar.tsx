import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SensorsIcon from "@mui/icons-material/Sensors";
import MenuIcon from "@mui/icons-material/Menu";

import dayjs from "dayjs";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboardSummary } from "../../hooks/UseDashboard";
import { getUserDisplayName, getUserInitial } from "../../utils/user";

interface NavbarProps {
  onDrawerToggle?: () => void;
}

export default function Navbar({ onDrawerToggle }: NavbarProps) {
  const { user } = useAuth();
  const { data: summary } = useDashboardSummary();

  const openAlertsCount = summary?.open_alerts ?? 0;
  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E2E8F0",
        color: "#0F172A",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 72 },
          px: { xs: 1.5, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left Side: Mobile Hamburger & Header Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          {/* Mobile Hamburger Menu Trigger */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{
              display: { md: "none" },
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              p: 1,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "0.95rem", sm: "1.15rem", md: "1.25rem" },
                  background: "linear-gradient(135deg, #1E293B 0%, #2563EB 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                MG AI Remote Monitoring
              </Typography>

              <Chip
                icon={<SensorsIcon sx={{ fontSize: "12px !important", color: "#10B981 !important" }} />}
                label="Live"
                size="small"
                className="pulse-badge"
                sx={{
                  bgcolor: "#ECFDF5",
                  color: "#059669",
                  fontWeight: 700,
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  fontSize: "0.65rem",
                  height: 20,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              />
            </Box>

            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", mt: 0.25, gap: 0.75 }}>
              <CalendarTodayIcon sx={{ fontSize: 13, color: "text.secondary" }} />
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                {dayjs().format("dddd, MMMM D, YYYY")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          <Tooltip title={openAlertsCount > 0 ? `${openAlertsCount} Open Alerts` : "No Open Alerts"}>
            <IconButton
              sx={{
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                p: { xs: 0.75, sm: 1 },
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#F1F5F9",
                  transform: "scale(1.05)",
                },
              }}
            >
              <Badge badgeContent={openAlertsCount} color="error">
                <NotificationsNoneIcon sx={{ color: "#475569", fontSize: { xs: 20, sm: 24 } }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              px: { xs: 1, sm: 1.75 },
              py: 0.5,
              borderRadius: 4,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
            }}
          >
            <Box sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0F172A", lineHeight: 1.2 }}>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                {user?.role ?? "Neurologist"}
              </Typography>
            </Box>

            <Avatar
              sx={{
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                fontWeight: 700,
                fontSize: { xs: 13, sm: 14 },
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
              }}
            >
              {initial}
            </Avatar>
          </Paper>
        </Box>
      </Toolbar>
    </AppBar>
  );
}