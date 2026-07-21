export interface Prediction {
  id: number;
  patient_id: number;
  probability: number;
  threshold?: number;
  predicted_event?: number;
  risk_category?: string;
  model_name?: string;
  model_version?: string;
  created_at: string;
}