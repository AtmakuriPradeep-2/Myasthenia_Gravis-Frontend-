import { Card, CardContent, Typography, Box, Chip, Skeleton, Stack } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { usePredictionTrends } from "../../hooks/UseDashboard";

interface TrendPoint {
  date: string;
  predictions: number;
  average_probability: number;
}

interface Props {
  data?: TrendPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <Box
      sx={{
        bgcolor: "#0F172A",
        color: "#FFFFFF",
        p: 1.5,
        borderRadius: 3,
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.7, display: "block" }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#60A5FA" }}>
        Avg Risk Probability: {((data.average_probability ?? 0) * 100).toFixed(1)}%
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.9 }}>
        Total Predictions: {data.predictions ?? 0}
      </Typography>
    </Box>
  );
}

export default function RiskTrendChart({ data: propData }: Props) {
  const { data: apiData, isLoading } = usePredictionTrends();

  // Use passed filtered prop data if available, else apiData from backend
  const chartData = propData !== undefined ? propData : (apiData ?? []);

  const firstVal = chartData[0]?.average_probability ?? 0;
  const lastVal = chartData[chartData.length - 1]?.average_probability ?? 0;
  const delta = firstVal > 0 ? (((lastVal - firstVal) / firstVal) * 100).toFixed(0) : "0";
  const isUp = Number(delta) >= 0;

  if (isLoading && propData === undefined) {
    return (
      <Card elevation={0} sx={{ height: 400, borderRadius: 4, p: 3, border: "1px solid #E2E8F0" }}>
        <Skeleton variant="text" width="40%" height={30} />
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2, borderRadius: 3 }} />
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
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
              <TrendingUpRoundedIcon sx={{ color: "#2563EB", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>
                Longitudinal Exacerbation Risk Trend
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                ML Model Inferences & Risk Probability Trajectory
              </Typography>
            </Box>
          </Stack>

          {chartData.length > 0 && (
            <Chip
              size="small"
              label={`${isUp ? "+" : ""}${delta}% trend`}
              sx={{
                bgcolor: isUp ? "#FEF2F2" : "#ECFDF5",
                color: isUp ? "#EF4444" : "#10B981",
                fontWeight: 700,
                border: `1px solid ${isUp ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
              }}
            />
          )}
        </Box>

        {chartData.length === 0 ? (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <ShowChartIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A" }}>
              No Prediction Trends for Selected Range
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5 }}>
              Try expanding the date range selector or run new ML predictions.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(val) => `${((val ?? 0) * 100).toFixed(0)}%`}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#94A3B8", strokeDasharray: 4 }} />

                <Area
                  type="monotone"
                  dataKey="average_probability"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fill="url(#riskFill)"
                  dot={{ r: 4, fill: "#2563EB", strokeWidth: 2, stroke: "#FFFFFF" }}
                  activeDot={{ r: 7, fill: "#2563EB", stroke: "#FFFFFF", strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}