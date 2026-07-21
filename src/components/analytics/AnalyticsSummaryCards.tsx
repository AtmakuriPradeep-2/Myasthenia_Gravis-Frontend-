import { Grid, Paper, Box, Typography, Avatar } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

interface Props {
  highRiskPercentage: number;
  meanRiskProbability: number;
  totalAssessments: number;
  treatmentChangesCount: number;
}

export default function AnalyticsSummaryCards({
  highRiskPercentage,
  meanRiskProbability,
  totalAssessments,
  treatmentChangesCount,
}: Props) {
  const cards = [
    {
      title: "High Risk Ratio",
      value: `${highRiskPercentage.toFixed(1)}%`,
      subtitle: "Cohort predictions at High Risk",
      icon: <WarningAmberRoundedIcon sx={{ color: "#EF4444" }} />,
      bg: "rgba(239, 68, 68, 0.1)",
      accent: "#EF4444",
    },
    {
      title: "Mean Exacerbation Probability",
      value: `${(meanRiskProbability * 100).toFixed(1)}%`,
      subtitle: "Average model forecast risk",
      icon: <TrendingUpIcon sx={{ color: "#2563EB" }} />,
      bg: "rgba(37, 99, 235, 0.1)",
      accent: "#2563EB",
    },
    {
      title: "Clinical Observations",
      value: totalAssessments,
      subtitle: "Recorded QMG/MGC assessments",
      icon: <AssessmentIcon sx={{ color: "#9333EA" }} />,
      bg: "rgba(147, 51, 234, 0.1)",
      accent: "#9333EA",
    },
    {
      title: "Regimen Adjustments",
      value: treatmentChangesCount,
      subtitle: "Treatment change flags in period",
      icon: <MedicalServicesIcon sx={{ color: "#D97706" }} />,
      bg: "rgba(217, 119, 6, 0.1)",
      accent: "#D97706",
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cards.map((card, idx) => (
        <Grid key={idx} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                bgcolor: card.accent,
              }}
            />

            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {card.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", my: 0.5 }}>
                {card.value}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
                {card.subtitle}
              </Typography>
            </Box>

            <Avatar sx={{ bgcolor: card.bg, width: 48, height: 48 }}>
              {card.icon}
            </Avatar>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
