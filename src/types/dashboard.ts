export interface DashboardSummary {
  total_patients: number;
  total_assessments: number;
  total_predictions: number;
  total_alerts: number;
  open_alerts: number;
  reviewed_alerts: number;
  closed_alerts: number;
  total_interventions: number;
}

export interface PredictionTrend {
  date: string;
  predictions: number;
  average_probability: number;
}

export interface RiskDistribution {
  low: number;
  moderate: number;
  high: number;
}

export interface RecentPrediction {
  id: string;
  patient_id: number;
  patient_code: string;
  patient_name: string;
  risk_level: string;
  probability: number;
  created_at: string;
}

export interface AIInsight {
  high_risk_count?: number;
  trend_percentage?: number;
  recommendations_count?: number;
  summary?: string;
}

export interface ModelPerformance {
  accuracy: number;
  auc_roc: number;
  precision: number;
  f1_score: number;
  model_name: string;
}

export interface PatientStatistics {
  total_patients: number;
  average_age: number;
  male: number;
  female: number;
  mgfa_class_I: number;
  mgfa_class_II: number;
  mgfa_class_III: number;
  mgfa_class_IV: number;
  mgfa_class_V: number;
}

export interface AlertStatistics {
  total_alerts: number;
  open_alerts: number;
  reviewed_alerts: number;
  closed_alerts: number;
}

export interface InterventionStatistics {
  total_interventions: number;
  medication_adjustment: number;
  ivig: number;
  plasma_exchange: number;
  hospitalization: number;
}