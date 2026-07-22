import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SensorsIcon from "@mui/icons-material/Sensors";
import MenuIcon from "@mui/icons-material/Menu";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboardSummary } from "../../hooks/UseDashboard";
import { useOpenAlerts } from "../../hooks/useAlerts";
import { usePatients } from "../../hooks/usePatients";
import { getUserDisplayName, getUserInitial } from "../../utils/user";

dayjs.extend(relativeTime);

interface NavbarProps {
  onDrawerToggle?: () => void;
}

export default function Navbar({ onDrawerToggle }: NavbarProps) {
  const { user } = useAuth();
  const { data: summary } = useDashboardSummary();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { data: openAlerts, isLoading: alertsLoading } = useOpenAlerts();
  const { data: patients } = usePatients();

  const openAlertsCount = summary?.open_alerts ?? 0;
  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleAlertClick = (alertId: number) => {
    handleClosePopover();
    navigate("/alerts");
  };

  const handleViewAll = () => {
    handleClosePopover();
    navigate("/alerts");
  };

  const patientMap = useMemo(() => {
    const map = new Map<number, string>();
    if (patients) {
      patients.forEach((p) => {
        map.set(p.id, p.patient_code);
      });
    }
    return map;
  }, [patients]);

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
              onClick={handleOpenPopover}
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

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                sx: {
                  width: 360,
                  maxHeight: 480,
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
                  border: "1px solid #E2E8F0",
                  mt: 1.5,
                  display: "flex",
                  flexDirection: "column",
                },
              },
            }}
          >
            <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#F8FAFC" }}>
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0F172A" }}>
                Active Alerts
              </Typography>
              {openAlertsCount > 0 && (
                <Chip
                  label={`${openAlertsCount} New`}
                  color="error"
                  size="small"
                  sx={{ fontWeight: 800, height: 20, fontSize: "0.70rem" }}
                />
              )}
            </Box>
            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
              {alertsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : !openAlerts || openAlerts.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    No active clinical alerts at this time.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {openAlerts.slice(0, 5).map((alert, index) => {
                    const patientCode = patientMap.get(alert.patient_id) || `PT-${alert.patient_id}`;
                    
                    let sevColor = "#10B981"; // Low
                    let sevBg = "#ECFDF5";
                    let SeverityIcon = CheckCircleIcon;
                    if (alert.severity.toLowerCase() === "critical") {
                      sevColor = "#EF4444";
                      sevBg = "#FEF2F2";
                      SeverityIcon = ErrorIcon;
                    } else if (alert.severity.toLowerCase() === "high") {
                      sevColor = "#F59E0B";
                      sevBg = "#FFFBEB";
                      SeverityIcon = WarningIcon;
                    } else if (alert.severity.toLowerCase() === "moderate") {
                      sevColor = "#3B82F6";
                      sevBg = "#EFF6FF";
                      SeverityIcon = NotificationsActiveIcon;
                    }

                    return (
                      <Box key={alert.id}>
                        {index > 0 && <Divider sx={{ borderStyle: "dashed" }} />}
                        <ListItem
                          onClick={() => handleAlertClick(alert.id)}
                          sx={{
                            px: 2,
                            py: 1.5,
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            "&:hover": {
                              bgcolor: "#F8FAFC",
                            },
                          }}
                        >
                          <Box sx={{ mr: 1.5, display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", bgcolor: sevBg, color: sevColor, flexShrink: 0 }}>
                            <SeverityIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#1E293B" }}>
                                  Patient {patientCode}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.75rem" }}>
                                  {dayjs(alert.created_at).fromNow()}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                                <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "#64748B" }}>
                                  Myasthenic risk probability: <b>{(alert.probability * 100).toFixed(1)}%</b>
                                </Typography>
                                <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                                  <Chip
                                    label={alert.severity}
                                    size="small"
                                    sx={{
                                      bgcolor: sevBg,
                                      color: sevColor,
                                      fontWeight: 800,
                                      fontSize: "0.65rem",
                                      height: 18,
                                      border: `1px solid ${sevColor}22`
                                    }}
                                  />
                                  <Chip
                                    label={alert.status}
                                    size="small"
                                    sx={{
                                      bgcolor: "#FEF2F2",
                                      color: "#EF4444",
                                      fontWeight: 700,
                                      fontSize: "0.65rem",
                                      height: 18,
                                      border: "1px solid rgba(239, 68, 68, 0.2)"
                                    }}
                                  />
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      </Box>
                    );
                  })}
                </List>
              )}
            </Box>

            <Divider />
            <Box sx={{ p: 1, bgcolor: "#F8FAFC", textAlign: "center" }}>
              <Button
                onClick={handleViewAll}
                fullWidth
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "none",
                  color: "#2563EB",
                  "&:hover": {
                    bgcolor: "rgba(37, 99, 235, 0.04)",
                  },
                }}
              >
                View All Alerts
              </Button>
            </Box>
          </Popover>

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