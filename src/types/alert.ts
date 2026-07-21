export interface Alert {
  id: number;
  patient_id: number;
  prediction_id: number;
  probability: number;
  severity: string;
  status: string;
  reviewed_by?: string | null;
  review_notes?: string | null;
  reviewed_at?: string | null;
  closed_at?: string | null;
  created_at: string;
}

export interface AlertUpdate {
  status: string;
  reviewed_by?: string;
  review_notes?: string;
}