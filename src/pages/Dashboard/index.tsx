import { useState, useMemo } from "react";
import {
  Alert,
  Box,
  Grid,
  Skeleton,
} from "@mui/material";
import dayjs from "dayjs";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatisticsCards from "../../components/dashboard/StatisticsCard";

import RiskTrendChart from "../../components/dashboard/RiskTrendChart";
import RiskDistributionChart from "../../components/dashboard/RiskDistributionChart";
import RecentPredictions from "../../components/dashboard/RecentPredictions";
import AIInsights from "../../components/dashboard/AIInsights";
import PatientStatsCard from "../../components/dashboard/PatientStatsCard";
import AlertsInterventionsCard from "../../components/dashboard/AlertsInterventionsCard";
import DateRangeSelector, { type DatePreset } from "../../components/analytics/DateRangeSelector";

import { useDashboardSummary } from "../../hooks/UseDashboard";
import { usePredictions } from "../../hooks/usePredictions";

export default function Dashboard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useDashboardSummary();

  const { data: rawPredictionsData } = usePredictions();
  const rawPredictions = rawPredictionsData ?? [];

  // Date Range Filter State (Default: Last 30 Days)
  const [preset, setPreset] = useState<DatePreset>("30d");
  const [startDate, setStartDate] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const handleSelectPreset = (newPreset: DatePreset) => {
    setPreset(newPreset);
    const today = dayjs();

    switch (newPreset) {
      case "7d":
        setStartDate(today.subtract(7, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      case "30d":
        setStartDate(today.subtract(30, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      case "90d":
        setStartDate(today.subtract(90, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      case "1y":
        setStartDate(today.subtract(1, "year").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      case "all":
        setStartDate("2020-01-01");
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      case "custom":
        break;
    }
  };

  // Dynamically Filter Predictions by Selected Date Range
  const filteredPredictions = useMemo(() => {
    if (!startDate || !endDate) return rawPredictions;
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");

    return rawPredictions.filter((item) => {
      const itemDate = dayjs(item.created_at);
      return (itemDate.isAfter(start) || itemDate.isSame(start)) && (itemDate.isBefore(end) || itemDate.isSame(end));
    });
  }, [rawPredictions, startDate, endDate]);

  // Dynamic Trend Timeline calculation for Dashboard Chart
  const trendData = useMemo(() => {
    const map = new Map<string, { predictions: number; sumProb: number }>();
    filteredPredictions.forEach((p) => {
      const dateStr = dayjs(p.created_at).format("MMM D");
      const existing = map.get(dateStr) || { predictions: 0, sumProb: 0 };
      map.set(dateStr, {
        predictions: existing.predictions + 1,
        sumProb: existing.sumProb + (p.probability ?? 0),
      });
    });

    return Array.from(map.entries()).map(([date, val]) => ({
      date,
      predictions: val.predictions,
      average_probability: val.predictions > 0 ? val.sumProb / val.predictions : 0,
    }));
  }, [filteredPredictions]);

  // Dynamic Risk Stratification distribution for Dashboard Donut
  const riskDistData = useMemo(() => {
    let low = 0;
    let moderate = 0;
    let high = 0;
    filteredPredictions.forEach((p) => {
      const cat = (p.risk_category || "").toLowerCase();
      if (cat === "high") high++;
      else if (cat === "moderate") moderate++;
      else low++;
    });
    return { low, moderate, high };
  }, [filteredPredictions]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 5 }} />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={i}>
              <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        severity="error"
        sx={{
          borderRadius: 3,
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        Failed to load clinical dashboard telemetry. Please ensure backend server is operational.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3.5,
      }}
    >
      {/* Hero Header */}
      <DashboardHeader />


      {/* Date Range Selector Bar */}
      <DateRangeSelector
        preset={preset}
        startDate={startDate}
        endDate={endDate}
        onSelectPreset={handleSelectPreset}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Overview Metric Grid */}
      <StatisticsCards
        summary={{
          total_patients: data.total_patients,
          total_alerts: data.total_alerts,
          total_interventions: data.total_interventions,
          high_risk_patients: riskDistData.high,
          total_assessments: data.total_assessments,
          total_predictions: filteredPredictions.length,
        }}
      />

      {/* Clinical Charts Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RiskTrendChart data={trendData} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <RiskDistributionChart data={riskDistData} />
        </Grid>

        {/* Detailed Demographics & Interventions */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <PatientStatsCard />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <AlertsInterventionsCard />
        </Grid>

        {/* Recent Inferences & AI Synthesis */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <RecentPredictions />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <AIInsights />
        </Grid>
      </Grid>
    </Box>
  );
}