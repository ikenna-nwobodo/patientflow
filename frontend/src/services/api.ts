import axios from "axios";
import type { Patient, Stats, PatientFormData } from "../types/patient";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const patientApi = {
  getAllPatients: async (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status) {
      params.append("status", status);
    }
    if (search) {
      params.append("search", search);
    }

    const response = await api.get<{ data: Patient[] }>(`/patients?${params}`);

    return response.data.data;
  },

  getPatientById: async (id: string) => {
    const response = await api.get<{ data: Patient }>(`/patients/${id}`);
    return response.data.data;
  },

  createPatient: async (data: PatientFormData) => {
    const response = await api.post<{ data: Patient }>(`/patients`, data);
    return response.data.data;
  },

  updatePatient: async (id: string, data: Partial<PatientFormData>) => {
    const response = await api.put<{ data: Patient }>(`/patients/${id}`, data);
    return response.data.data;
  },

  deletePatient: async (id: string) => {
    await api.delete(`/patients/${id}`);
  },

  predictDischarge: async (id: string) => {
    const response = await api.post<{ data: Patient }>(
      `/patients/${id}/predict`
    );
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get<{ data: Stats }>("/stats");
    return response.data.data;
  },
};

export default patientApi;
