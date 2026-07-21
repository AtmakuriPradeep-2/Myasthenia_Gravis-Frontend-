import { Paper, Typography, Box, Chip, Stack, LinearProgress, Divider, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SpeedIcon from "@mui/icons-material/Speed";
import PrintIcon from "@mui/icons-material/Print";
import { exportPredictionPrintableReport } from "../../utils/exportPredictions";

import type { Patient } from "../../types/patient";

interface FeatureDriver {
  feature: string;
  value: number;
  shap_value: number;
  impact: string;
}

interface Props {
  prediction: {
    prediction_id?: number;
    patient_id: number;
    patient_code?: string;
    risk_probability?: number;
    probability?: number;
    risk_category?: string;
    predicted_worsening_risk?: boolean;
    top_features?: FeatureDriver[];
  };
  patients: Patient[];
}

const getRiskColor = (risk: string) => {
  switch (risk?.toLowerCase()) {
    case "high":
      return { bg: "#FEF2F2", text: "#EF4444", bar: "#EF4444", label: "HIGH RISK" };
    case "moderate":
      return { bg: "#FFFBEB", text: "#D97706", bar: "#F59E0B", label: "MODERATE RISK" };
    default:
      return { bg: "#ECFDF5", text: "#10B981", bar: "#10B981", label: "LOW RISK" };
  }
};

export default function PredictionCard({ prediction, patients }: Props) {
  const patient = patients.find((p) => p.id === prediction.patient_id);
  const code = prediction.patient_code || patient?.patient_code || `Patient #${prediction.patient_id}`;

  const prob = prediction.risk_probability !== undefined ? prediction.risk_probability : (prediction.probability ?? 0);
  const probPct = (prob * 100).toFixed(1);
  const category = prediction.risk_category || (prob >= 0.20 ? "high" : prob >= 0.10 ? "moderate" : "low");
  const riskConfig = getRiskColor(category);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "rgba(37, 99, 235, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ color: "#2563EB", fontSize: 24 }} />
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
              {code}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
              {patient ? `Age: ${patient.age} | Sex: ${patient.sex} | MGFA Class ${patient.mgfa_class}` : `ID: #${prediction.patient_id}`}
            </Typography>
          </Box>
        </Stack>

        <Chip
          label={riskConfig.label}
          size="small"
          sx={{
            bgcolor: riskConfig.bg,
            color: riskConfig.text,
            fontWeight: 800,
            fontSize: "0.72rem",
            px: 1,
          }}
        />
      </Box>

      {/* Exacerbation Risk Probability Gauge */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <SpeedIcon sx={{ fontSize: 16, color: "#64748B" }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
              Exacerbation Risk Probability
            </Typography>
          </Stack>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: riskConfig.text }}>
            {probPct}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(prob * 100, 100)}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: "#F1F5F9",
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              bgcolor: riskConfig.bar,
            },
          }}
        />
      </Box>

      <Divider sx={{ my: 2, borderColor: "#F1F5F9" }} />

      {/* Explainable AI Top SHAP Feature Drivers */}
      <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5, display: "block" }}>
        SHAP Top Feature Risk Drivers
      </Typography>

      {prediction.top_features && prediction.top_features.length > 0 ? (
        <Stack spacing={1}>
          {prediction.top_features.map((feat, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justify: "space-between",
                alignItems: "center",
                bgcolor: "#F8FAFC",
                p: 1.25,
                borderRadius: 2.5,
                border: "1px solid #F1F5F9",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                {feat.feature}
              </Typography>
              <Chip
                label={`${feat.impact === "Increase Risk" ? "+" : ""}${(feat.shap_value * 100).toFixed(1)}% (${feat.impact})`}
                size="small"
                sx={{
                  bgcolor: feat.impact === "Increase Risk" ? "#FEF2F2" : "#ECFDF5",
                  color: feat.impact === "Increase Risk" ? "#EF4444" : "#10B981",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  height: 22,
                }}
              />
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic" }}>
          Standard risk inference calculated based on longitudinal QMG/MGC scores & clinical features.
        </Typography>
      )}

      <Box sx={{ mt: 2.5, pt: 1.5, borderTop: "1px solid #F1F5F9" }}>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          startIcon={<PrintIcon />}
          onClick={() => exportPredictionPrintableReport(prediction, patient)}
          sx={{
            borderRadius: 2.5,
            fontWeight: 700,
            textTransform: "none",
            borderColor: "#CBD5E1",
            color: "#475569",
            "&:hover": {
              borderColor: "#2563EB",
              color: "#2563EB",
              bgcolor: "#EFF6FF",
            },
          }}
        >
          Print / Export Risk Report
        </Button>
      </Box>
    </Paper>
  );
}

