import api from "../api/axios";
import type { Prediction } from "../types/prediction";

class PredictionService {
  async getAllPredictions(): Promise<Prediction[]> {
    const response = await api.get<Prediction[]>("/predictions");
    return response.data;
  }

  async getPatientPredictions(patientId: number): Promise<Prediction[]> {
    const response = await api.get<Prediction[]>(`/predictions/patient/${patientId}`);
    return response.data;
  }

  async generatePrediction(patientId: number): Promise<Prediction> {
    const response = await api.post<Prediction>(`/predictions/${patientId}`);
    return response.data;
  }
}

export default new PredictionService();
