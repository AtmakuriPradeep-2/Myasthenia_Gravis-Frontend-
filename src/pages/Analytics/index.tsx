import { useState, useMemo } from "react";
import { Box, Grid, Alert } from "@mui/material";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import DateRangeSelector, { type DatePreset } from "../../components/analytics/DateRangeSelector";
import AnalyticsSummaryCards from "../../components/analytics/AnalyticsSummaryCards";
import RiskTrendTimeline from "../../components/analytics/RiskTrendTimeline";
import RiskDistributionBreakdown from "../../components/analytics/RiskDistributionBreakdown";
import ScoreCorrelationChart from "../../components/analytics/ScoreCorrelationChart";
import AnalyticsTable, { type RecordRow } from "../../components/analytics/AnalyticsTable";

import { usePredictions } from "../../hooks/usePredictions";
import { useAssessments } from "../../hooks/useAssessments";
import { usePatients } from "../../hooks/usePatients";

import type { Patient } from "../../types/patient";
import type { Prediction } from "../../types/prediction";
import type { Assessment } from "../../types/assessment";

export default function AnalyticsPage() {
  // Preset State (Default to Last 30 Days)
  const [preset, setPreset] = useState<DatePreset>("30d");
  const [startDate, setStartDate] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Fetch Data Hooks
  const { data: predictionsData, isLoading: isPredictionsLoading, isError } = usePredictions();
  const { data: assessmentsData, isLoading: isAssessmentsLoading } = useAssessments();
  const { data: patientsData } = usePatients();

  const rawPredictions: Prediction[] = predictionsData ?? [];
  const rawAssessments: Assessment[] = assessmentsData ?? [];
  const rawPatients: Patient[] = patientsData ?? [];

  // Preset Handler
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

  // Filter Predictions by Selected Date Range
  const filteredPredictions = useMemo(() => {
    if (!startDate || !endDate) return rawPredictions;

    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");

    return rawPredictions.filter((item) => {
      const itemDate = dayjs(item.created_at);
      return (itemDate.isAfter(start) || itemDate.isSame(start)) && (itemDate.isBefore(end) || itemDate.isSame(end));
    });
  }, [rawPredictions, startDate, endDate]);

  // Filter Assessments by Selected Date Range
  const filteredAssessments = useMemo(() => {
    if (!startDate || !endDate) return rawAssessments;

    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");

    return rawAssessments.filter((item) => {
      const itemDate = dayjs(item.observation_date);
      return (itemDate.isAfter(start) || itemDate.isSame(start)) && (itemDate.isBefore(end) || itemDate.isSame(end));
    });
  }, [rawAssessments, startDate, endDate]);

  // Calculated Metrics for Selected Period
  const totalPreds = filteredPredictions.length;
  const highRiskCount = filteredPredictions.filter((p) => (p.risk_category || "").toLowerCase() === "high").length;
  const moderateRiskCount = filteredPredictions.filter((p) => (p.risk_category || "").toLowerCase() === "moderate").length;
  const lowRiskCount = filteredPredictions.filter((p) => (p.risk_category || "").toLowerCase() === "low").length;

  const highRiskPercentage = totalPreds > 0 ? (highRiskCount / totalPreds) * 100 : 0;
  const meanRiskProbability =
    totalPreds > 0
      ? filteredPredictions.reduce((acc, p) => acc + (p.probability ?? 0), 0) / totalPreds
      : 0;

  const treatmentChangesCount = filteredAssessments.filter((a) => a.treatment_change === 1).length;

  // Formatted Combined Records for Table
  const combinedRecords: RecordRow[] = useMemo(() => {
    return filteredPredictions.map((p) => {
      // Find matching assessment score if available
      const matchingAssessment = filteredAssessments.find((a) => a.patient_id === p.patient_id);
      return {
        id: p.id,
        patient_id: p.patient_id,
        created_at: p.created_at,
        probability: p.probability ?? 0,
        risk_category: p.risk_category || "Low",
        qmg_score: matchingAssessment?.qmg_score,
        mgc_score: matchingAssessment?.mgc_score,
      };
    });
  }, [filteredPredictions, filteredAssessments]);

  // Date Range Label String
  const dateRangeLabel = useMemo(() => {
    if (preset === "all") return "All Time Observations";
    return `${dayjs(startDate).format("MMM D, YYYY")} - ${dayjs(endDate).format("MMM D, YYYY")}`;
  }, [preset, startDate, endDate]);

  // Export CSV Action
  const handleExportCSV = () => {
    if (combinedRecords.length === 0) {
      toast.error("No analysis data available to export for this date range.");
      return;
    }

    const headers = ["Prediction ID", "Patient ID", "Date", "Risk Level", "Exacerbation Probability (%)", "QMG Score", "MGC Score"];
    const rows = combinedRecords.map((r) => {
      const patient = rawPatients.find((p) => p.id === r.patient_id);
      return [
        r.id,
        patient?.patient_code ?? r.patient_id,
        dayjs(r.created_at).format("YYYY-MM-DD HH:mm"),
        r.risk_category,
        (r.probability * 100).toFixed(1),
        r.qmg_score ?? "N/A",
        r.mgc_score ?? "N/A",
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Risk_Trend_Analysis_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Analysis report CSV exported successfully!");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Hero Header */}
      <AnalyticsHeader
        dateRangeLabel={dateRangeLabel}
        onExportCSV={handleExportCSV}
      />

      {/* Date Range Selector */}
      <DateRangeSelector
        preset={preset}
        startDate={startDate}
        endDate={endDate}
        onSelectPreset={handleSelectPreset}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Error Notice */}
      {isError && (
        <Alert severity="error" sx={{ borderRadius: 3, fontWeight: 600, mb: 1 }}>
          Unable to fetch analytical predictions. Please verify backend API connection.
        </Alert>
      )}

      {/* Summary Metrics Cards for Period */}
      <AnalyticsSummaryCards
        highRiskPercentage={highRiskPercentage}
        meanRiskProbability={meanRiskProbability}
        totalAssessments={filteredAssessments.length}
        treatmentChangesCount={treatmentChangesCount}
      />

      {/* Charts Row: Risk Trend Timeline & Risk Stratification Donut */}
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RiskTrendTimeline data={filteredPredictions} />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <RiskDistributionBreakdown
            lowCount={lowRiskCount}
            moderateCount={moderateRiskCount}
            highCount={highRiskCount}
          />
        </Grid>
      </Grid>

      {/* Score Correlation Bar Chart */}
      <ScoreCorrelationChart assessments={filteredAssessments} />

      {/* Analytical Table */}
      <AnalyticsTable
        records={combinedRecords}
        patients={rawPatients}
        isLoading={isPredictionsLoading || isAssessmentsLoading}
      />
    </Box>
  );
}
