import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Chip,
  Skeleton,
} from "@mui/material";

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { useAIInsights, useModelPerformance } from "../../hooks/UseDashboard";

export default function AIInsights() {
  const { data: insightsData, isLoading: insightsLoading } = useAIInsights();
  const { data: modelPerf } = useModelPerformance();

  const highRiskCount = (insightsData as any)?.high_risk_count ?? 0;
  const trendPct = (insightsData as any)?.trend_percentage ?? 0;
  const recCount = (insightsData as any)?.recommendations_count ?? 0;
  const accuracyText = modelPerf?.accuracy
    ? `${(modelPerf.accuracy * 100).toFixed(1)}%`
    : "0.0%";

  const insightsList = [
    {
      icon: <WarningRoundedIcon />,
      color: "#EF4444",
      bgColor: "#FEF2F2",
      title: "High Exacerbation Alerts",
      value: `${highRiskCount} patient${highRiskCount === 1 ? "" : "s"} flagged for imminent risk`,
      badge: highRiskCount > 0 ? "Immediate Action" : "Normal",
    },
    {
      icon: <TrendingUpRoundedIcon />,
      color: "#2563EB",
      bgColor: "#EFF6FF",
      title: "Weekly Risk Velocity",
      value: `Risk trajectory shifted ${trendPct >= 0 ? "+" : ""}${trendPct}% across active cohort`,
      badge: "Monitoring",
    },
    {
      icon: <MedicalServicesRoundedIcon />,
      color: "#10B981",
      bgColor: "#ECFDF5",
      title: "Clinical Recommendations",
      value: `${recCount} medication adjustment${recCount === 1 ? "" : "s"} / therapy action${recCount === 1 ? "" : "s"} suggested`,
      badge: "Suggested Care",
    },
    {
      icon: <PsychologyRoundedIcon />,
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      title: "ML Model Metric (ROC-AUC)",
      value: `${modelPerf?.model_name ?? "Gradient Boosting Model"} running at ${accuracyText} precision`,
      badge: "Validated",
    },
  ];


  if (insightsLoading) {
    return (
      <Card elevation={0} sx={{ borderRadius: 4, p: 3, border: "1px solid #E2E8F0" }}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={240} sx={{ mt: 2, borderRadius: 3 }} />
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(139, 92, 246, 0.1)",
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ color: "#8B5CF6" }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>
              AI Clinical Synthesis
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Automated intelligence insights & care prompts
            </Typography>
          </Box>
        </Box>

        <List disablePadding>
          {insightsList.map((item, index) => (
            <Box key={index}>
              <ListItem
                disableGutters
                sx={{
                  py: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <ListItemAvatar sx={{ minWidth: 52 }}>
                  <Avatar
                    sx={{
                      bgcolor: item.bgColor,
                      color: item.color,
                      width: 40,
                      height: 40,
                      borderRadius: 2.5,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.25 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A" }}>
                        {item.title}
                      </Typography>
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          bgcolor: item.bgColor,
                          color: item.color,
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          height: 20,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.4, display: "block" }}>
                      {item.value}
                    </Typography>
                  }
                />
              </ListItem>

              {index !== insightsList.length - 1 && (
                <Divider sx={{ my: 0.5, borderColor: "#F1F5F9" }} />
              )}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}