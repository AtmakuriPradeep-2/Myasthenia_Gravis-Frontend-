import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboard.service";

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => dashboardService.getSummary(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

export const usePredictionTrends = () =>
  useQuery({
    queryKey: ["prediction-trends"],
    queryFn: () => dashboardService.getPredictionTrends(),
    staleTime: 1000 * 60 * 5,
  });

export const useRiskDistribution = () =>
  useQuery({
    queryKey: ["risk-distribution"],
    queryFn: () => dashboardService.getRiskDistribution(),
    staleTime: 1000 * 60 * 5,
  });

export const useRecentPredictions = () =>
  useQuery({
    queryKey: ["recent-predictions"],
    queryFn: () => dashboardService.getRecentPredictions(),
    staleTime: 1000 * 60 * 2,
  });

export const useAIInsights = () =>
  useQuery({
    queryKey: ["ai-insights"],
    queryFn: () => dashboardService.getAIInsights(),
    staleTime: 1000 * 60 * 5,
  });

export const useModelPerformance = () =>
  useQuery({
    queryKey: ["model-performance"],
    queryFn: () => dashboardService.getModelPerformance(),
    staleTime: 1000 * 60 * 10,
  });

export const usePatientStatistics = () =>
  useQuery({
    queryKey: ["patient-statistics"],
    queryFn: () => dashboardService.getPatientStatistics(),
    staleTime: 1000 * 60 * 5,
  });

export const useAlertStatistics = () =>
  useQuery({
    queryKey: ["alert-statistics"],
    queryFn: () => dashboardService.getAlertStatistics(),
    staleTime: 1000 * 60 * 5,
  });

export const useInterventionStatistics = () =>
  useQuery({
    queryKey: ["intervention-statistics"],
    queryFn: () => dashboardService.getInterventionStatistics(),
    staleTime: 1000 * 60 * 5,
  });