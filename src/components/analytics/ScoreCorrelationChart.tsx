import { Paper, Typography, Box, Stack, Chip } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import BarChartIcon from "@mui/icons-material/BarChart";

import type { Assessment } from "../../types/assessment";

interface Props {
  assessments: Assessment[];
}

export default function ScoreCorrelationChart({ assessments }: Props) {
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
        <BarChartIcon sx={{ fontSize: 40, color: "#94A3B8", mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
          No Score Correlation Data
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Record clinical assessments to compare QMG, MGC, and Fatigue score dynamics.
        </Typography>
      </Paper>
    );
  }

  // Group assessments chronologically
  const chartData = [...assessments]
    .sort((a, b) => new Date(a.observation_date).getTime() - new Date(b.observation_date).getTime())
    .slice(-10) // show last 10 entries
    .map((item) => ({
      date: dayjs(item.observation_date).format("MMM D"),
      "QMG Score": item.qmg_score,
      "MGC Score": item.mgc_score,
      "CFQ Score": item.cfq_total,
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
            Clinical Score Comparative Correlation
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Side-by-side comparison of Quantitative MG (QMG), Composite (MGC), and Fatigue (CFQ) scores
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip label="QMG" size="small" sx={{ bgcolor: "rgba(37, 99, 235, 0.15)", color: "#2563EB", fontWeight: 700 }} />
          <Chip label="MGC" size="small" sx={{ bgcolor: "rgba(147, 51, 234, 0.15)", color: "#9333EA", fontWeight: 700 }} />
          <Chip label="CFQ" size="small" sx={{ bgcolor: "rgba(217, 119, 6, 0.15)", color: "#D97706", fontWeight: 700 }} />
        </Stack>
      </Box>

      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderRadius: "12px",
                border: "none",
                color: "#FFFFFF",
              }}
            />
            <Legend verticalAlign="top" height={36} />

            <Bar dataKey="QMG Score" fill="#2563EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="MGC Score" fill="#9333EA" radius={[4, 4, 0, 0]} />
            <Bar dataKey="CFQ Score" fill="#D97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
