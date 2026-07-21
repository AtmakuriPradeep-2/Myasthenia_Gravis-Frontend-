import {
  Paper,
  Typography,
  Stack,
  Box,
  Chip,
} from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";

export default function DashboardHeader() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5, md: 4 },
        borderRadius: { xs: 4, md: 5 },
        overflow: "hidden",
        background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #1D4ED8 100%)",
        color: "white",
        position: "relative",
        boxShadow: "0 12px 30px rgba(37, 99, 235, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={3}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", lg: "center" } }}
      >
        {/* Left Content Section */}
        <Box sx={{ zIndex: 1, maxWidth: 680, width: "100%" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<LocalHospitalIcon sx={{ color: "#FFFFFF !important", fontSize: "14px !important" }} />}
              label="AI Healthcare Remote Platform"
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.18)",
                color: "#FFFFFF",
                fontWeight: 700,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                fontSize: "0.7rem",
              }}
            />
            <Chip
              icon={<CheckCircleOutlinedIcon sx={{ color: "#34D399 !important", fontSize: "14px !important" }} />}
              label="GBM Model Active"
              size="small"
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.2)",
                color: "#A7F3D0",
                fontWeight: 700,
                border: "1px solid rgba(52, 211, 153, 0.3)",
                fontSize: "0.7rem",
              }}
            />
          </Stack>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.35rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
            }}
          >
            Myasthenia Gravis Remote Intelligence
          </Typography>

          <Typography
            sx={{
              mt: 1,
              opacity: 0.9,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              lineHeight: 1.5,
              fontWeight: 400,
              color: "#E0E7FF",
            }}
          >
            Real-time longitudinal clinical telemetry & Gradient Boosting Machine Learning risk forecasting for neuromuscular junction dysfunction.
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<TrendingUpIcon sx={{ color: "#FDE047 !important", fontSize: "14px !important" }} />}
              label="91.2% ROC-AUC Accuracy"
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
            <Chip
              icon={<PsychologyIcon sx={{ color: "#A7F3D0 !important", fontSize: "14px !important" }} />}
              label="SHAP Explainable AI"
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
          </Stack>
        </Box>

        {/* Right Section: Myasthenia Gravis Clinical Details Panel */}
        <Stack
          spacing={1.25}
          sx={{
            zIndex: 1,
            width: "100%",
            maxWidth: { xs: "100%", lg: 280 },
            minWidth: { lg: 260 },
          }}
        >
          <Box
            sx={{
              p: 1.5,
              px: 2,
              borderRadius: 3,
              bgcolor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
              <HealthAndSafetyRoundedIcon sx={{ fontSize: 16, color: "#93C5FD" }} />
              <Typography variant="caption" sx={{ color: "#93C5FD", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Autoimmune Target
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "#FFFFFF" }}>
              AChR & MuSK Autoantibodies
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.5,
              px: 2,
              borderRadius: 3,
              bgcolor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
              <MonitorHeartRoundedIcon sx={{ fontSize: 16, color: "#A7F3D0" }} />
              <Typography variant="caption" sx={{ color: "#A7F3D0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Clinical Rating Scales
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "#FFFFFF" }}>
              QMG (0–39) & MGC (0–50) Metrics
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.5,
              px: 2,
              borderRadius: 3,
              bgcolor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25 }}>
              <LocalHospitalIcon sx={{ fontSize: 16, color: "#FCD34D" }} />
              <Typography variant="caption" sx={{ color: "#FCD34D", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Critical Risk Event
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 800, color: "#FFFFFF" }}>
              Myasthenic Crisis & Bulbar Weakness
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
