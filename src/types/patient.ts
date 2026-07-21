export interface Patient {
  id: number;
  patient_code: string;
  age: number;
  sex: string;
  mgfa_class: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePatient {
  patient_code: string;
  age: number;
  sex: string;
  mgfa_class: string;
}

export type CreatePatientRequest = CreatePatient;

export interface UpdatePatientRequest {
  patient_code?: string;
  age?: number;
  sex?: string;
  mgfa_class?: string;
}