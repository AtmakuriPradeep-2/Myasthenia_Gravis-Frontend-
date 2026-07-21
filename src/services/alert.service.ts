import api from "../api/axios";
import type { Alert, AlertUpdate } from "../types/alert";

class AlertService {
  async getAlerts(): Promise<Alert[]> {
    const response = await api.get<Alert[]>("/alerts");
    return response.data;
  }

  async getOpenAlerts(): Promise<Alert[]> {
    const response = await api.get<Alert[]>("/alerts/open");
    return response.data;
  }

  async getAlertById(id: number): Promise<Alert> {
    const response = await api.get<Alert>(`/alerts/${id}`);
    return response.data;
  }

  async updateAlert(id: number, data: AlertUpdate): Promise<Alert> {
    const response = await api.patch<Alert>(`/alerts/${id}`, data);
    return response.data;
  }
}

export default new AlertService();
