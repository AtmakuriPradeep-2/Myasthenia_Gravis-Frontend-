export interface Assessment {
  id: number;
  patient_id: number;
  qmg_score: number;
  mgc_score: number;
  cfq_total: number;
  treatment_change: number; // 0 or 1
  infection_event: number; // 0 or 1
  observation_date: string;
}

export interface CreateAssessment {
  patient_id: number;
  qmg_score: number;
  mgc_score: number;
  cfq_total: number;
  treatment_change: number;
  infection_event: number;
}
