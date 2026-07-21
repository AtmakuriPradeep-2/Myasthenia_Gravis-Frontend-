import api from "../api/axios";
import type { Intervention, CreateIntervention } from "../types/intervention";

class InterventionService {
  async getInterventions(): Promise<Intervention[]> {
    const response = await api.get<Intervention[]>("/interventions");
    return response.data;
  }

  async getPatientInterventions(patientId: number): Promise<Intervention[]> {
    const response = await api.get<Intervention[]>(`/interventions/patient/${patientId}`);
    return response.data;
  }

  async getInterventionById(id: number): Promise<Intervention> {
    const response = await api.get<Intervention>(`/interventions/${id}`);
    return response.data;
  }

  async createIntervention(data: CreateIntervention): Promise<Intervention> {
    const response = await api.post<Intervention>("/interventions", data);
    return response.data;
  }
}

export default new InterventionService();
