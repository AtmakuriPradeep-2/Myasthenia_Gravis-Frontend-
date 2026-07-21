import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import { useRecentPredictions } from "../../hooks/UseDashboard";

const getRiskColor = (risk: string) => {
  switch (risk?.toLowerCase()) {
    case "high":
      return { bg: "#FEF2F2", text: "#EF4444", border: "rgba(239, 68, 68, 0.3)" };
    case "moderate":
    case "medium":
      return { bg: "#FFFBEB", text: "#D97706", border: "rgba(245, 158, 11, 0.3)" };
    default:
      return { bg: "#ECFDF5", text: "#10B981", border: "rgba(16, 185, 129, 0.3)" };
  }
};

export default function RecentPredictions() {

  const { data: apiPredictions, isLoading } = useRecentPredictions();

  const predictionsList = apiPredictions ?? [];

  if (isLoading) {
    return (
      <Card elevation={0} sx={{ borderRadius: 4, p: 3, border: "1px solid #E2E8F0" }}>
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={220} sx={{ mt: 2, borderRadius: 3 }} />
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(37, 99, 235, 0.1)",
              }}
            >
              <PsychologyRoundedIcon sx={{ color: "#2563EB" }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                Recent AI Risk Predictions
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Latest inference outputs from monitoring logs
              </Typography>
            </Box>
          </Stack>

          <Button size="small" sx={{ fontWeight: 700, borderRadius: 2 }}>
            View Full Log
          </Button>
        </Stack>

        {predictionsList.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
              No inference records found in real-time logs.
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Run new risk assessments on patient profiles to populate telemetry logs.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.75}>
            {predictionsList.slice(0, 5).map((item: any, idx: number) => {
              const riskConfig = getRiskColor(item.risk_level ?? item.risk ?? "Low");
              const prob = typeof item.probability === "number"
                ? `${(item.probability * 100).toFixed(0)}%`
                : (item.probability ?? "N/A");

              return (
                <Box
                  key={item.id ?? idx}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #F1F5F9",
                    bgcolor: "#FAFAFA",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#FFFFFF",
                      borderColor: "#CBD5E1",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                      <Avatar
                        sx={{
                          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                          width: 42,
                          height: 42,
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {(item.patient_name ?? item.name ?? "P").charAt(0).toUpperCase()}
                      </Avatar>

                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#0F172A", fontSize: 15 }}>
                          {item.patient_name ?? item.name ?? "Patient"}
                        </Typography>

                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                          Code: {item.patient_code ?? item.id ?? `MG-${100 + idx}`}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={3} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                      <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
                        <Typography sx={{ fontWeight: 800, color: "#2563EB", fontSize: 15 }}>
                          {prob}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Exacerbation Prob
                        </Typography>
                      </Box>

                      <Chip
                        label={`${item.risk_level ?? item.risk ?? "Low"} Risk`}
                        size="small"
                        sx={{
                          bgcolor: riskConfig.bg,
                          color: riskConfig.text,
                          fontWeight: 700,
                          border: `1px solid ${riskConfig.border}`,
                          px: 1,
                        }}
                      />

                      <Typography variant="caption" sx={{ color: "text.secondary", minWidth: 70 }}>
                        {item.created_at ?? item.time ?? "Just now"}
                      </Typography>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityRoundedIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          borderColor: "#E2E8F0",
                          color: "#475569",
                          "&:hover": { borderColor: "#2563EB", color: "#2563EB" },
                        }}
                      >
                        Details
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}