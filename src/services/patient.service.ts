import api from "../api/axios";
import type { Patient, CreatePatient, UpdatePatientRequest } from "../types/patient";

class PatientService {
  async getPatients(): Promise<Patient[]> {
    const response = await api.get<Patient[]>("/patients");
    return response.data;
  }

  async getPatientById(id: number): Promise<Patient> {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  }

  async createPatient(data: CreatePatient): Promise<Patient> {
    const response = await api.post<Patient>("/patients", data);
    return response.data;
  }

  async updatePatient(id: number, data: UpdatePatientRequest): Promise<Patient> {
    const response = await api.put<Patient>(`/patients/${id}`, data);
    return response.data;
  }

  async deletePatient(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/patients/${id}`);
    return response.data;
  }
}

export default new PatientService();