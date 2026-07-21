import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";
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
import ShowChartIcon from "@mui/icons-material/ShowChart";

import type { Assessment } from "../../types/assessment";

interface Props {
  assessments: Assessment[];
  patientCode?: string;
}

export default function AssessmentTrendChart({ assessments, patientCode }: Props) {
  if (assessments.length === 0) {
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
          mb: 3,
        }}
      >
        <ShowChartIcon sx={{ fontSize: 40, color: "#94A3B8", mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
          Clinical Score Trend Dynamics
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Select a patient or record multiple assessments to plot longitudinal QMG, MGC, and CFQ score progression.
        </Typography>
      </Paper>
    );
  }

  // Format data chronological order
  const chartData = [...assessments]
    .sort((a, b) => new Date(a.observation_date).getTime() - new Date(b.observation_date).getTime())
    .map((item) => ({
      date: dayjs(item.observation_date).format("MMM D"),
      fullDate: dayjs(item.observation_date).format("MMM D, YYYY HH:mm"),
      QMG: item.qmg_score,
      MGC: item.mgc_score,
      CFQ: item.cfq_total,
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
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
            Longitudinal Score Trajectory
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {patientCode ? `Plotting progression for ${patientCode}` : "Score progression across longitudinal observations"}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          <Chip label="QMG Score" size="small" sx={{ bgcolor: "rgba(37, 99, 235, 0.15)", color: "#2563EB", fontWeight: 700 }} />
          <Chip label="MGC Score" size="small" sx={{ bgcolor: "rgba(147, 51, 234, 0.15)", color: "#9333EA", fontWeight: 700 }} />
          <Chip label="CFQ Total" size="small" sx={{ bgcolor: "rgba(217, 119, 6, 0.15)", color: "#D97706", fontWeight: 700 }} />
        </Stack>
      </Box>

      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="qmgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="mgcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cfqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderRadius: "12px",
                border: "none",
                color: "#FFFFFF",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            />

            <Area type="monotone" dataKey="QMG" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#qmgGrad)" />
            <Area type="monotone" dataKey="MGC" stroke="#9333EA" strokeWidth={3} fillOpacity={1} fill="url(#mgcGrad)" />
            <Area type="monotone" dataKey="CFQ" stroke="#D97706" strokeWidth={3} fillOpacity={1} fill="url(#cfqGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
