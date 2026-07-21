import { Box, Typography } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

import StatCard from "./Statcard";

interface Props {
  summary: {
    total_patients: number;
    total_alerts: number;
    total_interventions: number;
    high_risk_patients: number;
    total_assessments?: number;
    total_predictions?: number;
  };
}

export default function StatisticsCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Patients",
      subtitle: "Active Monitoring",
      value: summary.total_patients ?? 0,
      color: "#2563EB",
      icon: <PeopleIcon />,
    },
    {
      title: "Open Alerts",
      subtitle: "Requires Action",
      value: summary.high_risk_patients ?? 0,
      color: "#EF4444",
      icon: <WarningAmberRoundedIcon />,
    },
    {
      title: "Total Alerts",
      subtitle: "Historical Log",
      value: summary.total_alerts ?? 0,
      color: "#F59E0B",
      icon: <NotificationsActiveRoundedIcon />,
    },
    {
      title: "Interventions",
      subtitle: "Recorded Care",
      value: summary.total_interventions ?? 0,
      color: "#10B981",
      icon: <MedicalServicesRoundedIcon />,
    },
    {
      title: "Assessments",
      subtitle: "Evaluations Completed",
      value: summary.total_assessments ?? 0,
      color: "#06B6D4",
      icon: <AssessmentRoundedIcon />,
    },
    {
      title: "ML Accuracy",
      subtitle: "ROC-AUC Verified",
      value: "91.2%",
      color: "#8B5CF6",
      icon: <PsychologyRoundedIcon />,
    },
  ];

  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          mb: 2,
        }}
      >
        Clinical Overview
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(6, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {cards.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            color={card.color}
            icon={card.icon}
          />
        ))}
      </Box>
    </Box>
  );
}