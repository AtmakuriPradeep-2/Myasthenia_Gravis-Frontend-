import api from "../api/axios";
import type { Assessment, CreateAssessment } from "../types/assessment";

class AssessmentService {
  async getAllAssessments(): Promise<Assessment[]> {
    const response = await api.get<Assessment[]>("/assessments");
    return response.data;
  }

  async getPatientAssessments(patientId: number): Promise<Assessment[]> {
    const response = await api.get<Assessment[]>(`/assessments/patient/${patientId}`);
    return response.data;
  }

  async createAssessment(data: CreateAssessment): Promise<Assessment> {
    const response = await api.post<Assessment>("/assessments", data);
    return response.data;
  }
}

export default new AssessmentService();
