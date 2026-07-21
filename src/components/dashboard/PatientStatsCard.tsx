import { Card, CardContent, Typography, Box, Grid, LinearProgress, Stack, Skeleton, Paper } from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { usePatientStatistics } from "../../hooks/UseDashboard";

export default function PatientStatsCard() {
  const { data: stats, isLoading } = usePatientStatistics();

  if (isLoading) {
    return (
      <Card elevation={0} sx={{ height: 380, borderRadius: 4, p: 3, border: "1px solid #E2E8F0" }}>
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={260} sx={{ mt: 2, borderRadius: 3 }} />
      </Card>
    );
  }

  const total = stats?.total_patients || 1;
  const malePct = Math.round(((stats?.male || 0) / total) * 100);
  const femalePct = Math.round(((stats?.female || 0) / total) * 100);

  const classes = [
    { label: "Class I (Ocular)", count: stats?.mgfa_class_I || 0, color: "#2563EB" },
    { label: "Class II (Mild)", count: stats?.mgfa_class_II || 0, color: "#10B981" },
    { label: "Class III (Moderate)", count: stats?.mgfa_class_III || 0, color: "#F59E0B" },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(37,99,235,0.1)",
            }}
          >
            <PeopleAltRoundedIcon sx={{ color: "#2563EB", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>
              Patient Cohort Demographics
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Age, sex & MGFA classification distribution
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Sex Distribution */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Sex Distribution
              </Typography>
              <Stack direction="row" spacing={2} sx={{ my: 1.5, justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#2563EB" }}>{stats?.male || 0}</Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>Male ({malePct}%)</Typography>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#EC4899" }}>{stats?.female || 0}</Typography>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>Female ({femalePct}%)</Typography>
                </Box>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={malePct}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#FCE7F3",
                  "& .MuiLinearProgress-bar": { bgcolor: "#2563EB", borderRadius: 4 },
                }}
              />
            </Paper>
          </Grid>

          {/* Average Age */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#F8FAFC", border: "1px solid #F1F5F9", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Cohort Mean Age
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", my: 0.5 }}>
                {stats?.average_age || 0} <Typography component="span" variant="h6" sx={{ color: "text.secondary", fontWeight: 600 }}>yrs</Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>
                Across {stats?.total_patients || 0} active cohort profiles
              </Typography>
            </Paper>
          </Grid>

          {/* MGFA Disease Class Distribution (Model Trained Classes I, II, III) */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A", mb: 1.5 }}>
              MGFA Classification Distribution (Model Dataset Tiers)
            </Typography>

            <Stack spacing={1.5}>
              {classes.map((c, idx) => {
                const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                return (
                  <Box key={idx}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                        {c.label}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: c.color }}>
                        {c.count} ({pct}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "#F1F5F9",
                        "& .MuiLinearProgress-bar": { bgcolor: c.color, borderRadius: 3 },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
