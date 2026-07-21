import { Paper, Typography, Box, Chip } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import PieChartIcon from "@mui/icons-material/PieChart";

interface Props {
  lowCount: number;
  moderateCount: number;
  highCount: number;
}

export default function RiskDistributionBreakdown({
  lowCount,
  moderateCount,
  highCount,
}: Props) {
  const total = lowCount + moderateCount + highCount;

  const data = [
    { name: "Low Risk", value: lowCount, color: "#10B981" },
    { name: "Moderate Risk", value: moderateCount, color: "#F59E0B" },
    { name: "High Risk", value: highCount, color: "#EF4444" },
  ].filter((d) => d.value > 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
            Risk Level Stratification
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Proportional risk categories for period
          </Typography>
        </Box>

        <Chip
          label={`${total} Evaluated`}
          size="small"
          sx={{ bgcolor: "#F1F5F9", color: "#475569", fontWeight: 700 }}
        />
      </Box>

      {total === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <PieChartIcon sx={{ fontSize: 40, color: "#94A3B8", mb: 1 }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No predictions recorded in selected date window.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0F172A",
                  borderRadius: "12px",
                  border: "none",
                  color: "#FFFFFF",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
