import { Paper, Typography, Box, Stack, Chip } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import type { Prediction } from "../../types/prediction";

interface Props {
  data: Prediction[];
}

export default function RiskTrendTimeline({ data }: Props) {
  if (data.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        }}
      >
        <TrendingUpIcon sx={{ fontSize: 40, color: "#94A3B8", mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
          No Exacerbation Data in Selected Period
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Adjust your date range selector above to view historical exacerbation risk trajectory.
        </Typography>
      </Paper>
    );
  }

  // Sort chronological and format
  const sorted = [...data].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const formattedChartData = sorted.map((item) => ({
    date: dayjs(item.created_at).format("MMM D"),
    fullDate: dayjs(item.created_at).format("MMM D, YYYY HH:mm"),
    "Risk Probability (%)": Number(((item.probability ?? 0) * 100).toFixed(1)),
  }));

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
            Exacerbation Risk Trend Timeline
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Model probability trajectory for selected evaluation window
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label="Probability %"
            size="small"
            sx={{ bgcolor: "rgba(37, 99, 235, 0.15)", color: "#2563EB", fontWeight: 700 }}
          />
        </Stack>
      </Box>

      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskTimelineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderRadius: "12px",
                border: "none",
                color: "#FFFFFF",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            />

            <Area
              type="monotone"
              dataKey="Risk Probability (%)"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#riskTimelineGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
