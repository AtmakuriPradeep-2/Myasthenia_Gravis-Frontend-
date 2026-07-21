export interface Intervention {
  id: number;
  alert_id: number;
  patient_id: number;
  clinician: string;
  intervention_type: string;
  notes?: string | null;
  follow_up_date: string;
  created_at: string;
}

export interface CreateIntervention {
  alert_id: number;
  patient_id: number;
  clinician: string;
  intervention_type: string;
  notes?: string;
  follow_up_date: string;
}