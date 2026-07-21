import { Card, CardContent, Typography, Box, Stack, Skeleton } from "@mui/material";
import DonutLargeRoundedIcon from "@mui/icons-material/DonutLargeRounded";
import PieChartIcon from "@mui/icons-material/PieChart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useRiskDistribution } from "../../hooks/UseDashboard";

const COLORS: Record<string, string> = {
  Low: "#10B981",
  Moderate: "#F59E0B",
  High: "#EF4444",
};

interface Props {
  data?: {
    low: number;
    moderate: number;
    high: number;
  };
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <Box
      sx={{
        bgcolor: "#0F172A",
        color: "#FFFFFF",
        px: 1.75,
        py: 1,
        borderRadius: 2.5,
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {entry.name} Risk: {entry.value} Records
      </Typography>
    </Box>
  );
}

export default function RiskDistributionChart({ data: propData }: Props) {
  const { data: apiData, isLoading } = useRiskDistribution();

  // Use passed filtered prop data if available, else apiData from backend
  const activeDistribution = propData !== undefined ? propData : (apiData ?? { low: 0, moderate: 0, high: 0 });

  const formattedData = [
    { name: "Low", value: activeDistribution.low },
    { name: "Moderate", value: activeDistribution.moderate },
    { name: "High", value: activeDistribution.high },
  ];

  const totalPatients = formattedData.reduce((sum, d) => sum + d.value, 0);

  if (isLoading && propData === undefined) {
    return (
      <Card elevation={0} sx={{ height: 400, borderRadius: 4, p: 3, border: "1px solid #E2E8F0" }}>
        <Skeleton variant="text" width="50%" height={30} />
        <Skeleton variant="circular" width={180} height={180} sx={{ mx: "auto", my: 4 }} />
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: 400,
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        },
      }}
    >
      <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(139, 92, 246, 0.1)",
            }}
          >
            <DonutLargeRoundedIcon sx={{ color: "#8B5CF6", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>
              Patient Risk Stratification
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Distribution across risk tiers
            </Typography>
          </Box>
        </Box>

        {totalPatients === 0 ? (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <PieChartIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
              No Risk Data for Selected Range
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>
              Try adjusting the date range selector to include historical records.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={98}
                    paddingAngle={4}
                    cornerRadius={8}
                    stroke="none"
                  >
                    {formattedData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center text overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                  {totalPatients}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, mt: 0.5, display: "block" }}>
                  Evaluated
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={3} sx={{ justifyContent: "center", mt: 1 }}>
              {formattedData.map((entry) => (
                <Box key={entry.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: COLORS[entry.name],
                      boxShadow: `0 0 8px ${COLORS[entry.name]}80`,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                    {entry.name}: <Box component="span" sx={{ fontWeight: 700, color: "#0F172A" }}>{entry.value}</Box>
                  </Typography>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}