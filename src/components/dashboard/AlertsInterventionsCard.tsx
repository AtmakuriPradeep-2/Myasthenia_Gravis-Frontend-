import { Card, CardContent, Typography, Box, Stack, Grid, Chip, Skeleton } from "@mui/material";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import { useAlertStatistics, useInterventionStatistics } from "../../hooks/UseDashboard";

export default function AlertsInterventionsCard() {
  const { data: alerts, isLoading: alertsLoading } = useAlertStatistics();
  const { data: interventions, isLoading: interventionsLoading } = useInterventionStatistics();

  if (alertsLoading || interventionsLoading) {
    return (
      <Card elevation={0} sx={{ borderRadius: 4, p: 3, border: "1px solid #E2E8F0" }}>
        <Skeleton variant="text" width="50%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2, borderRadius: 3 }} />
      </Card>
    );
  }

  const alertStatuses = [
    { label: "Open", count: alerts?.open_alerts ?? (alerts as any)?.open ?? 0, color: "#EF4444", bg: "#FEF2F2" },
    { label: "Reviewed", count: alerts?.reviewed_alerts ?? (alerts as any)?.reviewed ?? 0, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Closed", count: alerts?.closed_alerts ?? (alerts as any)?.closed ?? 0, color: "#10B981", bg: "#ECFDF5" },
  ];


  const interventionTypes = [
    { label: "Meds Adjustment", count: interventions?.medication_adjustment ?? 0, color: "#2563EB" },
    { label: "IVIG Therapy", count: interventions?.ivig ?? 0, color: "#06B6D4" },
    { label: "Plasmapheresis", count: interventions?.plasma_exchange ?? 0, color: "#8B5CF6" },
    { label: "Hospitalization", count: interventions?.hospitalization ?? 0, color: "#EF4444" },
  ];

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
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(245, 158, 11, 0.1)",
            }}
          >
            <NotificationsActiveRoundedIcon sx={{ color: "#F59E0B" }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2 }}>
              Alert Status & Care Interventions
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Workflow tracking & therapeutic response breakdown
            </Typography>
          </Box>
        </Stack>

        {/* Alert Triage Status Grid */}
        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1, display: "block" }}>
          Alert Resolution Pipeline
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          {alertStatuses.map((item) => (
            <Grid size={{ xs: 4 }} key={item.label}>
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: 3,
                  bgcolor: item.bg,
                  border: `1px solid ${item.color}30`,
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800, color: item.color }}>
                  {item.count}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Clinical Intervention Types */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
          <MedicalServicesRoundedIcon sx={{ fontSize: 18, color: "#10B981" }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Administered Care Actions
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          {interventionTypes.map((item) => (
            <Grid size={{ xs: 6 }} key={item.label}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A" }}>
                  {item.label}
                </Typography>
                <Chip
                  label={item.count}
                  size="small"
                  sx={{
                    bgcolor: `${item.color}15`,
                    color: item.color,
                    fontWeight: 800,
                    height: 22,
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
