import { Paper, Typography, Button, Box, Chip, Stack } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DownloadIcon from "@mui/icons-material/Download";

interface Props {
  totalPredictions: number;
  onRunPrediction: () => void;
  onExportCSV?: () => void;
}


export default function PredictionHeader({ totalPredictions, onRunPrediction, onExportCSV }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5, md: 4 },
        borderRadius: { xs: 4, md: 5 },
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        color: "#FFFFFF",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
        mb: 2.5,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2.5}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
      >
        <Box sx={{ width: "100%" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
            <Chip
              icon={<PsychologyIcon sx={{ color: "#A7F3D0 !important", fontSize: "14px !important" }} />}
              label="Calibrated Gradient Boosting ML Engine"
              size="small"
              sx={{
                bgcolor: "rgba(16, 185, 129, 0.2)",
                color: "#6EE7B7",
                fontWeight: 700,
                border: "1px solid rgba(110, 231, 183, 0.3)",
                fontSize: "0.7rem",
              }}
            />
            <Chip
              label={`Development Threshold: 20.0%`}
              size="small"
              sx={{
                bgcolor: "rgba(37, 99, 235, 0.2)",
                color: "#93C5FD",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
            <Chip
              label={`${totalPredictions} Total Inferences`}
              size="small"
              sx={{
                bgcolor: "rgba(245, 158, 11, 0.2)",
                color: "#FCD34D",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          </Stack>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Disease Exacerbation Risk Prediction
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#94A3B8",
              mt: 0.5,
              fontSize: { xs: "0.85rem", sm: "0.875rem" },
              maxWidth: 680,
            }}
          >
            Automated machine learning inference combining longitudinal QMG, MGC, CFQ scores, MGFA classification, and clinical events with SHAP Explainable AI feature drivers.
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
          {onExportCSV && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={onExportCSV}
              sx={{
                height: { xs: 44, sm: 48 },
                px: 2.5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#FFFFFF",
                borderColor: "rgba(255, 255, 255, 0.3)",
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: "#FFFFFF",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Export CSV
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={onRunPrediction}
            sx={{
              height: { xs: 44, sm: 48 },
              px: 3,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "0.875rem",
              width: { xs: "100%", sm: "auto" },
              whiteSpace: "nowrap",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              boxShadow: "0 4px 16px rgba(16, 185, 129, 0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            Run ML Risk Analysis
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

