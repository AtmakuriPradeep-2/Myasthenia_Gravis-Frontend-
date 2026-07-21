import api from "../api/axios";

import type {
  DashboardSummary,
  RiskDistribution,
  PredictionTrend,
  RecentPrediction,
  AIInsight,
  ModelPerformance,
  AlertStatistics,
  InterventionStatistics,
  PatientStatistics,
} from "../types/dashboard";

class DashboardService {
  /* ===========================
     Summary Cards
  =========================== */

  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get("/dashboard/summary");
    return data;
  }

  /* ===========================
     Charts
  =========================== */

  async getPredictionTrends(): Promise<PredictionTrend[]> {
    const { data } = await api.get("/dashboard/prediction-trends");
    return data;
  }

  async getRiskDistribution(): Promise<RiskDistribution> {
    const { data } = await api.get("/dashboard/risk-distribution");
    return data;
  }

  /* ===========================
     Dashboard Widgets
  =========================== */

  async getRecentPredictions(): Promise<RecentPrediction[]> {
    const { data } = await api.get("/dashboard/recent-predictions");
    return data;
  }

  async getAIInsights(): Promise<AIInsight> {
    const { data } = await api.get("/dashboard/ai-insights");
    return data;
  }

  async getModelPerformance(): Promise<ModelPerformance> {
    const { data } = await api.get("/dashboard/model-performance");
    return data;
  }

  /* ===========================
     Statistics
  =========================== */

  async getPatientStatistics(): Promise<PatientStatistics> {
    const { data } = await api.get("/dashboard/patient-statistics");
    return data;
  }

  async getAlertStatistics(): Promise<AlertStatistics> {
    const { data } = await api.get("/dashboard/alert-statistics");
    return data;
  }

  async getInterventionStatistics(): Promise<InterventionStatistics> {
    const { data } = await api.get("/dashboard/intervention-statistics");
    return data;
  }
}

export default new DashboardService();